import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'DIMENSIONS', path: '/dimensions' },
  { name: 'PROFILE', path: '/profile' },
  { name: 'DUEL', path: '/duel' },
  { name: 'LEADERBOARD', path: '/leaderboard' },
  { name: 'TUTORIAL', path: '/tutorial' },
];

const Navbar = () => {
  const location = useLocation();
  const [wallet, setWallet] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ensName, setEnsName] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('walletAddress');
    if (saved) {
      setWallet(saved);
      setIsConnected(true);
    }
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('walletAddress', accounts[0]);
        } else {
          setWallet("");
          localStorage.removeItem('walletAddress');
          setIsConnected(false);
        }
      });
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('walletAddress', accounts[0]);
      } catch (err) {
        alert('Wallet connection failed!');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setWallet("");
    setIsConnected(false);
    setEnsName(null);
    localStorage.removeItem('walletAddress');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 lg:px-12 py-4 bg-[#10131a] border-b border-cyan-500/20 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-cyan-200 font-extrabold text-xl lg:text-2xl tracking-widest font-orbitron uppercase">EtherRift</span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-8 items-center">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-orbitron tracking-widest uppercase px-2 py-1 text-cyan-300 hover:text-cyan-400 transition border-b-2 border-transparent ${location.pathname === link.path ? 'border-cyan-400 text-cyan-100' : ''}`}
          >
            {link.name}
          </Link>
        ))}
        {isConnected ? (
          <div className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer text-sm" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-lg">🔗</span> {wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}
          </div>
        ) : (
          <button
            className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 hover:text-green-400 hover:border-green-400 text-sm"
            onClick={connectWallet}
          >
            CONNECT WALLET
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center gap-4">
        {isConnected ? (
          <div className="px-3 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer text-xs" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-lg">🔗</span>
          </div>
        ) : (
          <button
            className="px-3 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 hover:text-green-400 hover:border-green-400 text-xs"
            onClick={connectWallet}
          >
            CONNECT
          </button>
        )}
        <button
          className="text-cyan-300 hover:text-cyan-100"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#10131a] border-b border-cyan-500/20 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-4 space-y-4">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`block text-sm font-orbitron tracking-widest uppercase py-3 px-4 text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition rounded-lg ${location.pathname === link.path ? 'bg-cyan-400/20 text-cyan-100 border-l-4 border-cyan-400' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;