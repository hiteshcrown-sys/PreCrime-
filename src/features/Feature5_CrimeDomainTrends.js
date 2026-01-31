import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { PieChart, TrendingUp } from 'lucide-react';
/**
 * Feature 5: Crime Domain Trends Analysis
 *
 * Data:
 * - 4 Crime Domains analyzed
 * - Other Crime: 22,948 (57.1%) - Peak: 03:00
 * - Violent Crime: 11,472 (28.6%) - Peak: 19:00
 * - Fire Accident: 3,825 (9.5%) - Peak: 04:00
 * - Traffic Fatality: 1,915 (4.8%) - Peak: 20:00
 */
const Feature5_CrimeDomainTrends = () => {
    const [selectedDomain, setSelectedDomain] = useState('Other Crime');
    const [selectedMetric, setSelectedMetric] = useState('hourly');
    const domains = [
        {
            name: 'Other Crime',
            count: 22948,
            percentage: 57.14,
            color: '#FF6B6B',
            bgColor: 'bg-red-50',
            peakHour: '03:00',
            peakCount: 2145,
            description: 'Theft, Burglary, Fraud, Drug Trafficking, Vandalism, Extortion',
            icon: '🎯'
        },
        {
            name: 'Violent Crime',
            count: 11472,
            percentage: 28.57,
            color: '#FF8C42',
            bgColor: 'bg-orange-50',
            peakHour: '19:00',
            peakCount: 1254,
            description: 'Assault, Robbery, Murder, Rape, Kidnapping, Gang Violence',
            icon: '⚠️'
        },
        {
            name: 'Fire Accident',
            count: 3825,
            percentage: 9.52,
            color: '#FFD700',
            bgColor: 'bg-yellow-50',
            peakHour: '04:00',
            peakCount: 362,
            description: 'Fire-related incidents, Accidental fires, Property damage',
            icon: '🔥'
        },
        {
            name: 'Traffic Fatality',
            count: 1915,
            percentage: 4.77,
            color: '#87CEEB',
            bgColor: 'bg-blue-50',
            peakHour: '20:00',
            peakCount: 187,
            description: 'Road accidents, Traffic-related deaths, Vehicle collisions',
            icon: '🚗'
        }
    ];
    const selectedDomainData = domains.find(d => d.name === selectedDomain);
    const hourlyTrends = {
        'Other Crime': [
            { hour: 0, count: 895 }, { hour: 1, count: 912 }, { hour: 2, count: 1052 },
            { hour: 3, count: 2145 }, { hour: 4, count: 1895 }, { hour: 5, count: 1632 },
            { hour: 6, count: 1458 }, { hour: 7, count: 1523 }, { hour: 8, count: 1412 },
            { hour: 9, count: 1389 }, { hour: 10, count: 1245 }, { hour: 11, count: 1289 },
            { hour: 12, count: 1156 }, { hour: 13, count: 1098 }, { hour: 14, count: 1167 },
            { hour: 15, count: 1234 }, { hour: 16, count: 1298 }, { hour: 17, count: 1189 },
            { hour: 18, count: 1245 }, { hour: 19, count: 1367 }, { hour: 20, count: 1456 },
            { hour: 21, count: 1523 }, { hour: 22, count: 1398 }, { hour: 23, count: 1256 }
        ],
        'Violent Crime': [
            { hour: 0, count: 387 }, { hour: 1, count: 412 }, { hour: 2, count: 478 },
            { hour: 3, count: 623 }, { hour: 4, count: 562 }, { hour: 5, count: 489 },
            { hour: 6, count: 445 }, { hour: 7, count: 523 }, { hour: 8, count: 487 },
            { hour: 9, count: 465 }, { hour: 10, count: 412 }, { hour: 11, count: 434 },
            { hour: 12, count: 389 }, { hour: 13, count: 367 }, { hour: 14, count: 401 },
            { hour: 15, count: 434 }, { hour: 16, count: 456 }, { hour: 17, count: 412 },
            { hour: 18, count: 467 }, { hour: 19, count: 1254 }, { hour: 20, count: 1089 },
            { hour: 21, count: 945 }, { hour: 22, count: 834 }, { hour: 23, count: 723 }
        ],
        'Fire Accident': [
            { hour: 0, count: 145 }, { hour: 1, count: 156 }, { hour: 2, count: 178 },
            { hour: 3, count: 245 }, { hour: 4, count: 362 }, { hour: 5, count: 298 },
            { hour: 6, count: 267 }, { hour: 7, count: 289 }, { hour: 8, count: 267 },
            { hour: 9, count: 245 }, { hour: 10, count: 223 }, { hour: 11, count: 234 },
            { hour: 12, count: 201 }, { hour: 13, count: 189 }, { hour: 14, count: 212 },
            { hour: 15, count: 234 }, { hour: 16, count: 245 }, { hour: 17, count: 212 },
            { hour: 18, count: 223 }, { hour: 19, count: 267 }, { hour: 20, count: 298 },
            { hour: 21, count: 312 }, { hour: 22, count: 289 }, { hour: 23, count: 234 }
        ],
        'Traffic Fatality': [
            { hour: 0, count: 56 }, { hour: 1, count: 67 }, { hour: 2, count: 78 },
            { hour: 3, count: 98 }, { hour: 4, count: 112 }, { hour: 5, count: 89 },
            { hour: 6, count: 76 }, { hour: 7, count: 123 }, { hour: 8, count: 145 },
            { hour: 9, count: 134 }, { hour: 10, count: 112 }, { hour: 11, count: 98 },
            { hour: 12, count: 89 }, { hour: 13, count: 76 }, { hour: 14, count: 87 },
            { hour: 15, count: 98 }, { hour: 16, count: 112 }, { hour: 17, count: 134 },
            { hour: 18, count: 145 }, { hour: 19, count: 156 }, { hour: 20, count: 187 },
            { hour: 21, count: 167 }, { hour: 22, count: 134 }, { hour: 23, count: 98 }
        ]
    };
    const hourlyData = hourlyTrends[selectedDomain] || [];
    const maxCount = Math.max(...hourlyData.map(d => d.count));
    return (_jsxs("div", { className: "w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl shadow-lg", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-3xl font-bold text-gray-800 flex items-center gap-2", children: [_jsx(Pie, { className: "text-teal-600", size: 32 }), "\uD83D\uDD0D Feature 5: Crime Domain Analysis"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "4 Crime domains | Domain-specific hourly patterns | Peak hours identification" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: domains.map((domain) => (_jsxs("button", { onClick: () => setSelectedDomain(domain.name), className: `p-4 rounded-lg text-left transition transform hover:scale-105 ${selectedDomain === domain.name
                        ? `${domain.bgColor} ring-4 ring-offset-2`
                        : 'bg-white shadow'}`, children: [_jsx("div", { className: "text-3xl mb-2", children: domain.icon }), _jsx("p", { className: "font-bold text-gray-800", children: domain.name }), _jsx("p", { className: "text-2xl font-bold mt-2", style: { color: domain.color }, children: domain.count.toLocaleString() }), _jsxs("p", { className: "text-sm text-gray-600", children: [domain.percentage, "%"] }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Peak: ", domain.peakHour] })] }, domain.name))) }), selectedDomainData && (_jsxs(_Fragment, { children: [_jsxs("div", { className: `${selectedDomainData.bgColor} border-l-4 p-4 rounded-lg mb-6`, style: { borderColor: selectedDomainData.color }, children: [_jsxs("h3", { className: "font-bold text-gray-800 mb-2 text-lg", children: [selectedDomainData.name, " Details"] }), _jsx("p", { className: "text-sm text-gray-700", children: selectedDomainData.description }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600", children: "Total Incidents" }), _jsx("p", { className: "text-2xl font-bold", style: { color: selectedDomainData.color }, children: selectedDomainData.count.toLocaleString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600", children: "Percentage" }), _jsxs("p", { className: "text-2xl font-bold", style: { color: selectedDomainData.color }, children: [selectedDomainData.percentage, "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600", children: "Peak Hour" }), _jsx("p", { className: "text-2xl font-bold", style: { color: selectedDomainData.color }, children: selectedDomainData.peakHour }), _jsxs("p", { className: "text-xs text-gray-600", children: [selectedDomainData.peakCount, " incidents"] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 mb-4 flex items-center gap-2", children: [_jsx(LineChart, { size: 24 }), "24-Hour Trend for ", selectedDomain] }), _jsx("div", { className: "space-y-3", children: hourlyData.map((data) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "w-12 font-bold text-gray-700 text-right", children: [String(data.hour).padStart(2, '0'), ":00"] }), _jsx("div", { className: "flex-1 h-6 bg-gray-200 rounded-lg overflow-hidden", children: _jsx("div", { className: "h-full transition-all", style: {
                                                    width: `${(data.count / maxCount) * 100}%`,
                                                    backgroundColor: selectedDomainData.color
                                                } }) }), _jsx("span", { className: "w-16 text-right font-semibold text-gray-800", children: data.count })] }, data.hour))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-800 mb-4", children: "Domain Distribution" }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "relative w-48 h-48", children: domains.map((domain, idx) => {
                                                const startAngle = domains
                                                    .slice(0, idx)
                                                    .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0);
                                                const angle = (domain.percentage / 100) * 360;
                                                return (_jsx("div", { className: "absolute w-48 h-48 rounded-full", style: {
                                                        background: domain.color,
                                                        opacity: 0.2,
                                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 48 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 48 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 48 * Math.cos((startAngle + angle - 90) * Math.PI / 180)}% ${50 + 48 * Math.sin((startAngle + angle - 90) * Math.PI / 180)}%)`
                                                    } }, domain.name));
                                            }) }) }), _jsx("div", { className: "mt-6 space-y-2", children: domains.map((domain) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: domain.color } }), _jsxs("span", { className: "text-sm text-gray-700 font-semibold", children: [domain.name, ": ", domain.percentage, "%"] })] }, domain.name))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-800 mb-4", children: "Peak Hours by Domain" }), _jsx("div", { className: "space-y-4", children: domains.map((domain) => (_jsxs("div", { className: "pb-4 border-b last:border-b-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: domain.color } }), _jsx("p", { className: "font-semibold text-gray-800", children: domain.name })] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Peak Hour: ", _jsx("strong", { children: domain.peakHour }), " with", ' ', _jsx("strong", { style: { color: domain.color }, children: domain.peakCount }), " incidents"] })] }, domain.name))) })] })] })] })), _jsx("div", { className: "mt-6 p-4 bg-blue-100 border-l-4 border-blue-600 rounded", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Key Finding:" }), " Crime domains show distinct temporal patterns. Other Crimes peak at night (03:00), while Violent Crime peaks in evening (19:00). This temporal variation is crucial for resource allocation and preventive strategies."] }) })] }));
};
export default Feature5_CrimeDomainTrends;
