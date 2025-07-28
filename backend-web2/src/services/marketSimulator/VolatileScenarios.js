/**
 * Handlers for Volatile Dimension scenarios
 */
class VolatileScenarios {
  /**
   * Update the elapsed time for a scenario state
   * @param {Object} state - The scenario state to update
   * @returns {Object} The updated state
   */
  static updateElapsedTime(state) {
    state.elapsedTime = Date.now() - state.startTime;
    return state;
  }

  /**
   * Topic 5: Mastering Yield Farming
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleVolatileYieldFarming(state) {
    this.updateElapsedTime(state);
    
    // Fluctuate APY between 22% and 28%
    state.apyChangeCounter += 1;
    
    // Change direction every 10 updates
    if (state.apyChangeCounter >= 10) {
      state.apyDirection *= -1;
      state.apyChangeCounter = 0;
    }
    
    // Update APY with small random changes in the current direction
    state.farmApy += state.apyDirection * (Math.random() * 0.5);
    
    // Keep APY within bounds
    if (state.farmApy > 28) {
      state.farmApy = 28;
      state.apyDirection = -1;
    } else if (state.farmApy < 22) {
      state.farmApy = 22;
      state.apyDirection = 1;
    }
    
    return {
      prices: state.prices,
      farmApy: parseFloat(state.farmApy.toFixed(1))
    };
  }

  /**
   * Topic 6: The Risk of Impermanent Loss
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleVolatileImpermanentLoss(state) {
    this.updateElapsedTime(state);
    
    // Check if user has provided liquidity
    if (state.events && state.events.liquidityProvided) {
      // Start price divergence
      if (!state.divergenceStarted) {
        state.divergenceStarted = true;
        state.divergenceStartTime = Date.now();
      }
      
      // If divergence has started, increase ETH price over 60 seconds
      if (state.divergenceStarted) {
        const divergenceDuration = 60000; // 60 seconds
        const timeSinceDivergenceStart = Date.now() - state.divergenceStartTime;
        const divergenceProgress = Math.min(1, timeSinceDivergenceStart / divergenceDuration);
        
        // Calculate new ETH price (linear increase from 1000 to 2000)
        state.prices.vETH = 1000 + (divergenceProgress * 1000);
      }
    }
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2)),
        vUSDC: state.prices.vUSDC
      }
    };
  }

  /**
   * Topic 7: Understanding Leverage & Liquidation
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleVolatileLiquidation(state) {
    this.updateElapsedTime(state);
    
    // Check if user has borrowed
    if (state.events && state.events.borrowed) {
      // Wait 10 seconds before starting the collateral drop
      if (!state.collateralDropStarted && 
          (Date.now() - state.events.borrowed.timestamp) > 10000) {
        state.collateralDropStarted = true;
        state.collateralDropStartTime = Date.now();
      }
      
      // If collateral drop has started, decrease ETH price over 45 seconds
      if (state.collateralDropStarted) {
        const dropDuration = 45000; // 45 seconds
        const timeSinceDropStart = Date.now() - state.collateralDropStartTime;
        const dropProgress = Math.min(1, timeSinceDropStart / dropDuration);
        
        // Calculate new ETH price (linear decrease from 1000 to liquidation price)
        const priceRange = 1000 - state.liquidationPrice;
        state.prices.vETH = 1000 - (dropProgress * priceRange);
      }
    }
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2))
      }
    };
  }
}

module.exports = VolatileScenarios;