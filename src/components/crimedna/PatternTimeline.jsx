import { motion } from "framer-motion";

const timelineData = [
  { date: "Jan", value: 45, events: 12 },
  { date: "Feb", value: 52, events: 18 },
  { date: "Mar", value: 68, events: 24 },
  { date: "Apr", value: 75, events: 31 },
  { date: "May", value: 82, events: 38 },
  { date: "Jun", value: 78, events: 35 },
  { date: "Jul", value: 85, events: 42 },
  { date: "Aug", value: 92, events: 48 },
  { date: "Sep", value: 88, events: 45 },
  { date: "Oct", value: 94, events: 52 },
  { date: "Nov", value: 96, events: 56 },
  { date: "Dec", value: 94, events: 54 }
];

export default function PatternTimeline({ patternId }) {
  const maxValue = Math.max(...timelineData.map(d => d.value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Pattern Evolution</h4>
          <p className="text-xs text-slate-500">Similarity trend over time</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded" />
            Match Rate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            Events
          </span>
        </div>
      </div>

      <div className="relative h-40">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] text-slate-500">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full flex items-end gap-1">
          {timelineData.map((item, index) => (
            <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
              {/* Bar */}
              <div className="w-full relative" style={{ height: `calc(100% - 20px)` }}>
                <motion.div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500/50 to-cyan-400/20 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                />
                
                {/* Event dot */}
                <motion.div
                  className="absolute w-2 h-2 bg-orange-400 rounded-full left-1/2 -translate-x-1/2"
                  style={{ bottom: `${(item.value / maxValue) * 100}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                />
              </div>
              
              {/* X-axis label */}
              <span className="text-[10px] text-slate-500">{item.date}</span>
            </div>
          ))}
        </div>

        {/* Trend line */}
        <svg className="absolute inset-0 ml-10 pointer-events-none" preserveAspectRatio="none">
          <motion.path
            d={`M ${timelineData.map((item, i) => {
              const x = (i / (timelineData.length - 1)) * 100;
              const y = 100 - (item.value / maxValue) * 85;
              return `${x}%,${y}%`;
            }).join(' L ')}`}
            fill="none"
            stroke="rgb(34, 211, 238)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </div>
  );
}