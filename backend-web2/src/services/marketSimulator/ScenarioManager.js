import ScenarioHandlers from './ScenarioHandlers.js';

class ScenarioManager {
  constructor() {
    this.scenarioStates = new Map();
    this.updateInterval = 3000; // 3 seconds
    this.intervals = new Map();
  }

  /**
   * Initialize and start updating a scenario state by scenarioId
   * @param {string} scenarioId
   * @param {Object} params
   */
  startScenario(scenarioId, params = {}) {
    if (this.scenarioStates.has(scenarioId)) {
      // Already started
      return;
    }

    // Initialize state
    const initialState = ScenarioHandlers.initializeScenarioState(scenarioId, params);
    this.scenarioStates.set(scenarioId, initialState);

    // Start interval to update state
    const intervalId = setInterval(() => {
      this.updateScenarioState(scenarioId);
    }, this.updateInterval);

    this.intervals.set(scenarioId, intervalId);
  }

  /**
   * Stop updating a scenario state
   * @param {string} scenarioId
   */
  stopScenario(scenarioId) {
    if (this.intervals.has(scenarioId)) {
      clearInterval(this.intervals.get(scenarioId));
      this.intervals.delete(scenarioId);
      this.scenarioStates.delete(scenarioId);
    }
  }

  /**
   * Update scenario state by calling the handler
   * @param {string} scenarioId
   */
  updateScenarioState(scenarioId) {
    if (!this.scenarioStates.has(scenarioId)) {
      return;
    }

    const state = this.scenarioStates.get(scenarioId);
    if (ScenarioHandlers[`handle${this.toPascalCase(scenarioId)}`]) {
      const handler = ScenarioHandlers[`handle${this.toPascalCase(scenarioId)}`];
      const newState = handler(state);
      this.scenarioStates.set(scenarioId, { ...state, ...newState });
    } else if (ScenarioHandlers.scenarioHandlers && ScenarioHandlers.scenarioHandlers[scenarioId]) {
      // fallback if scenarioHandlers map exists
      const newState = ScenarioHandlers.scenarioHandlers[scenarioId](state);
      this.scenarioStates.set(scenarioId, { ...state, ...newState });
    } else if (ScenarioHandlers.updateElapsedTime) {
      // No handler found, just update elapsed time
      ScenarioHandlers.updateElapsedTime(state);
      this.scenarioStates.set(scenarioId, state);
    }
  }

  /**
   * Get current state of a scenario
   * @param {string} scenarioId
   * @param {number} lastIndex - optional index of last data point received by client
   * @returns {Object|null}
   */
  getScenarioState(scenarioId, lastIndex = -1) {
    const state = this.scenarioStates.get(scenarioId);
    if (!state) return null;

    // If lastIndex provided, return only new data points after lastIndex
    if (lastIndex >= 0 && Array.isArray(state.dataPoints)) {
      const newPoints = state.dataPoints.slice(lastIndex + 1);
      return { ...state, dataPoints: newPoints };
    }

    return state;
  }

  /**
   * Convert scenarioId string to PascalCase for method lookup
   * e.g. stable-defi-intro -> StableDefiIntro
   * @param {string} str
   * @returns {string}
   */
  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}

const scenarioManager = new ScenarioManager();

export default scenarioManager;
