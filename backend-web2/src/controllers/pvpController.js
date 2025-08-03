import PvPRecord from '../models/PvPRecord.js';
import User from '../models/User.js';

// Record a PvP match
export const recordPvPMatch = async (req, res) => {
  try {
    console.log('recordPvPMatch called with body:', req.body);
    
    const {
      player1Address,
      player2Address,
      player1Score,
      player2Score,
      player1Wagered,
      player2Wagered,
      gameType
    } = req.body;
    
    // Determine winner
    let winner;
    if (player1Score > player2Score) {
      winner = 'player1';
    } else if (player2Score > player1Score) {
      winner = 'player2';
    } else {
      winner = 'draw';
    }
    
    // Calculate tokens rewarded
    const totalWagered = player1Wagered + player2Wagered;
    const tokensRewarded = winner === 'draw' ? 0 : totalWagered;
    
    console.log('PvP match details:', {
      player1Address,
      player2Address,
      player1Score,
      player2Score,
      winner,
      tokensRewarded
    });
    
    // Create PvP record
    const pvpRecord = new PvPRecord({
      player1: {
        walletAddress: player1Address.toLowerCase(),
        score: player1Score,
        tokensWagered: player1Wagered
      },
      player2: {
        walletAddress: player2Address.toLowerCase(),
        score: player2Score,
        tokensWagered: player2Wagered
      },
      winner,
      tokensRewarded,
      gameType,
      timestamp: Date.now()
    });
    
    await pvpRecord.save();
    console.log('PvP record saved with ID:', pvpRecord._id);
    
    // Update user balances
    if (winner !== 'draw') {
      const winnerAddress = winner === 'player1' ? player1Address : player2Address;
      const loserAddress = winner === 'player1' ? player2Address : player1Address;
      
      await User.findOneAndUpdate(
        { walletAddress: winnerAddress.toLowerCase() },
        { $inc: { tokenBalance: tokensRewarded }, lastActive: Date.now() }
      );
      
      console.log('Updated winner balance:', {
        winnerAddress,
        tokensRewarded
      });
      
      // No need to update loser's balance as it was already deducted when wagering
    }
    
    res.status(201).json(pvpRecord);
  } catch (error) {
    console.error('Error in recordPvPMatch:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get PvP history for a user
export const getUserPvPHistory = async (req, res) => {
  try {
    console.log('getUserPvPHistory called for wallet:', req.params.walletAddress);
    
    const { walletAddress } = req.params;
    const lowerCaseAddress = walletAddress.toLowerCase();
    
    const pvpRecords = await PvPRecord.find({
      $or: [
        { 'player1.walletAddress': lowerCaseAddress },
        { 'player2.walletAddress': lowerCaseAddress }
      ]
    }).sort({ timestamp: -1 });
    
    console.log('PvP history found:', {
      walletAddress: lowerCaseAddress,
      recordCount: pvpRecords.length
    });
    
    res.json(pvpRecords);
  } catch (error) {
    console.error('Error in getUserPvPHistory:', error);
    res.status(500).json({ message: error.message });
  }
};