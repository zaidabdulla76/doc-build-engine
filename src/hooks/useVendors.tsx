import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Vendor {
  id: string;
  name: string;
  category: string | null;
  risk_level: "low" | "medium" | "high" | "critical";
  risk_score: number;
  status: "active" | "inactive" | "onboarding" | "suspended";
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export const useVendors = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Vendor[];
    },
    enabled: !!user,
  });

  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: Partial<Vendor> & { name: string; assignedAgents?: string[] }) => {
      const { assignedAgents, ...vendorData } = newVendor;
      const { data: vendor, error } = await supabase
        .from("vendors")
        .insert([{ ...vendorData, user_id: user?.id }])
        .select()
        .single();
      
      if (error) throw error;

      // Insert vendor agents
      if (assignedAgents && assignedAgents.length > 0) {
        const agentInserts = assignedAgents.map(agentId => ({
          vendor_id: vendor.id,
          agent_id: agentId
        }));
        const { error: agentError } = await supabase
          .from("vendor_agents")
          .insert(agentInserts);
        if (agentError) throw agentError;
      }

      return vendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({ title: "Vendor Added", description: "New vendor has been added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: async ({ id, updates, assignedAgents }: { id: string; updates: Partial<Vendor>; assignedAgents?: string[] }) => {
      const { error } = await supabase
        .from("vendors")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;

      // Update vendor agents if provided
      if (assignedAgents !== undefined) {
        // Delete existing agents
        await supabase.from("vendor_agents").delete().eq("vendor_id", id);
        
        // Insert new agents
        if (assignedAgents.length > 0) {
          const agentInserts = assignedAgents.map(agentId => ({
            vendor_id: id,
            agent_id: agentId
          }));
          const { error: agentError } = await supabase
            .from("vendor_agents")
            .insert(agentInserts);
          if (agentError) throw agentError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({ title: "Vendor Updated", description: "Vendor has been updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast({ title: "Vendor Deleted", description: "Vendor has been removed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    vendors,
    isLoading,
    addVendor: addVendorMutation.mutate,
    updateVendor: updateVendorMutation.mutate,
    deleteVendor: deleteVendorMutation.mutate,
  };
};
