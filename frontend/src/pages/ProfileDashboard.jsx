import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const ProfileDashboard = () => {
  const { user, takeLoan, loading } = useEtherRift();
  const [loanAmount, setLoanAmount] = useState(50);
  const [showLoanModal, setShowLoanModal] = useState(false);
  
  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    await takeLoan(loanAmount);
    setShowLoanModal(false);
  };
  
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
            <li className="mt-2 pt-2 border-t border-gray-700">Token Balance: <span className="text-pink-400 font-mono">{user.tokenBalance}</span></li>
          </ul>
          <div className="w-full bg-gray-800 rounded h-3 mb-2">
            <div className="bg-cyan-400 h-3 rounded" style={{ width: `${Math.min(100, (user.stats.xp / 2000) * 100)}%` }} />
          </div>
          <span className="text-xs text-gray-400 font-mono">Progress to next level</span>
          
          {user.tokenBalance < 10 && (
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
              <p className="text-yellow-300 text-sm mb-2">Low on tokens! You need tokens for duels and learning.</p>
              <button 
                onClick={() => setShowLoanModal(true)}
                className="px-4 py-2 bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-200 rounded border border-yellow-500/50 text-sm transition-colors"
              >
                Take a Loan
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Loans Section */}
        {user.loans && user.loans.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-red-400/20 animate-border-glow">
            <h2 className="text-xl font-bold text-red-300 mb-4 font-orbitron">Active Loans</h2>
            <ul className="divide-y divide-gray-700">
              {user.loans.map((loan, idx) => (
                <li key={idx} className="py-3">
                  <div className="flex justify-between">
                    <span className="text-cyan-200">Borrowed:</span>
                    <span className="text-pink-400">{loan.amount} {loan.tokenBorrowed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-200">Collateral:</span>
                    <span className="text-yellow-400">{loan.collateralAmount} {loan.collateralToken}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(loan.timestamp).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
        
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
      
      {/* Loan Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 p-6 rounded-xl border-2 border-cyan-500/50 w-full max-w-md">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Take a Loan</h3>
            <p className="text-cyan-200 mb-4">Use your achievement tokens as collateral to get more tokens.</p>
            
            <form onSubmit={handleLoanSubmit}>
              <div className="mb-4">
                <label className="block text-cyan-300 mb-2">Loan Amount</label>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="10"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-cyan-400 mt-1">
                  <span>10</span>
                  <span>{loanAmount}</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className="mb-6 p-3 bg-gray-800/50 rounded">
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-200">Loan Amount:</span>
                  <span className="text-pink-400">{loanAmount} Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Collateral Required:</span>
                  <span className="text-yellow-400">{loanAmount * 1.5} Achievement Tokens</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Loan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
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