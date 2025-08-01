/**
 * Scenario handlers for different topic types
 */
class ScenarioHandlers {
  /**
   * Initialize scenario state based on topic ID
   * @param {string} topicId - The topic ID
   * @param {Object} params - Additional parameters
   * @returns {Object} The initialized scenario state
   */
  static initializeScenarioState(topicId, params) {
    // Common base state
    const baseState = {
      startTime: Date.now(),
      elapsedTime: 0,
      events: {},
      params,
      dataPoints: [] // Add dataPoints array to hold time-series data
    };
    
    // Topic-specific initial state
    switch (topicId) {
      case 'stable-defi-intro':
        return {
          ...baseState,
          guestbookEntries: []
        };
        
      case 'stable-liquidity-pools':
        return {
          ...baseState,
          prices: { vETH: 1000.00, vUSDC: 1.00 },
          lastTrade: null
        };
        
      case 'stable-staking':
        return {
          ...baseState,
          rewardRate: 0.005,
          totalStaked: 1250000
        };
        
      case 'stable-lending':
        return {
          ...baseState,
          collateralRatio: 1.5,
          interestRate: 0.08,
          totalBorrowed: 500000
        };
        
      case 'stable-stablecoins':
        return {
          ...baseState,
          prices: { vETH: 1000.00, vUSDC: 1.00 },
          marketDipStarted: false,
          marketDipProgress: 0
        };
        
      case 'volatile-yield-farming':
        return {
          ...baseState,
          prices: { vETH: 1000.00, vUSDC: 1.00 },
          farmApy: 25.5,
          apyDirection: 1,
          apyChangeCounter: 0
        };
        
      case 'volatile-impermanent-loss':
        return {
          ...baseState,
          prices: { vETH: 1000.00, vUSDC: 1.00 },
          divergenceStarted: false,
          divergenceProgress: 0
        };
        
      case 'volatile-liquidation':
        return {
          ...baseState,
          prices: { vETH: 1000.00 },
          collateralDropStarted: false,
          collateralDropProgress: 0,
          liquidationPrice: params.liquidationPrice || 700.00
        };
        
      case 'volatile-derivatives':
        return {
          ...baseState,
          synthPrices: { sGOLD: 1800.00, sTSLA: 250.00 },
          volatilityIndex: 0.3
        };
        
      case 'volatile-dao-governance':
        return {
          ...baseState,
          proposals: [
            { id: 1, title: 'Add New Learning Dimension', votes: 1250, quorum: 2000 },
            { id: 2, title: 'Increase Reward Rate', votes: 890, quorum: 2000 }
          ],
          userVotes: {}
        };
        
      case 'arbitrage-cross-exchange':
        return {
          ...baseState,
          exchanges: {
            cryptoMart: { vETH: 995.00 },
            digitalBay: { vETH: 1010.00 }
          },
          convergenceStarted: false,
          convergenceProgress: 0
        };
        
      case 'arbitrage-triangular':
        return {
          ...baseState,
          prices: { vETH: 1000.00, vUSDC: 1.00, vDAI: 1.00 },
          triangularOpportunity: false
        };
        
      case 'arbitrage-flash-loan':
        return {
          ...baseState,
          exchanges: {
            cryptoMart: { vETH: 950.00 },
            digitalBay: { vETH: 1050.00 }
          },
          convergenceStarted: false,
          convergenceProgress: 0
        };
        
      case 'arbitrage-cyclical':
        return {
          ...baseState,
          pools: {
            pool1: { vETH: 1000.00, vUSDC: 1.00 },
            pool2: { vUSDC: 1.00, vDAI: 1.00 },
            pool3: { vDAI: 1.00, vETH: 1000.00 }
          },
          cycleOpportunity: false
        };
        
      default:
        return baseState;
    }
  }

  // Stable Dimension Handlers
  static handleStableDefiIntro(state) {
    return {
      guestbookEntries: state.guestbookEntries || []
    };
  }

  static handleStableLiquidityPools(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Append new data point for prices.vETH
    const newDataPoint = {
      time: state.elapsedTime,
      price: state.prices.vETH
    };
    state.dataPoints.push(newDataPoint);
    // Keep only last 100 data points to limit memory
    if (state.dataPoints.length > 30) {
      state.dataPoints.shift();
    }
    
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
    
    return {
      prices: state.prices,
      lastTrade: state.lastTrade,
      dataPoints: state.dataPoints
    };
  }

  static handleStableStaking(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Slowly increase total staked amount over time
    const increaseAmount = 1000 + Math.random() * 2000;
    state.totalStaked += increaseAmount * (state.elapsedTime / 60000);
    
    // Keep the increase reasonable
    state.totalStaked = Math.min(state.totalStaked, 1500000);
    
    return {
      rewardRate: state.rewardRate,
      totalStaked: Math.round(state.totalStaked)
    };
  }

  static handleStableLending(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate lending activity
    const newBorrows = Math.random() * 10000;
    state.totalBorrowed += newBorrows;
    
    return {
      collateralRatio: state.collateralRatio,
      interestRate: state.interestRate,
      totalBorrowed: Math.round(state.totalBorrowed)
    };
  }

  static handleStableStablecoins(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
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
        const dipDuration = 30000;
        const timeSinceDipStart = Date.now() - state.marketDipStartTime;
        const dipProgress = Math.min(1, timeSinceDipStart / dipDuration);
        
        // Calculate new ETH price (linear decrease from 1000 to 800)
        state.prices.vETH = 1000 - (dipProgress * 200);
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

  // Volatile Dimension Handlers
  static handleVolatileYieldFarming(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate APY changes
    state.apyChangeCounter++;
    if (state.apyChangeCounter > 10) {
      state.farmApy += (Math.random() - 0.5) * 2 * state.apyDirection;
      state.farmApy = Math.max(15, Math.min(35, state.farmApy));
      state.apyChangeCounter = 0;
      
      // Change direction occasionally
      if (Math.random() < 0.3) {
        state.apyDirection *= -1;
      }
    }
    
    return {
      farmApy: parseFloat(state.farmApy.toFixed(1)),
      prices: state.prices
    };
  }

  static handleVolatileImpermanentLoss(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate price divergence
    if (state.elapsedTime > 10000) { // After 10 seconds
      state.divergenceStarted = true;
      const divergenceProgress = Math.min(1, (state.elapsedTime - 10000) / 20000);
      state.prices.vETH = 1000 + (divergenceProgress * 500); // Increase to 1500
    }
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2)),
        vUSDC: state.prices.vUSDC
      },
      divergenceStarted: state.divergenceStarted
    };
  }

  static handleVolatileLiquidation(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate collateral price drop
    if (state.elapsedTime > 5000) {
      state.collateralDropStarted = true;
      const dropProgress = Math.min(1, (state.elapsedTime - 5000) / 15000);
      state.prices.vETH = 1000 - (dropProgress * 300); // Decrease to 700
    }
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2))
      },
      liquidationPrice: state.liquidationPrice,
      collateralDropStarted: state.collateralDropStarted
    };
  }

  static handleVolatileDerivatives(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate synth price movements
    state.synthPrices.sGOLD += (Math.random() - 0.5) * 10;
    state.synthPrices.sTSLA += (Math.random() - 0.5) * 5;
    state.volatilityIndex = 0.2 + Math.random() * 0.4;
    
    return {
      synthPrices: {
        sGOLD: parseFloat(state.synthPrices.sGOLD.toFixed(2)),
        sTSLA: parseFloat(state.synthPrices.sTSLA.toFixed(2))
      },
      volatilityIndex: parseFloat(state.volatilityIndex.toFixed(2))
    };
  }

  static handleVolatileDaoGovernance(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate voting activity
    if (state.elapsedTime % 5000 < 1000) { // Every 5 seconds
      const proposalId = Math.floor(Math.random() * state.proposals.length) + 1;
      const proposal = state.proposals.find(p => p.id === proposalId);
      if (proposal) {
        proposal.votes += Math.floor(Math.random() * 50) + 10;
      }
    }
    
    return {
      proposals: state.proposals,
      userVotes: state.userVotes
    };
  }

  // Arbitrage Dimension Handlers
  static handleArbitrageCrossExchange(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate price convergence
    if (state.elapsedTime > 8000) {
      state.convergenceStarted = true;
      const convergenceProgress = Math.min(1, (state.elapsedTime - 8000) / 12000);
      
      // Gradually bring prices together
      const priceDiff = state.exchanges.digitalBay.vETH - state.exchanges.cryptoMart.vETH;
      const convergence = priceDiff * (1 - convergenceProgress);
      
      state.exchanges.cryptoMart.vETH = 995 + convergence / 2;
      state.exchanges.digitalBay.vETH = 1010 - convergence / 2;
    }
    
    return {
      exchanges: {
        cryptoMart: { vETH: parseFloat(state.exchanges.cryptoMart.vETH.toFixed(2)) },
        digitalBay: { vETH: parseFloat(state.exchanges.digitalBay.vETH.toFixed(2)) }
      },
      convergenceStarted: state.convergenceStarted
    };
  }

  static handleArbitrageTriangular(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate triangular arbitrage opportunities
    const priceImbalance = Math.sin(state.elapsedTime / 3000) * 0.02; // 2% variation
    state.prices.vETH = 1000 * (1 + priceImbalance);
    state.triangularOpportunity = Math.abs(priceImbalance) > 0.01;
    
    return {
      prices: {
        vETH: parseFloat(state.prices.vETH.toFixed(2)),
        vUSDC: state.prices.vUSDC,
        vDAI: state.prices.vDAI
      },
      triangularOpportunity: state.triangularOpportunity
    };
  }

  static handleArbitrageFlashLoan(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate flash loan arbitrage opportunities
    if (state.elapsedTime > 6000) {
      state.convergenceStarted = true;
      const convergenceProgress = Math.min(1, (state.elapsedTime - 6000) / 10000);
      
      const priceDiff = state.exchanges.digitalBay.vETH - state.exchanges.cryptoMart.vETH;
      const convergence = priceDiff * (1 - convergenceProgress);
      
      state.exchanges.cryptoMart.vETH = 950 + convergence / 2;
      state.exchanges.digitalBay.vETH = 1050 - convergence / 2;
    }
    
    return {
      exchanges: {
        cryptoMart: { vETH: parseFloat(state.exchanges.cryptoMart.vETH.toFixed(2)) },
        digitalBay: { vETH: parseFloat(state.exchanges.digitalBay.vETH.toFixed(2)) }
      },
      convergenceStarted: state.convergenceStarted
    };
  }

  static handleArbitrageCyclical(state) {
    ScenarioHandlers.updateElapsedTime(state);
    
    // Simulate cyclical arbitrage opportunities
    const cycleImbalance = Math.sin(state.elapsedTime / 2000) * 0.015;
    state.pools.pool1.vETH = 1000 * (1 + cycleImbalance);
    state.pools.pool3.vETH = 1000 * (1 - cycleImbalance);
    state.cycleOpportunity = Math.abs(cycleImbalance) > 0.008;
    
    return {
      pools: {
        pool1: { vETH: parseFloat(state.pools.pool1.vETH.toFixed(2)), vUSDC: state.pools.pool1.vUSDC },
        pool2: { vUSDC: state.pools.pool2.vUSDC, vDAI: state.pools.pool2.vDAI },
        pool3: { vDAI: state.pools.pool3.vDAI, vETH: parseFloat(state.pools.pool3.vETH.toFixed(2)) }
      },
      cycleOpportunity: state.cycleOpportunity
    };
  }

  /**
   * Update the elapsed time for a scenario state
   * @param {Object} state - The scenario state to update
   * @returns {Object} The updated state
   */
  static updateElapsedTime(state) {
    state.elapsedTime = Date.now() - state.startTime;
    return state;
  }
}

export default ScenarioHandlers; 