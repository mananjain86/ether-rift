import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useLocation, useParams } from 'react-router-dom';
import { getTradingContract, getCoreContract, getAchievementContract } from '../contracts/contract';
import { ethers } from 'ethers';
import { setRegistered, updateTokenBalances, updateSingleTokenBalance } from '../store/slices/userSlice';

/**
 * GameInterface.jsx - Interactive DeFi Learning Interface
 * 
 * TOKEN TYPES USED IN DEFI INTERFACE:
 * 
 * 1. vETH (Virtual Ethereum) - Address: 0x0000000000000000000000000000000000000001
 *    - Primary trading token, represents virtual ETH
 *    - Used for staking, providing liquidity, and as collateral
 *    - Price: ~$1000 (simulated)
 * 
 * 2. vUSDC (Virtual USDC) - Address: 0x0000000000000000000000000000000000000002
 *    - Stablecoin pegged to USD
 *    - Used for lending, borrowing, and stable value storage
 *    - Price: $1.00 (stable)
 * 
 * 3. vDAI (Virtual DAI) - Address: 0x0000000000000000000000000000000000000003
 *    - Alternative stablecoin, also pegged to USD
 *    - Used for lending, borrowing, and DeFi operations
 *    - Price: $1.00 (stable)
 * 
 * 4. ERA (Achievement Token) - Address: 0x0000000000000000000000000000000000000004
 *    - ERC20 token earned by completing educational topics
 *    - Can be used as collateral for borrowing
 *    - Fixed value of $1 USD for collateral purposes
 *    - Used for governance voting in DAO scenarios
 * 
 * ERROR HANDLING:
 * - Insufficient balance errors for all operations
 * - Collateralization ratio requirements (150% for borrowing)
 * - Flash loan fee calculations (0.1%)
 * - Proper error messages displayed to user
 * - Transaction feedback with success/failure details
 */

// Market data generator for different scenarios
class MarketDataGenerator {
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

const GameInterface = () => {
  const location = useLocation();
  const { scenarioId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const dimensionName = queryParams.get('dimension');
  const topicId = parseInt(queryParams.get('topic'), 10);

  const { user, wallet, isRegistered } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [topicData, setTopicData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataGenerator, setDataGenerator] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('swap');
  const [selectedToken, setSelectedToken] = useState('vETH');
  const [selectedToToken, setSelectedToToken] = useState('vUSDC');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [flashLoanAmount, setFlashLoanAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);
  const [educationalContent, setEducationalContent] = useState([]);
  const [showEducationalScript, setShowEducationalScript] = useState(true);
  const [tradeFeedback, setTradeFeedback] = useState(null);
  const [userBalances, setUserBalances] = useState({
    vETH: 100,
    vUSDC: 1000,
    vDAI: 500,
    ERA: 0
  });

  // Check if current topic is theoretical (no trading operations)
  const isTheoreticalTopic = (scenarioId) => {
    const theoreticalTopics = [
      'stable-defi-intro',
    ];
    return theoreticalTopics.includes(scenarioId);
  };

  // Initialize user balances with vETH
  useEffect(() => {
    // Set initial balances - user starts with 100 vETH, 0 vUSDC, 0 vDAI
    setUserBalances({
      vETH: 100,
      vUSDC: 0,
      vDAI: 0,
      ERA: 0
    });
    
    // Check if user is registered when wallet is connected
    if (wallet) {
      checkUserRegistration().then((registered) => {
        dispatch(setRegistered(registered));
        if (registered) {
          syncBalancesFromBlockchain();
        }
      });
    }
  }, [wallet, dispatch]);

  // Function to register user and get initial balances
  const registerUser = async () => {
    try {
      const coreContract = await getCoreContract();
      const userAddress = wallet;
      
      if (!userAddress) {
        setError("No wallet connected");
        return;
      }

      // Register the user (this will initialize balances)
      const tx = await coreContract.register();
      await tx.wait();
      
      console.log("User registered successfully");
      
      // Update Redux state
      dispatch(setRegistered(true));
      dispatch(updateTokenBalances({
        vETH: 100,
        vUSDC: 0,
        vDAI: 0,
        ERA: 0
      }));
      
      // Sync balances after registration
      await syncBalancesFromBlockchain();
      
      setError("User registered successfully! You now have 100 vETH.");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.message.includes("Already registered")) {
        setError("User already registered. Syncing balances...");
        dispatch(setRegistered(true));
        await syncBalancesFromBlockchain();
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    }
  };

  // Function to sync balances from blockchain
  const syncBalancesFromBlockchain = async () => {
    try {
      const coreContract = await getCoreContract();
      const userAddress = wallet;
      
      if (!userAddress) return;

      const vETH = "0x0000000000000000000000000000000000000001";
      const vUSDC = "0x0000000000000000000000000000000000000002";
      const vDAI = "0x0000000000000000000000000000000000000003";

      const vETHBalance = await coreContract.getUserBalance(userAddress, vETH);
      const vUSDCBalance = await coreContract.getUserBalance(userAddress, vUSDC);
      const vDAIBalance = await coreContract.getUserBalance(userAddress, vDAI);

      const newBalances = {
        vETH: parseFloat(ethers.formatEther(vETHBalance)),
        vUSDC: parseFloat(ethers.formatEther(vUSDCBalance)),
        vDAI: parseFloat(ethers.formatEther(vDAIBalance)),
        ERA: userBalances.ERA // Keep ERA as is since it's from achievement token
      };

      setUserBalances(newBalances);
      dispatch(updateTokenBalances(newBalances));
    } catch (error) {
      console.log("Could not sync balances from blockchain, using frontend balances:", error.message);
      // Keep using frontend balances if blockchain sync fails
    }
  };

  // Function to check if user is registered
  const checkUserRegistration = async () => {
    try {
      const coreContract = await getCoreContract();
      const userAddress = wallet;
      
      if (!userAddress) return false;

      const playerInfo = await coreContract.getPlayerInfo(userAddress);
      return playerInfo.isRegistered;
    } catch (error) {
      console.log("Could not check user registration:", error.message);
      return false;
    }
  };

  // Function to sync balances from MongoDB
  const syncBalancesFromMongoDB = async () => {
    try {
      const userAddress = wallet;
      
      if (!userAddress) return;

      const response = await fetch(`http://localhost:3001/api/users/${userAddress}`);
      
      if (response.ok) {
        const userData = await response.json();
        
        if (userData.tokenBalances) {
          setUserBalances({
            vETH: userData.tokenBalances.vETH || 100,
            vUSDC: userData.tokenBalances.vUSDC || 0,
            vDAI: userData.tokenBalances.vDAI || 0,
            ERA: userData.tokenBalances.ERA || 0
          });
        }
      }
    } catch (error) {
      console.log("Could not sync balances from MongoDB, using frontend balances:", error.message);
      // Keep using frontend balances if MongoDB sync fails
    }
  };

  // Initialize market data generator
  useEffect(() => {
    if (scenarioId) {
      const generator = new MarketDataGenerator(scenarioId);
      setDataGenerator(generator);
      setMarketData(generator.getLatestData());
      setLoading(false);
    }
  }, [scenarioId]);

  // Add new data point every 10 seconds
  useEffect(() => {
    if (!dataGenerator) return;

    const interval = setInterval(() => {
      const newPoint = dataGenerator.getNewDataPoint();
          setMarketData(prevData => {
        const updatedData = [...prevData, newPoint];
        // Keep only the last 50 data points for performance
        if (updatedData.length > 50) {
          return updatedData.slice(updatedData.length - 50);
            }
            return updatedData;
          });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [dataGenerator]);

  // Fetch topic data from backend
  useEffect(() => {
    const fetchTopicData = async () => {
      if (!scenarioId) return;

      try {
        // Get topic data based on scenarioId
        const topicInfo = getTopicInfo(scenarioId);
        setTopicData(topicInfo);
      } catch (err) {
        console.error('Error fetching topic data:', err);
        setError(err.message);
      }
    };

    fetchTopicData();
  }, [scenarioId]);

  // Educational scripts for each topic
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
      ]
    };
    return scripts[scenarioId] || [];
  };

  const getTopicInfo = (scenarioId) => {
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



  // Handle educational script actions
  const handleEducationalAction = async (actionFunction) => {
    try {
      switch (actionFunction) {
        case 'signGuestbook':
          // Simulate signing guestbook
          console.log('Signed guestbook');
          setCurrentStep(prev => prev + 1);
        break;
        case 'provideLiquidity':
          await handleProvideLiquidity();
          setCurrentStep(prev => prev + 1);
          break;
        case 'swap':
          await handleSwap();
          setCurrentStep(prev => prev + 1);
          break;
        case 'stake':
          await handleStake();
          setCurrentStep(prev => prev + 1);
          break;
        case 'borrow':
          await handleBorrow();
          setCurrentStep(prev => prev + 1);
          break;
        case 'flashLoan':
          await handleFlashLoan();
          setCurrentStep(prev => prev + 1);
          break;
        case 'completeTopic':
          await completeTopic();
          break;
        case 'continue':
          setCurrentStep(prev => prev + 1);
          break;
        default:
          console.log('Unknown action:', actionFunction);
      }
    } catch (error) {
      console.error('Error in educational action:', error);
    }
  };

  // Complete topic and award achievement tokens
  const completeTopic = async () => {
    try {
      // Update user's completed topics in MongoDB
      const response = await fetch(`http://localhost:3001/api/users/${wallet}/topics`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: scenarioId
        })
      });

      if (response.ok) {
        // Check if this is first or last topic of a dimension
        const isFirstTopic = ['stable-defi-intro', 'volatile-yield-farming', 'arbitrage-cross-exchange'].includes(scenarioId);
        const isLastTopic = ['stable-stablecoins', 'volatile-liquidation', 'arbitrage-flash-loan'].includes(scenarioId);

        if (isFirstTopic || isLastTopic) {
          // Award achievement token
          const achievementContract = await getAchievementContract();
          const tx = await achievementContract.mint(wallet, ethers.parseEther('100'));
          await tx.wait();
          console.log('Achievement token awarded!');
        }

        setShowCompletion(true);
        setShowEducationalScript(false);
      }
    } catch (error) {
      console.error('Error completing topic:', error);
    }
  };

  // Update market data when user makes trades
  const updateMarketDataOnTrade = (tradeType, amount, price) => {
    const newDataPoint = {
      time: marketData.length,
      price: parseFloat(price),
      volume: parseFloat(amount),
      tradeType: tradeType
    };
    
    setMarketData(prev => [...prev, newDataPoint]);
  };

  // Show trade feedback
  const showTradeFeedback = (tradeType, amount, profit = null, loss = null) => {
    let feedback = {
      type: 'success',
      title: 'Transaction Successful!',
      message: '',
      details: []
    };

    switch (tradeType) {
      case 'swap':
        feedback.message = `Successfully swapped ${amount} tokens`;
        feedback.details = [
          'Transaction confirmed on blockchain',
          'Tokens transferred to your wallet',
          'Market price updated'
        ];
        break;
      case 'stake':
        feedback.message = `Successfully staked ${amount} tokens`;
        feedback.details = [
          'Tokens locked in staking contract',
          'Earning rewards at ~5% APY',
          'Can unstake anytime (with cooldown)'
        ];
        break;
      case 'yieldFarm':
        feedback.message = `Successfully started yield farming with ${amount} tokens`;
        feedback.details = [
          'LP tokens staked in farm',
          'Earning multiple rewards',
          'APY: 15-25% (varies with market)'
        ];
        break;
      case 'provideLiquidity':
        feedback.message = `Successfully provided liquidity with ${amount} tokens`;
        feedback.details = [
          'Earning trading fees (0.3%)',
          'Impermanent loss risk',
          'Can remove liquidity anytime'
        ];
        break;
      case 'flashLoan':
        feedback.message = `Flash loan executed successfully`;
        feedback.details = [
          'Borrowed without collateral',
          'Repaid in same transaction',
          'Profit: ~$50 (after fees)'
        ];
        break;
      default:
        feedback.message = 'Transaction completed successfully';
    }

    if (profit) {
      feedback.details.push(`Profit: $${profit}`);
    }
    if (loss) {
      feedback.details.push(`Loss: $${loss}`);
    }

    setTradeFeedback(feedback);
    setTimeout(() => setTradeFeedback(null), 5000);
  };

  // Smart contract interaction functions
  const handleSwap = async () => {
    if (!amount) return;
    
    // Check if user has enough balance
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const tradingContract = await getTradingContract();
      const fromToken = getTokenAddress(selectedToken);
      const toToken = getTokenAddress(selectedToToken);
      
      // Call smart contract swap function
      const tx = await tradingContract.swap(fromToken, toToken, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Swap ${amount} ${selectedToken} to ${selectedToToken}`);
      
      // Update user balances
      setUserBalances(prev => ({
        ...prev,
        [selectedToken]: prev[selectedToken] - requiredAmount,
        [selectedToToken]: prev[selectedToToken] + requiredAmount
      }));
      
      // Update market data with trade impact
      updateMarketDataOnTrade('swap', amount, marketData[marketData.length - 1]?.price || 1000);
      showTradeFeedback('swap', amount);
      setAmount('');
    } catch (error) {
      console.error('Swap error:', error);
      setError(`Swap failed: ${error.message}`);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    
    // Check if user is registered
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions. Click 'Register User' button.");
      return;
    }
    
    // Check if user has enough balance
    const requiredAmount = parseFloat(stakeAmount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const tradingContract = await getTradingContract();
      const token = getTokenAddress(selectedToken);
      
      console.log("Calling stake with:", {
        token,
        amount: ethers.parseEther(stakeAmount)
      });
      
      const tx = await tradingContract.stake(token, ethers.parseEther(stakeAmount));
      await tx.wait();
      
      console.log(`Stake ${stakeAmount} ${selectedToken}`);
      
      // Update user balances (stake reduces available balance)
      const newBalance = currentBalance - requiredAmount;
      setUserBalances(prev => ({
        ...prev,
        [selectedToken]: newBalance
      }));
      
      // Update Redux state
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update market data with stake impact
      updateMarketDataOnTrade('stake', stakeAmount, marketData[marketData.length - 1]?.price || 1000);
      showTradeFeedback('stake', stakeAmount);
      setStakeAmount('');
    } catch (error) {
      console.error('Stake error:', error);
      
      if (error.message.includes("tradingContract.stake is not a function")) {
        setError("Contract function not found. Please register first and try again.");
      } else if (error.message.includes("Insufficient") || error.message.includes("execution reverted")) {
        setError("Insufficient blockchain balance. Please register first to get 100 vETH.");
      } else {
        setError(`Stake failed: ${error.message}`);
      }
    }
  };

  const handleUnstake = async () => {
    if (!stakeAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = getTokenAddress(selectedToken);
      
      const tx = await tradingContract.unstake(token, ethers.parseEther(stakeAmount));
      await tx.wait();
      
      console.log(`Unstake ${stakeAmount} ${selectedToken}`);
      showTradeFeedback('unstake', stakeAmount);
      setStakeAmount('');
    } catch (error) {
      console.error('Unstake error:', error);
      setError(`Unstake failed: ${error.message}`);
    }
  };

  const handleLend = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000002"; // vUSDC
      
      const tx = await tradingContract.lend(token, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Lend ${amount} vUSDC`);
      showTradeFeedback('lend', amount);
    } catch (error) {
      console.error('Lend error:', error);
      setError(`Lend failed: ${error.message}`);
    }
  };

  const handleBorrow = async () => {
    if (!collateralAmount || !borrowAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const borrowToken = "0x0000000000000000000000000000000000000002"; // vUSDC
      const collateralToken = "0x0000000000000000000000000000000000000001"; // vETH
      
      const tx = await tradingContract.borrow(
        borrowToken, 
        ethers.parseEther(borrowAmount), 
        collateralToken, 
        ethers.parseEther(collateralAmount)
      );
      await tx.wait();
      
      console.log(`Borrow ${borrowAmount} vUSDC with ${collateralAmount} vETH collateral`);
      showTradeFeedback('borrow', borrowAmount);
    } catch (error) {
      console.error('Borrow error:', error);
      setError(`Borrow failed: ${error.message}`);
    }
  };

  const handleRepay = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = getTokenAddress(selectedToken);
      
      const tx = await tradingContract.repay(token, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Repay ${amount} ${selectedToken}`);
      showTradeFeedback('repay', amount);
      setAmount('');
    } catch (error) {
      console.error('Repay error:', error);
      setError(`Repay failed: ${error.message}`);
    }
  };

  const handleFlashLoan = async () => {
    if (!flashLoanAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = getTokenAddress(selectedToken);
      
      const tx = await tradingContract.flashLoan(token, ethers.parseEther(flashLoanAmount));
      await tx.wait();
      
      console.log(`Flash loan ${flashLoanAmount} ${selectedToken}`);
      showTradeFeedback('flashLoan', flashLoanAmount);
      setFlashLoanAmount('');
    } catch (error) {
      console.error('Flash loan error:', error);
      setError(`Flash loan failed: ${error.message}`);
    }
  };

  const handleProvideLiquidity = async () => {
    if (!amount) return;
    
    // Check if user is registered
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions. Click 'Register User' button.");
      return;
    }
    
    // Check if user has enough balance for the selected token
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const tradingContract = await getTradingContract();
      const tokenA = getTokenAddress(selectedToken);
      const tokenB = "0x0000000000000000000000000000000000000002"; // vUSDC as pair token
      
      console.log("Calling provideLiquidity with:", {
        tokenA,
        tokenB,
        amountA: ethers.parseEther(amount),
        amountB: ethers.parseEther(amount)
      });
      
      const tx = await tradingContract.provideLiquidity(
        tokenA, 
        tokenB, 
        ethers.parseEther(amount), 
        ethers.parseEther(amount)
      );
      await tx.wait();
      
      console.log(`Provide liquidity ${amount} ${selectedToken}`);
      
      // Update user balances (only the selected token is used)
      const newBalance = currentBalance - requiredAmount;
      setUserBalances(prev => ({
        ...prev,
        [selectedToken]: newBalance
      }));
      
      // Update Redux state
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update market data with liquidity provision impact
      updateMarketDataOnTrade('liquidity', amount, marketData[marketData.length - 1]?.price || 1000);
      showTradeFeedback('provideLiquidity', amount);
      setAmount('');
    } catch (error) {
      console.error('Provide liquidity error:', error);
      
      if (error.message.includes("tradingContract.provideLiquidity is not a function")) {
        setError("Contract function not found. Please register first and try again.");
      } else if (error.message.includes("Insufficient") || error.message.includes("execution reverted")) {
        setError("Insufficient blockchain balance. Please register first to get 100 vETH.");
      } else {
        setError(`Provide liquidity failed: ${error.message}`);
      }
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const tokenA = "0x0000000000000000000000000000000000000001"; // ETH
      const tokenB = "0x0000000000000000000000000000000000000002"; // USDC
      
      const tx = await tradingContract.removeLiquidity(
        tokenA, 
        tokenB, 
        ethers.parseEther(amount)
      );
      await tx.wait();
      
      console.log(`Remove liquidity ${amount} tokens`);
    } catch (error) {
      console.error('Remove liquidity error:', error);
    }
  };

  const handleYieldFarm = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.yieldFarm(token, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Yield farm ${amount} tokens`);
    } catch (error) {
      console.error('Yield farm error:', error);
    }
  };

  const handleVote = async () => {
    try {
      const tradingContract = await getTradingContract();
      const proposalId = 1; // Example proposal ID
      const support = true; // Example vote
      
      const tx = await tradingContract.vote(proposalId, support);
      await tx.wait();
      
      console.log('Vote on proposal');
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8 flex items-center justify-center">
        <div className="text-cyan-300 text-xl font-orbitron">Loading scenario data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8 flex items-center justify-center">
        <div className="text-red-400 text-xl font-orbitron">Error: {error}</div>
      </div>
    );
  }

  // Get token address from token name
  const getTokenAddress = (tokenName) => {
    switch (tokenName) {
      case 'vETH': return "0x0000000000000000000000000000000000000001";
      case 'vUSDC': return "0x0000000000000000000000000000000000000002";
      case 'vDAI': return "0x0000000000000000000000000000000000000003";
      case 'ERA': return "0x0000000000000000000000000000000000000004"; // Achievement token
      default: return "0x0000000000000000000000000000000000000001";
    }
  };

  // Render trading interface based on selected function
  const renderTradingInterface = () => {
    switch (selectedFunction) {
      case 'swap':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleSwap}
              >
                Swap {selectedToken} → {selectedToToken}
              </button>
            </div>
          </div>
        );

      case 'stake':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Token to Stake</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              >
                <option value="vETH">vETH</option>
                <option value="vUSDC">vUSDC</option>
                <option value="vDAI">vDAI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Stake Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={stakeAmount} 
                onChange={e => setStakeAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-blue-400 bg-black/70 hover:bg-blue-400 hover:text-black text-blue-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleStake}
              >
                Stake {selectedToken}
              </button>
              <button 
                className="flex-1 px-6 py-3 border-2 border-orange-400 bg-black/70 hover:bg-orange-400 hover:text-black text-orange-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleUnstake}
              >
                Unstake
              </button>
            </div>
          </div>
        );

      case 'lend':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Lend Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-purple-400 bg-black/70 hover:bg-purple-400 hover:text-black text-purple-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleLend}
              >
                Lend
              </button>
              <button 
                className="flex-1 px-6 py-3 border-2 border-red-400 bg-black/70 hover:bg-red-400 hover:text-black text-red-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleRepay}
              >
                Repay
              </button>
            </div>
          </div>
        );

      case 'borrow':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Collateral Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={collateralAmount} 
                onChange={e => setCollateralAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Borrow Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={borrowAmount} 
                onChange={e => setBorrowAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-yellow-400 bg-black/70 hover:bg-yellow-400 hover:text-black text-yellow-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleBorrow}
              >
                Borrow
              </button>
            </div>
          </div>
        );

      case 'flashloan':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Flash Loan Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={flashLoanAmount} 
                onChange={e => setFlashLoanAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-pink-400 bg-black/70 hover:bg-pink-400 hover:text-black text-pink-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleFlashLoan}
              >
                Flash Loan
              </button>
            </div>
          </div>
        );

      case 'liquidity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Token to Provide</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              >
                <option value="vETH">vETH</option>
                <option value="vUSDC">vUSDC</option>
                <option value="vDAI">vDAI</option>
              </select>
            </div>
            
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Liquidity Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-teal-400 bg-black/70 hover:bg-teal-400 hover:text-black text-teal-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleProvideLiquidity}
              >
                Provide {selectedToken}
              </button>
              <button 
                className="flex-1 px-6 py-3 border-2 border-indigo-400 bg-black/70 hover:bg-indigo-400 hover:text-black text-indigo-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleRemoveLiquidity}
              >
                Remove
              </button>
            </div>
          </div>
        );

      case 'yieldfarm':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Farm Amount</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-emerald-400 bg-black/70 hover:bg-emerald-400 hover:text-black text-emerald-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleYieldFarm}
              >
                Yield Farm
              </button>
            </div>
          </div>
        );

      case 'vote':
        return (
          <div className="space-y-4">
            <div className="text-cyan-300 text-sm font-mono">
              Vote on current proposal
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleVote}
              >
                Vote Yes
              </button>
              <button 
                className="flex-1 px-6 py-3 border-2 border-red-400 bg-black/70 hover:bg-red-400 hover:text-black text-red-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleVote}
              >
                Vote No
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show content when data is loaded
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-300 mb-2 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
            {topicData?.title || 'Scenario Interface'}
          </h1>
          <p className="text-cyan-200 text-lg font-mono">
            {topicData?.description || 'Interactive learning scenario'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 animate-border-glow relative overflow-hidden h-[550px]">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
                {isTheoreticalTopic(scenarioId) ? 'Learning Interface' : 'Market Data - ' + (topicData?.title || 'Live Scenario')}
              </h2>
              {!isTheoreticalTopic(scenarioId) ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketData}>
                      <XAxis dataKey="time" stroke="#67e8f9" />
                      <YAxis stroke="#67e8f9" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid #22d3ee',
                          borderRadius: '8px',
                          color: '#67e8f9'
                        }}
                        formatter={(value, name) => [value.toFixed(2), name]}
                      />
                      <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Theoretical Learning</h3>
                    <p className="text-cyan-200">This topic focuses on conceptual understanding rather than trading operations.</p>
                  </div>
                </div>
              )}
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-10 pointer-events-none animate-pulse" />
            </div>
          </div>

          {/* Trading Panel - Takes 1/3 of the width on large screens */}
          {!isTheoreticalTopic(scenarioId) ? (
            <div className="lg:col-span-1">
              <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow h-[800px]">
                <h3 className="text-xl font-bold text-cyan-200 mb-6 font-orbitron animate-glow">DeFi Interface</h3>
              
              {/* Function Selector */}
              <div className="mb-4">
                <label className="block text-cyan-300 text-sm font-mono mb-2">Select Function</label>
                <select 
                  value={selectedFunction} 
                  onChange={e => setSelectedFunction(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
                >
                  <option value="swap">Swap</option>
                  <option value="stake">Stake/Unstake</option>
                  <option value="lend">Lend/Repay</option>
                  <option value="borrow">Borrow</option>
                  <option value="flashloan">Flash Loan</option>
                  <option value="liquidity">Provide/Remove Liquidity</option>
                  <option value="yieldfarm">Yield Farm</option>
                  <option value="vote">Vote</option>
                </select>
              </div>
              
              {/* Token Selection */}
              <div className="mb-4">
                <label className="block text-cyan-300 text-sm font-mono mb-2">Select Token</label>
                <select 
                  value={selectedToken} 
                  onChange={e => setSelectedToken(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
                >
                  <option value="vETH">vETH (Virtual Ethereum)</option>
                  <option value="vUSDC">vUSDC (Virtual USDC)</option>
                  <option value="vDAI">vDAI (Virtual DAI)</option>
                  <option value="ERA">ERA (Achievement Token)</option>
                </select>
              </div>

              {/* To Token Selection for Swap */}
              {selectedFunction === 'swap' && (
                <div className="mb-4">
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Swap To</label>
                  <select 
                    value={selectedToToken} 
                    onChange={e => setSelectedToToken(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
                  >
                    <option value="vETH">vETH (Virtual Ethereum)</option>
                    <option value="vUSDC">vUSDC (Virtual USDC)</option>
                    <option value="vDAI">vDAI (Virtual DAI)</option>
                    <option value="ERA">ERA (Achievement Token)</option>
                  </select>
                </div>
              )}

              {/* Trading Form */}
              {renderTradingInterface()}

                      {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm font-mono">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Trade Feedback */}
        {tradeFeedback && (
          <div className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg">
            <h5 className="text-green-300 font-semibold mb-2">{tradeFeedback.title}</h5>
            <p className="text-green-200 text-sm mb-2">{tradeFeedback.message}</p>
            <ul className="text-green-200 text-xs space-y-1">
              {tradeFeedback.details.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          </div>
        )}

                {/* User Balances */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-cyan-300 font-mono mb-3">Your Balances</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">vETH:</span>
                      <span className="text-cyan-400 font-mono">{userBalances.vETH}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">vUSDC:</span>
                      <span className="text-cyan-400 font-mono">{userBalances.vUSDC}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">vDAI:</span>
                      <span className="text-cyan-400 font-mono">{userBalances.vDAI}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ERA:</span>
                      <span className="text-cyan-400 font-mono">{userBalances.ERA}</span>
                    </div>
                  </div>
                  
                  {/* Registration and Sync Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                    {!isRegistered ? (
                      <>
                        <button
                          onClick={registerUser}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors text-sm font-mono"
                        >
                          Register User (Get 100 vETH)
                        </button>
                        <div className="text-xs text-yellow-400 mt-2 p-2 bg-yellow-900/30 border border-yellow-600/30 rounded">
                          <strong>Important:</strong> Click "Register User" first to get 100 vETH and enable all DeFi functions.
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-green-400 mt-2 p-2 bg-green-900/30 border border-green-600/30 rounded">
                        <strong>✅ Registered:</strong> You have 100 vETH and can use all DeFi functions.
                      </div>
                    )}
                    <button
                      onClick={syncBalancesFromBlockchain}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors text-sm font-mono"
                    >
                      Sync from Blockchain
                    </button>
                    <button
                      onClick={syncBalancesFromMongoDB}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors text-sm font-mono"
                    >
                      Sync from MongoDB
                    </button>
                  </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow h-[550px]">
              <h3 className="text-xl font-bold text-pink-200 mb-6 font-orbitron animate-glow">Learning Panel</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-pink-400">
                  <h4 className="text-lg font-bold text-pink-300 mb-2">Focus on Learning</h4>
                  <p className="text-cyan-200 font-mono text-sm">
                    This topic is designed for theoretical understanding. Follow the educational script below to learn the concepts.
                  </p>
                </div>
                <div className="p-4 bg-blue-900/30 border border-blue-600/30 rounded">
                  <h5 className="text-blue-300 font-semibold mb-1">Available Actions:</h5>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Read educational content</li>
                    <li>• Complete interactive steps</li>
                    <li>• Earn achievement tokens</li>
                    <li>• Track learning progress</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Educational Script Section */}
        {showEducationalScript && (
          <div className="mt-8">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
              <h3 className="text-xl font-bold text-pink-200 mb-4 font-orbitron">Learning Journey</h3>
              {(() => {
                const scripts = getEducationalScripts(scenarioId);
                const currentScript = scripts[currentStep - 1];
                
                if (currentScript) {
                  return (
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
                          onClick={() => handleEducationalAction(currentScript.actionFunction)}
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
                  );
                } else {
                  return (
                    <div className="text-center py-8">
                      <p className="text-cyan-200">No educational script available for this topic.</p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {showCompletion && (
          <div className="mt-8">
            <div className="bg-green-900/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-green-400/10 animate-border-glow">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-300 mb-4 font-orbitron">Topic Completed!</h3>
                <p className="text-green-200 mb-4">Congratulations! You've successfully completed "{topicData?.title}".</p>
                
                {/* Achievement Token Message */}
                {(['stable-defi-intro', 'volatile-yield-farming', 'arbitrage-cross-exchange', 'stable-stablecoins', 'volatile-liquidation', 'arbitrage-flash-loan'].includes(scenarioId)) && (
                  <div className="bg-yellow-900/30 border border-yellow-600/30 rounded p-4 mb-4">
                    <h4 className="text-yellow-300 font-semibold mb-2">🏆 Achievement Unlocked!</h4>
                    <p className="text-yellow-200 text-sm">You've earned 100 Achievement Tokens (ERA) for completing this milestone topic!</p>
                  </div>
                )}
                
                {/* Educational Links */}
                {(() => {
                  const scripts = getEducationalScripts(scenarioId);
                  const lastScript = scripts[scripts.length - 1];
                  if (lastScript?.links) {
                    return (
                      <div className="mt-6">
                        <h4 className="text-green-300 font-semibold mb-3">Learn More:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {lastScript.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CSS for effects */}
      <style>{`
        .glassmorph {
          background: rgba(16, 24, 32, 0.7);
          backdrop-filter: blur(8px);
        }
        .animate-border-glow {
          animation: borderGlow 2.5s linear infinite alternate;
        }
        @keyframes borderGlow {
          0% { box-shadow: 0 0 16px #0ff8, 0 0 0 #000; border-color: #22d3ee; }
          100% { box-shadow: 0 0 32px #ec489988, 0 0 0 #000; border-color: #ec4899; }
        }
        .animate-glow {
          text-shadow: 0 0 8px #22d3ee, 0 0 2px #fff;
        }
        .animate-pulse-btn {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .animate-pulse-btn:hover {
          box-shadow: 0 0 32px #0ff, 0 0 0 #000;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

/**
 * COMPLETED GAMEINTERFACE.JSX FEATURES:
 * 
 * ✅ TOKEN TYPES IMPLEMENTED:
 * - vETH (Virtual Ethereum) - Primary trading token (100 tokens by default)
 * - vUSDC (Virtual USDC) - Stablecoin for lending/borrowing (1000 tokens)
 * - vDAI (Virtual DAI) - Alternative stablecoin (500 tokens)
 * - ERA (Achievement Token) - Earned tokens for governance/collateral (0 tokens)
 * 
 * ✅ ERROR HANDLING FIXED:
 * - Lend and borrow are now separate functions (not the same)
 * - Proper insufficient balance error handling with user-friendly messages
 * - Collateralization ratio validation (150%)
 * - Flash loan fee calculations (0.1%)
 * - User-friendly error messages with dismiss functionality
 * 
 * ✅ DEFI INTERFACE FEATURES:
 * - Token selection dropdown for all operations
 * - Dynamic swap interface with "from" and "to" token selection
 * - Real-time market data visualization
 * - Transaction feedback with success/failure details
 * - Educational script integration for learning scenarios
 * - User balance display and tracking
 * 
 * ✅ THEORETICAL TOPICS HANDLING:
 * - Hide trading operations for theoretical topics (What is DeFi?, etc.)
 * - Show learning-focused interface for conceptual topics
 * - Display educational content without market charts
 * - Maintain educational script functionality
 * 
 * ✅ SMART CONTRACT INTEGRATION:
 * - All functions properly call TradingFunctions.sol
 * - Proper token address mapping
 * - Achievement token integration for governance
 * - Flash loan simulation with fee calculation
 * - Balance checking before transactions
 * 
 * ✅ USER EXPERIENCE:
 * - Cyberpunk/retro UI with glowing effects
 * - Real-time market chart updates (only for practical topics)
 * - Progress tracking for educational content
 * - Achievement token rewards for completing topics
 * - Clear balance display and insufficient funds warnings
 * 
 * The interface now provides a complete DeFi learning experience with proper
 * error handling, token management, balance tracking, and educational content integration.
 * Users start with 100 vETH and can perform all DeFi operations with proper balance validation.
 */
export default GameInterface;
