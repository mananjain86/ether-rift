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
  
  // Handle client disconnection
  handleDisconnect(clientId) {
    // Remove from waiting queue if present
    const queueIndex = this.waitingPlayers.findIndex(p => p.clientId === clientId);
    if (queueIndex >= 0) {
      this.waitingPlayers.splice(queueIndex, 1);
      return;
    }
    
    // Check if player is in an active match
    for (const [matchId, match] of this.activeMatches.entries()) {
      if (match.player1.clientId === clientId || match.player2.clientId === clientId) {
        // Determine winner by forfeit
        const winner = match.player1.clientId === clientId ? 'player2' : 'player1';
        const loser = winner === 'player1' ? 'player2' : 'player1';
        
        // Update match status
        match.status = 'completed';
        match.winner = winner;
        
        // Notify remaining player about forfeit
        const remainingClientId = match[winner].clientId;
        const client = [...this.wss.clients].find(c => c.id === remainingClientId);
        
        if (client) {
          client.send(JSON.stringify({
            type: 'duel_completed',
            result: 'win_by_forfeit',
            matchId
          }));
        }
        
        // Remove match from active matches
        this.activeMatches.delete(matchId);
        break;
      }
    }
  }
}

export default DuelService