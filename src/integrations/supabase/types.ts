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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          isdefault: boolean
          line1: string
          line2: string | null
          name: string
          state: string
          type: string
          updated_at: string
          user_id: string
          zipcode: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          isdefault?: boolean
          line1: string
          line2?: string | null
          name: string
          state: string
          type?: string
          updated_at?: string
          user_id: string
          zipcode: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          isdefault?: boolean
          line1?: string
          line2?: string | null
          name?: string
          state?: string
          type?: string
          updated_at?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      bot_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: number | null
          quantity: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: number | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: number | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      email_preferences: {
        Row: {
          created_at: string
          id: string
          newsletter: boolean
          order_confirmations: boolean
          order_status_updates: boolean
          promotional_emails: boolean
          shipping_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          newsletter?: boolean
          order_confirmations?: boolean
          order_status_updates?: boolean
          promotional_emails?: boolean
          shipping_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          newsletter?: boolean
          order_confirmations?: boolean
          order_status_updates?: boolean
          promotional_emails?: boolean
          shipping_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string
          error_message: string | null
          html_content: string
          id: string
          recipient_email: string
          retry_count: number | null
          sent_at: string | null
          status: string
          subject: string
          template_key: string
          text_content: string | null
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          html_content: string
          id?: string
          recipient_email: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          template_key: string
          text_content?: string | null
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          html_content?: string
          id?: string
          recipient_email?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_key?: string
          text_content?: string | null
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          subject: string
          template_key: string
          text_content: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          subject: string
          template_key: string
          text_content?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          subject?: string
          template_key?: string
          text_content?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: number | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: number | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          customer_phone: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          shipping_address: Json | null
          shipping_method: string | null
          source: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          customer_phone?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          source?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          customer_phone?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address?: Json | null
          shipping_method?: string | null
          source?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          id: string
          instructions: string | null
          order_id: string | null
          payment_method: string
          payment_reference: string
          poll_url: string | null
          redirect_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          instructions?: string | null
          order_id?: string | null
          payment_method: string
          payment_reference: string
          poll_url?: string | null
          redirect_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          instructions?: string | null
          order_id?: string | null
          payment_method?: string
          payment_reference?: string
          poll_url?: string | null
          redirect_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_colors: {
        Row: {
          created_at: string
          hex_code: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          hex_code: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          hex_code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_galleries: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_main: boolean | null
          product_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_main?: boolean | null
          product_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_main?: boolean | null
          product_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_galleries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          colors: Json | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          discount_percentage: number | null
          id: number
          image: string
          is_featured: boolean | null
          is_flash_sale: boolean | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          reviews: number | null
          specifications: Json | null
          stock: number | null
          tags: string[] | null
          updated_at: string | null
          whats_in_box: string[] | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: number
          image: string
          is_featured?: boolean | null
          is_flash_sale?: boolean | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          reviews?: number | null
          specifications?: Json | null
          stock?: number | null
          tags?: string[] | null
          updated_at?: string | null
          whats_in_box?: string[] | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          id?: number
          image?: string
          is_featured?: boolean | null
          is_flash_sale?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          reviews?: number | null
          specifications?: Json | null
          stock?: number | null
          tags?: string[] | null
          updated_at?: string | null
          whats_in_box?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_cart_items: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          product_id: number
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          product_id: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          product_id?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          metadata: Json | null
          phone_number: string
          status: string
          updated_at: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          metadata?: Json | null
          phone_number: string
          status?: string
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          metadata?: Json | null
          phone_number?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: Json
          conversation_id: string
          created_at: string
          delivered: boolean | null
          id: string
          message_id: string | null
          message_type: string
          read: boolean | null
          sender_type: string
        }
        Insert: {
          content: Json
          conversation_id: string
          created_at?: string
          delivered?: boolean | null
          id?: string
          message_id?: string | null
          message_type?: string
          read?: boolean | null
          sender_type: string
        }
        Update: {
          content?: Json
          conversation_id?: string
          created_at?: string
          delivered?: boolean | null
          id?: string
          message_id?: string | null
          message_type?: string
          read?: boolean | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_subscriptions: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          subscribed_deals: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          subscribed_deals?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          subscribed_deals?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      queue_email_notification: {
        Args: {
          p_recipient_email: string
          p_template_key: string
          p_user_id: string
          p_variables?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
