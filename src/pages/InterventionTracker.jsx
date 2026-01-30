import { useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Shield, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPICard from "@/components/dashboard/KPICard";

const interventions = [
  {
    id: 1,
    prediction: "Assault Pattern - Downtown Core",
    predictionTime: "2024-01-15 22:15",
    intervention: "Increased Foot Patrols",
    interventionTime: "2024-01-15 22:18",
    outcome: "prevented",
    confidence: 94,
    zone: "Downtown Core"
  },
  {
    id: 2,
    prediction: "Vehicle Theft Spike - Financial Hub",
    predictionTime: "2024-01-15 21:45",
    intervention: "Vehicle Checkpoint",
    interventionTime: "2024-01-15 21:52",
    outcome: "prevented",
    confidence: 87,
    zone: "Financial Hub"
  },
  {
    id: 3,
    prediction: "Break-in Cluster - Industrial District",
    predictionTime: "2024-01-15 20:30",
    intervention: "Surveillance Deployment",
    interventionTime: "2024-01-15 20:45",
    outcome: "occurred",
    confidence: 72,
    zone: "Industrial District"
  },
  {
    id: 4,
    prediction: "Robbery Alert - Harbor Area",
    predictionTime: "2024-01-15 19:15",
    intervention: "Undercover Officers",
    interventionTime: "2024-01-15 19:22",
    outcome: "prevented",
    confidence: 89,
    zone: "Harbor Area"
  },
  {
    id: 5,
    prediction: "Drug Activity - Old Town",
    predictionTime: "2024-01-15 18:00",
    intervention: "Community Liaison",
    interventionTime: "2024-01-15 18:15",
    outcome: "prevented",
    confidence: 76,
    zone: "Old Town"
  },
  {
    id: 6,
    prediction: "Vandalism Warning - Shopping District",
    predictionTime: "2024-01-15 17:30",
    intervention: "None (Low priority)",
    interventionTime: "-",
    outcome: "occurred",
    confidence: 58,
    zone: "Shopping District"
  },
  {
    id: 7,
    prediction: "Pickpocket Alert - Downtown Core",
    predictionTime: "2024-01-15 16:45",
    intervention: "Plainclothes Patrol",
    interventionTime: "2024-01-15 16:50",
    outcome: "prevented",
    confidence: 82,
    zone: "Downtown Core"
  },
  {
    id: 8,
    prediction: "Assault Pattern - Financial Hub",
    predictionTime: "2024-01-15 15:30",
    intervention: "Increased Visibility",
    interventionTime: "2024-01-15 15:35",
    outcome: "prevented",
    confidence: 91,
    zone: "Financial Hub"
  }
];

const stats = {
  totalPredictions: 156,
  prevented: 124,
  occurred: 32,
  successRate: 79.5,
  avgResponseTime: "7.2 min",
  modelImprovement: "+4.3%"
};

export default function InterventionTracker() {
  const [filter, setFilter] = useState("all");

  const filteredInterventions = filter === "all" 
    ? interventions 
    : interventions.filter(i => i.outcome === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <Target className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Intervention Tracker</h1>
          <p className="text-slate-400 text-sm">Closed-loop learning and effectiveness tracking</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Crimes prevented"
          icon={CheckCircle}
          accentColor="green"
          trend="up"
          trendValue="+2.1% this week"
        />
        <KPICard
          title="Predictions Made"
          value={stats.totalPredictions}
          subtitle="Last 30 days"
          icon={BarChart3}
          accentColor="cyan"
        />
        <KPICard
          title="Avg Response Time"
          value={stats.avgResponseTime}
          subtitle="Prediction to action"
          icon={Clock}
          accentColor="purple"
          trend="down"
          trendValue="-1.5 min improvement"
        />
        <KPICard
          title="Model Accuracy"
          value="94.2%"
          subtitle="Outcome verification"
          icon={TrendingUp}
          accentColor="green"
          trend="up"
          trendValue={stats.modelImprovement}
        />
      </div>

      {/* Success Rate Visualization */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Outcome Distribution</h3>
          <p className="text-xs text-slate-500 mt-0.5">Prediction outcomes for the last 30 days</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-8">
            {/* Donut chart */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="60" fill="none" stroke="rgb(51, 65, 85)" strokeWidth="20" />
                <motion.circle
                  cx="80" cy="80" r="60" fill="none"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 60 * 0.795} ${2 * Math.PI * 60}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1 }}
                />
                <motion.circle
                  cx="80" cy="80" r="60" fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 60 * 0.205} ${2 * Math.PI * 60}`}
                  strokeDashoffset={-2 * Math.PI * 60 * 0.795}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.prevented}</p>
                  <p className="text-xs text-slate-400">Prevented</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-white">Crimes Prevented</p>
                    <p className="text-xs text-slate-400">Successful interventions</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-400">{stats.prevented}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="font-medium text-white">Crimes Occurred</p>
                    <p className="text-xs text-slate-400">Despite prediction</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-400">{stats.occurred}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Intervention Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Prediction → Intervention → Outcome</p>
          </div>
          
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="prevented" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-xs">
                Prevented
              </TabsTrigger>
              <TabsTrigger value="occurred" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-xs">
                Occurred
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {filteredInterventions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Status icon */}
                <div className={`p-2 rounded-lg ${
                  item.outcome === "prevented" ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {item.outcome === "prevented" 
                    ? <CheckCircle className="w-5 h-5 text-green-400" />
                    : <XCircle className="w-5 h-5 text-red-400" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">{item.prediction}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.predictionTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {item.intervention}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.outcome === "prevented" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {item.outcome === "prevented" ? "Prevented" : "Occurred"}
                    </span>
                  </div>

                  {/* Timeline bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-slate-500">Prediction</span>
                    </div>
                    <div className="flex-1 h-1 bg-slate-700 rounded relative">
                      <div className={`absolute left-0 top-0 h-full rounded ${
                        item.outcome === "prevented" ? "bg-green-500" : "bg-red-500"
                      }`} style={{ width: `${item.confidence}%` }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className={`w-2 h-2 rounded-full ${
                        item.outcome === "prevented" ? "bg-green-400" : "bg-red-400"
                      }`} />
                      <span className="text-slate-500">Outcome</span>
                    </div>
                    <span className="text-xs text-cyan-400 ml-2">{item.confidence}% conf</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}