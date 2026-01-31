import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, AlertTriangle, Zap, Navigation } from "lucide-react";
import { useCity } from "@/contexts/CityContext";
import { useTranslate } from "@/hooks/useTranslate";
import PatrolTrackerMap from "@/components/live/PatrolTrackerMap";
import { crimeDataService } from "@/api/crimeDataService";
export default function LiveCrimePulse() {
    const { t } = useTranslate();
    const { selectedCity } = useCity();
    const [events, setEvents] = useState([]);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [showRoutes, setShowRoutes] = useState(true);
    const [patrolStats, setPatrolStats] = useState({ active: 5, responding: 0, idle: 5 });
    useEffect(() => {
        // Connect to real-time events from crimeDataService
        const handleUpdate = (detail) => {
            if (detail.type === 'alert' || detail.type === 'hotspots') {
                const newEvent = {
                    id: Date.now(),
                    type: detail.message || "Risk Threshold Exceeded",
                    zone: detail.city || selectedCity,
                    risk: detail.riskRate || 75,
                    confidence: detail.confidence || 88,
                    timestamp: new Date()
                };
                setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
            }
        };
        window.addEventListener('crimeDataUpdate', (e) => handleUpdate(e.detail));
        // Listen for intelligence events (dispatches)
        const handleIntelligenceEvent = (e) => {
            const detail = e.detail;
            const newEvent = {
                id: `intel-${Date.now()}`,
                type: detail.message,
                zone: detail.unit ? `${detail.unit} Dispatched` : 'Command Center',
                risk: detail.severity === 'CRITICAL' ? 95 : 75,
                confidence: 100,
                timestamp: detail.timestamp || new Date(),
                isSystem: true
            };
            setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        };
        window.addEventListener('intelligenceEvent', handleIntelligenceEvent);
        // Initial fetch of hotspots to generate initial events if feed is empty
        const initFeed = async () => {
            try {
                const hotspotData = await crimeDataService.getHotspots(selectedCity);
                const hotspots = Array.isArray(hotspotData) ? hotspotData : (hotspotData?.hotspots || []);
                const initialEvents = hotspots.slice(0, 5).map((h, i) => ({
                    id: `init-${i}`,
                    type: `Higher density predicted in ${h.name}`,
                    zone: h.name,
                    risk: (h.riskLevel === 'CRITICAL' || h.priority === 'CRITICAL') ? 85 :
                        (h.riskLevel === 'HIGH' || h.priority === 'HIGH') ? 75 : 55,
                    confidence: 90 + Math.floor(Math.random() * 5),
                    timestamp: new Date()
                }));
                setEvents(initialEvents);
            }
            catch (err) {
                console.error("Feed init failed:", err);
            }
        };
        initFeed();
        return () => {
            window.removeEventListener('crimeDataUpdate', handleUpdate);
            window.removeEventListener('intelligenceEvent', handleIntelligenceEvent);
        };
    }, [selectedCity]);
    // Handle status updates from the map component
    const handleStatusChange = (counts) => {
        setPatrolStats({
            active: Object.values(counts).reduce((a, b) => a + b, 0),
            responding: counts['Responding'] || 0,
            enRoute: counts['En Route'] || 0,
            idle: counts['Idle'] || 0
        });
    };
    const getRiskLevel = (risk) => {
        if (risk >= 80)
            return "critical";
        if (risk >= 60)
            return "high";
        if (risk >= 40)
            return "medium";
        return "low";
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: t("livePatrolStatus") }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: t("realTimeCommand").replace("{city}", selectedCity) })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-white/95 border border-gray-200", children: [_jsx("span", { className: "text-xs text-gray-500 uppercase tracking-wider", children: t("routePrediction") }), _jsx("button", { onClick: () => setShowRoutes(!showRoutes), className: `w-10 h-5 rounded-full relative transition-colors ${showRoutes ? "bg-blue-600" : "bg-gray-300"}`, children: _jsx("div", { className: `absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showRoutes ? "left-6" : "left-1"}` }) })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-600 animate-pulse" }), _jsx("span", { className: "text-sm text-green-800 font-medium uppercase tracking-tighter", children: t("liveSensorFeed") })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-4 gap-6", children: [_jsx("div", { className: "xl:col-span-3", children: _jsx("div", { className: "h-[600px] relative", children: _jsx(PatrolTrackerMap, { city: selectedCity, showRoutes: showRoutes, onStatusChange: handleStatusChange }) }) }), _jsxs("div", { className: "xl:col-span-1 space-y-6", children: [_jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 p-5 space-y-4 shadow-sm", style: { borderTopWidth: 3, borderTopColor: "#000080" }, children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-700 mb-2", children: [_jsx(Navigation, { className: "w-4 h-4" }), _jsx("h3", { className: "font-semibold text-sm uppercase tracking-wider text-gray-900", children: t("unitReadiness") })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4", style: { borderLeftColor: "#dc2626" }, children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-1", children: t("responding") }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: patrolStats.responding })] }), _jsxs("div", { className: "p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4", style: { borderLeftColor: "#2563eb" }, children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-1", children: t("enRoute") }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: patrolStats.enRoute || 0 })] }), _jsxs("div", { className: "p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4", style: { borderLeftColor: "#6b7280" }, children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-1", children: t("standby") }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: patrolStats.idle })] }), _jsxs("div", { className: "p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4", style: { borderLeftColor: "#138808" }, children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wider mb-1", children: t("totalUnits") }), _jsx("p", { className: "text-xl font-bold text-gray-900", children: patrolStats.active })] })] })] }), _jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 overflow-hidden h-[340px] flex flex-col shadow-sm", style: { borderTopWidth: 3, borderTopColor: "#138808" }, children: [_jsxs("div", { className: "p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50", children: [_jsx("h3", { className: "font-semibold text-sm text-gray-900 uppercase tracking-wider", children: t("intelligenceStream") }), _jsx(Zap, { className: "w-4 h-4 text-amber-500 animate-pulse" })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: _jsx(AnimatePresence, { mode: "popLayout", children: events.map((event) => (_jsx(motion.div, { layout: true, initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, scale: 0.95 }, className: "p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${event.isSystem ? "bg-amber-100 text-amber-600" : (event.risk >= 80 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}`, children: event.isSystem ? _jsx(Zap, { className: "w-3 h-3" }) : _jsx(AlertTriangle, { className: "w-3 h-3" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-bold text-gray-900 text-xs truncate leading-tight uppercase tracking-tight", children: event.type }), _jsxs("p", { className: "text-xs text-gray-500 mt-1 flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3" }), event.zone] })] }), _jsx("span", { className: "text-xs text-gray-500 font-mono", children: new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) })] }) }, event.id))) }) })] })] })] }), _jsx("div", { className: "rounded-lg bg-white/95 border border-gray-200 p-4", style: { borderTopWidth: 3, borderTopColor: "#ea580c" }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: t("modelStatus") }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "NowCast v3.2.1" })] }), _jsx("div", { className: "h-8 w-px bg-gray-200" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: t("dataStreams") }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: t("activeStreams").replace("{count}", 12) })] }), _jsx("div", { className: "h-8 w-px bg-gray-200" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 uppercase", children: t("latency") }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: "142ms" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [t("nextRecalculation"), ":"] }), _jsx("span", { className: "text-sm font-mono text-gray-900", children: "00:12" })] })] }) })] }));
}
