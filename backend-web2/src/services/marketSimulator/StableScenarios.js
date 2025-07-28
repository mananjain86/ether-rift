/**
 * Handlers for Stable Dimension scenarios
 */
class StableScenarios {
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
   * Topic 1: What is DeFi?
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleStableDefiIntro(state) {
    // No market data needed for this topic
    return {};
  }

  /**
   * Topic 2: Understanding Liquidity Pools & AMMs
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleStableLiquidityPools(state) {
    this.updateElapsedTime(state);
    
    // Check if user has provided liquidity (event triggered)
    if (state.events && state.events.liquidityProvided) {
      // Generate random trades every 5-10 seconds
      const shouldGenerateTrade = !state.lastTrade || 
        (Date.now() - state.lastTradeTime > (5000 + Math.random() * 5000));
      
      if (shouldGenerateTrade) {
        state.lastTrade = {
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          amount: parseFloat((1 + Math.random() * 10).toFixed(2)),
          asset: 'vETH'
        };
        state.lastTradeTime = Date.now();
      }
    }
    
    // Return the current prices and last trade
    return {
      prices: state.prices,
      lastTrade: state.lastTrade
    };
  }

  /**
   * Topic 3: Introduction to Staking
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleStableStaking(state) {
    this.updateElapsedTime(state);
    
    // Slowly increase total staked amount over time
    const increaseAmount = 1000 + Math.random() * 2000;
    state.totalStaked += increaseAmount * (state.elapsedTime / 60000); // Scale with elapsed minutes
    
    // Keep the increase reasonable
    state.totalStaked = Math.min(state.totalStaked, 1500000);
    
    return {
      rewardRate: state.rewardRate,
      totalStaked: Math.round(state.totalStaked)
    };
  }

  /**
   * Topic 4: The Role of Stablecoins
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleStableStablecoins(state) {
    this.updateElapsedTime(state);
    
    // Check if user has swapped ETH for USDC
    if (state.events && state.events.swappedForStable) {
      // Wait 5 seconds before starting the market dip
      if (!state.marketDipStarted && 
          (Date.now() - state.events.swappedForStable.timestamp) > 5000) {
        state.marketDipStarted = true;
        state.marketDipStartTime = Date.now();
      }
      
      // If market dip has started, decrease ETH price over 30 seconds
      if (state.marketDipStarted) {
        const dipDuration = 30000; // 30 seconds
        const timeSinceDipStart = Date.now() - state.marketDipStartTime;
        const dipProgress = Math.min(1, timeSinceDipStart / dipDuration);
        
        // Calculate new ETH price (linear decrease from 1000 to 800)
        state.prices.vETH = 1000 - (dipProgress * 200);
        
        // Ensure price doesn't go below 800
        state.prices.vETH = Math.max(800, state.prices.vETH);
      }
    }
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2)),
        vUSDC: state.prices.vUSDC
      }
    };
  }
}

module.exports = StableScenarios;