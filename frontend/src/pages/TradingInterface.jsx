import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';

const TradingInterface = () => {
  const { orderBook, trade, user } = useEtherRift();
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleTrade = (type) => {
    if (!amount || !price) return;
    trade(type, parseFloat(amount), parseFloat(price));
    setAmount('');
    setPrice('');
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      <div className="flex-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400 animate-border-glow relative overflow-hidden">
          <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Price Chart</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderBook.map((o, i) => ({ time: i, price: o.price }))}>
                <XAxis dataKey="time" stroke="#67e8f9" />
                <YAxis stroke="#67e8f9" />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-10 pointer-events-none animate-pulse" />
        </motion.div>
        {/* Trade Form */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl flex flex-col gap-4 border-2 border-pink-400/20 animate-border-glow">
          <h2 className="text-xl font-bold text-cyan-300 mb-2 font-orbitron">Trade</h2>
          <div className="flex gap-4">
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
          </div>
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded transition font-orbitron animate-pulse-btn" onClick={() => handleTrade('Buy')}>Buy</button>
            <button className="flex-1 px-4 py-2 border-2 border-pink-400 bg-black/70 hover:bg-pink-400 hover:text-black text-pink-200 font-bold rounded transition font-orbitron animate-pulse-btn" onClick={() => handleTrade('Sell')}>Sell</button>
          </div>
        </motion.div>
        {/* Spell Actions */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl flex flex-col gap-3 border-2 border-purple-400/20 animate-border-glow">
          <h2 className="text-xl font-bold text-cyan-300 mb-2 font-orbitron">Trading Spells</h2>
          <div className="flex gap-4 flex-wrap">
            <button className="px-4 py-2 border-2 border-purple-400 bg-black/70 hover:bg-purple-500 hover:text-black text-purple-200 rounded-full font-semibold transition font-orbitron animate-pulse-btn">Deploy Liquidity Pool</button>
            <button className="px-4 py-2 border-2 border-blue-400 bg-black/70 hover:bg-blue-500 hover:text-black text-blue-200 rounded-full font-semibold transition font-orbitron animate-pulse-btn">Create Synthetic Asset</button>
            <button className="px-4 py-2 border-2 border-yellow-400 bg-black/70 hover:bg-yellow-500 hover:text-black text-yellow-200 rounded-full font-semibold transition font-orbitron animate-pulse-btn">Summon Trading Bot</button>
          </div>
        </motion.div>
        {/* Inventory */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-green-400/10 animate-border-glow">
          <h3 className="text-lg font-bold text-green-200 mb-2 font-orbitron">Inventory</h3>
          <ul className="text-cyan-200 text-sm font-mono">
            {user.inventory.map((item, i) => <li key={i}>{item}</li>)}
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

export default TradingInterface; 