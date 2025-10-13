import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, XCircle, AlertTriangle, User, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Workflows = () => {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      vendor: "TechCorp Solutions",
      type: "Enhanced Due Diligence",
      submittedBy: "Risk Assessment Agent",
      submittedDate: "2024-10-11",
      riskLevel: "Medium",
      findings: "3 minor compliance issues identified",
      recommendation: "Approve with conditions"
    },
    {
      id: 2,
      vendor: "DataFlow Systems",
      type: "Standard Assessment",
      submittedBy: "Data Collection Agent",
      submittedDate: "2024-10-10",
      riskLevel: "Low",
      findings: "All checks passed",
      recommendation: "Approve"
    },
    {
      id: 3,
      vendor: "Global Logistics Ltd",
      type: "Enhanced Due Diligence",
      submittedBy: "Investigation Agent",
      submittedDate: "2024-10-09",
      riskLevel: "High",
      findings: "2 critical issues: Previous sanctions violation, Uncertain ownership structure",
      recommendation: "Reject or request additional information"
    }
  ]);

  const [completedApprovals, setCompletedApprovals] = useState([
    {
      id: 4,
      vendor: "SecureCloud Inc",
      type: "Quick Assessment",
      approvedBy: "John Smith",
      completedDate: "2024-10-08",
      decision: "Approved",
      riskLevel: "Low"
    },
    {
      id: 5,
      vendor: "Innovation Labs",
      type: "Standard Assessment",
      approvedBy: "Sarah Johnson",
      completedDate: "2024-10-07",
      decision: "Rejected",
      riskLevel: "High"
    }
  ]);

  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState("");

  const handleReview = (approval: any) => {
    setSelectedApproval(approval);
    setIsReviewDialogOpen(true);
    setReviewComments("");
  };

  const handleApprove = () => {
    if (selectedApproval) {
      setPendingApprovals(pendingApprovals.filter(a => a.id !== selectedApproval.id));
      setCompletedApprovals([
        {
          id: selectedApproval.id,
          vendor: selectedApproval.vendor,
          type: selectedApproval.type,
          approvedBy: "Current User",
          completedDate: new Date().toISOString().split('T')[0],
          decision: "Approved",
          riskLevel: selectedApproval.riskLevel
        },
        ...completedApprovals
      ]);
      
      setIsReviewDialogOpen(false);
      setSelectedApproval(null);
      
      toast({
        title: "Assessment Approved",
        description: `${selectedApproval.vendor} has been approved`
      });
    }
  };

  const handleReject = () => {
    if (selectedApproval) {
      setPendingApprovals(pendingApprovals.filter(a => a.id !== selectedApproval.id));
      setCompletedApprovals([
        {
          id: selectedApproval.id,
          vendor: selectedApproval.vendor,
          type: selectedApproval.type,
          approvedBy: "Current User",
          completedDate: new Date().toISOString().split('T')[0],
          decision: "Rejected",
          riskLevel: selectedApproval.riskLevel
        },
        ...completedApprovals
      ]);
      
      setIsReviewDialogOpen(false);
      setSelectedApproval(null);
      
      toast({
        title: "Assessment Rejected",
        description: `${selectedApproval.vendor} has been rejected`,
        variant: "destructive"
      });
    }
  };

  const handleRequestInfo = () => {
    if (selectedApproval) {
      toast({
        title: "Additional Information Requested",
        description: `Request sent to ${selectedApproval.submittedBy}`
      });
      setIsReviewDialogOpen(false);
      setSelectedApproval(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Low": return "bg-success/10 text-success border-success/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Approval Workflows</h1>
          <p className="text-muted-foreground mt-2">Review and approve due diligence assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Approvals</span>
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-foreground">{pendingApprovals.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Awaiting your review</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Approved Today</span>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {completedApprovals.filter(a => a.decision === "Approved" && a.completedDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-sm text-success mt-1">+2 from yesterday</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg. Review Time</span>
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-foreground">2.4h</div>
            <p className="text-sm text-success mt-1">32% faster than target</p>
          </Card>
        </div>

        <Card className="bg-card border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Pending Approvals</h3>
          
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <Card key={approval.id} className="bg-secondary/20 border-border p-6 hover:shadow-lg-custom transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-foreground">{approval.vendor}</h4>
                      <Badge variant="outline" className={getRiskColor(approval.riskLevel)}>
                        {approval.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{approval.type}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{approval.submittedBy}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{approval.submittedDate}</span>
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReview(approval)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Key Findings</div>
                    <div className="text-sm text-foreground">{approval.findings}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">AI Recommendation</div>
                    <div className="text-sm text-foreground font-medium">{approval.recommendation}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Decisions</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Vendor</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Risk Level</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Decision</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Approved By</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {completedApprovals.map((approval) => (
                  <tr key={approval.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-foreground">{approval.vendor}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{approval.type}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className={getRiskColor(approval.riskLevel)}>
                        {approval.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {approval.decision === "Approved" ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span className="text-success font-medium">Approved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-destructive font-medium">Rejected</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{approval.approvedBy}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{approval.completedDate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Assessment: {selectedApproval?.vendor}</DialogTitle>
            </DialogHeader>
            
            {selectedApproval && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Assessment Type</div>
                    <div className="text-foreground font-medium">{selectedApproval.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                    <Badge variant="outline" className={getRiskColor(selectedApproval.riskLevel)}>
                      {selectedApproval.riskLevel} Risk
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Key Findings</div>
                  <div className="p-4 bg-secondary/20 rounded-lg text-foreground">{selectedApproval.findings}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">AI Recommendation</div>
                  <div className="p-4 bg-accent/10 rounded-lg text-foreground font-medium">
                    {selectedApproval.recommendation}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Review Comments</div>
                  <Textarea
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Add your comments or rationale for this decision..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center justify-between">
              <Button variant="outline" onClick={handleRequestInfo}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Request Info
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={handleApprove} className="bg-gradient-primary">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Workflows;
