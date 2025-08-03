import { createSlice } from '@reduxjs/toolkit';

// Initial state with dummy data
const initialState = {
  currentDimension: null,
  dimensions: [
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
  ],
  orderBook: [
    { type: 'Buy', price: 120, amount: 0.5 },
    { type: 'Sell', price: 121, amount: 0.3 },
    { type: 'Buy', price: 119, amount: 1.2 },
    { type: 'Sell', price: 122, amount: 0.7 },
  ],
  leaderboard: [
    { name: 'PlayerX', score: 3200, avatar: '🦊' },
    { name: 'PlayerY', score: 2950, avatar: '🐉' },
    { name: 'PlayerZ', score: 2780, avatar: '🦄' },
  ],
  guilds: [
    { name: 'DeFi Wizards', points: 9200 },
    { name: 'Yield Hunters', points: 8700 },
    { name: 'Arb Masters', points: 8100 },
  ],
  contracts: null,
  loading: false,
  error: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    enterDimension: (state, action) => {
      state.currentDimension = action.payload;
    },
    addOrder: (state, action) => {
      const { type, price, amount } = action.payload;
      state.orderBook.unshift({ type, price, amount });
      // Keep only last 10 orders
      state.orderBook = state.orderBook.slice(0, 10);
    },
    setContracts: (state, action) => {
      state.contracts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    updateGuilds: (state, action) => {
      state.guilds = action.payload;
    }
  }
});

export const {
  enterDimension,
  addOrder,
  setContracts,
  setLoading,
  setError,
  clearError,
  updateLeaderboard,
  updateGuilds
} = gameSlice.actions;

export default gameSlice.reducer; 