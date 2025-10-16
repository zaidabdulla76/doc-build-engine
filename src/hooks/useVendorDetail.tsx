import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useVendorDetail = (vendorId: string | undefined) => {
  const { user } = useAuth();

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!vendorId,
  });

  const { data: assignedAgents = [] } = useQuery({
    queryKey: ["vendor-agents", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_agents")
        .select("agent_id")
        .eq("vendor_id", vendorId);
      
      if (error) throw error;
      return data.map(va => va.agent_id);
    },
    enabled: !!user && !!vendorId,
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ["vendor-assessments", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!vendorId,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["vendor-documents", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!vendorId,
  });

  return {
    vendor,
    assignedAgents,
    assessments,
    documents,
    isLoading: vendorLoading,
  };
};
