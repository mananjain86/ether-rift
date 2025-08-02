// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EtherRiftCore.sol";

/**
 * @title Trading Functions
 * @dev Contract that handles all trading operations for the EtherRift platform
 * This contract consolidates all trading functions from different dimensions
 */
contract TradingFunctions {
    
    // ============ State Variables ============
    EtherRiftCore public coreContract;
    
    // ============ Events ============
    event Buy(address indexed user, address token, uint256 amount, uint256 cost);
    event Sell(address indexed user, address token, uint256 amount, uint256 proceeds);
    event Stake(address indexed user, address token, uint256 amount);
    event Unstake(address indexed user, address token, uint256 amount);
    event Lend(address indexed user, address token, uint256 amount);
    event Borrow(address indexed user, address token, uint256 amount, uint256 collateralValue);
    event Swap(address indexed user, address fromToken, address toToken, uint256 fromAmount, uint256 toAmount);
    event Repay(address indexed user, address token, uint256 amount);
    event FlashLoan(address indexed user, address token, uint256 amount, uint256 fee);
    
    // ============ Modifiers ============
    modifier onlyCore() {
        require(msg.sender == address(coreContract), "Only core contract can call");
        _;
    }
    
    modifier validToken(address _token) {
        require(coreContract.isTokenSupported(_token), "Token not supported");
        _;
    }
    
    // ============ Constructor ============
    constructor(address _coreContract) {
        coreContract = EtherRiftCore(_coreContract);
    }
    
    // ============ Trading Functions ============
    
    /**
     * @notice Buy tokens with USDC
     * @param _token The token to buy
     * @param _amount The amount to buy
     */
    function buy(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Calculate cost in USDC
        uint256 cost = _calculateBuyCost(_token, _amount);
        
        // Check if user has enough USDC
        require(coreContract.getUserBalance(msg.sender, address(2)) >= cost, "Insufficient USDC");
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, address(2), cost, false); // Decrease USDC
        coreContract.updateUserBalance(msg.sender, _token, _amount, true);   // Increase token
        
        emit Buy(msg.sender, _token, _amount, cost);
    }
    
    /**
     * @notice Sell tokens for USDC
     * @param _token The token to sell
     * @param _amount The amount to sell
     */
    function sell(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Check if user has enough tokens
        require(coreContract.getUserBalance(msg.sender, _token) >= _amount, "Insufficient tokens");
        
        // Calculate proceeds in USDC
        uint256 proceeds = _calculateSellProceeds(_token, _amount);
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, _token, _amount, false);    // Decrease token
        coreContract.updateUserBalance(msg.sender, address(2), proceeds, true); // Increase USDC
        
        emit Sell(msg.sender, _token, _amount, proceeds);
    }
    
    /**
     * @notice Stake tokens for rewards
     * @param _token The token to stake
     * @param _amount The amount to stake
     */
    function stake(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Check if user has enough tokens
        require(coreContract.getUserBalance(msg.sender, _token) >= _amount, "Insufficient tokens");
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, _token, _amount, false); // Decrease available balance
        coreContract.updateUserStaked(msg.sender, _token, _amount, true);   // Increase staked amount
        
        emit Stake(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Unstake tokens
     * @param _token The token to unstake
     * @param _amount The amount to unstake
     */
    function unstake(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Check if user has enough staked tokens
        require(coreContract.getUserStaked(msg.sender, _token) >= _amount, "Insufficient staked tokens");
        
        // Update balances
        coreContract.updateUserStaked(msg.sender, _token, _amount, false); // Decrease staked amount
        coreContract.updateUserBalance(msg.sender, _token, _amount, true);  // Increase available balance
        
        emit Unstake(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Lend tokens to earn interest
     * @param _token The token to lend
     * @param _amount The amount to lend
     */
    function lend(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Check if user has enough tokens
        require(coreContract.getUserBalance(msg.sender, _token) >= _amount, "Insufficient tokens");
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, _token, _amount, false); // Decrease available balance
        // Lending is tracked as staked for simplicity in this simulation
        
        emit Lend(msg.sender, _token, _amount);
    }
    
    /**
     * @notice Borrow tokens against collateral (including achievement tokens)
     * @param _token The token to borrow
     * @param _amount The amount to borrow
     * @param _collateralToken The collateral token
     * @param _collateralAmount The collateral amount
     */
    function borrow(
        address _token, 
        uint256 _amount, 
        address _collateralToken, 
        uint256 _collateralAmount
    ) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_collateralAmount > 0, "Collateral amount must be greater than 0");
        
        // Check if collateral is achievement token or regular token
        bool isAchievementToken = _collateralToken == address(coreContract.achievementToken());
        
        // If it's a regular token, validate it
        if (!isAchievementToken) {
            require(coreContract.isTokenSupported(_collateralToken), "Token not supported");
        }
        
        // Check if user has enough collateral
        require(isAchievementToken ? 
            coreContract.achievementToken().balanceOf(msg.sender) >= _collateralAmount :
            coreContract.getUserBalance(msg.sender, _collateralToken) >= _collateralAmount, 
            "Insufficient collateral");
        
        // Calculate collateral value
        uint256 collateralValue;
        if (isAchievementToken) {
            // Achievement tokens have a fixed value of 1 USD each for collateral purposes
            collateralValue = _collateralAmount;
        } else {
            collateralValue = coreContract.getTokenValue(_collateralToken, _collateralAmount);
        }
        
        uint256 borrowValue = coreContract.getTokenValue(_token, _amount);
        
        // Check collateralization ratio (150%)
        require(collateralValue >= (borrowValue * 150) / 100, "Insufficient collateralization");
        
        // Update balances
        if (isAchievementToken) {
            // Transfer achievement tokens to contract as collateral
            coreContract.achievementToken().transferFrom(msg.sender, address(this), _collateralAmount);
            coreContract.updateUserCollateral(msg.sender, _collateralToken, _collateralAmount, true); // Track collateral
        } else {
            coreContract.updateUserBalance(msg.sender, _collateralToken, _collateralAmount, false); // Decrease collateral
            coreContract.updateUserCollateral(msg.sender, _collateralToken, _collateralAmount, true); // Increase collateral tracking
        }
        
        coreContract.updateUserBalance(msg.sender, _token, _amount, true); // Increase borrowed tokens
        coreContract.updateUserDebt(msg.sender, _token, _amount, true); // Increase debt tracking
        
        emit Borrow(msg.sender, _token, _amount, collateralValue);
    }
    
    /**
     * @notice Swap tokens
     * @param _fromToken The token to swap from
     * @param _toToken The token to swap to
     * @param _amount The amount to swap
     */
    function swap(address _fromToken, address _toToken, uint256 _amount) external validToken(_fromToken) validToken(_toToken) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_fromToken != _toToken, "Cannot swap same token");
        
        // Check if user has enough tokens
        require(coreContract.getUserBalance(msg.sender, _fromToken) >= _amount, "Insufficient tokens");
        
        // Calculate swap amount based on token prices
        uint256 fromValue = coreContract.getTokenValue(_fromToken, _amount);
        uint256 toAmount = (fromValue * (10**18)) / coreContract.getTokenPrice(_toToken);
        
        // Apply slippage (0.3% for simplicity)
        toAmount = (toAmount * 997) / 1000;
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, _fromToken, _amount, false); // Decrease from token
        coreContract.updateUserBalance(msg.sender, _toToken, toAmount, true);   // Increase to token
        
        emit Swap(msg.sender, _fromToken, _toToken, _amount, toAmount);
    }
    
    /**
     * @notice Repay borrowed tokens
     * @param _token The token to repay
     * @param _amount The amount to repay
     */
    function repay(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Check if user has enough tokens to repay
        require(coreContract.getUserBalance(msg.sender, _token) >= _amount, "Insufficient tokens to repay");
        
        // Check if user has debt to repay
        uint256 debt = coreContract.getUserDebt(msg.sender, _token);
        require(debt > 0, "No debt to repay");
        
        // Cap repayment at the debt amount
        uint256 repayAmount = _amount > debt ? debt : _amount;
        
        // Update balances
        coreContract.updateUserBalance(msg.sender, _token, repayAmount, false); // Decrease tokens
        coreContract.updateUserDebt(msg.sender, _token, repayAmount, false);    // Decrease debt
        
        emit Repay(msg.sender, _token, repayAmount);
    }
    
    /**
     * @notice Execute a flash loan
     * @param _token The token to borrow
     * @param _amount The amount to borrow
     */
    function flashLoan(address _token, uint256 _amount) external validToken(_token) {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Calculate flash loan fee (0.1%)
        uint256 fee = (_amount * 1) / 1000;
        uint256 totalRepay = _amount + fee;
        
        // Check if user has enough tokens to repay the flash loan
        require(coreContract.getUserBalance(msg.sender, _token) >= totalRepay, "Insufficient tokens to repay flash loan");
        
        // Temporarily give user the borrowed amount
        coreContract.updateUserBalance(msg.sender, _token, _amount, true);
        
        // In a real implementation, this would call a callback function
        // For simulation, we immediately deduct the repayment
        coreContract.updateUserBalance(msg.sender, _token, totalRepay, false);
        
        emit FlashLoan(msg.sender, _token, _amount, fee);
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Calculate the cost to buy tokens in USDC
     * @param _token The token to buy
     * @param _amount The amount to buy
     * @return The cost in USDC
     */
    function _calculateBuyCost(address _token, uint256 _amount) internal view returns (uint256) {
        uint256 tokenValue = coreContract.getTokenValue(_token, _amount);
        // Add 0.3% fee
        return (tokenValue * 1003) / 1000;
    }
    
    /**
     * @dev Calculate the proceeds from selling tokens in USDC
     * @param _token The token to sell
     * @param _amount The amount to sell
     * @return The proceeds in USDC
     */
    function _calculateSellProceeds(address _token, uint256 _amount) internal view returns (uint256) {
        uint256 tokenValue = coreContract.getTokenValue(_token, _amount);
        // Subtract 0.3% fee
        return (tokenValue * 997) / 1000;
    }
}