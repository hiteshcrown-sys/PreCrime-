import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, MapPin, AlertTriangle, Activity, RefreshCw, Zap, Shield, Navigation } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import { useCity } from "@/contexts/CityContext";
import PatrolTrackerMap from "@/components/live/PatrolTrackerMap";
import { livePatrolService } from "@/services/livePatrolService";
import { crimeDataService } from "@/api/crimeDataService";

export default function LiveCrimePulse() {
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
      } catch (err) {
        console.error("Feed init failed:", err);
      }
    };

    initFeed();

    return () => window.removeEventListener('crimeDataUpdate', handleUpdate);
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
            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
              <Shield className="w-6 h-6" />
            </div>
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Patrol Tracker & Operational Pulse</h1>
            <p className="text-slate-400 text-sm">Real-time command & control for {selectedCity}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Route Prediction</span>
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`w-10 h-5 rounded-full relative transition-colors ${showRoutes ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showRoutes ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 uppercase tracking-tighter">Live Sensor Feed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Real-time Patrol Map */}
        <div className="xl:col-span-3">
          <div className="h-[600px] relative">
            <PatrolTrackerMap
              city={selectedCity}
              showRoutes={showRoutes}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>

        {/* Operational Analytics & Feed */}
        <div className="xl:col-span-1 space-y-6">
          {/* Patrol Stats Card */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Navigation className="w-4 h-4" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Unit Readiness</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase">Responding</p>
                <p className="text-xl font-bold text-red-400">{patrolStats.responding}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase">En Route</p>
                <p className="text-xl font-bold text-cyan-400">{patrolStats.enRoute || 0}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase">Standby</p>
                <p className="text-xl font-bold text-slate-400">{patrolStats.idle}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase">Total Units</p>
                <p className="text-xl font-bold text-white">{patrolStats.active}</p>
              </div>
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden h-[340px] flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Intelligence Stream</h3>
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 group hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${event.risk >= 80 ? "bg-red-500/20 text-red-500" : "bg-cyan-500/20 text-cyan-500"
                        }`}>
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-[11px] truncate leading-tight uppercase tracking-tight">{event.type}</p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-2 h-2" />
                          {event.zone}
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
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