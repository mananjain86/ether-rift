class MarketSimulator {
  constructor(wss) {
    this.wss = wss; // WebSocket server instance
    this.activeScenarios = new Map(); // Map of active scenarios by client ID
    this.clientTopics = new Map(); // Map of active topics by client ID
    this.intervalIds = new Map(); // Map of interval IDs by client ID
    
    // Default broadcast interval in milliseconds
    this.broadcastInterval = 3000;
    
    // Import scenario handlers
    this.stableScenarios = require('./StableScenarios');
    this.volatileScenarios = require('./VolatileScenarios');
    this.arbitrageScenarios = require('./ArbitrageScenarios');
    
    // Initialize scenario handlers
    this.scenarioHandlers = {
      // Stable Dimension Scenarios
      'stable-defi-intro': this.stableScenarios.handleStableDefiIntro.bind(this),
      'stable-liquidity-pools': this.stableScenarios.handleStableLiquidityPools.bind(this),
      'stable-staking': this.stableScenarios.handleStableStaking.bind(this),
      'stable-stablecoins': this.stableScenarios.handleStableStablecoins.bind(this),
      
      // Volatile Dimension Scenarios
      'volatile-yield-farming': this.volatileScenarios.handleVolatileYieldFarming.bind(this),
      'volatile-impermanent-loss': this.volatileScenarios.handleVolatileImpermanentLoss.bind(this),
      'volatile-liquidation': this.volatileScenarios.handleVolatileLiquidation.bind(this),
      
      // Arbitrage Dimension Scenarios
      'arbitrage-cross-exchange': this.arbitrageScenarios.handleArbitrageCrossExchange.bind(this),
      'arbitrage-flash-loan': this.arbitrageScenarios.handleArbitrageFlashLoan.bind(this)
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
}

module.exports = MarketSimulator;