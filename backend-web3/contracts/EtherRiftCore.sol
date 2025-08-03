// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./AchievementToken.sol";

/**
 * @title EtherRift Core
 * @dev Core contract for the EtherRift game that handles user registration, 
 * achievement token minting, and trade recording
 */
contract EtherRiftCore is Ownable, Pausable {
    
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
        uint256 tradesCompleted;
        uint256 totalVolume;
        mapping(string => uint256) tradeHistory; // scenario => count
    }
    
    // ============ State Variables ============
    AchievementToken public achievementToken;
    address public tradingFunctions;
    mapping(address => Player) public players;
    
    // Mock token balances and prices for simulation
    mapping(address => mapping(address => uint256)) public userAssetBalances;
    mapping(address => mapping(address => uint256)) public userCollateral;
    mapping(address => mapping(address => uint256)) public userDebt;
    mapping(address => mapping(address => uint256)) public userStaked; // For staking
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenPrices; // scaled by 10^18
    
    // ============ Events ============
    event PlayerRegistered(address indexed player);
    event TradeRecorded(address indexed player, string scenario, uint256 amount);
    event AchievementUnlocked(address indexed player, string achievement, uint256 tokenAmount);
    
    // ============ Modifiers ============
    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }
        
    modifier validToken(address _token) {
        require(supportedTokens[_token], "Token not supported");
        _;
    }
    
    modifier onlyTradingFunctions() {
        require(msg.sender == tradingFunctions, "Only trading functions can call");
        _;
    }
    
    // ============ Constructor ============
    constructor(address _achievementToken) Ownable(msg.sender) Pausable() {
        achievementToken = AchievementToken(_achievementToken);
        tradingFunctions = address(0);
        
        // Add mock supported tokens
        address vETH = address(1); // Mock address
        address vUSDC = address(2); // Mock address
        address vDAI = address(3); // Mock address
        
        supportedTokens[vETH] = true;
        supportedTokens[vUSDC] = true;
        supportedTokens[vDAI] = true;
        
        // Set initial prices (1 ETH = $1000, 1 USDC = $1, 1 DAI = $1)
        tokenPrices[vETH] = 1000 * 10**18;
        tokenPrices[vUSDC] = 1 * 10**18;
        tokenPrices[vDAI] = 1 * 10**18;
    }
    
    // ============ Core Functions ============
    /**
     * @notice Registers a new player and initializes their balances
     */
    function register() external {
        require(!players[msg.sender].isRegistered, "Already registered");
        
        players[msg.sender].isRegistered = true;
        players[msg.sender].tradesCompleted = 0;
        players[msg.sender].totalVolume = 0;
        
        // Initialize user balances
        address vETH = address(1);
        address vUSDC = address(2);
        address vDAI = address(3);
        
        // Set initial balances: 100 vETH, 0 vUSDC, 0 vDAI
        userAssetBalances[msg.sender][vETH] = 100 * 10**18; // 100 vETH
        userAssetBalances[msg.sender][vUSDC] = 0; // 0 vUSDC
        userAssetBalances[msg.sender][vDAI] = 0; // 0 vDAI
        
        emit PlayerRegistered(msg.sender);
    }
    
    /**
     * @notice Records a trade from the simulation
     * @param _scenario The scenario identifier
     * @param _amount The trade amount
     */
    function recordTrade(string calldata _scenario, uint256 _amount) external onlyRegistered {
        players[msg.sender].tradeHistory[_scenario] += 1;
        players[msg.sender].tradesCompleted += 1;
        players[msg.sender].totalVolume = players[msg.sender].totalVolume + _amount;
        
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
    
    // ============ View Functions ============
    /**
     * @notice Gets player trade history for a specific scenario
     * @param _player The player's address
     * @param _scenario The scenario identifier
     * @return The number of trades for this scenario
     */
    function getPlayerTradeHistory(address _player, string calldata _scenario) external view returns (uint256) 
    {
        return players[_player].tradeHistory[_scenario];
    }
     
    /**
     * @notice Gets player info
     * @param _player The player's address
     * @return isRegistered Whether the player is registered
     * @return tradesCompleted Total trades completed
     * @return totalVolume Total trading volume
     */
    function getPlayerInfo(address _player) 
        external 
        view 
        returns (bool isRegistered, uint256 tradesCompleted, uint256 totalVolume) 
    {
        Player storage player = players[_player];
        return (player.isRegistered, player.tradesCompleted, player.totalVolume);
    }
    
    /**
     * @notice Gets user balance for a specific token
     * @param _user The user's address
     * @param _token The token address
     * @return The user's balance
     */
    function getUserBalance(address _user, address _token) external view returns (uint256) {
        return userAssetBalances[_user][_token];
    }
    
    /**
     * @notice Gets user collateral for a specific token
     * @param _user The user's address
     * @param _token The token address
     * @return The user's collateral
     */
    function getUserCollateral(address _user, address _token) external view returns (uint256) {
        return userCollateral[_user][_token];
    }
    
    /**
     * @notice Gets user debt for a specific token
     * @param _user The user's address
     * @param _token The token address
     * @return The user's debt
     */
    function getUserDebt(address _user, address _token) external view returns (uint256) {
        return userDebt[_user][_token];
    }
    
    /**
     * @notice Gets user staked amount for a specific token
     * @param _user The user's address
     * @param _token The token address
     * @return The user's staked amount
     */
    function getUserStaked(address _user, address _token) external view returns (uint256) {
        return userStaked[_user][_token];
    }
    
    /**
     * @notice Gets token price
     * @param _token The token address
     * @return The token price (scaled by 10^18)
     */
    function getTokenPrice(address _token) external view returns (uint256) {
        return tokenPrices[_token];
    }
    
    /**
     * @notice Gets token value in USD
     * @param _token The token address
     * @param _amount The token amount
     * @return The value in USD (scaled by 10^18)
     */
    function getTokenValue(address _token, uint256 _amount) external view returns (uint256) {
        return (_amount * tokenPrices[_token]) / (10**18);
    }
    
    /**
     * @notice Checks if a token is supported
     * @param _token The token address
     * @return Whether the token is supported
     */
    function isTokenSupported(address _token) external view returns (bool) {
        return supportedTokens[_token];
    }
    
    // ============ Internal Functions ============
    /**
     * @dev Updates user balance
     * @param _user The user's address
     * @param _token The token address
     * @param _amount The amount to update
     * @param _increase Whether to increase or decrease
     */
    function updateUserBalance(address _user, address _token, uint256 _amount, bool _increase) external {
        require(msg.sender == owner() || msg.sender == tradingFunctions, "Only owner or trading functions can update balances");
        if (_increase) {
            userAssetBalances[_user][_token] = userAssetBalances[_user][_token] + _amount;
        } else {
            require(userAssetBalances[_user][_token] >= _amount, "Insufficient balance");
            userAssetBalances[_user][_token] = userAssetBalances[_user][_token] - _amount;
        }
    }
    
    /**
     * @dev Updates user collateral
     * @param _user The user's address
     * @param _token The token address
     * @param _amount The amount to update
     * @param _increase Whether to increase or decrease
     */
    function updateUserCollateral(address _user, address _token, uint256 _amount, bool _increase) external {
        require(msg.sender == owner() || msg.sender == tradingFunctions, "Only owner or trading functions can update collateral");
        if (_increase) {
            userCollateral[_user][_token] += _amount;
        } else {
            require(userCollateral[_user][_token] >= _amount, "Insufficient collateral");
            userCollateral[_user][_token] -= _amount;
        }
    }
    
    /**
     * @dev Updates user debt
     * @param _user The user's address
     * @param _token The token address
     * @param _amount The amount to update
     * @param _increase Whether to increase or decrease
     */
    function updateUserDebt(address _user, address _token, uint256 _amount, bool _increase) external {
        require(msg.sender == owner() || msg.sender == tradingFunctions, "Only owner or trading functions can update debt");
        if (_increase) {
            userDebt[_user][_token] += _amount;
        } else {
            require(userDebt[_user][_token] >= _amount, "Insufficient debt");
            userDebt[_user][_token] -= _amount;
        }
    }
    
    /**
     * @dev Updates user staked amount
     * @param _user The user's address
     * @param _token The token address
     * @param _amount The amount to update
     * @param _increase Whether to increase or decrease
     */
    function updateUserStaked(address _user, address _token, uint256 _amount, bool _increase) external {
        require(msg.sender == owner() || msg.sender == tradingFunctions, "Only owner or trading functions can update staked");
        if (_increase) {
            userStaked[_user][_token] += _amount;
        } else {
            require(userStaked[_user][_token] >= _amount, "Insufficient staked");
            userStaked[_user][_token] -= _amount;
        }
    }
    
    /**
     * @dev Sets the trading functions contract address
     * @param _tradingFunctions The trading functions contract address
     */
    function setTradingFunctions(address _tradingFunctions) external onlyOwner {
        tradingFunctions = _tradingFunctions;
    }
} 