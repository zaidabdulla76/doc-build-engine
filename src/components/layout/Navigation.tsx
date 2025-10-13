import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileSearch, 
  Activity, 
  BarChart3,
  Brain,
  FileText,
  GitBranch
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Vendors", icon: Users, path: "/vendors" },
    { name: "Assessments", icon: FileSearch, path: "/assessments" },
    { name: "Monitoring", icon: Activity, path: "/monitoring" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Workflows", icon: GitBranch, path: "/workflows" },
  ];

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
              {navItems.map((item) => {
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
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
