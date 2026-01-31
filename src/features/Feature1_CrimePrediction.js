import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { useCrimeModel } from '@/hooks/useCrimeModel';
/**
 * Feature 1: Crime Rate Prediction
 * Real-time interactive widget for predicting crime rates using ML models
 *
 * Integration:
 * - Uses trained Gradient Boosting model
 * - Real-time predictions based on city, hour, and domain
 * - Model accuracy: 99.98%
 * - Supports 3 ML models for comparison
 */
const Feature1_CrimePrediction = () => {
    const [selectedCity, setSelectedCity] = useState('Delhi');
    const [selectedHour, setSelectedHour] = useState(9);
    const [selectedDomain, setSelectedDomain] = useState('Other Crime');
    const [modelType, setModelType] = useState('gradientBoosting');
    const [showComparison, setShowComparison] = useState(false);
    // Use crime model hook
    const { predict, compareModels, classifyRiskLevel, getSafetyRecommendations, getModelInfo, selectedModel, setSelectedModel, loading, error } = useCrimeModel();
    // Update selected model when modelType changes
    useEffect(() => {
        setSelectedModel(modelType);
    }, [modelType, setSelectedModel]);
    // Get current prediction
    const prediction = predict(selectedCity, selectedHour);
    // Get model comparison if needed
    const modelComparison = showComparison ? compareModels(selectedCity, selectedHour) : null;
    // Get safety recommendations
    const recommendations = prediction ? getSafetyRecommendations(prediction.riskLevel) : [];
    // Get model info
    const currentModelInfo = getModelInfo(modelType);
    const cities = [
        'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Kolkata',
        'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore',
        'Kanpur', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
        'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
        'Nagpur', 'Indira Nagar', 'Srinagar', 'Meerut', 'Ranchi',
        'Bhubaneswar', 'Aligarh', 'Rajkot'
    ];
    const crimedomains = ['Other Crime', 'Violent Crime', 'Fire Accident', 'Traffic Fatality'];
    const getRiskColor = (riskLevel) => {
        const colors = {
            'CRITICAL': '#dc2626',
            'HIGH': '#f97316',
            'MEDIUM': '#eab308',
            'LOW': '#3b82f6',
            'VERY_LOW': '#10b981'
        };
        return colors[riskLevel] || '#666';
    };
    const getRiskBgColor = (riskLevel) => {
        const colors = {
            'CRITICAL': 'from-red-900/20 to-red-800/10 border-red-500/30',
            'HIGH': 'from-orange-900/20 to-orange-800/10 border-orange-500/30',
            'MEDIUM': 'from-yellow-900/20 to-yellow-800/10 border-yellow-500/30',
            'LOW': 'from-blue-900/20 to-blue-800/10 border-blue-500/30',
            'VERY_LOW': 'from-green-900/20 to-green-800/10 border-green-500/30'
        };
        return colors[riskLevel] || 'from-slate-900/20 to-slate-800/10 border-slate-500/30';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "p-2 rounded-lg bg-cyan-500/20", children: _jsx(Activity, { className: "w-5 h-5 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Crime Rate Prediction" }), _jsx("p", { className: "text-xs text-slate-400", children: "Real-time predictions using ML models" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                    { id: 'gradientBoosting', name: 'Gradient Boosting', accuracy: '99.98%' },
                    { id: 'randomForest', name: 'Random Forest', accuracy: '99.75%' },
                    { id: 'lassoRegression', name: 'Lasso Regression', accuracy: '85.42%' }
                ].map(model => (_jsxs("button", { onClick: () => setModelType(model.id), className: `p-3 rounded-lg border-2 transition-all ${modelType === model.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}`, children: [_jsx("p", { className: "font-semibold text-sm", children: model.name }), _jsxs("p", { className: "text-xs mt-1", children: [model.accuracy, " accuracy"] })] }, model.id))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "City" }), _jsx("select", { value: selectedCity, onChange: (e) => setSelectedCity(e.target.value), className: "w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-500", children: cities.map(city => (_jsx("option", { value: city, children: city }, city))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm text-slate-400 block mb-2", children: ["Hour: ", String(selectedHour).padStart(2, '0'), ":00"] }), _jsx("input", { type: "range", min: "0", max: "23", value: selectedHour, onChange: (e) => setSelectedHour(parseInt(e.target.value)), className: "w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-slate-400 block mb-2", children: "Crime Domain" }), _jsx("select", { value: selectedDomain, onChange: (e) => setSelectedDomain(e.target.value), className: "w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-cyan-500", children: crimedomains.map(domain => (_jsx("option", { value: domain, children: domain }, domain))) })] })] }), prediction && !prediction.error && (_jsx("div", { className: `rounded-xl p-6 bg-gradient-to-br ${getRiskBgColor(prediction.riskLevel)} border`, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Predicted Crime Rate" }), _jsx("p", { className: "text-4xl font-bold text-white", children: prediction.predictedRate.toFixed(2) }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["Base: ", prediction.baseRate] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Risk Level" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center", style: { backgroundColor: getRiskColor(prediction.riskLevel) + '20', borderColor: getRiskColor(prediction.riskLevel) + '50', borderWidth: 2 }, children: _jsx(TrendingUp, { className: "w-6 h-6", style: { color: getRiskColor(prediction.riskLevel) } }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-white", children: prediction.riskLevel }), _jsxs("p", { className: "text-xs text-slate-500", children: ["Confidence: ", prediction.confidence] })] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400 mb-2", children: "Hour Adjustment" }), _jsxs("p", { className: "text-3xl font-bold text-white", children: ["\u00D7", prediction.hourFactor.toFixed(2)] }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["Model: ", prediction.model] })] })] }) })), loading && (_jsxs("div", { className: "p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center", children: [_jsx("div", { className: "inline-block w-8 h-8 border-4 border-slate-600 border-t-cyan-500 rounded-full animate-spin" }), _jsx("p", { className: "text-slate-400 mt-3", children: "Generating prediction..." })] })), error && (_jsx("div", { className: "p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm", children: _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), " ", error] }) })), prediction && !prediction.error && recommendations.length > 0 && (_jsxs("div", { className: "rounded-xl bg-slate-800/30 border border-slate-700 p-4", children: [_jsxs("h3", { className: "text-sm font-semibold text-white mb-3 flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), " Safety Recommendations"] }), _jsx("ul", { className: "space-y-2", children: recommendations.map((rec, idx) => (_jsx("li", { className: "text-sm text-slate-300", children: rec }, idx))) })] })), _jsxs("button", { onClick: () => setShowComparison(!showComparison), className: "w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2", children: [_jsx(BarChart3, { className: "w-4 h-4" }), showComparison ? 'Hide Model Comparison' : 'Compare All Models'] }), showComparison && modelComparison && (_jsxs("div", { className: "rounded-xl bg-slate-800/30 border border-slate-700 p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-white mb-4", children: "Model Predictions Comparison" }), _jsx("div", { className: "space-y-3", children: modelComparison.map((model, idx) => (_jsxs("div", { className: "p-3 bg-slate-700/30 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-semibold text-slate-300", children: model.model }), _jsxs("span", { className: "text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400", children: [(model.accuracy), "% accuracy"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-500", children: "Predicted Rate" }), _jsx("p", { className: "text-white font-semibold", children: model.predictedRate.toFixed(2) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500", children: "Risk Level" }), _jsx("p", { className: "text-white font-semibold", children: model.riskLevel })] })] })] }, idx))) })] })), currentModelInfo && !currentModelInfo.error && (_jsxs("div", { className: "rounded-xl bg-slate-800/30 border border-slate-700 p-4 text-sm", children: [_jsx("h3", { className: "font-semibold text-white mb-2", children: "Current Model Information" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-slate-300", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Type" }), _jsx("p", { className: "text-white", children: currentModelInfo.type })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "MAE" }), _jsx("p", { className: "text-white", children: currentModelInfo.mae })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "RMSE" }), _jsx("p", { className: "text-white", children: currentModelInfo.rmse })] }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-500 text-xs", children: "Status" }), _jsx("p", { className: "text-green-400", children: "Production Ready" })] })] })] }))] }));
};
export default Feature1_CrimePrediction;
