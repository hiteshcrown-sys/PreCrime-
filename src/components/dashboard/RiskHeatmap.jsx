import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const zones = [
  { id: 1, name: "Downtown Core", x: 45, y: 35, risk: 87, alerts: 3 },
  { id: 2, name: "Industrial District", x: 25, y: 55, risk: 72, alerts: 2 },
  { id: 3, name: "Harbor Area", x: 70, y: 65, risk: 65, alerts: 1 },
  { id: 4, name: "University Quarter", x: 60, y: 25, risk: 34, alerts: 0 },
  { id: 5, name: "Residential North", x: 35, y: 20, risk: 28, alerts: 0 },
  { id: 6, name: "Tech Park", x: 75, y: 40, risk: 41, alerts: 1 },
  { id: 7, name: "Old Town", x: 50, y: 50, risk: 58, alerts: 1 },
  { id: 8, name: "Shopping District", x: 40, y: 70, risk: 52, alerts: 1 },
  { id: 9, name: "Financial Hub", x: 55, y: 45, risk: 79, alerts: 2 },
  { id: 10, name: "Suburban East", x: 85, y: 55, risk: 22, alerts: 0 }
];

const getRiskColor = (risk) => {
  if (risk >= 80) return { bg: "rgba(239, 68, 68, 0.6)", border: "#ef4444", glow: "0 0 30px rgba(239, 68, 68, 0.5)" };
  if (risk >= 60) return { bg: "rgba(249, 115, 22, 0.5)", border: "#f97316", glow: "0 0 25px rgba(249, 115, 22, 0.4)" };
  if (risk >= 40) return { bg: "rgba(234, 179, 8, 0.4)", border: "#eab308", glow: "0 0 20px rgba(234, 179, 8, 0.3)" };
  return { bg: "rgba(34, 197, 94, 0.3)", border: "#22c55e", glow: "0 0 15px rgba(34, 197, 94, 0.2)" };
};

export default function RiskHeatmap({ forecastMode = "current", onZoneSelect }) {
  const [activeZone, setActiveZone] = useState(null);
  const [animatedZones, setAnimatedZones] = useState(zones);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedZones(prev => prev.map(zone => ({
        ...zone,
        risk: Math.max(10, Math.min(95, zone.risk + (Math.random() - 0.5) * 8))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const displayZones = forecastMode === "current" ? animatedZones : 
    animatedZones.map(z => ({ ...z, risk: Math.min(95, z.risk + (forecastMode === "60" ? 15 : forecastMode === "30" ? 10 : 5)) }));

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-slate-900/80 border border-slate-700/50">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(100, 116, 139)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* City base map simulation */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
          <path d="M10,50 Q30,30 50,50 T90,50" fill="none" stroke="#475569" strokeWidth="0.5" />
          <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#475569" strokeWidth="0.3" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#475569" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Heat zones */}
      {displayZones.map((zone) => {
        const colors = getRiskColor(zone.risk);
        return (
          <motion.div
            key={zone.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            onClick={() => {
              setActiveZone(zone.id);
              onZoneSelect?.(zone);
            }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  width: `${40 + zone.risk * 0.5}px`,
                  height: `${40 + zone.risk * 0.5}px`,
                  background: colors.bg,
                  transform: "translate(-50%, -50%)",
                  left: "50%",
                  top: "50%"
                }}
              />
              
              {/* Core */}
              <div
                className="relative rounded-full flex items-center justify-center text-white font-bold text-xs border-2 backdrop-blur-sm"
                style={{
                  width: `${30 + zone.risk * 0.3}px`,
                  height: `${30 + zone.risk * 0.3}px`,
                  background: colors.bg,
                  borderColor: colors.border,
                  boxShadow: colors.glow
                }}
              >
                {Math.round(zone.risk)}
              </div>

              {/* Alert indicator */}
              {zone.alerts > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                  {zone.alerts}
                </div>
              )}
            </motion.div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                <p className="font-semibold text-white">{zone.name}</p>
                <p className="text-slate-400">Risk: {Math.round(zone.risk)}%</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Risk Level</p>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Low</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Critical</span>
        </div>
      </div>

      {/* Forecast indicator */}
      <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-500/30">
        <p className="text-[10px] uppercase tracking-wider text-cyan-400">
          {forecastMode === "current" ? "Live Data" : `${forecastMode} Min Forecast`}
        </p>
      </div>
    </div>
  );
}
 