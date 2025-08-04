import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkUserRegistration, registerUser as registerUserContract } from '../../contracts/contract.js';

const API_URL = "http://localhost:3001/api";

// MongoDB update functions
export const updateMongoDB = async (walletAddress, updates) => {
  try {
    console.log('🗄️ updateMongoDB called with walletAddress:', walletAddress, 'updates:', updates);
    
    // First check if user exists
    const userResponse = await fetch(`${API_URL}/users/${walletAddress}`);
    if (!userResponse.ok && userResponse.status === 404) {
      console.log('⚠️ User not found in MongoDB, creating user first...');
      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create user: ${createResponse.statusText}`);
      }
      console.log('✅ User created successfully');
    }
    
    const response = await fetch(`${API_URL}/users/${walletAddress}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ MongoDB update failed:', response.status, errorText);
      throw new Error(`Failed to update MongoDB: ${response.status} - ${errorText}`);
    }

    const updatedUser = await response.json();
    console.log('✅ MongoDB updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('❌ Error updating MongoDB:', error);
    throw error;
  }
};

export const updateTokenBalances = async (walletAddress, tokenBalances) => {
  return await updateMongoDB(walletAddress, { tokenBalances });
};

export const updateCompletedTopics = async (walletAddress, topicId) => {
  console.log('📚 Updating completed topics in MongoDB...');
  console.log('👤 Wallet address:', walletAddress);
  console.log('📖 Topic ID:', topicId);
  
  const result = await updateMongoDB(walletAddress, { 
    $push: { topics: topicId },
    lastActive: new Date().toISOString()
  });
  
  console.log('✅ Completed topics updated successfully:', result);
  return result;
};

export const updateAchievements = async (walletAddress, achievement) => {
  console.log('🏆 Updating achievements in MongoDB...');
  console.log('👤 Wallet address:', walletAddress);
  console.log('🏅 Achievement:', achievement);
  
  const result = await updateMongoDB(walletAddress, { 
    $push: { achievements: achievement },
    lastActive: new Date().toISOString()
  });
  
  console.log('✅ Achievements updated successfully:', result);
  return result;
};

export const recordTrade = async (walletAddress, trade) => {
  return await updateMongoDB(walletAddress, { 
    $push: { trades: trade },
    $inc: { 'trades.totalVolume': trade.volume || 0 },
    lastActive: new Date().toISOString()
  });
};

export const updateLoans = async (walletAddress, loan) => {
  return await updateMongoDB(walletAddress, { 
    $push: { loans: loan },
    lastActive: new Date().toISOString()
  });
};

export const updateWinLoss = async (walletAddress, isWin) => {
  return await updateMongoDB(walletAddress, { 
    $inc: { [`winLoss.${isWin ? 0 : 1}`]: 1 },
    lastActive: new Date().toISOString()
  });
};

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

// Update token balance thunk
export const updateTokenBalanceThunk = createAsyncThunk(
  'user/updateTokenBalance',
  async ({ walletAddress, token, amount, operation }) => {
    console.log('💰 Updating token balance:', { walletAddress, token, amount, operation });
    
    const response = await fetch(`${API_URL}/users/${walletAddress}/balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, amount, operation })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update token balance: ${response.status} - ${errorText}`);
    }
    
    const updatedUser = await response.json();
    console.log('✅ Token balance updated successfully:', updatedUser);
    return updatedUser;
  }
);

// Update user topics thunk
export const updateUserTopicsThunk = createAsyncThunk(
  'user/updateUserTopics',
  async ({ walletAddress, topicId }) => {
    console.log('📚 Updating user topics:', { walletAddress, topicId });
    
    const response = await fetch(`${API_URL}/users/${walletAddress}/topics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topicId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user topics: ${response.status} - ${errorText}`);
    }
    
    const updatedUser = await response.json();
    console.log('✅ User topics updated successfully:', updatedUser);
    return updatedUser;
  }
);

export const checkAndRegisterUser = createAsyncThunk(
  'user/checkAndRegisterUser',
  async (walletAddress) => {
    try {
      // Check if user is registered on blockchain
      const isRegistered = await checkUserRegistration(walletAddress);
      console.log('isRegistered on blockchain', isRegistered);
      if (!isRegistered) {
        // Register user on blockchain
        await registerUserContract(walletAddress);
        console.log('User registered on blockchain');
      }
      
      // Fetch user data from MongoDB
      const response = await fetch(`${API_URL}/users/${walletAddress}`);
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // Register user in MongoDB
        const registerResponse = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ walletAddress })
        });
        console.log('User registered in MongoDB');
        return await registerResponse.json();
      }
      throw new Error('Failed to fetch user data');
    } catch (error) {
      console.error('Error in checkAndRegisterUser:', error);
      throw error;
    }
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
      // .addCase(updateUserTopics.fulfilled, (state, action) => {
      //   state.user = {
      //     ...state.user,
      //     ...action.payload
      //   };
      // })
      .addCase(takeLoan.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload
        };
      })
      .addCase(checkAndRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isRegistered = true;
        state.user = {
          ...state.user,
          ...action.payload,
          address: action.payload.walletAddress || state.user.address
        };
      })
      .addCase(checkAndRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTokenBalanceThunk.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload
        };
      })
      .addCase(updateUserTopicsThunk.fulfilled, (state, action) => {
        console.log('🔄 Updating Redux state with user topics:', action.payload);
        state.user = {
          ...state.user,
          ...action.payload
        };
        console.log('✅ Redux state updated successfully');
      });
  }
});

export const {
  setWallet,
  setRegistered,
  updateSingleTokenBalance,
  addTrade,
  completeTutorial,
  unlockAchievement,
  clearError
} = userSlice.actions;

export default userSlice.reducer; 