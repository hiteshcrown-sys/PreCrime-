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
      } catch (err) {
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
    if (risk >= 80) return "critical";
    if (risk >= 60) return "high";
    if (risk >= 40) return "medium";
    return "low";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t("livePatrolStatus")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("realTimeCommand").replace("{city}", selectedCity)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/95 border border-gray-200">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{t("routePrediction")}</span>
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`w-10 h-5 rounded-full relative transition-colors ${showRoutes ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showRoutes ? "left-6" : "left-1"}`} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-sm text-green-800 font-medium uppercase tracking-tighter">{t("liveSensorFeed")}</span>
          </div >
        </div >
      </div >

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
          {/* Patrol Stats Card – same style as Crime Pattern Analysis */}
          <div className="rounded-lg bg-white/95 border border-gray-200 p-5 space-y-4 shadow-sm" style={{ borderTopWidth: 3, borderTopColor: "#000080" }}>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Navigation className="w-4 h-4" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-900">{t("unitReadiness")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4" style={{ borderLeftColor: "#dc2626" }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("responding")}</p>
                <p className="text-xl font-bold text-gray-900">{patrolStats.responding}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4" style={{ borderLeftColor: "#2563eb" }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("enRoute")}</p>
                <p className="text-xl font-bold text-gray-900">{patrolStats.enRoute || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4" style={{ borderLeftColor: "#6b7280" }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("standby")}</p>
                <p className="text-xl font-bold text-gray-900">{patrolStats.idle}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 border-l-4" style={{ borderLeftColor: "#138808" }}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t("totalUnits")}</p>
                <p className="text-xl font-bold text-gray-900">{patrolStats.active}</p>
              </div>
            </div>
          </div>

          {/* Real-time Activity Feed – same card style */}
          <div className="rounded-lg bg-white/95 border border-gray-200 overflow-hidden h-[340px] flex flex-col shadow-sm" style={{ borderTopWidth: 3, borderTopColor: "#138808" }}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wider">{t("intelligenceStream")}</h3>
              <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${event.isSystem ? "bg-amber-100 text-amber-600" : (event.risk >= 80 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}`}>
                        {event.isSystem ? <Zap className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate leading-tight uppercase tracking-tight">{event.type}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.zone}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Model Status Bar – same card style */}
      <div className="rounded-lg bg-white/95 border border-gray-200 p-4" style={{ borderTopWidth: 3, borderTopColor: "#ea580c" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">{t("modelStatus")}</p>
              <p className="text-sm font-medium text-gray-900">NowCast v3.2.1</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-gray-500 uppercase">{t("dataStreams")}</p>
              <p className="text-sm font-medium text-gray-900">{t("activeStreams").replace("{count}", 12)}</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xs text-gray-500 uppercase">{t("latency")}</p>
              <p className="text-sm font-medium text-gray-900">142ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{t("nextRecalculation")}:</span>
            <span className="text-sm font-mono text-gray-900">00:12</span>
          </div>
        </div>
      </div>
    </div >
  );
}