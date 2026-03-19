import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, messageType = "text", buttons = [] } = await req.json();

    if (!phone || !message) {
      throw new Error("Phone number and message are required");
    }

    const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
      throw new Error("WhatsApp credentials not configured");
    }

    let messageBody: any;

    if (messageType === "interactive" && buttons.length > 0) {
      // Send interactive message with buttons
      messageBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: message
          },
          action: {
            buttons: buttons.slice(0, 3).map((btn: any, index: number) => ({
              type: "reply",
              reply: {
                id: btn.id || `btn_${index}`,
                title: btn.title.substring(0, 20) // WhatsApp button title limit
              }
            }))
          }
        }
      };
    } else if (messageType === "list") {
      // Send list message (for product catalogs)
      messageBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: message
          },
          action: {
            button: "View Options",
            sections: [
              {
                title: "Products",
                rows: buttons.slice(0, 10).map((btn: any, index: number) => ({
                  id: btn.id || `list_${index}`,
                  title: btn.title.substring(0, 24),
                  description: btn.description?.substring(0, 72) || ""
                }))
              }
            ]
          }
        }
      };
    } else {
      // Send text message
      messageBody = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message }
      };
    }

    console.log("Sending WhatsApp message:", JSON.stringify(messageBody, null, 2));

    const response = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageBody)
    });

    const result = await response.json();
    console.log("WhatsApp API Response:", result);

    if (!response.ok) {
      console.error("Failed to send message:", result);
      throw new Error(`WhatsApp API Error: ${result.error?.message || "Unknown error"}`);
    }

    // Update message as delivered if it has a message ID
    if (result.messages?.[0]?.id) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Find the conversation and update the latest bot message
      const { data: conversation } = await supabase
        .from("whatsapp_conversations")
        .select("id")
        .eq("phone_number", phone)
        .single();

      if (conversation) {
        await supabase
          .from("whatsapp_messages")
          .update({ 
            delivered: true,
            message_id: result.messages[0].id
          })
          .eq("conversation_id", conversation.id)
          .eq("sender_type", "bot")
          .eq("delivered", false)
          .order("created_at", { ascending: false })
          .limit(1);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.messages?.[0]?.id,
      whatsappId: result.messages?.[0]?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});