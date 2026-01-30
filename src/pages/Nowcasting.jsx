import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, RefreshCw, Zap, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import KPICard from "@/components/dashboard/KPICard";
import PredictionTable from "@/components/nowcasting/PredictionTable";

export default function Nowcasting() {
  const [timeWindow, setTimeWindow] = useState("15");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Real-Time Crime Nowcasting</h1>
            <p className="text-slate-400 text-sm">Short-term predictive risk analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={timeWindow} onValueChange={setTimeWindow}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="15" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                15 min
              </TabsTrigger>
              <TabsTrigger value="30" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                30 min
              </TabsTrigger>
              <TabsTrigger value="60" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                60 min
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">System Active</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-300">Processing {timeWindow}-minute forecast window</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Zones at Alert"
          value="4"
          subtitle="Requiring immediate attention"
          icon={Target}
          accentColor="red"
        />
        <KPICard
          title="Average Risk"
          value="52.8%"
          subtitle="Across all monitored zones"
          icon={Activity}
          accentColor="orange"
          trend="up"
          trendValue="+3.2%"
        />
        <KPICard
          title="Model Confidence"
          value="87.4%"
          subtitle="Prediction reliability"
          icon={TrendingUp}
          accentColor="green"
        />
        <KPICard
          title="Active Predictions"
          value="10"
          subtitle="Zones being monitored"
          icon={Zap}
          accentColor="cyan"
        />
      </div>

      {/* Prediction Table */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Zone-wise Predictions</h3>
            <p className="text-xs text-slate-500 mt-0.5">{timeWindow}-minute risk forecast for all monitored zones</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Alert (&gt;80%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Warning (&gt;60%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Normal (&lt;40%)
            </span>
          </div>
        </div>
        <PredictionTable timeWindow={parseInt(timeWindow)} />
      </div>

      {/* Model Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Model Version</p>
          <p className="text-lg font-semibold text-white">NowCast v3.2.1</p>
          <p className="text-xs text-slate-500 mt-1">Ensemble LSTM + GBM</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Training Data</p>
          <p className="text-lg font-semibold text-white">2.4M Events</p>
          <p className="text-xs text-slate-500 mt-1">Last 5 years historical data</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Accuracy (30-day)</p>
          <p className="text-lg font-semibold text-green-400">94.2%</p>
          <p className="text-xs text-slate-500 mt-1">Verified against outcomes</p>
        </motion.div>
      </div>
    </div>
  );
}