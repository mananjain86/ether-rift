import React from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const brackets = [
  { round: 'Quarterfinals', matches: ['PlayerX vs PlayerA', 'PlayerY vs PlayerB'] },
  { round: 'Semifinals', matches: ['Winner1 vs Winner2'] },
  { round: 'Final', matches: ['Winner3 vs Winner4'] },
];

const Leaderboard = () => {
  const { leaderboard, guilds } = useEtherRift();
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Leaderboard</h2>
        <ul className="divide-y divide-gray-700">
          {leaderboard.map((p, idx) => (
            <motion.li key={p.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.12 }} className="flex items-center gap-4 py-4">
              <span className="text-3xl select-none">{p.avatar}</span>
              <span className="font-bold text-lg text-cyan-200 font-orbitron">{p.name}</span>
              <span className="ml-auto text-pink-400 font-mono text-xl">{p.score}</span>
              <span className="ml-2 text-xs text-gray-400 font-mono">#{idx + 1}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      {/* Tournament Brackets & Guilds */}
      <div className="flex flex-col gap-6 w-full md:w-96">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-yellow-400/20 animate-border-glow">
          <h2 className="text-lg font-bold text-yellow-300 mb-2 font-orbitron">Tournament Brackets</h2>
          <ul className="text-cyan-200 text-sm font-mono">
            {brackets.map((b, idx) => (
              <li key={b.round} className="mb-2">
                <span className="font-semibold text-cyan-400 font-orbitron">{b.round}:</span>
                <ul className="ml-4 list-disc">
                  {b.matches.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-green-400/20 animate-border-glow">
          <h2 className="text-lg font-bold text-green-300 mb-2 font-orbitron">Guild Standings</h2>
          <ul className="text-cyan-200 text-sm font-mono">
            {guilds.map((g, idx) => (
              <motion.li key={g.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.12 }} className="flex justify-between py-2">
                <span className="font-semibold text-cyan-200 font-orbitron">{g.name}</span>
                <span className="text-pink-400 font-mono">{g.points}</span>
                <span className="text-xs text-gray-400 font-mono">#{idx + 1}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
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
          text-shadow: 0 0 2px #22d3ee;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard; 