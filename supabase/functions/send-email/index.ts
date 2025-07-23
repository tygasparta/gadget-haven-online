
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailQueueItem {
  id: string;
  user_id: string;
  template_key: string;
  recipient_email: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: Record<string, any>;
  retry_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Starting email processing...");

    // Get pending emails from the queue
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lt("retry_count", 3)
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error("Error fetching pending emails:", fetchError);
      throw fetchError;
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log("No pending emails found");
      return new Response(JSON.stringify({ message: "No pending emails" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${pendingEmails.length} pending emails`);

    const results = [];

    for (const email of pendingEmails as EmailQueueItem[]) {
      try {
        console.log(`Processing email ${email.id} for ${email.recipient_email}`);

        // Replace template variables in subject and content
        let processedSubject = email.subject;
        let processedHtmlContent = email.html_content;
        let processedTextContent = email.text_content;

        // Simple template variable replacement
        if (email.variables) {
          Object.entries(email.variables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), String(value));
            processedHtmlContent = processedHtmlContent.replace(new RegExp(placeholder, 'g'), String(value));
            if (processedTextContent) {
              processedTextContent = processedTextContent.replace(new RegExp(placeholder, 'g'), String(value));
            }
          });
        }

        // Send email using Resend
        const emailResponse = await resend.emails.send({
          from: "Gadget Genie <onboarding@resend.dev>",
          to: [email.recipient_email],
          subject: processedSubject,
          html: processedHtmlContent,
          text: processedTextContent,
        });

        console.log("Email sent successfully:", emailResponse);

        // Update email status to sent
        const { error: updateError } = await supabase
          .from("email_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", email.id);

        if (updateError) {
          console.error("Error updating email status:", updateError);
        }

        results.push({
          id: email.id,
          status: "sent",
          message: "Email sent successfully",
        });

      } catch (error: any) {
        console.error(`Error sending email ${email.id}:`, error);

        // Update email status to failed and increment retry count
        const { error: updateError } = await supabase
          .from("email_queue")
          .update({
            status: email.retry_count >= 2 ? "failed" : "pending",
            retry_count: email.retry_count + 1,
            error_message: error.message,
          })
          .eq("id", email.id);

        if (updateError) {
          console.error("Error updating failed email:", updateError);
        }

        results.push({
          id: email.id,
          status: "failed",
          message: error.message,
        });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-email function:", error);
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
