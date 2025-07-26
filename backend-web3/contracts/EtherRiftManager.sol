// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AchievementToken.sol";

/**
 * @title EtherRift Manager
 * @author EtherRift Team
 * @notice Central contract for the EtherRift educational platform
 * @dev Manages user registration, progress tracking, and DeFi simulations
 */
contract EtherRiftManager is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    // ============ Constants ============
    uint256 public constant COLLATERALIZATION_RATIO = 150; // 150% collateralization required
    uint256 public constant LIQUIDATION_THRESHOLD = 120; // 120% liquidation threshold
    uint256 public constant LIQUIDATION_PENALTY = 10; // 10% liquidation penalty
    uint256 public constant FLASH_LOAN_FEE = 9; // 0.09% flash loan fee (9 basis points)
    
    // ============ Type Definitions ============
    enum Dimension { STABLE, VOLATILE, ARBITRAGE }
    
    struct Player {
        bool isRegistered;
        uint256 dimensionsUnlocked;
        uint256 lastTradeTimestamp;
        uint256 tradesCompleted;
    }
    
    // ============ State Variables ============
    AchievementToken public achievementToken;
    
    // Player registry
    mapping(address => Player) public players;
    
    // Simulation Logic (For all Dimensions)
    mapping(address => mapping(uint256 => int256)) public tradeHistory; // player => tradeId => pnl
    
    // Live Protocol Logic (For Volatile & Arbitrage Dimensions)
    mapping(address => mapping(address => uint256)) public userAssetBalances; // Tracks user's internal balances
    mapping(address => mapping(address => uint256)) public userCollateral; // Tracks user's deposited collateral
    mapping(address => mapping(address => uint256)) public userDebt; // Tracks user's outstanding debt
    
    // Protocol configuration
    mapping(address => bool) public supportedTokens; // Tokens supported by the protocol
    mapping(address => uint256) public tokenPrices; // Mock prices for supported tokens
    
    // Flash loan tracking
    mapping(address => uint256) public flashLoanBalances; // Tracks active flash loans
    
    // ============ Events ============
    event PlayerRegistered(address indexed player, uint256 timestamp);
    event TradeRecorded(address indexed player, uint256 dimensionId, int256 pnl, uint256 timestamp);
    event AchievementUnlocked(address indexed player, uint256 indexed achievementId, uint256 amount, uint256 timestamp);
    
    // Live protocol events
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);
    event CollateralDeposited(address indexed user, address indexed token, uint256 amount);
    event CollateralWithdrawn(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, address indexed debtAsset, uint256 borrowAmount, address indexed collateralAsset);
    event Repaid(address indexed user, address indexed debtAsset, uint256 repayAmount);
    event Swapped(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event FlashLoan(address indexed user, address indexed token, uint256 amount, uint256 fee);
    event Liquidated(address indexed user, address indexed liquidator, address indexed collateralAsset, address debtAsset, uint256 collateralAmount, uint256 debtAmount);
    
    // ============ Modifiers ============
    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Not registered");
        _;
    }
    
    modifier dimensionUnlocked(Dimension dimension) {
        require(players[msg.sender].isRegistered, "Not registered");
        require(uint256(dimension) < players[msg.sender].dimensionsUnlocked, "Dimension locked");
        _;
    }
    
    modifier validToken(address token) {
        require(supportedTokens[token], "Token not supported");
        _;
    }
    
    // ============ Constructor ============
    /**
     * @notice Initializes the EtherRift Manager contract
     * @param _achievementTokenAddress Address of the deployed AchievementToken contract
     */
    constructor(address _achievementTokenAddress) Ownable(msg.sender) {
        achievementToken = AchievementToken(_achievementTokenAddress);
        
        // Initialize supported tokens with mock prices
        // In a real implementation, these would be fetched from oracles
        address vETH = address(0x1); // Placeholder address for vETH
        address vUSDC = address(0x2); // Placeholder address for vUSDC
        
        supportedTokens[vETH] = true;
        supportedTokens[vUSDC] = true;
        
        tokenPrices[vETH] = 1000 * 10**18; // $1000 per vETH
        tokenPrices[vUSDC] = 1 * 10**18; // $1 per vUSDC
    }
    
    // ============ Core Functions ============
    /**
     * @notice Registers a new player in the EtherRift platform
     */
    function register() external {
        require(!players[msg.sender].isRegistered, "Already registered");
        
        players[msg.sender] = Player({
            isRegistered: true,
            dimensionsUnlocked: 1, // Start with Stable dimension unlocked
            lastTradeTimestamp: 0,
            tradesCompleted: 0
        });
        
        emit PlayerRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Records a trade result from the simulation
     * @param dimensionId The dimension ID where the trade occurred
     * @param pnl The profit or loss from the trade (can be negative)
     */
    function recordTrade(uint256 dimensionId, int256 pnl) external onlyRegistered nonReentrant {
        require(dimensionId < players[msg.sender].dimensionsUnlocked, "Dimension locked");
        
        // Record the trade
        uint256 tradeId = players[msg.sender].tradesCompleted;
        tradeHistory[msg.sender][tradeId] = pnl;
        
        // Update player stats
        players[msg.sender].lastTradeTimestamp = block.timestamp;
        players[msg.sender].tradesCompleted += 1;
        
        // Emit event for the Subgraph to index
        emit TradeRecorded(msg.sender, dimensionId, pnl, block.timestamp);
        
        // Check if this trade unlocks a new dimension
        _checkDimensionUnlock(msg.sender);
    }
    
    /**
     * @notice Unlocks an achievement for a player and mints reward tokens
     * @param _player The address of the player
     * @param _achievementId The ID of the achievement
     * @param _rewardAmount The amount of tokens to reward
     */
    function unlockAchievement(address _player, uint256 _achievementId, uint256 _rewardAmount) external onlyOwner {
        require(players[_player].isRegistered, "Player not registered");
        
        // Mint achievement tokens to the player
        achievementToken.mint(_player, _rewardAmount);
        
        // Emit event for the Subgraph to index
        emit AchievementUnlocked(_player, _achievementId, _rewardAmount, block.timestamp);
    }
    
    // ============ Live Protocol Logic (For Volatile & Arbitrage Dimensions) ============
    /**
     * @notice Deposits simulated assets into the protocol
     * @param _token The token address to deposit
     * @param _amount The amount to deposit
     */
    function deposit(address _token, uint256 _amount) 
        external 
        onlyRegistered 
        validToken(_token) 
        nonReentrant 
        whenNotPaused 
    {
        // In a real implementation, this would transfer tokens from the user
        // For this educational platform, we simulate the deposit
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].add(_amount);
        
        emit Deposit(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Withdraws simulated assets from the protocol
     * @param _token The token address to withdraw
     * @param _amount The amount to withdraw
     */
    function withdraw(address _token, uint256 _amount) 
        external 
        onlyRegistered 
        validToken(_token) 
        nonReentrant 
        whenNotPaused 
    {
        require(userAssetBalances[msg.sender][_token] >= _amount, "Insufficient balance");
        
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].sub(_amount);
        
        emit Withdrawal(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Deposits collateral for borrowing
     * @param _token The token address to use as collateral
     * @param _amount The amount to deposit as collateral
     */
    function depositCollateral(address _token, uint256 _amount) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_token) 
        nonReentrant 
        whenNotPaused 
    {
        require(userAssetBalances[msg.sender][_token] >= _amount, "Insufficient balance");
        
        // Move tokens from user balance to collateral
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].sub(_amount);
        userCollateral[msg.sender][_token] = userCollateral[msg.sender][_token].add(_amount);
        
        emit CollateralDeposited(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Withdraws collateral if not needed for outstanding loans
     * @param _token The token address to withdraw from collateral
     * @param _amount The amount to withdraw
     */
    function withdrawCollateral(address _token, uint256 _amount) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_token) 
        nonReentrant 
        whenNotPaused 
    {
        require(userCollateral[msg.sender][_token] >= _amount, "Insufficient collateral");
        
        // Check if this withdrawal would make the position undercollateralized
        require(_isCollateralSufficient(msg.sender, _token, _amount), "Withdrawal would undercollateralize position");
        
        // Move tokens from collateral to user balance
        userCollateral[msg.sender][_token] = userCollateral[msg.sender][_token].sub(_amount);
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].add(_amount);
        
        emit CollateralWithdrawn(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Borrows assets against deposited collateral
     * @param _collateralAsset The asset used as collateral
     * @param _debtAsset The asset to borrow
     * @param _borrowAmount The amount to borrow
     */
    function borrow(address _collateralAsset, address _debtAsset, uint256 _borrowAmount) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_collateralAsset) 
        validToken(_debtAsset) 
        nonReentrant 
        whenNotPaused 
    {
        // Calculate the collateral value and required collateral
        uint256 collateralValue = _getCollateralValue(msg.sender, _collateralAsset);
        uint256 borrowValue = _getTokenValue(_debtAsset, _borrowAmount);
        uint256 requiredCollateralValue = borrowValue.mul(COLLATERALIZATION_RATIO).div(100);
        
        // Check if user has enough collateral
        require(collateralValue >= requiredCollateralValue, "Insufficient collateral");
        
        // Update user's debt
        userDebt[msg.sender][_debtAsset] = userDebt[msg.sender][_debtAsset].add(_borrowAmount);
        
        // Add borrowed amount to user's balance
        userAssetBalances[msg.sender][_debtAsset] = userAssetBalances[msg.sender][_debtAsset].add(_borrowAmount);
        
        emit Borrowed(msg.sender, _debtAsset, _borrowAmount, _collateralAsset);
    }
    
    /**
     * @notice Repays borrowed assets
     * @param _debtAsset The asset to repay
     * @param _repayAmount The amount to repay
     */
    function repay(address _debtAsset, uint256 _repayAmount) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_debtAsset) 
        nonReentrant 
        whenNotPaused 
    {
        require(userDebt[msg.sender][_debtAsset] >= _repayAmount, "Repay amount exceeds debt");
        require(userAssetBalances[msg.sender][_debtAsset] >= _repayAmount, "Insufficient balance");
        
        // Reduce user's debt
        userDebt[msg.sender][_debtAsset] = userDebt[msg.sender][_debtAsset].sub(_repayAmount);
        
        // Reduce user's balance
        userAssetBalances[msg.sender][_debtAsset] = userAssetBalances[msg.sender][_debtAsset].sub(_repayAmount);
        
        emit Repaid(msg.sender, _debtAsset, _repayAmount);
    }
    
    /**
     * @notice Executes a token swap
     * @param _tokenIn The token to swap from
     * @param _tokenOut The token to swap to
     * @param _amountIn The amount to swap
     * @return amountOut The amount received after the swap
     */
    function executeSwap(address _tokenIn, address _tokenOut, uint256 _amountIn) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_tokenIn) 
        validToken(_tokenOut) 
        nonReentrant 
        whenNotPaused 
        returns (uint256 amountOut) 
    {
        require(userAssetBalances[msg.sender][_tokenIn] >= _amountIn, "Insufficient balance");
        
        // Calculate the output amount based on token prices
        // In a real implementation, this would use an AMM formula or oracle prices
        uint256 valueIn = _getTokenValue(_tokenIn, _amountIn);
        amountOut = valueIn.mul(10**18).div(tokenPrices[_tokenOut]);
        
        // Update user balances
        userAssetBalances[msg.sender][_tokenIn] = userAssetBalances[msg.sender][_tokenIn].sub(_amountIn);
        userAssetBalances[msg.sender][_tokenOut] = userAssetBalances[msg.sender][_tokenOut].add(amountOut);
        
        emit Swapped(msg.sender, _tokenIn, _tokenOut, _amountIn, amountOut);
        
        return amountOut;
    }
    
    /**
     * @notice Executes a flash loan
     * @param _token The token to borrow
     * @param _amount The amount to borrow
     * @param _data Arbitrary data to pass to the receiver
     */
    function executeFlashLoan(address _token, uint256 _amount, bytes calldata _data) 
        external 
        dimensionUnlocked(Dimension.ARBITRAGE) 
        validToken(_token) 
        nonReentrant 
        whenNotPaused 
    {
        // Record the initial balance to verify repayment
        uint256 initialBalance = userAssetBalances[msg.sender][_token];
        
        // Calculate the fee
        uint256 fee = _amount.mul(FLASH_LOAN_FEE).div(10000); // 9 basis points
        uint256 repayAmount = _amount.add(fee);
        
        // Track the flash loan
        flashLoanBalances[_token] = flashLoanBalances[_token].add(_amount);
        
        // Transfer the borrowed amount to the user
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].add(_amount);
        
        // Execute the user's logic
        // In a real implementation, this would call a function on the borrower's contract
        // For this educational platform, we simulate the callback
        (bool success, ) = msg.sender.call(_data);
        require(success, "Flash loan callback failed");
        
        // Verify repayment
        require(
            userAssetBalances[msg.sender][_token] >= initialBalance.add(fee),
            "Flash loan not repaid"
        );
        
        // Deduct the repayment amount
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].sub(repayAmount);
        
        // Clear the flash loan tracking
        flashLoanBalances[_token] = flashLoanBalances[_token].sub(_amount);
        
        emit FlashLoan(msg.sender, _token, _amount, fee);
    }
    
    /**
     * @notice Liquidates an undercollateralized position
     * @param _user The user whose position is being liquidated
     * @param _debtAsset The debt asset to repay
     * @param _collateralAsset The collateral asset to receive
     * @param _debtAmount The amount of debt to repay
     */
    function liquidate(address _user, address _debtAsset, address _collateralAsset, uint256 _debtAmount) 
        external 
        dimensionUnlocked(Dimension.VOLATILE) 
        validToken(_debtAsset) 
        validToken(_collateralAsset) 
        nonReentrant 
        whenNotPaused 
    {
        require(_user != msg.sender, "Cannot liquidate own position");
        require(userDebt[_user][_debtAsset] >= _debtAmount, "Debt amount too high");
        require(userAssetBalances[msg.sender][_debtAsset] >= _debtAmount, "Insufficient balance to liquidate");
        
        // Check if the position is undercollateralized
        require(_isLiquidatable(_user, _collateralAsset, _debtAsset), "Position not liquidatable");
        
        // Calculate the collateral to seize (including the liquidation bonus)
        uint256 debtValue = _getTokenValue(_debtAsset, _debtAmount);
        uint256 collateralToSeize = debtValue.mul(100 + LIQUIDATION_PENALTY).div(100);
        collateralToSeize = collateralToSeize.mul(10**18).div(tokenPrices[_collateralAsset]);
        
        // Ensure we don't seize more than available
        require(userCollateral[_user][_collateralAsset] >= collateralToSeize, "Not enough collateral");
        
        // Update balances
        // 1. Reduce liquidator's balance of debt asset
        userAssetBalances[msg.sender][_debtAsset] = userAssetBalances[msg.sender][_debtAsset].sub(_debtAmount);
        
        // 2. Reduce borrower's debt
        userDebt[_user][_debtAsset] = userDebt[_user][_debtAsset].sub(_debtAmount);
        
        // 3. Reduce borrower's collateral
        userCollateral[_user][_collateralAsset] = userCollateral[_user][_collateralAsset].sub(collateralToSeize);
        
        // 4. Increase liquidator's balance of collateral asset
        userAssetBalances[msg.sender][_collateralAsset] = userAssetBalances[msg.sender][_collateralAsset].add(collateralToSeize);
        
        emit Liquidated(_user, msg.sender, _collateralAsset, _debtAsset, collateralToSeize, _debtAmount);
    }
    
    // ============ Admin Functions ============
    /**
     * @notice Updates the price of a token
     * @param _token The token address
     * @param _price The new price (scaled by 10^18)
     */
    function updateTokenPrice(address _token, uint256 _price) external onlyOwner {
        require(supportedTokens[_token], "Token not supported");
        tokenPrices[_token] = _price;
    }
    
    /**
     * @notice Adds a supported token
     * @param _token The token address
     * @param _initialPrice The initial price (scaled by 10^18)
     */
    function addSupportedToken(address _token, uint256 _initialPrice) external onlyOwner {
        require(!supportedTokens[_token], "Token already supported");
        supportedTokens[_token] = true;
        tokenPrices[_token] = _initialPrice;
    }
    
    /**
     * @notice Removes a supported token
     * @param _token The token address
     */
    function removeSupportedToken(address _token) external onlyOwner {
        require(supportedTokens[_token], "Token not supported");
        supportedTokens[_token] = false;
    }
    
    /**
     * @notice Unlocks a dimension for a player
     * @param _player The player's address
     * @param _dimension The dimension to unlock
     */
    function unlockDimension(address _player, Dimension _dimension) external onlyOwner {
        require(players[_player].isRegistered, "Player not registered");
        require(uint256(_dimension) <= 2, "Invalid dimension");
        
        if (players[_player].dimensionsUnlocked <= uint256(_dimension)) {
            players[_player].dimensionsUnlocked = uint256(_dimension) + 1;
        }
    }
    
    /**
     * @notice Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ Internal Functions ============
    /**
     * @dev Checks if a player has met the criteria to unlock a new dimension
     * @param _player The player's address
     */
    function _checkDimensionUnlock(address _player) internal {
        Player storage player = players[_player];
        
        // Simple logic: Unlock Volatile after 5 trades, Arbitrage after 10 trades
        if (player.tradesCompleted == 5 && player.dimensionsUnlocked == 1) {
            player.dimensionsUnlocked = 2; // Unlock Volatile
        } else if (player.tradesCompleted == 10 && player.dimensionsUnlocked == 2) {
            player.dimensionsUnlocked = 3; // Unlock Arbitrage
        }
    }
    
    /**
     * @dev Calculates the value of a token amount
     * @param _token The token address
     * @param _amount The token amount
     * @return The value in USD (scaled by 10^18)
     */
    function _getTokenValue(address _token, uint256 _amount) internal view returns (uint256) {
        return _amount.mul(tokenPrices[_token]).div(10**18);
    }
    
    /**
     * @dev Gets the total value of a user's collateral for a specific asset
     * @param _user The user's address
     * @param _collateralAsset The collateral asset
     * @return The collateral value in USD (scaled by 10^18)
     */
    function _getCollateralValue(address _user, address _collateralAsset) internal view returns (uint256) {
        return _getTokenValue(_collateralAsset, userCollateral[_user][_collateralAsset]);
    }
    
    /**
     * @dev Checks if a collateral withdrawal would leave sufficient collateral
     * @param _user The user's address
     * @param _token The collateral token
     * @param _withdrawAmount The amount to withdraw
     * @return Whether the withdrawal is safe
     */
    function _isCollateralSufficient(address _user, address _token, uint256 _withdrawAmount) internal view returns (bool) {
        uint256 totalDebtValue = 0;
        
        // Calculate total debt value across all assets
        for (uint i = 0; i < 10; i++) { // Assuming a maximum of 10 supported tokens
            address token = address(uint160(i + 1)); // Simple way to iterate through token addresses
            if (supportedTokens[token]) {
                totalDebtValue = totalDebtValue.add(_getTokenValue(token, userDebt[_user][token]));
            }
        }
        
        if (totalDebtValue == 0) return true; // No debt, withdrawal is safe
        
        // Calculate remaining collateral value after withdrawal
        uint256 withdrawValue = _getTokenValue(_token, _withdrawAmount);
        uint256 currentCollateralValue = _getCollateralValue(_user, _token);
        
        if (withdrawValue >= currentCollateralValue) return false; // Trying to withdraw more than available
        
        uint256 remainingCollateralValue = currentCollateralValue.sub(withdrawValue);
        uint256 requiredCollateralValue = totalDebtValue.mul(COLLATERALIZATION_RATIO).div(100);
        
        return remainingCollateralValue >= requiredCollateralValue;
    }
    
    /**
     * @dev Checks if a position is liquidatable
     * @param _user The user's address
     * @param _collateralAsset The collateral asset
     * @param _debtAsset The debt asset
     * @return Whether the position can be liquidated
     */
    function _isLiquidatable(address _user, address _collateralAsset, address _debtAsset) internal view returns (bool) {
        uint256 collateralValue = _getCollateralValue(_user, _collateralAsset);
        uint256 debtValue = _getTokenValue(_debtAsset, userDebt[_user][_debtAsset]);
        
        if (debtValue == 0) return false; // No debt, cannot liquidate
        
        // Calculate current health factor (collateral value / debt value * 100)
        uint256 healthFactor = collateralValue.mul(100).div(debtValue);
        
        // Position is liquidatable if health factor is below the liquidation threshold
        return healthFactor < LIQUIDATION_THRESHOLD;
    }
    
    // ============ View Functions ============
    /**
     * @notice Gets a player's health factor for a specific collateral and debt asset
     * @param _user The user's address
     * @param _collateralAsset The collateral asset
     * @param _debtAsset The debt asset
     * @return The health factor (scaled by 100, e.g., 150 = 150%)
     */
    function getHealthFactor(address _user, address _collateralAsset, address _debtAsset) 
        external 
        view 
        returns (uint256) 
    {
        uint256 collateralValue = _getCollateralValue(_user, _collateralAsset);
        uint256 debtValue = _getTokenValue(_debtAsset, userDebt[_user][_debtAsset]);
        
        if (debtValue == 0) return type(uint256).max; // No debt, health factor is infinite
        
        return collateralValue.mul(100).div(debtValue);
    }
    
    /**
     * @notice Gets the liquidation price for a user's position
     * @param _user The user's address
     * @param _collateralAsset The collateral asset
     * @param _debtAsset The debt asset
     * @return The price at which the position becomes liquidatable
     */
    function getLiquidationPrice(address _user, address _collateralAsset, address _debtAsset) 
        external 
        view 
        returns (uint256) 
    {
        uint256 collateralAmount = userCollateral[_user][_collateralAsset];
        uint256 debtAmount = userDebt[_user][_debtAsset];
        
        if (debtAmount == 0 || collateralAmount == 0) return 0; // Invalid position
        
        // Calculate the price at which health factor = liquidation threshold
        uint256 debtValue = _getTokenValue(_debtAsset, debtAmount);
        uint256 liquidationThresholdValue = debtValue.mul(LIQUIDATION_THRESHOLD).div(100);
        
        // Liquidation price = threshold value / collateral amount
        return liquidationThresholdValue.mul(10**18).div(collateralAmount);
    }
}