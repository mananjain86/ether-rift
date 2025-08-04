import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MarketChart = ({ marketData, topicData, isTheoreticalTopic }) => {
  return (
    <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 animate-border-glow relative overflow-hidden h-[550px]">
      <h2 className="text-2xl font-bold text-cyan-300 mb-6 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
        {isTheoreticalTopic ? 'Learning Interface' : 'Market Data - ' + (topicData?.title || 'Live Scenario')}
      </h2>
      
      {!isTheoreticalTopic ? (
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
                formatter={(value, name) => [value.toFixed(2), name]}
              />
              <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Theoretical Learning</h3>
            <p className="text-cyan-200">This topic focuses on conceptual understanding rather than trading operations.</p>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 opacity-10 pointer-events-none animate-pulse" />
    </div>
  );
};

export default MarketChart; 