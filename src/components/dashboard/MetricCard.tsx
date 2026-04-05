import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: number;
  change?: string; // ✅ now optional
  trend?: "up" | "down"; // ✅ now optional
  icon?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  icon,
}: MetricCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>

            <p className="text-3xl font-bold">{value}</p>

            {/* ✅ Only render growth section if provided */}
            {change && trend && (
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}

                <span
                  className={`text-sm font-medium ${
                    trend === "up"
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>

          {icon && (
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
