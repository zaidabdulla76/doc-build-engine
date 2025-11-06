import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, TrendingUp, Bell, CheckCircle2, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useMonitoring } from "@/hooks/useMonitoring";

const Monitoring = () => {
  const { alerts: dbAlerts, isLoading, updateAlertStatus } = useMonitoring();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: "Critical",
      vendor: "TechCorp Solutions",
      type: "Financial Risk",
      message: "Significant drop in credit rating detected",
      time: "5 minutes ago",
      trend: "down"
    },
    {
      id: 2,
      severity: "High",
      vendor: "CloudBase Technologies",
      type: "Regulatory",
      message: "New compliance requirement identified",
      time: "23 minutes ago",
      trend: "neutral"
    },
    {
      id: 3,
      severity: "Medium",
      vendor: "DataFlow Systems",
      type: "Operational",
      message: "Supply chain disruption potential",
      time: "1 hour ago",
      trend: "down"
    },
    {
      id: 4,
      severity: "Low",
      vendor: "SecureNet Ltd",
      type: "Reputational",
      message: "Positive media coverage detected",
      time: "2 hours ago",
      trend: "up"
    }
  ]);

  const handleInvestigate = (alert: typeof alerts[0]) => {
    toast({
      title: "Opening Investigation",
      description: `Launching deep analysis for ${alert.vendor}...`
    });
  };

  const handleDismiss = (alertId: number | string) => {
    // Check if it's a database alert
    const dbAlert = dbAlerts.find((a: any) => a.id === alertId);
    if (dbAlert) {
      updateAlertStatus({ id: alertId as string, status: "resolved" });
    } else {
      // Mock alert
      setAlerts(alerts.filter(a => a.id !== alertId));
    }
    
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed from your active list"
    });
  };

  const handleViewAll = () => {
    toast({
      title: "Loading All Alerts",
      description: "Opening comprehensive alert dashboard..."
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "High": return "bg-warning/10 text-warning border-warning/20";
      case "Medium": return "bg-accent/10 text-accent border-accent/20";
      case "Low": return "bg-success/10 text-success border-success/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  // Combine mock alerts with database alerts
  const allAlerts = [
    ...alerts,
    ...dbAlerts.map((a: any) => ({
      id: a.id,
      severity: a.severity,
      vendor: a.vendors?.name || "Unknown Vendor",
      type: a.alert_type,
      message: a.message,
      time: new Date(a.created_at).toLocaleDateString(),
      trend: "neutral"
    }))
  ];

  const monitoringMetrics = [
    {
      title: "Active Monitors",
      value: "1,247",
      subtitle: "Vendors tracked 24/7",
      icon: Activity
    },
    {
      title: "Data Sources",
      value: "52",
      subtitle: "Real-time feeds",
      icon: CheckCircle2
    },
    {
      title: "Active Alerts",
      value: allAlerts.length.toString(),
      subtitle: "Requiring attention",
      icon: Bell
    },
    {
      title: "Resolution Rate",
      value: "94%",
      subtitle: "Avg. in 2 hours",
      icon: TrendingUp
    }
  ];

  const alertDistribution = {
    Critical: allAlerts.filter(a => a.severity === "Critical" || a.severity === "critical").length,
    High: allAlerts.filter(a => a.severity === "High" || a.severity === "high").length,
    Medium: allAlerts.filter(a => a.severity === "Medium" || a.severity === "medium").length,
    Low: allAlerts.filter(a => a.severity === "Low" || a.severity === "low").length
  };

  const totalAlerts = Object.values(alertDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Real-time Monitoring</h1>
            <p className="text-muted-foreground mt-2">24/7 AI-powered risk surveillance</p>
          </div>
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {monitoringMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="bg-card border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{metric.title}</span>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
              </Card>
            );
          })}
        </div>

        <Card className="bg-card border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
            <Button variant="outline" size="sm" onClick={handleViewAll}>
              View All Alerts
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading alerts...</p>
              </div>
            ) : allAlerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                <p>No active alerts at this time</p>
              </div>
            ) : (
              allAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-secondary/30 border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                        {alert.trend === "up" && (
                          <TrendingUp className="h-4 w-4 text-success" />
                        )}
                        {alert.trend === "down" && (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{alert.vendor}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleInvestigate(alert)}>
                        Investigate
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDismiss(alert.id)}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={[
                { date: '10/01', score: 65 },
                { date: '10/03', score: 68 },
                { date: '10/05', score: 72 },
                { date: '10/07', score: 75 },
                { date: '10/09', score: 71 },
                { date: '10/11', score: 69 }
              ]}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Alert Distribution</h3>
            <div className="space-y-3">
              {Object.entries(alertDistribution).map(([severity, count]) => (
                <div key={severity}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{severity}</span>
                    <span className="text-sm font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        severity === "Critical" ? "bg-destructive" :
                        severity === "High" ? "bg-warning" :
                        severity === "Medium" ? "bg-accent" :
                        "bg-success"
                      }`}
                      style={{
                        width: totalAlerts > 0 ? `${(count / totalAlerts) * 100}%` : "0%"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Monitoring;
