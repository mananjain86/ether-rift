// Market data generator for different scenarios
export class MarketDataGenerator {
  constructor(scenarioId) {
    this.scenarioId = scenarioId;
    this.basePrice = 1000;
    this.currentPrice = this.basePrice;
    this.timeIndex = 0;
    this.dataPoints = [];
    this.scenarioPhase = 'initial';
    this.phaseStartTime = 0;
    
    // Initialize with some historical data
    this.generateInitialData();
  }

  generateInitialData() {
    // Generate 20 initial data points with realistic market patterns
    for (let i = 0; i < 20; i++) {
      this.addDataPoint();
    }
  }

  addDataPoint() {
    const timestamp = Date.now();
    const dataPoint = {
      time: this.timeIndex,
      price: this.currentPrice,
      volume: this.generateVolume(),
      timestamp: timestamp
    };
    
    this.dataPoints.push(dataPoint);
    this.timeIndex++;
    
    // Update price based on scenario
    this.updatePrice();
    
    return dataPoint;
  }

  updatePrice() {
    switch (this.scenarioId) {
      case 'stable-liquidity-pools':
        this.updateStableLiquidityPools();
        break;
      case 'stable-stablecoins':
        this.updateStableStablecoins();
        break;
      case 'volatile-impermanent-loss':
        this.updateVolatileImpermanentLoss();
        break;
      case 'volatile-liquidation':
        this.updateVolatileLiquidation();
        break;
      case 'arbitrage-cross-exchange':
        this.updateArbitrageCrossExchange();
        break;
      case 'arbitrage-flash-loan':
        this.updateArbitrageFlashLoan();
        break;
      case 'volatile-yield-farming':
        this.updateVolatileYieldFarming();
        break;
      default:
        this.updateDefaultStable();
    }
  }

  updateStableLiquidityPools() {
    // Stable prices with small random variations
    const variation = (Math.random() - 0.5) * 10; // ±5 USD
    this.currentPrice = Math.max(990, Math.min(1010, this.basePrice + variation));
  }

  updateStableStablecoins() {
    // Initially stable, then market dip after 30 seconds
    const elapsed = this.timeIndex * 3; // 3 second intervals
    
    if (elapsed < 30) {
      // Stable phase
      const variation = (Math.random() - 0.5) * 5;
      this.currentPrice = this.basePrice + variation;
    } else if (elapsed < 60) {
      // Market dip phase
      const dipProgress = (elapsed - 30) / 30;
      this.currentPrice = this.basePrice - (dipProgress * 200); // Drop to 800
    } else {
      // Hold at 800
      this.currentPrice = 800;
    }
  }

  updateVolatileImpermanentLoss() {
    // Price divergence for impermanent loss demonstration
    const elapsed = this.timeIndex * 3;
    
    if (elapsed < 30) {
      // Initial stable phase
      const variation = (Math.random() - 0.5) * 10;
      this.currentPrice = this.basePrice + variation;
    } else if (elapsed < 90) {
      // Price divergence phase
      const divergenceProgress = (elapsed - 30) / 60;
      this.currentPrice = this.basePrice + (divergenceProgress * 1000); // Rise to 2000
    } else {
      // Hold at 2000
      this.currentPrice = 2000;
    }
  }

  updateVolatileLiquidation() {
    // Collateral drop for liquidation demonstration
    const elapsed = this.timeIndex * 3;
    
    if (elapsed < 30) {
      // Initial stable phase
      const variation = (Math.random() - 0.5) * 10;
      this.currentPrice = this.basePrice + variation;
    } else if (elapsed < 75) {
      // Collateral drop phase
      const dropProgress = (elapsed - 30) / 45;
      this.currentPrice = this.basePrice - (dropProgress * 300); // Drop to 700
    } else {
      // Hold at low price
      this.currentPrice = 700;
    }
  }

  updateArbitrageCrossExchange() {
    // Price convergence for arbitrage
    const elapsed = this.timeIndex * 3;
    
    if (elapsed < 15) {
      // Initial price discrepancy
      this.currentPrice = 995 + (Math.random() - 0.5) * 10;
    } else {
      // Price convergence
      const convergenceProgress = Math.min((elapsed - 15) / 30, 1);
      this.currentPrice = 995 + (convergenceProgress * 15); // Converge to 1010
    }
  }

  updateArbitrageFlashLoan() {
    // Rapid price convergence for flash loan
    const elapsed = this.timeIndex * 3;
    
    if (elapsed < 10) {
      // Large initial discrepancy
      this.currentPrice = 950 + (Math.random() - 0.5) * 20;
    } else if (elapsed < 30) {
      // Rapid convergence
      const convergenceProgress = (elapsed - 10) / 20;
      this.currentPrice = 950 + (convergenceProgress * 100); // Rapidly converge
    } else {
      // Equilibrium
      this.currentPrice = 1000;
    }
  }

  updateVolatileYieldFarming() {
    // High volatility with yield farming
    const volatility = 50;
    const trend = Math.sin(this.timeIndex * 0.1) * 100;
    const random = (Math.random() - 0.5) * volatility;
    this.currentPrice = this.basePrice + trend + random;
  }

  updateDefaultStable() {
    // Default stable behavior
    const variation = (Math.random() - 0.5) * 20;
    this.currentPrice = this.basePrice + variation;
  }

  generateVolume() {
    // Generate realistic volume data
    const baseVolume = 1000;
    const variation = (Math.random() - 0.5) * 500;
    return Math.max(100, baseVolume + variation);
  }

  getLatestData() {
    return [...this.dataPoints]; // Return a copy to avoid extensibility issues
  }

  getNewDataPoint() {
    return this.addDataPoint();
  }
} 