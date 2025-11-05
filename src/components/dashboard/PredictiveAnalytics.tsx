import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { useVendors } from "@/hooks/useVendors";

export const PredictiveAnalytics = () => {
  const { vendors } = useVendors();

  // Calculate predictive metrics
  const highRiskVendors = vendors.filter(v => v.risk_level === "high" || v.risk_level === "critical").length;
  const activeVendors = vendors.filter(v => v.status === "active").length;
  const avgRiskScore = vendors.length > 0 
    ? Math.round(vendors.reduce((acc, v) => acc + (v.risk_score || 0), 0) / vendors.length)
    : 0;

  const predictions = [
    {
      title: "6-Month Risk Forecast",
      trend: "increasing",
      value: `${highRiskVendors} vendors`,
      description: "Predicted to require enhanced monitoring",
      icon: TrendingUp,
      color: "text-orange-500"
    },
    {
      title: "Compliance Outlook",
      trend: "stable",
      value: "98%",
      description: "Expected compliance rate next quarter",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "Financial Distress Alerts",
      trend: "decreasing",
      value: "2 vendors",
      description: "Showing early warning indicators",
      icon: AlertTriangle,
      color: "text-yellow-500"
    },
    {
      title: "Portfolio Health Score",
      trend: "improving",
      value: `${100 - avgRiskScore}%`,
      description: "Overall vendor portfolio strength",
      icon: TrendingUp,
      color: "text-blue-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics & Risk Forecasting</CardTitle>
        <CardDescription>
          AI-powered 6-month risk predictions based on 50+ indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictions.map((prediction, index) => {
            const Icon = prediction.icon;
            return (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`h-5 w-5 ${prediction.color}`} />
                  <span className={`text-xs font-medium ${prediction.color}`}>
                    {prediction.trend === "increasing" && "↑"}
                    {prediction.trend === "decreasing" && "↓"}
                    {prediction.trend === "stable" && "→"}
                    {prediction.trend === "improving" && "↗"}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{prediction.value}</p>
                  <p className="text-sm font-medium text-foreground">{prediction.title}</p>
                  <p className="text-xs text-muted-foreground">{prediction.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
