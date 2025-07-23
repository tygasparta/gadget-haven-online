
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    console.log("Getting email preferences for user:", user_id);

    // Get email preferences from the database
    const { data, error } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No preferences found, create default ones
      const defaultPreferences = {
        user_id,
        order_confirmations: true,
        order_status_updates: true,
        shipping_notifications: true,
        promotional_emails: true,
        newsletter: true,
      };

      const { data: newData, error: insertError } = await supabase
        .from('email_preferences')
        .insert(defaultPreferences)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating default preferences:", insertError);
        throw insertError;
      }

      return new Response(JSON.stringify(newData), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (error) {
      console.error("Error fetching email preferences:", error);
      throw error;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in get-email-preferences function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
