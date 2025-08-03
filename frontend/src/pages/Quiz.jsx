import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizQuestions } from '../data/quizData';

const Quiz = () => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showNextButton, setShowNextButton] = useState(false);

  // Initialize quiz with 10 random questions
  useEffect(() => {
    if (selectedQuestions.length === 0) {
      const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
      setSelectedQuestions(shuffled.slice(0, 10));
    }
  }, []);

  const handleAnswer = (answerId) => {
    if (quizComplete) return;
    
    setSelectedAnswer(answerId);
    setShowExplanation(true);
    setShowNextButton(true);
    
    // Check if answer is correct
    const currentQ = selectedQuestions[currentQuestion];
    const isCorrect = answerId === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Store user's answer
    setUserAnswers(prev => [...prev, {
      questionId: currentQ.id,
      selectedAnswer: answerId,
      correct: isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowNextButton(false);
    } else {
      // Quiz completed - save to localStorage
      const quizResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        score: score,
        totalQuestions: selectedQuestions.length,
        percentage: Math.round((score / selectedQuestions.length) * 100),
        answers: userAnswers
      };
      
      // Get existing results from localStorage
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      existingResults.push(quizResult);
      localStorage.setItem('quizResults', JSON.stringify(existingResults));
      
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 10));
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers([]);
    setShowNextButton(false);
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / selectedQuestions.length) * 100);
    if (percentage >= 90) return { message: "Excellent! You're a DeFi expert!", color: "text-green-400" };
    if (percentage >= 70) return { message: "Great job! You have solid DeFi knowledge!", color: "text-cyan-400" };
    if (percentage >= 50) return { message: "Good work! Keep learning about DeFi!", color: "text-yellow-400" };
    return { message: "Keep studying! DeFi is complex but rewarding!", color: "text-pink-400" };
  };

  // Don't render until questions are selected
  if (selectedQuestions.length === 0) {
    return (
      <div className="relative flex flex-col gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQ = selectedQuestions[currentQuestion];

  return (
    <div className="relative flex flex-col gap-8 w-full z-10 mt-4 min-h-[80vh] bg-gradient-to-br from-black via-cyan-950 to-pink-950 font-mono px-2 pb-8 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />
      
      {!quizComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-300 font-orbitron">DeFi Knowledge Quiz</h2>
              <div className="text-cyan-200">
                <span className="text-xs">Question:</span>
                <span className="text-lg ml-2">{currentQuestion + 1}/10</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
              <h3 className="text-lg text-cyan-300 mb-4">{currentQ.question}</h3>
              
              {currentQ.type === 'graph' && currentQ.image && (
                <div className="mb-4">
                  <img 
                    src={currentQ.image} 
                    alt="Chart" 
                    className="w-full max-w-md mx-auto rounded-lg border border-gray-600"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 text-left rounded border transition-colors ${
                      selectedAnswer === option.id
                        ? option.id === currentQ.correctAnswer
                          ? 'bg-green-900/50 border-green-400 text-green-200'
                          : 'bg-red-900/50 border-red-400 text-red-200'
                        : selectedAnswer !== null && option.id === currentQ.correctAnswer
                        ? 'bg-green-900/50 border-green-400 text-green-200'
                        : 'bg-gray-700/50 hover:bg-cyan-900/50 border-gray-600 hover:border-cyan-400 text-gray-200'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mt-4 p-4 bg-blue-900/30 border border-blue-400/50 rounded-lg"
                >
                  <p className="text-blue-200 text-sm">
                    <strong>Explanation:</strong> {currentQ.explanation}
                  </p>
                </motion.div>
              )}
              
              {showNextButton && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mt-4 flex justify-center"
                >
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 transition-colors font-orbitron"
                  >
                    {currentQuestion < selectedQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/20 animate-border-glow text-center max-w-2xl"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 font-orbitron">Quiz Complete!</h2>
            
            <div className="text-6xl mb-4">
              {score >= 9 ? '🏆' : score >= 7 ? '🎉' : score >= 5 ? '👍' : '📚'}
            </div>
            
            <p className={`text-2xl mb-4 ${getScoreMessage().color}`}>
              {getScoreMessage().message}
            </p>
            
            <div className="text-cyan-200 mb-6">
              <p className="text-lg">Final Score: <span className="text-cyan-400 font-bold">{score}/10</span></p>
              <p className="text-sm text-gray-400 mt-2">
                {score >= 9 ? 'Perfect score! You truly understand DeFi concepts.' :
                 score >= 7 ? 'Great understanding of DeFi fundamentals!' :
                 score >= 5 ? 'Good foundation, keep learning!' :
                 'Keep studying! DeFi is a complex but rewarding field.'}
              </p>
            </div>
            
            <div className="mt-6">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 rounded border border-cyan-400 transition-colors mr-4"
              >
                Take Quiz Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded border border-gray-500 transition-colors"
              >
                Back to Menu
              </button>
            </div>
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
      `}</style>
    </div>
  );
};

export default Quiz; 