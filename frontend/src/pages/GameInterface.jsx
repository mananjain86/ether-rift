import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';
import TutorialPopup from '../components/TutorialPopup';
import TopicPopup from '../components/TopicPopup';

const feedItems = [
  '[10:21] PlayerX executed a trade',
  '[10:20] Market volatility increased',
  '[10:18] You received a new asset',
  '[10:15] PlayerY joined the dimension',
];

const GameInterface = () => {
  const { 
    currentDimension, 
    user, 
    orderBook, 
    trade, 
    tutorialOpen, 
    setTutorialOpen, 
    tutorialData, 
    handleTutorialNext 
  } = useEtherRift();
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [localFeed, setLocalFeed] = useState(feedItems);
  const [topicPopupOpen, setTopicPopupOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

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

  const handleTrade = (type) => {
    if (!amount || !price) return;
    trade(type, parseFloat(amount), parseFloat(price));
    setAmount('');
    setPrice('');
    
    // Add to local feed
    setLocalFeed(prev => [
      `[${new Date().toLocaleTimeString()}] You ${type.toLowerCase()}ed ${amount} ETH at ${price}`,
      ...prev.slice(0, 9)
    ]);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(topicId);
    setTopicPopupOpen(true);
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Tutorial Popup */}
      <TutorialPopup 
        isOpen={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        title={tutorialData.title}
        content={tutorialData.content}
        step={tutorialData.step}
        totalSteps={tutorialData.totalSteps}
        onNext={handleTutorialNext}
        onComplete={() => console.log('Tutorial completed!')}
      />

      {/* Topic Popup */}
      <TopicPopup 
        isOpen={topicPopupOpen}
        onClose={() => setTopicPopupOpen(false)}
        topic={selectedTopic}
        dimension={currentDimension}
      />
      
      {/* Main Trading Chart */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl min-w-[320px] border-2 border-cyan-400 animate-border-glow relative overflow-hidden">
        <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">{currentDimension ? `${currentDimension.name} Market` : 'Market Overview'}</h2>
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
      
      <div className="flex flex-col gap-4">
        {/* Learning Topics Section */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-4 shadow-xl border-2 border-cyan-400/10 animate-border-glow">
          <h3 className="text-lg font-bold text-cyan-200 mb-2 font-orbitron animate-glow">Learning Topics</h3>
          <ul className="text-cyan-200 text-xs font-mono">
            {dimensionTopics[currentDimension?.name]?.map(topic => (
              <motion.li 
                key={topic.id} 
                initial={{ opacity: 0, x: 30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: topic.id * 0.15 }}
                className="mb-1 cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => handleTopicClick(topic.id)}
              >
                {topic.title}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* Real-time Feed */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-4 shadow-xl border-2 border-pink-400/10 animate-border-glow">
          <h3 className="text-lg font-bold text-pink-200 mb-2 font-orbitron animate-glow">Real-time Feed</h3>
          <ul className="text-cyan-200 text-xs max-h-24 overflow-y-auto font-mono">
            {localFeed.map((item, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="mb-1">
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* Trading Form */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-4 shadow-xl border-2 border-cyan-400/10 mt-2 animate-border-glow">
          <h3 className="text-lg font-bold text-cyan-200 mb-2 font-orbitron animate-glow">Trade</h3>
          <div className="flex gap-2 mb-2">
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono" />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded transition font-orbitron animate-pulse-btn" onClick={() => handleTrade('Buy')}>Buy</button>
            <button className="flex-1 px-4 py-2 border-2 border-pink-400 bg-black/70 hover:bg-pink-400 hover:text-black text-pink-200 font-bold rounded transition font-orbitron animate-pulse-btn" onClick={() => handleTrade('Sell')}>Sell</button>
          </div>
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
          text-shadow: 0 0 8px #22d3ee, 0 0 2px #fff;
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

export default GameInterface;