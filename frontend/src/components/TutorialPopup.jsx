import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialPopup = ({ isOpen, onClose, title, content, step, totalSteps, onNext, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(step || 1);
  
  useEffect(() => {
    if (step !== undefined) {
      setCurrentStep(step);
    }
  }, [step]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      if (onNext) onNext(currentStep + 1);
    } else {
      if (onComplete) onComplete();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full max-w-2xl bg-black/90 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-2xl border-2 border-cyan-400 animate-border-glow"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold text-cyan-300 mb-2 font-orbitron drop-shadow-[0_0_8px_#22d3ee] animate-glow">
              {title}
            </h2>
            
            <div className="mb-4 w-full bg-gray-800 rounded h-2">
              <div 
                className="bg-cyan-400 h-2 rounded transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }} 
              />
            </div>
            
            <div className="text-cyan-100 mb-6 font-mono">
              {content}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 font-mono">
                Step {currentStep} of {totalSteps}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border-2 border-cyan-400 bg-black/70 hover:bg-cyan-400 hover:text-black text-cyan-200 font-bold rounded transition font-orbitron animate-pulse-btn"
                onClick={handleNext}
              >
                {currentStep < totalSteps ? 'Next' : 'Complete'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialPopup;