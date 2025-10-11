import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Assessments = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      vendor: "TechCorp Solutions",
      type: "Enhanced Due Diligence",
      status: "In Progress",
      progress: 65,
      assignedAgent: "Risk Assessment Agent",
      eta: "2 hours",
      priority: "High"
    },
    {
      id: 2,
      vendor: "DataFlow Systems",
      type: "Standard Assessment",
      status: "Data Collection",
      progress: 35,
      assignedAgent: "Data Collection Agent",
      eta: "4 hours",
      priority: "Medium"
    },
    {
      id: 3,
      vendor: "Global Logistics Ltd",
      type: "Enhanced Due Diligence",
      status: "Pending Review",
      progress: 90,
      assignedAgent: "Investigation Agent",
      eta: "30 minutes",
      priority: "High"
    },
    {
      id: 4,
      vendor: "SecureCloud Inc",
      type: "Quick Assessment",
      status: "In Progress",
      progress: 50,
      assignedAgent: "Risk Assessment Agent",
      eta: "1 hour",
      priority: "Low"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    vendor: "",
    type: "Standard Assessment",
    priority: "Medium"
  });

  const handleNewAssessment = () => {
    if (!newAssessment.vendor) {
      toast({
        title: "Missing Information",
        description: "Please enter a vendor name",
        variant: "destructive"
      });
      return;
    }

    const assessment = {
      id: assessments.length + 1,
      vendor: newAssessment.vendor,
      type: newAssessment.type,
      status: "In Progress",
      progress: 5,
      assignedAgent: "Risk Assessment Agent",
      eta: "3 hours",
      priority: newAssessment.priority
    };

    setAssessments([assessment, ...assessments]);
    setNewAssessment({ vendor: "", type: "Standard Assessment", priority: "Medium" });
    setIsAddDialogOpen(false);

    toast({
      title: "Assessment Started",
      description: `Due diligence assessment for ${assessment.vendor} has been initiated`
    });
  };

  const handleViewDetails = (vendor: string) => {
    toast({
      title: "Loading Details",
      description: `Opening detailed view for ${vendor}...`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress": return <Loader2 className="h-4 w-4 animate-spin" />;
      case "Pending Review": return <Clock className="h-4 w-4" />;
      case "Data Collection": return <Loader2 className="h-4 w-4 animate-spin" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Low": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  const activeCount = assessments.filter(a => a.status === "In Progress" || a.status === "Data Collection").length;
  const pendingCount = assessments.filter(a => a.status === "Pending Review").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Due Diligence Assessments</h1>
            <p className="text-muted-foreground mt-2">AI-powered risk assessment pipeline</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="vendor">Vendor Name *</Label>
                  <Input
                    id="vendor"
                    value={newAssessment.vendor}
                    onChange={(e) => setNewAssessment({ ...newAssessment, vendor: e.target.value })}
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Assessment Type</Label>
                  <Select value={newAssessment.type} onValueChange={(value) => setNewAssessment({ ...newAssessment, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quick Assessment">Quick Assessment</SelectItem>
                      <SelectItem value="Standard Assessment">Standard Assessment</SelectItem>
                      <SelectItem value="Enhanced Due Diligence">Enhanced Due Diligence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={newAssessment.priority} onValueChange={(value) => setNewAssessment({ ...newAssessment, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleNewAssessment} className="w-full">
                  Start Assessment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Assessments</span>
              <Loader2 className="h-5 w-5 text-accent animate-spin" />
            </div>
            <div className="text-3xl font-bold text-foreground">{activeCount}</div>
            <p className="text-sm text-muted-foreground mt-1">In progress now</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Awaiting approval</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg. Completion Time</span>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-foreground">4.2 hrs</div>
            <p className="text-sm text-success mt-1">86% faster than manual</p>
          </Card>
        </div>

        <div className="space-y-4">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="bg-card border-border p-6 hover:shadow-lg-custom transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{assessment.vendor}</h3>
                    <Badge variant="outline" className={getPriorityColor(assessment.priority)}>
                      {assessment.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{assessment.type}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(assessment.vendor)}>
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(assessment.status)}
                    <span className="font-medium text-foreground">{assessment.status}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Assigned Agent</div>
                  <div className="font-medium text-foreground">{assessment.assignedAgent}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Est. Completion</div>
                  <div className="font-medium text-foreground">{assessment.eta}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold text-foreground">{assessment.progress}%</span>
                </div>
                <Progress value={assessment.progress} className="h-2" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Assessments;
