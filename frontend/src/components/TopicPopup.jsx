import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopicPopup = ({ isOpen, onClose, topic, dimension }) => {
  // Map dimensions to their topics from the educational scripts
  const topicsByDimension = {
    'Stable': [
      {
        id: 1,
        title: 'What is DeFi?',
        description: 'Learn about the core philosophy of decentralized finance, smart contracts, and dApps.',
        content: 'Users are introduced to the core philosophy of decentralized finance. They\'ll learn about smart contracts replacing intermediaries like banks, the transparency of the blockchain, and the concept of dApps.'
      },
      {
        id: 2,
        title: 'Understanding Liquidity Pools & AMMs',
        description: 'Discover how liquidity pools enable trading without traditional order books.',
        content: 'This module explains that liquidity pools are the cornerstone of decentralized exchanges (DEXs). Users will learn how Automated Market Makers (AMMs) use these pools to enable trading without traditional order books.'
      },
      {
        id: 3,
        title: 'Introduction to Staking',
        description: 'Learn how staking tokens helps secure networks while earning rewards.',
        content: 'Staking is presented as one of the most direct ways to earn rewards in DeFi. The module explains that by "staking" or locking up tokens, users help secure a network and are rewarded for it.'
      },
      {
        id: 4,
        title: 'DeFi Lending & Borrowing',
        description: 'Understand how to lend assets to earn interest or borrow against collateral.',
        content: 'This module introduces DeFi\'s version of banking. Users learn how they can lend their assets to earn interest or borrow assets by providing collateral.'
      },
      {
        id: 5,
        title: 'The Role of Stablecoins',
        description: 'Learn why stablecoins are crucial for providing stability in volatile markets.',
        content: 'Users learn why stablecoins (like DAI or USDC) are crucial for DeFi, providing a stable store of value amidst market volatility.'
      }
    ],
    'Volatile': [
      {
        id: 1,
        title: 'Mastering Yield Farming',
        description: 'Explore advanced strategies to maximize returns across protocols.',
        content: 'Yield farming is introduced as a more active and potentially more rewarding strategy than simple staking. Users learn that it involves moving assets between different lending and liquidity protocols to maximize returns.'
      },
      {
        id: 2,
        title: 'The Risk of Impermanent Loss',
        description: 'Understand the opportunity cost liquidity providers face when prices change.',
        content: 'This is a critical risk-management lesson. The module explains that impermanent loss is the risk liquidity providers take when the price of the assets in a pool changes.'
      },
      {
        id: 3,
        title: 'Understanding Leverage & Liquidation',
        description: 'Learn how borrowing can amplify gains but also dramatically increase risk.',
        content: 'This module teaches users about the double-edged sword of leverage. They will learn how borrowing can amplify gains but also dramatically increase the risk of liquidation.'
      },
      {
        id: 4,
        title: 'Introduction to DeFi Derivatives',
        description: 'Discover synthetic assets that track real-world prices without owning the underlying.',
        content: 'This module introduces the concept of synthetic assets ("synths"). Users will learn that a derivative is a contract whose value is derived from an underlying asset.'
      },
      {
        id: 5,
        title: 'Participating in DAO Governance',
        description: 'Learn how to vote on proposals and shape the future of protocols.',
        content: 'Users learn that many DeFi protocols are governed by their communities through Decentralized Autonomous Organizations (DAOs). The concepts of governance tokens and voting on proposals are explained.'
      }
    ],
    'Arbitrage': [
      {
        id: 1,
        title: 'Cross-Exchange Arbitrage',
        description: 'Profit from price differences of the same asset across different exchanges.',
        content: 'This module focuses on identifying and executing trades based on price differences for the same asset across two different simulated exchanges.'
      },
      {
        id: 2,
        title: 'Triangular Arbitrage',
        description: 'Execute trades between three assets to profit from price discrepancies.',
        content: 'This module introduces a more complex strategy where users exploit price discrepancies between three different assets on a single exchange.'
      },
      {
        id: 3,
        title: 'Flash Loans & Flash Swaps',
        description: 'Use uncollateralized loans to execute complex trades within a single transaction.',
        content: 'Users are introduced to one of DeFi\'s most powerful and unique tools: uncollateralized loans. The module explains that a flash loan must be borrowed and repaid within the same single blockchain transaction.'
      },
      {
        id: 4,
        title: 'Cyclical (Network) Arbitrage',
        description: 'Identify profitable cycles across interconnected liquidity pools.',
        content: 'This is the pinnacle of arbitrage strategy within the game. It builds on triangular arbitrage by showing how opportunities can exist across multiple protocols in a complex loop.'
      }
    ]
  };

  // Get topics for the current dimension
  const topics = topicsByDimension[dimension?.name] || [];
  
  // Find the selected topic
  const selectedTopic = topics.find(t => t.id === topic) || topics[0];

  return (
    <AnimatePresence>
      {isOpen && selectedTopic && (
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
              {selectedTopic.title}
            </h2>
            
            <div className="text-cyan-100 mb-6 font-mono">
              {selectedTopic.content}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 font-mono">
                Topic {selectedTopic.id} of {topics.length}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border-2 border-cyan-400 bg-black/70 hover:bg-cyan-400 hover:text-black text-cyan-200 font-bold rounded transition font-orbitron animate-pulse-btn"
                onClick={onClose}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopicPopup;