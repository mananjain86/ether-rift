import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DuelArena = () => {
  const { user, wallet, startDuel, waitingForDuel, activeDuel, answerDuelQuestion } = useEtherRift();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [duelComplete, setDuelComplete] = useState(false);
  const [result, setResult] = useState(null);

  // Start a timer when a question is active
  useEffect(() => {
    if (!activeDuel || duelComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit timeout
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDuel, currentQuestion, duelComplete]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (activeDuel) {
      setTimeLeft(30);
    }
  }, [currentQuestion, activeDuel]);

  // Handle duel completion
  useEffect(() => {
    if (activeDuel?.status === 'completed') {
      setDuelComplete(true);
      
      // Determine result
      if (activeDuel.player1.walletAddress.toLowerCase() === wallet.toLowerCase()) {
        if (activeDuel.player1.score > activeDuel.player2.score) {
          setResult('win');
        } else if (activeDuel.player1.score < activeDuel.player2.score) {
          setResult('lose');
        } else {
          setResult('draw');
        }
      } else {
        if (activeDuel.player2.score > activeDuel.player1.score) {
          setResult('win');
        } else if (activeDuel.player2.score < activeDuel.player1.score) {
          setResult('lose');
        } else {
          setResult('draw');
        }
      }
    }
  }, [activeDuel, wallet]);

  const handleAnswer = async (answerId) => {
    if (!activeDuel || duelComplete) return;
    
    // Submit answer
    await answerDuelQuestion(
      activeDuel.questions[currentQuestion].id,
      answerId
    );
    
    // Check if answer is correct
    if (answerId === activeDuel.questions[currentQuestion].correctAnswerId) {
      setScore(prev => prev + 1);
    }
    
    // Move to next question or end duel
    if (currentQuestion < activeDuel.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleStartDuel = () => {
    if (user.tokenBalance < 10) {
      alert("You need at least 10 tokens to start a duel!");
      return;
    }
    
    // Start duel with fixed 10 token wager
    startDuel(10);
  };

  return (
    <div className="relative flex flex-col gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {!wallet ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-black/60 backdrop-blur-lg rounded-2xl border-2 border-cyan-400/20 max-w-md">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Connect Your Wallet</h2>
            <p className="text-cyan-100 mb-6">You need to connect your wallet to access the Duel Arena.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-cyan-300 transition duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : waitingForDuel ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow text-center">
            <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Finding Opponent</h2>
            <p className="text-cyan-200 mb-4">Searching for a worthy opponent...</p>
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </motion.div>
        </div>
      ) : activeDuel && !duelComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-300 font-orbitron">DeFi Duel</h2>
              <div className="text-pink-400 font-mono">
                <span className="text-lg">⏱️ {timeLeft}s</span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <div className="text-cyan-200">
                <span className="text-xs">Your Score:</span>
                <span className="text-lg ml-2">{score}/10</span>
              </div>
              <div className="text-cyan-200">
                <span className="text-xs">Question:</span>
                <span className="text-lg ml-2">{currentQuestion + 1}/10</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
              <h3 className="text-lg text-cyan-300 mb-4">{activeDuel.questions[currentQuestion].text}</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {activeDuel.questions[currentQuestion].answers.map((answer) => (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswer(answer.id)}
                    className="p-3 bg-gray-700/50 hover:bg-cyan-900/50 text-left rounded border border-gray-600 hover:border-cyan-400 transition-colors"
                  >
                    {answer.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : duelComplete ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow text-center">
            <h2 className="text-xl font-bold text-cyan-300 mb-4 font-orbitron">Duel Complete!</h2>
            
            {result === 'win' && (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <p className="text-green-400 text-2xl mb-4">Victory!</p>
                <p className="text-cyan-200 mb-4">You won {activeDuel.tokensRewarded} tokens!</p>
              </>
            )}
            
            {result === 'lose' && (
              <>
                <div className="text-6xl mb-4">😢</div>
                <p className="text-red-400 text-2xl mb-4">Defeat</p>
                <p className="text-cyan-200 mb-4">Better luck next time!</p>
              </>
            )}
            
            {result === 'draw' && (
              <>
                <div className="text-6xl mb-4">🤝</div>
                <p className="text-yellow-400 text-2xl mb-4">Draw</p>
                <p className="text-cyan-200 mb-4">Your tokens have been returned.</p>
              </>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => {
                  setActiveDuel(null);
                  setDuelComplete(false);
                  setCurrentQuestion(0);
                  setScore(0);
                }}
                className="px-6 py-3 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 transition-colors"
              >
                Return to Arena
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-8 bg-black/60 backdrop-blur-lg rounded-2xl border-2 border-cyan-400/20 max-w-md">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Ready to Duel?</h2>
            <p className="text-cyan-100 mb-2">Test your DeFi knowledge against other players!</p>
            <p className="text-pink-400 mb-6">Wager: 10 tokens</p>
            <button 
              onClick={handleStartDuel}
              disabled={user.tokenBalance < 10}
              className={`w-full bg-gradient-to-r from-pink-600 to-pink-400 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ${user.tokenBalance < 10 ? 'opacity-50 cursor-not-allowed' : 'hover:from-pink-500 hover:to-pink-300'}`}
            >
              Start Duel
            </button>
            {user.tokenBalance < 10 && (
              <p className="text-red-400 mt-2">Not enough tokens. You need 10 tokens to duel.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelArena;