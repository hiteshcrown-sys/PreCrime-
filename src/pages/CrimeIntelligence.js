import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimeMap from '@/components/dashboard/RealTimeMap';
import Feature1_CrimePrediction from '@/features/Feature1_CrimePrediction';
import Feature2_CityRanking from '@/features/Feature2_CityRanking';
import Feature6_RiskClassification from '@/features/Feature6_RiskClassification';
/**
 * Crime Intelligence Dashboard
 * Integrated view combining:
 * - Real-time map with 29 cities and 159 hotspots
 * - Crime prediction
 * - City ranking by crime rate
 * - Risk classification system
 */
export default function CrimeIntelligence() {
    const [selectedCity, setSelectedCity] = useState(null);
    const [refreshRate, setRefreshRate] = useState(5000); // 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Trigger real-time data refresh
            window.dispatchEvent(new CustomEvent('crimeDataRefresh'));
        }, refreshRate);
        return () => clearInterval(interval);
    }, [refreshRate]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Crime Intelligence Hub" }), _jsx("p", { className: "text-slate-400 text-sm mt-1", children: "Real-time crime analytics with predictive insights" })] }), _jsx("div", { className: "flex gap-3", children: _jsxs("select", { value: refreshRate, onChange: (e) => setRefreshRate(Number(e.target.value)), className: "px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm", children: [_jsx("option", { value: 3000, children: "Real-time (3s)" }), _jsx("option", { value: 5000, children: "5s Update" }), _jsx("option", { value: 10000, children: "10s Update" }), _jsx("option", { value: 30000, children: "30s Update" })] }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg bg-cyan-500/20", children: _jsx(MapPin, { className: "w-5 h-5 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-white", children: "Interactive Crime Map" }), _jsx("p", { className: "text-xs text-slate-400", children: "29 cities \u2022 159 hotspots \u2022 Real-time updates" })] })] }), _jsx("div", { className: "h-[500px]", children: _jsx(RealTimeMap, { showHotspots: true, showCities: true, selectedCity: selectedCity, onCitySelect: setSelectedCity }) })] }) }), _jsxs(Tabs, { defaultValue: "prediction", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 bg-slate-800 border border-slate-700", children: [_jsxs(TabsTrigger, { value: "prediction", className: "data-[state=active]:bg-cyan-600", children: [_jsx(TrendingUp, { className: "w-4 h-4 mr-2" }), "Prediction"] }), _jsxs(TabsTrigger, { value: "ranking", className: "data-[state=active]:bg-cyan-600", children: [_jsx(BarChart3, { className: "w-4 h-4 mr-2" }), "City Ranking"] }), _jsxs(TabsTrigger, { value: "risk", className: "data-[state=active]:bg-cyan-600", children: [_jsx(AlertTriangle, { className: "w-4 h-4 mr-2" }), "Risk Level"] })] }), _jsx(TabsContent, { value: "prediction", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature1_CrimePrediction, {}) }) }), _jsx(TabsContent, { value: "ranking", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature2_CityRanking, {}) }) }), _jsx(TabsContent, { value: "risk", className: "mt-6", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6", children: _jsx(Feature6_RiskClassification, {}) }) })] })] }));
}
