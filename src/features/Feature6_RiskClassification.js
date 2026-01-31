import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { AlertTriangle, Shield, ChevronRight } from 'lucide-react';
/**
 * Feature 6: Risk Classification System (5 Levels)
 *
 * Risk Levels:
 * - CRITICAL: >= 300 (3 cities, 10.3%)
 * - HIGH: 200-299 (4 cities, 13.8%)
 * - MEDIUM: 100-199 (6 cities, 20.7%)
 * - LOW: 50-99 (8 cities, 27.6%)
 * - VERY_LOW: < 50 (8 cities, 27.6%)
 */
const Feature6_RiskClassification = () => {
    const [expandedRisk, setExpandedRisk] = useState('CRITICAL');
    const riskLevels = {
        'CRITICAL': {
            color: '#FF6B6B',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-600',
            textColor: 'text-red-700',
            icon: '🚨',
            cities: [
                { name: 'Delhi', rate: 542.82, hotspots: 24 },
                { name: 'Mumbai', rate: 437.96, hotspots: 18 },
                { name: 'Bangalore', rate: 360.52, hotspots: 12 }
            ],
            thresholdMin: 300,
            cityCount: 3,
            percentage: 10.3,
            recommendations: [
                '🔴 Immediate police deployment increase required',
                '🔴 24/7 surveillance and monitoring',
                '🔴 Emergency response teams on standby',
                '🔴 Community awareness campaigns',
                '🔴 Increase night patrol strength by 50%'
            ]
        },
        'HIGH': {
            color: '#FF8C42',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-600',
            textColor: 'text-orange-700',
            icon: '⚠️',
            cities: [
                { name: 'Hyderabad', rate: 285.40, hotspots: 8 },
                { name: 'Kolkata', rate: 195.30, hotspots: 6 },
                { name: 'Pune', rate: 178.45, hotspots: 5 },
                { name: 'Ahmedabad', rate: 168.20, hotspots: 4 }
            ],
            thresholdMin: 200,
            thresholdMax: 299,
            cityCount: 4,
            percentage: 13.8,
            recommendations: [
                '🟠 Enhanced police patrols during peak hours',
                '🟠 Increase CCTV camera coverage',
                '🟠 Regular safety briefings for residents',
                '🟠 Coordinate with community watch groups',
                '🟠 Monthly crime analysis and prevention planning'
            ]
        },
        'MEDIUM': {
            color: '#FFD700',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-600',
            textColor: 'text-yellow-700',
            icon: '⚡',
            cities: [
                { name: 'Jaipur', rate: 145.60, hotspots: 3 },
                { name: 'Lucknow', rate: 128.35, hotspots: 3 },
                { name: 'Chandigarh', rate: 95.70, hotspots: 2 },
                { name: 'Surat', rate: 87.50, hotspots: 2 },
                { name: 'Chennai', rate: 82.30, hotspots: 2 },
                { name: 'Indore', rate: 76.45, hotspots: 1 }
            ],
            thresholdMin: 100,
            thresholdMax: 199,
            cityCount: 6,
            percentage: 20.7,
            recommendations: [
                '🟡 Standard police patrol schedules',
                '🟡 Community policing initiatives',
                '🟡 Public awareness programs',
                '🟡 Regular area-based crime analysis',
                '🟡 Neighborhood watch programs'
            ]
        },
        'LOW': {
            color: '#87CEEB',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-600',
            textColor: 'text-blue-700',
            icon: '🛡️',
            cities: [
                { name: 'Thane', rate: 72.60, hotspots: 1 },
                { name: 'Bhopal', rate: 68.90, hotspots: 1 },
                { name: 'Visakhapatnam', rate: 64.20, hotspots: 1 },
                { name: 'Pimpri-Chinchwad', rate: 59.80, hotspots: 1 },
                { name: 'Patna', rate: 55.40, hotspots: 1 },
                { name: 'Vadodara', rate: 51.20, hotspots: 0 },
                { name: 'Ghaziabad', rate: 48.65, hotspots: 0 },
                { name: 'Ludhiana', rate: 45.30, hotspots: 0 }
            ],
            thresholdMin: 50,
            thresholdMax: 99,
            cityCount: 8,
            percentage: 27.6,
            recommendations: [
                '🟦 Regular routine patrols',
                '🟦 Community engagement programs',
                '🟦 Light crime prevention measures',
                '🟦 Quarterly crime review meetings',
                '🟦 Focus on traffic and minor incidents'
            ]
        },
        'VERY_LOW': {
            color: '#90EE90',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-600',
            textColor: 'text-green-700',
            icon: '✅',
            cities: [
                { name: 'Agra', rate: 42.10, hotspots: 0 },
                { name: 'Nashik', rate: 39.85, hotspots: 0 },
                { name: 'Faridabad', rate: 37.50, hotspots: 0 },
                { name: 'Meerut', rate: 35.75, hotspots: 0 },
                { name: 'Kalyan-Dombivali', rate: 34.50, hotspots: 0 },
                { name: 'Vasai-Virar', rate: 34.08, hotspots: 0 },
                { name: 'Varanasi', rate: 33.65, hotspots: 0 },
                { name: 'Rajkot', rate: 33.28, hotspots: 0 }
            ],
            thresholdMin: 0,
            thresholdMax: 49,
            cityCount: 8,
            percentage: 27.6,
            recommendations: [
                '✅ Maintain current safety standards',
                '✅ Community policing as needed',
                '✅ Quick response to any incidents',
                '✅ Annual crime prevention review',
                '✅ Focus on maintaining low crime rate'
            ]
        }
    };
    const getRisksByLevel = (level) => riskLevels[level];
    return (_jsxs("div", { className: "w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "text-purple-600", size: 32 }), "\uD83C\uDFAF Feature 6: Risk Classification System (5 Levels)"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "29 cities classified into 5 risk levels | Safety recommendations for each level" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3 mb-6", children: Object.entries(riskLevels).map(([level, data]) => (_jsxs("button", { onClick: () => setExpandedRisk(level), className: `p-4 rounded-lg transition transform hover:scale-105 ${expandedRisk === level
                        ? `${data.bgColor} ring-4 ring-offset-2`
                        : 'bg-white shadow'}`, style: {
                        borderLeft: expandedRisk === level ? `4px solid ${data.color}` : 'none'
                    }, children: [_jsx("div", { className: "text-3xl mb-2", children: data.icon }), _jsx("p", { className: "font-bold text-gray-800", children: level }), _jsx("p", { style: { color: data.color }, className: "text-xl font-bold mt-2", children: data.cityCount }), _jsx("p", { className: "text-xs text-gray-600", children: "Cities" })] }, level))) }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-800 mb-4", children: "Risk Distribution Across All Cities" }), _jsx("div", { className: "flex h-12 rounded-lg overflow-hidden shadow", children: Object.entries(riskLevels).map(([level, data]) => (_jsxs("div", { className: "flex items-center justify-center text-white font-bold text-xs transition hover:opacity-80 cursor-pointer", style: {
                                width: `${data.percentage}%`,
                                backgroundColor: data.color
                            }, title: `${level}: ${data.percentage}%`, children: [data.percentage, "%"] }, level))) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mt-6", children: Object.entries(riskLevels).map(([level, data]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: data.color } }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-700", children: level }), _jsxs("p", { className: "text-xs text-gray-600", children: [data.percentage, "% ($", data.cityCount, ")"] })] })] }, level))) })] }), _jsxs("div", { className: `rounded-lg shadow-lg overflow-hidden border-l-8`, style: { borderColor: getRisksByLevel(expandedRisk).color }, children: [_jsxs("div", { className: "text-white p-6", style: { backgroundColor: getRisksByLevel(expandedRisk).color }, children: [_jsxs("h3", { className: "text-2xl font-bold flex items-center gap-2", children: [getRisksByLevel(expandedRisk).icon, expandedRisk, " RISK"] }), _jsxs("p", { className: "text-sm opacity-90 mt-2", children: [expandedRisk === 'CRITICAL' && 'Crime Rate: >= 300 | Immediate action required', expandedRisk === 'HIGH' && 'Crime Rate: 200-299 | Enhanced safety measures recommended', expandedRisk === 'MEDIUM' && 'Crime Rate: 100-199 | Standard preventive measures', expandedRisk === 'LOW' && 'Crime Rate: 50-99 | Routine safety protocols', expandedRisk === 'VERY_LOW' && 'Crime Rate: < 50 | Excellent safety record'] })] }), _jsxs("div", { className: "p-6 bg-white", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h4", { className: "font-bold text-gray-800 mb-4 text-lg", children: ["Cities in ", expandedRisk, " Category (", getRisksByLevel(expandedRisk).cityCount, ")"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: getRisksByLevel(expandedRisk).cities.map((city) => (_jsxs("div", { className: `p-4 rounded-lg ${getRisksByLevel(expandedRisk).bgColor}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("p", { className: "font-bold text-gray-800", children: city.name }), _jsx("span", { className: "text-xs px-2 py-1 rounded", style: { backgroundColor: getRisksByLevel(expandedRisk).color, color: 'white' }, children: expandedRisk })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Crime Rate: ", _jsx("strong", { style: { color: getRisksByLevel(expandedRisk).color }, children: city.rate })] }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Hotspots: ", _jsx("strong", { children: city.hotspots })] })] }, city.name))) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-bold text-gray-800 mb-4 text-lg flex items-center gap-2", children: [_jsx(Shield, { size: 20 }), "Recommended Actions"] }), _jsx("div", { className: "space-y-3", children: getRisksByLevel(expandedRisk).recommendations.map((rec, idx) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-gray-50 rounded-lg", children: [_jsx(ChevronRight, { size: 18, style: { color: getRisksByLevel(expandedRisk).color }, className: "flex-shrink-0 mt-1" }), _jsx("p", { className: "text-sm text-gray-700", children: rec })] }, idx))) })] })] })] }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Total Cities" }), _jsx("p", { className: "text-3xl font-bold text-gray-800", children: "29" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Total Risk Classifications" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: "5" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Most Common Risk" }), _jsx("p", { className: "text-lg font-bold text-blue-600", children: "LOW / VERY_LOW" }), _jsx("p", { className: "text-xs text-gray-600", children: "55.2% of cities" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Highest Risk City" }), _jsx("p", { className: "text-lg font-bold text-red-600", children: "Delhi" }), _jsx("p", { className: "text-xs text-gray-600", children: "542.82 crime rate" })] })] }), _jsx("div", { className: "mt-6 p-4 bg-purple-100 border-l-4 border-purple-600 rounded", children: _jsxs("p", { className: "text-sm text-purple-800", children: [_jsx("strong", { children: "Risk Calculation Method:" }), " Crime Rate = (Total Crimes in City / Total Records) \u00D7 1000. Risk levels are assigned based on absolute thresholds to ensure consistent classification across all cities. Safety recommendations are tailored to each risk level's specific requirements."] }) })] }));
};
export default Feature6_RiskClassification;
