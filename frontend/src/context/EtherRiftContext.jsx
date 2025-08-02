import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getAllContracts, getCoreContract, getTradingContract, getAchievementContract } from '../contracts/contract.js';

const EtherRiftContext = createContext();

// Backend API URL
const API_URL = "http://localhost:3001/api";

const mockUser = {
  address: '',
  stats: {
    level: 7,
    xp: 1420,
    winLoss: [12, 5],
    totalVolume: 23.5,
    dimensionsExplored: 3,
    assets: 2.35,
  },
  inventory: ['Liquidity Pool Token x2', 'Arbitrage Bot x1', 'Spell: Flash Loan'],
  badges: [
    { name: 'First Arbitrage', icon: '💡' },
    { name: 'Liquidity Provider', icon: '💧' },
    { name: 'Guild Champion', icon: '🏆' },
  ],
  history: [
    { time: '10:21', action: 'Bought 0.5 ETH in Volatile Dimension' },
    { time: '10:18', action: 'Provided liquidity to Stable Pool' },
    { time: '10:15', action: 'Won a trading duel' },
  ],
  tutorial: [true, true, false, false],
  settings: {
    darkMode: true,
    advancedTools: false,
    notifications: true,
    twoFA: false,
    spendingLimit: false,
    showPrivateKey: false,
  },
};

const mockDimensions = [
  {
    name: 'Stable Dimension',
    color: 'cyan',
    desc: 'Low volatility, ideal for learning and safe trading.',
    players: 42,
    volatility: 'Low',
    apr: '4.2%',
    icon: '🟦',
    lore: 'A calm, regulated universe where markets rarely swing. Perfect for new traders and those who value stability.',
    features: ['No chaos events', 'Low transaction fees', 'Beginner-friendly'],
    recentEvents: ['APR increased to 4.2%', 'New player joined: 0xA1B2', 'Liquidity pool expanded'],
  },
  {
    name: 'Volatile Dimension',
    color: 'green',
    desc: 'Exploit cross-market opportunities and quick trades.',
    players: 17,
    volatility: 'Medium',
    apr: '11.3%',
    icon: '🟩',
    lore: 'A universe of opportunity for the quick and clever. Arbitrage bots and sharp minds thrive here.',
    features: ['Cross-dimension trading', 'Bot-friendly', 'Rapid price updates'],
    recentEvents: ['Bot deployed: ArbMaster9000', 'APR stable at 11.3%', 'Cross-market spread detected'],
  },
  {
    name: 'Arbitrage Dimension',
    color: 'pink',
    desc: 'High risk, high reward. For experienced traders.',
    players: 31,
    volatility: 'High',
    apr: '18.7%',
    icon: '🟥',
    lore: 'A wild, unpredictable universe where fortunes are made and lost in minutes. Only the bold survive.',
    features: ['Frequent chaos events', 'High leverage allowed', 'Flash loan duels'],
    recentEvents: ['Chaos Event: Volatility Surge!', 'PlayerX won a duel', 'APR dropped from 20%'],
  },
];

const mockOrderBook = [
  { type: 'Buy', price: 120, amount: 0.5 },
  { type: 'Sell', price: 121, amount: 0.3 },
  { type: 'Buy', price: 119, amount: 1.2 },
  { type: 'Sell', price: 122, amount: 0.7 },
];

const mockLeaderboard = [
  { name: 'PlayerX', score: 3200, avatar: '🦊' },
  { name: 'PlayerY', score: 2950, avatar: '🐉' },
  { name: 'PlayerZ', score: 2780, avatar: '🦄' },
];

const mockGuilds = [
  { name: 'DeFi Wizards', points: 9200 },
  { name: 'Yield Hunters', points: 8700 },
  { name: 'Arb Masters', points: 8100 },
];

export const EtherRiftProvider = ({ children }) => {
  const [wallet, setWallet] = useState('');
  const [user, setUser] = useState(mockUser);
  const [currentDimension, setCurrentDimension] = useState(null);
  const [orderBook, setOrderBook] = useState(mockOrderBook);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [guilds, setGuilds] = useState(mockGuilds);
  const [dimensions] = useState(mockDimensions);
  const [contracts, setContracts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duels, setDuels] = useState([]);
  const [activeDuel, setActiveDuel] = useState(null);
  const [waitingForDuel, setWaitingForDuel] = useState(false);
  
  // Tutorial state
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialData, setTutorialData] = useState({
    title: '',
    content: '',
    step: 1,
    totalSteps: 1,
    topicId: ''
  });

  // Simulate entering a dimension
  const enterDimension = (dim) => {
    setCurrentDimension(dim);
    setUser(u => ({ ...u, stats: { ...u.stats, dimensionsExplored: u.stats.dimensionsExplored + 1 } }));
  }

  // Open tutorial popup
  const openTutorial = (title, content, step, totalSteps, topicId) => {
    setTutorialData({
      title,
      content,
      step,
      totalSteps,
      topicId
    });
    setTutorialOpen(true);
  };

  // Handle tutorial next step
  const handleTutorialNext = (nextStep) => {
    // Get content for the next step based on topicId and step
    let content = '';
    let title = tutorialData.title;
    
    // This would ideally come from a more structured data source
    if (tutorialData.topicId === 'stable-defi-intro') {
      if (nextStep === 2) {
        content = 'DeFi runs on \'Smart Contracts.\' Think of them as vending machines. You put in a coin (data), and the machine automatically gives you a snack (an outcome). There\'s no cashier needed. The rules are written in code for everyone to see.';
      } else if (nextStep === 3) {
        content = 'Let\'s try it. Below is a public \'guestbook\' running on a smart contract. Signing it doesn\'t cost anything in this simulation. Click \'Sign Guestbook\' to add your wallet address to the public record, proving you were here. This is your first interaction with a dApp (Decentralized Application)!';
      } else if (nextStep === 4) {
        content = 'Success! Your address is now permanently part of the guestbook\'s history on the blockchain. In a real scenario, this action would be irreversible and visible to anyone in the world. You\'ve just experienced the transparency and user control that defines DeFi. For this achievement, we\'ll record your success on-chain.';
      }
    }
    // Add similar logic for other topics
    
    setTutorialData(prev => ({
      ...prev,
      content,
      step: nextStep
    }));
  };

  // Simulate trading actions
  const trade = (type, amount, price) => {
    setOrderBook(ob => [
      { type, price, amount },
      ...ob.slice(0, 3),
    ]);
    setUser(u => ({
      ...u,
      stats: { ...u.stats, totalVolume: u.stats.totalVolume + amount },
      history: [
        { time: new Date().toLocaleTimeString(), action: `${type} ${amount} ETH at ${price}` },
        ...u.history.slice(0, 9),
      ],
    }));
  };

  // Simulate tutorial progress
  const completeTutorial = (idx) => {
    setUser(u => {
      const tutorial = [...u.tutorial];
      tutorial[idx] = true;
      return { ...u, tutorial };
    });
  };

  // Simulate settings update
  const updateSettings = (key, value) => {
    setUser(u => ({
      ...u,
      settings: { ...u.settings, [key]: value },
    }));
  };

  // Initialize contracts when wallet is connected
  useEffect(() => {
    const initContracts = async () => {
      if (!wallet) return;
      
      try {
        setLoading(true);
        
        // Use the contract.js functions to get all contracts
        const allContracts = await getAllContracts();
        setContracts(allContracts);
        
        // Fetch user data from MongoDB
        await fetchUserData(wallet);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize contracts:", err);
        setError("Failed to connect to blockchain");
        setLoading(false);
      }
    };
    
    initContracts();
  }, [wallet]);
  
  // Fetch user data from MongoDB
  const fetchUserData = async (address) => {
    try {
      const response = await fetch(`${API_URL}/users/${address}`);
      
      if (response.status === 404) {
        // User not found, register new user
        await registerUser(address);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await response.json();
      setUser(prev => ({
        ...prev,
        tokenBalance: userData.tokenBalance,
        loans: userData.loans,
        achievements: userData.achievements
      }));
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
    }
  };
  
  // Register new user
  const registerUser = async (address) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress: address })
      });
      
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      
      const userData = await response.json();
      setUser(prev => ({
        ...prev,
        tokenBalance: userData.tokenBalance,
        loans: userData.loans,
        achievements: userData.achievements
      }));
    } catch (err) {
      console.error("Error registering user:", err);
      setError("Failed to register user");
    }
  };
  
  // Take a loan
  const takeLoan = async (amount) => {
    if (!contracts || !wallet) return;
    
    try {
      setLoading(true);
      
      // Call smart contract to take loan with achievement tokens as collateral
      const collateralAmount = amount * 1.5; // 150% collateralization
      
      // Approve achievement tokens to be used as collateral
      const approveTx = await contracts.achievementToken.approve(
        contracts.tradingFunctions.address,
        ethers.parseEther(collateralAmount.toString())
      );
      await approveTx.wait();
      
      // Borrow tokens
      const borrowTx = await contracts.tradingFunctions.borrow(
        "0x0000000000000000000000000000000000000002", // USDC address
        ethers.parseEther(amount.toString()),
        contracts.achievementToken.address,
        ethers.parseEther(collateralAmount.toString())
      );
      await borrowTx.wait();
      
      // Record loan in MongoDB
      const response = await fetch(`${API_URL}/users/${wallet}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenBorrowed: "USDC",
          amount,
          collateralToken: "Achievement Token",
          collateralAmount
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to record loan");
      }
      
      const userData = await response.json();
      setUser(prev => ({
        ...prev,
        tokenBalance: userData.tokenBalance,
        loans: userData.loans
      }));
      
      setLoading(false);
    } catch (err) {
      console.error("Error taking loan:", err);
      setError("Failed to take loan");
      setLoading(false);
    }
  };
  
  // Start a duel
  const startDuel = async () => {
    if (!wallet) return;
    
    try {
      setWaitingForDuel(true);
      
      // Connect to WebSocket for real-time duel matching
      const ws = new WebSocket(`ws://localhost:3001`);
      
      ws.onopen = () => {
        // Send request to find a duel
        ws.send(JSON.stringify({
          type: 'find_duel',
          walletAddress: wallet
        }));
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'duel_found') {
          setActiveDuel(data.duel);
          setWaitingForDuel(false);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Failed to connect to duel server");
        setWaitingForDuel(false);
      };
      
      return () => {
        ws.close();
      };
    } catch (err) {
      console.error("Error starting duel:", err);
      setError("Failed to start duel");
      setWaitingForDuel(false);
    }
  };
  
  // Answer duel question
  const answerDuelQuestion = async (questionId, answerId) => {
    if (!activeDuel || !wallet) return;
    
    try {
      const response = await fetch(`${API_URL}/duel/${activeDuel.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: wallet,
          questionId,
          answerId
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }
      
      const result = await response.json();
      
      // Update active duel with new state
      setActiveDuel(result.duel);
      
      // If duel is complete, update user data
      if (result.duel.status === 'completed') {
        await fetchUserData(wallet);
        await fetchLeaderboard();
      }
    } catch (err) {
      console.error("Error answering question:", err);
      setError("Failed to submit answer");
    }
  };
  
  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      
      const leaderboardData = await response.json();
      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to fetch leaderboard");
    }
  };
  
  // Add this function to the EtherRiftProvider component
  
  // Update user tokens
  const updateUserTokens = async (amount) => {
    if (!wallet) return;
    
    try {
      // Update user tokens in the backend
      const response = await fetch(`http://localhost:3001/api/users/${wallet}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) throw new Error('Failed to update token balance');
      
      // Update local state
      const userData = await response.json();
      setUser(prev => ({
        ...prev,
        tokenBalance: userData.tokenBalance
      }));
      
      return userData.tokenBalance;
    } catch (error) {
      console.error('Error updating token balance:', error);
      return null;
    }
  };
  
  // Then add it to the context provider value
  return (
    <EtherRiftContext.Provider value={{
      user, setUser,
      currentDimension, enterDimension,
      orderBook, trade,
      leaderboard, guilds, dimensions,
      completeTutorial, updateSettings,
      // Tutorial related
      tutorialOpen, setTutorialOpen, tutorialData, handleTutorialNext,
      // User tokens
      updateUserTokens,
      // Wallet
      wallet,
      // Contracts
      contracts,
      // Loading and error states
      loading,
      error,
      // Duel related
      duels,
      activeDuel,
      waitingForDuel,
      startDuel,
      answerDuelQuestion,
      // Loan function
      takeLoan
    }}>
      {children}
    </EtherRiftContext.Provider>
  );
};

export const useEtherRift = () => useContext(EtherRiftContext);
