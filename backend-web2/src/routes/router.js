import express from 'express';
import { topicData } from '../data/topicData.js';
import scenarioManager from '../services/marketSimulator/ScenarioManager.js';
// Add this line to the imports
import { getUserByWallet, registerUser, updateTokenBalance, recordLoan, getOnlineUsers } from '../controllers/userController.js';
import { recordPvPMatch, getUserPvPHistory } from '../controllers/pvpController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
router.get('/users/:walletAddress', getUserByWallet);
router.post('/users', registerUser);
router.put('/users/:walletAddress/balance', updateTokenBalance);
router.post('/users/:walletAddress/loans', recordLoan);

// PvP routes
router.post('/pvp', recordPvPMatch);
router.get('/pvp/users/:walletAddress', getUserPvPHistory);

// Get topic data by dimension and topic ID
router.get('/topics/:dimension/:topicId', (req, res) => {
  const { dimension, topicId } = req.params;
  const topicIdNum = parseInt(topicId);
  
  if (!topicData[dimension] || !topicData[dimension][topicIdNum]) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  
  res.json(topicData[dimension][topicIdNum]);
});

// Get all topics for a dimension
router.get('/topics/:dimension', (req, res) => {
  const { dimension } = req.params;
  
  if (!topicData[dimension]) {
    return res.status(404).json({ error: 'Dimension not found' });
  }
  
  res.json(topicData[dimension]);
});

// Get all available dimensions and topics
router.get('/topics', (req, res) => {
  res.json(topicData);
});


// Add specific routes for each scenario based on scenarioId in topicData
Object.entries(topicData).forEach(([dimension, topics]) => {
  Object.values(topics).forEach(topic => {
    const scenarioId = topic.scenarioId;

    // Start scenario updates in scenarioManager
    scenarioManager.startScenario(scenarioId);

    router.get(`/scenario/${scenarioId}`, (req, res) => {
      // Return the latest scenario state along with static info
      const lastIndex = parseInt(req.query.lastIndex) || -1;
      const state = scenarioManager.getScenarioState(scenarioId, lastIndex);
      res.json({
        title: topic.title,
        description: topic.description,
        educationalContent: topic.educationalContent,
        state
      });
    });
  });
});

export default router;

// Add this route
router.get('/users/online', getOnlineUsers);
