import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnect = () => {
    console.log("hello")
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 lg:px-12 py-4 bg-[#10131a] border-b border-cyan-500/20 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-cyan-200 font-extrabold text-xl lg:text-2xl tracking-widest font-orbitron uppercase">ETHERRIFT</span>
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
        {wallet ? (
          <div className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer text-sm" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-lg">🔗</span> {wallet}
          </div>
        ) : (
          <button
            className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 hover:text-green-400 hover:border-green-400 text-sm"
            onClick={handleConnect}
          >
            CONNECT WALLET
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center gap-4">
        {wallet ? (
          <div className="px-3 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer text-xs" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-lg">🔗</span>
          </div>
        ) : (
          <button
            className="px-3 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 hover:text-green-400 hover:border-green-400 text-xs"
            onClick={handleConnect}
          >
            CONNECT
          </button>
        )}
        
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="text-cyan-300 hover:text-cyan-400 transition-colors p-2"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
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