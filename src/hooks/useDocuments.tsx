import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Document {
  id: string;
  vendor_id: string | null;
  name: string;
  type: string | null;
  status: "pending" | "processing" | "processed" | "failed";
  storage_path: string;
  mime_type: string | null;
  created_at: string;
}

export const useDocuments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
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

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ file, vendor_id, type }: { file: File; vendor_id: string; type: string }) => {
      if (!user) throw new Error("User not authenticated");

      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from("documents")
        .insert([{
          user_id: user.id,
          vendor_id,
          name: file.name,
          type,
          status: "processing",
          storage_path: filePath,
          mime_type: file.type
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document Uploaded", description: "Document is being analyzed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async ({ id, storage_path }: { id: string; storage_path: string }) => {
      // Delete from storage
      await supabase.storage.from("documents").remove([storage_path]);
      
      // Delete record
      const { error } = await supabase.from("documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document Deleted", description: "Document has been removed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    documents,
    isLoading,
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
  };
};
