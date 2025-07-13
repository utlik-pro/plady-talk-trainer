export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      conversation_analysis: {
        Row: {
          areas_for_improvement: string[] | null
          conversation_flow: string | null
          created_at: string | null
          detailed_feedback: string | null
          id: string
          overall_score: number | null
          recommendations: string[] | null
          session_id: string
          strengths: string[] | null
        }
        Insert: {
          areas_for_improvement?: string[] | null
          conversation_flow?: string | null
          created_at?: string | null
          detailed_feedback?: string | null
          id?: string
          overall_score?: number | null
          recommendations?: string[] | null
          session_id: string
          strengths?: string[] | null
        }
        Update: {
          areas_for_improvement?: string[] | null
          conversation_flow?: string | null
          created_at?: string | null
          detailed_feedback?: string | null
          id?: string
          overall_score?: number | null
          recommendations?: string[] | null
          session_id?: string
          strengths?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          created_at: string | null
          id: string
          message_text: string
          sender: string
          session_id: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_text: string
          sender: string
          session_id: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_text?: string
          sender?: string
          session_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          character_avatar: string
          character_name: string
          character_personality: string
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          start_time: string | null
          total_messages: number | null
          user_id: string
        }
        Insert: {
          character_avatar: string
          character_name: string
          character_personality: string
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          total_messages?: number | null
          user_id: string
        }
        Update: {
          character_avatar?: string
          character_name?: string
          character_personality?: string
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          total_messages?: number | null
          user_id?: string
        }
        Relationships: []
      }
      elevenlabs_usage: {
        Row: {
          characters_count: number
          conversation_id: string | null
          cost: number
          created_at: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          characters_count?: number
          conversation_id?: string | null
          cost?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          characters_count?: number
          conversation_id?: string | null
          cost?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "elevenlabs_usage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elevenlabs_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          elevenlabs_usage_count: number | null
          email: string | null
          id: string
          is_banned: boolean | null
          registration_date: string | null
          role: string | null
          subscription_expires_at: string | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          elevenlabs_usage_count?: number | null
          email?: string | null
          id: string
          is_banned?: boolean | null
          registration_date?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          elevenlabs_usage_count?: number | null
          email?: string | null
          id?: string
          is_banned?: boolean | null
          registration_date?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_revenue: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_date: string
          payment_method: string | null
          subscription_type: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          subscription_type?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_date?: string
          payment_method?: string | null
          subscription_type?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          is_banned: boolean
          subscription_expires_at: string
          total_spent: number
          elevenlabs_usage_count: number
          registration_date: string
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
