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
      
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Topic Popup */}
      <TopicPopup 
        isOpen={topicPopupOpen}
        onClose={() => setTopicPopupOpen(false)}
        dimension={selected.name}
      />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-cyan-300 mb-4 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">Choose Your Dimension</h1>
          <p className="text-cyan-200 text-xl max-w-3xl mx-auto font-mono">Each dimension offers unique market conditions and trading challenges. Select one to begin your journey!</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Dimension Cards - Takes 3/4 of the width on large screens */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dimensions.map((dim, idx) => (
                <motion.div
                  key={dim.name}
                  custom={idx}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 32px ${dim.color.includes('cyan') ? '#22d3ee' : dim.color.includes('pink') ? '#ec4899' : '#22c55e'}` }}
                  onMouseEnter={() => setSelected(dim)}
                  onClick={() => setSelected(dim)}
                  className={`relative border-2 ${colorMap[dim.color]} rounded-2xl p-6 transition-all duration-200 overflow-hidden font-orbitron cursor-pointer bg-black/60 backdrop-blur-lg glassmorph shadow-lg animate-border-glow h-[400px] flex flex-col`}
                  style={{boxShadow: `0 0 16px ${dim.color.includes('cyan') ? '#22d3ee55' : dim.color.includes('pink') ? '#ec489955' : '#22c55e55'}`}}
                >
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl select-none">{dim.icon}</span>
                  <h2 className={`text-xl font-bold mb-3 ${colorMap[dim.color]} font-orbitron drop-shadow-[0_0_8px_#22d3ee] mt-4`}>{dim.name}</h2>
                  <p className="text-cyan-200 mb-4 text-center text-sm font-mono flex-grow">{dim.desc}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <span className="text-xs font-semibold text-cyan-200">Players</span>
                      <div className="text-lg font-mono text-cyan-400">{dim.players}</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold text-yellow-200">Volatility</span>
                      <div className="text-lg font-mono text-yellow-400">{dim.volatility}</div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-semibold text-green-200">APR</span>
                      <div className={`text-lg font-mono ${dim.color === 'cyan' ? 'text-cyan-400' : dim.color === 'pink' ? 'text-pink-400' : 'text-green-400'}`}>{dim.apr}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-cyan-300 mb-3 text-center font-mono">{dim.lore}</div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`mt-auto px-6 py-3 border-2 border-cyan-400 text-cyan-100 font-bold rounded-lg transition focus:ring-4 focus:ring-cyan-400 focus:ring-offset-2 font-orbitron bg-black/70 hover:bg-cyan-400 hover:text-black animate-pulse-btn`}
                    onClick={() => setTopicPopupOpen(true)}
                  >
                    Enter Dimension
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Info Panel - Takes 1/4 of the width on large screens */}
          <div className="xl:col-span-1">
            <div className="bg-black/70 border-2 border-cyan-900 p-6 rounded-2xl shadow-xl glassmorph animate-border-glow sticky top-24">
              <div className="text-cyan-300 text-xl font-bold mb-4 font-orbitron">Dimension Info</div>
              <div className="text-cyan-200 text-lg font-bold mb-2 font-orbitron">{selected.name}</div>
              <div className="text-cyan-400 text-sm mb-4 font-mono">{selected.lore}</div>
              
              <div className="mb-4">
                <div className="text-cyan-200 text-sm mb-2 font-mono font-semibold">Features:</div>
                <ul className="text-xs text-cyan-100 space-y-1">
                  {selected.features.map(f => <li key={f} className="font-mono">• {f}</li>)}
                </ul>
              </div>
              
              <div className="mb-4">
                <div className="text-pink-300 text-sm font-bold mb-2 font-mono">Recent Events:</div>
                <ul className="text-xs text-pink-200 space-y-1">
                  {selected.recentEvents.map(e => <li key={e} className="font-mono">• {e}</li>)}
                </ul>
              </div>
              
              <div className="text-cyan-400 text-xs mt-6 font-mono p-3 bg-cyan-400/10 rounded-lg">
                💡 Tip: Click on a topic to learn more about it and start your educational journey!
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
          text-shadow: 0 0 8px #22d3ee;
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