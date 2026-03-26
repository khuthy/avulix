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
  red: { bg: "#FDECEA", icon: "#C0392B", border: "rgba(192,57,43,0.12)" },
  navy: { bg: "#E8EAF0", icon: "#1A2340", border: "rgba(26,35,64,0.12)" },
  lime: { bg: "#EEF7D6", icon: "#8DB531", border: "rgba(141,181,49,0.12)" },
  gray: { bg: "#F5F6F8", icon: "#4A5168", border: "rgba(74,81,104,0.12)" },
};

export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = "navy", className }: StatCardProps) {
  const cfg = colorConfig[color];
  const isPositive = (trend ?? 0) >= 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-default",
        className
      )}
      style={{ borderColor: cfg.border, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9DA3B4" }}>
          {title}
        </p>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{ backgroundColor: cfg.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: cfg.icon }} />
        </div>
      </div>
      <p className="text-3xl font-extrabold" style={{ color: "#1F2533" }}>
        {value}
      </p>
      {trend !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1.5 mt-2 text-xs font-semibold",
            isPositive ? "text-[#637F22]" : "text-[#C0392B]"
          )}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(trend)}%</span>
          {trendLabel && (
            <span className="font-normal" style={{ color: "#9DA3B4" }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
