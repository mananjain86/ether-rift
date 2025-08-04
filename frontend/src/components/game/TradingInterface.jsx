import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  swapTokens, 
  stakeTokens, 
  unstakeTokens, 
  provideLiquidity, 
  removeLiquidity, 
  flashLoan,
  lendTokens,
  borrowTokens,
  repayTokens,
  yieldFarm,
  vote,
  getTokenAddress,
  getAllUserBalances
} from '../../contracts/contract';
import { updateSingleTokenBalance, recordTrade, updateTokenBalanceThunk } from '../../store/slices/userSlice';
import { generateDeFiFeedback, generateEducationalFeedback } from '../../utils/defiFeedback';

const TradingInterface = ({ onTradeFeedback }) => {
  const dispatch = useAppDispatch();
  const { wallet, isRegistered, user } = useAppSelector(state => state.user);

  console.log('TradingInterface - wallet:', wallet);
  console.log('TradingInterface - isRegistered:', isRegistered);
  console.log('TradingInterface - user:', user);
  
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('swap');
  const [selectedToken, setSelectedToken] = useState('vETH');
  const [selectedToToken, setSelectedToToken] = useState('vUSDC');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [flashLoanAmount, setFlashLoanAmount] = useState('');
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const userBalances = user.tokenBalances || {
    vETH: 100,
    vUSDC: 0,
    vDAI: 0,
    ERA: 0
  };

  const handleSwap = async () => {
    if (!amount) return;
    
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const fromToken = getTokenAddress(selectedToken);
      const toToken = getTokenAddress(selectedToToken);
      
      await swapTokens(fromToken, toToken, amount);
      
      // Update user balances
      const newBalances = {
        ...userBalances,
        [selectedToken]: userBalances[selectedToken] - requiredAmount,
        [selectedToToken]: userBalances[selectedToToken] + requiredAmount
      };
      
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalances[selectedToken] }));
      dispatch(updateSingleTokenBalance({ token: selectedToToken, amount: newBalances[selectedToToken] }));
      
      // Update MongoDB with trade record
      const tradeRecord = {
        type: 'swap',
        fromToken: selectedToken,
        toToken: selectedToToken,
        amount: requiredAmount,
        timestamp: new Date().toISOString(),
        volume: requiredAmount * (userBalances[selectedToken] || 0)
      };
      
      try {
        await recordTrade(wallet, tradeRecord);
        console.log('✅ Trade recorded in MongoDB successfully');
        
        // Update token balances using thunk
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: requiredAmount,
          operation: 'subtract'
        })).unwrap();
        
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToToken,
          amount: requiredAmount,
          operation: 'add'
        })).unwrap();
        
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update MongoDB:', error);
        // Continue with the operation even if MongoDB update fails
      }
      
      // Generate detailed feedback
      const feedback = generateDeFiFeedback('swap', requiredAmount, selectedToken, {
        fromToken: selectedToken,
        toToken: selectedToToken
      });
      
      // Show feedback in place of interface
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      onTradeFeedback('swap', amount, feedback);
      setAmount('');
      setError(null);
    } catch (error) {
      console.error('Swap error:', error);
      setError(`Swap failed: ${error.message}`);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions.");
      return;
    }
    
    const requiredAmount = parseFloat(stakeAmount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const token = getTokenAddress(selectedToken);
      
      await stakeTokens(token, stakeAmount);
      
      const newBalance = currentBalance - requiredAmount;
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update token balances in MongoDB
      try {
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: requiredAmount,
          operation: 'subtract'
        })).unwrap();
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update token balances in MongoDB:', error);
      }
      
      onTradeFeedback('stake', stakeAmount);
      setStakeAmount('');
      setError(null);
    } catch (error) {
      console.error('Stake error:', error);
      setError(`Stake failed: ${error.message}`);
    }
  };

  const handleProvideLiquidity = async () => {
    if (!amount) return;
    
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions.");
      return;
    }
    
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const tokenA = getTokenAddress(selectedToken);
      const tokenB = getTokenAddress('vUSDC'); // vUSDC
      
      await provideLiquidity(tokenA, tokenB, amount, amount);
      
      const newBalance = currentBalance - requiredAmount;
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update token balances in MongoDB
      try {
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: requiredAmount,
          operation: 'subtract'
        })).unwrap();
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update token balances in MongoDB:', error);
      }
      
      onTradeFeedback('provideLiquidity', amount);
      setAmount('');
      setError(null);
    } catch (error) {
      console.error('Provide liquidity error:', error);
      setError(`Provide liquidity failed: ${error.message}`);
    }
  };

  const handleFlashLoan = async () => {
    if (!flashLoanAmount) return;
    
    try {
      const token = getTokenAddress(selectedToken);
      
      await flashLoan(token, flashLoanAmount);
      
      onTradeFeedback('flashLoan', flashLoanAmount);
      setFlashLoanAmount('');
      setError(null);
    } catch (error) {
      console.error('Flash loan error:', error);
      setError(`Flash loan failed: ${error.message}`);
    }
  };

  const handleLend = async () => {
    if (!amount) return;
    
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions.");
      return;
    }
    
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const token = getTokenAddress(selectedToken);
      
      await lendTokens(token, amount);
      
      const newBalance = currentBalance - requiredAmount;
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update token balances in MongoDB
      try {
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: requiredAmount,
          operation: 'subtract'
        })).unwrap();
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update token balances in MongoDB:', error);
      }
      
      onTradeFeedback('lend', amount);
      setAmount('');
      setError(null);
    } catch (error) {
      console.error('Lend error:', error);
      setError(`Lend failed: ${error.message}`);
    }
  };

  const handleBorrow = async () => {
    if (!amount) return;
    
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions.");
      return;
    }
    
    try {
      const borrowToken = getTokenAddress(selectedToken);
      const collateralToken = getTokenAddress('vETH'); // Use vETH as collateral
      const collateralAmount = parseFloat(amount) * 1.5; // 150% collateral ratio
      
      await borrowTokens(borrowToken, amount, collateralToken, collateralAmount);
      
      // Add borrowed amount to balance
      const newBalance = userBalances[selectedToken] + parseFloat(amount);
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update token balances in MongoDB
      try {
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: parseFloat(amount),
          operation: 'add'
        })).unwrap();
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update token balances in MongoDB:', error);
      }
      
      onTradeFeedback('borrow', amount);
      setAmount('');
      setError(null);
    } catch (error) {
      console.error('Borrow error:', error);
      setError(`Borrow failed: ${error.message}`);
    }
  };

  const handleYieldFarm = async () => {
    if (!amount) return;
    
    if (!isRegistered) {
      setError("Please register first to enable DeFi functions.");
      return;
    }
    
    const requiredAmount = parseFloat(amount);
    const currentBalance = userBalances[selectedToken];
    
    if (requiredAmount > currentBalance) {
      setError(`Insufficient ${selectedToken} balance. You have ${currentBalance} ${selectedToken}, need ${requiredAmount}`);
      return;
    }
    
    try {
      const token = getTokenAddress(selectedToken);
      
      await yieldFarm(token, amount);
      
      const newBalance = currentBalance - requiredAmount;
      dispatch(updateSingleTokenBalance({ token: selectedToken, amount: newBalance }));
      
      // Update MongoDB with farming record
      const farmingRecord = {
        type: 'yieldFarm',
        token: selectedToken,
        amount: requiredAmount,
        timestamp: new Date().toISOString(),
        volume: requiredAmount * (userBalances[selectedToken] || 0)
      };
      
      try {
        await recordTrade(wallet, farmingRecord);
        console.log('✅ Yield farming recorded in MongoDB successfully');
        
        // Update token balances using thunk
        await dispatch(updateTokenBalanceThunk({
          walletAddress: wallet,
          token: selectedToken,
          amount: requiredAmount,
          operation: 'subtract'
        })).unwrap();
        
        console.log('✅ Token balances updated in MongoDB successfully');
      } catch (error) {
        console.error('⚠️ Failed to update MongoDB:', error);
        // Continue with the operation even if MongoDB update fails
      }
      
      // Generate detailed feedback
      const feedback = generateDeFiFeedback('yieldFarm', requiredAmount, selectedToken, {
        farmingToken: selectedToken,
        days: Math.floor(Math.random() * 30) + 1
      });
      
      // Show feedback in place of interface
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      onTradeFeedback('yieldFarm', amount, feedback);
      setAmount('');
      setError(null);
    } catch (error) {
      console.error('Yield farm error:', error);
      setError(`Yield farming failed: ${error.message}`);
    }
  };

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
            </div>
          </div>
        );

      case 'lending':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Token</label>
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
                onClick={handleLend}
              >
                Lend
              </button>
              <button 
                className="flex-1 px-6 py-3 border-2 border-blue-400 bg-black/70 hover:bg-blue-400 hover:text-black text-blue-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                onClick={handleBorrow}
              >
                Borrow
              </button>
            </div>
          </div>
        );

      case 'yieldfarm':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-300 text-sm font-mono mb-2">Token to Farm</label>
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
              <label className="block text-cyan-300 text-sm font-mono mb-2">Amount to Farm</label>
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
                onClick={handleYieldFarm}
              >
                Start Farming
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-cyan-200">Select a function to start trading.</p>
          </div>
        );
    }
  };

  // Show feedback in place of interface
  if (showFeedback && currentFeedback) {
    return (
      <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow h-[800px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-200 font-orbitron animate-glow">Transaction Feedback</h3>
          <button
            onClick={() => {
              setShowFeedback(false);
              setCurrentFeedback(null);
            }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            currentFeedback.isProfit ? 'border-green-500/30 bg-green-900/20' : 'border-red-500/30 bg-red-900/20'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">{currentFeedback.isProfit ? '📈' : '📉'}</div>
              <div>
                <h4 className="text-lg font-bold text-white">{currentFeedback.title}</h4>
                <p className="text-gray-300 text-sm">{currentFeedback.message}</p>
              </div>
            </div>
            
            {currentFeedback.profitLoss !== undefined && (
              <div className="mb-3">
                <span className="text-gray-400">Profit/Loss: </span>
                <span className={`text-lg font-bold ${currentFeedback.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                  {currentFeedback.isProfit ? '+' : ''}{currentFeedback.profitLoss.toFixed(4)} {currentFeedback.token}
                  <span className="text-sm ml-2">
                    ({currentFeedback.profitLossPercentage.toFixed(2)}%)
                  </span>
                </span>
              </div>
            )}
            
            {currentFeedback.details && currentFeedback.details.length > 0 && (
              <div className="space-y-2">
                {currentFeedback.details.map((detail, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span className="text-gray-300">{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
            <h4 className="text-white font-semibold mb-2">💡 Learning Points</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Always verify transaction details before confirming</p>
              <p>• Monitor gas prices for optimal timing</p>
              <p>• Consider impermanent loss in liquidity provision</p>
              <p>• Diversify your DeFi strategies</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowFeedback(false);
              setCurrentFeedback(null);
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-semibold"
          >
            Continue Trading
          </button>
        </div>
      </div>
    );
  }

  return (
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
          <option value="flashloan">Flash Loan</option>
          <option value="liquidity">Provide/Remove Liquidity</option>
          <option value="lending">Lend/Borrow</option>
          <option value="yieldfarm">Yield Farming</option>
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
      </div>
    </div>
  );
};

export default TradingInterface; 