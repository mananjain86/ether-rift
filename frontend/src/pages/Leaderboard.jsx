import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const { leaderboard, guilds, wallet } = useEtherRift();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch online users and recent matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch online users
        const usersResponse = await fetch('http://localhost:3001/api/users/online');
        if (!usersResponse.ok) throw new Error('Failed to fetch online users');
        const usersData = await usersResponse.json();
        setOnlineUsers(usersData);
        
        // Fetch recent matches if wallet is connected
        if (wallet) {
          const matchesResponse = await fetch(`http://localhost:3001/api/pvp/users/${wallet}`);
          if (!matchesResponse.ok) throw new Error('Failed to fetch match history');
          const matchesData = await matchesResponse.json();
          setRecentMatches(matchesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, [wallet]);
  
  // Format wallet address
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Online Users Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-300 font-orbitron">Online Players</h2>
            <button 
              onClick={() => navigate('/duel')}
              className="bg-gradient-to-r from-pink-600 to-pink-400 text-white text-sm font-bold py-2 px-4 rounded-lg hover:from-pink-500 hover:to-pink-300 transition duration-300"
            >
              Challenge to Duel
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-4">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {onlineUsers.map((user, idx) => (
                <motion.li 
                  key={user.walletAddress} 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: idx * 0.12 }} 
                  className="flex items-center gap-4 py-4"
                >
                  <span className="text-3xl select-none">👤</span>
                  <div>
                    <span className="font-bold text-lg text-cyan-200 font-orbitron">
                      {user.username || formatAddress(user.walletAddress)}
                    </span>
                    <p className="text-xs text-gray-400">{formatAddress(user.walletAddress)}</p>
                  </div>
                  <span className="ml-auto text-pink-400 font-mono text-xl">{user.tokenBalance}</span>
                  <span className="ml-2 text-xs text-gray-400 font-mono">#{idx + 1}</span>
                </motion.li>
              ))}
              
              {onlineUsers.length === 0 && (
                <div className="text-gray-400 text-center py-4">No players online</div>
              )}
            </ul>
          )}
        </motion.div>
        
        {/* Your Match History */}
        {wallet && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-pink-400/20 animate-border-glow">
            <h2 className="text-xl font-bold text-pink-300 mb-4 font-orbitron">Your Duel History</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-4">{error}</div>
            ) : (
              <ul className="divide-y divide-gray-700">
                {recentMatches.map((match, idx) => {
                  const isPlayer1 = match.player1.walletAddress === wallet.toLowerCase();
                  const playerScore = isPlayer1 ? match.player1.score : match.player2.score;
                  const opponentScore = isPlayer1 ? match.player2.score : match.player1.score;
                  const opponentAddress = isPlayer1 ? match.player2.walletAddress : match.player1.walletAddress;
                  const result = match.winner === 'draw' ? 'Draw' : 
                                (isPlayer1 && match.winner === 'player1') || (!isPlayer1 && match.winner === 'player2') ? 'Win' : 'Loss';
                  
                  return (
                    <motion.li 
                      key={match._id} 
                      initial={{ opacity: 0, x: 30 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: idx * 0.12 }} 
                      className="py-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className={`font-bold ${result === 'Win' ? 'text-green-400' : result === 'Loss' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {result}
                          </span>
                          <span className="text-gray-400 ml-2">
                            vs {formatAddress(opponentAddress)}
                          </span>
                        </div>
                        <div className="text-cyan-300 font-mono">
                          {playerScore} - {opponentScore}
                        </div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{match.gameType}</span>
                        <span>{formatTime(match.timestamp)}</span>
                      </div>
                    </motion.li>
                  );
                })}
                
                {recentMatches.length === 0 && (
                  <div className="text-gray-400 text-center py-4">No match history</div>
                )}
              </ul>
            )}
          </motion.div>
        )}
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