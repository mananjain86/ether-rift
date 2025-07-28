/**
 * Handlers for Arbitrage Dimension scenarios
 */
class ArbitrageScenarios {
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
   * Topic 8: Cross-Exchange Arbitrage
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleArbitrageCrossExchange(state) {
    this.updateElapsedTime(state);
    
    // Start price convergence after 15 seconds
    if (!state.convergenceStarted && state.elapsedTime > 15000) {
      state.convergenceStarted = true;
      state.convergenceStartTime = Date.now();
      state.lastUpdateTime = Date.now();
    }
    
    // If convergence has started, update prices every 5 seconds
    if (state.convergenceStarted) {
      const timeSinceLastUpdate = Date.now() - state.lastUpdateTime;
      
      if (timeSinceLastUpdate >= 5000) { // 5 seconds
        // Increase CryptoMart price by $1
        state.exchanges.cryptoMart.vETH += 1;
        
        // Decrease DigitalBay price by $1
        state.exchanges.digitalBay.vETH -= 1;
        
        state.lastUpdateTime = Date.now();
        
        // Check if prices have converged
        if (state.exchanges.cryptoMart.vETH >= state.exchanges.digitalBay.vETH) {
          // Set both prices equal to signify equilibrium
          const equilibriumPrice = (state.exchanges.cryptoMart.vETH + state.exchanges.digitalBay.vETH) / 2;
          state.exchanges.cryptoMart.vETH = equilibriumPrice;
          state.exchanges.digitalBay.vETH = equilibriumPrice;
        }
      }
    }
    
    return {
      exchanges: {
        cryptoMart: {
          vETH: parseFloat(state.exchanges.cryptoMart.vETH.toFixed(2))
        },
        digitalBay: {
          vETH: parseFloat(state.exchanges.digitalBay.vETH.toFixed(2))
        }
      }
    };
  }

  /**
   * Topic 9: Flash Loans & Flash Swaps
   * @param {Object} state - The current scenario state
   * @returns {Object} The payload for the client
   */
  static handleArbitrageFlashLoan(state) {
    this.updateElapsedTime(state);
    
    // Start rapid convergence immediately
    if (!state.convergenceStarted) {
      state.convergenceStarted = true;
      state.convergenceStartTime = Date.now();
    }
    
    // Rapid convergence over 20 seconds
    if (state.convergenceStarted) {
      const convergenceDuration = 20000; // 20 seconds
      const timeSinceConvergenceStart = Date.now() - state.convergenceStartTime;
      const convergenceProgress = Math.min(1, timeSinceConvergenceStart / convergenceDuration);
      
      // Calculate new prices (non-linear convergence for more dramatic effect)
      const easedProgress = Math.pow(convergenceProgress, 2); // Quadratic easing
      const priceDiff = 1050 - 950;
      const midPrice = 1000;
      
      state.exchanges.cryptoMart.vETH = 950 + (easedProgress * (midPrice - 950));
      state.exchanges.digitalBay.vETH = 1050 - (easedProgress * (1050 - midPrice));
      
      // Ensure they meet exactly at the midpoint when complete
      if (convergenceProgress >= 1) {
        state.exchanges.cryptoMart.vETH = midPrice;
        state.exchanges.digitalBay.vETH = midPrice;
      }
    }
    
    return {
      exchanges: {
        cryptoMart: {
          vETH: parseFloat(state.exchanges.cryptoMart.vETH.toFixed(2))
        },
        digitalBay: {
          vETH: parseFloat(state.exchanges.digitalBay.vETH.toFixed(2))
        }
      }
    };
  }
}

module.exports = ArbitrageScenarios;