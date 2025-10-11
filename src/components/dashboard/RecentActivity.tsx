import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "alert",
      vendor: "TechCorp Solutions",
      message: "High risk alert: Financial instability detected",
      time: "5 minutes ago",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      id: 2,
      type: "complete",
      vendor: "Global Services Inc",
      message: "Due diligence completed successfully",
      time: "23 minutes ago",
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      id: 3,
      type: "pending",
      vendor: "DataFlow Systems",
      message: "Risk assessment in progress",
      time: "1 hour ago",
      icon: Clock,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      id: 4,
      type: "update",
      vendor: "SecureNet Ltd",
      message: "Risk score improved to 72/100",
      time: "2 hours ago",
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      id: 5,
      type: "alert",
      vendor: "CloudBase Technologies",
      message: "New regulatory compliance requirement",
      time: "3 hours ago",
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10"
    }
  ];

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Badge variant="outline">Last 24 hours</Badge>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className={`h-10 w-10 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">{activity.vendor}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
