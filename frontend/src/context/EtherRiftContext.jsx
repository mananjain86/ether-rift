import React, { createContext, useContext, useState } from 'react';

const EtherRiftContext = createContext();

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

  return (
    <EtherRiftContext.Provider value={{
      user, setUser,
      currentDimension, enterDimension,
      orderBook, trade,
      leaderboard, guilds, dimensions,
      completeTutorial, updateSettings,
      // Tutorial related
      tutorialOpen, setTutorialOpen, tutorialData, handleTutorialNext
    }}>
      {children}
    </EtherRiftContext.Provider>
  );
};
export const useEtherRift = () => useContext(EtherRiftContext);
