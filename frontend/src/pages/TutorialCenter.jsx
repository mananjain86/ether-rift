import React from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const lessons = [
  { title: 'Intro to DeFi', desc: 'Learn the basics of decentralized finance.' },
  { title: 'Token Swaps', desc: 'Practice swapping tokens on a DEX.' },
  { title: 'Yield Farming', desc: 'Understand and try yield farming strategies.' },
  { title: 'Arbitrage', desc: 'Spot and exploit price differences.' },
];

const TutorialCenter = () => {
  const { user, completeTutorial } = useEtherRift();
  const completed = user.tutorial.filter(Boolean).length;
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      {/* Lessons & Progress */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Tutorials & Lessons</h2>
        <div className="flex flex-col gap-4">
          {lessons.map((l, idx) => (
            <motion.div key={l.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }} className={`p-4 rounded-xl border-2 ${user.tutorial[idx] ? 'border-green-400 bg-green-900 bg-opacity-30' : 'border-cyan-700 bg-gray-800 bg-opacity-60'} flex flex-col md:flex-row items-center gap-4 backdrop-blur-md glassmorph animate-border-glow`}> 
              <span className={`text-2xl font-bold ${user.tutorial[idx] ? 'text-green-400' : 'text-cyan-300'} animate-bounce select-none`}>{user.tutorial[idx] ? '✔️' : '⏳'}</span>
              <div className="flex-1">
                <div className="text-lg font-semibold text-cyan-200 font-orbitron">{l.title}</div>
                <div className="text-cyan-200 text-sm font-mono">{l.desc}</div>
              </div>
              <button
                className={`px-4 py-2 rounded-full font-semibold transition ${user.tutorial[idx] ? 'bg-green-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white'} font-orbitron animate-pulse-btn`}
                disabled={user.tutorial[idx]}
                onClick={() => completeTutorial(idx)}
              >
                {user.tutorial[idx] ? 'Completed' : 'Start'}
              </button>
            </motion.div>
          ))}
        </div>
        <div className="mt-6">
          <div className="w-full bg-gray-800 rounded h-3 mb-2">
            <div className="bg-cyan-400 h-3 rounded" style={{ width: `${(completed / lessons.length) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400 font-mono">{completed} of {lessons.length} lessons completed</span>
        </div>
      </motion.div>
      {/* Practice Trading (Mock) */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 flex flex-col gap-4 border-2 border-pink-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-pink-300 mb-4 font-orbitron">Practice Trading</h2>
        <div className="flex gap-4">
          <input type="number" placeholder="Amount" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
          <input type="number" placeholder="Price" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 px-4 py-2 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded transition font-orbitron animate-pulse-btn">Buy</button>
          <button className="flex-1 px-4 py-2 border-2 border-pink-400 bg-black/70 hover:bg-pink-400 hover:text-black text-pink-200 font-bold rounded transition font-orbitron animate-pulse-btn">Sell</button>
        </div>
        <div className="text-xs text-gray-400 mt-2 font-mono">This is a practice area. No real assets are used.</div>
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