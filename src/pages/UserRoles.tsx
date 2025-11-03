import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useUserRoles, useAllUserRoles, useAssignRole, useRemoveRole, AppRole, roleLabels, roleDescriptions } from "@/hooks/useUserRoles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const UserRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    userId: "",
    role: "" as AppRole | ""
  });

  const { canManageUsers } = useUserRoles();
  const { data: allRoles = [], isLoading } = useAllUserRoles();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRole();

  if (!canManageUsers) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-6 py-8">
          <Card className="p-12 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to manage user roles. Only Procurement Directors can access this page.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const handleAssignRole = () => {
    if (!newAssignment.userId || !newAssignment.role) {
      toast({
        title: "Missing Information",
        description: "Please enter user ID and select a role",
        variant: "destructive"
      });
      return;
    }

    assignRoleMutation.mutate(
      { userId: newAssignment.userId, role: newAssignment.role as AppRole },
      {
        onSuccess: () => {
          setNewAssignment({ userId: "", role: "" });
          setIsAddDialogOpen(false);
        }
      }
    );
  };

  const handleRemoveRole = (roleId: string) => {
    if (confirm("Are you sure you want to remove this role assignment?")) {
      removeRoleMutation.mutate(roleId);
    }
  };

  const filteredRoles = allRoles.filter(role => 
    role.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "procurement_director": return "destructive";
      case "category_manager": return "default";
      case "compliance_officer": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">User Roles Management</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID *</Label>
                  <Input
                    id="userId"
                    value={newAssignment.userId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, userId: e.target.value })}
                    placeholder="Enter user UUID"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    You can find user IDs in the authentication system
                  </p>
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={newAssignment.role}
                    onValueChange={(value: AppRole) => setNewAssignment({ ...newAssignment, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(roleLabels) as [AppRole, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className="text-xs text-muted-foreground">{roleDescriptions[value]}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAssignRole} disabled={assignRoleMutation.isPending}>
                  Assign Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by user ID or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        <Card className="mb-6 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(roleLabels) as [AppRole, string][]).map(([role, label]) => (
              <Card key={role} className="p-4">
                <Badge variant={getRoleBadgeVariant(role)} className="mb-2">
                  {label}
                </Badge>
                <p className="text-sm text-muted-foreground">{roleDescriptions[role]}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading role assignments...
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No role assignments found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((roleAssignment) => (
                  <TableRow key={roleAssignment.id}>
                    <TableCell className="font-mono text-sm">
                      {roleAssignment.user_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(roleAssignment.role)}>
                        {roleLabels[roleAssignment.role as AppRole]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(roleAssignment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRole(roleAssignment.id)}
                        disabled={removeRoleMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default UserRoles;
