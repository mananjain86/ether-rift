import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';
import TutorialPopup from '../components/TutorialPopup';
import { useLocation } from 'react-router-dom';

const GameInterface = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dimensionName = queryParams.get('dimension');
  const topicId = parseInt(queryParams.get('topic'), 10);

  const { 
    currentDimension, 
    user, 
    orderBook, 
    trade, 
    tutorialOpen, 
    setTutorialOpen, 
    tutorialData, 
    handleTutorialNext, 
    startScenario 
  } = useEtherRift();
  
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [topicData, setTopicData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch topic-specific data from backend
  useEffect(() => {
    let intervalId;

    const fetchTopicData = async () => {
      if (!dimensionName || !topicId) return;

      try {
        setLoading(true);
      const response = await fetch(`http://localhost:3001/api/topics/${encodeURIComponent(dimensionName)}/${topicId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch topic data');
      }

      const data = await response.json();

      setTopicData(data);

      // Append new market data points instead of replacing
      if (data.state && data.state.prices) {
        // Determine last index of current dataPoints
        const lastIndex = marketData.length > 0 ? marketData[marketData.length - 1].time : -1;
        // Fetch new data points from backend state.dataPoints
        const newPoints = data.state.dataPoints || [];
        // Filter new points after lastIndex
        const filteredNewPoints = newPoints.filter(p => p.time > lastIndex);
        if (filteredNewPoints.length > 0) {
          setMarketData(prevData => {
            const updatedData = [...prevData, ...filteredNewPoints];
            // Keep only the last 20 data points
            if (updatedData.length > 20) {
              return updatedData.slice(updatedData.length - 20);
            }
            return updatedData;
          });
        }
      } else {
        // Initialize market data if no existing data
        initializeMarketData(data.scenarioId);
      }

      } catch (err) {
        console.error('Error fetching topic data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();

    intervalId = setInterval(fetchTopicData, 10000);

    return () => clearInterval(intervalId);
  }, [dimensionName, topicId]);

  // Initialize market data based on scenario
  const initializeMarketData = (scenarioId) => {
    let initialData = [];
    
    switch (scenarioId) {
      case 'stable-liquidity-pools':
      case 'stable-stablecoins':
        // Generate initial price data for stable scenarios
        for (let i = 0; i < 20; i++) {
          initialData.push({
            time: i,
            price: 1000 + (Math.random() - 0.5) * 20, // Small variations around 1000
            volume: Math.random() * 100
          });
        }
        break;
        
      case 'volatile-yield-farming':
      case 'volatile-impermanent-loss':
      case 'volatile-liquidation':
        // Generate more volatile price data
        let basePrice = 1000;
        for (let i = 0; i < 20; i++) {
          basePrice += (Math.random() - 0.5) * 50; // Larger variations
          initialData.push({
            time: i,
            price: Math.max(800, basePrice), // Don't go below 800
            volume: Math.random() * 200
          });
        }
        break;
        
      case 'arbitrage-cross-exchange':
      case 'arbitrage-flash-loan':
        // Generate price data showing arbitrage opportunities
        for (let i = 0; i < 20; i++) {
          const basePrice = 1000;
          const variation = Math.sin(i * 0.5) * 30; // Oscillating pattern
          initialData.push({
            time: i,
            price: basePrice + variation,
            volume: Math.random() * 150
          });
        }
        break;
        
      default:
        // Default stable data
        for (let i = 0; i < 20; i++) {
          initialData.push({
            time: i,
            price: 1000 + (Math.random() - 0.5) * 10,
            volume: Math.random() * 50
          });
        }
    }
    
    setMarketData(initialData);
  };

  const handleTrade = (type) => {
    if (!amount || !price) return;
    trade(type, parseFloat(amount), parseFloat(price));
    setAmount('');
    setPrice('');
    
    // Add new data point to market data
    const newDataPoint = {
      time: marketData.length,
      price: parseFloat(price),
      volume: parseFloat(amount)
    };
    
    setMarketData(prev => [...prev, newDataPoint]);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8 flex items-center justify-center">
        <div className="text-cyan-300 text-xl font-orbitron">Loading topic data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8 flex items-center justify-center">
        <div className="text-red-400 text-xl font-orbitron">Error: {error}</div>
      </div>
    );
  }

  // Show content when data is loaded
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8">
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

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-300 mb-2 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
            {topicData?.title}
          </h1>
          <p className="text-cyan-200 text-lg font-mono">
            {topicData?.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 animate-border-glow relative overflow-hidden h-[500px]">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
                Market Data - {topicData?.title}
              </h2>
              <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData}>
              <XAxis dataKey="time" stroke="#67e8f9" />
              <YAxis stroke="#67e8f9" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        border: '1px solid #22d3ee',
                        borderRadius: '8px',
                        color: '#67e8f9'
                      }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-10 pointer-events-none animate-pulse" />
            </div>
          </div>

          {/* Trading Panel - Takes 1/3 of the width on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow h-[500px]">
              <h3 className="text-xl font-bold text-cyan-200 mb-6 font-orbitron animate-glow">Trading Interface</h3>
              
              {/* Trading Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-cyan-300 text-sm font-mono mb-2">Price</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono border border-gray-700"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    className="flex-1 px-6 py-3 border-2 border-green-400 bg-black/70 hover:bg-green-400 hover:text-black text-green-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                    onClick={() => handleTrade('Buy')}
                  >
                    Buy
                  </button>
                  <button 
                    className="flex-1 px-6 py-3 border-2 border-pink-400 bg-black/70 hover:bg-pink-400 hover:text-black text-pink-200 font-bold rounded-lg transition-all duration-200 font-orbitron animate-pulse-btn text-lg"
                    onClick={() => handleTrade('Sell')}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Market Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-cyan-300 font-mono mb-3">Market Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Price:</span>
                    <span className="text-cyan-400 font-mono">${marketData[marketData.length - 1]?.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change:</span>
                    <span className="text-green-400 font-mono">+2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-cyan-400 font-mono">1,234.56</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="mt-8">
          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
            <h3 className="text-xl font-bold text-pink-200 mb-4 font-orbitron">Educational Content</h3>
            <div className="space-y-4">
              {topicData?.educationalContent?.map((content, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-pink-400">
                  <p className="text-cyan-200 font-mono">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-pink-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-pink-200 mb-4 font-orbitron">Learning Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Step:</span>
                <span className="text-pink-400 font-mono">Step {tutorialData.step} of {tutorialData.totalSteps}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-pink-400 h-2 rounded-full" style={{ width: `${(tutorialData.step / tutorialData.totalSteps) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-green-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-green-200 mb-4 font-orbitron">Portfolio</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance:</span>
                <span className="text-green-400 font-mono">Ξ {user.stats.assets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Volume:</span>
                <span className="text-green-400 font-mono">Ξ {user.stats.totalVolume}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-cyan-400/10 animate-border-glow">
            <h3 className="text-lg font-bold text-cyan-200 mb-4 font-orbitron">Topic Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Dimension:</span>
                <span className="text-cyan-400 font-mono">{dimensionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Topic ID:</span>
                <span className="text-cyan-400 font-mono">{topicId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Scenario:</span>
                <span className="text-cyan-400 font-mono">{topicData?.scenarioId}</span>
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