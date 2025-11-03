import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserRoles, roleLabels } from "@/hooks/useUserRoles";
import { Briefcase, Shield, FileCheck, BarChart3, Lock, Scale, Calculator } from "lucide-react";

const roleIcons = {
  procurement_director: Shield,
  category_manager: Briefcase,
  compliance_officer: FileCheck,
  gcc_leader: BarChart3,
  it_security_officer: Lock,
  legal_team: Scale,
  finance_team: Calculator
};

const roleColors = {
  procurement_director: "destructive",
  category_manager: "default",
  compliance_officer: "secondary",
  gcc_leader: "outline",
  it_security_officer: "destructive",
  legal_team: "secondary",
  finance_team: "default"
} as const;

export const RoleWelcome = () => {
  const { userRoles, isLoading } = useUserRoles();

  if (isLoading || userRoles.length === 0) return null;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Your Roles</h3>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role) => {
              const Icon = roleIcons[role];
              return (
                <Badge 
                  key={role} 
                  variant={roleColors[role]}
                  className="flex items-center gap-1.5 px-3 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {roleLabels[role]}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
