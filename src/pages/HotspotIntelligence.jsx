import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Eye, Search, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RealTimeMap from '@/components/dashboard/RealTimeMap';
import Feature7_HotspotDetection from '@/features/Feature7_HotspotDetection';

/**
 * Hotspot Intelligence
 * Integrated hotspot detection with real-time map visualization
 * - 159 identified hotspots via K-means clustering
 * - Real-time map showing hotspot density
 * - Searchable hotspot database
 */

export default function HotspotIntelligence() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [mapZoomLevel, setMapZoomLevel] = useState(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Hotspot Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">159 high-crime density areas identified via K-means clustering</p>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/30 p-4"
        >
          <p className="text-sm text-slate-400">Total Hotspots</p>
          <p className="text-3xl font-bold text-red-400">159</p>
          <p className="text-xs text-slate-500 mt-1">High-crime density zones</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-br from-orange-900/30 to-orange-800/10 border border-orange-500/30 p-4"
        >
          <p className="text-sm text-slate-400">Critical Priority</p>
          <p className="text-3xl font-bold text-orange-400">24</p>
          <p className="text-xs text-slate-500 mt-1">Immediate intervention needed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-br from-yellow-900/30 to-yellow-800/10 border border-yellow-500/30 p-4"
        >
          <p className="text-sm text-slate-400">High Priority</p>
          <p className="text-3xl font-bold text-yellow-400">42</p>
          <p className="text-xs text-slate-500 mt-1">Enhanced monitoring required</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/30 p-4"
        >
          <p className="text-sm text-slate-400">Cities Covered</p>
          <p className="text-3xl font-bold text-blue-400">29</p>
          <p className="text-xs text-slate-500 mt-1">Major Indian cities</p>
        </motion.div>
      </div>

      {/* Tabs for Map and Details */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
          <TabsTrigger value="map" className="data-[state=active]:bg-cyan-600">
            <MapPin className="w-4 h-4 mr-2" />
            Interactive Map
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-cyan-600">
            <Eye className="w-4 h-4 mr-2" />
            Hotspot Details
          </TabsTrigger>
        </TabsList>

        {/* Interactive Map */}
        <TabsContent value="map" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 overflow-hidden p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Real-time Hotspot Map</h2>
                <p className="text-xs text-slate-400">159 high-crime density zones with priority levels</p>
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
          </motion.div>
        </TabsContent>

        {/* Hotspot Details */}
        <TabsContent value="details" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
          >
            <Feature7_HotspotDetection />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Information Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700/50 p-6"
      >
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">Understanding Hotspots</h3>
            <p className="text-sm text-slate-400 mb-3">
              Hotspots are high-crime density areas identified using K-means clustering analysis on historical crime location data. Each hotspot is prioritized based on crime density and frequency of incidents.
            </p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• <span className="text-red-400 font-semibold">CRITICAL:</span> Highest crime density - Immediate intervention required</li>
              <li>• <span className="text-orange-400 font-semibold">HIGH:</span> High crime density - Enhanced monitoring recommended</li>
              <li>• <span className="text-yellow-400 font-semibold">MEDIUM:</span> Moderate crime density - Regular patrols advised</li>
              <li>• <span className="text-blue-400 font-semibold">LOW:</span> Lower crime density - Standard security measures</li>
              <li>• <span className="text-green-400 font-semibold">VERY_LOW:</span> Minimal crime density - Routine monitoring</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
