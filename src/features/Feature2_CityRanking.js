import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, MapPin } from 'lucide-react';
import { useCrimeModel } from '@/hooks/useCrimeModel';
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
    const { getCityRankings, selectedModel, setSelectedModel, loading, error } = useCrimeModel();
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 rounded-lg bg-cyan-500/20", children: _jsx(TrendingDown, { className: "w-5 h-5 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "City Crime Rate Ranking" }), _jsx("p", { className: "text-xs text-slate-400", children: "Real-time rankings for all 29 Indian cities" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("select", { value: modelType, onChange: (e) => setModelType(e.target.value), className: "px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm", children: [_jsx("option", { value: "gradientBoosting", children: "Gradient Boosting" }), _jsx("option", { value: "randomForest", children: "Random Forest" }), _jsx("option", { value: "lassoRegression", children: "Lasso Regression" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm text-slate-400", children: "Hour:" }), _jsx("input", { type: "range", min: "0", max: "23", value: selectedHour, onChange: (e) => setSelectedHour(parseInt(e.target.value)), className: "flex-1 h-2 bg-slate-700 rounded-lg accent-cyan-500" }), _jsxs("span", { className: "text-sm text-white font-semibold min-w-fit", children: [String(selectedHour).padStart(2, '0'), ":00"] })] }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm", children: [_jsx("option", { value: "rate", children: "Sort by Crime Rate" }), _jsx("option", { value: "risk", children: "Sort by Risk Level" })] })] }), stats && (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [_jsxs("div", { className: "p-3 rounded-lg bg-red-500/10 border border-red-500/30", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Critical" }), _jsx("p", { className: "text-2xl font-bold text-red-400", children: stats.critical })] }), _jsxs("div", { className: "p-3 rounded-lg bg-orange-500/10 border border-orange-500/30", children: [_jsx("p", { className: "text-xs text-slate-400", children: "High" }), _jsx("p", { className: "text-2xl font-bold text-orange-400", children: stats.high })] }), _jsxs("div", { className: "p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Medium" }), _jsx("p", { className: "text-2xl font-bold text-yellow-400", children: stats.medium })] }), _jsxs("div", { className: "p-3 rounded-lg bg-blue-500/10 border border-blue-500/30", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Low" }), _jsx("p", { className: "text-2xl font-bold text-blue-400", children: stats.low })] }), _jsxs("div", { className: "p-3 rounded-lg bg-green-500/10 border border-green-500/30", children: [_jsx("p", { className: "text-xs text-slate-400", children: "Very Low" }), _jsx("p", { className: "text-2xl font-bold text-green-400", children: stats.veryLow })] })] })), loading && (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-block w-8 h-8 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin" }), _jsx("p", { className: "text-slate-400 mt-3", children: "Loading city rankings..." })] })), error && (_jsx("div", { className: "p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm", children: error })), sortedRankings && sortedRankings.length > 0 && (_jsx("div", { className: "rounded-xl border border-slate-700 overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-800/50 border-b border-slate-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-slate-400", children: "#" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-slate-400", children: "City" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-slate-400", children: "Crime Rate" }), _jsx("th", { className: "px-4 py-3 text-center text-xs font-semibold text-slate-400", children: "Risk Level" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-slate-400", children: "Trend" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-700/50", children: sortedRankings.map((city, idx) => (_jsxs("tr", { className: `hover:bg-slate-700/20 transition-colors border-b border-slate-700/30 ${getRiskBorderColor(city.riskLevel)}`, children: [_jsx("td", { className: "px-4 py-3 text-sm text-slate-400", children: idx + 1 }), _jsxs("td", { className: "px-4 py-3 text-sm font-semibold text-white flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-cyan-400" }), city.city] }), _jsx("td", { className: "px-4 py-3 text-sm text-right text-white font-semibold", children: city.predictedRate.toFixed(2) }), _jsx("td", { className: "px-4 py-3 text-center", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(city.riskLevel)}`, children: city.riskLevel }) }), _jsx("td", { className: "px-4 py-3 text-right", children: city.hourFactor > 1.1 ? (_jsx(TrendingUp, { className: "w-4 h-4 text-red-400 inline-block" })) : city.hourFactor < 0.9 ? (_jsx(TrendingDown, { className: "w-4 h-4 text-green-400 inline-block" })) : (_jsx("span", { className: "text-yellow-400 text-xs", children: "\u2192" })) })] }, city.city))) })] }) })), stats && (_jsx("div", { className: "p-4 rounded-lg bg-slate-800/30 border border-slate-700", children: _jsxs("p", { className: "text-sm text-slate-400", children: ["Average crime rate across all cities at ", _jsxs("span", { className: "font-semibold text-white", children: [String(selectedHour).padStart(2, '0'), ":00"] }), ":", _jsx("span", { className: "font-bold text-cyan-400 ml-2", children: stats.avgRate })] }) }))] }));
};
export default Feature2_CityRanking;
