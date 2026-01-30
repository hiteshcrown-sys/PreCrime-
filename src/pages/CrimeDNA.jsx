import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Clock, MapPin, TrendingUp, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatternCluster from "@/components/crimedna/PatternCluster";
import PatternTimeline from "@/components/crimedna/PatternTimeline";
import RiskBadge from "@/components/ui/RiskBadge";

export default function CrimeDNA() {
  const [selectedPattern, setSelectedPattern] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Fingerprint className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Crime DNA™</h1>
            <p className="text-slate-400 text-sm">Pattern Fingerprinting Engine</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pattern Cluster Visualization */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Pattern Cluster Visualization</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click on patterns to view details</p>
            </div>
            <div className="p-4 h-[450px]">
              <PatternCluster 
                onPatternSelect={setSelectedPattern}
                selectedPattern={selectedPattern}
              />
            </div>
          </div>
        </div>

        {/* Pattern Detail Card */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 h-full">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Pattern Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Selected pattern details</p>
            </div>
            
            <div className="p-4">
              {selectedPattern ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Pattern ID */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Pattern ID</span>
                      <RiskBadge 
                        level={selectedPattern.similarity >= 90 ? "critical" : selectedPattern.similarity >= 75 ? "high" : "medium"} 
                        size="sm" 
                      />
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPattern.id}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-slate-400">Similarity</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-400">{selectedPattern.similarity}%</p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-slate-400">Crime Type</span>
                      </div>
                      <p className="text-sm font-semibold text-white">{selectedPattern.type}</p>
                    </div>
                  </div>

                  {/* Time Window */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-400 uppercase">Time Window</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Peak Hours</span>
                        <span className="text-white font-medium">22:00 - 02:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Peak Days</span>
                        <span className="text-white font-medium">Fri, Sat</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Occurrences</span>
                        <span className="text-white font-medium">47 events</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-slate-400 uppercase">Primary Zones</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Downtown Core", "Financial Hub", "Harbor Area"].map(zone => (
                        <span key={zone} className="px-2 py-1 text-xs bg-slate-700 rounded-lg text-slate-300">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                  <Fingerprint className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Select a pattern to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Timeline */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Pattern Evolution Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedPattern ? `Showing history for ${selectedPattern.id}` : "12-month pattern trend analysis"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+23% detection rate</span>
          </div>
        </div>
        <div className="p-6">
          <PatternTimeline patternId={selectedPattern?.id} />
        </div>
      </div>
    </div>
  );
}