import { motion } from "framer-motion";
import { MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";

const predictions = [
  { zone: "Downtown Core", risk: 87, confidence: 94, status: "alert", trend: "rising", incidents: 12 },
  { zone: "Financial Hub", risk: 79, confidence: 89, status: "alert", trend: "stable", incidents: 8 },
  { zone: "Industrial District", risk: 72, confidence: 82, status: "warning", trend: "rising", incidents: 6 },
  { zone: "Harbor Area", risk: 65, confidence: 78, status: "warning", trend: "declining", incidents: 4 },
  { zone: "Old Town", risk: 58, confidence: 85, status: "monitoring", trend: "stable", incidents: 3 },
  { zone: "Shopping District", risk: 52, confidence: 76, status: "monitoring", trend: "stable", incidents: 2 },
  { zone: "Tech Park", risk: 41, confidence: 91, status: "normal", trend: "declining", incidents: 1 },
  { zone: "University Quarter", risk: 34, confidence: 88, status: "normal", trend: "stable", incidents: 1 },
  { zone: "Residential North", risk: 28, confidence: 92, status: "normal", trend: "declining", incidents: 0 },
  { zone: "Suburban East", risk: 22, confidence: 95, status: "normal", trend: "stable", incidents: 0 }
];

const statusConfig = {
  alert: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  warning: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10" },
  monitoring: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  normal: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" }
};

const getRiskLevel = (risk) => {
  if (risk >= 80) return "critical";
  if (risk >= 60) return "high";
  if (risk >= 40) return "medium";
  return "low";
};

export default function PredictionTable({ timeWindow = 15 }) {
  const adjustedPredictions = predictions.map(p => ({
    ...p,
    risk: Math.min(99, p.risk + (timeWindow === 60 ? 8 : timeWindow === 30 ? 4 : 0)),
    confidence: Math.max(60, p.confidence - (timeWindow === 60 ? 8 : timeWindow === 30 ? 4 : 0))
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Zone</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Score</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trend</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Incidents</th>
          </tr>
        </thead>
        <tbody>
          {adjustedPredictions.map((pred, index) => {
            const StatusIcon = statusConfig[pred.status].icon;
            return (
              <motion.tr
                key={pred.zone}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-white text-sm">{pred.zone}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          pred.risk >= 80 ? "bg-red-500" : 
                          pred.risk >= 60 ? "bg-orange-500" : 
                          pred.risk >= 40 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.risk}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${
                      pred.risk >= 80 ? "text-red-400" : 
                      pred.risk >= 60 ? "text-orange-400" : 
                      pred.risk >= 40 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      {pred.risk}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm text-cyan-400 font-medium">{pred.confidence}%</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[pred.status].bg} ${statusConfig[pred.status].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {pred.status.charAt(0).toUpperCase() + pred.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-sm ${
                    pred.trend === "rising" ? "text-red-400" : 
                    pred.trend === "declining" ? "text-green-400" : "text-slate-400"
                  }`}>
                    {pred.trend === "rising" ? "↑" : pred.trend === "declining" ? "↓" : "→"} {pred.trend}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm text-slate-300">{pred.incidents}</span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}