import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = "http://localhost:3001/api";

// Initial state with dummy data
const initialState = {
  wallet: '',
  isRegistered: false,
  user: {
    address: '',
    tokenBalance: 100,
    tokenBalances: {
      vETH: 100,
      vUSDC: 0,
      vDAI: 0,
      ERA: 0
    },
    loans: [],
    achievements: [],
    topics: [],
    trades: [],
    winLoss: [0, 0],
    totalVolume: 0,
  },
  loading: false,
  error: null
};


// Async thunks
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (walletAddress) => {
    const response = await fetch(`${API_URL}/users/${walletAddress}`);
    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      // User not found, register new user
      const registerResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });
      return await registerResponse.json();
    }
    throw new Error('Failed to fetch user data');
  }
);

export const updateUserTopics = createAsyncThunk(
  'user/updateUserTopics',
  async ({ walletAddress, topicId }) => {
    const response = await fetch(`${API_URL}/users/${walletAddress}/topics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topicId })
    });
    if (!response.ok) {
      throw new Error('Failed to update user topics');
    }
    return await response.json();
  }
);

export const takeLoan = createAsyncThunk(
  'user/takeLoan',
  async ({ walletAddress, amount }) => {
    const response = await fetch(`${API_URL}/users/${walletAddress}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tokenBorrowed: "USDC",
        amount,
        collateralToken: "Achievement Token",
        collateralAmount: amount * 1.5
      })
    });
    if (!response.ok) {
      throw new Error('Failed to take loan');
    }
    return await response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },
    updateTokenBalances: (state, action) => {
      state.user.tokenBalances = {
        ...state.user.tokenBalances,
        ...action.payload
      };
    },
    updateSingleTokenBalance: (state, action) => {
      const { token, amount } = action.payload;
      state.user.tokenBalances[token] = amount;
    },
    addTrade: (state, action) => {
      const { type, amount, price } = action.payload;
      state.user.trades.unshift({
        time: new Date().toLocaleTimeString(),
        action: `${type} ${amount} ETH at ${price}`
      });
      // Keep only last 10 trades
        state.user.trades = state.user.trades.slice(0, 10);
    },
    completeTutorial: (state, action) => {
      const { topicId } = action.payload;
      if (!state.user.topics.includes(topicId)) {
        state.user.topics.push(topicId);
      }
    },
    unlockAchievement: (state, action) => {
      const { id, name } = action.payload;
      const existingAchievement = state.user.achievements.find(a => a.id === id);
      if (!existingAchievement) {
        state.user.achievements.push({
          id,
          name,
          unlockedAt: new Date().toISOString()
        });
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...action.payload,
          address: action.payload.walletAddress || state.user.address
        };
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserTopics.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload
        };
      })
      .addCase(takeLoan.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload
        };
      });
  }
});

export const {
  setWallet,
  setRegistered,
  updateTokenBalances,
  updateSingleTokenBalance,
  addTrade,
  completeTutorial,
  unlockAchievement,
  clearError
} = userSlice.actions;

export default userSlice.reducer; 