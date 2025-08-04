import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { MarketDataGenerator } from '../components/game/MarketDataGenerator.js';
import MarketChart from '../components/game/MarketChart';
import TradingInterface from '../components/game/TradingInterface';
import EducationalScript from '../components/game/EducationalScript';
import TopicCompletion from '../components/TopicCompletion';
import DeFiFeedbackDisplay from '../components/DeFiFeedbackDisplay';

import { getTopicInfo, isTheoreticalTopic } from '../utils/topicData';
import { signGuestbook } from '../contracts/contract';

const GameInterface = () => {
  const location = useLocation();
  const { scenarioId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const dimensionName = queryParams.get('dimension');
  const topicId = parseInt(queryParams.get('topic'), 10);

  const { wallet, user, isRegistered } = useAppSelector(state => state.user);
  
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataGenerator, setDataGenerator] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showEducationalScript, setShowEducationalScript] = useState(true);
  const [tradeFeedback, setTradeFeedback] = useState(null);

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

  // Get topic data
  const topicData = getTopicInfo(scenarioId);

  // Handle educational script actions
  const handleEducationalAction = async (actionFunction) => {
    try {
      switch (actionFunction) {
        case 'signGuestbook':
          console.log('Signed guestbook');
          try {
            await signGuestbook(wallet);
            console.log('Guestbook signed successfully');
          } catch (error) {
            console.error('Error signing guestbook:', error);
          }
        break;
        case 'provideLiquidity':
          // This will be handled by the trading interface
          break;
        case 'swap':
          // This will be handled by the trading interface
          break;
        case 'stake':
          // This will be handled by the trading interface
          break;
        case 'flashLoan':
          // This will be handled by the trading interface
          break;
        case 'lend':
          // This will be handled by the trading interface
          break;
        case 'borrow':
          // This will be handled by the trading interface
          break;
        case 'vote':
          console.log('Voted on proposal');
          break;
        case 'completeTopic':
          setShowCompletion(true);
          setShowEducationalScript(false);
          break;
        case 'continue':
          // Just continue to next step
          break;
        default:
          console.log('Unknown action:', actionFunction);
      }
    } catch (error) {
      console.error('Error in educational action:', error);
    }
  };

  // Handle trade feedback
  const handleTradeFeedback = (tradeType, amount, detailedFeedback = null) => {
    let feedback = {
      type: 'success',
      title: 'Transaction Successful!',
      message: '',
      details: []
    };

    if (detailedFeedback) {
      // Use detailed feedback from DeFi operations
      feedback = {
        type: detailedFeedback.isProfit ? 'success' : 'info',
        title: detailedFeedback.title,
        message: detailedFeedback.message,
        details: detailedFeedback.details,
        profitLoss: detailedFeedback.profitLoss,
        profitLossPercentage: detailedFeedback.profitLossPercentage,
        marketMovement: detailedFeedback.marketMovement,
        timeBasedOutcome: detailedFeedback.timeBasedOutcome
      };
    } else {
      // Fallback to basic feedback
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
        case 'lend':
          feedback.message = `Successfully lent ${amount} tokens`;
          feedback.details = [
            'Tokens deposited in lending pool',
            'Earning interest at ~3% APY',
            'Can withdraw anytime'
          ];
          break;
        case 'borrow':
          feedback.message = `Successfully borrowed ${amount} tokens`;
          feedback.details = [
            'Collateral locked in protocol',
            'Interest rate: ~5% APY',
            'Must maintain collateral ratio'
          ];
          break;
        case 'yieldFarm':
          feedback.message = `Successfully started yield farming with ${amount} tokens`;
          feedback.details = [
            'Tokens locked in farming pool',
            'Earning rewards at ~15% APY',
            'Can harvest rewards anytime'
        ];
        break;
      default:
        feedback.message = 'Transaction completed successfully';
    }
    }

    setTradeFeedback(feedback);
    setTimeout(() => setTradeFeedback(null), 8000);
  };

  // Handle topic completion
  const handleTopicComplete = () => {
    setShowCompletion(true);
    setShowEducationalScript(false);
    // Sync user data to get updated topics
    syncUserData();
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
            <MarketChart 
              marketData={marketData} 
              topicData={topicData} 
              isTheoreticalTopic={isTheoreticalTopic(scenarioId)} 
            />
          </div>

          {/* Trading Panel - Takes 1/3 of the width on large screens */}
            <div className="lg:col-span-1">
            <TradingInterface onTradeFeedback={handleTradeFeedback} />
              </div>
        </div>

        {/* Educational Script Section */}
        {showEducationalScript && (
          <div className="mt-8">
            <EducationalScript 
              scenarioId={scenarioId} 
              onAction={handleEducationalAction} 
            />
                        </div>
        )}

        {/* Topic Completion Section */}
        {!showEducationalScript && !showCompletion && (
          <div className="mt-8">
            <TopicCompletion 
              scenarioId={scenarioId} 
              onComplete={handleTopicComplete} 
            />
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
              </div>
            </div>
                  </div>
                )}
                
        {/* DeFi Feedback Display */}
        {tradeFeedback && tradeFeedback.profitLoss !== undefined && (
          <DeFiFeedbackDisplay 
            feedback={tradeFeedback} 
            onClose={() => setTradeFeedback(null)} 
          />
        )}

        {/* Basic Trade Feedback */}
        {tradeFeedback && tradeFeedback.profitLoss === undefined && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-2 ${
            tradeFeedback.type === 'success' ? 'border-green-400 bg-green-900/80' :
            tradeFeedback.type === 'error' ? 'border-red-400 bg-red-900/80' :
            'border-cyan-400 bg-cyan-900/80'
          } backdrop-blur-sm max-w-md`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {tradeFeedback.type === 'success' ? '✅' : 
                 tradeFeedback.type === 'error' ? '❌' : 'ℹ️'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{tradeFeedback.title}</h3>
                <p className="text-gray-200 text-sm mb-2">{tradeFeedback.message}</p>
                {tradeFeedback.details && tradeFeedback.details.length > 0 && (
                  <div className="text-xs text-gray-300 space-y-1">
                    {tradeFeedback.details.map((detail, index) => (
                      <div key={index}>• {detail}</div>
                          ))}
                        </div>
                )}
                      </div>
              <button
                onClick={() => setTradeFeedback(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
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

export default GameInterface;
