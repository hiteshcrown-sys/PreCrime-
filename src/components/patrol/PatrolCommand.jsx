import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, TrendingUp, Navigation, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/contexts/CityContext";
import { useAlerts } from "@/contexts/AlertContext";
import { livePatrolService } from "@/services/livePatrolService";
import { GOV_NAVY, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE, GOV_PRIMARY_BG } from "@/lib/designTokens";

const staticZones = [
  { name: "Sector A", risk: 45, status: "covered" },
  { name: "Sector B", risk: 68, status: "patrol" },
  { name: "Sector C", risk: 52, status: "covered" },
  { name: "Sector D", risk: 38, status: "covered" }
];

export default function PatrolCommand() {
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

  const getStatusColor = (status) => {
    if (status === "patrol") return "bg-blue-100 border-blue-200 text-blue-700";
    if (status === "covered") return "bg-green-100 border-green-200 text-green-700";
    if (status === "warning") return "bg-amber-100 border-amber-200 text-amber-800";
    return "bg-red-100 border-red-200 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status === "patrol") return "🚓";
    if (status === "covered") return "✓";
    if (status === "warning") return "⚠️";
    return "🚨";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Active Units */}
      <div className="lg:col-span-3 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-600" />
          Active Units
        </h3>
        {units.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/95 border border-gray-200 border-dashed text-center">
            <p className="text-xs text-gray-500">No active units in {selectedCity}</p>
          </div>
        ) : (
          units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg bg-white/95 border border-gray-200 p-4 hover:border-gray-300 transition-all border-l-4"
              style={{ borderLeftColor: GOV_NAVY }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unit.status === "Responding" ? "bg-red-100" : "bg-blue-100"}`}>
                    <Truck className={`w-4 h-4 ${unit.status === "Responding" ? "text-red-600" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{unit.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{unit.lat.toFixed(3)}, {unit.lng.toFixed(3)}</p>
                  </div>
                </div>
                <Badge className={unit.status === "Responding" ? "bg-red-100 text-red-700 border-red-200" : unit.status === "En Route" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                  {unit.status}
                </Badge>
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-tighter">Objective</span>
                  <span className="text-gray-900 font-medium truncate max-w-[120px]">
                    {unit.targetAlert ? unit.targetAlert.zone : (unit.targetHotspot ? unit.targetHotspot.name : "Sector Patrol")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase tracking-tighter">Velocity</span>
                  <span className="text-gray-900 font-bold">{unit.status === "Responding" ? "FAST" : "NORMAL"}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Right Column - Dispatch Queue & Optimization */}
      <div className="lg:col-span-9 space-y-6">
        <div className="rounded-lg bg-white/95 border border-gray-200 overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: GOV_ACCENT_ORANGE }}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              <h3 className="font-semibold text-gray-900">Critical Dispatch Queue</h3>
            </div>
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {criticalAlerts.length} PENDING
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detection</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {criticalAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-gray-400" />
                        <p>All sectors in {selectedCity} are clear.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  criticalAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-900 font-medium">{alert.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          {alert.zone}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">{alert.confidence}%</td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleDispatch(alert.id)}
                          disabled={dispatching === alert.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 px-6 text-xs"
                          style={{ background: dispatching === alert.id ? undefined : GOV_PRIMARY_BG }}
                        >
                          {dispatching === alert.id ? (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              DISPATCHING...
                            </div>
                          ) : (
                            "DISPATCH UNIT"
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-white/95 border border-gray-200 p-4 border-l-4" style={{ borderLeftColor: GOV_ACCENT_GREEN }}>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              Sector Status Grid
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {staticZones.map((zone) => (
                <div key={zone.name} className={`p-3 rounded-lg border ${getStatusColor(zone.status)}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-900 uppercase">{zone.name}</span>
                    <span className="text-lg">{getStatusIcon(zone.status)}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-current opacity-60 rounded-full" style={{ width: `${zone.risk}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/95 border border-gray-200 p-5 border-l-4" style={{ borderLeftColor: GOV_NAVY }}>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              Coverage Optimizer
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 uppercase font-semibold">Current Coverage</span>
                  <span className="text-gray-900 font-bold">68%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: "68%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 uppercase font-semibold">Optimized Target</span>
                  <span className="text-gray-900 font-bold">94%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full rounded-full bg-blue-600" style={{ background: GOV_PRIMARY_BG }} />
                </div>
              </div>
              <Button className="w-full mt-4 text-white font-semibold text-xs py-5" style={{ background: GOV_PRIMARY_BG }}>
                <Navigation className="w-4 h-4 mr-2" />
                REDEPLOY UNITS FOR MAX COVERAGE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
