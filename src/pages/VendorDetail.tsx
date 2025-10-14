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
  Trash2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";

const VendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Opening vendor editor..."
    });
  };

  const handleDelete = () => {
    toast({
      title: "Vendor Deleted",
      description: `${vendor.name} has been removed`,
      variant: "destructive"
    });
    setTimeout(() => navigate("/vendors"), 1000);
  };

  // Simulated vendor data
  const vendor = {
    id: id || "1",
    name: "TechCorp Solutions",
    category: "IT Services",
    status: "Under Review",
    riskScore: 85,
    riskLevel: "Critical",
    lastAssessment: "2024-10-08",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "www.techcorp.com",
    address: "123 Tech Street, San Francisco, CA 94102",
    founded: "2015",
    employees: "250-500",
    revenue: "$45M",
    description: "Leading provider of enterprise software solutions specializing in cloud infrastructure and data analytics."
  };

  const riskHistory = [
    { month: "Apr", score: 45 },
    { month: "May", score: 52 },
    { month: "Jun", score: 68 },
    { month: "Jul", score: 75 },
    { month: "Aug", score: 82 },
    { month: "Sep", score: 85 }
  ];

  const assessments = [
    {
      id: 1,
      type: "Enhanced Due Diligence",
      date: "2024-10-08",
      status: "Completed",
      score: 85,
      findings: "3 critical issues identified"
    },
    {
      id: 2,
      type: "Financial Assessment",
      date: "2024-09-15",
      status: "Completed",
      score: 72,
      findings: "2 medium risk items"
    },
    {
      id: 3,
      type: "Compliance Review",
      date: "2024-08-20",
      status: "Completed",
      score: 68,
      findings: "All checks passed"
    }
  ];

  const documents = [
    { id: 1, name: "Financial_Statement_2024.pdf", type: "Financial", date: "2024-10-11", status: "Analyzed" },
    { id: 2, name: "Business_Registration.pdf", type: "Legal", date: "2024-09-20", status: "Analyzed" },
    { id: 3, name: "Compliance_Certificate.pdf", type: "Compliance", date: "2024-08-15", status: "Analyzed" }
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
              <p className="text-muted-foreground mt-1">{vendor.category}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  {vendor.riskLevel} Risk
                </Badge>
                <Badge variant="outline">{vendor.status}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-right mr-6">
              <div className="text-5xl font-bold text-foreground mb-1">{vendor.riskScore}</div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <Progress value={vendor.riskScore} className="h-2 w-32 mt-2" />
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
            <div className="text-sm text-foreground">{vendor.email}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <Phone className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Phone</div>
            <div className="text-sm text-foreground">{vendor.phone}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <Globe className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Website</div>
            <div className="text-sm text-foreground">{vendor.website}</div>
          </Card>
          
          <Card className="bg-card border-border p-6">
            <MapPin className="h-5 w-5 text-primary mb-2" />
            <div className="text-sm text-muted-foreground mb-1">Location</div>
            <div className="text-sm text-foreground">{vendor.address.split(',')[1]?.trim()}</div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
                    <span className="text-muted-foreground">Founded</span>
                    <span className="text-foreground font-medium">{vendor.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employees</span>
                    <span className="text-foreground font-medium">{vendor.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Revenue</span>
                    <span className="text-foreground font-medium">{vendor.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Assessment</span>
                    <span className="text-foreground font-medium">{vendor.lastAssessment}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
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

          <TabsContent value="assessments">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Assessment History</h3>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div 
                    key={assessment.id}
                    className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-foreground">{assessment.type}</h4>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {assessment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {assessment.date}
                          </span>
                          <span>Score: {assessment.score}/100</span>
                          <span>{assessment.findings}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Report</Button>
                    </div>
                  </div>
                ))}
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
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{doc.type}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground">{doc.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm text-foreground">{doc.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
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