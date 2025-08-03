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
            
            <div className="text-cyan-100 mb-6 font-mono">
              {topics[dimension].map(item => <p key={item.scenarioId} onClick={() => handleTopicClick(item.scenarioId)}>{item.title}</p>)}
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