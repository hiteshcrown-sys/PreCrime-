import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const zones = [
  { id: 1, name: "Downtown Core", risk: 87 },
  { id: 2, name: "Financial Hub", risk: 79 },
  { id: 3, name: "Industrial District", risk: 72 },
  { id: 4, name: "Harbor Area", risk: 65 }
];

const factors = [
  { name: "Historical Crime Density", contribution: 32, trend: "high", description: "High concentration of similar incidents in past 30 days" },
  { name: "Time Pattern Match", contribution: 24, trend: "high", description: "Current time matches peak crime hours (22:00-02:00)" },
  { name: "Foot Traffic Anomaly", contribution: 18, trend: "medium", description: "Unusual decrease in pedestrian activity detected" },
  { name: "Weather Conditions", contribution: 12, trend: "low", description: "Clear weather correlates with increased outdoor crime" },
  { name: "Event Proximity", contribution: 8, trend: "medium", description: "Large venue event ending within 30 minutes" },
  { name: "Economic Indicators", contribution: 6, trend: "low", description: "Recent unemployment data for the zone" }
];

export default function ExplainableAI() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Explainable AI</h1>
            <p className="text-slate-400 text-sm">Transparent prediction reasoning</p>
          </div>
        </div>
        
        <Select 
          value={selectedZone.name} 
          onValueChange={(v) => setSelectedZone(zones.find(z => z.name === v))}
        >
          <SelectTrigger className="w-64 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone.id} value={zone.name}>
                {zone.name} ({zone.risk}% risk)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Why This Zone Panel */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden h-full">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-white">Why is {selectedZone.name} flagged?</h3>
            </div>
            
            <div className="p-6">
              {/* Risk Summary */}
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">High Risk Alert</span>
                </div>
                <p className="text-sm text-slate-300">
                  This zone shows an {selectedZone.risk}% probability of criminal activity in the next 30 minutes 
                  based on the combination of factors below.
                </p>
              </div>

              {/* Contributing Factors */}
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Contributing Factors
              </h4>
              
              <div className="space-y-4">
                {factors.map((factor, index) => (
                  <motion.div
                    key={factor.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          factor.trend === "high" ? "bg-red-400" :
                          factor.trend === "medium" ? "bg-yellow-400" : "bg-green-400"
                        }`} />
                        <span className="font-medium text-white">{factor.name}</span>
                      </div>
                      <span className="text-lg font-bold text-cyan-400">{factor.contribution}%</span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.contribution}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400">{factor.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence & Model Info */}
        <div className="xl:col-span-1 space-y-6">
          {/* Confidence Score */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Prediction Confidence</h3>
            </div>
            <div className="p-6">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgb(51, 65, 85)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - 0.89) }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-white">89%</span>
                  <span className="text-xs text-slate-400">confidence</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Model accuracy (30d)</span>
                  <span className="text-green-400 font-medium">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">False positive rate</span>
                  <span className="text-yellow-400 font-medium">4.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Data freshness</span>
                  <span className="text-cyan-400 font-medium">5 sec ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Transparency */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Model Transparency</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Auditable</span>
                </div>
                <p className="text-xs text-slate-400">All predictions logged with full factor breakdown</p>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Human-in-Loop</span>
                </div>
                <p className="text-xs text-slate-400">Requires human confirmation before action</p>
              </div>
              
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Bias Monitored</span>
                </div>
                <p className="text-xs text-slate-400">Continuous fairness metrics tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}