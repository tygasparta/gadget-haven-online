
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
    console.log("Starting Gmail email processing...");

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

    // Process each email using Gmail API
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

        // Create email message in RFC 2822 format
        const boundary = "boundary_" + Math.random().toString(36).substr(2, 9);
        const emailMessage = [
          `To: ${email.recipient_email}`,
          `From: Gadget Genie <${Deno.env.get("GMAIL_FROM_EMAIL")}>`,
          `Subject: ${subject}`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          "",
          `--${boundary}`,
          "Content-Type: text/plain; charset=utf-8",
          "",
          textContent || subject,
          "",
          `--${boundary}`,
          "Content-Type: text/html; charset=utf-8",
          "",
          htmlContent,
          "",
          `--${boundary}--`
        ].join("\r\n");

        // Base64 encode the message
        const encodedMessage = btoa(emailMessage).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // Send via Gmail API
        const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get("GMAIL_ACCESS_TOKEN")}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: encodedMessage
          })
        });

        if (!response.ok) {
          throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Email sent successfully via Gmail:", result);

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
      message: `Successfully processed ${processed} emails via Gmail` 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-gmail function:", error);
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
