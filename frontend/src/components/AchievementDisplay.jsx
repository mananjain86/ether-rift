import React from 'react';
import { useAppSelector } from '../store/hooks';

const AchievementDisplay = () => {
  const { user } = useAppSelector(state => state.user);

  console.log('AchievementDisplay - user:', user);

  const getTopicDisplayName = (topicId) => {
    const topicNames = {
      'stable-defi-intro': 'What is DeFi?',
      'stable-liquidity-pools': 'Liquidity Pools & AMMs',
      'stable-staking': 'Introduction to Staking',
      'stable-lending': 'DeFi Lending & Borrowing',
      'stable-stablecoins': 'The Role of Stablecoins',
      'volatile-yield-farming': 'Mastering Yield Farming',
      'volatile-impermanent-loss': 'The Risk of Impermanent Loss',
      'volatile-liquidation': 'Understanding Leverage & Liquidation',
      'volatile-derivatives': 'Introduction to DeFi Derivatives',
      'volatile-dao-governance': 'Participating in DAO Governance',
      'arbitrage-cross-exchange': 'Cross-Exchange Arbitrage',
      'arbitrage-triangular': 'Triangular Arbitrage',
      'arbitrage-flash-loan': 'Flash Loans & Flash Swaps',
      'arbitrage-cyclical': 'Cyclical (Network) Arbitrage'
    };
    return topicNames[topicId] || topicId;
  };

  const getDimensionName = (topicId) => {
    if (topicId.startsWith('stable-')) return 'Stable';
    if (topicId.startsWith('volatile-')) return 'Volatile';
    if (topicId.startsWith('arbitrage-')) return 'Arbitrage';
    return 'Other';
  };

  const completedTopics = user.topics || [];
  const achievements = user.achievements || [];

  const topicsByDimension = completedTopics.reduce((acc, topicId) => {
    const dimension = getDimensionName(topicId);
    if (!acc[dimension]) {
      acc[dimension] = [];
    }
    acc[dimension].push(topicId);
    return acc;
  }, {});

  return (
    <div className="bg-black/60 backdrop-blur-lg glassmorph rounded-2xl p-6 shadow-xl border-2 border-purple-400/10 animate-border-glow">
      <h3 className="text-xl font-bold text-purple-200 mb-6 font-orbitron animate-glow">
        🏆 Achievements & Progress
      </h3>

      {/* Completed Topics */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-cyan-300 mb-3">Completed Topics ({completedTopics.length})</h4>
        
        {completedTopics.length === 0 ? (
          <div className="text-gray-400 text-sm">No topics completed yet. Start learning to earn achievements!</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(topicsByDimension).map(([dimension, topics]) => (
              <div key={dimension} className="bg-gray-800/50 rounded-lg p-3">
                <h5 className="text-cyan-200 font-semibold mb-2">{dimension} Dimension</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {topics.map(topicId => (
                    <div key={topicId} className="flex items-center space-x-2 bg-green-900/30 border border-green-600/30 rounded p-2">
                      <span className="text-green-400">✅</span>
                      <span className="text-green-200 text-sm">{getTopicDisplayName(topicId)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-yellow-300 mb-3">Achievements ({achievements.length})</h4>
        
        {achievements.length === 0 ? (
          <div className="text-gray-400 text-sm">No achievements unlocked yet. Complete milestone topics to earn achievements!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-lg">🏆</span>
                  <div>
                    <h5 className="text-yellow-200 font-semibold">{achievement.name}</h5>
                    <p className="text-yellow-300 text-xs">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
        <h4 className="text-lg font-bold text-blue-300 mb-2">Learning Progress</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Topics Completed:</span>
            <span className="text-blue-400 ml-2 font-mono">{completedTopics.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Achievements:</span>
            <span className="text-blue-400 ml-2 font-mono">{achievements.length}</span>
          </div>
          <div>
            <span className="text-gray-400">ERA Tokens:</span>
            <span className="text-blue-400 ml-2 font-mono">{user.tokenBalances?.ERA || 0}</span>
          </div>
          <div>
            <span className="text-gray-400">Total Balance:</span>
            <span className="text-blue-400 ml-2 font-mono">{user.tokenBalance || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDisplay; 