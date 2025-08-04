import React, { useState } from 'react';

const EducationalScript = ({ scenarioId, onAction }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const getEducationalScripts = (scenarioId) => {
    const scripts = {
      'stable-defi-intro': [
        {
          step: 1,
          title: 'Welcome to the New Frontier',
          content: 'Welcome to Decentralized Finance (DeFi)! In the world you know, banks and brokers are in the middle of every transaction. DeFi removes them. Here, code is law, and you are in complete control of your assets.',
          action: 'Sign Guestbook',
          actionFunction: 'signGuestbook',
          realMarketApplication: 'This concept applies to all DeFi protocols - you interact directly with smart contracts without intermediaries.'
        },
        {
          step: 2,
          title: 'The Power of Smart Contracts',
          content: 'DeFi runs on Smart Contracts. Think of them as vending machines. You put in a coin (data), and the machine automatically gives you a snack (an outcome). There\'s no cashier needed.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Smart contracts power all DeFi protocols like Uniswap, Aave, and Compound.'
        },
        {
          step: 3,
          title: 'Your First Interaction',
          content: 'Let\'s try it. Click \'Sign Guestbook\' to add your wallet address to the public record. This is your first interaction with a dApp (Decentralized Application)!',
          action: 'Sign Guestbook',
          actionFunction: 'signGuestbook',
          realMarketApplication: 'This is similar to how you interact with any DeFi protocol - through wallet connections and transaction signing.'
        },
        {
          step: 4,
          title: 'On-Chain Confirmation',
          content: 'Success! Your address is now permanently part of the guestbook\'s history on the blockchain. You\'ve just experienced the transparency and user control that defines DeFi.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'This transparency is what makes DeFi revolutionary - all transactions are public and verifiable.',
          links: [
            { name: 'Learn More About DeFi', url: 'https://ethereum.org/en/defi/' },
            { name: 'Smart Contracts Guide', url: 'https://ethereum.org/en/developers/docs/smart-contracts/' }
          ]
        }
      ],
      'stable-liquidity-pools': [
        {
          step: 1,
          title: 'The Heart of Decentralized Trading',
          content: 'How do you trade without a company like the New York Stock Exchange matching buyers and sellers? In DeFi, the answer is Liquidity Pools. These are giant pools of tokens, supplied by users like you, that anyone can trade against.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Liquidity pools are used in DEXs like Uniswap, SushiSwap, and PancakeSwap.'
        },
        {
          step: 2,
          title: 'Becoming a Liquidity Provider (LP)',
          content: 'A pool needs tokens to work. People who deposit tokens into the pool are called Liquidity Providers, or LPs. In return for providing their assets, they earn a small fee from every single trade that happens in that pool.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'You can become an LP on any DEX by providing token pairs.'
        },
        {
          step: 3,
          title: 'Your Turn to Provide Liquidity',
          content: 'Let\'s try it. We have a pool for vETH and vUSDC. To become an LP, you must deposit an equal value of both tokens. Click \'Provide Liquidity\' to add your tokens to the pool.',
          action: 'Provide Liquidity',
          actionFunction: 'provideLiquidity',
          realMarketApplication: 'This is exactly how you provide liquidity on Uniswap or other DEXs.'
        },
        {
          step: 4,
          title: 'Earning Fees',
          content: 'Great! You are now a Liquidity Provider. Watch as other simulated traders swap vETH and vUSDC in the pool. With each trade, a small fee is added back to the pool, and your share of the pool grows.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'LP fees are typically 0.3% on Uniswap V2 and 0.05% on Uniswap V3.'
        },
        {
          step: 5,
          title: 'The AMM - The Magic Formula',
          content: 'The pool\'s prices are set by an Automated Market Maker (AMM). It\'s a simple algorithm that automatically adjusts the price based on the ratio of tokens in the pool after each swap.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'AMMs are the backbone of all decentralized exchanges.',
          links: [
            { name: 'Uniswap Documentation', url: 'https://docs.uniswap.org/' },
            { name: 'Liquidity Mining Guide', url: 'https://uniswap.org/blog/uniswap-v3/' }
          ]
        }
      ],
      'stable-staking': [
        {
          step: 1,
          title: 'Earn Rewards for Securing the Network',
          content: 'Staking is one of the most fundamental ways to earn in crypto. Many blockchains use a system called \'Proof-of-Stake\' to validate transactions. By \'staking\' or locking up your tokens, you help secure the network, and in return, you earn rewards.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Staking is available on Ethereum, Cardano, Polkadot, and many other PoS blockchains.'
        },
        {
          step: 2,
          title: 'The Validator\'s Role',
          content: 'People who stake tokens and run the software to validate transactions are called \'Validators.\' They are the modern-day equivalent of miners in Bitcoin. They are rewarded with new tokens for their service.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'You can stake ETH on Ethereum 2.0 or use staking services like Lido.'
        },
        {
          step: 3,
          title: 'Stake Your Tokens',
          content: 'You don\'t need to be a full validator to participate. You can join a \'staking pool\' and contribute your tokens. Let\'s stake 100 of your Achievement Tokens (ERA) into the EtherRift validator pool.',
          action: 'Stake Tokens',
          actionFunction: 'stake',
          realMarketApplication: 'This is similar to staking on platforms like Binance, Coinbase, or Lido.'
        },
        {
          step: 4,
          title: 'Watch Your Rewards Grow',
          content: 'Excellent! Your tokens are now staked. Notice the \'Rewards\' counter. Every few seconds, new rewards are distributed to the pool, and your balance increases. This is a powerful form of passive income in the DeFi world.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Staking rewards typically range from 4-12% APY depending on the network.',
          links: [
            { name: 'Ethereum Staking Guide', url: 'https://ethereum.org/en/staking/' },
            { name: 'Lido Staking', url: 'https://lido.fi/' }
          ]
        }
      ],
      'stable-stablecoins': [
        {
          step: 1,
          title: 'Taming the Volatility',
          content: 'Cryptocurrencies like Bitcoin and Ether can be very volatile. Their prices can swing wildly in a single day. This makes them difficult to use for everyday payments or as a stable place to store your money. This is where stablecoins come in.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Stablecoins are used in DeFi for lending, borrowing, and as a stable store of value.'
        },
        {
          step: 2,
          title: 'What is a Stablecoin?',
          content: 'A stablecoin is a special type of cryptocurrency that is \'pegged\' to a stable asset, usually the U.S. Dollar. The goal is for 1 stablecoin (like USDC or DAI) to always be worth $1.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'USDC, USDT, and DAI are the most popular stablecoins used in DeFi.'
        },
        {
          step: 3,
          title: 'Hedging Against Risk',
          content: 'Let\'s see this in action. You currently hold 1 vETH, worth $1,000. The market looks like it\'s about to go down. Swap your 1 vETH for 1,000 vUSDC to protect your value.',
          action: 'Swap to Stablecoin',
          actionFunction: 'swap',
          realMarketApplication: 'This is a common strategy used by traders to protect against market downturns.'
        },
        {
          step: 4,
          title: 'The Market Dip',
          content: 'Oh no, the price of vETH just dropped 20% to $800! But because you swapped to the stablecoin vUSDC, your portfolio is still worth $1,000. You successfully used a stablecoin to hedge against market risk.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'This hedging strategy is used by institutional investors and retail traders alike.',
          links: [
            { name: 'USDC Documentation', url: 'https://www.circle.com/en/usdc' },
            { name: 'DAI Documentation', url: 'https://docs.makerdao.com/' }
          ]
        }
      ],
      'volatile-yield-farming': [
        {
          step: 1,
          title: 'The Next Level of Earning',
          content: 'You\'ve learned about providing liquidity and staking. Yield Farming combines these ideas into a powerful, multi-layered strategy to maximize your returns. It\'s often called \'liquidity mining.\'',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Yield farming is popular on platforms like Curve, Yearn Finance, and Compound.'
        },
        {
          step: 2,
          title: 'Using Your LP Tokens',
          content: 'Remember those LP tokens you received for providing liquidity? Instead of just holding them and earning trading fees, you can put them to work again. Many protocols have \'farms\' where you can stake your LP tokens to earn another reward token.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This is how protocols incentivize liquidity provision with additional token rewards.'
        },
        {
          step: 3,
          title: 'A Live Yield Farm',
          content: 'This is a live environment. Every action is a real transaction. First, go to our simulated DEX and deposit vETH and vUSDC into the liquidity pool. You will receive LP tokens in your wallet.',
          action: 'Provide Liquidity',
          actionFunction: 'provideLiquidity',
          realMarketApplication: 'This is the first step in any yield farming strategy - providing liquidity to earn LP tokens.'
        },
        {
          step: 4,
          title: 'Stake Your LP Tokens',
          content: 'Transaction confirmed! You now have LP tokens. Now, come back here and stake those LP tokens into our \'Yield Farm.\' This will also require a transaction. Once confirmed, you will start earning our Achievement Token (ERA) as an additional reward.',
          action: 'Yield Farm',
          actionFunction: 'yieldFarm',
          realMarketApplication: 'This is exactly how yield farming works on platforms like Curve, Yearn, and SushiSwap.',
          links: [
            { name: 'Curve Finance', url: 'https://curve.fi/' },
            { name: 'Yearn Finance', url: 'https://yearn.finance/' }
          ]
        },
        {
          step: 5,
          title: 'Yield Farming Complete',
          content: 'Congratulations! You\'ve successfully completed a yield farming strategy. You\'re now earning multiple layers of rewards: trading fees from the liquidity pool AND additional tokens from the yield farm.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Yield farming can generate 20-100%+ APY but comes with higher risks.',
          links: [
            { name: 'DeFi Pulse', url: 'https://defipulse.com/' },
            { name: 'Yield Farming Guide', url: 'https://academy.binance.com/en/articles/what-is-yield-farming-in-defi' }
          ]
        }
      ],
      'arbitrage-cross-exchange': [
        {
          step: 1,
          title: 'The Arbitrage Opportunity',
          content: 'Welcome, trader. Arbitrage is the art of profiting from price differences across markets. It\'s a cornerstone of efficient markets. Here, you\'ll see two exchanges: CryptoMart and DigitalBay. Notice the price of vETH is different on each.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Arbitrage opportunities exist across all exchanges and DEXs.'
        },
        {
          step: 2,
          title: 'The Strategy: Buy Low, Sell High',
          content: 'The strategy is simple: buy vETH on the exchange where it\'s cheaper, and immediately sell it on the exchange where it\'s more expensive. The difference, minus transaction fees, is your risk-free profit.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This is the fundamental arbitrage strategy used by traders worldwide.'
        },
        {
          step: 3,
          title: 'Execute the Buy Order',
          content: 'This is a live environment. Every trade is a real on-chain transaction. The opportunity is clear: Buy vETH on CryptoMart at $995. Let\'s buy 10 vETH. Click \'Buy\' and confirm the transaction in your wallet.',
          action: 'Buy vETH',
          actionFunction: 'swap',
          realMarketApplication: 'This is how arbitrage traders execute their strategies in real markets.'
        },
        {
          step: 4,
          title: 'Execute the Sell Order',
          content: 'Transaction confirmed! You now own 10 vETH. Quick, before the prices converge! Sell those 10 vETH on DigitalBay for $1,010. Click \'Sell\' and confirm the transaction.',
          action: 'Sell vETH',
          actionFunction: 'swap',
          realMarketApplication: 'Speed is crucial in arbitrage - prices can converge quickly.'
        },
        {
          step: 5,
          title: 'Profit Realized',
          content: 'Success! You bought for $9,950 and sold for $10,100. After accounting for gas fees, you\'ve made a profit. You acted as an arbitrageur, helping to make the market more efficient. Well done.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Arbitrage helps keep prices consistent across markets.',
          links: [
            { name: 'Arbitrage Guide', url: 'https://academy.binance.com/en/articles/what-is-arbitrage-trading' },
            { name: 'DEX Aggregators', url: 'https://1inch.io/' }
          ]
        }
      ],
      'arbitrage-flash-loan': [
        {
          step: 1,
          title: 'The Ultimate DeFi Tool',
          content: 'What if you could borrow millions of dollars, with zero collateral? Welcome to Flash Loans, one of DeFi\'s most powerful innovations. A flash loan is an uncollateralized loan that must be borrowed and repaid in the exact same transaction.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Flash loans are available on Aave, dYdX, and other DeFi protocols.'
        },
        {
          step: 2,
          title: 'How is this possible?',
          content: 'It\'s possible because of \'atomicity\' on the blockchain. A transaction is all or nothing. If you can\'t pay back the loan by the end of the transaction, the entire thing—the loan, the trades, everything—is reversed as if it never happened.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This atomicity is what makes flash loans possible and safe.'
        },
        {
          step: 3,
          title: 'Your First Flash Loan Arbitrage',
          content: 'We\'ve spotted a huge arbitrage opportunity, but you need 100,000 vUSDC to execute it. You don\'t have that, but the protocol does. We are going to construct a single, complex transaction for you.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Flash loans are commonly used for arbitrage and liquidation.'
        },
        {
          step: 4,
          title: 'The Atomic Transaction',
          content: 'Click \'Execute Flash Loan.\' This single on-chain action will: 1. Borrow 100,000 vUSDC via a flash loan. 2. Use it to buy cheap vETH on CryptoMart. 3. Sell the vETH on DigitalBay for a profit. 4. Repay the 100,000 vUSDC loan plus a small fee. 5. Deposit the remaining profit into your wallet. All in one instant.',
          action: 'Execute Flash Loan',
          actionFunction: 'flashLoan',
          realMarketApplication: 'This is exactly how flash loan arbitrage works in real DeFi.',
          links: [
            { name: 'Aave Flash Loans', url: 'https://docs.aave.com/developers/guides/flash-loans' },
            { name: 'Flash Loan Guide', url: 'https://academy.binance.com/en/articles/what-are-flash-loans-in-defi' }
          ]
        },
        {
          step: 5,
          title: 'The Power of Capital Efficiency',
          content: 'Transaction successful! You just used a massive amount of capital you didn\'t have to make a profit. This is the ultimate example of capital efficiency in DeFi. Flash loans are used by advanced traders to keep markets efficient.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Flash loans are a powerful tool for capital-efficient trading.',
          links: [
            { name: 'dYdX Flash Loans', url: 'https://docs.dydx.exchange/' },
            { name: 'Flash Loan Security', url: 'https://consensys.net/blog/defi/flash-loans-and-their-security-implications/' }
          ]
        }
      ],
      'stable-lending': [
        {
          step: 1,
          title: 'DeFi Lending & Borrowing',
          content: 'Welcome to DeFi lending! Unlike traditional banks, DeFi lending protocols allow anyone to lend or borrow assets without intermediaries. Interest rates are determined by supply and demand.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'DeFi lending is available on platforms like Aave, Compound, and MakerDAO.'
        },
        {
          step: 2,
          title: 'How DeFi Lending Works',
          content: 'When you lend assets, you earn interest. When you borrow, you must provide collateral worth more than your loan amount. This over-collateralization protects the protocol.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Over-collateralization is a key security feature in DeFi lending.'
        },
        {
          step: 3,
          title: 'Lend Your Tokens',
          content: 'Let\'s lend some vUSDC to earn interest. Click \'Lend Tokens\' to deposit your vUSDC into the lending pool.',
          action: 'Lend Tokens',
          actionFunction: 'lend',
          realMarketApplication: 'This is how you lend assets on Aave or Compound.'
        },
        {
          step: 4,
          title: 'Borrow Against Collateral',
          content: 'Now let\'s borrow some vUSDC using your vETH as collateral. You can borrow up to 70% of your collateral value.',
          action: 'Borrow Tokens',
          actionFunction: 'borrow',
          realMarketApplication: 'This is how you borrow assets in DeFi lending protocols.',
          links: [
            { name: 'Aave Documentation', url: 'https://docs.aave.com/' },
            { name: 'Compound Documentation', url: 'https://docs.compound.finance/' }
          ]
        },
        {
          step: 5,
          title: 'Lending Complete',
          content: 'Excellent! You\'ve successfully participated in DeFi lending. You\'re now earning interest on your lent assets and can borrow against your collateral.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'DeFi lending provides better rates than traditional banking.',
          links: [
            { name: 'DeFi Lending Guide', url: 'https://academy.binance.com/en/articles/what-is-defi-lending' },
            { name: 'Interest Rate Comparison', url: 'https://defipulse.com/' }
          ]
        }
      ],
      'volatile-impermanent-loss': [
        {
          step: 1,
          title: 'Understanding Impermanent Loss',
          content: 'Impermanent loss is a risk that liquidity providers face when the price ratio of their pooled assets changes. It\'s the difference between holding assets vs providing liquidity.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Impermanent loss affects all liquidity providers on DEXs like Uniswap.'
        },
        {
          step: 2,
          title: 'Why Does It Happen?',
          content: 'When you provide liquidity, you deposit equal values of two tokens. If one token\'s price changes relative to the other, you may end up with fewer tokens than if you had just held them.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This is a fundamental risk in automated market making.'
        },
        {
          step: 3,
          title: 'Simulate Impermanent Loss',
          content: 'Let\'s provide liquidity to a vETH/vUSDC pool and watch what happens when vETH price changes. Click \'Provide Liquidity\' to start.',
          action: 'Provide Liquidity',
          actionFunction: 'provideLiquidity',
          realMarketApplication: 'This demonstrates the real risk of impermanent loss.'
        },
        {
          step: 4,
          title: 'Price Movement Impact',
          content: 'Notice how the price of vETH has changed! Your liquidity position has been affected. This is impermanent loss in action.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Price movements can significantly impact LP returns.',
          links: [
            { name: 'Impermanent Loss Calculator', url: 'https://baller.netlify.app/' },
            { name: 'Understanding IL', url: 'https://academy.binance.com/en/articles/impermanent-loss-explained' }
          ]
        },
        {
          step: 5,
          title: 'Managing the Risk',
          content: 'Impermanent loss can be offset by trading fees, but it\'s important to understand this risk. Stable pairs like USDC/DAI have lower IL risk.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Understanding IL helps make informed LP decisions.',
          links: [
            { name: 'IL Risk Management', url: 'https://uniswap.org/blog/uniswap-v3/' },
            { name: 'LP Strategies', url: 'https://docs.uniswap.org/concepts/protocol/overview' }
          ]
        }
      ],
      'volatile-liquidation': [
        {
          step: 1,
          title: 'Understanding Leverage & Liquidation',
          content: 'Leverage amplifies both gains and losses. When you borrow in DeFi, you must maintain a minimum collateral ratio. If your collateral value drops, you risk liquidation.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Liquidation risk exists in all DeFi lending protocols.'
        },
        {
          step: 2,
          title: 'How Liquidation Works',
          content: 'If your collateral value falls below the required threshold, anyone can liquidate your position. They pay off your debt and receive your collateral at a discount.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Liquidations help maintain protocol solvency.'
        },
        {
          step: 3,
          title: 'Borrow with Leverage',
          content: 'Let\'s borrow vUSDC using vETH as collateral. We\'ll use a high loan-to-value ratio to demonstrate liquidation risk.',
          action: 'Borrow with Leverage',
          actionFunction: 'borrow',
          realMarketApplication: 'This shows how leverage works in DeFi.'
        },
        {
          step: 4,
          title: 'Market Crash Simulation',
          content: 'Oh no! The price of vETH has dropped significantly. Your position is now at risk of liquidation. This demonstrates the danger of high leverage.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Market volatility can quickly lead to liquidations.',
          links: [
            { name: 'Liquidation Guide', url: 'https://docs.aave.com/developers/guides/liquidations' },
            { name: 'Risk Management', url: 'https://academy.binance.com/en/articles/what-is-liquidation-in-crypto-trading' }
          ]
        },
        {
          step: 5,
          title: 'Risk Management',
          content: 'Always maintain healthy collateral ratios and monitor your positions. Liquidation can result in significant losses.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Proper risk management is crucial in DeFi.',
          links: [
            { name: 'DeFi Risk Management', url: 'https://consensys.net/blog/defi/' },
            { name: 'Liquidation Protection', url: 'https://docs.aave.com/developers/guides/liquidations' }
          ]
        }
      ],
      'volatile-derivatives': [
        {
          step: 1,
          title: 'Introduction to DeFi Derivatives',
          content: 'Derivatives are financial instruments whose value is derived from an underlying asset. In DeFi, derivatives allow you to gain exposure to assets without owning them directly, or to hedge against price movements.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'DeFi derivatives are available on platforms like Synthetix, dYdX, and Perpetual Protocol.'
        },
        {
          step: 2,
          title: 'Types of DeFi Derivatives',
          content: 'Common DeFi derivatives include perpetual futures, options, and synthetic assets. Perpetual futures allow you to trade with leverage, while options give you the right (but not obligation) to buy or sell.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'These instruments are used for speculation, hedging, and portfolio management.'
        },
        {
          step: 3,
          title: 'Trading Perpetual Futures',
          content: 'Let\'s trade a perpetual future on vETH. You can go long (bet on price increase) or short (bet on price decrease) with leverage. Click \'Trade Derivatives\' to start.',
          action: 'Trade Derivatives',
          actionFunction: 'swap',
          realMarketApplication: 'This demonstrates how perpetual futures work in DeFi.'
        },
        {
          step: 4,
          title: 'Leverage and Risk',
          content: 'Notice how small price movements can have large impacts on your position due to leverage. This is the power and risk of derivatives trading.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Leverage amplifies both gains and losses in derivatives trading.',
          links: [
            { name: 'DeFi Derivatives Guide', url: 'https://docs.synthetix.io/' },
            { name: 'Perpetual Futures', url: 'https://docs.dydx.exchange/' }
          ]
        },
        {
          step: 5,
          title: 'Risk Management in Derivatives',
          content: 'Always use stop-loss orders and never risk more than you can afford to lose. Derivatives can lead to significant losses if not managed properly.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Proper risk management is essential in derivatives trading.',
          links: [
            { name: 'Derivatives Risk Management', url: 'https://academy.binance.com/en/articles/what-are-derivatives' },
            { name: 'DeFi Trading Strategies', url: 'https://docs.perpetualprotocol.com/' }
          ]
        }
      ],
      'volatile-dao-governance': [
        {
          step: 1,
          title: 'Participating in DAO Governance',
          content: 'DAOs (Decentralized Autonomous Organizations) are community-governed protocols. Token holders can vote on proposals that affect the protocol\'s future.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Major DeFi protocols like Uniswap, Compound, and Aave are DAOs.'
        },
        {
          step: 2,
          title: 'Governance Tokens',
          content: 'Governance tokens represent voting power in the DAO. The more tokens you hold, the more influence you have on protocol decisions.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'UNI, COMP, and AAVE are governance tokens.'
        },
        {
          step: 3,
          title: 'Voting on Proposals',
          content: 'Let\'s vote on a proposal to change the protocol\'s fee structure. Your ERA tokens give you voting power.',
          action: 'Vote on Proposal',
          actionFunction: 'vote',
          realMarketApplication: 'This is how governance voting works in real DAOs.'
        },
        {
          step: 4,
          title: 'Governance in Action',
          content: 'Your vote has been recorded! DAO governance allows communities to make collective decisions about protocol development.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Governance is a key feature of decentralized protocols.',
          links: [
            { name: 'Uniswap Governance', url: 'https://gov.uniswap.org/' },
            { name: 'Compound Governance', url: 'https://compound.finance/governance' }
          ]
        },
        {
          step: 5,
          title: 'Governance Complete',
          content: 'You\'ve successfully participated in DAO governance! This is the future of decentralized decision-making.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'DAO governance is revolutionizing organizational structures.',
          links: [
            { name: 'DAO Governance Guide', url: 'https://academy.binance.com/en/articles/what-is-a-dao' },
            { name: 'Governance Best Practices', url: 'https://docs.snapshot.org/' }
          ]
        }
      ],
      'arbitrage-triangular': [
        {
          step: 1,
          title: 'Triangular Arbitrage',
          content: 'Triangular arbitrage involves three currency pairs. It exploits inefficiencies in exchange rates to make risk-free profits.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Triangular arbitrage is used by trading bots and arbitrageurs.'
        },
        {
          step: 2,
          title: 'How It Works',
          content: 'You trade Token A for Token B, then Token B for Token C, and finally Token C back to Token A. If done correctly, you end up with more Token A than you started with.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This strategy exploits price inefficiencies across multiple pairs.'
        },
        {
          step: 3,
          title: 'Execute Triangular Arbitrage',
          content: 'Let\'s execute a triangular arbitrage: vETH → vUSDC → vDAI → vETH. Click \'Execute Arbitrage\' to start.',
          action: 'Execute Arbitrage',
          actionFunction: 'swap',
          realMarketApplication: 'This demonstrates triangular arbitrage in action.'
        },
        {
          step: 4,
          title: 'Profit Realized',
          content: 'Success! You\'ve completed the triangular arbitrage and made a profit. This is how arbitrageurs keep markets efficient.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Arbitrage helps maintain price consistency across markets.',
          links: [
            { name: 'Arbitrage Guide', url: 'https://academy.binance.com/en/articles/what-is-arbitrage-trading' },
            { name: 'Trading Bots', url: 'https://docs.binance.com/' }
          ]
        },
        {
          step: 5,
          title: 'Arbitrage Complete',
          content: 'You\'ve successfully executed triangular arbitrage! This strategy is fundamental to market efficiency.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Arbitrage opportunities are constantly being exploited by bots.',
          links: [
            { name: 'Advanced Arbitrage', url: 'https://docs.binance.com/' },
            { name: 'MEV and Arbitrage', url: 'https://ethereum.org/en/developers/docs/mev/' }
          ]
        }
      ],
      'arbitrage-cross-exchange': [
        {
          step: 1,
          title: 'Introduction to Cross-Exchange Arbitrage',
          content: 'Arbitrage is the practice of profiting from price differences between markets. Cross-exchange arbitrage involves buying an asset on one exchange where it\'s cheaper and selling it on another where it\'s more expensive.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This strategy is used across all cryptocurrency exchanges.'
        },
        {
          step: 2,
          title: 'How Arbitrage Works',
          content: 'When the same asset trades at different prices on different exchanges, arbitrageurs step in to profit from the difference. This activity helps keep prices aligned across markets.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Arbitrage opportunities exist in all financial markets.'
        },
        {
          step: 3,
          title: 'Execute Cross-Exchange Arbitrage',
          content: 'Let\'s find a price difference between Exchange A and Exchange B. We\'ll buy vETH on the cheaper exchange and sell it on the more expensive one. Click \'Execute Arbitrage\' to start.',
          action: 'Execute Arbitrage',
          actionFunction: 'swap',
          realMarketApplication: 'This demonstrates real arbitrage execution.'
        },
        {
          step: 4,
          title: 'Profit Calculation',
          content: 'After fees and transaction costs, we\'ve made a profit! This is the essence of arbitrage - capturing price inefficiencies.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Arbitrage profits are typically small but consistent.',
          links: [
            { name: 'Arbitrage Strategies', url: 'https://academy.binance.com/en/articles/what-is-arbitrage-trading' },
            { name: 'Exchange APIs', url: 'https://docs.binance.us/' }
          ]
        },
        {
          step: 5,
          title: 'Arbitrage in DeFi',
          content: 'In DeFi, arbitrage opportunities exist between different DEXs, between DEXs and CEXs, and even within the same DEX across different pools.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'DeFi arbitrage is a major source of MEV (Maximal Extractable Value).',
          links: [
            { name: 'DeFi Arbitrage', url: 'https://docs.uniswap.org/concepts/advanced-topics/mev' },
            { name: 'MEV and Arbitrage', url: 'https://ethereum.org/en/developers/docs/mev/' }
          ]
        }
      ],
      'arbitrage-flash-loan': [
        {
          step: 1,
          title: 'Introduction to Flash Loans',
          content: 'Flash loans allow you to borrow any amount of assets without collateral, as long as you return the borrowed amount plus fees in the same transaction. This enables complex arbitrage strategies.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Flash loans are available on platforms like Aave, dYdX, and Uniswap V3.'
        },
        {
          step: 2,
          title: 'How Flash Loans Work',
          content: 'The key requirement is that the borrowed amount must be returned within the same blockchain transaction. If not, the entire transaction reverts, making it risk-free for the lender.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This is a unique DeFi innovation not possible in traditional finance.'
        },
        {
          step: 3,
          title: 'Execute Flash Loan Arbitrage',
          content: 'Let\'s use a flash loan to execute arbitrage. We\'ll borrow vETH, use it to exploit a price difference, then repay the loan with the profit. Click \'Execute Flash Loan\' to start.',
          action: 'Execute Flash Loan',
          actionFunction: 'flashLoan',
          realMarketApplication: 'This demonstrates flash loan arbitrage execution.'
        },
        {
          step: 4,
          title: 'Profit from Flash Loan',
          content: 'Success! We\'ve executed the arbitrage and repaid the flash loan with a profit. This is how flash loans enable capital-efficient arbitrage.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Flash loans democratize access to arbitrage opportunities.',
          links: [
            { name: 'Flash Loan Guide', url: 'https://docs.aave.com/developers/guides/flash-loans' },
            { name: 'Flash Loan Arbitrage', url: 'https://docs.dydx.exchange/developers/flash-loans' }
          ]
        },
        {
          step: 5,
          title: 'Flash Loan Risks and Ethics',
          content: 'While flash loans enable legitimate arbitrage, they\'ve also been used in attacks. It\'s important to understand both the opportunities and risks.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Flash loans are a powerful but controversial DeFi tool.',
          links: [
            { name: 'Flash Loan Security', url: 'https://docs.aave.com/developers/guides/flash-loans' },
            { name: 'DeFi Security Best Practices', url: 'https://consensys.net/blog/defi/' }
          ]
        }
      ],
      'arbitrage-cyclical': [
        {
          step: 1,
          title: 'Understanding Cyclical Arbitrage',
          content: 'Cyclical arbitrage involves trading through a cycle of multiple assets to capture price inefficiencies. For example: Token A → Token B → Token C → Token A.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This strategy is used in complex DeFi ecosystems with multiple interconnected protocols.'
        },
        {
          step: 2,
          title: 'The Cyclical Pattern',
          content: 'The goal is to find a cycle where the product of exchange rates doesn\'t equal 1. This creates an opportunity for profit through the entire cycle.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Cyclical arbitrage requires understanding multiple trading pairs.'
        },
        {
          step: 3,
          title: 'Execute Cyclical Arbitrage',
          content: 'Let\'s execute a cyclical arbitrage through vETH → vUSDC → vDAI → ERA → vETH. We\'ll trade through all assets in the cycle.',
          action: 'Execute Cyclical Arbitrage',
          actionFunction: 'swap',
          realMarketApplication: 'This demonstrates cyclical arbitrage execution.'
        },
        {
          step: 4,
          title: 'Cycle Completion and Profit',
          content: 'After completing the full cycle, we have more vETH than we started with! This profit comes from the inefficiencies across all trading pairs in the cycle.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Cyclical arbitrage helps maintain price consistency across multiple assets.',
          links: [
            { name: 'Cyclical Arbitrage Strategies', url: 'https://docs.uniswap.org/concepts/advanced-topics/mev' },
            { name: 'Multi-Asset Trading', url: 'https://docs.1inch.io/' }
          ]
        },
        {
          step: 5,
          title: 'Advanced Arbitrage Strategies',
          content: 'Cyclical arbitrage is just one of many advanced strategies. Others include statistical arbitrage, mean reversion, and momentum-based strategies.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Advanced arbitrage requires sophisticated tools and analysis.',
          links: [
            { name: 'Advanced Trading Strategies', url: 'https://docs.dydx.exchange/developers/trading' },
            { name: 'DeFi Analytics', url: 'https://defipulse.com/' }
          ]
        }
      ],
      'arbitrage-cyclical': [
        {
          step: 1,
          title: 'Cyclical (Network) Arbitrage',
          content: 'Cyclical arbitrage exploits inefficiencies across multiple liquidity pools and exchanges. It involves complex routing through multiple protocols.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'MEV bots use cyclical arbitrage to extract value.'
        },
        {
          step: 2,
          title: 'Network Effects',
          content: 'As DeFi grows, more protocols create more arbitrage opportunities. Bots scan multiple DEXs simultaneously to find profitable cycles.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'This is how MEV (Maximal Extractable Value) works.'
        },
        {
          step: 3,
          title: 'Execute Network Arbitrage',
          content: 'Let\'s execute a complex arbitrage across multiple pools: vETH → vUSDC → vDAI → vETH across different DEXs.',
          action: 'Execute Network Arbitrage',
          actionFunction: 'swap',
          realMarketApplication: 'This shows how network arbitrage works.'
        },
        {
          step: 4,
          title: 'Network Profit',
          content: 'Excellent! You\'ve successfully executed network arbitrage. This demonstrates the complexity and opportunity in DeFi arbitrage.',
          action: 'Continue',
          actionFunction: 'continue',
          realMarketApplication: 'Network arbitrage requires sophisticated algorithms.',
          links: [
            { name: 'MEV Documentation', url: 'https://ethereum.org/en/developers/docs/mev/' },
            { name: 'Arbitrage Bots', url: 'https://docs.1inch.io/' }
          ]
        },
        {
          step: 5,
          title: 'Network Arbitrage Complete',
          content: 'You\'ve mastered network arbitrage! This is the cutting edge of DeFi trading.',
          action: 'Complete Topic',
          actionFunction: 'completeTopic',
          realMarketApplication: 'Network arbitrage is driving DeFi innovation.',
          links: [
            { name: 'Advanced MEV', url: 'https://ethereum.org/en/developers/docs/mev/' },
            { name: 'DeFi Innovation', url: 'https://defipulse.com/' }
          ]
        }
      ]
    };
    return scripts[scenarioId] || [];
  };

  const handleAction = (actionFunction) => {
    if (onAction) {
      onAction(actionFunction);
    }
    setCurrentStep(prev => prev + 1);
  };

  const scripts = getEducationalScripts(scenarioId);
  const currentScript = scripts[currentStep - 1];

  if (!currentScript) {
    return (
      <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
        <div className="text-center">
          <p className="text-cyan-200">No educational script available for this topic.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
      <h3 className="text-xl font-bold text-pink-200 mb-4 font-orbitron">Learning Journey</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-pink-400">
          <h4 className="text-lg font-bold text-pink-300 mb-2">{currentScript.title}</h4>
          <p className="text-cyan-200 font-mono mb-4">{currentScript.content}</p>
          
          {/* Real Market Application */}
          <div className="bg-blue-900/30 border border-blue-600/30 rounded p-3 mb-4">
            <h5 className="text-blue-300 font-semibold mb-1">Real Market Application:</h5>
            <p className="text-blue-200 text-sm">{currentScript.realMarketApplication}</p>
          </div>
          
          {/* Action Button */}
          <button
            onClick={() => handleAction(currentScript.actionFunction)}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors font-orbitron"
          >
            {currentScript.action}
          </button>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep} of {scripts.length}</span>
              <span>{Math.round((currentStep / scripts.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-pink-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / scripts.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalScript; 