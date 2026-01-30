import { useState, useEffect, useCallback } from 'react';
import { crimeDataService } from '@/api/crimeDataService';

/**
 * useCrimeData Hook
 * Provides real-time crime data with automatic updates and caching
 */
export function useCrimeData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const handleWebSocketConnect = () => {
      setIsWebSocketConnected(true);
    };

    const handleWebSocketDisconnect = () => {
      setIsWebSocketConnected(false);
    };

    const handleDataUpdate = (event) => {
      setData(event.detail);
    };

    window.addEventListener('crimeDataUpdate', handleDataUpdate);
    
    // Connect to WebSocket
    crimeDataService.connectWebSocket((data) => {
      setData(data);
    });

    return () => {
      window.removeEventListener('crimeDataUpdate', handleDataUpdate);
      crimeDataService.disconnectWebSocket();
    };
  }, []);

  // Fetch prediction
  const getPrediction = useCallback(async (city, hour, domain = 'All') => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.predictCrimeRate(city, hour, domain);
      setData(prev => ({ ...prev, prediction: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch city rankings
  const getCityRankings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getCityRankings();
      setData(prev => ({ ...prev, cityRankings: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch hourly patterns
  const getHourlyPatterns = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getHourlyPatterns(city);
      setData(prev => ({ ...prev, hourlyPatterns: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch temporal analysis
  const getTemporalAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getTemporalAnalysis();
      setData(prev => ({ ...prev, temporalAnalysis: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch domain trends
  const getDomainTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getDomainTrends();
      setData(prev => ({ ...prev, domainTrends: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch risk classification
  const getRiskClassification = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getRiskClassification();
      setData(prev => ({ ...prev, riskClassification: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch hotspots
  const getHotspots = useCallback(async (city = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getHotspots(city);
      setData(prev => ({ ...prev, hotspots: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch model performance
  const getModelPerformance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.getModelPerformance();
      setData(prev => ({ ...prev, modelPerformance: result }));
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export data
  const exportData = useCallback(async (format = 'json') => {
    setLoading(true);
    setError(null);
    try {
      const result = await crimeDataService.exportData(format);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    isWebSocketConnected,
    getPrediction,
    getCityRankings,
    getHourlyPatterns,
    getTemporalAnalysis,
    getDomainTrends,
    getRiskClassification,
    getHotspots,
    getModelPerformance,
    exportData
  };
}

/**
 * useCrimePrediction Hook
 * Specialized hook for crime predictions
 */
export function useCrimePrediction(city, hour, domain = 'All') {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await crimeDataService.predictCrimeRate(city, hour, domain);
        setPrediction(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchPrediction();
    }
  }, [city, hour, domain]);

  return { prediction, loading, error };
}

/**
 * useRealtimeCrimeData Hook
 * Listens to real-time crime data updates
 */
export function useRealtimeCrimeData(onUpdate) {
  useEffect(() => {
    const handleUpdate = (event) => {
      if (onUpdate) {
        onUpdate(event.detail);
      }
    };

    window.addEventListener('crimeDataUpdate', handleUpdate);

    return () => {
      window.removeEventListener('crimeDataUpdate', handleUpdate);
    };
  }, [onUpdate]);
}

/**
 * usePollingCrimeData Hook
 * Polls for crime data at regular intervals
 */
export function usePollingCrimeData(interval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollingInterval;

    const fetchData = async () => {
      setLoading(true);
      try {
        const rankings = await crimeDataService.getCityRankings();
        setData(rankings);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    pollingInterval = setInterval(fetchData, interval);

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [interval]);

  return { data, loading, error };
}

export default useCrimeData;
