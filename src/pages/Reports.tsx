import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, BarChart3, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Q4 2024 Portfolio Risk Summary",
      type: "Executive Summary",
      date: "2024-10-11",
      status: "Ready",
      pages: 24
    },
    {
      id: 2,
      title: "Vendor Risk Assessment - TechCorp",
      type: "Individual Assessment",
      date: "2024-10-10",
      status: "Ready",
      pages: 42
    },
    {
      id: 3,
      title: "Compliance Audit Report October 2024",
      type: "Compliance",
      date: "2024-10-09",
      status: "In Progress",
      pages: 18
    },
    {
      id: 4,
      title: "Risk Trend Analysis - Last 6 Months",
      type: "Analytics",
      date: "2024-10-08",
      status: "Ready",
      pages: 31
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

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

  const vendors = ["TechCorp Solutions", "DataFlow Systems", "Global Logistics Ltd", "SecureCloud Inc"];

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
    
    setTimeout(() => {
      const newReport = {
        id: reports.length + 1,
        title: `${reportTemplates.find(t => t.name === selectedTemplate)?.name} - ${new Date().toLocaleDateString()}`,
        type: selectedTemplate,
        date: new Date().toISOString().split('T')[0],
        status: "Ready",
        pages: Math.floor(Math.random() * 30) + 15
      };
      
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setIsGenerateDialogOpen(false);
      setSelectedTemplate("");
      setSelectedVendors([]);
      
      toast({
        title: "Report Generated",
        description: `${newReport.title} is ready for download`
      });
    }, 3000);
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

  const handleDownloadAll = () => {
    const readyReports = reports.filter(r => r.status === "Ready");
    toast({
      title: "Downloading All Reports",
      description: `Preparing ${readyReports.length} reports for download...`
    });
  };

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
                  <Label>Include Vendors (optional)</Label>
                  <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                    {vendors.map((vendor) => (
                      <div key={vendor} className="flex items-center space-x-2">
                        <Checkbox
                          id={vendor}
                          checked={selectedVendors.includes(vendor)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVendors([...selectedVendors, vendor]);
                            } else {
                              setSelectedVendors(selectedVendors.filter(v => v !== vendor));
                            }
                          }}
                        />
                        <label htmlFor={vendor} className="text-sm text-foreground cursor-pointer">
                          {vendor}
                        </label>
                      </div>
                    ))}
                  </div>
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
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">{report.title}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{report.type}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{report.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{report.pages} pages</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className={
                          report.status === "Ready"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-accent/10 text-accent border-accent/20"
                        }
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewReport(report.title)}
                        >
                          View
                        </Button>
                        {report.status === "Ready" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadReport(report.title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
