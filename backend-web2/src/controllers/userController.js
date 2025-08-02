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
    res.status(500).json({ message: error.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { walletAddress, username } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }
    
    // Create new user with 100 initial tokens
    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      username: username || '',
      tokenBalance: 100 // Starting balance
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user token balance
export const updateTokenBalance = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { amount, operation } = req.body; // operation: 'add' or 'subtract'
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (operation === 'add') {
      user.tokenBalance += amount;
    } else if (operation === 'subtract') {
      if (user.tokenBalance < amount) {
        return res.status(400).json({ message: 'Insufficient token balance' });
      }
      user.tokenBalance -= amount;
    }
    
    user.lastActive = Date.now();
    await user.save();
    
    res.json(user);
  } catch (error) {
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
    user.tokenBalance += amount;
    user.lastActive = Date.now();
    await user.save();
    
    res.json(user);
  } catch (error) {
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
    .select('walletAddress username tokenBalance')
    .sort({ tokenBalance: -1 })
    .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};