import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, AlertCircle, CheckCircle, Clock, BarChart3, Shield, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const biasMetrics = [
  { name: "Geographic Distribution", value: 92, status: "good", description: "Risk alerts evenly distributed across demographics" },
  { name: "Socioeconomic Balance", value: 88, status: "good", description: "No correlation between income levels and flag rates" },
  { name: "Temporal Fairness", value: 95, status: "good", description: "Consistent prediction quality across all time periods" },
  { name: "Historical Bias Correction", value: 84, status: "warning", description: "Minor adjustment needed for pre-2020 training data" }
];

const zoneCategories = [
  { category: "Commercial", zones: 4, avgRisk: 62, alerts: 8, population: "Low" },
  { category: "Residential", zones: 6, avgRisk: 34, alerts: 4, population: "High" },
  { category: "Industrial", zones: 3, avgRisk: 58, alerts: 5, population: "Low" },
  { category: "Mixed Use", zones: 5, avgRisk: 48, alerts: 6, population: "Medium" },
  { category: "Entertainment", zones: 2, avgRisk: 71, alerts: 7, population: "Variable" }
];

const auditLog = [
  { id: 1, timestamp: "2024-01-15 14:32:18", action: "Prediction Generated", zone: "Downtown Core", details: "Risk level: 87%, Confidence: 94%", reviewer: "System" },
  { id: 2, timestamp: "2024-01-15 14:30:45", action: "Bias Check Passed", zone: "All Zones", details: "Daily fairness audit completed", reviewer: "Auto-audit" },
  { id: 3, timestamp: "2024-01-15 14:28:12", action: "Manual Override", zone: "University Quarter", details: "Risk downgraded: Special event context", reviewer: "Capt. Johnson" },
  { id: 4, timestamp: "2024-01-15 14:25:33", action: "Prediction Generated", zone: "Financial Hub", details: "Risk level: 79%, Confidence: 89%", reviewer: "System" },
  { id: 5, timestamp: "2024-01-15 14:22:08", action: "Model Retrained", zone: "Global", details: "Incorporated 2,400 new outcomes", reviewer: "ML Pipeline" },
  { id: 6, timestamp: "2024-01-15 14:18:55", action: "Alert Dispatched", zone: "Industrial District", details: "Patrol unit notified", reviewer: "Dispatcher AI" },
  { id: 7, timestamp: "2024-01-15 14:15:22", action: "Feedback Received", zone: "Harbor Area", details: "Prediction confirmed: False positive", reviewer: "Officer Martinez" }
];

export default function FairnessDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Scale className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Fairness & Transparency</h1>
          <p className="text-slate-400 text-sm">Ethical AI monitoring and audit trail</p>
        </div>
      </div>

      {/* Bias Detection Meters */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Bias Detection Meters</h3>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>All metrics within acceptable range</span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {biasMetrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">{metric.name}</span>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  metric.status === "good" 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {metric.status === "good" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {metric.status === "good" ? "Healthy" : "Needs Review"}
                </div>
              </div>
              
              <div className="relative mb-2">
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      metric.value >= 90 ? "bg-green-500" :
                      metric.value >= 80 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  />
                </div>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-white">
                  {metric.value}%
                </span>
              </div>
              
              <p className="text-xs text-slate-400">{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Risk Distribution by Zone Category</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ensuring equitable risk assessment across different area types</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Category</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Zones</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Avg Risk</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Active Alerts</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Population Density</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {zoneCategories.map((cat, index) => (
                <motion.tr
                  key={cat.category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800/50"
                >
                  <td className="py-3 px-4 font-medium text-white">{cat.category}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{cat.zones}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      cat.avgRisk >= 60 ? "text-orange-400" :
                      cat.avgRisk >= 40 ? "text-yellow-400" : "text-green-400"
                    }`}>{cat.avgRisk}%</span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">{cat.alerts}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{cat.population}</td>
                  <td className="py-3 px-4">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${(cat.zones / 20) * 100}%` }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Prediction Audit Log</h3>
          </div>
          <span className="text-xs text-slate-400">Last 24 hours</span>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {auditLog.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 mt-0.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{entry.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{entry.details}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-cyan-400">{entry.zone}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500">{entry.reviewer}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{entry.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}