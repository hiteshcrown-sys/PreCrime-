import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, MapPin, AlertTriangle, Activity, RefreshCw, Zap } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";

const eventTypes = [
  "Suspicious Activity Reported",
  "Vehicle Theft Alert",
  "Assault Pattern Detected",
  "Break-in Cluster Forming",
  "Vandalism Report",
  "Robbery Alert",
  "Drug Activity Spike",
  "Pickpocket Warning"
];

const zones = ["Downtown Core", "Financial Hub", "Industrial District", "Harbor Area", "Old Town", "Shopping District"];

const generateEvent = (id) => ({
  id,
  type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
  zone: zones[Math.floor(Math.random() * zones.length)],
  risk: Math.floor(Math.random() * 50) + 40,
  confidence: Math.floor(Math.random() * 20) + 75,
  timestamp: new Date()
});

export default function LiveCrimePulse() {
  const [events, setEvents] = useState([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [zoneRisks, setZoneRisks] = useState({
    "Downtown Core": 87,
    "Financial Hub": 79,
    "Industrial District": 72,
    "Harbor Area": 65,
    "Old Town": 58,
    "Shopping District": 52
  });

  useEffect(() => {
    // Initial events
    setEvents([
      generateEvent(1),
      generateEvent(2),
      generateEvent(3)
    ]);

    // Add new events periodically
    const eventInterval = setInterval(() => {
      setEvents(prev => {
        const newEvent = generateEvent(Date.now());
        return [newEvent, ...prev.slice(0, 9)];
      });
    }, 5000);

    // Simulate model recalculation
    const recalcInterval = setInterval(() => {
      setIsRecalculating(true);
      setTimeout(() => {
        setZoneRisks(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(zone => {
            updated[zone] = Math.max(20, Math.min(95, updated[zone] + (Math.random() - 0.5) * 10));
          });
          return updated;
        });
        setIsRecalculating(false);
      }, 2000);
    }, 15000);

    return () => {
      clearInterval(eventInterval);
      clearInterval(recalcInterval);
    };
  }, []);

  const getRiskLevel = (risk) => {
    if (risk >= 80) return "critical";
    if (risk >= 60) return "high";
    if (risk >= 40) return "medium";
    return "low";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Radio className="w-6 h-6 text-red-400" />
            </div>
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Live Crime Pulse</h1>
            <p className="text-slate-400 text-sm">Real-time intelligence feed</p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center gap-4">
          {isRecalculating ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <span className="text-sm text-yellow-400">Model Recalculating...</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400">Live Feed Active</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Map with animated zones */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden h-[500px]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-white">Animated Risk Map</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Activity className="w-4 h-4" />
                <span>Updates every 5 seconds</span>
              </div>
            </div>
            
            <div className="relative h-[calc(100%-60px)] p-4">
              {/* Grid background */}
              <div className="absolute inset-4 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="pulse-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(100, 116, 139)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#pulse-grid)" />
                </svg>
              </div>

              {/* Zone markers */}
              {Object.entries(zoneRisks).map(([zone, risk], index) => {
                const positions = [
                  { x: 45, y: 35 }, { x: 55, y: 45 }, { x: 25, y: 55 },
                  { x: 70, y: 65 }, { x: 50, y: 50 }, { x: 40, y: 70 }
                ];
                const pos = positions[index];
                const riskLevel = getRiskLevel(risk);
                const colors = {
                  critical: { bg: "rgba(239, 68, 68, 0.5)", border: "#ef4444" },
                  high: { bg: "rgba(249, 115, 22, 0.4)", border: "#f97316" },
                  medium: { bg: "rgba(234, 179, 8, 0.3)", border: "#eab308" },
                  low: { bg: "rgba(34, 197, 94, 0.3)", border: "#22c55e" }
                };

                return (
                  <motion.div
                    key={zone}
                    className="absolute"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                    animate={isRecalculating ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{
                          width: 60,
                          height: 60,
                          background: colors[riskLevel].bg,
                          transform: "translate(-50%, -50%)",
                          left: "50%",
                          top: "50%"
                        }}
                      />
                      <div
                        className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2"
                        style={{
                          background: colors[riskLevel].bg,
                          borderColor: colors[riskLevel].border
                        }}
                      >
                        {Math.round(risk)}
                      </div>
                    </motion.div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                      <span className="text-xs text-slate-400">{zone}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-white">Activity Feed</h3>
              <div className="flex items-center gap-1 text-xs">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">{events.length} events</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        event.risk >= 70 ? "bg-red-500/20" : 
                        event.risk >= 50 ? "bg-orange-500/20" : "bg-yellow-500/20"
                      }`}>
                        <AlertTriangle className={`w-3 h-3 ${
                          event.risk >= 70 ? "text-red-400" : 
                          event.risk >= 50 ? "text-orange-400" : "text-yellow-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{event.type}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.zone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <RiskBadge level={getRiskLevel(event.risk)} size="sm" />
                          <span className="text-xs text-cyan-400">{event.confidence}% conf</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Model Status Bar */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase">Model Status</p>
              <p className="text-sm font-medium text-white">NowCast v3.2.1</p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <p className="text-xs text-slate-500 uppercase">Data Streams</p>
              <p className="text-sm font-medium text-green-400">12 Active</p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <p className="text-xs text-slate-500 uppercase">Latency</p>
              <p className="text-sm font-medium text-cyan-400">142ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Next recalculation in:</span>
            <span className="text-sm font-mono text-white">00:12</span>
          </div>
        </div>
      </div>
    </div>
  );
}