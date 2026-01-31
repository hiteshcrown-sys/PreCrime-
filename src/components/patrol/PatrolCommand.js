import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, TrendingUp, Navigation, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/contexts/CityContext";
import { useAlerts } from "@/contexts/AlertContext";
import { livePatrolService } from "@/services/livePatrolService";
import { GOV_NAVY, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE, GOV_PRIMARY_BG } from "@/lib/designTokens";
import { useTranslate } from "@/hooks/useTranslate";
const staticZones = [
    { name: "Sector A", risk: 45, status: "covered" },
    { name: "Sector B", risk: 68, status: "patrol" },
    { name: "Sector C", risk: 52, status: "covered" },
    { name: "Sector D", risk: 38, status: "covered" }
];
export default function PatrolCommand() {
    const { t } = useTranslate();
    const { selectedCity } = useCity();
    const { criticalAlerts, markAsDispatched } = useAlerts();
    const [dispatching, setDispatching] = useState(null);
    const [units, setUnits] = useState([]);
    useEffect(() => {
        const updateUnits = () => {
            const liveUnits = livePatrolService.getCityPatrols(selectedCity);
            setUnits([...liveUnits]);
        };
        updateUnits();
        const interval = setInterval(updateUnits, 2000);
        return () => clearInterval(interval);
    }, [selectedCity]);
    const handleDispatch = (alertId) => {
        setDispatching(alertId);
        markAsDispatched(alertId);
        setTimeout(() => setDispatching(null), 1500);
    };
    const translateStatus = (status) => {
        if (status === "Responding")
            return t("responding");
        if (status === "En Route")
            return t("enRoute");
        if (status === "Standby")
            return t("standby");
        return status;
    };
    const getStatusColor = (status) => {
        if (status === "patrol")
            return "bg-blue-100 border-blue-200 text-blue-700";
        if (status === "covered")
            return "bg-green-100 border-green-200 text-green-700";
        if (status === "warning")
            return "bg-amber-100 border-amber-200 text-amber-800";
        return "bg-red-100 border-red-200 text-red-700";
    };
    const getStatusIcon = (status) => {
        if (status === "patrol")
            return "🚓";
        if (status === "covered")
            return "✓";
        if (status === "warning")
            return "⚠️";
        return "🚨";
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsxs("div", { className: "lg:col-span-3 space-y-4", children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2", children: [_jsx(Truck, { className: "w-4 h-4 text-gray-600" }), t("activeUnits")] }), units.length === 0 ? (_jsx("div", { className: "p-4 rounded-lg bg-white/95 border border-gray-200 border-dashed text-center", children: _jsx("p", { className: "text-xs text-gray-500", children: t("noActiveUnits").replace("{city}", selectedCity) }) })) : (units.map((unit, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "rounded-lg bg-white/95 border border-gray-200 p-4 hover:border-gray-300 transition-all border-l-4", style: { borderLeftColor: GOV_NAVY }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${unit.status === "Responding" ? "bg-red-100" : "bg-blue-100"}`, children: _jsx(Truck, { className: `w-4 h-4 ${unit.status === "Responding" ? "text-red-600" : "text-blue-600"}` }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900 text-xs", children: unit.name }), _jsxs("p", { className: "text-[10px] text-gray-500 font-mono", children: [unit.lat.toFixed(3), ", ", unit.lng.toFixed(3)] })] })] }), _jsx(Badge, { className: unit.status === "Responding" ? "bg-red-100 text-red-700 border-red-200" : unit.status === "En Route" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200", children: translateStatus(unit.status) })] }), _jsxs("div", { className: "space-y-1.5 text-[10px]", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 uppercase tracking-tighter", children: t("objective") }), _jsx("span", { className: "text-gray-900 font-medium truncate max-w-[120px]", children: unit.targetAlert ? unit.targetAlert.zone : (unit.targetHotspot ? unit.targetHotspot.name : t("sectorPatrol")) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500 uppercase tracking-tighter", children: t("velocity") }), _jsx("span", { className: "text-gray-900 font-bold", children: unit.status === "Responding" ? t("fast") : t("normal") })] })] })] }, unit.id))))] }), _jsxs("div", { className: "lg:col-span-9 space-y-6", children: [_jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 overflow-hidden", style: { borderTopWidth: 3, borderTopColor: GOV_ACCENT_ORANGE }, children: [_jsxs("div", { className: "p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 text-red-600" }), _jsx("h3", { className: "font-semibold text-gray-900", children: t("dispatchQueue") })] }), _jsx(Badge, { className: "bg-red-100 text-red-700 border-red-200", children: t("pendingAlerts").replace("{count}", criticalAlerts.length) })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: t("detection") }), _jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: t("zone") }), _jsx("th", { className: "text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: t("confidence") }), _jsx("th", { className: "text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: t("action") })] }) }), _jsx("tbody", { children: criticalAlerts.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: "4", className: "py-12 text-center text-gray-500 text-sm", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(CheckCircle, { className: "w-8 h-8 text-gray-400" }), _jsx("p", { children: t("allSectorsClear").replace("{selectedCity}", selectedCity) })] }) }) })) : (criticalAlerts.map((alert) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-red-600" }), _jsx("span", { className: "text-sm text-gray-900 font-medium", children: alert.type })] }) }), _jsx("td", { className: "py-4 px-4 text-sm text-gray-600", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3 h-3 text-gray-500" }), alert.zone] }) }), _jsxs("td", { className: "py-4 px-4 text-sm font-bold text-gray-900", children: [alert.confidence, "%"] }), _jsx("td", { className: "py-4 px-4 text-center", children: _jsx(Button, { size: "sm", onClick: () => handleDispatch(alert.id), disabled: dispatching === alert.id, className: "bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 px-6 text-xs", style: { background: dispatching === alert.id ? undefined : GOV_PRIMARY_BG }, children: dispatching === alert.id ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" }), t("dispatching")] })) : (t("dispatchUnit")) }) })] }, alert.id)))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 p-4 border-l-4", style: { borderLeftColor: GOV_ACCENT_GREEN }, children: [_jsxs("h4", { className: "text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-600" }), t("sectorStatusGrid")] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: staticZones.map((zone) => (_jsxs("div", { className: `p-3 rounded-lg border ${getStatusColor(zone.status)}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "text-xs font-bold text-gray-900 uppercase", children: zone.name.replace("Sector", t("sector")) }), _jsx("span", { className: "text-lg", children: getStatusIcon(zone.status) })] }), _jsx("div", { className: "w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2", children: _jsx("div", { className: "h-full bg-current opacity-60 rounded-full", style: { width: `${zone.risk}%` } }) })] }, zone.name))) })] }), _jsxs("div", { className: "rounded-lg bg-white/95 border border-gray-200 p-5 border-l-4", style: { borderLeftColor: GOV_NAVY }, children: [_jsxs("h4", { className: "text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-gray-600" }), t("coverageOptimizer")] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs mb-1", children: [_jsx("span", { className: "text-gray-500 uppercase font-semibold", children: t("currentCoverage") }), _jsx("span", { className: "text-gray-900 font-bold", children: "68%" })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-orange-500", style: { width: "68%" } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs mb-1", children: [_jsx("span", { className: "text-gray-500 uppercase font-semibold", children: t("optimizedTarget") }), _jsx("span", { className: "text-gray-900 font-bold", children: "94%" })] }), _jsx("div", { className: "w-full h-2 bg-gray-200 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: "94%" }, className: "h-full rounded-full bg-blue-600", style: { background: GOV_PRIMARY_BG } }) })] }), _jsxs(Button, { className: "w-full mt-4 text-white font-semibold text-[10px] py-5 px-1 leading-tight", style: { background: GOV_PRIMARY_BG }, children: [_jsx(Navigation, { className: "w-4 h-4 mr-2 flex-shrink-0" }), t("redeployUnits")] })] })] })] })] })] }));
}
