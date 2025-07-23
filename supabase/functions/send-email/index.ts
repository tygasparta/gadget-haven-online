
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface EmailQueueItem {
  id: string;
  recipient_email: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_key: string;
  variables: Record<string, any>;
  retry_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting email processing...");

    // Get pending emails from queue
    const { data: emails, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lt("retry_count", 3)
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error("Error fetching emails:", fetchError);
      throw fetchError;
    }

    if (!emails || emails.length === 0) {
      console.log("No pending emails found");
      return new Response(JSON.stringify({ processed: 0, message: "No pending emails" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Found ${emails.length} pending emails`);

    let processed = 0;
    let errors = 0;

    // Process each email
    for (const email of emails as EmailQueueItem[]) {
      try {
        console.log(`Processing email ${email.id} to ${email.recipient_email}`);

        // Replace variables in content
        let subject = email.subject;
        let htmlContent = email.html_content;
        let textContent = email.text_content || "";

        // Simple variable replacement
        if (email.variables) {
          Object.entries(email.variables).forEach(([key, value]) => {
            const placeholder = `{${key}}`;
            subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
            htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
            textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
          });
        }

        // Send email via Resend
        const emailResponse = await resend.emails.send({
          from: "Gadget Genie <onboarding@resend.dev>",
          to: [email.recipient_email],
          subject: subject,
          html: htmlContent,
          text: textContent || undefined,
        });

        console.log("Email sent successfully:", emailResponse);

        // Update email status to sent
        await supabase
          .from("email_queue")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            error_message: null,
          })
          .eq("id", email.id);

        processed++;
      } catch (emailError: any) {
        console.error(`Error sending email ${email.id}:`, emailError);
        errors++;

        // Update email status to failed and increment retry count
        await supabase
          .from("email_queue")
          .update({
            status: email.retry_count >= 2 ? "failed" : "pending",
            retry_count: email.retry_count + 1,
            error_message: emailError.message,
          })
          .eq("id", email.id);
      }
    }

    console.log(`Email processing complete. Processed: ${processed}, Errors: ${errors}`);

    return new Response(JSON.stringify({ 
      processed, 
      errors, 
      message: `Successfully processed ${processed} emails` 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        processed: 0 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
