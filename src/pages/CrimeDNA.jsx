import { useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Clock, MapPin, TrendingUp, Target, Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatternCluster from "@/components/crimedna/PatternCluster";
import PatternTimeline from "@/components/crimedna/PatternTimeline";
import RiskBadge from "@/components/ui/RiskBadge";
import usePatternDetection from "@/hooks/usePatternDetection";

export default function CrimeDNA() {
  const [selectedPattern, setSelectedPattern] = useState(null);
  const { 
    patterns, 
    connections, 
    loading, 
    error,
    getPatternStats,
    getPatternTimeline,
    refreshPatterns,
    statistics
  } = usePatternDetection();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Fingerprint className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Crime DNA™</h1>
              <p className="text-slate-400 text-sm">Pattern Fingerprinting Engine</p>
            </div>
          </div>
          <motion.button
            onClick={refreshPatterns}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* Statistics Row */}
        {!loading && patterns.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Total Patterns</p>
              <p className="text-xl font-bold text-white">{statistics.totalPatterns}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Crime Types</p>
              <p className="text-xl font-bold text-cyan-400">{statistics.uniqueCrimeTypes}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Avg Similarity</p>
              <p className="text-xl font-bold text-purple-400">{statistics.avgSimilarity}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-500 mb-1">Clusters</p>
              <p className="text-xl font-bold text-orange-400">{statistics.clusters}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-400">Error loading patterns: {error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pattern Cluster Visualization */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Pattern Cluster Visualization</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {loading ? "Loading patterns..." : `Click on patterns to view details (${patterns.length} detected)`}
              </p>
            </div>
            <div className="p-4 h-[450px] relative">
              {!loading && patterns.length > 0 ? (
                <PatternCluster 
                  patterns={patterns}
                  connections={connections}
                  onPatternSelect={setSelectedPattern}
                  selectedPattern={selectedPattern}
                />
              ) : loading ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-sm">Analyzing crime patterns...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <p className="text-sm">No patterns detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pattern Detail Card */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 h-full">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Pattern Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">ML-detected pattern details</p>
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
                        <span className="text-slate-400">Peak Hour</span>
                        <span className="text-white font-medium">{String(selectedPattern.hour).padStart(2, '0')}:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Crime Density</span>
                        <span className="text-white font-medium">{Math.round(selectedPattern.density)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Severity</span>
                        <span className="text-white font-medium">{Math.round(selectedPattern.severity)}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-slate-400 uppercase">Primary Zone</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 text-sm bg-slate-700 rounded-lg text-slate-200 font-medium">
                        {selectedPattern.zone}
                      </span>
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
            <span>+{Math.round(15 + Math.random() * 30)}% trend</span>
          </div>
        </div>
        <div className="p-6">
          {selectedPattern ? (
            <PatternTimeline patternId={selectedPattern.id} />
          ) : (
            <PatternTimeline patternId={null} />
          )}
        </div>
      </div>
    </div>
  );
}