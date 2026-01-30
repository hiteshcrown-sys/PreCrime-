import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, MapPin } from 'lucide-react';
import useCrimeModel from '@/hooks/useCrimeModel';

/**
 * Feature 2: City Ranking by Crime Rate
 * Ranks all 29 Indian cities by predicted crime rate using ML models
 * 
 * Integration:
 * - Real-time predictions for all cities
 * - Sortable by crime rate, risk level
 * - Hour-based ranking updates
 */

const Feature2_CityRanking = () => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [sortBy, setSortBy] = useState('rate'); // 'rate' or 'risk'
  const [modelType, setModelType] = useState('gradientBoosting');

  // Use crime model hook
  const {
    getCityRankings,
    selectedModel,
    setSelectedModel,
    loading,
    error
  } = useCrimeModel();

  // Update model when type changes
  useEffect(() => {
    setSelectedModel(modelType);
  }, [modelType, setSelectedModel]);

  // Get city rankings for selected hour
  const rankings = getCityRankings(selectedHour);

  // Sort rankings
  const sortedRankings = rankings
    ? [...rankings].sort((a, b) => {
        if (sortBy === 'rate') {
          return b.predictedRate - a.predictedRate;
        }
        // Sort by risk level order
        const riskOrder = { 'CRITICAL': 5, 'HIGH': 4, 'MEDIUM': 3, 'LOW': 2, 'VERY_LOW': 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      })
    : [];

  const getRiskColor = (riskLevel) => {
    const colors = {
      'CRITICAL': 'text-red-400 bg-red-500/10',
      'HIGH': 'text-orange-400 bg-orange-500/10',
      'MEDIUM': 'text-yellow-400 bg-yellow-500/10',
      'LOW': 'text-blue-400 bg-blue-500/10',
      'VERY_LOW': 'text-green-400 bg-green-500/10'
    };
    return colors[riskLevel] || 'text-gray-400';
  };

  const getRiskBorderColor = (riskLevel) => {
    const colors = {
      'CRITICAL': 'border-red-500/30',
      'HIGH': 'border-orange-500/30',
      'MEDIUM': 'border-yellow-500/30',
      'LOW': 'border-blue-500/30',
      'VERY_LOW': 'border-green-500/30'
    };
    return colors[riskLevel] || 'border-slate-500/30';
  };

  // Statistics
  const stats = rankings ? {
    critical: rankings.filter(r => r.riskLevel === 'CRITICAL').length,
    high: rankings.filter(r => r.riskLevel === 'HIGH').length,
    medium: rankings.filter(r => r.riskLevel === 'MEDIUM').length,
    low: rankings.filter(r => r.riskLevel === 'LOW').length,
    veryLow: rankings.filter(r => r.riskLevel === 'VERY_LOW').length,
    avgRate: (rankings.reduce((sum, r) => sum + r.predictedRate, 0) / rankings.length).toFixed(2)
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <TrendingDown className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">City Crime Rate Ranking</h2>
          <p className="text-xs text-slate-400">Real-time rankings for all 29 Indian cities</p>
        </div>
      </div>

      {/* Model & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model Selector */}
        <select
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm"
        >
          <option value="gradientBoosting">Gradient Boosting</option>
          <option value="randomForest">Random Forest</option>
          <option value="lassoRegression">Lasso Regression</option>
        </select>

        {/* Hour Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Hour:</label>
          <input
            type="range"
            min="0"
            max="23"
            value={selectedHour}
            onChange={(e) => setSelectedHour(parseInt(e.target.value))}
            className="flex-1 h-2 bg-slate-700 rounded-lg accent-cyan-500"
          />
          <span className="text-sm text-white font-semibold min-w-fit">{String(selectedHour).padStart(2, '0')}:00</span>
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm"
        >
          <option value="rate">Sort by Crime Rate</option>
          <option value="risk">Sort by Risk Level</option>
        </select>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-slate-400">Critical</p>
            <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <p className="text-xs text-slate-400">High</p>
            <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-xs text-slate-400">Medium</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs text-slate-400">Low</p>
            <p className="text-2xl font-bold text-blue-400">{stats.low}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-xs text-slate-400">Very Low</p>
            <p className="text-2xl font-bold text-green-400">{stats.veryLow}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-3">Loading city rankings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Rankings Table */}
      {sortedRankings && sortedRankings.length > 0 && (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">City</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Crime Rate</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400">Risk Level</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {sortedRankings.map((city, idx) => (
                <tr key={city.city} className={`hover:bg-slate-700/20 transition-colors border-b border-slate-700/30 ${getRiskBorderColor(city.riskLevel)}`}>
                  <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {city.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-white font-semibold">
                    {city.predictedRate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(city.riskLevel)}`}>
                      {city.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {city.hourFactor > 1.1 ? (
                      <TrendingUp className="w-4 h-4 text-red-400 inline-block" />
                    ) : city.hourFactor < 0.9 ? (
                      <TrendingDown className="w-4 h-4 text-green-400 inline-block" />
                    ) : (
                      <span className="text-yellow-400 text-xs">→</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Average Rate Info */}
      {stats && (
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
          <p className="text-sm text-slate-400">
            Average crime rate across all cities at <span className="font-semibold text-white">{String(selectedHour).padStart(2, '0')}:00</span>: 
            <span className="font-bold text-cyan-400 ml-2">{stats.avgRate}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Feature2_CityRanking;
