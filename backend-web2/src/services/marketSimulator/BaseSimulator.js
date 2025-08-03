/**
 * Base Market Simulator class with core functionality
 */
class BaseSimulator {
  constructor() {
    this.activeScenarios = new Map(); // Map of active scenarios by client ID
    this.clientTopics = new Map(); // Map of active topics by client ID
    this.intervalIds = new Map(); // Map of interval IDs by client ID
    
    // Default broadcast interval in milliseconds
    this.broadcastInterval = 3000;
  }

  /**
   * Start a scenario for a specific client
   * @param {string} clientId - Unique identifier for the client
   * @param {string} topicId - The topic ID to start
   * @param {Object} params - Additional parameters for the scenario
   */
  startScenario(clientId, topicId, params = {}) {
    // Clear any existing scenario for this client
    this.stopScenario(clientId);
    
    // Set the active topic for this client
    this.clientTopics.set(clientId, topicId);
    
    // Initialize scenario state
    const scenarioState = this.initializeScenarioState(topicId, params);
    this.activeScenarios.set(clientId, scenarioState);
    
    // Start the broadcast interval
    const intervalId = setInterval(() => {
      this.broadcastUpdate(clientId);
    }, this.broadcastInterval);
    
    this.intervalIds.set(clientId, intervalId);
    
    // Send initial data immediately
    this.broadcastUpdate(clientId);
    
    console.log(`Started scenario ${topicId} for client ${clientId}`);
  }

  /**
   * Stop the active scenario for a client
   * @param {string} clientId - Unique identifier for the client
   */
  stopScenario(clientId) {
    if (this.intervalIds.has(clientId)) {
      clearInterval(this.intervalIds.get(clientId));
      this.intervalIds.delete(clientId);
      this.activeScenarios.delete(clientId);
      this.clientTopics.delete(clientId);
      console.log(`Stopped scenario for client ${clientId}`);
    }
  }

  /**
   * Trigger a specific event in an active scenario
   * @param {string} clientId - Unique identifier for the client
   * @param {string} eventType - The type of event to trigger
   * @param {Object} eventParams - Parameters for the event
   */
  triggerEvent(clientId, eventType, eventParams = {}) {
    if (!this.activeScenarios.has(clientId)) {
      console.warn(`No active scenario for client ${clientId}`);
      return;
    }
    
    const scenarioState = this.activeScenarios.get(clientId);
    const topicId = this.clientTopics.get(clientId);
    
    // Update scenario state based on the event
    scenarioState.events = scenarioState.events || {};
    scenarioState.events[eventType] = {
      triggered: true,
      timestamp: Date.now(),
      params: eventParams
    };
    
    console.log(`Triggered event ${eventType} for client ${clientId} in scenario ${topicId}`);
    
    // Broadcast an update immediately after the event
    this.broadcastUpdate(clientId);
  }

  /**
   * Broadcast an update to a specific client
   * @param {string} clientId - The client to send the update to
   */
  broadcastUpdate(clientId) {
    if (!this.activeScenarios.has(clientId)) {
      return;
    }
    
    const scenarioState = this.activeScenarios.get(clientId);
    const topicId = this.clientTopics.get(clientId);
    
    // Update elapsed time
    this.updateElapsedTime(scenarioState);
    
    // Get payload from scenario handler
    let payload = {};
    if (this.scenarioHandlers && this.scenarioHandlers[topicId]) {
      payload = this.scenarioHandlers[topicId](scenarioState);
    }
    
    // For quiz functionality, we don't need real-time updates
    console.log(`Scenario update for client ${clientId}:`, payload);
  }

  /**
   * Broadcast to all clients subscribed to a specific topic
   * @param {string} topicId - The topic to broadcast to
   * @param {Object} payload - The payload to send
   */
  broadcastToAll(topicId, payload) {
    // For quiz functionality, we don't need real-time broadcasts
    console.log(`Broadcast to topic ${topicId}:`, payload);
  }

  /**
   * Update the elapsed time for a scenario state
   * @param {Object} state - The scenario state to update
   * @returns {Object} The updated state
   */
  updateElapsedTime(state) {
    state.elapsedTime = Date.now() - state.startTime;
    return state;
  }

  /**
   * Initialize scenario state based on topic ID
   * @param {string} topicId - The topic ID
   * @param {Object} params - Additional parameters
   * @returns {Object} The initialized scenario state
   */
  initializeScenarioState(topicId, params) {
    // Common base state
    const baseState = {
      startTime: Date.now(),
      elapsedTime: 0,
      events: {},
      params
    };
    
    // This will be overridden by specific scenario handlers
    return baseState;
  }
}

export default BaseSimulator; 