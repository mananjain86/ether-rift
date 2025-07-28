// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AchievementToken.sol";
import "./dimensions/StableDimension.sol";
import "./dimensions/VolatileDimension.sol";
import "./dimensions/ArbitrageDimension.sol";

/**
 * @title EtherRift Manager
 * @dev Main contract for the EtherRift game, managing player registration, dimensions, and achievements
 */
contract EtherRiftManager is Ownable, Pausable {
    using SafeMath for uint256;
    
    // ============ Constants ============
    uint256 public constant COLLATERALIZATION_RATIO = 150; // 150%
    uint256 public constant LIQUIDATION_THRESHOLD = 125; // 125%
    uint256 public constant LIQUIDATION_PENALTY = 10; // 10%
    uint256 public constant FLASH_LOAN_FEE = 1; // 0.1%
    
    // ============ Enums ============
    enum Dimension { Stable, Volatile, Arbitrage }
    
    // ============ Structs ============
    struct Player {
        bool isRegistered;
        uint256 dimensionsUnlocked;
        uint256 tradesCompleted;
    }
    
    // ============ State Variables ============
    AchievementToken public achievementToken;
    mapping(address => Player) public players;
    mapping(address => mapping(string => uint256)) public tradeHistory; // player => scenario => count
    
    // Mock token balances and prices for simulation
    mapping(address => mapping(address => uint256)) public userAssetBalances;
    mapping(address => mapping(address => uint256)) public userCollateral;
    mapping(address => mapping(address => uint256)) public userDebt;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPrices; // scaled by 10^18
    
    // Dimension contracts
    StableDimension public stableDimension;
    VolatileDimension public volatileDimension;
    ArbitrageDimension public arbitrageDimension;
    
    // ============ Events ============
    event PlayerRegistered(address indexed player);
    event TradeRecorded(address indexed player, string scenario, uint256 amount);
    event AchievementUnlocked(address indexed player, string achievement, uint256 tokenAmount);
    event DimensionUnlocked(address indexed player, Dimension dimension);
    
    // ============ Modifiers ============
    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }
    
    modifier dimensionUnlocked(Dimension _dimension) {
        require(players[msg.sender].dimensionsUnlocked > uint256(_dimension), "Dimension locked");
        _;
    }
    
    modifier validToken(address _token) {
        require(supportedTokens[_token], "Token not supported");
        _;
    }
    
    // ============ Constructor ============
    constructor(address _achievementToken) {
        achievementToken = AchievementToken(_achievementToken);
        
        // Initialize dimension contracts
        stableDimension = new StableDimension();
        volatileDimension = new VolatileDimension();
        arbitrageDimension = new ArbitrageDimension();
        
        // Add mock supported tokens
        address vETH = address(1); // Mock address
        address vUSDC = address(2); // Mock address
        
        supportedTokens[vETH] = true;
        supportedTokens[vUSDC] = true;
        
        // Set initial prices (1 ETH = $1000, 1 USDC = $1)
        tokenPrices[vETH] = 1000 * 10**18;
        tokenPrices[vUSDC] = 1 * 10**18;
    }
    
    // ============ Core Functions ============
    /**
     * @notice Registers a new player
     */
    function register() external {
        require(!players[msg.sender].isRegistered, "Already registered");
        
        players[msg.sender] = Player({
            isRegistered: true,
            dimensionsUnlocked: 1, // Start with Stable dimension unlocked
            tradesCompleted: 0
        });
        
        emit PlayerRegistered(msg.sender);
    }
    
    /**
     * @notice Records a trade from the simulation
     * @param _scenario The scenario identifier
     * @param _amount The trade amount
     */
    function recordTrade(string calldata _scenario, uint256 _amount) external onlyRegistered {
        tradeHistory[msg.sender][_scenario] += 1;
        players[msg.sender].tradesCompleted += 1;
        
        // Check if player has unlocked a new dimension
        _checkDimensionUnlock(msg.sender);
        
        emit TradeRecorded(msg.sender, _scenario, _amount);
    }
    
    /**
     * @notice Unlocks an achievement and mints reward tokens
     * @param _player The player's address
     * @param _achievement The achievement identifier
     * @param _tokenAmount The amount of tokens to mint
     */
    function unlockAchievement(address _player, string calldata _achievement, uint256 _tokenAmount) 
        external 
        onlyOwner 
    {
        require(players[_player].isRegistered, "Player not registered");
        
        // Mint achievement tokens to the player
        achievementToken.mint(_player, _tokenAmount);
        
        emit AchievementUnlocked(_player, _achievement, _tokenAmount);
    }
    
    // ============ Simulation Functions ============
    /**
     * @notice Simulates depositing an asset
     * @param _token The token address
     * @param _amount The amount to deposit
     */
    function deposit(address _token, uint256 _amount) 
        external 
        onlyRegistered 
        validToken(_token) 
        whenNotPaused 
    {
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].add(_amount);
    }
    
    /**
     * @notice Simulates withdrawing an asset
     * @param _token The token address
     * @param _amount The amount to withdraw
     */
    function withdraw(address _token, uint256 _amount) 
        external 
        onlyRegistered 
        validToken(_token) 
        whenNotPaused 
    {
        require(userAssetBalances[msg.sender][_token] >= _amount, "Insufficient balance");
        userAssetBalances[msg.sender][_token] = userAssetBalances[msg.sender][_token].sub(_amount);
    }
    
    // ============ Dimension-specific Functions ============
    /**
     * @notice Delegates calls to the appropriate dimension contract
     */
    function callStableDimension(bytes calldata _data) external onlyRegistered dimensionUnlocked(Dimension.Stable) returns (bytes memory) {
        return address(stableDimension).delegatecall(_data);
    }
    
    function callVolatileDimension(bytes calldata _data) external onlyRegistered dimensionUnlocked(Dimension.Volatile) returns (bytes memory) {
        return address(volatileDimension).delegatecall(_data);
    }
    
    function callArbitrageDimension(bytes calldata _data) external onlyRegistered dimensionUnlocked(Dimension.Arbitrage) returns (bytes memory) {
        return address(arbitrageDimension).delegatecall(_data);
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
            emit DimensionUnlocked(_player, _dimension);
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
            emit DimensionUnlocked(_player, Dimension.Volatile);
        } else if (player.tradesCompleted == 10 && player.dimensionsUnlocked == 2) {
            player.dimensionsUnlocked = 3; // Unlock Arbitrage
            emit DimensionUnlocked(_player, Dimension.Arbitrage);
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
}