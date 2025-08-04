// Topic data utility functions
export const getTopicInfo = (scenarioId) => {
  // Map scenarioId to topic information
  const topicMap = {
    'stable-defi-intro': {
      title: 'What is DeFi?',
      description: 'Learn about the core philosophy of decentralized finance, smart contracts, and dApps.',
      educationalContent: [
        'DeFi runs on Smart Contracts. Think of them as vending machines.',
        'You put in a coin (data), and the machine automatically gives you a snack (an outcome).',
        'There\'s no cashier needed. The rules are written in code for everyone to see.'
      ]
    },
    'stable-liquidity-pools': {
      title: 'Understanding Liquidity Pools & AMMs',
      description: 'Discover how liquidity pools enable trading without traditional order books.',
      educationalContent: [
        'Liquidity pools are pools of tokens that enable trading.',
        'AMMs (Automated Market Makers) use mathematical formulas to determine prices.',
        'Providing liquidity earns you trading fees from the pool.'
      ]
    },
    'stable-staking': {
      title: 'Introduction to Staking',
      description: 'Learn how staking tokens helps secure networks while earning rewards.',
      educationalContent: [
        'Staking involves locking up tokens to help secure the network.',
        'In return, you earn rewards in the form of new tokens.',
        'The more tokens you stake, the more rewards you can earn.'
      ]
    },
    'stable-lending': {
      title: 'DeFi Lending & Borrowing',
      description: 'Understand how to lend assets to earn interest or borrow against collateral.',
      educationalContent: [
        'DeFi lending allows you to earn interest on your crypto assets.',
        'Borrowing requires over-collateralization for security.',
        'Interest rates are determined by supply and demand.'
      ]
    },
    'stable-stablecoins': {
      title: 'The Role of Stablecoins',
      description: 'Learn why stablecoins are crucial for providing stability in volatile markets.',
      educationalContent: [
        'Stablecoins maintain a stable value, usually pegged to fiat currencies.',
        'They provide stability in volatile crypto markets.',
        'Stablecoins are essential for DeFi lending and borrowing.'
      ]
    },
    'volatile-yield-farming': {
      title: 'Mastering Yield Farming',
      description: 'Explore advanced strategies to maximize returns across protocols.',
      educationalContent: [
        'Yield farming involves moving assets between protocols to maximize returns.',
        'Higher yields often come with higher risks.',
        'Impermanent loss is a key risk in yield farming.'
      ]
    },
    'volatile-impermanent-loss': {
      title: 'The Risk of Impermanent Loss',
      description: 'Understand the opportunity cost liquidity providers face when prices change.',
      educationalContent: [
        'Impermanent loss occurs when the price ratio of pooled assets changes.',
        'It\'s the difference between holding assets vs providing liquidity.',
        'The loss becomes permanent if you withdraw during unfavorable conditions.'
      ]
    },
    'volatile-liquidation': {
      title: 'Understanding Leverage & Liquidation',
      description: 'Learn how borrowing can amplify gains but also dramatically increase risk.',
      educationalContent: [
        'Leverage amplifies both gains and losses.',
        'Liquidation occurs when collateral value falls below the required threshold.',
        'Health factor indicates how close you are to liquidation.'
      ]
    },
    'volatile-derivatives': {
      title: 'Introduction to DeFi Derivatives',
      description: 'Discover synthetic assets that track real-world prices without owning the underlying.',
      educationalContent: [
        'Derivatives are financial instruments derived from underlying assets.',
        'Synthetic assets track real-world prices without direct ownership.',
        'Options and futures are common DeFi derivative types.'
      ]
    },
    'volatile-dao-governance': {
      title: 'Participating in DAO Governance',
      description: 'Learn how to vote on proposals and shape the future of protocols.',
      educationalContent: [
        'DAOs (Decentralized Autonomous Organizations) are community-governed protocols.',
        'Token holders can vote on proposals that affect the protocol.',
        'Governance tokens represent voting power in the DAO.'
      ]
    },
    'arbitrage-cross-exchange': {
      title: 'Cross-Exchange Arbitrage',
      description: 'Profit from price differences of the same asset across different exchanges.',
      educationalContent: [
        'Arbitrage exploits price differences between markets.',
        'Cross-exchange arbitrage requires fast execution.',
        'Price differences are usually small and short-lived.'
      ]
    },
    'arbitrage-triangular': {
      title: 'Triangular Arbitrage',
      description: 'Execute trades between three assets to profit from price discrepancies.',
      educationalContent: [
        'Triangular arbitrage involves three currency pairs.',
        'It exploits inefficiencies in exchange rates.',
        'The profit comes from the price discrepancy in the triangle.'
      ]
    },
    'arbitrage-flash-loan': {
      title: 'Flash Loans & Flash Swaps',
      description: 'Use uncollateralized loans to execute complex trades within a single transaction.',
      educationalContent: [
        'Flash loans are uncollateralized loans that must be repaid in the same transaction.',
        'They enable complex arbitrage strategies without capital.',
        'Flash swaps are similar but for token swaps.'
      ]
    },
    'arbitrage-cyclical': {
      title: 'Cyclical (Network) Arbitrage',
      description: 'Identify profitable cycles across interconnected liquidity pools.',
      educationalContent: [
        'Cyclical arbitrage exploits inefficiencies across multiple pools.',
        'It involves complex routing through multiple exchanges.',
        'MEV (Maximal Extractable Value) bots often use this strategy.'
      ]
    }
  };

  return topicMap[scenarioId] || {
    title: 'Scenario Interface',
    description: 'Interactive learning scenario',
    educationalContent: ['Learn about DeFi concepts through interactive scenarios.']
  };
};

// Check if current topic is theoretical (no trading operations)
export const isTheoreticalTopic = (scenarioId) => {
  const theoreticalTopics = [
    'stable-defi-intro',
  ];
  return theoreticalTopics.includes(scenarioId);
};

// Get milestone topics that award achievement tokens
export const getMilestoneTopics = () => {
  return [
    'stable-defi-intro',      // First topic of Stable dimension
    'stable-stablecoins',      // Last topic of Stable dimension
    'volatile-yield-farming',  // First topic of Volatile dimension
    'volatile-liquidation',    // Last topic of Volatile dimension
    'arbitrage-cross-exchange', // First topic of Arbitrage dimension
    'arbitrage-flash-loan'     // Last topic of Arbitrage dimension
  ];
};

// Check if a topic is a milestone topic
export const isMilestoneTopic = (scenarioId) => {
  return getMilestoneTopics().includes(scenarioId);
}; 