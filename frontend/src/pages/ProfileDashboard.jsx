import React from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const ProfileDashboard = () => {
  const { user } = useEtherRift();
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      {/* Stats & Badges */}
      <div className="flex-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
          <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Player Stats</h2>
          <ul className="text-cyan-200 text-sm mb-4 font-mono">
            <li>Level: <span className="text-cyan-400 font-mono">{user.stats.level}</span></li>
            <li>XP: <span className="text-cyan-400 font-mono">{user.stats.xp} / 2,000</span></li>
            <li>Win/Loss: <span className="text-cyan-400 font-mono">{user.stats.winLoss[0]} / {user.stats.winLoss[1]}</span></li>
            <li>Total Volume: <span className="text-cyan-400 font-mono">Ξ {user.stats.totalVolume}</span></li>
            <li>Dimensions Explored: <span className="text-cyan-400 font-mono">{user.stats.dimensionsExplored}</span></li>
          </ul>
          <div className="w-full bg-gray-800 rounded h-3 mb-2">
            <div className="bg-cyan-400 h-3 rounded" style={{ width: `${Math.min(100, (user.stats.xp / 2000) * 100)}%` }} />
          </div>
          <span className="text-xs text-gray-400 font-mono">Progress to next level</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-green-400/20 animate-border-glow">
          <h2 className="text-xl font-bold text-green-300 mb-4 font-orbitron">Badges</h2>
          <div className="flex gap-4">
            {user.badges.map((b, i) => (
              <motion.div key={b.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="flex flex-col items-center">
                <span className="text-3xl mb-1 select-none">{b.icon}</span>
                <span className="text-xs text-cyan-200 text-center font-orbitron">{b.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* Trading History */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 border-2 border-pink-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-pink-300 mb-4 font-orbitron">Trading History</h2>
        <ul className="text-cyan-200 text-sm divide-y divide-gray-700 font-mono">
          {user.history.map((h, idx) => (
            <motion.li key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.12 }} className="py-3">
              <span className="text-cyan-400 font-mono">[{h.time}]</span> {h.action}
            </motion.li>
          ))}
        </ul>
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
      `}</style>
    </div>
  );
};

export default ProfileDashboard; 