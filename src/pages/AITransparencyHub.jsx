import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Info, Scale, CheckCircle, AlertCircle, Eye, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const zones = [
  { id: 1, name: "Delhi Central", risk: 87 },
  { id: 2, name: "Mumbai West", risk: 79 },
  { id: 3, name: "Bangalore South", risk: 72 },
  { id: 4, name: "Kolkata East", risk: 65 }
];

const factors = [
  { name: "Historical Crime Density", contribution: 32, trend: "high", description: "High concentration of similar incidents in past 30 days" },
  { name: "Time Pattern Match", contribution: 24, trend: "high", description: "Current time matches peak crime hours (22:00-02:00)" },
  { name: "Foot Traffic Anomaly", contribution: 18, trend: "medium", description: "Unusual decrease in pedestrian activity detected" },
  { name: "Weather Conditions", contribution: 12, trend: "low", description: "Clear weather correlates with increased outdoor crime" },
  { name: "Event Proximity", contribution: 8, trend: "medium", description: "Large venue event ending within 30 minutes" },
  { name: "Economic Indicators", contribution: 6, trend: "low", description: "Recent unemployment data for the zone" }
];

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
  { id: 1, timestamp: "2024-01-15 14:32:18", action: "Prediction Generated", zone: "Delhi Central", details: "Risk level: 87%, Confidence: 94%", reviewer: "System" },
  { id: 2, timestamp: "2024-01-15 14:30:45", action: "Bias Check Passed", zone: "All Zones", details: "Daily fairness audit completed", reviewer: "Auto-audit" },
  { id: 3, timestamp: "2024-01-15 14:28:12", action: "Manual Override", zone: "Bangalore South", details: "Risk downgraded: Special event context", reviewer: "Inspector Kumar" },
  { id: 4, timestamp: "2024-01-15 14:25:33", action: "Prediction Generated", zone: "Mumbai West", details: "Risk level: 79%, Confidence: 89%", reviewer: "System" },
  { id: 5, timestamp: "2024-01-15 14:22:08", action: "Model Retrained", zone: "Global", details: "Incorporated 2,400 new outcomes", reviewer: "ML Pipeline" }
];

export default function AITransparencyHub() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [activeTab, setActiveTab] = useState("explainability");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Transparency Hub</h1>
          <p className="text-slate-400 text-sm">Explainability, Fairness & Ethical AI Monitoring</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1 w-full justify-start">
          <TabsTrigger 
            value="explainability" 
            className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 px-4 py-2"
          >
            <Info className="w-4 h-4" />
            Explainability
          </TabsTrigger>
          <TabsTrigger 
            value="fairness"
            className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4 py-2"
          >
            <Scale className="w-4 h-4" />
            Fairness & Bias
          </TabsTrigger>
          <TabsTrigger 
            value="audit"
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2"
          >
            <Eye className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* Explainability Tab */}
        <TabsContent value="explainability" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-400">Understanding AI predictions and decision factors</p>
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
            <div className="xl:col-span-2 rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Why is {selectedZone.name} flagged?</h3>
              </div>
              
              <div className="p-6">
                {/* Risk Summary */}
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold text-red-400">High Risk Alert</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    This zone shows a {selectedZone.risk}% probability of criminal activity in the next 30 minutes 
                    based on the combination of factors below.
                  </p>
                </div>

                {/* Contributing Factors */}
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Top Contributing Factors
                </h4>
                
                <div className="space-y-4">
                  {factors.slice(0, 3).map((factor, index) => (
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
                        <span className="text-xl font-bold text-cyan-400">{factor.contribution}%</span>
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

            {/* Confidence & Transparency */}
            <div className="space-y-6">
              {/* Confidence Score */}
              <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-semibold text-white">Confidence Score</h3>
                </div>
                <div className="p-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" fill="none" stroke="rgb(51, 65, 85)" strokeWidth="10" />
                      <motion.circle
                        cx="64" cy="64" r="54" fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - 0.89) }}
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
                      <span className="text-3xl font-bold text-white">89%</span>
                      <span className="text-xs text-slate-400">confidence</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Model accuracy</span>
                      <span className="text-green-400 font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">False positive rate</span>
                      <span className="text-yellow-400 font-medium">4.8%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Transparency */}
              <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-semibold text-white">Transparency</h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Auditable</span>
                    </div>
                    <p className="text-xs text-slate-400">All predictions logged</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Human-in-Loop</span>
                    </div>
                    <p className="text-xs text-slate-400">Human confirmation required</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-white">Bias Monitored</span>
                    </div>
                    <p className="text-xs text-slate-400">Continuous fairness tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Fairness Tab */}
        <TabsContent value="fairness" className="mt-6 space-y-6">
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
              <p className="text-xs text-slate-500 mt-0.5">Ensuring equitable assessment across area types</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Category</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Zones</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Avg Risk</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Alerts</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Population</th>
                  </tr>
                </thead>
                <tbody>
                  {zoneCategories.map((cat, index) => (
                    <motion.tr
                      key={cat.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="mt-6">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-white">Prediction Audit Log</h3>
              </div>
              <span className="text-xs text-slate-400">Last 24 hours</span>
            </div>
            
            <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}