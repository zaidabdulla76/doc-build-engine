import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Users,
  FileSearch,
  Shield,
  Zap,
  Brain,
  Network
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AIAgentsPanel } from "@/components/dashboard/AIAgentsPanel";
import { Navigation } from "@/components/layout/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Counterparty Due Diligence
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered autonomous risk assessment and monitoring
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
            <FileSearch className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Vendors"
            value="1,247"
            change="+12%"
            trend="up"
            icon={Users}
          />
          <StatsCard
            title="Risk Score Avg"
            value="68/100"
            change="-8%"
            trend="down"
            icon={Shield}
            positive
          />
          <StatsCard
            title="Active Alerts"
            value="23"
            change="+3"
            trend="up"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Processing Time"
            value="4.2 hrs"
            change="-86%"
            trend="down"
            icon={Clock}
            positive
          />
        </div>

        {/* AI Agents Panel */}
        <AIAgentsPanel />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Distribution */}
          <div className="lg:col-span-2">
            <RiskDistribution />
          </div>

          {/* Quick Actions */}
          <Card className="bg-card border-border p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/vendors">
                  <Users className="mr-2 h-4 w-4" />
                  View All Vendors
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/assessments">
                  <FileSearch className="mr-2 h-4 w-4" />
                  Pending Assessments
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/monitoring">
                  <Activity className="mr-2 h-4 w-4" />
                  Real-time Monitoring
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start" asChild>
                <Link to="/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Report
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">System Status</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Agents Active</span>
                  <span className="text-foreground font-medium">12/12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data Sources</span>
                  <span className="text-foreground font-medium">52</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="text-success font-medium">99.98%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>
    </div>
  );
};

export default Index;
