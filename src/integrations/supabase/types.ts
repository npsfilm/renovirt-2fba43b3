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
      add_ons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_free: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          name: string
          price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          address: string | null
          app_role: Database["public"]["Enums"]["app_role"]
          billing_email: string | null
          company: string | null
          created_at: string
          data_source: string | null
          first_name: string | null
          id: string
          industry: string | null
          last_name: string | null
          marketing_emails: boolean | null
          order_updates: boolean | null
          phone: string | null
          responsibility: string | null
          role: string
          salutation: string | null
          sms_notifications: boolean | null
          updated_at: string
          used_referral_code: string | null
          user_id: string
          vat_id: string | null
        }
        Insert: {
          address?: string | null
          app_role?: Database["public"]["Enums"]["app_role"]
          billing_email?: string | null
          company?: string | null
          created_at?: string
          data_source?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          marketing_emails?: boolean | null
          order_updates?: boolean | null
          phone?: string | null
          responsibility?: string | null
          role: string
          salutation?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
          used_referral_code?: string | null
          user_id: string
          vat_id?: string | null
        }
        Update: {
          address?: string | null
          app_role?: Database["public"]["Enums"]["app_role"]
          billing_email?: string | null
          company?: string | null
          created_at?: string
          data_source?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          marketing_emails?: boolean | null
          order_updates?: boolean | null
          phone?: string | null
          responsibility?: string | null
          role?: string
          salutation?: string | null
          sms_notifications?: boolean | null
          updated_at?: string
          used_referral_code?: string | null
          user_id?: string
          vat_id?: string | null
        }
        Relationships: []
      }
      feature_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      feature_comments: {
        Row: {
          content: string
          created_at: string
          feature_request_id: string
          id: string
          is_admin_response: boolean
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feature_request_id: string
          id?: string
          is_admin_response?: boolean
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feature_request_id?: string
          id?: string
          is_admin_response?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_comments_feature_request_id_fkey"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          admin_response: string | null
          category_id: string
          comment_count: number
          created_at: string
          created_by: string
          description: string
          estimated_completion: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          upvote_count: number
        }
        Insert: {
          admin_response?: string | null
          category_id: string
          comment_count?: number
          created_at?: string
          created_by: string
          description: string
          estimated_completion?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          upvote_count?: number
        }
        Update: {
          admin_response?: string | null
          category_id?: string
          comment_count?: number
          created_at?: string
          created_by?: string
          description?: string
          estimated_completion?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          upvote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "feature_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_upvotes: {
        Row: {
          created_at: string
          feature_request_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_request_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_request_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_upvotes_feature_request_id_fkey"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      help_documents: {
        Row: {
          content: string
          created_by: string | null
          file_name: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          content: string
          created_by?: string | null
          file_name?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          content?: string
          created_by?: string | null
          file_name?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: []
      }
      help_interaction_limits: {
        Row: {
          created_at: string | null
          id: string
          interaction_count: number | null
          ip_address: unknown | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          ip_address?: unknown | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          ip_address?: unknown | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      help_interactions: {
        Row: {
          ai_response: string
          contacted_support: boolean
          created_at: string
          feedback_rating: number | null
          id: string
          ip_address: unknown | null
          question: string
          response_time_ms: number | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          ai_response: string
          contacted_support?: boolean
          created_at?: string
          feedback_rating?: number | null
          id?: string
          ip_address?: unknown | null
          question: string
          response_time_ms?: number | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          ai_response?: string
          contacted_support?: boolean
          created_at?: string
          feedback_rating?: number | null
          id?: string
          ip_address?: unknown | null
          question?: string
          response_time_ms?: number | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      help_question_patterns: {
        Row: {
          avg_satisfaction: number | null
          count: number
          created_at: string
          id: string
          last_asked: string
          question_pattern: string
        }
        Insert: {
          avg_satisfaction?: number | null
          count?: number
          created_at?: string
          id?: string
          last_asked?: string
          question_pattern: string
        }
        Update: {
          avg_satisfaction?: number | null
          count?: number
          created_at?: string
          id?: string
          last_asked?: string
          question_pattern?: string
        }
        Relationships: []
      }
      order_add_ons: {
        Row: {
          add_on_id: string
          created_at: string
          id: string
          order_id: string
        }
        Insert: {
          add_on_id: string
          created_at?: string
          id?: string
          order_id: string
        }
        Update: {
          add_on_id?: string
          created_at?: string
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_add_ons_add_on_id_fkey"
            columns: ["add_on_id"]
            isOneToOne: false
            referencedRelation: "add_ons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_add_ons_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_images: {
        Row: {
          bracketing_group_id: string | null
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          is_bracketing_set: boolean | null
          order_id: string
          storage_path: string
        }
        Insert: {
          bracketing_group_id?: string | null
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          is_bracketing_set?: boolean | null
          order_id: string
          storage_path: string
        }
        Update: {
          bracketing_group_id?: string | null
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          is_bracketing_set?: boolean | null
          order_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_images_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_invoices: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          order_id: string
          storage_path: string
          uploaded_by: string
          uploaded_by_name: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          order_id: string
          storage_path: string
          uploaded_by: string
          uploaded_by_name: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          order_id?: string
          storage_path?: string
          uploaded_by?: string
          uploaded_by_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: string | null
          order_id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type?: string | null
          order_id: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: string | null
          order_id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_remarks: {
        Row: {
          admin_name: string
          admin_user_id: string
          created_at: string
          id: string
          order_id: string
          remark: string
        }
        Insert: {
          admin_name: string
          admin_user_id: string
          created_at?: string
          id?: string
          order_id: string
          remark: string
        }
        Update: {
          admin_name?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          order_id?: string
          remark?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_remarks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          estimated_completion: string | null
          id: string
          is_note: boolean
          message: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          estimated_completion?: string | null
          id?: string
          is_note?: boolean
          message?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          estimated_completion?: string | null
          id?: string
          is_note?: boolean
          message?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          bracketing_enabled: boolean | null
          bracketing_exposures: number | null
          created_at: string
          customer_email: string | null
          delivery_status: string | null
          estimated_completion: string | null
          extras: Json | null
          id: string
          image_count: number
          order_number: string | null
          package_id: string | null
          payment_flow_status: string | null
          payment_method: string | null
          payment_status: string | null
          photo_type: string | null
          status: string | null
          stripe_session_id: string | null
          terms_accepted: boolean | null
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bracketing_enabled?: boolean | null
          bracketing_exposures?: number | null
          created_at?: string
          customer_email?: string | null
          delivery_status?: string | null
          estimated_completion?: string | null
          extras?: Json | null
          id?: string
          image_count?: number
          order_number?: string | null
          package_id?: string | null
          payment_flow_status?: string | null
          payment_method?: string | null
          payment_status?: string | null
          photo_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          terms_accepted?: boolean | null
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bracketing_enabled?: boolean | null
          bracketing_exposures?: number | null
          created_at?: string
          customer_email?: string | null
          delivery_status?: string | null
          estimated_completion?: string | null
          extras?: Json | null
          id?: string
          image_count?: number
          order_number?: string | null
          package_id?: string | null
          payment_flow_status?: string | null
          payment_method?: string | null
          payment_status?: string | null
          photo_type?: string | null
          status?: string | null
          stripe_session_id?: string | null
          terms_accepted?: boolean | null
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_customer_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          name: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          name: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          "app role": Database["public"]["Enums"]["app_role"] | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          "app role"?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          "app role"?: Database["public"]["Enums"]["app_role"] | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          admin_approved: boolean | null
          admin_approved_at: string | null
          admin_approved_by: string | null
          admin_notes: string | null
          created_at: string
          credits_approved_at: string | null
          first_order_id: string | null
          id: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          reward_amount: number
          reward_claimed: boolean
          updated_at: string
        }
        Insert: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_notes?: string | null
          created_at?: string
          credits_approved_at?: string | null
          first_order_id?: string | null
          id?: string
          referral_code: string
          referred_user_id: string
          referrer_id: string
          reward_amount?: number
          reward_claimed?: boolean
          updated_at?: string
        }
        Update: {
          admin_approved?: boolean | null
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          admin_notes?: string | null
          created_at?: string
          credits_approved_at?: string | null
          first_order_id?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string
          referrer_id?: string
          reward_amount?: number
          reward_claimed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      role_change_audit: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_role: string | null
          old_role: string | null
          target_user_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string | null
          old_role?: string | null
          target_user_id: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string | null
          old_role?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          amount: number
          created_at: string
          credit_type: string
          expires_at: string | null
          id: string
          is_used: boolean
          source: string
          source_id: string | null
          status: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          credit_type?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean
          source: string
          source_id?: string | null
          status?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          credit_type?: string
          expires_at?: string | null
          id?: string
          is_used?: boolean
          source?: string
          source_id?: string | null
          status?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_referral_by_admin: {
        Args: {
          referral_id_param: string
          admin_user_id: string
          admin_notes_param?: string
        }
        Returns: Json
      }
      approve_referral_credits: {
        Args: { order_id_param: string; user_id_param: string }
        Returns: Json
      }
      audit_admin_action: {
        Args: {
          action_type: string
          table_name: string
          record_id?: string
          details?: Json
        }
        Returns: string
      }
      check_help_interaction_rate_limit: {
        Args: {
          p_user_id?: string
          p_ip_address?: unknown
          p_session_id?: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          identifier: string
          max_requests?: number
          window_seconds?: number
        }
        Returns: boolean
      }
      cleanup_abandoned_draft_orders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_help_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_secure_help_interaction: {
        Args: {
          p_question: string
          p_ai_response: string
          p_session_id: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      create_user_referral_code: {
        Args: { user_uuid: string }
        Returns: string
      }
      enhanced_help_rate_limit: {
        Args: {
          p_user_id?: string
          p_ip_address?: unknown
          p_session_id?: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      generate_referral_code: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_admin_referrals: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          referral_code: string
          created_at: string
          first_order_id: string
          admin_approved: boolean
          admin_approved_at: string
          admin_approved_by: string
          admin_notes: string
          reward_amount: number
          referrer_name: string
          referrer_user_id: string
          referred_name: string
          referred_user_id: string
          admin_name: string
        }[]
      }
      get_help_analytics: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          total_questions: number
          avg_satisfaction: number
          support_contact_rate: number
          top_questions: string[]
          daily_stats: Json
        }[]
      }
      get_security_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          event_type: string
          user_id: string
          details: Json
          ip_address: unknown
          user_agent: string
          created_at: string
          severity: string
        }[]
      }
      get_user_credits: {
        Args: { user_uuid: string }
        Returns: number
      }
      has_admin_role: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_event_type: string
          p_details?: Json
          p_severity?: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: string
      }
      process_referral: {
        Args: { referral_code_param: string; new_user_id: string }
        Returns: Json
      }
      update_order_payment_status: {
        Args: {
          p_order_id: string
          p_payment_status: string
          p_stripe_session_id?: string
        }
        Returns: undefined
      }
      update_order_status: {
        Args: {
          p_order_id: string
          p_status: string
          p_message?: string
          p_estimated_completion?: string
          p_admin_notes?: string
        }
        Returns: undefined
      }
      use_user_credits: {
        Args: { user_uuid: string; amount_to_use: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "client"
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
      app_role: ["admin", "client"],
    },
  },
} as const
