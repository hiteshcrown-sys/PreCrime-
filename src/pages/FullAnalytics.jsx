import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, MapPin, CheckCircle, XCircle, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const historicalData = [
  { month: "Jan", incidents: 245, prevented: 189, occurred: 56 },
  { month: "Feb", incidents: 268, prevented: 215, occurred: 53 },
  { month: "Mar", incidents: 292, prevented: 238, occurred: 54 },
  { month: "Apr", incidents: 315, prevented: 261, occurred: 54 },
  { month: "May", incidents: 338, prevented: 285, occurred: 53 },
  { month: "Jun", incidents: 352, prevented: 301, occurred: 51 },
  { month: "Jul", incidents: 375, prevented: 325, occurred: 50 },
  { month: "Aug", incidents: 398, prevented: 348, occurred: 50 },
  { month: "Sep", incidents: 412, prevented: 365, occurred: 47 },
  { month: "Oct", incidents: 435, prevented: 391, occurred: 44 },
  { month: "Nov", incidents: 458, prevented: 416, occurred: 42 },
  { month: "Dec", incidents: 482, prevented: 441, occurred: 41 }
];

const zoneAnalytics = [
  { zone: "Delhi Central", predictions: 234, prevented: 189, occurred: 45, accuracy: 92.1 },
  { zone: "Mumbai West", predictions: 198, prevented: 165, occurred: 33, accuracy: 89.7 },
  { zone: "Bangalore South", predictions: 176, prevented: 142, occurred: 34, accuracy: 88.4 },
  { zone: "Kolkata East", predictions: 165, prevented: 138, occurred: 27, accuracy: 91.2 },
  { zone: "Chennai North", predictions: 142, prevented: 118, occurred: 24, accuracy: 90.5 },
  { zone: "Hyderabad", predictions: 128, prevented: 104, occurred: 24, accuracy: 88.9 },
  { zone: "Pune", predictions: 115, prevented: 96, occurred: 19, accuracy: 91.8 },
  { zone: "Ahmedabad", predictions: 108, prevented: 88, occurred: 20, accuracy: 89.3 }
];

const performanceMetrics = [
  { metric: "Overall Accuracy", current: "94.2%", previous: "92.4%", change: "+1.8%" },
  { metric: "Precision", current: "91.7%", previous: "89.3%", change: "+2.4%" },
  { metric: "Recall", current: "89.3%", previous: "87.1%", change: "+2.2%" },
  { metric: "F1 Score", current: "90.5%", previous: "88.2%", change: "+2.3%" },
  { metric: "False Positive Rate", current: "4.8%", previous: "6.2%", change: "-1.4%" },
  { metric: "False Negative Rate", current: "5.5%", previous: "7.3%", change: "-1.8%" }
];

export default function FullAnalytics() {
  const [timeRange, setTimeRange] = useState("12months");
  const [selectedZone, setSelectedZone] = useState("all");

  const maxIncidents = Math.max(...historicalData.map(d => d.incidents));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Full Analytics Dashboard</h1>
            <p className="text-slate-400 text-sm">Comprehensive performance metrics and historical analysis</p>
          </div>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comparison Card - Traditional vs AI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-2 border-cyan-500/30 overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">System Comparison</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Systems */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-700">
                  <Shield className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Traditional Systems</p>
                  <p className="text-xs text-slate-500">Rule-based analytics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Prediction Accuracy</span>
                    <span className="font-bold text-orange-400">78%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Response Time</span>
                    <span className="font-bold text-orange-400">18 min</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Crime Prevention Rate</span>
                    <span className="font-bold text-orange-400">65%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Platform */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Our AI Platform</p>
                  <p className="text-xs text-cyan-400">PreCrime AI v3.2.1</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Prediction Accuracy</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-400">91%</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "91%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Response Time</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-400">7.2 min</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Crime Prevention Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-400">88%</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-cyan-500/30">
                <p className="text-xs text-green-400 font-medium">
                  ✓ +13% accuracy improvement
                  <br />
                  ✓ 60% faster response
                  <br />
                  ✓ +23% more crimes prevented
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Historical Trends */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Historical Crime Trends</h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly incidents, prevention rate, and outcomes</p>
        </div>
        
        <div className="p-6">
          <div className="h-80 flex items-end gap-2">
            {historicalData.map((data, index) => (
              <motion.div
                key={data.month}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-full relative" style={{ height: "calc(100% - 40px)" }}>
                  {/* Total incidents */}
                  <motion.div
                    className="absolute bottom-0 w-full bg-slate-700 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.incidents / maxIncidents) * 100}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  />
                  
                  {/* Prevented */}
                  <motion.div
                    className="absolute bottom-0 w-full bg-green-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.prevented / maxIncidents) * 100}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  />
                  
                  {/* Hover tooltip */}
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                      <p className="text-white font-medium">{data.month}</p>
                      <p className="text-green-400">Prevented: {data.prevented}</p>
                      <p className="text-red-400">Occurred: {data.occurred}</p>
                    </div>
                  </div>
                </div>
                
                <span className="text-xs text-slate-500">{data.month}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-xs">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-700 rounded" />
              Total Incidents
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded" />
              Prevented
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded" />
              Occurred
            </span>
          </div>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Model Performance Metrics</h3>
          <p className="text-xs text-slate-500 mt-0.5">Key ML model evaluation metrics</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <p className="text-xs text-slate-400 mb-2">{metric.metric}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{metric.current}</p>
                  <p className="text-xs text-slate-500">from {metric.previous}</p>
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith("+") ? "text-green-400" : "text-red-400"
                }`}>
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Zone-wise Logs */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Zone-wise Performance Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">Detailed breakdown by zone</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Zone</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Predictions</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Prevented</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Occurred</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {zoneAnalytics.map((zone, index) => (
                <motion.tr
                  key={zone.zone}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-white">{zone.zone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">{zone.predictions}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-green-400 font-medium">{zone.prevented}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-red-400 font-medium">{zone.occurred}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${
                      zone.accuracy >= 90 ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {zone.accuracy}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}