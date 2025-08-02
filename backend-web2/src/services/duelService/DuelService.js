class DuelService {
  constructor(wss) {
    this.wss = wss;
    this.waitingPlayers = [];
    this.activeMatches = new Map();
  }

  // Add player to waiting queue
  addToQueue(clientId, walletAddress, wageredAmount) {
    // Check if player is already in queue
    const existingIndex = this.waitingPlayers.findIndex(p => p.walletAddress === walletAddress);
    if (existingIndex >= 0) {
      this.waitingPlayers[existingIndex].clientId = clientId;
      this.waitingPlayers[existingIndex].wageredAmount = wageredAmount;
      return;
    }
    
    // Add new player to queue
    this.waitingPlayers.push({
      clientId,
      walletAddress,
      wageredAmount,
      joinedAt: Date.now()
    });
    
    // Try to match players
    this.matchPlayers();
  }
  
  // Match waiting players
  matchPlayers() {
    if (this.waitingPlayers.length < 2) return;
    
    // Sort by join time (first come, first served)
    this.waitingPlayers.sort((a, b) => a.joinedAt - b.joinedAt);
    
    // Match first two players
    const player1 = this.waitingPlayers.shift(); 
    const player2 = this.waitingPlayers.shift();
    
    // Create a new match
    const matchId = `match_${Date.now()}`;
    const match = {
      id: matchId,
      player1,
      player2,
      questions,
      currentQuestion: 0,
      player1Answers: [],
      player2Answers: [],
      player1Score: 0,
      player2Score: 0,
      startTime: Date.now(),
      status: 'active'
    };
    
    this.activeMatches.set(matchId, match);
    
    // Notify both players
    this.notifyMatchStart(match);
  }
}

export default DuelService