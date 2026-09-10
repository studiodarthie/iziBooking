interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendColor?: "success" | "error" | "warning";
  statusText?: string;
  statusColor?: "success" | "error" | "warning";
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendColor = "success",
  statusText,
  statusColor = "success",
}: StatCardProps) {
  const getTextColor = (color: "success" | "error" | "warning") => {
    switch (color) {
      case "success":
        return "text-success";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-accent-500";
      default:
        return "text-ink/50";
    }
  };

  return (
    <div className="flex flex-col gap-1 border-b lg:border-b-0 lg:border-r border-ink/10 pb-4 lg:pb-0 lg:pr-6 last:border-0 last:pr-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/60">
        {title}
      </h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-4xl font-heading font-bold text-ink">
          {value}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs mt-1">
        <span className="text-ink/60">{subtitle}</span>
        
        {trend && (
          <span className={`font-medium ${getTextColor(trendColor)}`}>
            {trend}
          </span>
        )}
        
        {statusText && (
          <span className={`font-medium ${getTextColor(statusColor)}`}>
            {statusText}
          </span>
        )}
      </div>
    </div>
  );
}
