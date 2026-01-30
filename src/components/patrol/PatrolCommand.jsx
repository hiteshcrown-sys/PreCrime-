import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, TrendingUp, Navigation, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCity } from "@/contexts/CityContext";
import { useAlerts } from "@/contexts/AlertContext";
import { livePatrolService } from "@/services/livePatrolService";

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

  // Sync with live units
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
    if (status === "patrol") return "bg-cyan-500/20 border-cyan-500 text-cyan-400";
    if (status === "covered") return "bg-green-500/20 border-green-500 text-green-400";
    if (status === "warning") return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
    return "bg-red-500/20 border-red-500 text-red-400";
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
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Active Units
        </h3>
        {units.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/30 border border-dashed border-slate-700 text-center">
            <p className="text-xs text-slate-500">No active units in {selectedCity}</p>
          </div>
        ) : (
          units.map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-slate-900/50 border border-slate-700 p-4 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unit.status === 'Responding' ? 'bg-red-500/20' : 'bg-cyan-500/20'}`}>
                    <Truck className={`w-4 h-4 ${unit.status === 'Responding' ? 'text-red-400' : 'text-cyan-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">{unit.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{unit.lat.toFixed(3)}, {unit.lng.toFixed(3)}</p>
                  </div>
                </div>
                <Badge className={unit.status === "Responding" ? "bg-red-500/20 text-red-400 border-red-500" : (unit.status === "En Route" ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-500/20 text-slate-400")}>
                  {unit.status}
                </Badge>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-tighter">Objective</span>
                  <span className="text-white font-medium truncate max-w-[120px]">
                    {unit.targetAlert ? unit.targetAlert.zone : (unit.targetHotspot ? unit.targetHotspot.name : 'Sector Patrol')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase tracking-tighter">Velocity</span>
                  <span className="text-cyan-400 font-bold">{unit.status === 'Responding' ? 'FAST' : 'NORMAL'}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Right Column - Dispatch Queue & Optimization */}
      <div className="lg:col-span-9 space-y-6">
        {/* dispatch Queue */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-white">Critical Dispatch Queue</h3>
            </div>
            <Badge className="bg-red-500/20 text-red-500 border-red-500">
              {criticalAlerts.length} PENDING
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30">
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detection</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zone</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidence</th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {criticalAlerts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-8 h-8 text-slate-700" />
                        <p>All sectors in {selectedCity} are clear.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  criticalAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-white font-medium">{alert.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {alert.zone}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-cyan-400">{alert.confidence}%</td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleDispatch(alert.id)}
                          disabled={dispatching === alert.id}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold h-8 px-6 text-xs shadow-lg shadow-red-600/20"
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

        {/* Coverage Grid & Optimizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Sector Status Grid
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {staticZones.map((zone) => (
                <div key={zone.name} className={`p-3 rounded-lg border ${getStatusColor(zone.status)}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-white uppercase">{zone.name}</span>
                    <span className="text-lg">{getStatusIcon(zone.status)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-current" style={{ width: `${zone.risk}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/20 p-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Coverage Optimizer
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500 uppercase font-bold">Current Coverage</span>
                  <span className="text-white">68%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-cyan-400 uppercase font-bold">Optimized Target</span>
                  <span className="text-cyan-400">94%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '94%' }}
                    className="h-full bg-cyan-500"
                  />
                </div>
              </div>
              <Button className="w-full mt-4 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 text-xs font-bold py-5">
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