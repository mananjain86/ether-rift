import express from 'express';
import cors from 'cors';
import MarketSimulator from './src/services/marketSimulator/MarketSimulator.js';
import router from './src/routes/router.js';
import connectDB from './src/config/database.js';
import 'dotenv/config';

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize services
const marketSimulator = new MarketSimulator();

// Use API routes
app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`EtherRift backend server running on port ${PORT}`);
});