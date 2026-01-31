import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function PatternCluster({ patterns = [], connections = [], onPatternSelect, selectedPattern }) {
    const getPatternPos = (id) => {
        const p = patterns.find(p => p.id === id);
        return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
    };
    return (_jsxs("div", { className: "relative w-full h-full min-h-[400px] rounded-xl bg-slate-900/80 border border-slate-700/50 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-10", children: _jsxs("svg", { width: "100%", height: "100%", children: [_jsx("defs", { children: _jsx("pattern", { id: "dna-grid", width: "30", height: "30", patternUnits: "userSpaceOnUse", children: _jsx("circle", { cx: "15", cy: "15", r: "1", fill: "rgb(100, 116, 139)" }) }) }), _jsx("rect", { width: "100%", height: "100%", fill: "url(#dna-grid)" })] }) }), _jsx("svg", { className: "absolute inset-0 w-full h-full", children: connections.map((conn, i) => {
                    const from = getPatternPos(conn.from);
                    const to = getPatternPos(conn.to);
                    return (_jsx(motion.line, { x1: `${from.x}%`, y1: `${from.y}%`, x2: `${to.x}%`, y2: `${to.y}%`, stroke: "rgb(34, 211, 238)", strokeWidth: conn.strength * 2, strokeOpacity: conn.strength * 0.4, strokeDasharray: "4,4", initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.5, delay: i * 0.2 } }, i));
                }) }), patterns.map((pattern, index) => (_jsxs(motion.div, { className: "absolute cursor-pointer group", style: {
                    left: `${pattern.x}%`,
                    top: `${pattern.y}%`,
                    transform: "translate(-50%, -50%)"
                }, initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: index * 0.1, type: "spring" }, whileHover: { scale: 1.15 }, onClick: () => onPatternSelect?.(pattern), children: [_jsx(motion.div, { className: "absolute inset-0 rounded-full blur-md", style: {
                            width: pattern.size + 20,
                            height: pattern.size + 20,
                            background: pattern.color,
                            opacity: selectedPattern?.id === pattern.id ? 0.4 : 0.2,
                            transform: "translate(-50%, -50%)",
                            left: "50%",
                            top: "50%"
                        }, animate: { scale: [1, 1.2, 1] }, transition: { duration: 3, repeat: Infinity } }), _jsx("div", { className: "relative rounded-full flex items-center justify-center text-white font-bold text-xs border-2 backdrop-blur-sm transition-all", style: {
                            width: pattern.size,
                            height: pattern.size,
                            background: `${pattern.color}33`,
                            borderColor: selectedPattern?.id === pattern.id ? "#fff" : pattern.color,
                            boxShadow: selectedPattern?.id === pattern.id
                                ? `0 0 20px ${pattern.color}, 0 0 40px ${pattern.color}40`
                                : `0 0 10px ${pattern.color}40`
                        }, children: _jsxs("span", { className: "text-[10px]", children: [pattern.similarity, "%"] }) }), _jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap", children: _jsxs("div", { className: "bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-[10px]", children: [_jsx("p", { className: "text-white font-medium", children: pattern.id }), _jsx("p", { className: "text-slate-400", children: pattern.type })] }) })] }, pattern.id))), _jsxs("div", { className: "absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700", children: [_jsx("p", { className: "text-[10px] uppercase tracking-wider text-slate-400 mb-2", children: "Pattern Types" }), _jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]", children: patterns.slice(0, 4).map(p => (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: p.color } }), p.type] }, p.id))) })] })] }));
}
