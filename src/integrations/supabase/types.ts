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
      applications: {
        Row: {
          applicant_user_id: string
          applied_at: string
          film_festival_id: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string
        }
        Insert: {
          applicant_user_id: string
          applied_at?: string
          film_festival_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
        }
        Update: {
          applicant_user_id?: string
          applied_at?: string
          film_festival_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_film_festival_id_fkey"
            columns: ["film_festival_id"]
            isOneToOne: false
            referencedRelation: "film_festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      film_festivals: {
        Row: {
          acceptance_rate: number | null
          awards: string[] | null
          categories: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          early_deadline: string | null
          end_date: string | null
          entry_fees_range: string | null
          featured: boolean
          festival_tier: string | null
          filmfreeway_url: string | null
          genres: string[] | null
          id: string
          late_deadline: string | null
          location: string
          name: string
          notification_date: string | null
          requirements: string | null
          start_date: string
          status: string
          submission_deadline: string | null
          submission_fee: string | null
          submission_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          awards?: string[] | null
          categories?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          early_deadline?: string | null
          end_date?: string | null
          entry_fees_range?: string | null
          featured?: boolean
          festival_tier?: string | null
          filmfreeway_url?: string | null
          genres?: string[] | null
          id?: string
          late_deadline?: string | null
          location: string
          name: string
          notification_date?: string | null
          requirements?: string | null
          start_date: string
          status?: string
          submission_deadline?: string | null
          submission_fee?: string | null
          submission_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          awards?: string[] | null
          categories?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          early_deadline?: string | null
          end_date?: string | null
          entry_fees_range?: string | null
          featured?: boolean
          festival_tier?: string | null
          filmfreeway_url?: string | null
          genres?: string[] | null
          id?: string
          late_deadline?: string | null
          location?: string
          name?: string
          notification_date?: string | null
          requirements?: string | null
          start_date?: string
          status?: string
          submission_deadline?: string | null
          submission_fee?: string | null
          submission_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          age_range: string | null
          audition_date: string | null
          casting_director: string | null
          compensation: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          deadline_date: string | null
          description: string
          featured: boolean
          gender_preference: string | null
          id: string
          location: string | null
          production_company: string | null
          project_name: string
          project_type: string
          requirements: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          audition_date?: string | null
          casting_director?: string | null
          compensation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline_date?: string | null
          description: string
          featured?: boolean
          gender_preference?: string | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string
          project_type?: string
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          audition_date?: string | null
          casting_director?: string | null
          compensation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline_date?: string | null
          description?: string
          featured?: boolean
          gender_preference?: string | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string
          project_type?: string
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      script_analyses: {
        Row: {
          analysis_result: Json | null
          character_count: number | null
          confidence_score: number | null
          created_at: string
          genre: string | null
          id: string
          is_validated: boolean | null
          script_text: string
          selected_directors: string[] | null
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          character_count?: number | null
          confidence_score?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_validated?: boolean | null
          script_text: string
          selected_directors?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          character_count?: number | null
          confidence_score?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_validated?: boolean | null
          script_text?: string
          selected_directors?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      storyboard_projects: {
        Row: {
          character_count: number | null
          created_at: string
          genre: string | null
          id: string
          is_complete: boolean | null
          script_text: string
          shots: Json | null
          storyboard_frames: Json | null
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          character_count?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_complete?: boolean | null
          script_text: string
          shots?: Json | null
          storyboard_frames?: Json | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          character_count?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_complete?: boolean | null
          script_text?: string
          shots?: Json | null
          storyboard_frames?: Json | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
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
      user_role: "filmmaker" | "film_festival" | "admin"
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
      user_role: ["filmmaker", "film_festival", "admin"],
    },
  },
} as const
