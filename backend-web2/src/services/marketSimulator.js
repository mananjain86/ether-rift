
class MarketSimulator {
  constructor(wss) {
    this.wss = wss; // WebSocket server instance
    this.activeScenarios = new Map(); // Map of active scenarios by client ID
    this.clientTopics = new Map(); // Map of active topics by client ID
    this.intervalIds = new Map(); // Map of interval IDs by client ID
    
    // Default broadcast interval in milliseconds
    this.broadcastInterval = 3000;
    
    // Initialize scenario handlers
    this.scenarioHandlers = {
      // Stable Dimension Scenarios
      'stable-defi-intro': this.handleStableDefiIntro.bind(this),
      'stable-liquidity-pools': this.handleStableLiquidityPools.bind(this),
      'stable-staking': this.handleStableStaking.bind(this),
      'stable-stablecoins': this.handleStableStablecoins.bind(this),
      
      // Volatile & Arbitrage Dimension Scenarios
      'volatile-yield-farming': this.handleVolatileYieldFarming.bind(this),
      'volatile-impermanent-loss': this.handleVolatileImpermanentLoss.bind(this),
      'volatile-liquidation': this.handleVolatileLiquidation.bind(this),
      'arbitrage-cross-exchange': this.handleArbitrageCrossExchange.bind(this),
      'arbitrage-flash-loan': this.handleArbitrageFlashLoan.bind(this)
    };
  }

  /**
   * Start a scenario for a specific client
   * @param {string} clientId - Unique identifier for the client
   * @param {string} topicId - The topic ID to start
   * @param {Object} params - Additional parameters for the scenario
   */
  startScenario(clientId, topicId, params = {}) {
    // Clear any existing scenario for this client
    this.stopScenario(clientId);
    
    // Set the active topic for this client
    this.clientTopics.set(clientId, topicId);
    
    // Initialize scenario state
    const scenarioState = this.initializeScenarioState(topicId, params);
    this.activeScenarios.set(clientId, scenarioState);
    
    // Start the broadcast interval
    const intervalId = setInterval(() => {
      this.broadcastUpdate(clientId);
    }, this.broadcastInterval);
    
    this.intervalIds.set(clientId, intervalId);
    
    // Send initial data immediately
    this.broadcastUpdate(clientId);
    
    console.log(`Started scenario ${topicId} for client ${clientId}`);
  }

  /**
   * Stop the active scenario for a client
   * @param {string} clientId - Unique identifier for the client
   */
  stopScenario(clientId) {
    if (this.intervalIds.has(clientId)) {
      clearInterval(this.intervalIds.get(clientId));
      this.intervalIds.delete(clientId);
      this.activeScenarios.delete(clientId);
      this.clientTopics.delete(clientId);
      console.log(`Stopped scenario for client ${clientId}`);
    }
  }

  /**
   * Trigger a specific event in an active scenario
   * @param {string} clientId - Unique identifier for the client
   * @param {string} eventType - The type of event to trigger
   * @param {Object} eventParams - Parameters for the event
   */
  triggerEvent(clientId, eventType, eventParams = {}) {
    if (!this.activeScenarios.has(clientId)) {
      console.warn(`No active scenario for client ${clientId}`);
      return;
    }
    
    const scenarioState = this.activeScenarios.get(clientId);
    const topicId = this.clientTopics.get(clientId);
    
    // Update scenario state based on the event
    if (this.scenarioHandlers[topicId]) {
      scenarioState.events = scenarioState.events || {};
      scenarioState.events[eventType] = {
        triggered: true,
        timestamp: Date.now(),
        params: eventParams
      };
      
      console.log(`Triggered event ${eventType} for client ${clientId} in scenario ${topicId}`);
      
      // Broadcast an update immediately after the event
      this.broadcastUpdate(clientId);
    }
  }

  /**
   * Broadcast an update to a specific client
   * @param {string} clientId - Unique identifier for the client
   */
  broadcastUpdate(clientId) {
    if (!this.activeScenarios.has(clientId) || !this.clientTopics.has(clientId)) {
      return;
    }
    
    const topicId = this.clientTopics.get(clientId);
    const scenarioState = this.activeScenarios.get(clientId);
    
    // Generate the payload using the appropriate scenario handler
    if (this.scenarioHandlers[topicId]) {
      const payload = this.scenarioHandlers[topicId](scenarioState);
      
      // Create the message with topicId and payload
      const message = JSON.stringify({
        topicId,
        payload
      });
      
      // Find the client and send the message
      this.wss.clients.forEach(client => {
        if (client.id === clientId && client.readyState === 1) { // 1 = WebSocket.OPEN
          client.send(message);
        }
      });
    }
  }

  /**
   * Broadcast to all connected clients (for global updates)
   * @param {string} topicId - The topic ID
   * @param {Object} payload - The data payload
   */
  broadcastToAll(topicId, payload) {
    const message = JSON.stringify({ topicId, payload });
    
    this.wss.clients.forEach(client => {
      if (client.readyState === 1) { // 1 = WebSocket.OPEN
        client.send(message);
      }
    });
  }

  /**
   * Initialize state for a new scenario
   * @param {string} topicId - The topic ID
   * @param {Object} params - Additional parameters
   * @returns {Object} The initial state for the scenario
   */
  initializeScenarioState(topicId, params) {
    // Common base state
    const baseState = {
      startTime: Date.now(),
      elapsedTime: 0,
      events: {},
      params
    };
    
    // Topic-specific initial state
    switch (topicId) {
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
          apyDirection: 1, // 1 for increasing, -1 for decreasing
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
        
      default:
        return baseState;
    }
  }

  /**
   * Update the elapsed time for a scenario state
   * @param {Object} state - The scenario state to update
   * @returns {Object} The updated state
   */
  updateElapsedTime(state) {
    state.elapsedTime = Date.now() - state.startTime;
    return state;
  }

  /*
   * Scenario Handlers
   * Each handler takes the current state and returns a payload for the topic
   */
  
  // Topic 1: What is DeFi?
  handleStableDefiIntro(state) {
    // No market data needed for this topic
    return {};
  }

  // Topic 2: Understanding Liquidity Pools & AMMs
  handleStableLiquidityPools(state) {
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

  // Topic 3: Introduction to Staking
  handleStableStaking(state) {
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

  // Topic 4: The Role of Stablecoins
  handleStableStablecoins(state) {
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

  // Topic 5: Mastering Yield Farming
  handleVolatileYieldFarming(state) {
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

  // Topic 6: The Risk of Impermanent Loss
  handleVolatileImpermanentLoss(state) {
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

  // Topic 7: Understanding Leverage & Liquidation
  handleVolatileLiquidation(state) {
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

  // Topic 8: Cross-Exchange Arbitrage
  handleArbitrageCrossExchange(state) {
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

  // Topic 9: Flash Loans & Flash Swaps
  handleArbitrageFlashLoan(state) {
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

// Import the refactored MarketSimulator class
const MarketSimulator = require('./marketSimulator/MarketSimulator');

// Export the MarketSimulator class
export default MarketSimulator;