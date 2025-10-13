import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Network,
  RefreshCw
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AIAgentsPanel } from "@/components/dashboard/AIAgentsPanel";
import { Navigation } from "@/components/layout/Navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [priority, setPriority] = useState("");
  
  // Simulated stats that update
  const [stats, setStats] = useState({
    activeVendors: 1247,
    riskScore: 68,
    activeAlerts: 23,
    processingTime: 4.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeVendors: prev.activeVendors + Math.floor(Math.random() * 3) - 1,
        riskScore: Math.max(50, Math.min(85, prev.riskScore + (Math.random() * 2 - 1))),
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1),
        processingTime: Math.max(2, prev.processingTime + (Math.random() * 0.4 - 0.2))
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAssessment = () => {
    if (!vendorName || !assessmentType || !priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Assessment Created",
      description: `New ${assessmentType} assessment for ${vendorName} has been initiated`
    });
    
    setIsNewAssessmentOpen(false);
    setVendorName("");
    setAssessmentType("");
    setPriority("");
    
    setTimeout(() => navigate("/assessments"), 500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing Data",
      description: "Updating dashboard with latest information..."
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Updated",
        description: "All data has been refreshed successfully"
      });
    }, 2000);
  };

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
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  <FileSearch className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="vendor-name">Vendor Name *</Label>
                    <Input
                      id="vendor-name"
                      placeholder="Enter vendor name"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assessment-type">Assessment Type *</Label>
                    <Select value={assessmentType} onValueChange={setAssessmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Due Diligence</SelectItem>
                        <SelectItem value="financial">Financial Assessment</SelectItem>
                        <SelectItem value="compliance">Compliance Review</SelectItem>
                        <SelectItem value="security">Security Audit</SelectItem>
                        <SelectItem value="quick">Quick Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateAssessment} className="w-full">
                    Create Assessment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Vendors"
            value={stats.activeVendors.toLocaleString()}
            change="+12%"
            trend="up"
            icon={Users}
            onClick={() => navigate("/vendors")}
          />
          <StatsCard
            title="Risk Score Avg"
            value={`${stats.riskScore.toFixed(0)}/100`}
            change="-8%"
            trend="down"
            icon={Shield}
            positive
            onClick={() => navigate("/assessments")}
          />
          <StatsCard
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            change="+3"
            trend="up"
            icon={AlertTriangle}
            variant="warning"
            onClick={() => navigate("/monitoring")}
          />
          <StatsCard
            title="Processing Time"
            value={`${stats.processingTime.toFixed(1)} hrs`}
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
