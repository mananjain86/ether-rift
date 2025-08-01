import express from 'express';
import http from 'http';
import {WebSocketServer} from 'ws';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import MarketSimulator from './src/services/marketSimulator/MarketSimulator.js';
import router from './src/routes/router.js';
import 'dotenv/config';

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Initialize market simulator
const marketSimulator = new MarketSimulator(wss);

// Use API routes
app.use('/api', router);

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Assign a unique ID to this client
  const clientId = uuidv4();
  ws.id = clientId;
  
  console.log(`Client connected: ${clientId}`);
  
  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received message from client ${clientId}:`, data);
      
      // Handle different message types
      switch (data.type) {
        case 'start_scenario':
          marketSimulator.startScenario(clientId, data.topicId, data.params);
          break;
          
        case 'stop_scenario':
          marketSimulator.stopScenario(clientId);
          break;
          
        case 'trigger_event':
          marketSimulator.triggerEvent(clientId, data.eventType, data.eventParams);
          break;
          
        default:
          console.warn(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    marketSimulator.stopScenario(clientId);
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection_established',
    clientId
  }));
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`EtherRift backend server running on port ${PORT}`);
});