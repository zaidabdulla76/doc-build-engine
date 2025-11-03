import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  FileSearch, 
  FileText, 
  BarChart3, 
  Activity,
  GitBranch,
  UserCircle,
  Shield
} from "lucide-react";

export const RoleBasedAccess = () => {
  const navigate = useNavigate();
  const {
    canManageVendors,
    canManageAssessments,
    canManageDocuments,
    canManageReports,
    canManageStakeholders,
    canManageUsers,
    isGCCLeader,
    isITSecurityOfficer
  } = useUserRoles();

  const quickActions = [
    {
      icon: Users,
      label: "Manage Vendors",
      description: "Add and update vendor information",
      path: "/vendors",
      show: canManageVendors,
      color: "text-blue-500"
    },
    {
      icon: FileSearch,
      label: "Assessments",
      description: "Create and review risk assessments",
      path: "/assessments",
      show: canManageAssessments,
      color: "text-purple-500"
    },
    {
      icon: FileText,
      label: "Documents",
      description: "Upload and manage documents",
      path: "/documents",
      show: canManageDocuments,
      color: "text-green-500"
    },
    {
      icon: BarChart3,
      label: "Reports",
      description: "Generate and view reports",
      path: "/reports",
      show: canManageReports,
      color: "text-orange-500"
    },
    {
      icon: Activity,
      label: "Monitoring",
      description: "Track vendor activities",
      path: "/monitoring",
      show: isGCCLeader || isITSecurityOfficer,
      color: "text-red-500"
    },
    {
      icon: GitBranch,
      label: "Workflows",
      description: "Manage automated workflows",
      path: "/workflows",
      show: canManageVendors,
      color: "text-indigo-500"
    },
    {
      icon: UserCircle,
      label: "Stakeholders",
      description: "Manage personas and contacts",
      path: "/stakeholders",
      show: canManageStakeholders,
      color: "text-teal-500"
    },
    {
      icon: Shield,
      label: "User Roles",
      description: "Manage user permissions",
      path: "/user-roles",
      show: canManageUsers,
      color: "text-pink-500"
    },
  ];

  const visibleActions = quickActions.filter(action => action.show);

  if (visibleActions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card 
              key={action.path}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <div className="flex flex-col items-start gap-3">
                <div className={`p-3 rounded-lg bg-secondary/20 ${action.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
