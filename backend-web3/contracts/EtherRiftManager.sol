// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./core/EtherRiftAdmin.sol";
import "./dimensions/StableDimension.sol";
import "./dimensions/VolatileDimension.sol";
import "./dimensions/ArbitrageDimension.sol";

/**
 * @title EtherRift Manager
 * @dev Main contract for the EtherRift game, managing player registration, dimensions, and achievements
 */
contract EtherRiftManager is EtherRiftAdmin {
    
    // Dimension contracts
    StableDimension public stableDimension;
    VolatileDimension public volatileDimension;
    ArbitrageDimension public arbitrageDimension;
    
    // ============ Constructor ============
    constructor(address _achievementToken) EtherRiftAdmin() {
        // Initialize dimension contracts
        stableDimension = new StableDimension();
        volatileDimension = new VolatileDimension();
        arbitrageDimension = new ArbitrageDimension();
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
}