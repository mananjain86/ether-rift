import express from 'express';
import { topicData } from '../data/topicData.js';
// Add this line to the imports
import { getUserByWallet, registerUser, updateTokenBalance, recordLoan, getOnlineUsers, updateUserTopics } from '../controllers/userController.js';
import { recordPvPMatch, getUserPvPHistory } from '../controllers/pvpController.js';

const router = express.Router();
 
// Health check endpoint
router.get('/health', (req, res) => { 
  console.log('Health check endpoint called');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
router.get('/users/:walletAddress', getUserByWallet);
router.post('/users', registerUser);
router.put('/users/:walletAddress/balance', updateTokenBalance);
// router.put('/users/:walletAddress/ens', updateEnsName);
router.post('/users/:walletAddress/loans', recordLoan);
router.put('/users/:walletAddress/topics', updateUserTopics);
router.get('/users/online', getOnlineUsers);

// PvP routes
router.post('/pvp', recordPvPMatch);
router.get('/pvp/users/:walletAddress', getUserPvPHistory);

// Get topic data by dimension and topic ID
router.get('/topics/:dimension/:topicId', (req, res) => {
  console.log('Topic by dimension and ID called:', req.params);
  const { dimension, topicId } = req.params;
  const topicIdNum = parseInt(topicId);
  
  if (!topicData[dimension] || !topicData[dimension][topicIdNum]) {
    console.log('Topic not found:', { dimension, topicId });
    return res.status(404).json({ error: 'Topic not found' });
  }
  
  console.log('Topic found:', { dimension, topicId });
  res.json(topicData[dimension][topicIdNum]);
});

// Get all topics for a dimension
router.get('/topics/:dimension', (req, res) => {
  console.log('Topics by dimension called:', req.params.dimension);
  const { dimension } = req.params;
  
  if (!topicData[dimension]) {
    console.log('Dimension not found:', dimension);
    return res.status(404).json({ error: 'Dimension not found' });
  }
  
  console.log('Topics for dimension found:', { dimension, topicCount: Object.keys(topicData[dimension]).length });
  res.json(topicData[dimension]);
});

// Get all available dimensions and topics
router.get('/topics', (req, res) => {
  console.log('All topics endpoint called');
  console.log('Available dimensions:', Object.keys(topicData));
  console.log('Total topics:', Object.values(topicData).reduce((acc, dimension) => acc + Object.keys(dimension).length, 0));
  res.json(topicData);
});

export default router;
