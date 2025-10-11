import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const RiskDistribution = () => {
  const riskData = [
    { level: "Critical", count: 23, percentage: 1.8, color: "bg-destructive" },
    { level: "High", count: 87, percentage: 7.0, color: "bg-warning" },
    { level: "Medium", count: 342, percentage: 27.4, color: "bg-accent" },
    { level: "Low", count: 795, percentage: 63.8, color: "bg-success" },
  ];

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vendor Risk Distribution</h3>
        <Badge variant="outline">1,247 Total Vendors</Badge>
      </div>

      <div className="space-y-6">
        {riskData.map((risk) => (
          <div key={risk.level} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${risk.color}`} />
                <span className="font-medium text-foreground">{risk.level} Risk</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-muted-foreground">{risk.count} vendors</span>
                <span className="font-semibold text-foreground w-12 text-right">{risk.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${risk.color} transition-all duration-500`}
                style={{ width: `${risk.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Average Risk Score</div>
            <div className="text-2xl font-bold text-foreground mt-1">68/100</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Risk Trend</div>
            <div className="text-2xl font-bold text-success mt-1">-8% ↓</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
