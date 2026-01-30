import { motion } from "framer-motion";
import { Shield, AlertTriangle, Clock, MapPin } from "lucide-react";

export default function CoverageSidebar({ coveredZones = 8, totalZones = 12, activePatrols = 5, avgResponse = 8.3 }) {
  const coverage = (coveredZones / totalZones) * 100;
  const criticalGaps = totalZones - coveredZones;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 w-56 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-cyan-400" />
        <h4 className="font-semibold text-white text-sm">Patrol Coverage</h4>
      </div>

      <div className="space-y-4">
        {/* Coverage Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Covered Zones</span>
            <span className="text-white font-bold">{coveredZones}/{totalZones}</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${coverage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Critical Gaps */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-slate-400">Critical Gaps</span>
          </div>
          <span className={`text-sm font-bold ${criticalGaps > 2 ? "text-red-400" : "text-yellow-400"}`}>
            {criticalGaps}
          </span>
        </div>

        {/* Active Patrols */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400">Active Patrols</span>
          </div>
          <span className="text-sm font-bold text-green-400">{activePatrols}/5</span>
        </div>

        {/* Avg Response */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-slate-400">Avg Response</span>
          </div>
          <span className="text-sm font-bold text-white">{avgResponse} min</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">All Units Operational</span>
        </div>
      </div>
    </motion.div>
  );
}