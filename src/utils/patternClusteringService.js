/**
 * Pattern Clustering Service
 * Advanced pattern detection and clustering for CrimeDNA
 * Uses K-means clustering on crime patterns with similarity scoring
 */

const crimeTypes = [
  'Assault', 'Vehicle Theft', 'Break-in', 'Vandalism', 
  'Drug Activity', 'Robbery', 'Fraud', 'Burglary',
  'Theft', 'Aggravated Assault', 'Homicide', 'Sexual Assault',
  'Arson', 'Stalking', 'Money Laundering'
];

const indianZones = [
  'South Delhi', 'New Delhi', 'Central Delhi', 'Dwarka', 'Rohini',
  'East Delhi', 'West Delhi', 'North Delhi',
  'South Mumbai', 'Central Mumbai', 'West Mumbai', 'East Mumbai', 'North Mumbai',
  'South Bangalore', 'East Bangalore', 'Central Bangalore', 'North Bangalore', 'West Bangalore',
  'Hyderabad Center', 'Hyderabad East', 'Hyderabad West',
  'Kolkata South', 'Kolkata North', 'Kolkata East', 'Kolkata Central'
];

/**
 * K-means clustering implementation
 */
class KMeansClustering {
  constructor(k = 7, maxIterations = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = [];
    this.clusters = [];
  }

  /**
   * Initialize centroids from random data points
   */
  initializeCentroids(data) {
    this.centroids = [];
    const indices = new Set();
    while (indices.size < this.k && indices.size < data.length) {
      indices.add(Math.floor(Math.random() * data.length));
    }
    indices.forEach(i => {
      this.centroids.push({ ...data[i] });
    });
  }

  /**
   * Calculate Euclidean distance
   */
  distance(point1, point2) {
    let sum = 0;
    const keys = Object.keys(point1).filter(k => typeof point1[k] === 'number');
    keys.forEach(key => {
      sum += Math.pow((point1[key] - point2[key]) || 0, 2);
    });
    return Math.sqrt(sum);
  }

  /**
   * Assign data points to nearest centroid
   */
  assignClusters(data) {
    this.clusters = Array.from({ length: this.k }, () => []);
    data.forEach((point, idx) => {
      let minDist = Infinity;
      let closestCluster = 0;
      this.centroids.forEach((centroid, cIdx) => {
        const dist = this.distance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = cIdx;
        }
      });
      this.clusters[closestCluster].push({ ...point, clusterIdx: closestCluster });
    });
  }

  /**
   * Update centroids based on cluster means
   */
  updateCentroids(data) {
    const newCentroids = [];
    this.clusters.forEach((cluster, idx) => {
      if (cluster.length === 0) {
        newCentroids.push(this.centroids[idx]);
        return;
      }
      const numericKeys = Object.keys(data[0]).filter(k => typeof data[0][k] === 'number');
      const centroid = {};
      numericKeys.forEach(key => {
        centroid[key] = cluster.reduce((sum, p) => sum + p[key], 0) / cluster.length;
      });
      newCentroids.push(centroid);
    });
    this.centroids = newCentroids;
  }

  /**
   * Run K-means algorithm
   */
  fit(data) {
    if (data.length === 0) return [];
    this.initializeCentroids(data);
    
    for (let iter = 0; iter < this.maxIterations; iter++) {
      this.assignClusters(data);
      const oldCentroids = this.centroids.map(c => ({ ...c }));
      this.updateCentroids(data);
      
      // Check convergence
      const converged = oldCentroids.every((old, idx) => {
        return this.distance(old, this.centroids[idx]) < 0.001;
      });
      if (converged) break;
    }
    
    this.assignClusters(data);
    return this.clusters;
  }
}

/**
 * Generate random pattern data point
 */
const generatePatternDataPoint = (crimeType, zone, hour, severity) => {
  return {
    crimeType: crimeType,
    zone: zone,
    hour: hour,
    severity: severity,
    density: Math.random() * 100,
    frequency: Math.random() * 50,
    temporal: (hour / 24) * 100,
    geographic: Math.random() * 100,
    seasonal: (((new Date().getMonth() + 1) / 12) * 100)
  };
};

/**
 * Generate synthetic pattern data
 */
export const generatePatternData = () => {
  const patterns = [];
  const numPatterns = 35; // Generate 35 patterns
  
  for (let i = 0; i < numPatterns; i++) {
    const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
    const zone = indianZones[Math.floor(Math.random() * indianZones.length)];
    const hour = Math.floor(Math.random() * 24);
    const severity = Math.random() * 100;
    
    patterns.push(generatePatternDataPoint(crimeType, zone, hour, severity));
  }
  
  return patterns;
};

/**
 * Cluster patterns using K-means
 */
export const clusterPatterns = (patterns = null) => {
  const data = patterns || generatePatternData();
  const kmeans = new KMeansClustering(7, 100);
  const clusters = kmeans.fit(data);
  return clusters;
};

/**
 * Calculate similarity score between two patterns (0-100)
 */
export const calculatePatternSimilarity = (pattern1, pattern2) => {
  let similarity = 0;
  let factors = 0;
  
  // Crime type similarity
  if (pattern1.crimeType === pattern2.crimeType) {
    similarity += 30;
  } else {
    similarity += 10; // Partial match
  }
  factors += 30;
  
  // Zone/Location similarity
  if (pattern1.zone === pattern2.zone) {
    similarity += 20;
  } else {
    similarity += 5;
  }
  factors += 20;
  
  // Hour similarity (within 2 hours)
  const hourDiff = Math.abs(pattern1.hour - pattern2.hour);
  if (hourDiff <= 2) {
    similarity += 20;
  } else if (hourDiff <= 6) {
    similarity += 10;
  }
  factors += 20;
  
  // Severity similarity
  const severityDiff = Math.abs(pattern1.severity - pattern2.severity);
  if (severityDiff < 10) {
    similarity += 20;
  } else if (severityDiff < 30) {
    similarity += 10;
  }
  factors += 30;
  
  // Density similarity
  const densityDiff = Math.abs(pattern1.density - pattern2.density);
  if (densityDiff < 10) {
    similarity += 10;
  }
  factors += 10;
  
  return Math.min(100, (similarity / factors) * 100);
};

/**
 * Find pattern connections (strong correlations)
 */
export const findPatternConnections = (patterns) => {
  const connections = [];
  const threshold = 0.6; // 60% similarity threshold
  
  for (let i = 0; i < patterns.length; i++) {
    for (let j = i + 1; j < patterns.length; j++) {
      const similarity = calculatePatternSimilarity(patterns[i], patterns[j]) / 100;
      if (similarity >= threshold && connections.length < 20) {
        connections.push({
          from: patterns[i].id,
          to: patterns[j].id,
          strength: Math.min(similarity, 1)
        });
      }
    }
  }
  
  return connections;
};

/**
 * Convert cluster data to visualization format
 */
export const formatClustersForVisualization = (clusters) => {
  const patterns = [];
  let patternId = 1;
  
  clusters.forEach((cluster, clusterIdx) => {
    cluster.forEach(point => {
      // Distribute patterns across the visualization area
      const x = 15 + (clusterIdx % 3) * 30 + Math.random() * 15;
      const y = 20 + Math.floor(clusterIdx / 3) * 30 + Math.random() * 15;
      const size = 25 + (point.severity / 100) * 30;
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899'];
      
      patterns.push({
        id: `DNA-${String(patternId).padStart(3, '0')}`,
        x: Math.min(90, Math.max(10, x)),
        y: Math.min(80, Math.max(10, y)),
        size: Math.max(25, Math.min(60, size)),
        type: point.crimeType,
        zone: point.zone,
        hour: point.hour,
        severity: point.severity,
        similarity: Math.round(50 + Math.random() * 50), // 50-100% similarity
        density: Math.round(point.density),
        color: colors[clusterIdx % colors.length],
        cluster: clusterIdx
      });
      patternId++;
    });
  });
  
  return patterns;
};

/**
 * Format temporal data for pattern timeline
 */
export const formatPatternTimeline = (patternId) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const timelineData = [];
  
  // Generate temporal trend (increasing trend with some variation)
  let baseValue = 35;
  for (let i = 0; i < months.length; i++) {
    baseValue += Math.random() * 15 - 3; // Trending upward
    const value = Math.min(98, Math.max(30, baseValue));
    const events = Math.floor(10 + (value / 100) * 45);
    
    timelineData.push({
      date: months[i],
      value: Math.round(value),
      events: events
    });
  }
  
  return timelineData;
};

/**
 * Generate pattern statistics for detail card
 */
export const generatePatternStats = (pattern) => {
  return {
    id: pattern.id,
    similarity: pattern.similarity,
    type: pattern.type,
    zone: pattern.zone,
    hour: pattern.hour,
    severity: Math.round(pattern.severity),
    density: pattern.density,
    frequency: `${Math.floor(5 + Math.random() * 25)} incidents/month`,
    trend: Math.random() > 0.5 ? 'INCREASING' : 'STABLE',
    confidence: Math.round(85 + Math.random() * 15),
    relatedCrimes: [
      { type: pattern.type, percentage: 100 },
      { type: crimeTypes[Math.floor(Math.random() * crimeTypes.length)], percentage: Math.round(30 + Math.random() * 50) }
    ],
    affectedZones: [
      pattern.zone,
      indianZones[Math.floor(Math.random() * indianZones.length)],
      indianZones[Math.floor(Math.random() * indianZones.length)]
    ]
  };
};

/**
 * Cache for clustering results
 */
const clusterCache = {
  data: null,
  patterns: null,
  connections: null,
  timestamp: null,
  TTL: 5 * 60 * 1000 // 5 minutes
};

/**
 * Get cached or fresh cluster data
 */
export const getCachedClusters = () => {
  const now = Date.now();
  if (clusterCache.data && (now - clusterCache.timestamp) < clusterCache.TTL) {
    return {
      patterns: clusterCache.patterns,
      connections: clusterCache.connections,
      isCached: true
    };
  }
  
  // Generate fresh clusters
  const patternData = generatePatternData();
  const clusters = clusterPatterns(patternData);
  const patterns = formatClustersForVisualization(clusters);
  const connections = findPatternConnections(patterns);
  
  // Update cache
  clusterCache.data = patternData;
  clusterCache.patterns = patterns;
  clusterCache.connections = connections;
  clusterCache.timestamp = now;
  
  return {
    patterns,
    connections,
    isCached: false
  };
};

/**
 * Main clustering service export
 */
export const patternClusteringService = {
  generatePatternData,
  clusterPatterns,
  calculatePatternSimilarity,
  findPatternConnections,
  formatClustersForVisualization,
  formatPatternTimeline,
  generatePatternStats,
  getCachedClusters
};

export default patternClusteringService;
