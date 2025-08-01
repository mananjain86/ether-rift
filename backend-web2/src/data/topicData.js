// Topic data mapping for all dimensions and topics
export const topicData = {
  'Stable': {
    1: {
      title: 'What is DeFi?',
      description: 'Learn about the core philosophy of decentralized finance, smart contracts, and dApps.',
      scenarioId: 'stable-defi-intro',
      educationalContent: [
        'Welcome to Decentralized Finance (DeFi)! In the world you know, banks and brokers are in the middle of every transaction. DeFi removes them.',
        'DeFi runs on Smart Contracts. Think of them as vending machines. You put in a coin (data), and the machine automatically gives you a snack (an outcome).',
        'Let\'s try it. Below is a public guestbook running on a smart contract. Signing it doesn\'t cost anything in this simulation.',
        'Success! Your address is now permanently part of the guestbook\'s history on the blockchain.'
      ]
    },
    2: {
      title: 'Understanding Liquidity Pools & AMMs',
      description: 'Discover how liquidity pools enable trading without traditional order books.',
      scenarioId: 'stable-liquidity-pools',
      educationalContent: [
        'Welcome! How do you trade without a company like the New York Stock Exchange matching buyers and sellers?',
        'A pool needs tokens to work. People who deposit tokens into the pool are called Liquidity Providers, or LPs.',
        'Let\'s try it. We have a pool for vETH and vUSDC. To become an LP, you must deposit an equal value of both tokens.',
        'Great! You are now a Liquidity Provider. Watch as other simulated traders swap vETH and vUSDC in the pool.'
      ]
    },
    3: {
      title: 'Introduction to Staking',
      description: 'Learn how staking tokens helps secure networks while earning rewards.',
      scenarioId: 'stable-staking',
      educationalContent: [
        'Staking is one of the most fundamental ways to earn in crypto. Many blockchains use a system called Proof-of-Stake.',
        'People who stake tokens and run the software to validate transactions are called Validators.',
        'You don\'t need to be a full validator to participate. You can join a staking pool and contribute your tokens.',
        'Excellent! Your tokens are now staked. Notice the Rewards counter. Every few seconds, new rewards are distributed.'
      ]
    },
    4: {
      title: 'DeFi Lending & Borrowing',
      description: 'Understand how to lend assets to earn interest or borrow against collateral.',
      scenarioId: 'stable-lending',
      educationalContent: [
        'This module introduces DeFi\'s version of banking. Users learn how they can lend their assets to earn interest.',
        'The core concept of over-collateralization is explained as a key risk-management tool for lenders.',
        'The user\'s task will be to deposit one asset as collateral and then borrow a smaller amount of another asset.',
        'Understanding the Loan-to-Value (LTV) ratio is crucial for safe borrowing.'
      ]
    },
    5: {
      title: 'The Role of Stablecoins',
      description: 'Learn why stablecoins are crucial for providing stability in volatile markets.',
      scenarioId: 'stable-stablecoins',
      educationalContent: [
        'Cryptocurrencies like Bitcoin and Ether can be very volatile. Their prices can swing wildly in a single day.',
        'A stablecoin is a special type of cryptocurrency that is pegged to a stable asset, usually the U.S. Dollar.',
        'Let\'s see this in action. You currently hold 1 vETH, worth $1,000. The market looks like it\'s about to go down.',
        'Oh no, the price of vETH just dropped 20% to $800! But because you swapped to the stablecoin vUSDC, your portfolio is still worth $1,000.'
      ]
    }
  },
  'Volatile': {
    1: {
      title: 'Mastering Yield Farming',
      description: 'Explore advanced strategies to maximize returns across protocols.',
      scenarioId: 'volatile-yield-farming',
      educationalContent: [
        'You\'ve learned about providing liquidity and staking. Yield Farming combines these ideas into a powerful strategy.',
        'Instead of just holding them and earning trading fees, you can put them to work again.',
        'This is a live environment. Every action is a real transaction. First, go to our simulated DEX and deposit vETH and vUSDC.',
        'Transaction confirmed! You now have LP tokens. Now, come back here and stake those LP tokens into our Yield Farm.'
      ]
    },
    2: {
      title: 'The Risk of Impermanent Loss',
      description: 'Understand the opportunity cost liquidity providers face when prices change.',
      scenarioId: 'volatile-impermanent-loss',
      educationalContent: [
        'Providing liquidity is a great way to earn fees, but it comes with a unique risk called Impermanent Loss.',
        'Let\'s see it live. We will track two portfolios for you. Portfolio HODL will just hold 1 vETH and 1,000 vUSDC.',
        'Now, watch the market. The price of vETH is rising! As it rises, the AMM sells some of your vETH for vUSDC.',
        'The price of vETH has doubled to $2,000. Your Portfolio HODL is now worth $3,000. Your Portfolio LP is only worth ~$2,828.'
      ]
    },
    3: {
      title: 'Understanding Leverage & Liquidation',
      description: 'Learn how borrowing can amplify gains but also dramatically increase risk.',
      scenarioId: 'volatile-liquidation',
      educationalContent: [
        'Leverage allows you to borrow funds to increase your investment size, amplifying potential profits.',
        'Let\'s try a live leveraged trade. First, deposit 1 vETH (worth $1,000) as collateral. This is your first transaction.',
        'Now that your collateral is deposited, you can borrow against it. Let\'s borrow 500 vUSDC.',
        'Watch the price of vETH. It\'s falling! As it falls, the value of your collateral decreases, and your Health Factor gets worse.'
      ]
    },
    4: {
      title: 'Introduction to DeFi Derivatives',
      description: 'Discover synthetic assets that track real-world prices without owning the underlying.',
      scenarioId: 'volatile-derivatives',
      educationalContent: [
        'This module introduces the concept of synthetic assets (synths).',
        'Users will learn that a derivative is a contract whose value is derived from an underlying asset.',
        'The exercise will involve minting a synth that tracks the price of a real-world asset (e.g., sGOLD).',
        'This demonstrates a core component of advanced DeFi.'
      ]
    },
    5: {
      title: 'Participating in DAO Governance',
      description: 'Learn how to vote on proposals and shape the future of protocols.',
      scenarioId: 'volatile-dao-governance',
      educationalContent: [
        'Users learn that many DeFi protocols are governed by their communities through Decentralized Autonomous Organizations (DAOs).',
        'The concepts of governance tokens and voting on proposals are explained.',
        'The interactive task will be to use their earned achievement tokens to vote on a simulated protocol proposal.',
        'This demonstrates how they can have a say in a project\'s future.'
      ]
    }
  },
  'Arbitrage': {
    1: {
      title: 'Cross-Exchange Arbitrage',
      description: 'Profit from price differences of the same asset across different exchanges.',
      scenarioId: 'arbitrage-cross-exchange',
      educationalContent: [
        'Welcome, trader. Arbitrage is the art of profiting from price differences across markets.',
        'The strategy is simple: buy vETH on the exchange where it\'s cheaper, and immediately sell it on the exchange where it\'s more expensive.',
        'This is a live environment. Every trade is a real on-chain transaction. The opportunity is clear: Buy vETH on CryptoMart at $995.',
        'Transaction confirmed! You now own 10 vETH. Quick, before the prices converge! Sell those 10 vETH on DigitalBay for $1,010.'
      ]
    },
    2: {
      title: 'Triangular Arbitrage',
      description: 'Execute trades between three assets to profit from price discrepancies.',
      scenarioId: 'arbitrage-triangular',
      educationalContent: [
        'This module introduces a more complex strategy where users exploit price discrepancies between three different assets.',
        'The guided exercise will have them trade Asset A for Asset B, then Asset B for Asset C, and finally Asset C back to Asset A.',
        'This strategy can be executed all within one simulated trading venue.',
        'The goal is to end up with more of Asset A than they started with.'
      ]
    },
    3: {
      title: 'Flash Loans & Flash Swaps',
      description: 'Use uncollateralized loans to execute complex trades within a single transaction.',
      scenarioId: 'arbitrage-flash-loan',
      educationalContent: [
        'What if you could borrow millions of dollars, with zero collateral? Welcome to Flash Loans.',
        'It\'s possible because of atomicity on the blockchain. A transaction is all or nothing.',
        'We\'ve spotted a huge arbitrage opportunity, but you need 100,000 vUSDC to execute it.',
        'Click Execute Flash Loan. This single on-chain action will borrow, trade, and repay all in one instant.'
      ]
    },
    4: {
      title: 'Cyclical (Network) Arbitrage',
      description: 'Identify profitable cycles across interconnected liquidity pools.',
      scenarioId: 'arbitrage-cyclical',
      educationalContent: [
        'This is the pinnacle of arbitrage strategy within the game. It builds on triangular arbitrage.',
        'It shows how opportunities can exist across multiple protocols in a complex loop.',
        'The user will be presented with a visual graph of interconnected liquidity pools across different simulated DEXs.',
        'Their task will be to identify a profitable cycle and execute it as a single, complex transaction.'
      ]
    }
  }
}; 