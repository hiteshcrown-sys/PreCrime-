import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCrimeModel } from '@/hooks/useCrimeModel';
import Feature3_HourlyPatterns from '@/features/Feature3_HourlyPatterns';
import Feature4_TemporalAnalysis from '@/features/Feature4_TemporalAnalysis';
import Feature5_CrimeDomainTrends from '@/features/Feature5_CrimeDomainTrends';
/**
 * Temporal Crime Analytics
 * Integrated view combining:
 * - Hourly crime patterns
 * - Temporal analysis across cities
 * - Crime domain trends over time
 */
export default function TemporalAnalytics() {
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedDomain, setSelectedDomain] = useState('Other Crime');
    const { getHourlyPatterns, getDomainDistribution } = useCrimeModel();
    // Calculate peak crime hour dynamically from model predictions
    const peakCrimeData = useMemo(() => {
        const hourlyPatterns = getHourlyPatterns('Delhi');
        if (!hourlyPatterns || hourlyPatterns.length === 0) {
            return { hour: 3, displayTime: '03:00 AM', incidents: 705 };
        }
        const peak = hourlyPatterns.reduce((max, curr) => (curr.predictedRate || 0) > (max.predictedRate || 0) ? curr : max);
        const hour = peak.hour || 3;
        const displayTime = `${String(hour).padStart(2, '0')}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        const incidents = Math.round(peak.predictedRate || 705);
        return { hour, displayTime, incidents };
    }, [getHourlyPatterns]);
    // Calculate night crime rate
    const nightCrimeRate = useMemo(() => {
        const hourlyPatterns = getHourlyPatterns('Delhi');
        if (!hourlyPatterns || hourlyPatterns.length === 0) {
            return 70.6;
        }
        // Night: 0-6 hours (12 AM to 6 AM)
        const nightHours = hourlyPatterns.filter(p => p.hour >= 0 && p.hour < 6);
        const allHours = hourlyPatterns;
        const nightTotal = nightHours.reduce((sum, p) => sum + (p.predictedRate || 0), 0);
        const allTotal = allHours.reduce((sum, p) => sum + (p.predictedRate || 0), 0);
        return allTotal > 0 ? parseFloat(((nightTotal / allTotal) * 100).toFixed(1)) : 70.6;
    }, [getHourlyPatterns]);
    // Crime domain distribution
    const crimeDomainDist = useMemo(() => {
        return getDomainDistribution();
    }, [getDomainDistribution]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Temporal Crime Analytics" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "24-hour patterns, hourly trends, and domain-specific analysis" })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-xl bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/30 p-4", children: [_jsx(Clock, { className: "w-5 h-5 text-red-400 mb-2" }), _jsx("p", { className: "text-sm text-slate-400", children: "Peak Crime Hour" }), _jsx("p", { className: "text-2xl font-bold text-red-400", children: peakCrimeData.displayTime }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [peakCrimeData.incidents, " crimes (", ((peakCrimeData.incidents / 15840) * 100).toFixed(2), "%)"] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "rounded-xl bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-500/30 p-4", children: [_jsx(BarChart3, { className: "w-5 h-5 text-orange-400 mb-2" }), _jsx("p", { className: "text-sm text-slate-400", children: "Night Crime Rate" }), _jsxs("p", { className: "text-2xl font-bold text-orange-400", children: [nightCrimeRate, "%"] }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "12 AM - 6 AM (hours 0-6)" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 p-4", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-blue-400 mb-2" }), _jsx("p", { className: "text-sm text-slate-400", children: "Total Hourly Patterns" }), _jsx("p", { className: "text-2xl font-bold text-blue-400", children: "696" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "24 hours \u00D7 29 cities" })] })] }), _jsxs(Tabs, { defaultValue: "hourly", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 bg-slate-800 border border-slate-700", children: [_jsxs(TabsTrigger, { value: "hourly", className: "data-[state=active]:bg-cyan-600", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), "Hourly Patterns"] }), _jsxs(TabsTrigger, { value: "temporal", className: "data-[state=active]:bg-cyan-600", children: [_jsx(BarChart3, { className: "w-4 h-4 mr-2" }), "Temporal Analysis"] }), _jsxs(TabsTrigger, { value: "domains", className: "data-[state=active]:bg-cyan-600", children: [_jsx(TrendingUp, { className: "w-4 h-4 mr-2" }), "Domain Trends"] })] }), _jsx(TabsContent, { value: "hourly", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature3_HourlyPatterns, {}) }) }), _jsx(TabsContent, { value: "temporal", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature4_TemporalAnalysis, {}) }) }), _jsx(TabsContent, { value: "domains", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature5_CrimeDomainTrends, {}) }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Key Insights" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "text-cyan-400 font-bold", children: "\u2022" }), _jsx("div", { children: _jsx("p", { className: "text-slate-300", children: "Night time crimes (12 AM - 6 AM) account for 70.6% of all crimes" }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "text-cyan-400 font-bold", children: "\u2022" }), _jsx("div", { children: _jsx("p", { className: "text-slate-300", children: "Peak crime hour is 3:00 AM with 705 recorded incidents" }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "text-cyan-400 font-bold", children: "\u2022" }), _jsx("div", { children: _jsx("p", { className: "text-slate-300", children: "\"Other Crime\" category dominates with 57.14% of all incidents" }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "text-cyan-400 font-bold", children: "\u2022" }), _jsx("div", { children: _jsx("p", { className: "text-slate-300", children: "Violent crimes account for 28.57% requiring immediate intervention" }) })] })] })] })] }));
}
