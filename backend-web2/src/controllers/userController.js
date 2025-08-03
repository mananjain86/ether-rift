import User from '../models/User.js';

// Get user by wallet address
export const getUserByWallet = async (req, res) => {
  try {
    console.log('getUserByWallet called with walletAddress:', req.params.walletAddress);
    const { walletAddress } = req.params;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      console.log('User not found for wallet:', walletAddress);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', {
      walletAddress: user.walletAddress, 
      tokenBalance: user.tokenBalance,
      topicsCount: user.topics?.length || 0,
      achievementsCount: user.achievements?.length || 0,
      loansCount: user.loans?.length || 0
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error in getUserByWallet:', error);
    res.status(500).json({ message: error.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    console.log('registerUser called with body:', req.body);
    const { walletAddress, ensName } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (user) {
      console.log('User already exists for wallet:', walletAddress);
      return res.status(400).json({ message: 'User already registered' });
    }
    
    // Create new user with initial token balances
    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      ensName: ensName || '',
      tokenBalance: 100, // 100 vETH starting balance
      tokenBalances: {
        vETH: 100,
        vUSDC: 0,
        vDAI: 0,
        ERA: 0
      }
    });
    
    await user.save();
    console.log('New user created:', {
      walletAddress: user.walletAddress,
      tokenBalance: user.tokenBalance
    });
    
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
    console.log('updateTokenBalance called with:', {
      walletAddress: req.params.walletAddress,
      body: req.body
    });
    
    const { walletAddress } = req.params;
    const { amount, operation } = req.body; // operation: 'add' or 'subtract'
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      console.log('User not found for token balance update:', walletAddress);
      return res.status(404).json({ message: 'User not found' });
    }
    
    const oldBalance = user.tokenBalance;
    
    if (operation === 'add') {
      user.tokenBalance += amount;
    } else if (operation === 'subtract') {
      if (user.tokenBalance < amount) {
        console.log('Insufficient balance for user:', walletAddress);
        return res.status(400).json({ message: 'Insufficient token balance' });
      }
      user.tokenBalance -= amount;
    }
    
    user.lastActive = Date.now();
    await user.save();
    
    console.log('Token balance updated:', {
      walletAddress,
      oldBalance,
      newBalance: user.tokenBalance,
      operation,
      amount
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error in updateTokenBalance:', error);
    res.status(500).json({ message: error.message });
  }
};

// Record a loan
export const recordLoan = async (req, res) => {
  try {
    console.log('recordLoan called with:', {
      walletAddress: req.params.walletAddress,
      body: req.body
    });
    
    const { walletAddress } = req.params;
    const { tokenBorrowed, amount, collateralToken, collateralAmount } = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      console.log('User not found for loan recording:', walletAddress);
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
    
    console.log('Loan recorded:', {
      walletAddress,
      tokenBorrowed,
      amount,
      collateralToken,
      collateralAmount,
      oldBalance,
      newBalance: user.tokenBalance
    });
    
    res.json(user);
  } catch (error) {
    console.error('Error in recordLoan:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user topics (complete a tutorial)
export const updateUserTopics = async (req, res) => {
  try {
    console.log('updateUserTopics called with:', {
      walletAddress: req.params.walletAddress,
      body: req.body
    });
    
    const { walletAddress } = req.params;
    const { topicId } = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      console.log('User not found for topic update:', walletAddress);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add topic to completed topics if not already present
    if (!user.topics.includes(topicId)) {
      user.topics.push(topicId);
      user.lastActive = Date.now();
      await user.save();
      
      console.log('Topic completed:', {
        walletAddress,
        topicId,
        totalTopicsCompleted: user.topics.length
      });
    } else {
      console.log('Topic already completed:', {
        walletAddress,
        topicId
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in updateUserTopics:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get online users for leaderboard
export const getOnlineUsers = async (req, res) => {
  try {
    console.log('getOnlineUsers called');
    
    // Get users active in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const users = await User.find({
      lastActive: { $gte: fiveMinutesAgo }
    })
    .select('walletAddress username ensName tokenBalance')
    .sort({ tokenBalance: -1 })
    .limit(20);
    
    console.log('Online users found:', users.length);
    
    res.json(users);
  } catch (error) {
    console.error('Error in getOnlineUsers:', error);
    res.status(500).json({ message: error.message });
  }
};