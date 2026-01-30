import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, Building2, MapPin, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { mlService } from "@/api/mlService";
import { Loader2 } from "lucide-react";

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30"
};

const cities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Kanpur', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nagpur', 'Indira Nagar', 'Srinagar', 'Meerut',
  'Ranchi', 'Bhubaneswar', 'Aligarh', 'Rajkot'
];


const roleIcons = {
  police: Shield,
  authorities: Building2
};

function ActionCard({ action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
            {action.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>{action.zone}</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3 h-3" />
            <span>{action.duration}</span>
          </div>
        </div>
        <Badge className={`${priorityColors[action.priority]} border text-xs`}>
          {action.priority}
        </Badge>
      </div>

      <p className="text-sm text-slate-400 mb-4">{action.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Effectiveness:</span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${action.effectiveness}%` }}
            />
          </div>
          <span className="text-xs text-cyan-400 font-medium">{action.effectiveness}%</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
      </div>
    </motion.div>
  );
}

export default function PreventionPlaybooks() {
  const [activeRole, setActiveRole] = useState("police");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [playbooks, setPlaybooks] = useState({ police: [], authorities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const fetchMLData = async () => {
    try {
      const pred = await mlService.fetchLivePrediction(selectedCity);
      setPrediction(pred);
      const actions = await mlService.fetchPreventionActions(selectedCity, pred.riskLevel || 'MEDIUM');
      setPlaybooks(actions);
      setError(null);
    } catch (err) {
      console.error("Failed to load ML playbooks:", err);
      setError("Failed to sync with ML API. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMLData();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMLData();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedCity]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <BookOpen className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Prevention Playbooks™</h1>
            <p className="text-slate-400 text-sm">Actionable intelligence for all stakeholders</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-sm text-white focus:ring-0 cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city} className="bg-slate-900">{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-400">
              {playbooks.police.length + playbooks.authorities.length} actions recommended
            </span>
          </div>
        </div>
      </div>

      {loading && !playbooks.police.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-400 animate-pulse">Fetching live ML predictions...</p>
        </div>
      ) : error && !playbooks.police.length ? (
        <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-red-400">{error}</p>
          <Button onClick={fetchMLData} variant="outline" className="mt-4 border-red-500/50 hover:bg-red-500/10">
            Retry Connection
          </Button>
        </div>
      ) : (
        <>


          {/* Role Tabs */}
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="w-full justify-start bg-slate-900/50 border border-slate-800 p-1 h-auto flex-wrap">
              <TabsTrigger
                value="police"
                className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2"
              >
                <Shield className="w-4 h-4" />
                Police Operations
              </TabsTrigger>
              <TabsTrigger
                value="authorities"
                className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-4 py-2"
              >
                <Building2 className="w-4 h-4" />
                City Authorities
              </TabsTrigger>
            </TabsList>

            {Object.entries(playbooks).map(([role, actions]) => (
              <TabsContent key={role} value={role} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {actions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ActionCard action={action} />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Summary Stats */}
          {playbooks.police.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm text-slate-400">High Priority</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {[...playbooks.police, ...playbooks.authorities].filter(a => a.priority === 'high').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Actions requiring immediate attention</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-sm text-slate-400">Current Risk</span>
                </div>
                <p className="text-2xl font-bold text-white">{prediction?.riskLevel || 'N/A'}</p>
                <p className="text-xs text-slate-500 mt-1">ML Prediction for {selectedCity}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-slate-400">Avg. Effectiveness</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round([...playbooks.police, ...playbooks.authorities].reduce((acc, curr) => acc + curr.effectiveness, 0) /
                    ([...playbooks.police, ...playbooks.authorities].length || 1))}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Based on historical outcomes</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
