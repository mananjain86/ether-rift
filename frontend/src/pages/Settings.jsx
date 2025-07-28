import React from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const Settings = () => {
  const { user, updateSettings, disconnectWallet } = useEtherRift();
  const s = user.settings;
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Preferences</h2>
        <div className="flex flex-col gap-3">
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.darkMode} onChange={e => updateSettings('darkMode', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Dark Mode</span>
          </motion.label>
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.advancedTools} onChange={e => updateSettings('advancedTools', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Enable Advanced Tools</span>
          </motion.label>
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.notifications} onChange={e => updateSettings('notifications', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Enable Notifications</span>
          </motion.label>
        </div>
      </motion.div>
      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 flex flex-col gap-4 border-2 border-pink-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-pink-300 mb-4 font-orbitron">Security</h2>
        <div className="flex flex-col gap-3">
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.twoFA} onChange={e => updateSettings('twoFA', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Enable 2FA</span>
          </motion.label>
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.spendingLimit} onChange={e => updateSettings('spendingLimit', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Set spending limit</span>
          </motion.label>
          <motion.label whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
            <input type="checkbox" className="accent-cyan-500 scale-125" checked={s.showPrivateKey} onChange={e => updateSettings('showPrivateKey', e.target.checked)} />
            <span className="text-cyan-200 font-mono">Show private key (danger!)</span>
          </motion.label>
        </div>
      </motion.div>
      {/* Wallet Management */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 flex flex-col gap-4 border-2 border-green-400/20 animate-border-glow">
        <h2 className="text-xl font-bold text-green-300 mb-4 font-orbitron">Wallet Management</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-cyan-200 font-mono">Connected Wallet:</span>
            <span className="text-cyan-400 font-mono">MetaMask</span>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded transition font-orbitron" onClick={disconnectWallet}>Disconnect</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded transition font-orbitron">Switch Wallet</motion.button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold text-cyan-200 mb-2 font-orbitron">Transaction History</h3>
          <ul className="text-gray-200 text-xs max-h-24 overflow-y-auto divide-y divide-gray-700">
            <li className="py-2">[10:21] Swapped 0.5 ETH for USDC</li>
            <li className="py-2">[10:18] Provided liquidity to Stable Pool</li>
            <li className="py-2">[10:15] Claimed rewards</li>
          </ul>
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
      `}</style>
    </div>
  );
};

export default Settings; 