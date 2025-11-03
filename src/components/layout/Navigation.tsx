import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  FileSearch, 
  Activity, 
  BarChart3,
  Brain,
  FileText,
  GitBranch,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  UserCircle,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRoles } from "@/hooks/useUserRoles";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    canManageUsers,
    hasAnyRole 
  } = useUserRoles();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/auth");
    }
  };

  const navItems = [
    { 
      name: "Dashboard", 
      icon: LayoutDashboard, 
      path: "/",
      roles: ["procurement_director", "category_manager", "compliance_officer", "gcc_leader", "it_security_officer", "legal_team", "finance_team"]
    },
    { 
      name: "Vendors", 
      icon: Users, 
      path: "/vendors",
      roles: ["procurement_director", "category_manager", "compliance_officer", "gcc_leader", "it_security_officer", "legal_team", "finance_team"]
    },
    { 
      name: "Stakeholders", 
      icon: UserCircle, 
      path: "/stakeholders",
      roles: ["procurement_director", "category_manager", "compliance_officer"]
    },
    { 
      name: "Assessments", 
      icon: FileSearch, 
      path: "/assessments",
      roles: ["procurement_director", "category_manager", "compliance_officer", "gcc_leader", "it_security_officer"]
    },
    { 
      name: "Monitoring", 
      icon: Activity, 
      path: "/monitoring",
      roles: ["procurement_director", "gcc_leader", "it_security_officer"]
    },
    { 
      name: "Reports", 
      icon: BarChart3, 
      path: "/reports",
      roles: ["procurement_director", "category_manager", "compliance_officer", "gcc_leader", "legal_team", "finance_team"]
    },
    { 
      name: "Documents", 
      icon: FileText, 
      path: "/documents",
      roles: ["procurement_director", "category_manager", "compliance_officer", "legal_team", "finance_team"]
    },
    { 
      name: "Workflows", 
      icon: GitBranch, 
      path: "/workflows",
      roles: ["procurement_director", "category_manager"]
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || hasAnyRole(item.roles as any)
  );

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">AgenticDD</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "relative",
                      isActive && "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    )}
                    asChild
                  >
                    <Link to={item.path}>
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                  3
                </Badge>
              </Link>
            </Button>
            {canManageUsers && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/user-roles">
                  <Shield className="h-4 w-4 mr-2" />
                  User Roles
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
