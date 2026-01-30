import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, TrendingUp, Navigation, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const patrolUnits = [
  { id: 1, status: "Active", zone: "Delhi Central", risk: 87, lat: 28.6139, lng: 77.2090, covered: 3, distance: 45, prevented: 8 },
  { id: 2, status: "Active", zone: "Mumbai West", risk: 79, lat: 19.0760, lng: 72.8777, covered: 4, distance: 52, prevented: 12 },
  { id: 3, status: "Idle", zone: "Bangalore South", risk: 65, lat: 12.9716, lng: 77.5946, covered: 2, distance: 38, prevented: 6 },
  { id: 4, status: "Active", zone: "Kolkata East", risk: 72, lat: 22.5726, lng: 88.3639, covered: 3, distance: 41, prevented: 9 },
  { id: 5, status: "Active", zone: "Chennai North", risk: 58, lat: 13.0827, lng: 80.2707, covered: 2, distance: 36, prevented: 5 }
];

const aiRecommendations = [
  { priority: "High", action: "Unit 2: East → West-5", impact: "-45% risk", eta: "12 min", from: "East-3", to: "West-5" },
  { priority: "High", action: "Unit 1: North → Central-8", impact: "-38% risk", eta: "8 min", from: "North-2", to: "Central-8" },
  { priority: "Medium", action: "Unit 4: South → West-2", impact: "-25% risk", eta: "15 min", from: "South-1", to: "West-2" },
  { priority: "Low", action: "Unit 3: Hold position", impact: "+5% coverage", eta: "-", from: "", to: "" }
];

const zones = [
  { name: "North-1", risk: 45, status: "covered" },
  { name: "North-2", risk: 68, status: "patrol" },
  { name: "North-3", risk: 52, status: "covered" },
  { name: "North-4", risk: 38, status: "covered" },
  { name: "Central-1", risk: 72, status: "patrol" },
  { name: "Central-2", risk: 55, status: "covered" },
  { name: "Central-3", risk: 61, status: "warning" },
  { name: "Central-4", risk: 48, status: "covered" },
  { name: "South-1", risk: 82, status: "gap" },
  { name: "South-2", risk: 69, status: "patrol" },
  { name: "South-3", risk: 58, status: "covered" },
  { name: "South-4", risk: 44, status: "covered" }
];

export default function PatrolCommand() {
  const [dispatching, setDispatching] = useState(null);

  const handleDispatch = (index) => {
    setDispatching(index);
    setTimeout(() => setDispatching(null), 2000);
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
      {/* Left Column - Patrol Units */}
      <div className="lg:col-span-3 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Active Units
        </h3>
        {patrolUnits.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl bg-slate-900/50 border border-slate-700 p-4 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Unit {unit.id}</p>
                  <p className="text-xs text-slate-500">{unit.lat.toFixed(4)}, {unit.lng.toFixed(4)}</p>
                </div>
              </div>
              <Badge className={unit.status === "Active" ? "bg-green-500/20 text-green-400 border-green-500" : "bg-slate-500/20 text-slate-400"}>
                {unit.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Zone</span>
                <span className="text-white font-medium">{unit.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zone Risk</span>
                <span className={`font-bold ${unit.risk >= 70 ? "text-red-400" : "text-orange-400"}`}>
                  {unit.risk}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zones Covered</span>
                <span className="text-cyan-400">{unit.covered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance Today</span>
                <span className="text-slate-300">{unit.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prevented</span>
                <span className="text-green-400">{unit.prevented}</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full mt-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30"
            >
              Send to High-Risk
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Center Column - AI Recommendations & Coverage Grid */}
      <div className="lg:col-span-6 space-y-6">
        {/* AI Recommendations */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white">AI Dispatch Recommendations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Priority</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Impact</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">ETA</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {aiRecommendations.map((rec, index) => (
                  <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <Badge className={
                        rec.priority === "High" ? "bg-red-500/20 text-red-400 border-red-500" :
                        rec.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500" :
                        "bg-green-500/20 text-green-400 border-green-500"
                      }>
                        {rec.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">{rec.action}</td>
                    <td className="py-3 px-4 text-sm font-medium text-cyan-400">{rec.impact}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{rec.eta}</td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => handleDispatch(index)}
                        disabled={dispatching === index}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {dispatching === index ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          "DISPATCH"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coverage Grid */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-white">City Coverage Grid</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3">
              {zones.map((zone, index) => (
                <motion.button
                  key={zone.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border-2 ${getStatusColor(zone.status)} hover:scale-105 transition-all cursor-pointer`}
                >
                  <div className="text-2xl mb-1">{getStatusIcon(zone.status)}</div>
                  <p className="text-xs font-semibold text-white">{zone.name}</p>
                  <p className={`text-xs font-bold mt-1 ${
                    zone.risk >= 70 ? "text-red-400" :
                    zone.risk >= 50 ? "text-orange-400" : "text-green-400"
                  }`}>
                    {zone.risk}%
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Coverage Optimizer */}
      <div className="lg:col-span-3">
        <div className="rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-cyan-500/30 p-5 sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Coverage Optimizer</h3>
          </div>

          <div className="space-y-4">
            {/* Current Coverage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Current Coverage</span>
                <span className="font-bold text-orange-400">68%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            {/* Optimized Coverage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Optimized Coverage</span>
                <span className="font-bold text-green-400">94%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Suggested Positions */}
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Suggested Positions</p>
              <div className="space-y-2 text-xs">
                {[
                  { unit: 1, lat: 28.62, lng: 77.21, covers: 4 },
                  { unit: 2, lat: 19.08, lng: 72.88, covers: 5 },
                  { unit: 3, lat: 12.98, lng: 77.60, covers: 3 },
                  { unit: 4, lat: 22.58, lng: 88.37, covers: 4 },
                  { unit: 5, lat: 13.09, lng: 80.28, covers: 3 }
                ].map((pos, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-cyan-400">Unit {pos.unit}</span>
                      <span className="text-slate-300">{pos.lat}, {pos.lng}</span>
                    </div>
                    <p className="text-slate-500 mt-1">Covers {pos.covers} zones</p>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
              <Navigation className="w-4 h-4 mr-2" />
              Apply Optimization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}