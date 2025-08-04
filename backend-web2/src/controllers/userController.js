import User from '../models/User.js';

// Get user by wallet address
export const getUserByWallet = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getUserByWallet:', error);
    res.status(500).json({ message: error.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { walletAddress, ensName } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }
    
    // Create new user with initial token balances
    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      ensName: ensName || '',
      tokenBalances: {
        vETH: 100,
        vUSDC: 0,
        vDAI: 0,
        ERA: 0
      },
      topics: [],
      achievements: [],
      trades: {
        completed: 0,
        totalVolume: 0
      },
      loans: [],
      winLoss: [0, 0]
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user ENS name
// export const updateEnsName = async (req, res) => {
//   try {
//     const { walletAddress } = req.params;
//     const { ensName } = req.body;
    
//     const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
    
//     user.ensName = ensName;
//     user.lastActive = Date.now();
//     await user.save();
    
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Update user token balance
export const updateTokenBalance = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { token, amount, operation } = req.body; // operation: 'add' or 'subtract'
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const oldBalance = user.tokenBalances[token] || 0;
    
    if (operation === 'add') {
      user.tokenBalances[token] = (user.tokenBalances[token] || 0) + amount;
    } else if (operation === 'subtract') {
      if ((user.tokenBalances[token] || 0) < amount) {
        return res.status(400).json({ message: 'Insufficient token balance' });
      }
      user.tokenBalances[token] = (user.tokenBalances[token] || 0) - amount;
    }
    
    user.lastActive = Date.now();
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error in updateTokenBalance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Record a loan
export const recordLoan = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { tokenBorrowed, amount, collateralToken, collateralAmount } = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add loan record
    user.loans.push({
      tokenBorrowed,
      amount,
      collateralToken,
      collateralAmount,
      timestamp: Date.now()
    });
    
    // Add tokens to balance
    const oldBalance = user.tokenBalance;
    user.tokenBalance += amount;
    user.lastActive = Date.now();
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error in recordLoan:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user topics (complete a tutorial)
export const updateUserTopics = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { topicId } = req.body;
    
    console.log('📚 updateUserTopics called with:', { walletAddress, topicId });
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) { 
      console.log('❌ User not found:', walletAddress);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('👤 Found user:', user.walletAddress);
    console.log('📖 Current topics:', user.topics);
    
    // Add topic to completed topics if not already present
    if (!user.topics.includes(topicId)) {
      user.topics.push(topicId);
      user.lastActive = Date.now();
      await user.save();
      console.log('✅ Topic added successfully. Updated topics:', user.topics);
    } else {
      console.log('⚠️ Topic already completed:', topicId);
    }
    
    console.log('📤 Sending response with user data');
    res.json(user);
  } catch (error) {
    console.error('❌ Error in updateUserTopics:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get online users for leaderboard
export const getOnlineUsers = async (req, res) => {
  try {
    // Get users active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const users = await User.find({
      lastActive: { $gte: fiveMinutesAgo }
    })
    .select('walletAddress username ensName tokenBalance')
    .sort({ tokenBalance: -1 })
    .limit(20);
    
    res.json(users);
  } catch (error) {
    console.error('Error in getOnlineUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

// General update function for all user data
export const updateUserData = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle different types of updates
    if (updates.tokenBalances) {
      console.log('💰 Updating token balances:', updates.tokenBalances);
      user.tokenBalances = { ...user.tokenBalances, ...updates.tokenBalances };
      console.log('✅ Token balances updated successfully');
    }
    
    if (updates.$push) {
      if (updates.$push.topics) {
        if (!user.topics.includes(updates.$push.topics)) {
          user.topics.push(updates.$push.topics);
        }
      }
      if (updates.$push.achievements) {
        user.achievements.push(updates.$push.achievements);
      }
      if (updates.$push.trades) {
        // Initialize trades array if it doesn't exist
        if (!user.trades.history) {
          user.trades.history = [];
        }
        user.trades.history.push(updates.$push.trades);
        user.trades.completed = (user.trades.completed || 0) + 1;
      }
      if (updates.$push.loans) {
        user.loans.push(updates.$push.loans);
      }
    }
    
    if (updates.$inc) {
      if (updates.$inc['trades.totalVolume']) {
        user.trades.totalVolume = (user.trades.totalVolume || 0) + updates.$inc['trades.totalVolume'];
      }
      if (updates.$inc['winLoss.0']) {
        user.winLoss[0] = (user.winLoss[0] || 0) + updates.$inc['winLoss.0'];
      }
      if (updates.$inc['winLoss.1']) {
        user.winLoss[1] = (user.winLoss[1] || 0) + updates.$inc['winLoss.1'];
      }
    }
    
    if (updates.lastActive) {
      user.lastActive = new Date(updates.lastActive);
    }
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Error in updateUserData:', error);
    res.status(500).json({ message: error.message });
  }
};