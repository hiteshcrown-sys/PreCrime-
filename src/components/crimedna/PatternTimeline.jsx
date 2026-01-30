import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import patternClusteringService from "@/utils/patternClusteringService";

export default function PatternTimeline({ patternId }) {
  const [timelineData, setTimelineData] = useState([]);
  const [maxValue, setMaxValue] = useState(100);

  // Generate timeline data whenever patternId changes
  useEffect(() => {
    try {
      let data;
      if (!patternId) {
        // Default timeline if no pattern selected
        data = patternClusteringService.formatPatternTimeline(null);
      } else {
        // Generate timeline for specific pattern
        data = patternClusteringService.formatPatternTimeline(patternId);
      }
      setTimelineData(data || []);
      if (data && data.length > 0) {
        setMaxValue(Math.max(...data.map(d => d.value || 0), 100));
      }
    } catch (err) {
      console.error('Timeline error:', err);
      // Fallback data
      const fallbackData = [
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
      setTimelineData(fallbackData);
      setMaxValue(96);
    }
  }, [patternId]);

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

      <div className="relative" style={{ height: "240px" }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[11px] text-slate-500 pr-2 text-right z-10">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>

        {/* SVG Trend Line Container */}
        <svg 
          className="absolute left-10 top-0 bottom-8 right-0 pointer-events-none" 
          preserveAspectRatio="none"
          viewBox="0 0 1000 160"
        >
          {timelineData.length > 0 && (
            <motion.polyline
              points={timelineData.map((item, i) => {
                const x = (i / (timelineData.length - 1)) * 1000;
                const y = 160 - (item.value / maxValue) * 155;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="rgb(34, 211, 238)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ strokeDasharray: 1000 }}
            />
          )}
        </svg>

        {/* Chart bars and dots */}
        <div className="absolute left-10 top-0 bottom-8 right-0 flex items-end gap-0.5 px-1">
          {timelineData.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            return (
              <div key={item.date} className="flex-1 flex flex-col items-center relative group">
                {/* Bar */}
                <motion.div
                  className="w-full bg-gradient-to-t from-cyan-500/60 to-cyan-400/30 rounded-t hover:from-cyan-500 hover:to-cyan-400 transition-colors"
                  style={{ 
                    height: `${heightPercent}%`,
                    minHeight: heightPercent > 0 ? "2px" : "0px"
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPercent}%`, opacity: 1 }}
                  transition={{ delay: index * 0.04, duration: 0.6 }}
                />
                
                {/* Event dot positioned above bar */}
                <motion.div
                  className="absolute w-2.5 h-2.5 bg-orange-400 rounded-full"
                  style={{ bottom: `${heightPercent}%`, marginBottom: "-5px" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 + 0.3, duration: 0.4 }}
                />
                
                {/* Label */}
                <span className="text-[10px] text-slate-500 mt-2 whitespace-nowrap">{item.date}</span>
              </div>
            );
          })}
        </div>

        {/* X-axis line */}
        <div className="absolute left-10 right-0 bottom-8 border-b border-slate-700/50" />
      </div>
    </div>
  );
}