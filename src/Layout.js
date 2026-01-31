import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { GOV_SAFFRON, GOV_NAVY, GOV_PRIMARY_BG } from "@/lib/designTokens";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages, Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useAlerts } from "@/contexts/AlertContext";
const NCIS_NAV_ITEMS = [
    { key: "navIntelligenceDashboard", path: "/", page: "MainDashboard" },
    { key: "navCrimePatternAnalysis", path: null, page: "NCISDashboard" },
    { key: "navPreventionStrategies", path: null, page: "PreventionPlaybooks" },
    { key: "navScenarioPlanning", path: null, page: "WhatIfSimulator" },
    { key: "navReports", path: null, page: "FullAnalytics" },
    { key: "navIoT", path: null, page: "IoTNetwork" },
    { key: "navLivePatrolStatus", path: null, page: "LiveCrimePulse" },
];
function getNavHref(item) {
    if (item.path)
        return item.path;
    return item.page === "MainDashboard" ? "/" : (item.page === "NCISDashboard" ? "/NCISDashboard" : createPageUrl(item.page));
}
function isNavActive(item, pathname) {
    if (item.page === "MainDashboard")
        return pathname === "/";
    if (item.page === "NCISDashboard")
        return pathname === "/NCISDashboard";
    return pathname === createPageUrl(item.page);
}
export default function Layout({ children }) {
    const { t } = useTranslate();
    const { language, setLanguage } = useLanguage();
    const location = useLocation();
    const pathname = location.pathname;
    return (_jsxs("div", { className: "min-h-screen text-gray-900 flex flex-col", style: {
            backgroundImage: "url(/ncis-tricolour-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
        }, children: [_jsxs("div", { className: "flex-shrink-0 h-9 flex items-center justify-center gap-4 text-white text-sm font-bold tracking-wide", style: { background: GOV_SAFFRON }, children: [_jsx("span", { children: t("govOfIndia") }), _jsx("span", { className: "opacity-90", children: t("bharatSarkar") })] }), _jsxs("header", { className: "flex-shrink-0 flex items-center gap-6 h-16 px-6 bg-white/95 border-b shadow-sm border-gray-200", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 flex-shrink-0", children: [_jsx("div", { className: "w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white flex items-center justify-center", style: { border: `2px solid ${GOV_NAVY}` }, children: _jsx("img", { src: "/ncis-logo.png", alt: t("nationalCrimeIntelligence"), className: "w-full h-full object-contain" }) }), _jsxs("div", { className: "hidden sm:block min-w-0", children: [_jsx("h1", { className: "text-lg font-bold text-gray-900 truncate", children: t('appTitle') }), _jsx("p", { className: "text-sm font-semibold text-gray-600 truncate", children: t("nationalCrimeIntelligence") })] })] }), _jsx("nav", { className: "flex-1 flex items-center gap-0 overflow-x-auto scrollbar-hide", children: NCIS_NAV_ITEMS.map((item) => {
                            const active = isNavActive(item, pathname);
                            const href = getNavHref(item);
                            return (_jsx(Link, { to: href, className: cn("flex-shrink-0 px-3 py-4 text-sm font-bold transition-colors border-b-2 -mb-px", active
                                    ? "text-gray-900 border-current"
                                    : "text-gray-600 hover:text-gray-900 border-transparent"), style: active
                                    ? { borderBottomColor: GOV_PRIMARY_BG, color: GOV_NAVY }
                                    : {}, children: t(item.key) }, item.page));
                        }) }), _jsxs("div", { className: "flex items-center gap-4 ml-4", children: [_jsx(NotificationBell, {}), _jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50", children: [_jsx(Languages, { className: "w-4 h-4 text-gray-500" }), _jsxs(Select, { value: language, onValueChange: setLanguage, children: [_jsx(SelectTrigger, { className: "w-[110px] h-7 bg-transparent border-none text-gray-700 focus:ring-0 p-0 text-sm font-bold", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { className: "bg-white border-gray-200 text-gray-700 font-bold", children: [_jsx(SelectItem, { value: "en", children: "\uD83C\uDDEC\uD83C\uDDE7 English" }), _jsx(SelectItem, { value: "hi", children: "\uD83C\uDDEE\uD83C\uDDF3 \u0939\u093F\u0902\u0926\u0940" }), _jsx(SelectItem, { value: "mr", children: "\uD83C\uDDEE\uD83C\uDDF3 \u092E\u0930\u093E\u0920\u0940" })] })] })] })] })] }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: children }), _jsx("footer", { className: "flex-shrink-0 border-t border-gray-200 bg-white/90", children: _jsxs("div", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: [_jsx("p", { children: t("officialPortalNotice") }), _jsx("p", { className: "mt-1", children: t("ministryNotice") })] }) })] }));
}
function NotificationBell() {
    const { criticalAlerts } = useAlerts();
    const hasCritical = criticalAlerts.length > 0;
    const scrollToDispatch = () => {
        const element = document.getElementById('patrol-command-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        else {
            console.log("Patrol section not found on this page");
        }
    };
    return (_jsx("div", { className: "relative", children: _jsxs("button", { onClick: scrollToDispatch, className: "relative p-2 rounded-lg hover:bg-gray-100 transition-colors", children: [_jsx(Bell, { className: cn("w-5 h-5 transition-all text-gray-400 hover:text-gray-900", hasCritical && "text-red-500 animate-pulse") }), hasCritical && (_jsxs("span", { className: "absolute top-1 right-1 flex h-4 w-4", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold items-center justify-center text-white", children: criticalAlerts.length })] }))] }) }));
}
