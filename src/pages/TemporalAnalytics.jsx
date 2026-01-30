import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Feature3_HourlyPatterns from '@/features/Feature3_HourlyPatterns';
import Feature4_TemporalAnalysis from '@/features/Feature4_TemporalAnalysis';
import Feature5_CrimeDomainTrends from '@/features/Feature5_CrimeDomainTrends';

/**
 * Temporal Crime Analytics
 * Integrated view combining:
 * - Hourly crime patterns
 * - Temporal analysis across cities
 * - Crime domain trends over time
 */

export default function TemporalAnalytics() {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedDomain, setSelectedDomain] = useState('Other Crime');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Temporal Crime Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">24-hour patterns, hourly trends, and domain-specific analysis</p>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/30 p-4"
        >
          <Clock className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-sm text-slate-400">Peak Crime Hour</p>
          <p className="text-2xl font-bold text-red-400">03:00 AM</p>
          <p className="text-xs text-slate-500 mt-1">705 crimes (4.45%)</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-500/30 p-4"
        >
          <BarChart3 className="w-5 h-5 text-orange-400 mb-2" />
          <p className="text-sm text-slate-400">Night Crime Rate</p>
          <p className="text-2xl font-bold text-orange-400">70.6%</p>
          <p className="text-xs text-slate-500 mt-1">12 AM - 6 AM (hours 0-6)</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 p-4"
        >
          <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-sm text-slate-400">Total Hourly Patterns</p>
          <p className="text-2xl font-bold text-blue-400">696</p>
          <p className="text-xs text-slate-500 mt-1">24 hours × 29 cities</p>
        </motion.div>
      </div>

      {/* Tabs for Temporal Features */}
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger value="hourly" className="data-[state=active]:bg-cyan-600">
            <Clock className="w-4 h-4 mr-2" />
            Hourly Patterns
          </TabsTrigger>
          <TabsTrigger value="temporal" className="data-[state=active]:bg-cyan-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Temporal Analysis
          </TabsTrigger>
          <TabsTrigger value="domains" className="data-[state=active]:bg-cyan-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Domain Trends
          </TabsTrigger>
        </TabsList>

        {/* Hourly Patterns */}
        <TabsContent value="hourly" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature3_HourlyPatterns />
          </motion.div>
        </TabsContent>

        {/* Temporal Analysis */}
        <TabsContent value="temporal" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature4_TemporalAnalysis />
          </motion.div>
        </TabsContent>

        {/* Domain Trends */}
        <TabsContent value="domains" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature5_CrimeDomainTrends />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <div className="text-cyan-400 font-bold">•</div>
            <div>
              <p className="text-slate-300">Night time crimes (12 AM - 6 AM) account for 70.6% of all crimes</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-cyan-400 font-bold">•</div>
            <div>
              <p className="text-slate-300">Peak crime hour is 3:00 AM with 705 recorded incidents</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-cyan-400 font-bold">•</div>
            <div>
              <p className="text-slate-300">"Other Crime" category dominates with 57.14% of all incidents</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-cyan-400 font-bold">•</div>
            <div>
              <p className="text-slate-300">Violent crimes account for 28.57% requiring immediate intervention</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
