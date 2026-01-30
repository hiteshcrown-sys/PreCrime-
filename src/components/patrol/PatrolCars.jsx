import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const initialPatrols = [
  { id: 1, x: 30, y: 35, targetX: 45, targetY: 50, zone: "Delhi Central" },
  { id: 2, x: 60, y: 40, targetX: 50, targetY: 30, zone: "Kolkata East" },
  { id: 3, x: 40, y: 60, targetX: 55, targetY: 75, zone: "Bangalore South" },
  { id: 4, x: 70, y: 50, targetX: 35, targetY: 55, zone: "Mumbai West" },
  { id: 5, x: 50, y: 30, targetX: 42, targetY: 72, zone: "Chennai North" }
];

export default function PatrolCars() {
  const [patrols, setPatrols] = useState(initialPatrols);

  useEffect(() => {
    const interval = setInterval(() => {
      setPatrols(prev => prev.map(patrol => {
        const shouldMove = Math.random() > 0.5;
        return shouldMove ? {
          ...patrol,
          x: patrol.targetX,
          y: patrol.targetY,
          targetX: 20 + Math.random() * 60,
          targetY: 20 + Math.random() * 60
        } : patrol;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {patrols.map((patrol) => (
        <motion.div
          key={patrol.id}
          className="absolute pointer-events-none"
          style={{ left: `${patrol.x}%`, top: `${patrol.y}%` }}
          animate={{
            left: `${patrol.targetX}%`,
            top: `${patrol.targetY}%`
          }}
          transition={{
            duration: 3,
            ease: "linear"
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-lg bg-cyan-400/40"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              style={{ width: 32, height: 32, transform: "translate(-50%, -50%)" }}
            />
            
            {/* Car icon */}
            <div className="relative w-8 h-8 rounded-full bg-cyan-500 border-2 border-cyan-300 flex items-center justify-center shadow-lg">
              <Truck className="w-4 h-4 text-white" />
            </div>
            
            {/* Unit label */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-cyan-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
              Unit {patrol.id}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}