import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';
import { useNavigate } from 'react-router-dom';
import TopicPopup from '../components/TopicPopup';

const colorMap = {
  cyan: 'border-cyan-400 text-cyan-300',
  pink: 'border-pink-400 text-pink-300',
  green: 'border-green-400 text-green-300',
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, type: 'spring', stiffness: 60 } })
};

const DimensionHub = () => {
  const { dimensions, enterDimension } = useEtherRift();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(dimensions[0]);
  const [topicPopupOpen, setTopicPopupOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const handleEnterDimension = (dim) => {
    enterDimension(dim);
    navigate('/game');
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId);
    setTopicPopupOpen(true);
  };
  
  // Define topics for each dimension
  const dimensionTopics = {
    'Stable': [
      { id: 1, title: 'What is DeFi?' },
      { id: 2, title: 'Understanding Liquidity Pools & AMMs' },
      { id: 3, title: 'Introduction to Staking' },
      { id: 4, title: 'DeFi Lending & Borrowing' },
      { id: 5, title: 'The Role of Stablecoins' }
    ],
    'Volatile': [
      { id: 1, title: 'Mastering Yield Farming' },
      { id: 2, title: 'The Risk of Impermanent Loss' },
      { id: 3, title: 'Understanding Leverage & Liquidation' },
      { id: 4, title: 'Introduction to DeFi Derivatives' },
      { id: 5, title: 'Participating in DAO Governance' }
    ],
    'Arbitrage': [
      { id: 1, title: 'Cross-Exchange Arbitrage' },
      { id: 2, title: 'Triangular Arbitrage' },
      { id: 3, title: 'Flash Loans & Flash Swaps' },
      { id: 4, title: 'Cyclical (Network) Arbitrage' }
    ]
  };
  
  return (
    <div className="relative flex flex-row w-full z-10 min-h-[80vh] items-start justify-center gap-12 bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pt-16 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Topic Popup */}
      <TopicPopup 
        isOpen={topicPopupOpen}
        onClose={() => setTopicPopupOpen(false)}
        topic={selectedTopic}
        dimension={selected}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-300 mb-2 mt-6 font-orbitron">Choose Your Dimension</h1>
        <p className="text-cyan-200 mb-8 text-center max-w-xl font-mono">Each dimension offers unique market conditions and trading challenges. Select one to begin your journey!</p>
        <motion.div className="flex flex-wrap gap-8 justify-center w-full" initial="hidden" animate="visible">
          {dimensions.map((dim, idx) => (
            <motion.div
              key={dim.name}
              custom={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.07, boxShadow: `0 0 32px ${dim.color.includes('cyan') ? '#22d3ee' : dim.color.includes('pink') ? '#ec4899' : '#22c55e'}` }}
              onMouseEnter={() => setSelected(dim)}
              onClick={() => setSelected(dim)}
              className={`relative border-2 ${colorMap[dim.color]} rounded-2xl p-8 w-80 flex flex-col items-center transition-all duration-200 overflow-hidden font-orbitron cursor-pointer bg-black/60 backdrop-blur-lg glassmorph shadow-lg animate-border-glow`}
              style={{boxShadow: `0 0 16px ${dim.color.includes('cyan') ? '#22d3ee55' : dim.color.includes('pink') ? '#ec489955' : '#22c55e55'}`}}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl select-none">{dim.icon}</span>
              <h2 className={`text-2xl font-bold mb-2 ${colorMap[dim.color]} font-orbitron drop-shadow-[0_0_8px_#22d3ee]`}>{dim.name}</h2>
              <p className="text-cyan-200 mb-2 text-center text-base font-mono">{dim.desc}</p>
              <div className="flex gap-4 mb-2">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-cyan-200">Players</span>
                  <span className="text-xl font-mono text-cyan-400">{dim.players}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-yellow-200">Volatility</span>
                  <span className="text-xl font-mono text-yellow-400">{dim.volatility}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-green-200">APR</span>
                  <span className={`text-xl font-mono ${dim.color === 'cyan' ? 'text-cyan-400' : dim.color === 'pink' ? 'text-pink-400' : 'text-green-400'}`}>{dim.apr}</span>
                </div>
              </div>
              <div className="w-full border-t border-cyan-800 my-2" />
              <div className="text-xs text-cyan-300 mb-2 text-center font-mono">{dim.lore}</div>
              <ul className="text-xs text-cyan-200 mb-2 w-full pl-4 list-disc font-mono">
                {dim.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="w-full border-t border-cyan-800 my-2" />
              <div className="text-xs text-pink-300 mb-1 font-bold font-mono">Recent Events:</div>
              <ul className="text-xs text-pink-200 w-full pl-4 list-disc mb-2 font-mono">
                {dim.recentEvents.map(e => <li key={e}>{e}</li>)}
              </ul>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-2 px-8 py-3 border-2 border-cyan-400 text-cyan-100 font-bold rounded-full transition focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2 font-orbitron bg-black/70 hover:bg-cyan-400 hover:text-black animate-pulse-btn`}
                onClick={() => handleEnterDimension(dim)}
              >
                Enter
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Sidebar Info Panel */}
      <aside className="w-96 bg-black/70 border-l-2 border-cyan-900 p-6 flex flex-col gap-6 font-mono sticky top-24 min-h-[60vh] rounded-2xl shadow-xl glassmorph animate-border-glow">
        <div className="text-cyan-300 text-lg font-bold mb-2 font-orbitron">Dimension Info</div>
        <div className="text-cyan-200 text-base font-bold mb-1 font-orbitron">{selected.name}</div>
        <div className="text-cyan-400 text-xs mb-2 font-mono">{selected.lore}</div>
        
        {/* Topics Section */}
        <div className="text-cyan-200 text-xs mb-2 font-mono">Learning Topics:</div>
        <ul className="text-xs text-cyan-100 mb-4 pl-4 list-disc font-mono">
          {dimensionTopics[selected.name]?.map(topic => (
            <li 
              key={topic.id} 
              className="cursor-pointer hover:text-cyan-400 transition-colors"
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.title}
            </li>
          ))}
        </ul>
        
        <div className="text-cyan-200 text-xs mb-2 font-mono">Features:</div>
        <ul className="text-xs text-cyan-100 mb-2 pl-4 list-disc font-mono">
          {selected.features.map(f => <li key={f}>{f}</li>)}
        </ul>
        <div className="text-pink-300 text-xs font-bold mb-1 font-mono">Recent Events:</div>
        <ul className="text-xs text-pink-200 mb-2 pl-4 list-disc font-mono">
          {selected.recentEvents.map(e => <li key={e}>{e}</li>)}
        </ul>
        <div className="text-cyan-400 text-xs mt-4 font-mono">Tip: Click on a topic to learn more about it.</div>
      </aside>
      
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

export default DimensionHub;