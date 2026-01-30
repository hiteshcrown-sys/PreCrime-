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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

import { classifyRiskLevel } from '../utils/crimeModelService';
import crimeModelService from '../utils/crimeModelService';

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
      const data = await response.json();
      return data.hotspots || (Array.isArray(data) ? data : []);
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
  // Get base rate for the city
  const baseRate = crimeModelService.CITY_BASE_RATES[city] || 100;

  // Apply hour adjustment factor
  const hourFactor = crimeModelService.HOUR_ADJUSTMENT_FACTORS[hour] || 1.0;

  // Add real-time variation (±15% fluctuation based on current time)
  const now = new Date();
  const timeSeed = now.getMinutes() + now.getSeconds(); // Changes every minute
  const realTimeVariation = 0.85 + (Math.sin(timeSeed * 0.1) * 0.15); // Smooth variation

  // Add random noise (±5%)
  const randomNoise = 0.95 + Math.random() * 0.1;

  // Calculate adjusted rate
  const adjustedRate = baseRate * hourFactor * realTimeVariation * randomNoise;

  return {
    city,
    hour,
    domain,
    baseCrimeRate: baseRate,
    adjustedRate: Math.round(adjustedRate * 100) / 100, // Round to 2 decimal places
    confidence: 92 + Math.random() * 6, // 92-98% confidence
    timestamp: new Date().toISOString(),
    riskLevel: classifyRiskLevel(adjustedRate)
  };
}

function getMockCityRankings() {
  return {
    cities: [
      { rank: 1, name: 'Delhi', crimeRate: 542.82, riskLevel: 'CRITICAL' },
      { rank: 2, name: 'Mumbai', crimeRate: 487.45, riskLevel: 'CRITICAL' },
      { rank: 3, name: 'Bangalore', crimeRate: 412.34, riskLevel: 'CRITICAL' },
      { rank: 4, name: 'Hyderabad', crimeRate: 398.56, riskLevel: 'CRITICAL' },
      { rank: 5, name: 'Chennai', crimeRate: 367.89, riskLevel: 'CRITICAL' },
      { rank: 6, name: 'Kolkata', crimeRate: 345.23, riskLevel: 'CRITICAL' },
      { rank: 7, name: 'Pune', crimeRate: 298.45, riskLevel: 'HIGH' },
      { rank: 8, name: 'Ahmedabad', crimeRate: 287.12, riskLevel: 'HIGH' },
      { rank: 9, name: 'Jaipur', crimeRate: 276.34, riskLevel: 'HIGH' },
      { rank: 10, name: 'Lucknow', crimeRate: 265.78, riskLevel: 'HIGH' },
      { rank: 11, name: 'Indore', crimeRate: 198.56, riskLevel: 'MEDIUM' },
      { rank: 12, name: 'Meerut', crimeRate: 49.23, riskLevel: 'VERY_LOW' }
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
      {
        level: 'CRITICAL',
        count: 3,
        cities: ['Delhi', 'Mumbai', 'Bangalore'],
        recommendations: [
          'Deploy maximum police presence in high-risk zones',
          'Implement 24/7 armed patrols',
          'Set up temporary checkpoints',
          'Increase surveillance camera monitoring',
          'Coordinate with local authorities for emergency response'
        ]
      },
      {
        level: 'HIGH',
        count: 4,
        cities: [],
        recommendations: [
          'Increase police patrols during peak hours',
          'Enhance street lighting in vulnerable areas',
          'Deploy additional security personnel',
          'Monitor CCTV feeds continuously',
          'Conduct community safety awareness programs'
        ]
      },
      {
        level: 'MEDIUM',
        count: 6,
        cities: [],
        recommendations: [
          'Maintain regular police presence',
          'Conduct routine security checks',
          'Improve community policing initiatives',
          'Monitor crime trends regularly',
          'Enhance public safety infrastructure'
        ]
      },
      {
        level: 'LOW',
        count: 8,
        cities: [],
        recommendations: [
          'Continue standard policing procedures',
          'Focus on preventive measures',
          'Maintain community relations',
          'Regular safety inspections'
        ]
      },
      {
        level: 'VERY_LOW',
        count: 8,
        cities: [],
        recommendations: [
          'Maintain minimal security presence',
          'Focus on general public safety',
          'Conduct occasional safety audits'
        ]
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}

function getMockHotspots(city) {
  const hotspotRecommendations = [
    'Increase foot patrols in this area',
    'Install additional CCTV cameras',
    'Enhance street lighting',
    'Set up community watch programs',
    'Deploy mobile police units',
    'Conduct regular security sweeps',
    'Improve emergency response times',
    'Coordinate with local businesses for security'
  ];

  // Set approximate city coordinates and bounds to avoid water
  const cityCoords = {
    'Delhi': { center: [28.6139, 77.2090], offsetScale: 0.12 },
    'Mumbai': { center: [19.15, 72.95], offsetScale: 0.04, latBias: 0.02, lngBias: 0.02 }, // Even more aggressive East shift
    'Bangalore': { center: [12.9716, 77.5946], offsetScale: 0.12 },
    'Hyderabad': { center: [17.3850, 78.4867], offsetScale: 0.12 },
    'Chennai': { center: [13.04, 80.15], offsetScale: 0.04, lngBias: -0.03 }, // Even more aggressive West shift
    'Kolkata': { center: [22.57, 88.30], offsetScale: 0.06, lngBias: -0.03 }, // Bias West of Hooghly
    'Pune': { center: [18.5204, 73.8567], offsetScale: 0.1 },
    'Ahmedabad': { center: [23.0225, 72.5714], offsetScale: 0.1 },
    'Jaipur': { center: [26.9124, 75.7873], offsetScale: 0.1 },
    'Lucknow': { center: [26.8467, 80.9462], offsetScale: 0.1 },
    'Kanpur': { center: [26.4499, 80.3319], offsetScale: 0.1 },
    'Nagpur': { center: [21.1458, 79.0882], offsetScale: 0.1 },
    'Indore': { center: [22.7196, 75.8577], offsetScale: 0.1 },
    'Surat': { center: [21.20, 72.85], offsetScale: 0.05, lngBias: 0.04 }, // Bias North/East
    'Patna': { center: [25.5941, 85.1376], offsetScale: 0.08 },
    'Bhopal': { center: [23.2599, 77.4126], offsetScale: 0.1 },
    'Thane': { center: [19.2183, 72.9781], offsetScale: 0.08 },
    'Visakhapatnam': { center: [17.70, 83.20], offsetScale: 0.05, lngBias: -0.04 },
    'Pimpri-Chinchwad': { center: [18.6298, 73.7997], offsetScale: 0.1 },
    'Vadodara': { center: [22.3072, 73.1812], offsetScale: 0.1 },
    'Ghaziabad': { center: [28.6692, 77.4538], offsetScale: 0.1 },
    'Ludhiana': { center: [30.9010, 75.8573], offsetScale: 0.1 },
    'Agra': { center: [27.1767, 78.0081], offsetScale: 0.1 },
    'Indira Nagar': { center: [26.85, 80.98], offsetScale: 0.05 },
    'Srinagar': { center: [34.0837, 74.7973], offsetScale: 0.1 },
    'Meerut': { center: [28.9845, 77.7064], offsetScale: 0.1 },
    'Ranchi': { center: [23.3441, 85.3096], offsetScale: 0.1 },
    'Bhubaneswar': { center: [20.2961, 85.8245], offsetScale: 0.1 },
    'Aligarh': { center: [27.8974, 77.8926], offsetScale: 0.1 },
    'Rajkot': { center: [22.3039, 70.8022], offsetScale: 0.1 }
  };

  const config = cityCoords[city] || cityCoords['Delhi'];
  const center = config.center;
  const scale = config.offsetScale;
  const latBias = config.latBias || 0;
  const lngBias = config.lngBias || 0;

  const hotspots = Array.from({ length: 8 }, (_, i) => {
    // Apply random offset with optional bias to stay on land
    const lat = center[0] + (Math.random() - 0.5) * scale + latBias;
    const lng = center[1] + (Math.random() - 0.5) * scale + lngBias;

    return {
      id: `mock-hotspot-${city}-${i}`,
      city: city || 'Delhi',
      name: `Risk Zone ${String.fromCharCode(65 + i)}`,
      lat,
      lng,
      coordinates: [lat, lng],
      density: 50 + Math.random() * 50,
      riskLevel: Math.random() > 0.8 ? 'CRITICAL' : (Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'),
      priority: Math.random() > 0.8 ? 'CRITICAL' : (Math.random() > 0.5 ? 'HIGH' : 'MEDIUM'),
      recommendations: hotspotRecommendations.slice(0, 2 + Math.floor(Math.random() * 3))
    };
  });

  return hotspots;
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
