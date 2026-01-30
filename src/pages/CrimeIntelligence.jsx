import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimeMap from '@/components/dashboard/RealTimeMap';
import Feature1_CrimePrediction from '@/features/Feature1_CrimePrediction';
import Feature2_CityRanking from '@/features/Feature2_CityRanking';
import Feature6_RiskClassification from '@/features/Feature6_RiskClassification';

/**
 * Crime Intelligence Dashboard
 * Integrated view combining:
 * - Real-time map with 29 cities and 159 hotspots
 * - Crime prediction
 * - City ranking by crime rate
 * - Risk classification system
 */

export default function CrimeIntelligence() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [refreshRate, setRefreshRate] = useState(5000); // 5 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger real-time data refresh
      window.dispatchEvent(new CustomEvent('crimeDataRefresh'));
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Crime Intelligence Hub</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time crime analytics with predictive insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={refreshRate}
            onChange={(e) => setRefreshRate(Number(e.target.value))}
            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm"
          >
            <option value={3000}>Real-time (3s)</option>
            <option value={5000}>5s Update</option>
            <option value={10000}>10s Update</option>
            <option value={30000}>30s Update</option>
          </select>
        </div>
      </div>

      {/* Real-time Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Interactive Crime Map</h2>
              <p className="text-xs text-slate-400">29 cities • 159 hotspots • Real-time updates</p>
            </div>
          </div>
          <div className="h-[500px]">
            <RealTimeMap 
              showHotspots={true}
              showCities={true}
              selectedCity={selectedCity}
              onCitySelect={setSelectedCity}
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs for Features */}
      <Tabs defaultValue="prediction" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
          <TabsTrigger value="prediction" className="data-[state=active]:bg-cyan-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Prediction
          </TabsTrigger>
          <TabsTrigger value="ranking" className="data-[state=active]:bg-cyan-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            City Ranking
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-cyan-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk Level
          </TabsTrigger>
        </TabsList>

        {/* Crime Prediction */}
        <TabsContent value="prediction" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature1_CrimePrediction />
          </motion.div>
        </TabsContent>

        {/* City Ranking */}
        <TabsContent value="ranking" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature2_CityRanking />
          </motion.div>
        </TabsContent>

        {/* Risk Classification */}
        <TabsContent value="risk" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature6_RiskClassification />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
