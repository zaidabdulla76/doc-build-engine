import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Edit,
  Trash2,
  Users,
  Bot,
  UserCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import { agents } from "@/data/agents";
import { useVendorDetail } from "@/hooks/useVendorDetail";
import { useVendors } from "@/hooks/useVendors";
import { useStakeholders } from "@/hooks/useStakeholders";

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vendor, assignedAgents, isLoading, assessments, documents } = useVendorDetail(id!);
  const { deleteVendor } = useVendors();
  const { stakeholders: vendorStakeholders } = useStakeholders(id);

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Opening vendor editor..."
    });
  };

  const handleDelete = () => {
    if (!vendor) return;
    deleteVendor(vendor.id);
    setTimeout(() => navigate("/vendors"), 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vendor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Vendor Not Found</h2>
            <p className="text-muted-foreground mb-4">The vendor you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/vendors")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vendors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const assignedAgentDetails = agents.filter(agent => 
    assignedAgents?.includes(agent.id)
  );

  const riskHistory = [
    { month: "Apr", score: 45 },
    { month: "May", score: 52 },
    { month: "Jun", score: 68 },
    { month: "Jul", score: 75 },
    { month: "Aug", score: 82 },
    { month: "Sep", score: vendor.risk_score }
  ];

  const keyFindings = [
    {
      severity: "Critical",
      title: "Previous sanctions violation detected",
      description: "Company was subject to regulatory sanctions in 2022",
      date: "2024-10-08"
    },
    {
      severity: "High",
      title: "Ownership structure concerns",
      description: "Complex ownership structure with offshore entities",
      date: "2024-10-08"
    },
    {
      severity: "Medium",
      title: "Financial performance decline",
      description: "Revenue decreased by 15% year-over-year",
      date: "2024-09-15"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "High": return "bg-warning/10 text-warning border-warning/20";
      case "Medium": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-success/10 text-success border-success/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/vendors")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Button>

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">{vendor.name}</h1>
              <p className="text-muted-foreground mt-1">{vendor.category || "N/A"}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className={`${
                  vendor.risk_level === "critical" ? "bg-destructive/10 text-destructive border-destructive/20" :
                  vendor.risk_level === "high" ? "bg-warning/10 text-warning border-warning/20" :
                  vendor.risk_level === "medium" ? "bg-accent/10 text-accent border-accent/20" :
                  "bg-success/10 text-success border-success/20"
                }`}>
                  {vendor.risk_level.charAt(0).toUpperCase() + vendor.risk_level.slice(1)} Risk
                </Badge>
                <Badge variant="outline">{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-right mr-6">
              <div className="text-5xl font-bold text-foreground mb-1">{vendor.risk_score}</div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <Progress value={vendor.risk_score} className="h-2 w-32 mt-2" />
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <Mail className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Email</div>
            <div className="text-sm text-foreground">{vendor.email || "N/A"}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <Phone className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Phone</div>
            <div className="text-sm text-foreground">{vendor.phone || "N/A"}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <Globe className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Website</div>
            <div className="text-sm text-foreground">{vendor.website || "N/A"}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <MapPin className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Location</div>
            <div className="text-sm text-foreground">{vendor.address?.split(',')[1]?.trim() || vendor.address || "N/A"}</div>
          </Card>
        </div>

        <Card className="bg-card border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Assigned AI Agents
            </h3>
            <Badge variant="outline">{assignedAgentDetails.length} Active</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assignedAgentDetails.map((agent) => (
              <div 
                key={agent.id}
                className="border border-border rounded-lg p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">{agent.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{agent.specialty}</div>
                    <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {assignedAgentDetails.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No agents assigned to this vendor yet. Edit vendor to assign agents.
            </p>
          )}
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="findings">Key Findings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-foreground font-medium">{new Date(vendor.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-foreground font-medium">{vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className="text-foreground font-medium">{vendor.risk_level.charAt(0).toUpperCase() + vendor.risk_level.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground font-medium">{new Date(vendor.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Category: {vendor.category || "N/A"}</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Risk Score Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={riskHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--destructive))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stakeholders">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  Stakeholders
                </h3>
                <Button size="sm" onClick={() => navigate("/stakeholders")}>
                  Manage All Stakeholders
                </Button>
              </div>
              <div className="space-y-4">
                {vendorStakeholders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No stakeholders assigned to this vendor</p>
                ) : (
                  vendorStakeholders.map((stakeholder) => (
                    <div 
                      key={stakeholder.id}
                      className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <UserCircle className="h-10 w-10 text-muted-foreground" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{stakeholder.name}</h4>
                            {stakeholder.role && (
                              <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                            )}
                            {stakeholder.department && (
                              <p className="text-xs text-muted-foreground">{stakeholder.department}</p>
                            )}
                            <div className="flex flex-col gap-1 mt-2">
                              {stakeholder.email && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {stakeholder.email}
                                </div>
                              )}
                              {stakeholder.phone && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {stakeholder.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {stakeholder.influence_level && (
                            <Badge variant={
                              stakeholder.influence_level === "high" ? "destructive" :
                              stakeholder.influence_level === "medium" ? "default" :
                              "secondary"
                            }>
                              {stakeholder.influence_level} influence
                            </Badge>
                          )}
                          {stakeholder.persona_type && (
                            <Badge variant="outline">{stakeholder.persona_type}</Badge>
                          )}
                        </div>
                      </div>
                      {stakeholder.notes && (
                        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
                          {stakeholder.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Assessment History</h3>
              <div className="space-y-4">
                {assessments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No assessments found for this vendor</p>
                ) : (
                  assessments.map((assessment) => (
                    <div 
                      key={assessment.id}
                      className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-foreground">{assessment.title}</h4>
                            <Badge variant="outline" className={`${
                              assessment.status === "completed" ? "bg-success/10 text-success border-success/20" :
                              assessment.status === "in_progress" ? "bg-accent/10 text-accent border-accent/20" :
                              assessment.status === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                              "bg-secondary/10 text-secondary border-secondary/20"
                            }`}>
                              {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1).replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(assessment.created_at).toLocaleDateString()}
                            </span>
                            {assessment.score && <span>Score: {assessment.score}/100</span>}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/assessments/${assessment.id}`)}>View Report</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Documents</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Document Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Upload Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No documents found for this vendor
                        </td>
                      </tr>
                    ) : (
                      documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm text-foreground">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{doc.type || "N/A"}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className={`h-4 w-4 ${doc.status === "processed" ? "text-success" : "text-accent"}`} />
                              <span className="text-sm text-foreground">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="findings">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Key Findings</h3>
              <div className="space-y-4">
                {keyFindings.map((finding, index) => (
                  <div 
                    key={index}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                            {finding.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{finding.date}</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">{finding.title}</h4>
                        <p className="text-sm text-muted-foreground">{finding.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorDetail;