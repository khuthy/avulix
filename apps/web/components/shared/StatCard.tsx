import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: "red" | "navy" | "lime" | "gray";
  className?: string;
}

const colorConfig = {
  red: { bg: "#FDECEA", icon: "#C0392B", border: "#C0392B20" },
  navy: { bg: "#E8EAF0", icon: "#1A2340", border: "#1A234020" },
  lime: { bg: "#EEF7D6", icon: "#8DB531", border: "#8DB53120" },
  gray: { bg: "#F5F6F8", icon: "#4A5168", border: "#4A516820" },
};

export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = "navy", className }: StatCardProps) {
  const cfg = colorConfig[color];
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
        className
      )}
      style={{ borderColor: cfg.border }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: cfg.bg }}>
          <Icon className="w-5 h-5" style={{ color: cfg.icon }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {trend !== undefined && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", isPositive ? "text-[#637F22]" : "text-[#C0392B]")}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend)}%</span>
          {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
