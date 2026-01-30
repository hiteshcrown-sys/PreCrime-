import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Shield, Users, Building2, MapPin, Clock, AlertTriangle, ChevronRight, Gamepad2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DispatchGame from "@/components/playbooks/DispatchGame";

const playbooks = {
  police: [
    {
      id: 1,
      title: "Increase Foot Patrols",
      zone: "Downtown Core",
      priority: "high",
      duration: "4 hours",
      description: "Deploy additional foot patrols to high-visibility areas during peak hours",
      effectiveness: 78
    },
    {
      id: 2,
      title: "Vehicle Checkpoint Setup",
      zone: "Industrial District",
      priority: "medium",
      duration: "2 hours",
      description: "Establish vehicle checkpoints at key entry/exit points",
      effectiveness: 65
    },
    {
      id: 3,
      title: "Undercover Surveillance",
      zone: "Harbor Area",
      priority: "high",
      duration: "6 hours",
      description: "Deploy plainclothes officers for surveillance operations",
      effectiveness: 82
    },
    {
      id: 4,
      title: "Community Liaison Deployment",
      zone: "Old Town",
      priority: "low",
      duration: "3 hours",
      description: "Engage community liaison officers for public interaction",
      effectiveness: 71
    }
  ],
  authorities: [
    {
      id: 1,
      title: "Emergency Lighting Deployment",
      zone: "Industrial District",
      priority: "high",
      duration: "48 hours",
      description: "Install temporary high-intensity lighting in dark spots",
      effectiveness: 74
    },
    {
      id: 2,
      title: "CCTV Coverage Enhancement",
      zone: "Downtown Core",
      priority: "high",
      duration: "Permanent",
      description: "Deploy mobile CCTV units to coverage gaps",
      effectiveness: 81
    },
    {
      id: 3,
      title: "Traffic Flow Modification",
      zone: "Financial Hub",
      priority: "medium",
      duration: "Peak hours",
      description: "Implement traffic calming measures and diversions",
      effectiveness: 62
    },
    {
      id: 4,
      title: "Public Alert System",
      zone: "All Zones",
      priority: "medium",
      duration: "Active alerts",
      description: "Push notifications to registered citizens in affected areas",
      effectiveness: 76
    }
  ]
};

const priorityColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30"
};

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
  const [activeTab, setActiveTab] = useState("playbooks");
  const [activeRole, setActiveRole] = useState("police");
  const RoleIcon = roleIcons[activeRole];

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
        
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-400">4 high-priority actions pending</span>
        </div>
      </div>

      {/* Main Tabs: Playbooks vs Dispatch Game */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
          <TabsTrigger 
            value="playbooks" 
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-6 py-2"
          >
            <BookOpen className="w-4 h-4" />
            Action Playbooks
          </TabsTrigger>
          <TabsTrigger 
            value="dispatch"
            className="flex items-center gap-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 px-6 py-2"
          >
            <Gamepad2 className="w-4 h-4" />
            Dispatch Game
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dispatch" className="mt-6">
          <DispatchGame />
        </TabsContent>

        <TabsContent value="playbooks">
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
        </TabsContent>
      </Tabs>

      {/* Summary Stats - only show for playbooks tab */}
      {activeTab === "playbooks" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm text-slate-400">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-xs text-slate-500 mt-1">Actions requiring immediate attention</p>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-sm text-slate-400">Pending Execution</span>
          </div>
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-slate-500 mt-1">Actions awaiting deployment</p>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-slate-400">Avg. Effectiveness</span>
          </div>
          <p className="text-2xl font-bold text-green-400">74%</p>
          <p className="text-xs text-slate-500 mt-1">Based on historical outcomes</p>
        </div>
      </div>
      )}
    </div>
  );
}