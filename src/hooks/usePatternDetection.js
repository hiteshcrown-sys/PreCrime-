/**
 * usePatternDetection Hook
 * Custom React hook for pattern clustering, detection, and analysis
 * Integrates ML pattern detection into CrimeDNA components
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import patternClusteringService from '../utils/patternClusteringService';

export const usePatternDetection = () => {
  const [patterns, setPatterns] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  /**
   * Initialize pattern detection
   */
  useEffect(() => {
    try {
      setLoading(true);
      const { patterns: detectedPatterns, connections: patternConnections, isCached: cached } = 
        patternClusteringService.getCachedClusters();
      
      setPatterns(detectedPatterns || []);
      setConnections(patternConnections || []);
      setIsCached(cached);
      setError(null);
    } catch (err) {
      console.error('Pattern detection error:', err);
      setError(err.message);
      // Fallback to empty patterns
      setPatterns([]);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get pattern by ID
   */
  const getPatternById = useCallback((patternId) => {
    return patterns.find(p => p.id === patternId);
  }, [patterns]);

  /**
   * Get patterns by crime type
   */
  const getPatternsByType = useCallback((crimeType) => {
    return patterns.filter(p => p.type === crimeType);
  }, [patterns]);

  /**
   * Get patterns by zone
   */
  const getPatternsByZone = useCallback((zone) => {
    return patterns.filter(p => p.zone === zone);
  }, [patterns]);

  /**
   * Calculate similarity between two patterns
   */
  const calculateSimilarity = useCallback((pattern1, pattern2) => {
    return patternClusteringService.calculatePatternSimilarity(pattern1, pattern2);
  }, []);

  /**
   * Get related patterns for a given pattern
   */
  const getRelatedPatterns = useCallback((patternId, threshold = 0.7) => {
    const pattern = getPatternById(patternId);
    if (!pattern) return [];

    return patterns
      .filter(p => p.id !== patternId)
      .map(p => ({
        ...p,
        relationshipScore: calculateSimilarity(pattern, p) / 100
      }))
      .filter(p => p.relationshipScore >= threshold)
      .sort((a, b) => b.relationshipScore - a.relationshipScore);
  }, [patterns, getPatternById, calculateSimilarity]);

  /**
   * Get connected patterns (from connections array)
   */
  const getConnectedPatterns = useCallback((patternId) => {
    const connectedIds = new Set();
    connections.forEach(conn => {
      if (conn.from === patternId) connectedIds.add(conn.to);
      if (conn.to === patternId) connectedIds.add(conn.from);
    });
    return Array.from(connectedIds).map(id => getPatternById(id)).filter(Boolean);
  }, [connections, getPatternById]);

  /**
   * Get timeline data for a pattern
   */
  const getPatternTimeline = useCallback((patternId) => {
    try {
      return patternClusteringService.formatPatternTimeline(patternId);
    } catch (err) {
      console.error('Timeline generation error:', err);
      return [];
    }
  }, []);

  /**
   * Get detailed stats for a pattern
   */
  const getPatternStats = useCallback((patternId) => {
    const pattern = getPatternById(patternId);
    if (!pattern) return null;
    
    try {
      return patternClusteringService.generatePatternStats(pattern);
    } catch (err) {
      console.error('Stats generation error:', err);
      return null;
    }
  }, [getPatternById]);

  /**
   * Get all patterns grouped by cluster
   */
  const patternsByCluster = useMemo(() => {
    const grouped = {};
    patterns.forEach(pattern => {
      const cluster = pattern.cluster || 0;
      if (!grouped[cluster]) grouped[cluster] = [];
      grouped[cluster].push(pattern);
    });
    return grouped;
  }, [patterns]);

  /**
   * Get pattern statistics
   */
  const statistics = useMemo(() => {
    if (patterns.length === 0) {
      return {
        totalPatterns: 0,
        uniqueCrimeTypes: 0,
        uniqueZones: 0,
        avgSimilarity: 0,
        highSimilarityPatterns: 0,
        clusters: 0,
        connections: 0
      };
    }

    const crimeTypes = new Set(patterns.map(p => p.type));
    const zones = new Set(patterns.map(p => p.zone));
    const avgSimilarity = patterns.reduce((sum, p) => sum + p.similarity, 0) / patterns.length;
    const highSimilarityPatterns = patterns.filter(p => p.similarity >= 85).length;
    const clusters = new Set(patterns.map(p => p.cluster)).size;

    return {
      totalPatterns: patterns.length,
      uniqueCrimeTypes: crimeTypes.size,
      uniqueZones: zones.size,
      avgSimilarity: Math.round(avgSimilarity),
      highSimilarityPatterns,
      clusters,
      connections: connections.length
    };
  }, [patterns, connections]);

  /**
   * Refresh patterns
   */
  const refreshPatterns = useCallback(() => {
    try {
      setLoading(true);
      const { patterns: detectedPatterns, connections: patternConnections } = 
        patternClusteringService.getCachedClusters();
      
      setPatterns(detectedPatterns || []);
      setConnections(patternConnections || []);
      setError(null);
    } catch (err) {
      console.error('Pattern refresh error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    patterns,
    connections,
    loading,
    error,
    isCached,

    // Query methods
    getPatternById,
    getPatternsByType,
    getPatternsByZone,
    getRelatedPatterns,
    getConnectedPatterns,
    
    // Data generation methods
    getPatternTimeline,
    getPatternStats,
    calculateSimilarity,
    
    // Grouped data
    patternsByCluster,
    statistics,
    
    // Control methods
    refreshPatterns
  };
};

export default usePatternDetection;
