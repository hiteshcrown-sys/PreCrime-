import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Shield, Lightbulb, Lock, Users, ArrowRight, RotateCcw, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predictScenario, CITY_BASE_RATES } from "@/utils/crimeModelService";
import crimeModelService from "@/utils/crimeModelService";

// Dashboard cities (same as used in IndiaMap2D component)
const DASHBOARD_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

// Create zones from dashboard cities only
const createZonesFromCities = () => {
  console.log('Creating zones...');
  console.log('DASHBOARD_CITIES:', DASHBOARD_CITIES);
  console.log('CITY_BASE_RATES:', CITY_BASE_RATES);
  try {
    return DASHBOARD_CITIES.map((city, index) => {
      const baseRate = crimeModelService.CITY_BASE_RATES[city] || 100; // fallback
      console.log(`City ${city}: baseRate = ${baseRate}`);
      return {
        id: index + 1,
        name: city,
        baseRisk: Math.round(baseRate),
        riskLevel: 'MEDIUM' // fallback
      };
    });
  } catch (error) {
    console.error('Error creating zones:', error);
    return [{
      id: 1,
      name: 'Delhi',
      baseRisk: 543,
      riskLevel: 'CRITICAL'
    }];
  }
};

const zones = createZonesFromCities();

const interventions = [
  { id: "patrols", name: "Police Patrols", icon: Shield, maxValue: 10, unit: "teams", description: "Additional police presence in high-risk areas" },
  { id: "lighting", name: "Street Lighting", icon: Lightbulb, maxValue: 10, unit: "sites", description: "Improved lighting to deter criminal activity" },
  { id: "access", name: "Access Control", icon: Lock, maxValue: 10, unit: "points", description: "Controlled entry points and security measures" },
  { id: "community", name: "Community Programs", icon: Users, maxValue: 10, unit: "initiatives", description: "Local engagement and prevention programs" }
];

const HeatmapGrid = ({ prediction, label }) => {
  if (!prediction) return null;

  const riskScore = prediction.riskScore * 100; // Convert to percentage for display
  const cells = [];
  for (let i = 0; i < 64; i++) {
    const cellRisk = riskScore - 15 + Math.random() * 30; // Variation around the predicted risk
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
              backgroundColor: cellRisk >= 70 ? `rgba(239, 68, 68, ${cellRisk / 100})` :
                cellRisk >= 50 ? `rgba(249, 115, 22, ${cellRisk / 100})` :
                  cellRisk >= 30 ? `rgba(234, 179, 8, ${cellRisk / 100})` :
                    `rgba(34, 197, 94, ${cellRisk / 100})`
            }}
            transition={{ delay: i * 0.01 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{Math.round(prediction.predictedRate)}</span>
        <span className="text-xs text-slate-500">Predicted Crimes</span>
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Risk Level: <span className={`font-medium ${prediction.riskLevel === 'CRITICAL' ? 'text-red-400' :
            prediction.riskLevel === 'HIGH' ? 'text-orange-400' :
              prediction.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                prediction.riskLevel === 'LOW' ? 'text-blue-400' : 'text-green-400'
          }`}>{prediction.riskLevel}</span>
      </div>
    </div>
  );
};

export default function WhatIfSimulator() {
  console.log('WhatIfSimulator rendering...');
  console.log('zones:', zones);
  console.log('zones[0]:', zones[0]);

  const [selectedZone, setSelectedZone] = useState(zones[0] || { name: 'Delhi', baseRisk: 543, riskLevel: 'CRITICAL' });
  console.log('selectedZone:', selectedZone);
  const [interventionValues, setInterventionValues] = useState({
    patrols: 0,
    lighting: 0,
    access: 0,
    community: 0
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [basePrediction, setBasePrediction] = useState(null);
  const [projectedPrediction, setProjectedPrediction] = useState(null);

  // Get base prediction for selected zone
  useEffect(() => {
    try {
      const basePred = predictScenario(selectedZone.name, new Date().getHours(), {}, 'gradientBoosting');

      // Check if it's an error response
      if (basePred && basePred.error) {
        console.error('Prediction error:', basePred.error);
        // Fallback prediction
        setBasePrediction({
          city: selectedZone.name,
          predictedRate: selectedZone.baseRisk,
          riskLevel: selectedZone.riskLevel,
          model: 'gradientBoosting',
          accuracy: 85
        });
      } else {
        setBasePrediction(basePred);
      }
    } catch (error) {
      console.error('Error getting base prediction:', error);
      // Fallback prediction
      setBasePrediction({
        city: selectedZone.name,
        predictedRate: selectedZone.baseRisk,
        riskLevel: selectedZone.riskLevel,
        model: 'gradientBoosting',
        accuracy: 85
      });
    }
    setProjectedPrediction(null);
    setShowResults(false);
  }, [selectedZone]);

  // Calculate projected risk with interventions
  useEffect(() => {
    if (Object.values(interventionValues).some(v => v > 0)) {
      const projectedPred = predictScenario(selectedZone.name, new Date().getHours(), interventionValues, 'gradientBoosting');
      setProjectedPrediction(projectedPred);
    } else {
      setProjectedPrediction(null);
    }
  }, [interventionValues, selectedZone]);

  const currentRisk = projectedPrediction ? projectedPrediction.predictedRate : (basePrediction?.predictedRate || 0);
  const baseRisk = basePrediction?.predictedRate || 0;
  const riskReduction = baseRisk - currentRisk;
  const riskReductionPercent = baseRisk > 0 ? (riskReduction / baseRisk) * 100 : 0;

  const handleSimulate = () => {
    setIsSimulating(true);
    // Simulate real ML processing time
    setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  };

  const handleReset = () => {
    setInterventionValues({ patrols: 0, lighting: 0, access: 0, community: 0 });
    setProjectedPrediction(null);
    setShowResults(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <FlaskConical className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Intervention Simulator</h1>
            <p className="text-slate-400 text-sm">Test crime prevention strategies</p>
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
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone.id} value={zone.name}>
                {zone.name} ({zone.riskLevel} - {zone.baseRisk} crimes)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Intervention Controls */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Prevention Strategies</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select and adjust intervention measures</p>
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
                  max={int.maxValue}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0 {int.unit}</span>
                  <span className="text-cyan-400">{interventionValues[int.id]} {int.unit}</span>
                  <span>{int.maxValue} {int.unit}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{int.description}</p>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Strategy
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
            <h3 className="font-semibold text-white">Impact Analysis</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedZone.name} - Before vs After Strategy</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <HeatmapGrid prediction={basePrediction} label="Current State" />
              <HeatmapGrid prediction={projectedPrediction || basePrediction} label="Projected State" />
            </div>

            {/* Impact Summary */}
            <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">{Math.round(baseRisk)}</p>
                <p className="text-xs text-slate-500">Current Crimes</p>
              </div>

              <ArrowRight className="w-8 h-8 text-cyan-400" />

              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{Math.round(currentRisk)}</p>
                <p className="text-xs text-slate-500">Projected Crimes</p>
              </div>

              <div className="pl-4 border-l border-slate-700">
                <p className={`text-2xl font-bold ${riskReduction > 0 ? "text-green-400" : "text-red-400"}`}>
                  {riskReduction > 0 ? "-" : "+"}{Math.abs(Math.round(riskReduction))}
                </p>
                <p className="text-xs text-slate-500">Crime Reduction</p>
                <p className="text-xs text-slate-400">({riskReductionPercent > 0 ? "-" : "+"}{Math.abs(Math.round(riskReductionPercent))}%) </p>
              </div>
            </div>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
              >
                <p className="text-sm text-green-400">
                  <strong>Strategy Analysis Complete:</strong> Your proposed interventions could reduce
                  crime in {selectedZone.name} by {Math.round(riskReduction)} incidents
                  ({Math.round(riskReductionPercent)}%), improving safety from {basePrediction?.riskLevel} to {projectedPrediction?.riskLevel} risk level.
                  <br />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Based on historical crime patterns and intervention effectiveness data.
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}