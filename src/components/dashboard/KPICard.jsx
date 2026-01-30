import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GOV_NAVY, GOV_ACCENT_GREEN, GOV_ACCENT_ORANGE } from "@/lib/designTokens";

const ACCENT_STYLES = {
  green: { border: GOV_ACCENT_GREEN, value: GOV_ACCENT_GREEN },
  orange: { border: GOV_ACCENT_ORANGE, value: "#b45309" },
  red: { border: "#dc2626", value: "#dc2626" },
  navy: { border: GOV_NAVY, value: GOV_NAVY },
};

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  accentColor = "navy",
}) {
  const style = ACCENT_STYLES[accentColor] || ACCENT_STYLES.navy;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-red-600" : trend === "down" ? "text-green-600" : "text-gray-500";

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white/95 p-5 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: style.border }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900" style={{ color: ["green", "orange", "red"].includes(accentColor) ? style.value : undefined }}>
            {value}
          </p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
            <Icon className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>
      {trendValue && (
        <div className={cn("flex items-center gap-1 mt-3 text-sm", trendColor)}>
          <TrendIcon className="h-4 w-4" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
