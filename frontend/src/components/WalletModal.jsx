import React from 'react';

const wallets = [
  { name: 'MetaMask', icon: '🦊' },
  { name: 'WalletConnect', icon: '🔗' },
  { name: 'Coinbase Wallet', icon: '💼' },
];

const WalletModal = ({ open, onClose, onConnect }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-gray-900 bg-opacity-95 rounded-2xl shadow-2xl p-8 w-80 relative border border-cyan-700">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">Connect Wallet</h2>
        <div className="flex flex-col gap-4">
          {wallets.map(w => (
            <button
              key={w.name}
              className="flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-cyan-800 text-white rounded-lg font-semibold text-lg transition"
              onClick={() => onConnect(w.name)}
            >
              <span className="text-2xl">{w.icon}</span> {w.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletModal; 