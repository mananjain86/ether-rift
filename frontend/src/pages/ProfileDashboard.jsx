// Update the component to use data from MongoDB
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserData, takeLoan } from '../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const ProfileDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user, wallet, loading } = useAppSelector(state => state.user);
  
  const [loanAmount, setLoanAmount] = useState(50);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  
  useEffect(() => {
    if (wallet) {
      dispatch(fetchUserData(wallet));
    }
  }, [wallet, dispatch]);
  
  // Load quiz results from localStorage
  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setQuizResults(results);
  }, []);
  
  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    await dispatch(takeLoan({ walletAddress: wallet, amount: loanAmount }));
    setShowLoanModal(false);
  };
  
  const handleTopicClick = (topicId) => {
    // Navigate to GameInterface with the topic
    navigate(`/game/${topicId}`);
  };
  
  const formatQuizDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getQuizScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-cyan-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-pink-400';
  };
  
  return (
    <div className="relative flex flex-col md:flex-row gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {/* Stats & Badges */}
      <div className="flex-1 flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow">
          <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Player Stats</h2>
          
          {/* Wallet Address */}
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Wallet Address</div>
            <div className="text-cyan-200 font-mono text-sm break-all">
              {user.address || wallet || 'Not connected'}
            </div>
          </div>
          
          <ul className="text-cyan-200 text-sm mb-4 font-mono">
            <li>Quizzes Taken: <span className="text-cyan-400 font-mono">{quizResults.length}</span></li>
            <li>Average Score: <span className="text-cyan-400 font-mono">
              {quizResults.length > 0 
                ? Math.round(quizResults.reduce((sum, result) => sum + result.percentage, 0) / quizResults.length) + '%'
                : 'N/A'
              }
            </span></li>
            <li className="mt-2 pt-2 border-t border-gray-700">Token Balance: <span className="text-pink-400 font-mono">{user.tokenBalance || 0}</span></li>
          </ul>
          
          {user.tokenBalance < 10 && (
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
              <p className="text-yellow-300 text-sm mb-2">Low on tokens! You need tokens for learning and achievements.</p>
              <button 
                onClick={() => setShowLoanModal(true)}
                className="px-4 py-2 bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-200 rounded border border-yellow-500/50 text-sm transition-colors"
              >
                Take a Loan
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Achievements Section */}
        {user.achievements && user.achievements.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-green-400/20 animate-border-glow">
            <h2 className="text-xl font-bold text-green-300 mb-4 font-orbitron">Achievements</h2>
            <div className="grid grid-cols-2 gap-3">
              {user.achievements.map((achievement, idx) => (
                <div key={idx} className="p-3 bg-green-900/30 border border-green-600/30 rounded-lg">
                  <div className="text-green-400 font-semibold text-sm">{achievement.name}</div>
                  <div className="text-xs text-green-300 mt-1">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-green-400/20 animate-border-glow">
            <h2 className="text-xl font-bold text-green-300 mb-4 font-orbitron">Achievements</h2>
            <div className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg text-center">
              <div className="text-gray-400 text-sm">No achievements yet</div>
              <div className="text-xs text-gray-500 mt-1">Complete tutorials to unlock achievements</div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Quiz Results */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl w-full md:w-96 border-2 border-pink-400/20 animate-border-glow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-300 font-orbitron">Quiz Results</h2>
          <button 
            onClick={() => navigate('/quiz')}
            className="px-3 py-1 bg-pink-900/50 hover:bg-pink-800/50 text-pink-200 rounded border border-pink-400/50 text-xs transition-colors"
          >
            Take Quiz
          </button>
        </div>
        
        {quizResults.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {quizResults.slice().reverse().map((result, idx) => (
              <motion.div 
                key={result.id} 
                initial={{ opacity: 0, x: 30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: idx * 0.12 }} 
                className="p-3 bg-gray-800/30 border border-gray-600/30 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold ${getQuizScoreColor(result.percentage)}`}>
                    {result.score}/{result.totalQuestions} ({result.percentage}%)
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatQuizDate(result.date)}
                  </span>
                </div>
                <div className="text-xs text-gray-300">
                  {result.percentage >= 90 ? '🏆 Excellent!' :
                   result.percentage >= 70 ? '🎉 Great job!' :
                   result.percentage >= 50 ? '👍 Good work!' :
                   '📚 Keep studying!'}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-sm mb-2">No quiz results yet</div>
            <div className="text-xs text-gray-500">Take the DeFi knowledge quiz to see your results here!</div>
            <button 
              onClick={() => navigate('/quiz')}
              className="mt-4 px-4 py-2 bg-pink-900/50 hover:bg-pink-800/50 text-pink-200 rounded border border-pink-400/50 text-sm transition-colors"
            >
              Take Your First Quiz
            </button>
          </div>
        )}
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