import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface MonitoringAlert {
  id: string;
  vendor_id: string;
  alert_type: "risk_score_change" | "compliance_issue" | "financial_distress" | "news_sentiment" | "regulatory_change";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  status: "new" | "acknowledged" | "investigating" | "resolved";
  created_at: string;
  resolved_at: string | null;
}

export const useMonitoring = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["monitoring-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monitoring_alerts")
        .select(`
          *,
          vendors (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as MonitoringAlert[];
    },
    enabled: !!user,
  });

  const updateAlertStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MonitoringAlert["status"] }) => {
      const updates: any = { status };
      if (status === "resolved") {
        updates.resolved_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from("monitoring_alerts")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitoring-alerts"] });
      toast({ title: "Alert Updated", description: "Alert status has been updated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    alerts,
    isLoading,
    updateAlertStatus: updateAlertStatusMutation.mutate,
  };
};
