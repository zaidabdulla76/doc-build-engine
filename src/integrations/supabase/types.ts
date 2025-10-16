export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          score: number | null
          status: Database["public"]["Enums"]["assessment_status"]
          summary: string | null
          title: string
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["assessment_status"]
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["assessment_status"]
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          id: string
          mime_type: string | null
          name: string
          status: Database["public"]["Enums"]["doc_status"]
          storage_path: string
          type: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mime_type?: string | null
          name: string
          status?: Database["public"]["Enums"]["doc_status"]
          storage_path: string
          type?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mime_type?: string | null
          name?: string
          status?: Database["public"]["Enums"]["doc_status"]
          storage_path?: string
          type?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["report_status"]
          storage_path: string | null
          template: string | null
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["report_status"]
          storage_path?: string | null
          template?: string | null
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["report_status"]
          storage_path?: string | null
          template?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_agents: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          vendor_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          vendor_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_agents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_score: number
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_score?: number
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assessment_status: "pending" | "in_progress" | "completed" | "failed"
      doc_status: "pending" | "processing" | "processed" | "failed"
      report_status: "pending" | "processing" | "ready" | "failed"
      risk_level: "low" | "medium" | "high" | "critical"
      vendor_status: "active" | "inactive" | "onboarding" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assessment_status: ["pending", "in_progress", "completed", "failed"],
      doc_status: ["pending", "processing", "processed", "failed"],
      report_status: ["pending", "processing", "ready", "failed"],
      risk_level: ["low", "medium", "high", "critical"],
      vendor_status: ["active", "inactive", "onboarding", "suspended"],
    },
  },
} as const
