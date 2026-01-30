import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, MapPin, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPICard from "@/components/dashboard/KPICard";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import AlertFeed from "@/components/dashboard/AlertFeed";

export default function CommandCenter() {
  const [forecastMode, setForecastMode] = useState("current");
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time situational awareness and threat monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={forecastMode} onValueChange={setForecastMode}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="current" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Live
              </TabsTrigger>
              <TabsTrigger value="15" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                +15m
              </TabsTrigger>
              <TabsTrigger value="30" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                +30m
              </TabsTrigger>
              <TabsTrigger value="60" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                +60m
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Risk Index"
          value="67.4"
          subtitle="City-wide average"
          icon={Shield}
          accentColor="orange"
          trend="up"
          trendValue="+4.2% from last hour"
        />
        <KPICard
          title="Active Alerts"
          value="12"
          subtitle="Requiring attention"
          icon={AlertTriangle}
          accentColor="red"
          trend="up"
          trendValue="+3 new alerts"
        />
        <KPICard
          title="High-Risk Zones"
          value="4"
          subtitle="Above 70% threshold"
          icon={MapPin}
          accentColor="orange"
        />
        <KPICard
          title="Prediction Accuracy"
          value="94.2%"
          subtitle="Last 24 hours"
          icon={Activity}
          accentColor="green"
          trend="up"
          trendValue="+1.8% improvement"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map - takes 2 columns */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Live Risk Heatmap</h3>
                <p className="text-xs text-slate-500 mt-0.5">Interactive zone monitoring</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4" />
                <span>Updated 5s ago</span>
              </div>
            </div>
            <div className="p-4 h-[500px]">
              <RiskHeatmap 
                forecastMode={forecastMode} 
                onZoneSelect={setSelectedZone}
              />
            </div>
          </div>
        </div>

        {/* Alerts panel */}
        <div className="xl:col-span-1">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Active Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Prioritized by risk level</p>
              </div>
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                View All
              </Button>
            </div>
            <div className="p-4">
              <AlertFeed limit={5} />
            </div>
          </div>
        </div>
      </div>

      {/* Selected zone detail */}
      {selectedZone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-900/50 border border-cyan-500/30 p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-cyan-400 uppercase tracking-wider mb-1">Selected Zone</p>
              <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedZone(null)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase">Risk Score</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">{Math.round(selectedZone.risk)}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase">Active Alerts</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{selectedZone.alerts}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase">Confidence</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">89%</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase">Trend</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">↑ Rising</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}