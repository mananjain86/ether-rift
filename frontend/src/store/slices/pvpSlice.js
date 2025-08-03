import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = "http://localhost:3001/api";

// Async thunks
export const fetchPvPHistory = createAsyncThunk(
  'pvp/fetchPvPHistory',
  async (walletAddress) => {
    const response = await fetch(`${API_URL}/pvp/users/${walletAddress}`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  }
);

export const recordPvPMatch = createAsyncThunk(
  'pvp/recordPvPMatch',
  async (matchData) => {
    const response = await fetch(`${API_URL}/pvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) {
      throw new Error('Failed to record PvP match');
    }
    return await response.json();
  }
);

// Initial state with dummy data
const initialState = {
  duels: [],
  activeDuel: null,
  waitingForDuel: false,
  pvpHistory: [
    {
      player1: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        score: 85,
        tokensWagered: 10
      },
      player2: {
        walletAddress: '0x0987654321098765432109876543210987654321',
        score: 92,
        tokensWagered: 10
      },
      winner: 'player2',
      tokensRewarded: 20,
      gameType: 'DeFi Quiz',
      timestamp: Date.now() - 3600000 // 1 hour ago
    },
    {
      player1: {
        walletAddress: '0x1234567890123456789012345678901234567890',
        score: 95,
        tokensWagered: 15
      },
      player2: {
        walletAddress: '0x1122334455667788990011223344556677889900',
        score: 78,
        tokensWagered: 15
      },
      winner: 'player1',
      tokensRewarded: 30,
      gameType: 'Trading Challenge',
      timestamp: Date.now() - 7200000 // 2 hours ago
    }
  ],
  loading: false,
  error: null
};

const pvpSlice = createSlice({
  name: 'pvp',
  initialState,
  reducers: {
    setActiveDuel: (state, action) => {
      state.activeDuel = action.payload;
    },
    setWaitingForDuel: (state, action) => {
      state.waitingForDuel = action.payload;
    },
    addDuel: (state, action) => {
      state.duels.push(action.payload);
    },
    removeDuel: (state, action) => {
      state.duels = state.duels.filter(duel => duel.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPvPHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPvPHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.pvpHistory = action.payload;
      })
      .addCase(fetchPvPHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(recordPvPMatch.fulfilled, (state, action) => {
        state.pvpHistory.unshift(action.payload);
      });
  }
});

export const {
  setActiveDuel,
  setWaitingForDuel,
  addDuel,
  removeDuel,
  clearError
} = pvpSlice.actions;

export default pvpSlice.reducer; 