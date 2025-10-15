import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Plus, ArrowUpDown, Edit, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { agents } from "@/data/agents";
import { Checkbox } from "@/components/ui/checkbox";

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [vendors, setVendors] = useState([
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
  ]);

  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "",
    status: "Under Review",
    assignedAgents: [] as string[]
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const vendor = {
      id: vendors.length + 1,
      name: newVendor.name,
      category: newVendor.category,
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: "Medium",
      status: newVendor.status,
      lastAssessment: new Date().toISOString().split('T')[0],
      assignedAgents: newVendor.assignedAgents
    };

    setVendors([...vendors, vendor]);
    setNewVendor({ name: "", category: "", status: "Under Review", assignedAgents: [] });
    setIsAddDialogOpen(false);
    
    const assignedAgentNames = agents
      .filter(a => newVendor.assignedAgents.includes(a.id))
      .map(a => a.name)
      .join(", ");
    
    toast({
      title: "Vendor Added",
      description: `${vendor.name} has been added${assignedAgentNames ? ` and assigned to: ${assignedAgentNames}` : ""}`
    });
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor);
    setNewVendor({
      name: vendor.name,
      category: vendor.category,
      status: vendor.status,
      assignedAgents: vendor.assignedAgents || []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVendor = () => {
    if (!newVendor.name || !newVendor.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setVendors(vendors.map(v => 
      v.id === editingVendor.id 
        ? { ...v, name: newVendor.name, category: newVendor.category, status: newVendor.status, assignedAgents: newVendor.assignedAgents }
        : v
    ));
    
    setIsEditDialogOpen(false);
    setEditingVendor(null);
    setNewVendor({ name: "", category: "", status: "Under Review", assignedAgents: [] });
    
    const assignedAgentNames = agents
      .filter(a => newVendor.assignedAgents.includes(a.id))
      .map(a => a.name)
      .join(", ");
    
    toast({
      title: "Vendor Updated",
      description: `${newVendor.name} has been updated${assignedAgentNames ? ` with agents: ${assignedAgentNames}` : ""}`
    });
  };

  const handleDeleteVendor = (vendorId: number, vendorName: string) => {
    setVendors(vendors.filter(v => v.id !== vendorId));
    toast({
      title: "Vendor Deleted",
      description: `${vendorName} has been removed from your portfolio`
    });
  };

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Vendor data is being exported to CSV..."
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  let filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || vendor.status === filterStatus;
    const matchesRisk = filterRisk === "all" || vendor.riskLevel === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  if (sortField) {
    filteredVendors = [...filteredVendors].sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection === "asc" 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

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
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="vendor-name">Vendor Name *</Label>
                    <Input
                      id="vendor-name"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                      placeholder="e.g., IT Services, Consulting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Initial Status</Label>
                    <Select value={newVendor.status} onValueChange={(value) => setNewVendor({ ...newVendor, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assign AI Agents
                    </Label>
                    <div className="border border-border rounded-lg p-4 space-y-3 max-h-[200px] overflow-y-auto bg-secondary/20">
                      {agents.map((agent) => (
                        <div key={agent.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`add-${agent.id}`}
                            checked={newVendor.assignedAgents.includes(agent.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewVendor({
                                  ...newVendor,
                                  assignedAgents: [...newVendor.assignedAgents, agent.id]
                                });
                              } else {
                                setNewVendor({
                                  ...newVendor,
                                  assignedAgents: newVendor.assignedAgents.filter(id => id !== agent.id)
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`add-${agent.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-sm text-foreground">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.specialty}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select which AI agents will monitor this vendor
                    </p>
                  </div>
                  
                  <Button onClick={handleAddVendor} className="w-full">
                    Add Vendor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Vendor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="edit-vendor-name">Vendor Name *</Label>
                    <Input
                      id="edit-vendor-name"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category">Category *</Label>
                    <Input
                      id="edit-category"
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                      placeholder="e.g., IT Services, Consulting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select value={newVendor.status} onValueChange={(value) => setNewVendor({ ...newVendor, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Monitoring">Monitoring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Assign AI Agents
                    </Label>
                    <div className="border border-border rounded-lg p-4 space-y-3 max-h-[200px] overflow-y-auto bg-secondary/20">
                      {agents.map((agent) => (
                        <div key={agent.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`edit-${agent.id}`}
                            checked={newVendor.assignedAgents.includes(agent.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewVendor({
                                  ...newVendor,
                                  assignedAgents: [...newVendor.assignedAgents, agent.id]
                                });
                              } else {
                                setNewVendor({
                                  ...newVendor,
                                  assignedAgents: newVendor.assignedAgents.filter(id => id !== agent.id)
                                });
                              }
                            }}
                          />
                          <label
                            htmlFor={`edit-${agent.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-sm text-foreground">{agent.name}</div>
                            <div className="text-xs text-muted-foreground">{agent.specialty}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select which AI agents will monitor this vendor
                    </p>
                  </div>
                  
                  <Button onClick={handleUpdateVendor} className="w-full">
                    Update Vendor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="bg-card border-border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name or category..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div>
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk Level</Label>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>

        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    <button onClick={() => handleSort("name")} className="flex items-center space-x-1 hover:text-primary">
                      <span>Vendor Name</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    <button onClick={() => handleSort("riskScore")} className="flex items-center space-x-1 hover:text-primary">
                      <span>Risk Score</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Risk Level</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Last Assessment</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
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
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/vendors/${vendor.id}`}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditVendor(vendor)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredVendors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No vendors found matching your criteria
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Vendors;
