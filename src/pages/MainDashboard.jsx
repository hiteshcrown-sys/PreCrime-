import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, MapPin, Activity, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KPICard from "@/components/dashboard/KPICard";
import IndiaMap2D from "@/components/dashboard/IndiaMap2D";
import VoiceCommand from "@/components/dashboard/VoiceCommand";
import CoverageSidebar from "@/components/patrol/CoverageSidebar";
import DispatchAlert from "@/components/patrol/DispatchAlert";
import PatrolCommand from "@/components/patrol/PatrolCommand";
import CrimePredictionModel from "@/components/dashboard/CrimePredictionModel";

export default function MainDashboard() {
  const [timeOfDay, setTimeOfDay] = useState(20);
  const [hoveredState, setHoveredState] = useState(null);
  const [voiceCommand, setVoiceCommand] = useState(null);
  const [showDispatchAlert, setShowDispatchAlert] = useState(true);
  const [activeTab, setActiveTab] = useState("heatmap");
  const [kpiData, setKpiData] = useState({
    nationalRisk: 67.4,
    highRiskZones: 4,
    alertsGenerated: 12,
    modelConfidence: 94.2
  });

  // Simulate KPI updates based on time
  useEffect(() => {
    const nightMultiplier = timeOfDay >= 22 || timeOfDay <= 6 ? 1.15 : 1.0;
    setKpiData(prev => ({
      nationalRisk: Math.min(95, 67.4 * nightMultiplier),
      highRiskZones: timeOfDay >= 22 ? 6 : 4,
      alertsGenerated: Math.floor(12 * nightMultiplier),
      modelConfidence: 94.2
    }));
  }, [timeOfDay]);

  const handleVoiceCommand = (command) => {
    setVoiceCommand(command);
    setTimeout(() => setVoiceCommand(null), 3000);
  };

  const getTimeLabel = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">National Command Centre</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time Crime Intelligence for India</p>
        </div>
        
        {/* Voice Command */}
        <VoiceCommand onCommand={handleVoiceCommand} />
      </div>

      {/* Voice Command Feedback */}
      {voiceCommand && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
        >
          <p className="text-sm text-cyan-400">
            <span className="font-semibold">Processing:</span> {voiceCommand}
          </p>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          key={kpiData.nationalRisk}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <KPICard
            title="National Risk Index"
            value={kpiData.nationalRisk.toFixed(1)}
            subtitle="Across all monitored zones"
            icon={Shield}
            accentColor="orange"
            trend="up"
            trendValue={`${timeOfDay >= 22 ? "+12.3%" : "+4.2%"} from baseline`}
          />
        </motion.div>

        <motion.div
          key={kpiData.highRiskZones}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <KPICard
            title="High-Risk Zones Active"
            value={kpiData.highRiskZones}
            subtitle="Above 70% threshold"
            icon={MapPin}
            accentColor="red"
          />
        </motion.div>

        <motion.div
          key={kpiData.alertsGenerated}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <KPICard
            title="Alerts Generated"
            value={kpiData.alertsGenerated}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            accentColor="orange"
            trend="up"
            trendValue={`${timeOfDay >= 22 ? "+5" : "+3"} new alerts`}
          />
        </motion.div>

        <KPICard
          title="Model Confidence"
          value={`${kpiData.modelConfidence}%`}
          subtitle="Prediction accuracy"
          icon={Activity}
          accentColor="green"
          trend="up"
          trendValue="+1.8% improvement"
        />
      </div>

      {/* AI Crime Prediction Model */}
      <CrimePredictionModel />

      {/* Main Map Section with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="heatmap" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Risk Heatmap
              </TabsTrigger>
              <TabsTrigger value="patrol" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Patrol Command
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Live Data</span>
            </div>
          </div>

          <TabsContent value="heatmap" className="m-0">

            <div className="h-[500px] relative">
              <IndiaMap2D timeOfDay={timeOfDay} onStateHover={setHoveredState} />
              <CoverageSidebar />
              <DispatchAlert 
                isVisible={showDispatchAlert}
                onDispatch={() => setShowDispatchAlert(false)}
                onDismiss={() => setShowDispatchAlert(false)}
              />
            </div>

          </TabsContent>

          <TabsContent value="patrol" className="m-0 p-6">
            <PatrolCommand />
          </TabsContent>

        {/* Timeline Slider - only show for heatmap */}
        {activeTab === "heatmap" && (
        <div className="p-6 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white">Timeline Control</p>
              <p className="text-xs text-slate-500">Drag to visualize risk changes throughout the day</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-400">{getTimeLabel(timeOfDay)}</p>
              <p className="text-xs text-slate-500">Current Time</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Slider
              value={[timeOfDay]}
              onValueChange={(v) => setTimeOfDay(v[0])}
              min={0}
              max={23}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>11 PM</span>
            </div>
          </div>

          {/* Time-based insights */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Peak Crime Hours</p>
              <p className="text-lg font-bold text-orange-400">10 PM - 2 AM</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Safest Time Window</p>
              <p className="text-lg font-bold text-green-400">6 AM - 9 AM</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Current Status</p>
              <p className={`text-lg font-bold ${
                timeOfDay >= 22 || timeOfDay <= 6 ? "text-red-400" : 
                timeOfDay >= 18 ? "text-orange-400" : "text-green-400"
              }`}>
                {timeOfDay >= 22 || timeOfDay <= 6 ? "High Alert" : 
                 timeOfDay >= 18 ? "Elevated Risk" : "Normal"}
              </p>
            </div>
          </div>
        </div>
        )}
        </div>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-slate-400">Model Version</p>
          </div>
          <p className="text-xl font-bold text-white">PreCrime AI v3.2.1</p>
          <p className="text-xs text-slate-500 mt-1">Ensemble LSTM + GBM • Last updated: 2 min ago</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm text-slate-400">Data Sources</p>
          </div>
          <p className="text-xl font-bold text-white">2.4M Events</p>
          <p className="text-xs text-slate-500 mt-1">Last 5 years • 15 data streams active</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm text-slate-400">System Status</p>
          </div>
          <p className="text-xl font-bold text-green-400">All Systems Online</p>
          <p className="text-xs text-slate-500 mt-1">99.7% uptime • Real-time processing</p>
        </motion.div>
      </div>
    </div>
  );
}