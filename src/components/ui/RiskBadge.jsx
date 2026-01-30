import { cn } from "@/lib/utils";

export default function RiskBadge({ level, size = "default" }) {
  const config = {
    critical: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/50", label: "Critical" },
    high: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/50", label: "High" },
    medium: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/50", label: "Medium" },
    low: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/50", label: "Low" },
    minimal: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/50", label: "Minimal" }
  };

  const { bg, text, border, label } = config[level] || config.medium;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      bg, text, border,
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span className={cn(
        "rounded-full animate-pulse",
        level === "critical" ? "bg-red-400" : level === "high" ? "bg-orange-400" : level === "low" ? "bg-green-400" : "bg-yellow-400",
        size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"
      )} />
      {label}
    </span>
  );
}