import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, TrendingUp, FileWarning, Globe } from "lucide-react";
import { useMonitoring } from "@/hooks/useMonitoring";
import { formatDistanceToNow } from "date-fns";

export const AlertsPanel = () => {
  const { alerts, updateAlertStatus } = useMonitoring();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "risk_score_change": return TrendingUp;
      case "compliance_issue": return FileWarning;
      case "financial_distress": return AlertCircle;
      case "regulatory_change": return Globe;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const newAlerts = alerts.filter(a => a.status === "new").slice(0, 5);

  if (newAlerts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Real-Time Monitoring Alerts</CardTitle>
            <CardDescription>
              24/7 continuous monitoring of 50+ risk indicators per vendor
            </CardDescription>
          </div>
          <Badge variant="destructive" className="h-6">
            {newAlerts.length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {newAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.alert_type);
            return (
              <div 
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Icon className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAlertStatus({ id: alert.id, status: "acknowledged" })}
                      >
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateAlertStatus({ id: alert.id, status: "investigating" })}
                      >
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
