// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EtherRiftCore.sol";

/**
 * @title EtherRift Admin
 * @dev Admin functions for the EtherRift game
 */
contract EtherRiftAdmin is EtherRiftCore {
    
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
} 