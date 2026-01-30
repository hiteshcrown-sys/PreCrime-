import { useState, useCallback, useEffect } from 'react';
import {
  predictCrimeRate,
  predictHourlyPatterns,
  predictCityRankings,
  batchPredictCrimeRates,
  compareModelPredictions,
  getPeakCrimeHours,
  getSafestHours,
  getCrimeDomainDistribution,
  getModelInfo,
  classifyRiskLevel,
  getSafetyRecommendations
} from '@/utils/crimeModelService';

/**
 * Custom hook for crime prediction model operations
 * Provides caching and real-time updates
 */
export const useCrimeModel = () => {
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const [selectedModel, setSelectedModel] = useState('gradientBoosting');

  // Cache key generator
  const getCacheKey = useCallback((operation, ...params) => {
    return `${operation}_${params.join('_')}`;
  }, []);

  // Predict crime rate for a city at a specific hour
  const predict = useCallback((city, hour) => {
    const cacheKey = getCacheKey('predict', city, hour, selectedModel);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = predictCrimeRate(city, hour, selectedModel);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedModel, cache, getCacheKey]);

  // Get hourly patterns for a city
  const getHourlyPatterns = useCallback((city) => {
    const cacheKey = getCacheKey('hourly', city, selectedModel);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = predictHourlyPatterns(city, selectedModel);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedModel, cache, getCacheKey]);

  // Get city rankings for a specific hour
  const getCityRankings = useCallback((hour) => {
    const cacheKey = getCacheKey('rankings', hour, selectedModel);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = predictCityRankings(hour, selectedModel);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedModel, cache, getCacheKey]);

  // Batch predict for multiple cities and hours
  const batchPredict = useCallback((cities, hours) => {
    const cacheKey = getCacheKey('batch', cities.join(','), hours.join(','), selectedModel);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = batchPredictCrimeRates(cities, hours, selectedModel);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedModel, cache, getCacheKey]);

  // Compare predictions across all models
  const compareModels = useCallback((city, hour) => {
    const cacheKey = getCacheKey('compare', city, hour);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = compareModelPredictions(city, hour);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache, getCacheKey]);

  // Get peak crime hours
  const getPeakHours = useCallback((city) => {
    const cacheKey = getCacheKey('peak', city);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = getPeakCrimeHours(city);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache, getCacheKey]);

  // Get safest hours
  const getSafeHours = useCallback((city) => {
    const cacheKey = getCacheKey('safe', city);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    setLoading(true);
    try {
      const result = getSafestHours(city);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cache, getCacheKey]);

  // Get domain distribution
  const getDomainDistribution = useCallback((hour) => {
    const cacheKey = getCacheKey('domain', hour);
    
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    try {
      const result = getCrimeDomainDistribution(hour);
      setCache(prev => ({ ...prev, [cacheKey]: result }));
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [cache, getCacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  // Clear specific cache entry
  const clearCacheEntry = useCallback((operation, ...params) => {
    const cacheKey = getCacheKey(operation, ...params);
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[cacheKey];
      return newCache;
    });
  }, [getCacheKey]);

  return {
    predict,
    getHourlyPatterns,
    getCityRankings,
    batchPredict,
    compareModels,
    getPeakHours,
    getSafeHours,
    getDomainDistribution,
    classifyRiskLevel,
    getSafetyRecommendations,
    getModelInfo,
    selectedModel,
    setSelectedModel,
    loading,
    error,
    cacheSize: Object.keys(cache).length,
    clearCache,
    clearCacheEntry
  };
};

export default useCrimeModel;
