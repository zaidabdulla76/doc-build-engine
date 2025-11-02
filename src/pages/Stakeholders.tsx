import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Download, Plus, Edit, Trash2, UserCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useStakeholders } from "@/hooks/useStakeholders";
import { useVendors } from "@/hooks/useVendors";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Stakeholders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInfluence, setFilterInfluence] = useState("all");
  const [filterVendor, setFilterVendor] = useState("all");
  const { stakeholders, isLoading, addStakeholder, updateStakeholder, deleteStakeholder } = useStakeholders();
  const { vendors } = useVendors();

  const [newStakeholder, setNewStakeholder] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    persona_type: "",
    influence_level: "medium" as "high" | "medium" | "low",
    vendor_id: "",
    notes: ""
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddStakeholder = () => {
    if (!newStakeholder.name) {
      toast({
        title: "Missing Information",
        description: "Please enter stakeholder name",
        variant: "destructive"
      });
      return;
    }

    addStakeholder({
      ...newStakeholder,
      vendor_id: newStakeholder.vendor_id || undefined,
    });

    setNewStakeholder({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      persona_type: "",
      influence_level: "medium",
      vendor_id: "",
      notes: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStakeholder = (stakeholder: any) => {
    setEditingStakeholder(stakeholder);
    setNewStakeholder({
      name: stakeholder.name,
      email: stakeholder.email || "",
      phone: stakeholder.phone || "",
      role: stakeholder.role || "",
      department: stakeholder.department || "",
      persona_type: stakeholder.persona_type || "",
      influence_level: stakeholder.influence_level || "medium",
      vendor_id: stakeholder.vendor_id || "",
      notes: stakeholder.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStakeholder = () => {
    if (!editingStakeholder) return;
    if (!newStakeholder.name) {
      toast({
        title: "Missing Information",
        description: "Please enter stakeholder name",
        variant: "destructive"
      });
      return;
    }

    updateStakeholder({
      id: editingStakeholder.id,
      updates: {
        ...newStakeholder,
        vendor_id: newStakeholder.vendor_id || undefined,
      },
    });

    setNewStakeholder({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      persona_type: "",
      influence_level: "medium",
      vendor_id: "",
      notes: ""
    });
    setIsEditDialogOpen(false);
    setEditingStakeholder(null);
  };

  const handleDeleteStakeholder = (id: string) => {
    if (confirm("Are you sure you want to delete this stakeholder?")) {
      deleteStakeholder(id);
    }
  };

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInfluence = filterInfluence === "all" || stakeholder.influence_level === filterInfluence;
    const matchesVendor = filterVendor === "all" || stakeholder.vendor_id === filterVendor;
    return matchesSearch && matchesInfluence && matchesVendor;
  });

  const getVendorName = (vendorId?: string) => {
    if (!vendorId) return "Unassigned";
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || "Unknown";
  };

  const getInfluenceBadgeVariant = (level?: string) => {
    switch (level) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const StakeholderForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={newStakeholder.name}
          onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newStakeholder.email}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={newStakeholder.phone}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={newStakeholder.role}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
            placeholder="CTO"
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={newStakeholder.department}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, department: e.target.value })}
            placeholder="Engineering"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="persona_type">Persona Type</Label>
          <Input
            id="persona_type"
            value={newStakeholder.persona_type}
            onChange={(e) => setNewStakeholder({ ...newStakeholder, persona_type: e.target.value })}
            placeholder="Decision Maker"
          />
        </div>
        <div>
          <Label htmlFor="influence">Influence Level</Label>
          <Select
            value={newStakeholder.influence_level}
            onValueChange={(value: "high" | "medium" | "low") => 
              setNewStakeholder({ ...newStakeholder, influence_level: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="vendor">Associated Vendor</Label>
        <Select
          value={newStakeholder.vendor_id}
          onValueChange={(value) => setNewStakeholder({ ...newStakeholder, vendor_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vendor (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={newStakeholder.notes}
          onChange={(e) => setNewStakeholder({ ...newStakeholder, notes: e.target.value })}
          placeholder="Additional information about this stakeholder..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Personas & Stakeholders</h1>
            <p className="text-muted-foreground">Manage vendor contacts and key stakeholders</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Stakeholder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Stakeholder</DialogTitle>
              </DialogHeader>
              <StakeholderForm />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddStakeholder}>Add Stakeholder</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search stakeholders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label>Influence Level</Label>
                <Select value={filterInfluence} onValueChange={setFilterInfluence}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendor</Label>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Influence</TableHead>
                <TableHead>Persona Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading stakeholders...
                  </TableCell>
                </TableRow>
              ) : filteredStakeholders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No stakeholders found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                        {stakeholder.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{stakeholder.role || "—"}</div>
                        {stakeholder.department && (
                          <div className="text-sm text-muted-foreground">{stakeholder.department}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {stakeholder.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {stakeholder.email}
                          </div>
                        )}
                        {stakeholder.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {stakeholder.phone}
                          </div>
                        )}
                        {!stakeholder.email && !stakeholder.phone && "—"}
                      </div>
                    </TableCell>
                    <TableCell>{getVendorName(stakeholder.vendor_id)}</TableCell>
                    <TableCell>
                      <Badge variant={getInfluenceBadgeVariant(stakeholder.influence_level)}>
                        {stakeholder.influence_level || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>{stakeholder.persona_type || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStakeholder(stakeholder)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStakeholder(stakeholder.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Stakeholder</DialogTitle>
            </DialogHeader>
            <StakeholderForm />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateStakeholder}>Update Stakeholder</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Stakeholders;
