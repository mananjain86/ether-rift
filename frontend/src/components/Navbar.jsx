import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletModal from './WalletModal';
import { useEtherRift } from '../context/EtherRiftContext';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'DIMENSIONS', path: '/dimensions' },
  { name: 'PROFILE', path: '/profile' },
  { name: 'LEADERBOARD', path: '/leaderboard' },
  { name: 'TUTORIAL', path: '/tutorial' },
  { name: 'SETTINGS', path: '/settings' },
];

const Navbar = () => {
  const location = useLocation();
  const { wallet, connectWallet, disconnectWallet } = useEtherRift();
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const handleConnect = () => {
    connectWallet();
    setWalletModalOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-between px-12 py-4 bg-[#10131a] border-b border-cyan-500/20 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-cyan-200 font-extrabold text-2xl tracking-widest font-orbitron uppercase">ETHERRIFT</span>
      </div>
      <div className="flex gap-8 items-center">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-orbitron tracking-widest uppercase px-2 py-1 text-cyan-300 hover:text-cyan-400 transition border-b-2 border-transparent ${location.pathname === link.path ? 'border-cyan-400 text-cyan-100' : ''}`}
          >
            {link.name}
          </Link>
        ))}
        {wallet ? (
          <div className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-xl">🔗</span> {wallet}
          </div>
        ) : (
          <button
            className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 hover:text-green-400 hover:border-green-400"
            onClick={() => setWalletModalOpen(true)}
          >
            CONNECT WALLET
          </button>
        )}
      </div>
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} onConnect={handleConnect} />
    </nav>
  );
};

export default Navbar; 