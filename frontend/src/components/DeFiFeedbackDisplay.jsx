import React from 'react';

const DeFiFeedbackDisplay = ({ feedback, onClose }) => {
  if (!feedback) return null;

  const getProfitLossColor = (isProfit) => {
    return isProfit ? 'text-green-400' : 'text-red-400';
  };

  const getProfitLossIcon = (isProfit) => {
    return isProfit ? '📈' : '📉';
  };

  const getFeedbackTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-400/20 bg-green-900/20';
      case 'error':
        return 'border-red-400/20 bg-red-900/20';
      case 'warning':
        return 'border-yellow-400/20 bg-yellow-900/20';
      default:
        return 'border-cyan-400/20 bg-cyan-900/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`max-w-2xl w-full mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 ${getFeedbackTypeColor(feedback.type)} p-6 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getProfitLossIcon(feedback.isProfit)}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{feedback.title}</h2>
              <p className="text-gray-300 text-sm">{feedback.operation?.toUpperCase()} • {new Date(feedback.timestamp).toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Message */}
        <div className="mb-6">
          <p className="text-lg text-white mb-4">{feedback.message}</p>
          
          {/* Profit/Loss Display */}
          {feedback.profitLoss !== undefined && (
            <div className={`bg-gray-800/50 rounded-lg p-4 mb-4 border ${feedback.isProfit ? 'border-green-500/30' : 'border-red-500/30'}`}>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profit/Loss:</span>
                <span className={`text-xl font-bold ${getProfitLossColor(feedback.isProfit)}`}>
                  {feedback.isProfit ? '+' : ''}{feedback.profitLoss.toFixed(4)} {feedback.token}
                  <span className="text-sm ml-2">
                    ({feedback.profitLossPercentage.toFixed(2)}%)
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Market Movement */}
        {feedback.marketMovement && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-2">Market Movement</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Price Change:</span>
                <span className={`ml-2 ${feedback.marketMovement.percentageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.marketMovement.percentageChange > 0 ? '+' : ''}{feedback.marketMovement.percentageChange.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">New Price:</span>
                <span className="ml-2 text-white">${feedback.marketMovement.newPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        {feedback.details && feedback.details.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Transaction Details</h3>
            <div className="space-y-2">
              {feedback.details.map((detail, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-cyan-400 mr-2">•</span>
                  <span className="text-gray-300">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time-based Outcome */}
        {feedback.timeBasedOutcome && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-2">Outcome Analysis</h3>
            <p className="text-gray-300 text-sm">{feedback.timeBasedOutcome}</p>
          </div>
        )}

        {/* Transaction Info */}
        {feedback.details?.gasUsed && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3">Transaction Information</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Gas Used:</span>
                <span className="text-white">{feedback.details.gasUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Block Number:</span>
                <span className="text-white">{feedback.details.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Hash:</span>
                <span className="text-white font-mono text-xs">
                  {feedback.details.transactionHash.substring(0, 10)}...{feedback.details.transactionHash.substring(58)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Educational Tips */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-white font-semibold mb-2">💡 Learning Points</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Always verify transaction details before confirming</p>
            <p>• Monitor gas prices for optimal timing</p>
            <p>• Consider impermanent loss in liquidity provision</p>
            <p>• Diversify your DeFi strategies</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 font-semibold"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeFiFeedbackDisplay; 