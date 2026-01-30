/**
 * crimeDataService.js - Real-time Crime Data API Integration
 * 
 * This service handles:
 * - Real-time crime predictions
 * - City crime rate updates
 * - Hotspot monitoring
 * - Risk classification updates
 * - WebSocket connections for live data
 */

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws';

// Cache configuration
const CACHE_DURATION = {
  PREDICTIONS: 30000, // 30 seconds
  CITIES: 60000,      // 1 minute
  HOTSPOTS: 300000,   // 5 minutes
};

let wsConnection = null;
const listeners = new Map();

/**
 * Crime Prediction Service
 */
export const crimeDataService = {
  /**
   * Get real-time crime prediction for a specific city and hour
   * @param {string} city - City name
   * @param {number} hour - Hour (0-23)
   * @param {string} domain - Crime domain (optional)
   */
  async predictCrimeRate(city, hour, domain = 'All') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/predict?city=${encodeURIComponent(city)}&hour=${hour}&domain=${encodeURIComponent(domain)}`
      );
      if (!response.ok) throw new Error('Prediction failed');
      return await response.json();
    } catch (error) {
      console.error('Crime prediction error:', error);
      // Fallback to mock data
      return getMockPrediction(city, hour, domain);
    }
  },

  /**
   * Get all city rankings by crime rate
   */
  async getCityRankings() {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/rankings`);
      if (!response.ok) throw new Error('Rankings fetch failed');
      return await response.json();
    } catch (error) {
      console.error('City rankings error:', error);
      return getMockCityRankings();
    }
  },

  /**
   * Get hourly crime patterns for a specific city
   * @param {string} city - City name
   */
  async getHourlyPatterns(city) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/patterns/hourly?city=${encodeURIComponent(city)}`
      );
      if (!response.ok) throw new Error('Hourly patterns fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Hourly patterns error:', error);
      return getMockHourlyPatterns(city);
    }
  },

  /**
   * Get temporal analysis data
   */
  async getTemporalAnalysis() {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/temporal`);
      if (!response.ok) throw new Error('Temporal analysis fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Temporal analysis error:', error);
      return getMockTemporalAnalysis();
    }
  },

  /**
   * Get crime domain trends
   */
  async getDomainTrends() {
    try {
      const response = await fetch(`${API_BASE_URL}/trends/domains`);
      if (!response.ok) throw new Error('Domain trends fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Domain trends error:', error);
      return getMockDomainTrends();
    }
  },

  /**
   * Get risk classification for all cities
   */
  async getRiskClassification() {
    try {
      const response = await fetch(`${API_BASE_URL}/risk/classification`);
      if (!response.ok) throw new Error('Risk classification fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Risk classification error:', error);
      return getMockRiskClassification();
    }
  },

  /**
   * Get hotspot data with coordinates
   */
  async getHotspots(city = null) {
    try {
      const url = city
        ? `${API_BASE_URL}/hotspots?city=${encodeURIComponent(city)}`
        : `${API_BASE_URL}/hotspots`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Hotspots fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Hotspots error:', error);
      return getMockHotspots(city);
    }
  },

  /**
   * Get model performance metrics
   */
  async getModelPerformance() {
    try {
      const response = await fetch(`${API_BASE_URL}/model/performance`);
      if (!response.ok) throw new Error('Model performance fetch failed');
      return await response.json();
    } catch (error) {
      console.error('Model performance error:', error);
      return getMockModelPerformance();
    }
  },

  /**
   * Export system data
   * @param {string} format - 'json' or 'csv'
   */
  async exportData(format = 'json') {
    try {
      const response = await fetch(`${API_BASE_URL}/export?format=${format}`);
      if (!response.ok) throw new Error('Export failed');
      return await response.blob();
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },

  /**
   * Initialize WebSocket connection for real-time updates
   */
  connectWebSocket(onDataUpdate) {
    try {
      wsConnection = new WebSocket(WS_URL);

      wsConnection.onopen = () => {
        console.log('WebSocket connected');
        // Subscribe to crime data updates
        wsConnection.send(JSON.stringify({
          type: 'subscribe',
          channels: ['predictions', 'alerts', 'hotspots']
        }));
      };

      wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onDataUpdate(data);
        
        // Dispatch event for components to listen to
        window.dispatchEvent(new CustomEvent('crimeDataUpdate', { detail: data }));
      };

      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsConnection.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt reconnection
        setTimeout(() => this.connectWebSocket(onDataUpdate), 5000);
      };

      return wsConnection;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      return null;
    }
  },

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
    }
  },

  /**
   * Subscribe to real-time updates
   */
  subscribe(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(callback);
  },

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(event, callback) {
    if (listeners.has(event)) {
      const callbacks = listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
};

/**
 * Mock Data Functions (Fallback)
 */

function getMockPrediction(city, hour, domain) {
  return {
    city,
    hour,
    domain,
    baseCrimeRate: 250 + Math.random() * 100,
    adjustedRate: 260 + Math.random() * 120,
    confidence: 99.98,
    timestamp: new Date().toISOString()
  };
}

function getMockCityRankings() {
  return {
    cities: [
      { rank: 1, name: 'Delhi', crimeRate: 542.82, riskLevel: 'CRITICAL' },
      { rank: 2, name: 'Mumbai', crimeRate: 487.45, riskLevel: 'CRITICAL' },
      { rank: 3, name: 'Bangalore', crimeRate: 412.34, riskLevel: 'HIGH' },
      // Add more cities...
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockHourlyPatterns(city) {
  const patterns = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    crimes: 600 + Math.random() * 100,
    percentage: (600 + Math.random() * 100) / 100
  }));
  return { city, patterns, lastUpdated: new Date().toISOString() };
}

function getMockTemporalAnalysis() {
  return {
    hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      totalCrimes: 600 + Math.random() * 100,
      trend: Math.random() > 0.5 ? 'increasing' : 'decreasing'
    })),
    lastUpdated: new Date().toISOString()
  };
}

function getMockDomainTrends() {
  return {
    domains: [
      { name: 'Other Crime', count: 22948, percentage: 57.14 },
      { name: 'Violent Crime', count: 11472, percentage: 28.57 },
      { name: 'Fire Accident', count: 3825, percentage: 9.52 },
      { name: 'Traffic Fatality', count: 1915, percentage: 4.77 }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockRiskClassification() {
  return {
    levels: [
      { level: 'CRITICAL', count: 3, cities: ['Delhi', 'Mumbai', 'Bangalore'] },
      { level: 'HIGH', count: 4, cities: [] },
      { level: 'MEDIUM', count: 6, cities: [] },
      { level: 'LOW', count: 8, cities: [] },
      { level: 'VERY_LOW', count: 8, cities: [] }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockHotspots(city) {
  const hotspots = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    city: city || 'Delhi',
    name: `Hotspot ${i + 1}`,
    coordinates: [28.5 + Math.random() * 0.5, 77 + Math.random() * 0.5],
    density: 50 + Math.random() * 50,
    priority: Math.random() > 0.7 ? 'CRITICAL' : 'HIGH'
  }));
  return { hotspots, lastUpdated: new Date().toISOString() };
}

function getMockModelPerformance() {
  return {
    models: [
      {
        name: 'Gradient Boosting',
        accuracy: 99.98,
        precision: 99.96,
        recall: 99.95,
        f1Score: 99.96,
        rmse: 0.12,
        mae: 0.08,
        rocAuc: 0.9999
      },
      {
        name: 'Random Forest',
        accuracy: 97.34,
        precision: 97.28,
        recall: 97.15,
        f1Score: 97.22,
        rmse: 1.45,
        mae: 0.92,
        rocAuc: 0.9878
      },
      {
        name: 'Lasso Regression',
        accuracy: 85.42,
        precision: 85.12,
        recall: 84.98,
        f1Score: 85.05,
        rmse: 5.67,
        mae: 3.45,
        rocAuc: 0.8734
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

export default crimeDataService;
