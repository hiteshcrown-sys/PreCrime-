import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Clock, ChevronRight } from "lucide-react";
import RiskBadge from "../ui/RiskBadge";

const alerts = [
  { id: 1, zone: "Downtown Core", type: "Assault Pattern", time: "2 min ago", risk: "critical", confidence: 94 },
  { id: 2, zone: "Financial Hub", type: "Vehicle Theft Spike", time: "8 min ago", risk: "high", confidence: 87 },
  { id: 3, zone: "Industrial District", type: "Break-in Cluster", time: "15 min ago", risk: "high", confidence: 82 },
  { id: 4, zone: "Harbor Area", type: "Suspicious Activity", time: "23 min ago", risk: "medium", confidence: 71 },
  { id: 5, zone: "Shopping District", type: "Pickpocket Alert", time: "31 min ago", risk: "medium", confidence: 68 }
];

export default function AlertFeed({ limit = 5 }) {
  return (
    <div className="space-y-3">
      <AnimatePresence>
        {alerts.slice(0, limit).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 hover:bg-slate-800/80 hover:border-slate-600 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                alert.risk === "critical" ? "bg-red-500/20" : 
                alert.risk === "high" ? "bg-orange-500/20" : "bg-yellow-500/20"
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.risk === "critical" ? "text-red-400" : 
                  alert.risk === "high" ? "text-orange-400" : "text-yellow-400"
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-white text-sm truncate">{alert.type}</p>
                  <RiskBadge level={alert.risk} size="sm" />
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {alert.zone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${alert.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-cyan-400 font-medium">{alert.confidence}%</span>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}