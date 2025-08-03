import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserData } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

// Hardcoded topics data
const hardcodedTopics = [
  {
    id: 'Stable-1',
    dimension: 'Stable',
    title: 'What is DeFi?',
    description: 'Learn about the core philosophy of decentralized finance, smart contracts, and dApps.',
    scenarioId: 'stable-defi-intro'
  },
  {
    id: 'Stable-2',
    dimension: 'Stable',
    title: 'Understanding Liquidity Pools & AMMs',
    description: 'Discover how liquidity pools enable trading without traditional order books.',
    scenarioId: 'stable-liquidity-pools'
  },
  {
    id: 'Stable-3',
    dimension: 'Stable',
    title: 'Introduction to Staking',
    description: 'Learn how staking tokens helps secure networks while earning rewards.',
    scenarioId: 'stable-staking'
  },
  {
    id: 'Stable-4',
    dimension: 'Stable',
    title: 'DeFi Lending & Borrowing',
    description: 'Understand how to lend assets to earn interest or borrow against collateral.',
    scenarioId: 'stable-lending'
  },
  {
    id: 'Stable-5',
    dimension: 'Stable',
    title: 'The Role of Stablecoins',
    description: 'Learn why stablecoins are crucial for providing stability in volatile markets.',
    scenarioId: 'stable-stablecoins'
  },
  {
    id: 'Volatile-1',
    dimension: 'Volatile',
    title: 'Mastering Yield Farming',
    description: 'Explore advanced strategies to maximize returns across protocols.',
    scenarioId: 'volatile-yield-farming'
  },
  {
    id: 'Volatile-2',
    dimension: 'Volatile',
    title: 'The Risk of Impermanent Loss',
    description: 'Understand the opportunity cost liquidity providers face when prices change.',
    scenarioId: 'volatile-impermanent-loss'
  },
  {
    id: 'Volatile-3',
    dimension: 'Volatile',
    title: 'Understanding Leverage & Liquidation',
    description: 'Learn how borrowing can amplify gains but also dramatically increase risk.',
    scenarioId: 'volatile-liquidation'
  },
  {
    id: 'Volatile-4',
    dimension: 'Volatile',
    title: 'Introduction to DeFi Derivatives',
    description: 'Discover synthetic assets that track real-world prices without owning the underlying.',
    scenarioId: 'volatile-derivatives'
  },
  {
    id: 'Volatile-5',
    dimension: 'Volatile',
    title: 'Participating in DAO Governance',
    description: 'Learn how to vote on proposals and shape the future of protocols.',
    scenarioId: 'volatile-dao-governance'
  },
  {
    id: 'Arbitrage-1',
    dimension: 'Arbitrage',
    title: 'Cross-Exchange Arbitrage',
    description: 'Profit from price differences of the same asset across different exchanges.',
    scenarioId: 'arbitrage-cross-exchange'
  },
  {
    id: 'Arbitrage-2',
    dimension: 'Arbitrage',
    title: 'Triangular Arbitrage',
    description: 'Execute trades between three assets to profit from price discrepancies.',
    scenarioId: 'arbitrage-triangular'
  },
  {
    id: 'Arbitrage-3',
    dimension: 'Arbitrage',
    title: 'Flash Loans & Flash Swaps',
    description: 'Use uncollateralized loans to execute complex trades within a single transaction.',
    scenarioId: 'arbitrage-flash-loan'
  },
  {
    id: 'Arbitrage-4',
    dimension: 'Arbitrage',
    title: 'Cyclical (Network) Arbitrage',
    description: 'Identify profitable cycles across interconnected liquidity pools.',
    scenarioId: 'arbitrage-cyclical'
  }
];

const TutorialCenter = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user, wallet } = useAppSelector(state => state.user);
  
  const [topics] = useState(hardcodedTopics);
  const [currentPage, setCurrentPage] = useState(1);
  const [userTopics, setUserTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const topicsPerPage = 5;
  
  useEffect(() => {
    if (wallet) {
      fetchUserTopicsData();
    } else {
      setLoading(false);
    }
  }, [wallet]);
  
  const fetchUserTopicsData = async () => {
    try {
      console.log('Fetching user topics for wallet:', wallet);
      setLoading(true);
      setError(null);
      
      const response = await dispatch(fetchUserData(wallet));
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUserTopics(userData.topics || []);
      } else {
        console.log('User not found, will be registered when needed');
        setUserTopics([]);
      }
    } catch (error) {
      console.error("Error fetching user topics:", error);
      setError("Failed to load user data. Please try again.");
      setUserTopics([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTopicClick = (topic) => {
    // Check if topic is completed
    const isCompleted = userTopics.includes(topic.scenarioId);
    
    if (isCompleted) {
      // Show completion message or allow replay
      alert(`You've already completed "${topic.title}". Click OK to replay.`);
    }
    
    // Navigate to GameInterface with the scenarioId
    navigate(`/game/${topic.scenarioId}`);
  };
  
  const isTopicCompleted = (scenarioId) => {
    return userTopics.includes(scenarioId);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(topics.length / topicsPerPage);
  const startIndex = (currentPage - 1) * topicsPerPage;
  const endIndex = startIndex + topicsPerPage;
  const currentTopics = topics.slice(startIndex, endIndex);
  
  const completedCount = userTopics.length;
  const totalTopics = topics.length;
  
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Lessons & Progress */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-300 font-orbitron">Tutorials & Lessons</h2>
          <div className="text-sm text-cyan-400">
            {completedCount} / {totalTopics} completed
          </div>
        </div>
        
        {loading ? (
          <div className="text-cyan-200 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            Loading user data...
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">
            <div className="mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchUserTopicsData}
              className="px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {currentTopics.map((topic, idx) => {
              const isCompleted = isTopicCompleted(topic.scenarioId);
              
              return (
                <motion.div 
                  key={topic.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.15 }} 
                  className={`p-4 rounded-xl border-2 ${isCompleted ? 'border-green-400 bg-green-900 bg-opacity-30' : 'border-cyan-700 bg-gray-800 bg-opacity-60'} flex flex-col md:flex-row items-center gap-4 backdrop-blur-md glassmorph animate-border-glow cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => handleTopicClick(topic)}
                > 
                  <span className={`text-2xl font-bold ${isCompleted ? 'text-green-400' : 'text-cyan-300'} animate-bounce select-none`}>
                    {isCompleted ? '✔️' : '⏳'}
                  </span>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-cyan-200 font-orbitron">{topic.title}</div>
                    <div className="text-cyan-200 text-sm font-mono">{topic.description}</div>
                    <div className="text-xs text-cyan-400 mt-1">{topic.dimension} Dimension</div>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-full font-semibold transition ${isCompleted ? 'bg-green-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'} font-orbitron animate-pulse-btn`}
                  >
                    {isCompleted ? 'Replay' : 'Start'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            
            <span className="px-3 py-1 text-cyan-200 text-sm">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
        
        <div className="mt-6">
          <div className="w-full bg-gray-800 rounded h-3 mb-2">
            <div className="bg-cyan-400 h-3 rounded" style={{ width: `${(completedCount / (totalTopics || 1)) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400 font-mono">{completedCount} of {totalTopics} lessons completed</span>
        </div>
      </motion.div>
      
      {/* User Progress Summary */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 flex flex-col gap-4 border-2 border-pink-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-pink-300 mb-4 font-orbitron">Your Progress</h2>
        
        {/* Dimension Progress */}
        <div className="space-y-4">
          <div className="p-3 border border-gray-700 rounded-lg bg-black/40">
            <h3 className="text-cyan-300 font-semibold mb-1">Stable Dimension</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Topics completed</span>
              <span className="text-cyan-400 font-mono">
                {userTopics.filter(t => t.startsWith('stable-')).length} / 5
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded h-2 mt-2">
              <div className="bg-cyan-400 h-2 rounded" style={{ width: `${(userTopics.filter(t => t.startsWith('stable-')).length / 5) * 100}%` }} />
            </div>
          </div>
          
          <div className="p-3 border border-gray-700 rounded-lg bg-black/40">
            <h3 className="text-green-300 font-semibold mb-1">Volatile Dimension</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Topics completed</span>
              <span className="text-green-400 font-mono">
                {userTopics.filter(t => t.startsWith('volatile-')).length} / 5
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded h-2 mt-2">
              <div className="bg-green-400 h-2 rounded" style={{ width: `${(userTopics.filter(t => t.startsWith('volatile-')).length / 5) * 100}%` }} />
            </div>
          </div>
          
          <div className="p-3 border border-gray-700 rounded-lg bg-black/40">
            <h3 className="text-pink-300 font-semibold mb-1">Arbitrage Dimension</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Topics completed</span>
              <span className="text-pink-400 font-mono">
                {userTopics.filter(t => t.startsWith('arbitrage-')).length} / 4
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded h-2 mt-2">
              <div className="bg-pink-400 h-2 rounded" style={{ width: `${(userTopics.filter(t => t.startsWith('arbitrage-')).length / 4) * 100}%` }} />
            </div>
          </div>
        </div>
        
        {/* Recent Achievements */}
        {user.achievements && user.achievements.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-pink-300 font-semibold mb-2">Recent Achievements</h3>
            <div className="space-y-2">
              {user.achievements.slice(0, 3).map((achievement, idx) => (
                <div key={idx} className="p-2 bg-green-900/30 border border-green-600/30 rounded text-sm">
                  <div className="text-green-400 font-semibold">{achievement.name}</div>
                  <div className="text-xs text-green-300">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-pink-300 font-semibold mb-2">Recent Achievements</h3>
            <div className="p-2 bg-gray-800/30 border border-gray-600/30 rounded text-sm">
              <div className="text-gray-400">No achievements yet</div>
              <div className="text-xs text-gray-500">Complete topics to unlock achievements</div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2 font-mono">
          Complete topics to unlock achievements and advance to higher dimensions.
        </div>
      </motion.div>
      
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
          text-shadow: 0 0 2px #22d3ee;
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

export default TutorialCenter;