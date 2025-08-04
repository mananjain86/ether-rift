import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TopicPopup = ({ isOpen, onClose, dimension }) => {
  const navigate = useNavigate();
  console.log(dimension);
  const topics = {
    'Stable Dimension': [
      { scenarioId: 'stable-defi-intro', title: 'What is DeFi?' },
      { scenarioId: 'stable-liquidity-pools', title: 'Understanding Liquidity Pools & AMMs' },
      { scenarioId: 'stable-staking', title: 'Introduction to Staking' },
      { scenarioId: 'stable-lending', title: 'DeFi Lending & Borrowing' },
      { scenarioId: 'stable-stablecoins', title: 'The Role of Stablecoins' }
    ],
    'Volatile Dimension': [
      { scenarioId: 'volatile-yield-farming', title: 'Mastering Yield Farming' },
      { scenarioId: 'volatile-impermanent-loss', title: 'The Risk of Impermanent Loss' },
      { scenarioId: 'volatile-leverage-liquidation', title: 'Understanding Leverage & Liquidation' },
      { scenarioId: 'volatile-derivatives', title: 'Introduction to DeFi Derivatives' },
      { scenarioId: 'volatile-dao-governance', title: 'Participating in DAO Governance' }
    ],
    'Arbitrage Dimension': [
      { scenarioId: 'arbitrage-cross-exchange', title: 'Cross-Exchange Arbitrage' },
      { scenarioId: 'arbitrage-triangular', title: 'Triangular Arbitrage' },
      { scenarioId: 'arbitrage-flash-loans', title: 'Flash Loans & Flash Swaps' },
      { scenarioId: 'arbitrage-network-arbitrage', title: 'Cyclical (Network) Arbitrage' }
    ]
  };

  const handleTopicClick = (scenarioId) => {
    // Map full dimension name to dimension key expected by backend
    const dimensionMap = {
      'Stable Dimension': 'Stable',
      'Volatile Dimension': 'Volatile',
      'Arbitrage Dimension': 'Arbitrage'
    };
    const dimensionKey = dimensionMap[dimension] || dimension;

    // Navigate to GameInterface with correct dimension key and topic id
    navigate(`/game/${scenarioId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full max-w-2xl bg-black/90 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400 animate-border-glow"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 font-orbitron">{dimension}</h3>
              <div className="grid grid-cols-1 gap-3">
                {topics[dimension].map((item, index) => (
                  <motion.button
                    key={item.scenarioId}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 text-left bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-cyan-900/60 hover:to-blue-900/60 border border-gray-600 hover:border-cyan-400 rounded-lg transition-all duration-200 group"
                    onClick={() => handleTopicClick(item.scenarioId)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-cyan-400 text-sm font-mono">Topic {index + 1}</span>
                        <h4 className="text-white font-semibold group-hover:text-cyan-200 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border-2 border-cyan-400 bg-black/70 hover:bg-cyan-400 hover:text-black text-cyan-200 font-bold rounded transition font-orbitron animate-pulse-btn"
                onClick={onClose}
              >
                Close
              </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TopicPopup;