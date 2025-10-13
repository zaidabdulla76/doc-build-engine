import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const RecentActivity = () => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
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
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
              onClick={() => setSelectedActivity(activity)}
            >
              <div className={`h-10 w-10 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">{activity.vendor}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Vendor</h4>
                <p className="text-sm text-muted-foreground">{selectedActivity.vendor}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Event</h4>
                <p className="text-sm text-muted-foreground">{selectedActivity.message}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Time</h4>
                <p className="text-sm text-muted-foreground">{selectedActivity.time}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Type</h4>
                <Badge variant="outline">{selectedActivity.type}</Badge>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button 
                  onClick={() => {
                    navigate("/vendors");
                    setSelectedActivity(null);
                  }}
                  className="flex-1"
                >
                  View Vendor Details
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Notification Sent",
                      description: "Relevant team members have been notified"
                    });
                    setSelectedActivity(null);
                  }}
                >
                  Notify Team
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
