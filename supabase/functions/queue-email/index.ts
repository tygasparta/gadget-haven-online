
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
    const { user_id, template_key, recipient_email, variables } = await req.json();

    console.log("Queueing email:", { user_id, template_key, recipient_email });

    // Call the queue_email_notification function
    const { data, error } = await supabase.rpc('queue_email_notification', {
      p_user_id: user_id,
      p_template_key: template_key,
      p_recipient_email: recipient_email,
      p_variables: variables || {},
    });

    if (error) {
      console.error("Error queueing email:", error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true, email_id: data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in queue-email function:", error);
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
