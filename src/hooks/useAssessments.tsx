import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Assessment {
  id: string;
  vendor_id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  score: number | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export const useAssessments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
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

  const addAssessmentMutation = useMutation({
    mutationFn: async (newAssessment: { vendor_id: string; title: string }) => {
      const { data, error } = await supabase
        .from("assessments")
        .insert([{ ...newAssessment, user_id: user?.id, status: "in_progress" }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast({ title: "Assessment Started", description: "New assessment has been initiated" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assessments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast({ title: "Assessment Cancelled", description: "Assessment has been removed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    assessments,
    isLoading,
    addAssessment: addAssessmentMutation.mutate,
    deleteAssessment: deleteAssessmentMutation.mutate,
  };
};
