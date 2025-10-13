import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  positive?: boolean;
  variant?: "default" | "warning";
  onClick?: () => void;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  positive = false,
  variant = "default",
  onClick
}: StatsCardProps) => {
  const isPositiveChange = positive ? trend === "down" : trend === "up";
  
  return (
    <Card 
      className={cn(
        "bg-card border-border p-6 hover:shadow-lg-custom transition-all duration-300",
        onClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          variant === "warning" ? "bg-warning/10" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            variant === "warning" ? "text-warning" : "text-primary"
          )} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="flex items-center mt-1 space-x-1">
            {trend === "up" ? (
              <TrendingUp className={cn(
                "h-4 w-4",
                isPositiveChange ? "text-success" : "text-destructive"
              )} />
            ) : (
              <TrendingDown className={cn(
                "h-4 w-4",
                isPositiveChange ? "text-success" : "text-destructive"
              )} />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositiveChange ? "text-success" : "text-destructive"
            )}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
