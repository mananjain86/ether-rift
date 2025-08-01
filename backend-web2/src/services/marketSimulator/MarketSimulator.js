import BaseSimulator from './BaseSimulator.js';
import ScenarioHandlers from './ScenarioHandlers.js';

/**
 * Main Market Simulator class that extends BaseSimulator
 */
class MarketSimulator extends BaseSimulator {
  constructor(wss) {
    super(wss);
    
    // Initialize scenario handlers
    this.scenarioHandlers = {
      // Stable Dimension Scenarios
      'stable-defi-intro': ScenarioHandlers.handleStableDefiIntro.bind(this),
      'stable-liquidity-pools': ScenarioHandlers.handleStableLiquidityPools.bind(this),
      'stable-staking': ScenarioHandlers.handleStableStaking.bind(this),
      'stable-lending': ScenarioHandlers.handleStableLending.bind(this),
      'stable-stablecoins': ScenarioHandlers.handleStableStablecoins.bind(this),
      
      // Volatile Dimension Scenarios
      'volatile-yield-farming': ScenarioHandlers.handleVolatileYieldFarming.bind(this),
      'volatile-impermanent-loss': ScenarioHandlers.handleVolatileImpermanentLoss.bind(this),
      'volatile-liquidation': ScenarioHandlers.handleVolatileLiquidation.bind(this),
      'volatile-derivatives': ScenarioHandlers.handleVolatileDerivatives.bind(this),
      'volatile-dao-governance': ScenarioHandlers.handleVolatileDaoGovernance.bind(this),
      
      // Arbitrage Dimension Scenarios
      'arbitrage-cross-exchange': ScenarioHandlers.handleArbitrageCrossExchange.bind(this),
      'arbitrage-triangular': ScenarioHandlers.handleArbitrageTriangular.bind(this),
      'arbitrage-flash-loan': ScenarioHandlers.handleArbitrageFlashLoan.bind(this),
      'arbitrage-cyclical': ScenarioHandlers.handleArbitrageCyclical.bind(this)
    };
  }

  /**
   * Initialize scenario state based on topic ID
   * @param {string} topicId - The topic ID
   * @param {Object} params - Additional parameters
   * @returns {Object} The initialized scenario state
   */
  initializeScenarioState(topicId, params) {
    return ScenarioHandlers.initializeScenarioState(topicId, params);
  }
}

export default MarketSimulator; 