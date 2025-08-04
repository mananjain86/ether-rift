/**
 * DeFi Operation Feedback System
 * Provides detailed feedback for all DeFi operations including profit/loss and time-based outcomes
 */

// Market simulation data for realistic feedback
const MARKET_DATA = {
  vETH: { volatility: 0.15, basePrice: 1000, trend: 'bullish' },
  vUSDC: { volatility: 0.02, basePrice: 1, trend: 'stable' },
  vDAI: { volatility: 0.02, basePrice: 1, trend: 'stable' },
  ERA: { volatility: 0.25, basePrice: 10, trend: 'bullish' }
};

// Interest rates and APY for different operations
const RATES = {
  staking: { min: 0.05, max: 0.12 }, // 5-12% APY
  lending: { min: 0.03, max: 0.08 }, // 3-8% APY
  borrowing: { min: 0.08, max: 0.15 }, // 8-15% APY
  yieldFarming: { min: 0.15, max: 0.35 }, // 15-35% APY
  flashLoan: { fee: 0.001 }, // 0.1% fee
  liquidity: { fee: 0.003 } // 0.3% fee
};

/**
 * Generate realistic market movement
 */
const generateMarketMovement = (token, amount, operation) => {
  const tokenData = MARKET_DATA[token] || MARKET_DATA.vETH;
  const volatility = tokenData.volatility;
  const basePrice = tokenData.basePrice;
  
  // Simulate price movement based on operation
  let priceChange = 0;
  switch (operation) {
    case 'swap':
      priceChange = (Math.random() - 0.5) * volatility * 2;
      break;
    case 'stake':
      priceChange = Math.random() * volatility * 0.5; // Generally positive
      break;
    case 'yieldFarm':
      priceChange = Math.random() * volatility * 0.8; // Higher volatility
      break;
    case 'flashLoan':
      priceChange = (Math.random() - 0.5) * volatility * 3; // High volatility
      break;
    default:
      priceChange = (Math.random() - 0.5) * volatility;
  }
  
  return {
    priceChange: priceChange,
    newPrice: basePrice * (1 + priceChange),
    percentageChange: priceChange * 100
  };
};

/**
 * Calculate profit/loss for trading operations
 */
const calculateProfitLoss = (operation, amount, token, details = {}) => {
  const marketMovement = generateMarketMovement(token, amount, operation);
  const tokenData = MARKET_DATA[token] || MARKET_DATA.vETH;
  
  let profitLoss = 0;
  let profitLossPercentage = 0;
  
  switch (operation) {
    case 'swap':
      // Simulate swap with slippage and price impact
      const slippage = Math.random() * 0.02; // 0-2% slippage
      const priceImpact = (amount / 1000) * 0.01; // Price impact based on amount
      profitLoss = -(amount * (slippage + priceImpact));
      profitLossPercentage = -((slippage + priceImpact) * 100);
      break;
      
    case 'stake':
      // Staking generally has positive returns
      const stakingAPY = RATES.staking.min + Math.random() * (RATES.staking.max - RATES.staking.min);
      const stakingDays = details.days || Math.floor(Math.random() * 365) + 1;
      profitLoss = amount * (stakingAPY / 365) * stakingDays;
      profitLossPercentage = (stakingAPY / 365) * stakingDays * 100;
      break;
      
    case 'yieldFarm':
      // Yield farming has higher returns but also higher risk
      const farmingAPY = RATES.yieldFarming.min + Math.random() * (RATES.yieldFarming.max - RATES.yieldFarming.min);
      const farmingDays = details.days || Math.floor(Math.random() * 30) + 1;
      const impermanentLoss = Math.random() * 0.05; // 0-5% IL
      profitLoss = amount * ((farmingAPY / 365) * farmingDays - impermanentLoss);
      profitLossPercentage = ((farmingAPY / 365) * farmingDays - impermanentLoss) * 100;
      break;
      
    case 'flashLoan':
      // Flash loans have fixed fees but can generate arbitrage profits
      const flashLoanFee = amount * RATES.flashLoan.fee;
      const arbitrageProfit = Math.random() * amount * 0.02; // 0-2% arbitrage profit
      profitLoss = arbitrageProfit - flashLoanFee;
      profitLossPercentage = ((arbitrageProfit - flashLoanFee) / amount) * 100;
      break;
      
    case 'lend':
      // Lending has steady returns
      const lendingAPY = RATES.lending.min + Math.random() * (RATES.lending.max - RATES.lending.min);
      const lendingDays = details.days || Math.floor(Math.random() * 90) + 1;
      profitLoss = amount * (lendingAPY / 365) * lendingDays;
      profitLossPercentage = (lendingAPY / 365) * lendingDays * 100;
      break;
      
    case 'borrow':
      // Borrowing has costs but can be profitable if used for trading
      const borrowingAPY = RATES.borrowing.min + Math.random() * (RATES.borrowing.max - RATES.borrowing.min);
      const borrowingDays = details.days || Math.floor(Math.random() * 30) + 1;
      const tradingProfit = Math.random() * amount * 0.1; // 0-10% trading profit
      profitLoss = tradingProfit - (amount * (borrowingAPY / 365) * borrowingDays);
      profitLossPercentage = ((tradingProfit - (amount * (borrowingAPY / 365) * borrowingDays)) / amount) * 100;
      break;
      
    case 'provideLiquidity':
      // Liquidity provision has fees but also impermanent loss risk
      const liquidityFee = amount * RATES.liquidity.fee;
      const impermanentLossLP = Math.random() * 0.08; // 0-8% IL
      profitLoss = liquidityFee - (amount * impermanentLossLP);
      profitLossPercentage = ((liquidityFee - (amount * impermanentLossLP)) / amount) * 100;
      break;
  }
  
  return {
    profitLoss: profitLoss,
    profitLossPercentage: profitLossPercentage,
    marketMovement: marketMovement,
    isProfit: profitLoss > 0
  };
};

/**
 * Generate time-based outcomes for DeFi operations
 */
const generateTimeBasedOutcome = (operation, amount, token) => {
  const outcomes = {
    swap: {
      immediate: 'Transaction completed successfully with minimal slippage.',
      shortTerm: 'Price movement in your favor. Consider holding for better rates.',
      longTerm: 'Market volatility provided opportunities for additional trades.'
    },
    stake: {
      immediate: 'Tokens locked in staking contract. Rewards accumulating.',
      shortTerm: 'Steady returns accumulating. Consider compound staking.',
      longTerm: 'Significant rewards earned. Staking strategy proven effective.'
    },
    yieldFarm: {
      immediate: 'High-yield farming initiated. Monitoring for optimal harvest.',
      shortTerm: 'Excellent returns achieved. Consider rebalancing portfolio.',
      longTerm: 'Outperformed market averages. Farming strategy successful.'
    },
    flashLoan: {
      immediate: 'Flash loan executed successfully. Arbitrage opportunity captured.',
      shortTerm: 'Quick profit realized. Market inefficiency exploited.',
      longTerm: 'Flash loan strategy profitable. Consider scaling operations.'
    },
    lend: {
      immediate: 'Funds deposited in lending pool. Interest earning started.',
      shortTerm: 'Steady income stream established. Lending position profitable.',
      longTerm: 'Consistent returns achieved. Lending strategy sustainable.'
    },
    borrow: {
      immediate: 'Collateral locked. Borrowed funds available for trading.',
      shortTerm: 'Leverage used effectively. Trading profits exceed borrowing costs.',
      longTerm: 'Strategic borrowing successful. Portfolio growth achieved.'
    },
    provideLiquidity: {
      immediate: 'Liquidity provided to pool. Fee earning initiated.',
      shortTerm: 'Trading fees accumulating. Pool participation profitable.',
      longTerm: 'Liquidity provision strategy successful. Passive income established.'
    }
  };
  
  const timeframes = ['immediate', 'shortTerm', 'longTerm'];
  const selectedTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  
  return outcomes[operation]?.[selectedTimeframe] || 'Operation completed successfully.';
};

/**
 * Generate comprehensive feedback for DeFi operations
 */
export const generateDeFiFeedback = (operation, amount, token, details = {}) => {
  const profitLossData = calculateProfitLoss(operation, amount, token, details);
  const timeBasedOutcome = generateTimeBasedOutcome(operation, amount, token);
  
  const feedback = {
    operation: operation,
    amount: amount,
    token: token,
    timestamp: new Date().toISOString(),
    profitLoss: profitLossData.profitLoss,
    profitLossPercentage: profitLossData.profitLossPercentage,
    isProfit: profitLossData.isProfit,
    marketMovement: profitLossData.marketMovement,
    timeBasedOutcome: timeBasedOutcome,
    details: {
      ...details,
      gasUsed: Math.floor(Math.random() * 200000) + 50000, // Simulated gas usage
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64), // Simulated tx hash
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000
    }
  };
  
  // Generate specific messages based on operation
  const messages = {
    swap: {
      title: profitLossData.isProfit ? 'Swap Profitable!' : 'Swap Completed',
      message: profitLossData.isProfit 
        ? `You made a profit of ${Math.abs(profitLossData.profitLoss).toFixed(4)} ${token} (${profitLossData.profitLossPercentage.toFixed(2)}%)`
        : `Swap completed with ${Math.abs(profitLossData.profitLoss).toFixed(4)} ${token} slippage`,
      details: [
        `Market price changed by ${profitLossData.marketMovement.percentageChange.toFixed(2)}%`,
        `Gas used: ${feedback.details.gasUsed.toLocaleString()}`,
        timeBasedOutcome
      ]
    },
    stake: {
      title: 'Staking Successful!',
      message: `Earning ${profitLossData.profitLossPercentage.toFixed(2)}% APY on ${amount} ${token}`,
      details: [
        `Rewards accumulating daily`,
        `Can unstake anytime (with cooldown)`,
        timeBasedOutcome
      ]
    },
    yieldFarm: {
      title: profitLossData.isProfit ? 'Farming Profitable!' : 'Farming Active',
      message: profitLossData.isProfit 
        ? `Earning ${profitLossData.profitLossPercentage.toFixed(2)}% APY on ${amount} ${token}`
        : `High-yield farming active with ${amount} ${token}`,
      details: [
        `Monitoring for optimal harvest timing`,
        `Impermanent loss risk managed`,
        timeBasedOutcome
      ]
    },
    flashLoan: {
      title: profitLossData.isProfit ? 'Arbitrage Successful!' : 'Flash Loan Executed',
      message: profitLossData.isProfit 
        ? `Captured ${Math.abs(profitLossData.profitLoss).toFixed(4)} ${token} arbitrage profit`
        : `Flash loan executed with ${Math.abs(profitLossData.profitLoss).toFixed(4)} ${token} fee`,
      details: [
        `Market inefficiency exploited`,
        `No collateral required`,
        timeBasedOutcome
      ]
    },
    lend: {
      title: 'Lending Active!',
      message: `Earning ${profitLossData.profitLossPercentage.toFixed(2)}% APY on ${amount} ${token}`,
      details: [
        `Steady income stream established`,
        `Funds can be withdrawn anytime`,
        timeBasedOutcome
      ]
    },
    borrow: {
      title: profitLossData.isProfit ? 'Leverage Profitable!' : 'Borrowing Active',
      message: profitLossData.isProfit 
        ? `Trading profits exceed borrowing costs by ${Math.abs(profitLossData.profitLoss).toFixed(4)} ${token}`
        : `Borrowed ${amount} ${token} with collateral locked`,
      details: [
        `Collateral ratio maintained`,
        `Interest rate: ${(RATES.borrowing.min * 100).toFixed(1)}-${(RATES.borrowing.max * 100).toFixed(1)}%`,
        timeBasedOutcome
      ]
    },
    provideLiquidity: {
      title: 'Liquidity Provided!',
      message: `Earning ${profitLossData.profitLossPercentage.toFixed(2)}% in fees on ${amount} ${token}`,
      details: [
        `Trading fees accumulating`,
        `Impermanent loss risk present`,
        timeBasedOutcome
      ]
    }
  };
  
  return {
    ...feedback,
    ...messages[operation]
  };
};

/**
 * Generate educational feedback for DeFi operations
 */
export const generateEducationalFeedback = (operation) => {
  const educationalContent = {
    swap: {
      learning: 'You learned about DEX trading and slippage.',
      tips: [
        'Always check slippage tolerance before swapping',
        'Consider using limit orders for large trades',
        'Monitor gas prices for optimal timing'
      ]
    },
    stake: {
      learning: 'You learned about staking and earning passive income.',
      tips: [
        'Diversify across multiple staking protocols',
        'Consider compound staking for higher returns',
        'Monitor validator performance'
      ]
    },
    yieldFarm: {
      learning: 'You learned about yield farming and impermanent loss.',
      tips: [
        'Understand impermanent loss before providing liquidity',
        'Monitor APY changes and rebalance accordingly',
        'Consider stable pairs for lower IL risk'
      ]
    },
    flashLoan: {
      learning: 'You learned about flash loans and arbitrage.',
      tips: [
        'Flash loans require precise timing and execution',
        'Always calculate fees before executing',
        'Monitor for arbitrage opportunities'
      ]
    },
    lend: {
      learning: 'You learned about DeFi lending and interest rates.',
      tips: [
        'Compare rates across different lending protocols',
        'Monitor collateral ratios',
        'Consider lending stablecoins for lower risk'
      ]
    },
    borrow: {
      learning: 'You learned about borrowing and leverage.',
      tips: [
        'Never borrow more than you can afford to lose',
        'Monitor your health factor closely',
        'Have a plan for repaying borrowed funds'
      ]
    },
    provideLiquidity: {
      learning: 'You learned about liquidity provision and AMMs.',
      tips: [
        'Understand impermanent loss before providing liquidity',
        'Consider stable pairs for lower risk',
        'Monitor pool fees and volume'
      ]
    }
  };
  
  return educationalContent[operation] || {
    learning: 'You completed a DeFi operation successfully.',
    tips: ['Always do your own research', 'Start with small amounts', 'Monitor your positions']
  };
}; 