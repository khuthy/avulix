import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariantMap: Record<string, "lime" | "amber" | "red" | "gray" | "blue"> = {
  // Lime (success/positive)
  ACTIVE: "lime",
  PAID: "lime",
  PRESENT: "lime",
  ACCEPTED: "lime",
  EXCELLENT: "lime",
  SETTLED: "lime",
  GOOD: "lime",
  SENT: "lime",

  // Amber (warning/pending)
  PENDING: "amber",
  OUTSTANDING: "amber",
  LATE: "amber",
  REVIEWING: "amber",
  PARTIAL: "amber",
  FAIR: "amber",

  // Red (negative)
  INACTIVE: "red",
  ABSENT: "red",
  REJECTED: "red",
  SUSPENDED: "red",
  POOR: "red",
  DAMAGED: "red",
  FAILED: "red",
  OVERDUE: "red",

  // Blue
  LOGIN: "blue",
  EXCUSED: "blue",
  DIGITAL: "blue",

  // Gray (neutral)
  RETURNED: "gray",
  ENDED: "gray",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status.toUpperCase()] ?? "gray";
  return (
    <Badge variant={variant} className={className}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
