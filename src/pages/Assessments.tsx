import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAssessments } from "@/hooks/useAssessments";
import { useVendors } from "@/hooks/useVendors";

const Assessments = () => {
  const { assessments, isLoading, addAssessment, deleteAssessment } = useAssessments();
  const { vendors } = useVendors();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    vendor_id: "",
    title: "Standard Assessment"
  });

  const handleNewAssessment = () => {
    if (!newAssessment.vendor_id || !newAssessment.title) {
      toast({
        title: "Missing Information",
        description: "Please select a vendor and assessment type",
        variant: "destructive"
      });
      return;
    }

    addAssessment(newAssessment);
    setNewAssessment({ vendor_id: "", title: "Standard Assessment" });
    setIsAddDialogOpen(false);
  };

  const handleCancelAssessment = (assessmentId: string, vendorName: string) => {
    deleteAssessment(assessmentId);
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

  const activeCount = assessments.filter(a => a.status === "in_progress").length;
  const pendingCount = assessments.filter(a => a.status === "pending").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assessments...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  <Label htmlFor="vendor">Select Vendor *</Label>
                  <Select value={newAssessment.vendor_id} onValueChange={(value) => setNewAssessment({ ...newAssessment, vendor_id: value })}>
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
                  <Label htmlFor="type">Assessment Type *</Label>
                  <Select value={newAssessment.title} onValueChange={(value) => setNewAssessment({ ...newAssessment, title: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quick Assessment">Quick Assessment</SelectItem>
                      <SelectItem value="Standard Assessment">Standard Assessment</SelectItem>
                      <SelectItem value="Enhanced Due Diligence">Enhanced Due Diligence</SelectItem>
                      <SelectItem value="Compliance Review">Compliance Review</SelectItem>
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
          {assessments.length === 0 ? (
            <Card className="bg-card border-border p-12">
              <div className="text-center text-muted-foreground">
                <p>No assessments found. Start a new assessment to get started.</p>
              </div>
            </Card>
          ) : (
            assessments.map((assessment: any) => (
              <Card key={assessment.id} className="bg-card border-border p-6 hover:shadow-lg-custom transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {assessment.vendors?.name || "Unknown Vendor"}
                      </h3>
                      <Badge variant="outline" className={
                        assessment.status === "completed" ? "bg-success/10 text-success border-success/20" :
                        assessment.status === "in_progress" ? "bg-accent/10 text-accent border-accent/20" :
                        assessment.status === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                        "bg-secondary/10 text-secondary border-secondary/20"
                      }>
                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{assessment.title}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = `/assessments/${assessment.id}`}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelAssessment(assessment.id, assessment.vendors?.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Status</div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(assessment.status === "in_progress" ? "In Progress" : "Pending Review")}
                      <span className="font-medium text-foreground">
                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Created</div>
                    <div className="font-medium text-foreground">{new Date(assessment.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Score</div>
                    <div className="font-medium text-foreground">{assessment.score || "Pending"}</div>
                  </div>
                </div>

                {assessment.score && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="text-sm font-semibold text-foreground">{assessment.score}/100</span>
                    </div>
                    <Progress value={assessment.score} className="h-2" />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Assessments;
