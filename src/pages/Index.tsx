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
import { RoleWelcome } from "@/components/dashboard/RoleWelcome";
import { RoleBasedAccess } from "@/components/dashboard/RoleBasedAccess";
import { Navigation } from "@/components/layout/Navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useVendors } from "@/hooks/useVendors";
import { useAssessments } from "@/hooks/useAssessments";

const Index = () => {
  const navigate = useNavigate();
  const { vendors } = useVendors();
  const { assessments, addAssessment } = useAssessments();
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [assessmentType, setAssessmentType] = useState("");

  const activeVendors = vendors.filter(v => v.status === "active").length;
  const avgRiskScore = vendors.length > 0 
    ? Math.round(vendors.reduce((sum, v) => sum + v.risk_score, 0) / vendors.length)
    : 0;
  const activeAssessments = assessments.filter(a => a.status === "in_progress").length;

  const handleCreateAssessment = () => {
    if (!selectedVendor || !assessmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addAssessment({
      vendor_id: selectedVendor,
      title: assessmentType
    });
    
    setIsNewAssessmentOpen(false);
    setSelectedVendor("");
    setAssessmentType("");
    
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
        {/* Role Welcome & Quick Access */}
        <RoleWelcome />
        <RoleBasedAccess />
        
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
                    <Label htmlFor="vendor-name">Select Vendor *</Label>
                    <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assessment-type">Assessment Type *</Label>
                    <Select value={assessmentType} onValueChange={setAssessmentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Due Diligence">Full Due Diligence</SelectItem>
                        <SelectItem value="Financial Assessment">Financial Assessment</SelectItem>
                        <SelectItem value="Compliance Review">Compliance Review</SelectItem>
                        <SelectItem value="Security Audit">Security Audit</SelectItem>
                        <SelectItem value="Quick Assessment">Quick Assessment</SelectItem>
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
            value={activeVendors.toLocaleString()}
            change="+12%"
            trend="up"
            icon={Users}
            onClick={() => navigate("/vendors")}
          />
          <StatsCard
            title="Risk Score Avg"
            value={`${avgRiskScore}/100`}
            change="-8%"
            trend="down"
            icon={Shield}
            positive
            onClick={() => navigate("/assessments")}
          />
          <StatsCard
            title="Active Assessments"
            value={activeAssessments.toString()}
            change="+3"
            trend="up"
            icon={AlertTriangle}
            variant="warning"
            onClick={() => navigate("/assessments")}
          />
          <StatsCard
            title="Total Vendors"
            value={vendors.length.toString()}
            change="-86%"
            trend="down"
            icon={Clock}
            positive
            onClick={() => navigate("/vendors")}
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
