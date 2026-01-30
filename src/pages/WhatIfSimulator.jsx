import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Shield, Lightbulb, Lock, Users, ArrowRight, RotateCcw, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const zones = [
  { id: 1, name: "Downtown Core", baseRisk: 87 },
  { id: 2, name: "Financial Hub", baseRisk: 79 },
  { id: 3, name: "Industrial District", baseRisk: 72 },
  { id: 4, name: "Harbor Area", baseRisk: 65 }
];

const interventions = [
  { id: "patrols", name: "Increase Patrols", icon: Shield, impact: -12, unit: "officers" },
  { id: "lighting", name: "Add Street Lighting", icon: Lightbulb, impact: -8, unit: "installations" },
  { id: "access", name: "Access Restrictions", icon: Lock, impact: -15, unit: "checkpoints" },
  { id: "community", name: "Community Programs", icon: Users, impact: -5, unit: "programs" }
];

const HeatmapGrid = ({ risk, label }) => {
  const cells = [];
  for (let i = 0; i < 64; i++) {
    const cellRisk = risk - 20 + Math.random() * 40;
    const normalizedRisk = Math.max(0, Math.min(100, cellRisk));
    cells.push(normalizedRisk);
  }

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">{label}</p>
      <div className="grid grid-cols-8 gap-1 mb-3">
        {cells.map((cellRisk, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              backgroundColor: cellRisk >= 70 ? `rgba(239, 68, 68, ${cellRisk/100})` :
                              cellRisk >= 50 ? `rgba(249, 115, 22, ${cellRisk/100})` :
                              cellRisk >= 30 ? `rgba(234, 179, 8, ${cellRisk/100})` :
                              `rgba(34, 197, 94, ${cellRisk/100})`
            }}
            transition={{ delay: i * 0.01 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{Math.round(risk)}%</span>
        <span className="text-xs text-slate-500">Avg Risk Score</span>
      </div>
    </div>
  );
};

export default function WhatIfSimulator() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [interventionValues, setInterventionValues] = useState({
    patrols: 0,
    lighting: 0,
    access: 0,
    community: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const calculateProjectedRisk = () => {
    let reduction = 0;
    interventions.forEach(int => {
      reduction += (interventionValues[int.id] / 10) * int.impact;
    });
    return Math.max(10, Math.min(95, selectedZone.baseRisk + reduction));
  };

  const projectedRisk = calculateProjectedRisk();
  const riskReduction = selectedZone.baseRisk - projectedRisk;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setInterventionValues({ patrols: 0, lighting: 0, access: 0, community: 0 });
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <FlaskConical className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">What-If Scenario Simulator</h1>
            <p className="text-slate-400 text-sm">Model intervention impact on risk levels</p>
          </div>
        </div>
        
        <Select 
          value={selectedZone.name} 
          onValueChange={(v) => {
            setSelectedZone(zones.find(z => z.name === v));
            setShowResults(false);
          }}
        >
          <SelectTrigger className="w-64 bg-slate-800 border-slate-700">
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone.id} value={zone.name}>
                {zone.name} (Base: {zone.baseRisk}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Intervention Controls */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Scenario Controls</h3>
            <p className="text-xs text-slate-500 mt-0.5">Adjust intervention levels to model impact</p>
          </div>
          
          <div className="p-6 space-y-6">
            {interventions.map((int) => (
              <div key={int.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <int.icon className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-white text-sm">{int.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {interventionValues[int.id]} {int.unit}
                  </span>
                </div>
                <Slider
                  value={[interventionValues[int.id]]}
                  onValueChange={(v) => {
                    setInterventionValues(prev => ({ ...prev, [int.id]: v[0] }));
                    setShowResults(false);
                  }}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>None</span>
                  <span className="text-cyan-400">Impact: {((interventionValues[int.id] / 10) * int.impact).toFixed(1)}%</span>
                  <span>Maximum</span>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              >
                {isSimulating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                    </motion.div>
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-700 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison View */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Impact Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedZone.name} - Before vs After</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <HeatmapGrid risk={selectedZone.baseRisk} label="Current State" />
              <HeatmapGrid risk={projectedRisk} label="Projected State" />
            </div>

            {/* Impact Summary */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">{selectedZone.baseRisk}%</p>
                <p className="text-xs text-slate-500">Current</p>
              </div>
              
              <ArrowRight className="w-8 h-8 text-cyan-400" />
              
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{Math.round(projectedRisk)}%</p>
                <p className="text-xs text-slate-500">Projected</p>
              </div>
              
              <div className="pl-4 border-l border-slate-700">
                <p className={`text-2xl font-bold ${riskReduction > 0 ? "text-green-400" : "text-red-400"}`}>
                  {riskReduction > 0 ? "-" : "+"}{Math.abs(Math.round(riskReduction))}%
                </p>
                <p className="text-xs text-slate-500">Change</p>
              </div>
            </div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
              >
                <p className="text-sm text-green-400">
                  <strong>Simulation Complete:</strong> The proposed interventions would reduce 
                  risk in {selectedZone.name} by approximately {Math.round(riskReduction)}%, 
                  bringing the zone from High Risk to {projectedRisk < 40 ? "Low" : projectedRisk < 60 ? "Medium" : "High"} Risk status.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}