/**
 * NCIS Pattern Cluster – light-themed, government-portal style.
 * Circular nodes, thin lines, color-coded clusters, percentage values.
 * No flashy effects; clean and readable.
 */
export default function NCISPatternCluster({
  patterns = [],
  connections = [],
  onPatternSelect,
  selectedPattern,
}) {
  const getPatternPos = (id) => {
    const p = patterns.find((p) => p.id === id);
    return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg border border-gray-200 bg-white/90 overflow-hidden">
      {/* Connection lines – thin and subtle */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, i) => {
          const from = getPatternPos(conn.from);
          const to = getPatternPos(conn.to);
          return (
            <line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeOpacity={0.4}
            />
          );
        })}
      </svg>

      {/* Pattern nodes – circular, color-coded, percentage inside */}
      {patterns.map((pattern) => (
        <button
          key={pattern.id}
          type="button"
          className="absolute cursor-pointer rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            transform: "translate(-50%, -50%)",
            width: pattern.size || 44,
            height: pattern.size || 44,
            background: `${pattern.color}20`,
            borderColor: selectedPattern?.id === pattern.id ? "#1e40af" : pattern.color,
            color: "#1e293b",
          }}
          onClick={() => onPatternSelect?.(pattern)}
        >
          <span>{pattern.similarity}%</span>
        </button>
      ))}

      {/* Legend – minimal */}
      <div className="absolute bottom-3 left-3 bg-white/95 border border-gray-200 rounded-md px-3 py-2 shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          Clusters
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-700">
          {[...new Set(patterns.map((p) => p.type))].slice(0, 4).map((type) => {
            const p = patterns.find((x) => x.type === type);
            return (
              <span key={type} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p?.color || "#64748b" }}
                />
                {type}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
