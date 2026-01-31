import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Shield, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPICard from "@/components/dashboard/KPICard";
import { useTranslate } from "@/hooks/useTranslate";
const interventions = [
    {
        id: 1,
        prediction: "Assault Pattern - Downtown Core",
        predictionTime: "2024-01-15 22:15",
        intervention: "Increased Foot Patrols",
        interventionTime: "2024-01-15 22:18",
        outcome: "prevented",
        confidence: 94,
        zone: "Downtown Core"
    },
    {
        id: 2,
        prediction: "Vehicle Theft Spike - Financial Hub",
        predictionTime: "2024-01-15 21:45",
        intervention: "Vehicle Checkpoint",
        interventionTime: "2024-01-15 21:52",
        outcome: "prevented",
        confidence: 87,
        zone: "Financial Hub"
    },
    {
        id: 3,
        prediction: "Break-in Cluster - Industrial District",
        predictionTime: "2024-01-15 20:30",
        intervention: "Surveillance Deployment",
        interventionTime: "2024-01-15 20:45",
        outcome: "occurred",
        confidence: 72,
        zone: "Industrial District"
    },
    {
        id: 4,
        prediction: "Robbery Alert - Harbor Area",
        predictionTime: "2024-01-15 19:15",
        intervention: "Undercover Officers",
        interventionTime: "2024-01-15 19:22",
        outcome: "prevented",
        confidence: 89,
        zone: "Harbor Area"
    },
    {
        id: 5,
        prediction: "Drug Activity - Old Town",
        predictionTime: "2024-01-15 18:00",
        intervention: "Community Liaison",
        interventionTime: "2024-01-15 18:15",
        outcome: "prevented",
        confidence: 76,
        zone: "Old Town"
    },
    {
        id: 6,
        prediction: "Vandalism Warning - Shopping District",
        predictionTime: "2024-01-15 17:30",
        intervention: "None (Low priority)",
        interventionTime: "-",
        outcome: "occurred",
        confidence: 58,
        zone: "Shopping District"
    },
    {
        id: 7,
        prediction: "Pickpocket Alert - Downtown Core",
        predictionTime: "2024-01-15 16:45",
        intervention: "Plainclothes Patrol",
        interventionTime: "2024-01-15 16:50",
        outcome: "prevented",
        confidence: 82,
        zone: "Downtown Core"
    },
    {
        id: 8,
        prediction: "Assault Pattern - Financial Hub",
        predictionTime: "2024-01-15 15:30",
        intervention: "Increased Visibility",
        interventionTime: "2024-01-15 15:35",
        outcome: "prevented",
        confidence: 91,
        zone: "Financial Hub"
    }
];
const stats = {
    totalPredictions: 156,
    prevented: 124,
    occurred: 32,
    successRate: 79.5,
    avgResponseTime: "7.2 min",
    modelImprovement: "+4.3%"
};
export default function InterventionTracker() {
    const [filter, setFilter] = useState("all");
    const { t } = useTranslate();
    const filteredInterventions = filter === "all"
        ? interventions
        : interventions.filter(i => i.outcome === filter);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-cyan-500/20", children: _jsx(Target, { className: "w-6 h-6 text-cyan-400" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: t('interventionTracker') }), _jsx("p", { className: "text-slate-400 text-sm", children: t('closedLoopLearning') })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(KPICard, { title: t('successRate'), value: `${stats.successRate}%`, subtitle: t('crimesPrevented'), icon: CheckCircle, accentColor: "green", trend: "up", trendValue: "+2.1% this week" }), _jsx(KPICard, { title: t('predictionsMade'), value: stats.totalPredictions, subtitle: t('last30Days'), icon: BarChart3, accentColor: "cyan" }), _jsx(KPICard, { title: t('avgResponseTime'), value: stats.avgResponseTime, subtitle: t('predictionToAction'), icon: Clock, accentColor: "purple", trend: "down", trendValue: "-1.5 min improvement" }), _jsx(KPICard, { title: t('modelAccuracy'), value: "94.2%", subtitle: t('outcomeVerification'), icon: TrendingUp, accentColor: "green", trend: "up", trendValue: stats.modelImprovement })] }), _jsxs("div", { className: "rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-slate-800", children: [_jsx("h3", { className: "font-semibold text-white", children: t('outcomeDistribution') }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: t('last30Days') })] }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { className: "relative w-40 h-40", children: [_jsxs("svg", { className: "w-full h-full transform -rotate-90", children: [_jsx("circle", { cx: "80", cy: "80", r: "60", fill: "none", stroke: "rgb(51, 65, 85)", strokeWidth: "20" }), _jsx(motion.circle, { cx: "80", cy: "80", r: "60", fill: "none", stroke: "#22c55e", strokeWidth: "20", strokeDasharray: `${2 * Math.PI * 60 * 0.795} ${2 * Math.PI * 60}`, initial: { strokeDashoffset: 2 * Math.PI * 60 }, animate: { strokeDashoffset: 0 }, transition: { duration: 1 } }), _jsx(motion.circle, { cx: "80", cy: "80", r: "60", fill: "none", stroke: "#ef4444", strokeWidth: "20", strokeDasharray: `${2 * Math.PI * 60 * 0.205} ${2 * Math.PI * 60}`, strokeDashoffset: -2 * Math.PI * 60 * 0.795, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 } })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-2xl font-bold text-white", children: stats.prevented }), _jsx("p", { className: "text-xs text-slate-400", children: t('prevented') })] }) })] }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-400" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: t('crimesPrevented') }), _jsx("p", { className: "text-xs text-slate-400", children: t('successfulInterventions') })] })] }), _jsx("p", { className: "text-2xl font-bold text-green-400", children: stats.prevented })] }), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(XCircle, { className: "w-5 h-5 text-red-400" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: t('crimesOccurred') }), _jsx("p", { className: "text-xs text-slate-400", children: t('despitePrediction') })] })] }), _jsx("p", { className: "text-2xl font-bold text-red-400", children: stats.occurred })] })] })] }) })] }), _jsxs("div", { className: "rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-slate-800 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white", children: t('interventionTimeline') }), _jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [t('predictionTime'), " \u2192 ", t('intervention'), " \u2192 ", t('outcome')] })] }), _jsx(Tabs, { value: filter, onValueChange: setFilter, children: _jsxs(TabsList, { className: "bg-slate-800/50 border border-slate-700", children: [_jsx(TabsTrigger, { value: "all", className: "data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs", children: t('all') }), _jsx(TabsTrigger, { value: "prevented", className: "data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-xs", children: t('prevented') }), _jsx(TabsTrigger, { value: "occurred", className: "data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-xs", children: t('occurred') })] }) })] }), _jsx("div", { className: "divide-y divide-slate-800/50", children: filteredInterventions.map((item, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "p-4 hover:bg-slate-800/30 transition-colors", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: `p-2 rounded-lg ${item.outcome === "prevented" ? "bg-green-500/20" : "bg-red-500/20"}`, children: item.outcome === "prevented"
                                            ? _jsx(CheckCircle, { className: "w-5 h-5 text-green-400" })
                                            : _jsx(XCircle, { className: "w-5 h-5 text-red-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: item.prediction }), _jsxs("div", { className: "flex items-center gap-4 mt-1 text-xs text-slate-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(AlertTriangle, { className: "w-3 h-3" }), item.predictionTime] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Shield, { className: "w-3 h-3" }), item.intervention] })] })] }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${item.outcome === "prevented"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"}`, children: item.outcome === "prevented" ? t('prevented') : t('occurred') })] }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-1 text-xs", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-orange-400" }), _jsx("span", { className: "text-slate-500", children: t('prediction') })] }), _jsx("div", { className: "flex-1 h-1 bg-slate-700 rounded relative", children: _jsx("div", { className: `absolute left-0 top-0 h-full rounded ${item.outcome === "prevented" ? "bg-green-500" : "bg-red-500"}`, style: { width: `${item.confidence}%` } }) }), _jsxs("div", { className: "flex items-center gap-1 text-xs", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${item.outcome === "prevented" ? "bg-green-400" : "bg-red-400"}` }), _jsx("span", { className: "text-slate-500", children: t('outcome') })] }), _jsxs("span", { className: "text-xs text-cyan-400 ml-2", children: [item.confidence, "% conf"] })] })] })] }) }, item.id))) })] })] }));
}
