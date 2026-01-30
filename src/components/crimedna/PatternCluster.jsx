import { motion } from "framer-motion";

const patterns = [
  { id: "DNA-001", x: 30, y: 35, size: 50, type: "Assault", similarity: 94, color: "#ef4444" },
  { id: "DNA-002", x: 55, y: 25, size: 42, type: "Vehicle Theft", similarity: 87, color: "#f97316" },
  { id: "DNA-003", x: 70, y: 50, size: 38, type: "Break-in", similarity: 82, color: "#eab308" },
  { id: "DNA-004", x: 25, y: 65, size: 35, type: "Vandalism", similarity: 76, color: "#22c55e" },
  { id: "DNA-005", x: 60, y: 70, size: 45, type: "Drug Activity", similarity: 91, color: "#8b5cf6" },
  { id: "DNA-006", x: 45, y: 50, size: 55, type: "Robbery", similarity: 96, color: "#ef4444" },
  { id: "DNA-007", x: 80, y: 30, size: 30, type: "Fraud", similarity: 68, color: "#06b6d4" }
];

const connections = [
  { from: "DNA-001", to: "DNA-006", strength: 0.8 },
  { from: "DNA-002", to: "DNA-003", strength: 0.6 },
  { from: "DNA-003", to: "DNA-004", strength: 0.5 },
  { from: "DNA-005", to: "DNA-006", strength: 0.7 },
  { from: "DNA-001", to: "DNA-005", strength: 0.4 }
];

export default function PatternCluster({ onPatternSelect, selectedPattern }) {
  const getPatternPos = (id) => {
    const p = patterns.find(p => p.id === id);
    return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl bg-slate-900/80 border border-slate-700/50 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dna-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="1" fill="rgb(100, 116, 139)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dna-grid)" />
        </svg>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, i) => {
          const from = getPatternPos(conn.from);
          const to = getPatternPos(conn.to);
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgb(34, 211, 238)"
              strokeWidth={conn.strength * 2}
              strokeOpacity={conn.strength * 0.4}
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            />
          );
        })}
      </svg>

      {/* Pattern nodes */}
      {patterns.map((pattern, index) => (
        <motion.div
          key={pattern.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            transform: "translate(-50%, -50%)"
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
          whileHover={{ scale: 1.15 }}
          onClick={() => onPatternSelect?.(pattern)}
        >
          {/* Outer glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-md"
            style={{
              width: pattern.size + 20,
              height: pattern.size + 20,
              background: pattern.color,
              opacity: selectedPattern?.id === pattern.id ? 0.4 : 0.2,
              transform: "translate(-50%, -50%)",
              left: "50%",
              top: "50%"
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Node */}
          <div
            className="relative rounded-full flex items-center justify-center text-white font-bold text-xs border-2 backdrop-blur-sm transition-all"
            style={{
              width: pattern.size,
              height: pattern.size,
              background: `${pattern.color}33`,
              borderColor: selectedPattern?.id === pattern.id ? "#fff" : pattern.color,
              boxShadow: selectedPattern?.id === pattern.id 
                ? `0 0 20px ${pattern.color}, 0 0 40px ${pattern.color}40`
                : `0 0 10px ${pattern.color}40`
            }}
          >
            <span className="text-[10px]">{pattern.similarity}%</span>
          </div>

          {/* Label */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <div className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-[10px]">
              <p className="text-white font-medium">{pattern.id}</p>
              <p className="text-slate-400">{pattern.type}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Pattern Types</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          {patterns.slice(0, 4).map(p => (
            <span key={p.id} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              {p.type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}