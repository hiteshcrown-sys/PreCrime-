import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  accentColor = "cyan" 
}) {
  const colors = {
    cyan: "from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400",
    red: "from-red-500/20 to-transparent border-red-500/30 text-red-400",
    orange: "from-orange-500/20 to-transparent border-orange-500/30 text-orange-400",
    green: "from-green-500/20 to-transparent border-green-500/30 text-green-400",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400"
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-400" : trend === "down" ? "text-green-400" : "text-slate-400";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5",
      "bg-slate-900/50 backdrop-blur-sm",
      colors[accentColor]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg bg-slate-800/80", colors[accentColor].split(" ").pop())}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {trendValue && (
        <div className={cn("flex items-center gap-1 mt-3 text-sm", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{trendValue}</span>
        </div>
      )}
      
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-current to-transparent opacity-10" />
    </div>
  );
}