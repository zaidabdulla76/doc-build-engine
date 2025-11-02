import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Stakeholder {
  id: string;
  user_id: string;
  vendor_id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  persona_type?: string;
  influence_level?: "high" | "medium" | "low";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useStakeholders = (vendorId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stakeholders = [], isLoading } = useQuery({
    queryKey: vendorId ? ["stakeholders", vendorId] : ["stakeholders"],
    queryFn: async () => {
      let query = supabase
        .from("stakeholders")
        .select("*")
        .order("created_at", { ascending: false });

      if (vendorId) {
        query = query.eq("vendor_id", vendorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Stakeholder[];
    },
  });

  const addStakeholderMutation = useMutation({
    mutationFn: async (newStakeholder: Partial<Stakeholder>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("stakeholders")
        .insert([{
          name: newStakeholder.name!,
          user_id: user.id,
          vendor_id: newStakeholder.vendor_id,
          email: newStakeholder.email,
          phone: newStakeholder.phone,
          role: newStakeholder.role,
          department: newStakeholder.department,
          persona_type: newStakeholder.persona_type,
          influence_level: newStakeholder.influence_level,
          notes: newStakeholder.notes,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
      toast({
        title: "Success",
        description: "Stakeholder added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add stakeholder: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateStakeholderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Stakeholder> }) => {
      const { data, error } = await supabase
        .from("stakeholders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
      toast({
        title: "Success",
        description: "Stakeholder updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update stakeholder: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteStakeholderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("stakeholders")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeholders"] });
      toast({
        title: "Success",
        description: "Stakeholder deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete stakeholder: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    stakeholders,
    isLoading,
    addStakeholder: addStakeholderMutation.mutate,
    updateStakeholder: updateStakeholderMutation.mutate,
    deleteStakeholder: deleteStakeholderMutation.mutate,
  };
};
