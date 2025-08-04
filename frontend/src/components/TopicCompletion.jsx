import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateUserTopics, unlockAchievement, updateUserTopicsThunk } from '../store/slices/userSlice';
import { mintAchievementTokens } from '../contracts/contract';

const TopicCompletion = ({ scenarioId, onComplete }) => {
  const dispatch = useAppDispatch();
  const { wallet, user } = useAppSelector(state => state.user);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  console.log('TopicCompletion - wallet:', wallet);
  console.log('TopicCompletion - user:', user);

  // Check if topic is already completed
  const isTopicCompleted = user.topics && user.topics.includes(scenarioId);

  // Check if this is a milestone topic (first or last of a dimension)
  const isMilestoneTopic = () => {
    const milestoneTopics = [
      'stable-defi-intro',      // First topic of Stable dimension
      'stable-stablecoins',      // Last topic of Stable dimension
      'volatile-yield-farming',  // First topic of Volatile dimension
      'volatile-liquidation',    // Last topic of Volatile dimension
      'arbitrage-cross-exchange', // First topic of Arbitrage dimension
      'arbitrage-flash-loan'     // Last topic of Arbitrage dimension
    ];
    return milestoneTopics.includes(scenarioId);
  };

  const completeTopic = async () => {
    if (!wallet || isCompleting) return;

    setIsCompleting(true);
    setCompletionMessage('Completing topic...');

          try {
        // Update user's completed topics in MongoDB using the thunk
        console.log('📚 Adding topic to completed topics:', scenarioId);
        await dispatch(updateUserTopicsThunk({
          walletAddress: wallet,
          topicId: scenarioId
        })).unwrap();
        console.log('✅ Topic added to MongoDB successfully');

      // Award achievement token for milestone topics
      if (isMilestoneTopic()) {
        try {
          await mintAchievementTokens(wallet, 100);
          
          // Update ERA balance in Redux
          dispatch(unlockAchievement({ 
            id: `topic-${scenarioId}`, 
            name: `Completed ${scenarioId}` 
          }));
          
          setCompletionMessage('Topic completed! Achievement token awarded!');
        } catch (error) {
          console.error('Error awarding achievement token:', error);
          setCompletionMessage('Topic completed! (Achievement token award failed)');
        }
      } else {
        setCompletionMessage('Topic completed successfully!');
      }

      // Call the onComplete callback
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('Error completing topic:', error);
      setCompletionMessage(`Error: ${error.message}`);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isTopicCompleted) {
    return (
      <div className="bg-green-900/60 backdrop-blur-lg rounded-2xl p-6 border-2 border-green-400/10">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-300 mb-2">Topic Already Completed</h3>
          <p className="text-green-200">You have already completed this topic.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900/60 backdrop-blur-lg rounded-2xl p-6 border-2 border-blue-400/10">
      <div className="text-center">
        <h3 className="text-xl font-bold text-blue-300 mb-4">Complete Topic</h3>
        <p className="text-blue-200 mb-4">
          Click the button below to mark this topic as completed and earn rewards.
        </p>
        
        {isMilestoneTopic() && (
          <div className="bg-yellow-900/30 border border-yellow-600/30 rounded p-3 mb-4">
            <h4 className="text-yellow-300 font-semibold mb-1">🏆 Milestone Topic!</h4>
            <p className="text-yellow-200 text-sm">
              Completing this topic will award you 100 Achievement Tokens (ERA)!
            </p>
          </div>
        )}
        
        <button
          onClick={completeTopic}
          disabled={isCompleting}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors font-orbitron"
        >
          {isCompleting ? 'Completing...' : 'Complete Topic'}
        </button>
        
        {completionMessage && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-cyan-200 text-sm">{completionMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCompletion; 