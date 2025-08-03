import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setWallet, fetchUserData } from '../store/slices/userSlice';
import { ethers } from 'ethers';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'DIMENSIONS', path: '/dimensions' },
  { name: 'PROFILE', path: '/profile' },
  { name: 'TUTORIAL', path: '/tutorial' },
];

const API_URL = "http://localhost:3001/api";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { wallet, user } = useAppSelector(state => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('walletAddress');
    if (saved) {
      dispatch(setWallet(saved));
      setIsConnected(true);
    }
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          dispatch(setWallet(accounts[0]));
          setIsConnected(true);
          localStorage.setItem('walletAddress', accounts[0]);
          // Fetch user data when wallet changes
          dispatch(fetchUserData(accounts[0]));
        } else {
          dispatch(setWallet(""));
          localStorage.removeItem('walletAddress');
          setIsConnected(false);
        }
      });
    }
  }, [dispatch]);



  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        dispatch(setWallet(address));
        setIsConnected(true);
        localStorage.setItem('walletAddress', address);
        
        // Register user and fetch user data
        await registerUser(address);
        dispatch(fetchUserData(address));
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address } }));
      } catch (err) {
        alert('Wallet connection failed!');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Register user
  const registerUser = async (address) => {
    try {
      // Check if user exists
      const checkResponse = await fetch(`${API_URL}/users/${address}`);
      
      if (checkResponse.status === 404) {
        // User doesn't exist, register new user
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ walletAddress: address })
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const disconnectWallet = () => {
    dispatch(setWallet(""));
    setIsConnected(false);
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
        
        {/* Start Quiz Button */}
        {isConnected && (
          <Link
            to="/quiz"
            className="px-4 py-2 font-orbitron uppercase text-sm transition duration-300 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white hover:from-cyan-500 hover:to-cyan-300 rounded-lg border border-cyan-400/50"
          >
            Take Quiz
          </Link>
        )}
        
        {isConnected ? (
          <div className="ml-8 px-5 py-2 bg-[#181c24] text-cyan-200 font-orbitron uppercase border border-cyan-400 flex items-center gap-2 cursor-pointer text-sm" onClick={disconnectWallet} title="Disconnect Wallet">
            <span className="text-lg">🔗</span>  {`${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`}
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
    </nav>
  );
};

export default Navbar;