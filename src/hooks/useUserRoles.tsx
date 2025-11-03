import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type AppRole = 
  | "procurement_director"
  | "category_manager" 
  | "compliance_officer"
  | "gcc_leader"
  | "it_security_officer"
  | "legal_team"
  | "finance_team";

export const roleLabels: Record<AppRole, string> = {
  procurement_director: "Procurement Director/VP",
  category_manager: "Category Manager",
  compliance_officer: "Compliance Officer",
  gcc_leader: "GCC Leader",
  it_security_officer: "IT Security Officer",
  legal_team: "Legal Team",
  finance_team: "Finance Team"
};

export const roleDescriptions: Record<AppRole, string> = {
  procurement_director: "Full system access, can manage users and all resources",
  category_manager: "Daily operations: manage vendors, assessments, documents",
  compliance_officer: "Focus on compliance, assessments, and reports",
  gcc_leader: "Overview access to monitoring, reports, and dashboards",
  it_security_officer: "Security-focused: assessments and monitoring",
  legal_team: "Access to documents, compliance, and reports",
  finance_team: "View vendors, reports, and financial information"
};

export const useUserRoles = () => {
  const queryClient = useQueryClient();

  const { data: userRoles = [], isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(r => r.role as AppRole);
    }
  });

  const hasRole = (role: AppRole) => userRoles.includes(role);
  
  const hasAnyRole = (roles: AppRole[]) => roles.some(role => userRoles.includes(role));

  const isProcurementDirector = hasRole("procurement_director");
  const isCategoryManager = hasRole("category_manager");
  const isComplianceOfficer = hasRole("compliance_officer");
  const isGCCLeader = hasRole("gcc_leader");
  const isITSecurityOfficer = hasRole("it_security_officer");
  const isLegalTeam = hasRole("legal_team");
  const isFinanceTeam = hasRole("finance_team");

  // Access permissions
  const canManageVendors = hasAnyRole(["procurement_director", "category_manager"]);
  const canDeleteVendors = isProcurementDirector;
  const canManageAssessments = hasAnyRole(["procurement_director", "category_manager", "compliance_officer", "it_security_officer"]);
  const canManageDocuments = hasAnyRole(["procurement_director", "category_manager", "legal_team"]);
  const canManageReports = hasAnyRole(["procurement_director", "category_manager", "compliance_officer", "gcc_leader"]);
  const canManageStakeholders = hasAnyRole(["procurement_director", "category_manager", "compliance_officer"]);
  const canManageUsers = isProcurementDirector;

  return {
    userRoles,
    isLoading,
    hasRole,
    hasAnyRole,
    isProcurementDirector,
    isCategoryManager,
    isComplianceOfficer,
    isGCCLeader,
    isITSecurityOfficer,
    isLegalTeam,
    isFinanceTeam,
    canManageVendors,
    canDeleteVendors,
    canManageAssessments,
    canManageDocuments,
    canManageReports,
    canManageStakeholders,
    canManageUsers
  };
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ["all-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          id,
          user_id,
          role,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role,
          created_by: user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role assigned",
        description: "User role has been assigned successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error assigning role",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role removed",
        description: "User role has been removed successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing role",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
