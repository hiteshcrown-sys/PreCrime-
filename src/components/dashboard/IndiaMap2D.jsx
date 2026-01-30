import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp } from "lucide-react";
import PatrolCars from "../patrol/PatrolCars";

// Major Indian cities with approximate positions on a stylized map
const cities = [
  { id: 1, name: "Delhi", x: 48, y: 25, risk: 87, population: 3.2 },
  { id: 2, name: "Mumbai", x: 35, y: 55, risk: 79, population: 12.4 },
  { id: 3, name: "Bangalore", x: 42, y: 72, risk: 65, population: 8.4 },
  { id: 4, name: "Chennai", x: 52, y: 75, risk: 58, population: 4.6 },
  { id: 5, name: "Kolkata", x: 72, y: 40, risk: 72, population: 4.5 },
  { id: 6, name: "Hyderabad", x: 48, y: 62, risk: 61, population: 6.8 },
  { id: 7, name: "Pune", x: 38, y: 58, risk: 52, population: 3.1 },
  { id: 8, name: "Ahmedabad", x: 32, y: 38, risk: 68, population: 5.6 },
  { id: 9, name: "Jaipur", x: 40, y: 32, risk: 54, population: 3.0 },
  { id: 10, name: "Lucknow", x: 55, y: 32, risk: 63, population: 2.8 }
];

const getRiskColor = (risk) => {
  if (risk >= 80) return { primary: "#ef4444", glow: "rgba(239, 68, 68, 0.6)", border: "#dc2626" };
  if (risk >= 60) return { primary: "#f97316", glow: "rgba(249, 115, 22, 0.5)", border: "#ea580c" };
  if (risk >= 40) return { primary: "#eab308", glow: "rgba(234, 179, 8, 0.4)", border: "#ca8a04" };
  return { primary: "#22c55e", glow: "rgba(34, 197, 94, 0.3)", border: "#16a34a" };
};

export default function IndiaMap2D({ timeOfDay = 18, onStateHover }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animatedCities, setAnimatedCities] = useState(cities);

  // Adjust risk based on time of day
  useEffect(() => {
    const nightMultiplier = timeOfDay >= 22 || timeOfDay <= 6 ? 1.2 : 1.0;
    const eveningMultiplier = timeOfDay >= 18 && timeOfDay < 22 ? 1.1 : 1.0;
    const multiplier = Math.max(nightMultiplier, eveningMultiplier);
    
    setAnimatedCities(cities.map(city => ({
      ...city,
      risk: Math.min(95, city.risk * multiplier)
    })));
  }, [timeOfDay]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgb(100, 116, 139)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
          <ellipse cx="50%" cy="50%" rx="40%" ry="45%" fill="url(#map-glow)" />
        </svg>
      </div>

      {/* India outline (simplified SVG path) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="india-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(30, 41, 59)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(15, 23, 42)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* Simplified India shape */}
        <path
          d="M 45,15 L 55,15 L 60,20 L 65,25 L 70,30 L 75,40 L 78,50 L 75,60 L 70,68 L 65,75 L 60,80 L 55,83 L 50,85 L 45,83 L 40,80 L 35,75 L 30,68 L 28,60 L 25,50 L 28,40 L 32,32 L 38,25 L 42,20 Z"
          fill="url(#india-gradient)"
          stroke="rgb(71, 85, 105)"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* Connection lines between cities */}
        <g opacity="0.15">
          <line x1="48" y1="25" x2="35" y2="55" stroke="rgb(6, 182, 212)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="48" y1="25" x2="72" y2="40" stroke="rgb(6, 182, 212)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="35" y1="55" x2="42" y2="72" stroke="rgb(6, 182, 212)" strokeWidth="0.5" strokeDasharray="2,2" />
        </g>
      </svg>

      {/* Patrol Cars */}
      <PatrolCars />

      {/* City markers */}
      {animatedCities.map((city, index) => {
        const colors = getRiskColor(city.risk);
        const size = 20 + (city.risk / 100) * 20; // Size based on risk
        
        return (
          <motion.div
            key={city.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            onMouseEnter={() => {
              setHoveredCity(city);
              onStateHover?.({ name: city.name, risk: Math.round(city.risk) });
            }}
            onMouseLeave={() => setHoveredCity(null)}
            whileHover={{ scale: 1.2 }}
          >
            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                width: size + 40,
                height: size + 40,
                background: colors.glow,
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%"
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main marker */}
            <motion.div
              className="relative rounded-full flex items-center justify-center font-bold text-white border-2 shadow-lg backdrop-blur-sm"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 30% 30%, ${colors.primary}dd, ${colors.primary}99)`,
                borderColor: colors.border,
                boxShadow: `0 0 20px ${colors.glow}, inset 0 2px 4px rgba(255,255,255,0.2)`
              }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2
              }}
            >
              <span className="text-xs drop-shadow-lg">{Math.round(city.risk)}</span>
              
              {/* Risk indicator spike */}
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 rounded-full"
                style={{
                  height: `${city.risk * 0.4}px`,
                  background: `linear-gradient(to top, ${colors.primary}, transparent)`,
                  filter: `drop-shadow(0 0 4px ${colors.primary})`
                }}
              />
            </motion.div>

            {/* Risk level indicator */}
            {city.risk >= 70 && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <TrendingUp className="w-2.5 h-2.5 text-white" />
              </motion.div>
            )}

            {/* City label */}
            <AnimatePresence>
              {hoveredCity?.id === city.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 pointer-events-none z-10"
                >
                  <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg px-4 py-3 shadow-2xl min-w-[160px]">
                    <p className="font-bold text-white text-sm mb-1">{city.name}</p>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-400">Risk Level:</span>
                      <span 
                        className="font-bold"
                        style={{ color: colors.primary }}
                      >
                        {Math.round(city.risk)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs mt-1">
                      <span className="text-slate-400">Population:</span>
                      <span className="text-slate-300">{city.population}M</span>
                    </div>
                  </div>
                  {/* Arrow pointer */}
                  <div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderBottom: "8px solid rgb(15, 23, 42)"
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-xl">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Risk Level
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
            <span className="text-slate-300">Low</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-sm" />
            <span className="text-slate-300">Medium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
            <span className="text-slate-300">High</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
            <span className="text-slate-300">Critical</span>
          </span>
        </div>
      </div>

      {/* Time indicator */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-500/30 shadow-xl">
        <p className="text-[10px] uppercase tracking-wider text-cyan-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          {timeOfDay >= 22 || timeOfDay <= 6 ? "High Alert Period" : 
           timeOfDay >= 18 ? "Evening - Elevated Risk" : "Normal Operations"}
        </p>
      </div>
    </div>
  );
}