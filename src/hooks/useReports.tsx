import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Report {
  id: string;
  vendor_id: string | null;
  name: string;
  template: string | null;
  status: "pending" | "processing" | "ready" | "failed";
  storage_path: string | null;
  created_at: string;
  updated_at: string;
}

export const useReports = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          vendors (
            name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generateReportMutation = useMutation({
    mutationFn: async ({ name, template, vendor_id }: { name: string; template: string; vendor_id?: string }) => {
      const { data, error } = await supabase
        .from("reports")
        .insert([{
          user_id: user?.id,
          name,
          template,
          vendor_id: vendor_id || null,
          status: "processing"
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({ title: "Report Generating", description: "Your report is being generated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reports").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({ title: "Report Deleted", description: "Report has been removed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    reports,
    isLoading,
    generateReport: generateReportMutation.mutate,
    deleteReport: deleteReportMutation.mutate,
  };
};
