import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Brain,
  TrendingUp,
  Shield,
  DollarSign,
  Scale
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulated assessment data
  const assessment = {
    id: id || "1",
    vendor: "TechCorp Solutions",
    type: "Enhanced Due Diligence",
    status: "Pending Review",
    progress: 90,
    assignedAgent: "Risk Assessment Agent",
    startDate: "2024-10-08",
    eta: "30 minutes",
    priority: "High",
    overallRisk: 85,
    findings: {
      critical: 2,
      high: 3,
      medium: 5,
      low: 2
    }
  };

  const riskCategories = [
    {
      category: "Financial Risk",
      icon: DollarSign,
      score: 78,
      status: "High",
      findings: [
        "Revenue declined 15% year-over-year",
        "Debt-to-equity ratio above industry average",
        "Limited cash reserves for operations"
      ]
    },
    {
      category: "Compliance Risk",
      icon: Scale,
      score: 92,
      status: "Critical",
      findings: [
        "Previous regulatory sanctions in 2022",
        "Incomplete compliance documentation",
        "Missing required certifications"
      ]
    },
    {
      category: "Operational Risk",
      icon: Shield,
      score: 65,
      status: "Medium",
      findings: [
        "Single supplier dependency",
        "Limited business continuity planning",
        "Outdated IT infrastructure"
      ]
    },
    {
      category: "Reputational Risk",
      icon: TrendingUp,
      score: 42,
      status: "Low",
      findings: [
        "Generally positive customer reviews",
        "No recent negative media coverage",
        "Strong industry presence"
      ]
    }
  ];

  const timeline = [
    {
      timestamp: "2024-10-08 09:00",
      event: "Assessment Initiated",
      agent: "Risk Assessment Agent",
      status: "completed"
    },
    {
      timestamp: "2024-10-08 09:15",
      event: "Data Collection Started",
      agent: "Data Collection Agent",
      status: "completed"
    },
    {
      timestamp: "2024-10-08 10:30",
      event: "Financial Analysis Complete",
      agent: "Financial Analysis Agent",
      status: "completed"
    },
    {
      timestamp: "2024-10-08 11:45",
      event: "Compliance Check Complete",
      agent: "Compliance Agent",
      status: "completed"
    },
    {
      timestamp: "2024-10-08 13:00",
      event: "Final Report Generation",
      agent: "Report Generation Agent",
      status: "in_progress"
    },
    {
      timestamp: "2024-10-08 13:30",
      event: "Awaiting Human Review",
      agent: "Approval Workflow",
      status: "pending"
    }
  ];

  const aiRecommendations = [
    "Consider requiring additional financial guarantees before onboarding",
    "Request updated compliance certificates and documentation",
    "Implement enhanced monitoring with bi-weekly check-ins",
    "Establish alternative supplier relationships to reduce dependency"
  ];

  const handleApprove = () => {
    toast({
      title: "Assessment Approved",
      description: `${assessment.vendor} assessment has been approved`
    });
    navigate("/workflows");
  };

  const handleReject = () => {
    toast({
      title: "Assessment Rejected",
      description: `${assessment.vendor} assessment has been rejected`,
      variant: "destructive"
    });
    navigate("/workflows");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "High": return "bg-warning/10 text-warning border-warning/20";
      case "Medium": return "bg-accent/10 text-accent border-accent/20";
      case "Low": return "bg-success/10 text-success border-success/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/assessments")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{assessment.vendor}</h1>
            <p className="text-xl text-muted-foreground mb-3">{assessment.type}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {assessment.priority} Priority
              </Badge>
              <Badge variant="outline">{assessment.status}</Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-5xl font-bold text-destructive mb-1">{assessment.overallRisk}</div>
            <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
            <Progress value={assessment.progress} className="h-2 w-32" />
            <p className="text-xs text-muted-foreground mt-1">{assessment.progress}% Complete</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <FileText className="h-5 w-5 text-destructive mb-2" />
            <div className="text-2xl font-bold text-foreground">{assessment.findings.critical}</div>
            <div className="text-sm text-muted-foreground">Critical Findings</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <AlertTriangle className="h-5 w-5 text-warning mb-2" />
            <div className="text-2xl font-bold text-foreground">{assessment.findings.high}</div>
            <div className="text-sm text-muted-foreground">High Risk Items</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <Brain className="h-5 w-5 text-accent mb-2" />
            <div className="text-2xl font-bold text-foreground">{assessment.findings.medium}</div>
            <div className="text-sm text-muted-foreground">Medium Risk Items</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <CheckCircle2 className="h-5 w-5 text-success mb-2" />
            <div className="text-2xl font-bold text-foreground">{assessment.findings.low}</div>
            <div className="text-sm text-muted-foreground">Low Risk Items</div>
          </Card>
        </div>

        <Tabs defaultValue="findings" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="findings">Risk Assessment</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {riskCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="bg-card border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{category.category}</h3>
                          <Badge variant="outline" className={getStatusColor(category.status)}>
                            {category.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{category.score}</div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2 mb-4" />
                    <div className="space-y-2">
                      {category.findings.map((finding, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{finding}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Assessment Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-success/20' :
                        item.status === 'in_progress' ? 'bg-accent/20' :
                        'bg-muted'
                      }`}>
                        {item.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : item.status === 'in_progress' ? (
                          <Clock className="h-4 w-4 text-accent" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{item.event}</h4>
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.agent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI-Generated Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Based on comprehensive risk analysis</p>
                </div>
              </div>
              <div className="space-y-4">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-secondary/30 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={handleReject}>
            Reject Assessment
          </Button>
          <Button className="bg-gradient-primary" onClick={handleApprove}>
            Approve Assessment
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AssessmentDetail;