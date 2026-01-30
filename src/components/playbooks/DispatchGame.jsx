import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Truck, Play, RotateCcw, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const zones = [
  { id: "zone1", name: "Delhi Central", risk: 87, x: 30, y: 25 },
  { id: "zone2", name: "Mumbai West", risk: 79, x: 20, y: 45 },
  { id: "zone3", name: "Bangalore South", risk: 65, x: 35, y: 70 },
  { id: "zone4", name: "Kolkata East", risk: 72, x: 75, y: 30 },
  { id: "zone5", name: "Chennai North", risk: 58, x: 65, y: 75 }
];

const initialVehicles = [
  { id: "vehicle1", name: "Patrol Unit Alpha", assigned: false },
  { id: "vehicle2", name: "Patrol Unit Beta", assigned: false },
  { id: "vehicle3", name: "Patrol Unit Gamma", assigned: false },
  { id: "vehicle4", name: "Patrol Unit Delta", assigned: false }
];

export default function DispatchGame() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [zoneAssignments, setZoneAssignments] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;

    // Remove from previous zone if exists
    const newZoneAssignments = { ...zoneAssignments };
    Object.keys(newZoneAssignments).forEach(zoneId => {
      newZoneAssignments[zoneId] = newZoneAssignments[zoneId].filter(
        v => v.id !== result.draggableId
      );
    });

    // Add to new zone
    const vehicle = vehicles.find(v => v.id === result.draggableId);
    if (destination.droppableId !== "available") {
      if (!newZoneAssignments[destination.droppableId]) {
        newZoneAssignments[destination.droppableId] = [];
      }
      newZoneAssignments[destination.droppableId].push(vehicle);
    }

    setZoneAssignments(newZoneAssignments);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      const assignedCount = Object.values(zoneAssignments).flat().length;
      const totalHighRiskZones = zones.filter(z => z.risk >= 70).length;
      const coveredHighRisk = zones.filter(z => 
        z.risk >= 70 && zoneAssignments[z.id]?.length > 0
      ).length;
      
      const crimesPrevented = Math.floor(assignedCount * 2.5 + Math.random() * 5);
      const efficiency = Math.round((coveredHighRisk / totalHighRiskZones) * 100);
      
      setResults({
        crimesPrevented,
        efficiency,
        deployedUnits: assignedCount
      });
      setIsSimulating(false);
    }, 2000);
  };

  const handleReset = () => {
    setZoneAssignments({});
    setResults(null);
  };

  const getAssignedVehicles = (zoneId) => {
    return zoneAssignments[zoneId] || [];
  };

  const getAvailableVehicles = () => {
    const assignedIds = Object.values(zoneAssignments).flat().map(v => v.id);
    return vehicles.filter(v => !assignedIds.includes(v.id));
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map with Drop Zones */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h4 className="font-semibold text-white">Interactive Dispatch Map</h4>
                <p className="text-xs text-slate-500 mt-0.5">Drag patrol units onto high-risk zones</p>
              </div>
              
              <div className="relative h-[500px] bg-slate-900/80 p-4">
                {/* Grid background */}
                <div className="absolute inset-4 opacity-10">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="dispatch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(100, 116, 139)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dispatch-grid)" />
                  </svg>
                </div>

                {/* Zone markers */}
                {zones.map((zone) => {
                  const assigned = getAssignedVehicles(zone.id);
                  const hasPatrol = assigned.length > 0;
                  
                  return (
                    <Droppable key={zone.id} droppableId={zone.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="absolute"
                          style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: "translate(-50%, -50%)" }}
                        >
                          <motion.div
                            animate={hasPatrol ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`relative rounded-xl border-2 p-4 min-w-[140px] transition-all ${
                              snapshot.isDraggingOver 
                                ? "bg-cyan-500/20 border-cyan-500" 
                                : hasPatrol
                                  ? "bg-green-500/10 border-green-500/50"
                                  : zone.risk >= 70
                                    ? "bg-red-500/10 border-red-500/50"
                                    : "bg-slate-800/50 border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-white">{zone.name}</p>
                              {hasPatrol && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className={`text-sm font-bold ${
                                zone.risk >= 70 ? "text-red-400" : "text-orange-400"
                              }`}>{zone.risk}%</span>
                            </div>
                            
                            {assigned.length > 0 && (
                              <div className="space-y-1 mt-2">
                                {assigned.map((vehicle) => (
                                  <div key={vehicle.id} className="flex items-center gap-1 text-xs text-green-400">
                                    <Truck className="w-3 h-3" />
                                    <span>{vehicle.name.split(' ').pop()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {provided.placeholder}
                          </motion.div>

                          {/* Animated patrol route */}
                          {hasPatrol && results && (
                            <motion.div
                              className="absolute inset-0 rounded-xl border-2 border-green-400"
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Available Units & Controls */}
          <div className="space-y-6">
            {/* Available Units */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <h4 className="font-semibold text-white">Available Units</h4>
                <p className="text-xs text-slate-500 mt-0.5">{getAvailableVehicles().length} units ready</p>
              </div>
              
              <Droppable droppableId="available">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-4 space-y-2 min-h-[200px]"
                  >
                    {getAvailableVehicles().map((vehicle, index) => (
                      <Draggable key={vehicle.id} draggableId={vehicle.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded-lg border transition-all cursor-move ${
                              snapshot.isDragging 
                                ? "bg-cyan-500/20 border-cyan-500 shadow-lg" 
                                : "bg-slate-800/50 border-slate-700 hover:bg-slate-800/80"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm text-white">{vehicle.name}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <Button
                onClick={handleSimulate}
                disabled={isSimulating || Object.keys(zoneAssignments).length === 0}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
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
                className="w-full border-slate-700 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>

            {/* Results */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 p-4"
                >
                  <p className="text-sm font-semibold text-green-400 mb-3">Simulation Results</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Crimes Prevented</span>
                      <span className="text-lg font-bold text-white">{results.crimesPrevented}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Deployment Efficiency</span>
                      <span className="text-lg font-bold text-cyan-400">{results.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Units Deployed</span>
                      <span className="text-lg font-bold text-purple-400">{results.deployedUnits}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}