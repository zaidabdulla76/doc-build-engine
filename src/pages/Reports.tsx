import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, BarChart3, TrendingUp, Calendar, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useReports } from "@/hooks/useReports";
import { useVendors } from "@/hooks/useVendors";

const Reports = () => {
  const { reports, isLoading, generateReport, deleteReport } = useReports();
  const { vendors } = useVendors();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  const reportTemplates = [
    {
      name: "Executive Risk Summary",
      description: "High-level overview of portfolio risk status",
      icon: BarChart3
    },
    {
      name: "Detailed Vendor Analysis",
      description: "Comprehensive due diligence report for specific vendor",
      icon: FileText
    },
    {
      name: "Compliance Status Report",
      description: "Regulatory compliance across vendor portfolio",
      icon: TrendingUp
    },
    {
      name: "Custom Report",
      description: "Build your own report with selected metrics",
      icon: Calendar
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      toast({
        title: "Missing Information",
        description: "Please select a report template",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    const reportName = `${reportTemplates.find(t => t.name === selectedTemplate)?.name} - ${new Date().toLocaleDateString()}`;
    
    generateReport({
      name: reportName,
      template: selectedTemplate,
      vendor_id: selectedVendor || undefined
    });

    setIsGenerating(false);
    setIsGenerateDialogOpen(false);
    setSelectedTemplate("");
    setSelectedVendor("");
  };

  const handleDownloadReport = (reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportTitle} is being downloaded...`
    });
  };

  const handleViewReport = (reportTitle: string) => {
    toast({
      title: "Opening Report",
      description: `Loading ${reportTitle}...`
    });
  };

  const handleDeleteReport = (reportId: string, reportTitle: string) => {
    deleteReport(reportId);
  };

  const handleDownloadAll = () => {
    const readyReports = reports.filter((r: any) => r.status === "ready");
    toast({
      title: "Downloading All Reports",
      description: `Preparing ${readyReports.length} reports for download...`
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
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
            <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">Comprehensive insights and documentation</p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                Generate New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="template">Report Template *</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.name} value={template.name}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Include Vendor (optional)</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateReport} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {reportTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.name}
                className="bg-card border-border p-6 hover:shadow-lg-custom transition-all cursor-pointer"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </Card>
            );
          })}
        </div>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Report Title</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Pages</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      No reports found. Generate a new report to get started.
                    </td>
                  </tr>
                ) : (
                  reports.map((report: any) => (
                    <tr key={report.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-foreground">{report.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline">{report.template || "N/A"}</Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">{report.vendors?.name || "All Vendors"}</span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="outline"
                          className={
                            report.status === "ready"
                              ? "bg-success/10 text-success border-success/20"
                              : report.status === "processing"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : report.status === "failed"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-secondary/10 text-secondary border-secondary/20"
                          }
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewReport(report.name)}
                          >
                            View
                          </Button>
                          {report.status === "ready" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadReport(report.name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteReport(report.id, report.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
