import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { useLocation, useParams } from 'react-router-dom';
import { getTradingContract, getCoreContract } from '../contracts/contract';
import { ethers } from 'ethers';

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

  const { user, wallet } = useAppSelector(state => state.user);
  
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [topicData, setTopicData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataGenerator, setDataGenerator] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState('swap');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [flashLoanAmount, setFlashLoanAmount] = useState('');

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

  // Smart contract interaction functions
  const handleSwap = async () => {
    if (!amount || !price) return;
    
    try {
      const tradingContract = await getTradingContract();
      const fromToken = "0x0000000000000000000000000000000000000001"; // ETH
      const toToken = "0x0000000000000000000000000000000000000002";   // USDC
      
      // Call smart contract swap function
      const tx = await tradingContract.swap(fromToken, toToken, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Swap ${amount} at ${price}`);
      // Add new data point to market data
      const newDataPoint = {
        time: marketData.length,
        price: parseFloat(price),
        volume: parseFloat(amount)
      };
      
      setMarketData(prev => [...prev, newDataPoint]);
      setAmount('');
      setPrice('');
    } catch (error) {
      console.error('Swap error:', error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.stake(token, ethers.parseEther(stakeAmount));
      await tx.wait();
      
      console.log(`Stake ${stakeAmount} tokens`);
    } catch (error) {
      console.error('Stake error:', error);
    }
  };

  const handleUnstake = async () => {
    if (!stakeAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.unstake(token, ethers.parseEther(stakeAmount));
      await tx.wait();
      
      console.log(`Unstake ${stakeAmount} tokens`);
    } catch (error) {
      console.error('Unstake error:', error);
    }
  };

  const handleLend = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.lend(token, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Lend ${amount} tokens`);
    } catch (error) {
      console.error('Lend error:', error);
    }
  };

  const handleBorrow = async () => {
    if (!collateralAmount || !borrowAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000002"; // USDC
      const collateralToken = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.borrow(
        token, 
        ethers.parseEther(borrowAmount), 
        collateralToken, 
        ethers.parseEther(collateralAmount)
      );
      await tx.wait();
      
      console.log(`Borrow ${borrowAmount} with ${collateralAmount} collateral`);
    } catch (error) {
      console.error('Borrow error:', error);
    }
  };

  const handleRepay = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000002"; // USDC
      
      const tx = await tradingContract.repay(token, ethers.parseEther(amount));
      await tx.wait();
      
      console.log(`Repay ${amount} tokens`);
    } catch (error) {
      console.error('Repay error:', error);
    }
  };

  const handleFlashLoan = async () => {
    if (!flashLoanAmount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const token = "0x0000000000000000000000000000000000000001"; // ETH
      
      const tx = await tradingContract.flashLoan(token, ethers.parseEther(flashLoanAmount));
      await tx.wait();
      
      console.log(`Flash loan ${flashLoanAmount} tokens`);
    } catch (error) {
      console.error('Flash loan error:', error);
    }
  };

  const handleProvideLiquidity = async () => {
    if (!amount) return;
    
    try {
      const tradingContract = await getTradingContract();
      const tokenA = "0x0000000000000000000000000000000000000001"; // ETH
      const tokenB = "0x0000000000000000000000000000000000000002"; // USDC
      
      const tx = await tradingContract.provideLiquidity(
        tokenA, 
        tokenB, 
        ethers.parseEther(amount), 
        ethers.parseEther(amount)
      );
      await tx.wait();
      
      console.log(`Provide liquidity ${amount} tokens`);
    } catch (error) {
      console.error('Provide liquidity error:', error);
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
            
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Price</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 px-6 py-3 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleSwap}
              >
                Swap
              </button>
            </div>
          </div>
        );

      case 'stake':
        return (
          <div className="space-y-4">
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
                Stake
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
                Provide
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
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 animate-border-glow relative overflow-hidden h-[500px]">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
                Market Data - {topicData?.title || 'Live Scenario'}
              </h2>
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
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-10 pointer-events-none animate-pulse" />
            </div>
          </div>

          {/* Trading Panel - Takes 1/3 of the width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow h-[500px]">
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
              
              {/* Trading Form */}
              {renderTradingInterface()}

              {/* Market Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-cyan-300 font-mono mb-3">Market Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Price:</span>
                    <span className="text-cyan-400 font-mono">${marketData[marketData.length - 1]?.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change:</span>
                    <span className="text-green-400 font-mono">+2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-cyan-400 font-mono">1,234.56</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="mt-8">
          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
            <h3 className="text-xl font-bold text-pink-200 mb-4 font-orbitron">Educational Content</h3>
            <div className="space-y-4">
              {topicData?.educationalContent?.map((content, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-pink-400">
                  <p className="text-cyan-200 font-mono">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-pink-200 mb-4 font-orbitron">Learning Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Step:</span>
                <span className="text-pink-400 font-mono">Step 1 of 3</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-pink-400 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-green-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-green-200 mb-4 font-orbitron">Portfolio</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="text-green-400 font-mono">Ξ {user?.stats?.assets || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Volume:</span>
                <span className="text-green-400 font-mono">Ξ {user?.stats?.totalVolume || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-cyan-200 mb-4 font-orbitron">Scenario Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Dimension:</span>
                <span className="text-cyan-400 font-mono">{dimensionName || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Topic ID:</span>
                <span className="text-cyan-400 font-mono">{topicId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Scenario:</span>
                <span className="text-cyan-400 font-mono">{scenarioId || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
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

export default GameInterface;
