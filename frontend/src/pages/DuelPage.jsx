import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEtherRift } from '../context/EtherRiftContext';
import { useNavigate } from 'react-router-dom';

const DuelPage = () => {
  const { user, wallet, updateUserTokens } = useEtherRift();
  const navigate = useNavigate();
  const [wageredAmount, setWageredAmount] = useState(5);
  const [matchmaking, setMatchmaking] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [scores, setScores] = useState({ player: 0, opponent: 0 });
  const [matchResult, setMatchResult] = useState(null);
  const [waitingTime, setWaitingTime] = useState(0);
  const [error, setError] = useState('');
  const wsRef = useRef(null);
  const timerRef = useRef(null);
  
  // Connect to WebSocket
  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;
    
    // Connection opened
    ws.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server');
    });
    
    // Listen for messages
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data);
      
      switch (data.type) {
        case 'connection_established':
          console.log('Connection established with ID:', data.clientId);
          break;
          
        case 'duel_match_found':
          handleMatchFound(data);
          break;
          
        case 'duel_next_question':
          handleNextQuestion(data);
          break;
          
        case 'duel_answer_received':
          setWaitingForOpponent(data.waitingForOpponent);
          break;
          
        case 'duel_completed':
          handleMatchCompleted(data);
          break;
      }
    });
    
    // Connection closed
    ws.addEventListener('close', (event) => {
      console.log('Disconnected from WebSocket server');
    });
    
    // Clean up on unmount
    return () => {
      if (matchmaking) {
        ws.send(JSON.stringify({
          type: 'cancel_duel_queue'
        }));
      }
      ws.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Handle match found
  const handleMatchFound = (data) => {
    setMatchmaking(false);
    setMatchFound(true);
    setOpponent(data.opponent);
    setCurrentQuestion(data.question);
    setQuestionNumber(data.questionNumber);
    setTotalQuestions(data.totalQuestions);
    setMatchId(data.matchId);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  // Handle next question
  const handleNextQuestion = (data) => {
    setCurrentQuestion(data.question);
    setQuestionNumber(data.questionNumber);
    setSelectedAnswer(null);
    setWaitingForOpponent(false);
    setScores(data.currentScore);
  };
  
  // Handle match completed
  const handleMatchCompleted = (data) => {
    setMatchResult(data.result);
    setScores(data.finalScore);
    
    // Update user tokens if won
    if (data.result === 'win' && data.tokensWon > 0) {
      updateUserTokens(data.tokensWon);
    }
  };
  
  // Join matchmaking queue
  const joinQueue = () => {
    if (!wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (wageredAmount <= 0) {
      setError('Please enter a valid wager amount');
      return;
    }
    
    if (wageredAmount > user.tokenBalance) {
      setError('Insufficient token balance');
      return;
    }
    
    setError('');
    setMatchmaking(true);
    setWaitingTime(0);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);
    
    // Send join queue message
    wsRef.current.send(JSON.stringify({
      type: 'join_duel_queue',
      walletAddress: wallet,
      wageredAmount
    }));
  };
  
  // Cancel matchmaking
  const cancelQueue = () => {
    setMatchmaking(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Send cancel queue message
    wsRef.current.send(JSON.stringify({
      type: 'cancel_duel_queue'
    }));
  };
  
  // Submit answer
  const submitAnswer = (answerId, answerText) => {
    if (waitingForOpponent) return;
    
    setSelectedAnswer(answerId);
    setWaitingForOpponent(true);
    
    // Send answer to server
    wsRef.current.send(JSON.stringify({
      type: 'submit_duel_answer',
      matchId,
      answerId,
      answerText
    }));
  };
  
  // Format waiting time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Play again
  const playAgain = () => {
    setMatchFound(false);
    setMatchResult(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setWaitingForOpponent(false);
    setScores({ player: 0, opponent: 0 });
  };
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-6 py-8">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-300 mb-6 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
          DeFi Duels
        </h1>
        
        {!matchmaking && !matchFound && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400/20 animate-border-glow"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 font-orbitron">
              Challenge Another Player
            </h2>
            <p className="text-cyan-200 mb-6">
              Test your DeFi knowledge in a 10-question duel against another player. Wager tokens to win more!
            </p>
            
            <div className="mb-6">
              <label className="block text-cyan-300 mb-2">Wager Amount</label>
              <div className="flex items-center">
                <input 
                  type="number" 
                  value={wageredAmount}
                  onChange={(e) => setWageredAmount(parseInt(e.target.value) || 0)}
                  min="1"
                  max={user.tokenBalance}
                  className="bg-gray-900 text-cyan-200 px-4 py-2 rounded-l-lg border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                />
                <span className="bg-cyan-900 text-cyan-200 px-4 py-2 rounded-r-lg border border-cyan-700">
                  Tokens
                </span>
              </div>
              <p className="text-cyan-400 mt-2">Your Balance: {user.tokenBalance} Tokens</p>
            </div>
            
            {error && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <button 
              onClick={joinQueue}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-400 text-black font-bold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-cyan-300 transition duration-300 shadow-lg shadow-cyan-500/20"
            >
              Find Opponent
            </button>
          </motion.div>
        )}
        
        {matchmaking && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400/20 animate-border-glow text-center"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 font-orbitron">
              Finding Opponent
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-cyan-200 mb-4">
              Waiting time: {formatTime(waitingTime)}
            </p>
            <p className="text-cyan-400 mb-6">
              Wagered: {wageredAmount} Tokens
            </p>
            <button 
              onClick={cancelQueue}
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-500 transition duration-300"
            >
              Cancel
            </button>
          </motion.div>
        )}
        
        {matchFound && !matchResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 border-cyan-400/20 animate-border-glow"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-cyan-300 font-orbitron">
                  Question {questionNumber}/{totalQuestions}
                </h2>
                <p className="text-cyan-400 text-sm">
                  Topic: {currentQuestion?.topic}
                </p>
              </div>
              <div className="flex gap-4 text-lg">
                <span className="text-cyan-300">You: {scores.player}</span>
                <span className="text-pink-300">Opponent: {scores.opponent}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-lg text-cyan-200 mb-6 p-4 bg-gray-900/50 rounded-lg border border-cyan-800">
                {currentQuestion?.question}
              </p>
              
              <div className="space-y-3">
                {currentQuestion?.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => submitAnswer(index, answer)}
                    disabled={waitingForOpponent}
                    className={`w-full text-left p-4 rounded-lg transition duration-300 ${selectedAnswer === index ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-cyan-200 hover:bg-gray-700'} ${waitingForOpponent && selectedAnswer !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
            
            {waitingForOpponent && (
              <div className="text-center text-cyan-300">
                <p>Waiting for opponent to answer...</p>
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
              </div>
            )}
          </motion.div>
        )}
        
        {matchResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-8 shadow-2xl border-2 ${matchResult === 'win' ? 'border-green-400/20' : matchResult === 'lose' ? 'border-red-400/20' : 'border-yellow-400/20'} animate-border-glow text-center`}
          >
            <h2 className={`text-3xl font-bold mb-4 font-orbitron ${matchResult === 'win' ? 'text-green-400' : matchResult === 'lose' ? 'text-red-400' : 'text-yellow-400'}`}>
              {matchResult === 'win' ? 'Victory!' : matchResult === 'lose' ? 'Defeat' : 'Draw'}
            </h2>
            
            <div className="flex justify-center gap-8 text-2xl mb-6">
              <div>
                <p className="text-cyan-300">You</p>
                <p className="text-4xl font-bold">{scores.player}</p>
              </div>
              <div className="text-4xl text-gray-500">vs</div>
              <div>
                <p className="text-pink-300">Opponent</p>
                <p className="text-4xl font-bold">{scores.opponent}</p>
              </div>
            </div>
            
            {matchResult === 'win' && (
              <p className="text-green-300 text-lg mb-6">
                You won {wageredAmount * 2} tokens!
              </p>
            )}
            
            {matchResult === 'lose' && (
              <p className="text-red-300 text-lg mb-6">
                You lost {wageredAmount} tokens.
              </p>
            )}
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={playAgain}
                className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-black font-bold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-cyan-300 transition duration-300 shadow-lg shadow-cyan-500/20"
              >
                Play Again
              </button>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Leaderboard
              </button>
            </div>
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

export default DuelPage;