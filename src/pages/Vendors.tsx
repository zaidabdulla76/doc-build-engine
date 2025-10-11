import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Vendors = () => {
  const vendors = [
    {
      id: 1,
      name: "TechCorp Solutions",
      category: "IT Services",
      riskScore: 85,
      riskLevel: "Critical",
      status: "Under Review",
      lastAssessment: "2024-10-08"
    },
    {
      id: 2,
      name: "Global Services Inc",
      category: "Consulting",
      riskScore: 42,
      riskLevel: "Low",
      status: "Approved",
      lastAssessment: "2024-10-10"
    },
    {
      id: 3,
      name: "DataFlow Systems",
      category: "Cloud Services",
      riskScore: 58,
      riskLevel: "Medium",
      status: "In Progress",
      lastAssessment: "2024-10-09"
    },
    {
      id: 4,
      name: "SecureNet Ltd",
      category: "Cybersecurity",
      riskScore: 28,
      riskLevel: "Low",
      status: "Approved",
      lastAssessment: "2024-10-11"
    },
    {
      id: 5,
      name: "CloudBase Technologies",
      category: "Infrastructure",
      riskScore: 72,
      riskLevel: "High",
      status: "Monitoring",
      lastAssessment: "2024-10-07"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "destructive";
      case "High": return "outline";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-success/10 text-success border-success/20";
      case "Under Review": return "bg-destructive/10 text-destructive border-destructive/20";
      case "In Progress": return "bg-accent/10 text-accent border-accent/20";
      case "Monitoring": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Vendor Portfolio</h1>
            <p className="text-muted-foreground mt-2">Manage and monitor all counterparty relationships</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, category, or ID..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </Card>

        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Vendor Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Risk Score</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Risk Level</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Last Assessment</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">{vendor.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-muted-foreground">{vendor.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="text-lg font-bold text-foreground">{vendor.riskScore}</div>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getRiskColor(vendor.riskLevel)}>
                        {vendor.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{vendor.lastAssessment}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/vendor/${vendor.id}`}>View Details</Link>
                      </Button>
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

export default Vendors;
