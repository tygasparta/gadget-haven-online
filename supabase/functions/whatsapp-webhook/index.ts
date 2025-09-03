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
    const url = new URL(req.url);
    
    // Handle GET request for webhook verification
    if (req.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      
      const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
      
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully");
        return new Response(challenge, { 
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      } else {
        console.log("Webhook verification failed");
        return new Response("Forbidden", { status: 403 });
      }
    }

    // Handle POST request for incoming messages
    if (req.method === "POST") {
      const body = await req.json();
      console.log("Webhook received:", JSON.stringify(body, null, 2));

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Process incoming message
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        const changes = body.entry[0].changes[0];
        
        if (changes.field === "messages" && changes.value.messages) {
          const message = changes.value.messages[0];
          const phone = message.from;
          const messageId = message.id;
          const messageText = message.text?.body || "";
          const messageType = message.type || "text";

          console.log(`Incoming message from ${phone}: ${messageText}`);

          // Find or create conversation
          let { data: conversation, error: conversationError } = await supabase
            .from("whatsapp_conversations")
            .select("*")
            .eq("phone_number", phone)
            .single();

          if (conversationError || !conversation) {
            // Create new conversation
            const { data: newConversation, error: createError } = await supabase
              .from("whatsapp_conversations")
              .insert({
                phone_number: phone,
                user_name: changes.value.contacts?.[0]?.profile?.name || null,
                status: "active",
                metadata: { source: "whatsapp" }
              })
              .select()
              .single();

            if (createError) {
              console.error("Error creating conversation:", createError);
              return new Response("Error", { status: 500 });
            }
            conversation = newConversation;
          }

          // Save incoming message
          const { error: messageError } = await supabase
            .from("whatsapp_messages")
            .insert({
              conversation_id: conversation.id,
              sender_type: "user",
              message_type: messageType,
              content: {
                text: messageText,
                message_id: messageId
              },
              message_id: messageId,
              delivered: true,
              read: false
            });

          if (messageError) {
            console.error("Error saving message:", messageError);
          }

          // Process message and send response
          await processUserMessage(conversation, messageText, phone);

          // Update conversation last message time
          await supabase
            .from("whatsapp_conversations")
            .update({ last_message_at: new Date().toISOString() })
            .eq("id", conversation.id);
        }
      }

      return new Response("OK", { 
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
        status: 200 
      });
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Error", { 
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
      status: 500 
    });
  }
});

async function processUserMessage(conversation: any, messageText: string, phone: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Get bot settings
  const { data: settings } = await supabase
    .from("bot_settings")
    .select("key, value");

  const botSettings = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as any) || {};

  // Determine message intent and generate response
  let responseText = "";
  let buttons: any[] = [];

  const lowerText = messageText.toLowerCase();

  // Welcome message
  if (lowerText.includes("hi") || lowerText.includes("hello") || lowerText.includes("start")) {
    responseText = botSettings.welcome_message?.message || "Hello! 👋 Welcome to Gadget Genie! How can I help you today?";
    buttons = [
      { id: "products", title: "Browse Products" },
      { id: "support", title: "Get Support" },
      { id: "deals", title: "Current Deals" }
    ];
  }
  // Product inquiry
  else if (botSettings.keywords?.product_keywords?.some((keyword: string) => lowerText.includes(keyword))) {
    responseText = "Great! I can help you find the perfect tech products. What are you looking for?";
    
    // Search for products matching the query
    const products = await searchProducts(messageText);
    if (products.length > 0) {
      responseText += `\n\nHere are some products I found:\n\n`;
      products.slice(0, 3).forEach((product: any, index: number) => {
        responseText += `${index + 1}. ${product.name} - $${product.price}\n`;
      });
      responseText += "\nWould you like more details about any of these?";
    }
  }
  // Support inquiry
  else if (botSettings.keywords?.support_keywords?.some((keyword: string) => lowerText.includes(keyword))) {
    responseText = "I'm here to help! What issue are you experiencing? Our support team will assist you shortly.";
    buttons = [
      { id: "contact", title: "Contact Support" },
      { id: "faq", title: "View FAQ" }
    ];
  }
  // Price inquiry
  else if (botSettings.keywords?.price_keywords?.some((keyword: string) => lowerText.includes(keyword))) {
    responseText = "I can help you find pricing information. What product are you interested in?";
  }
  // Default response
  else {
    responseText = "Thanks for your message! 😊 I'm your Gadget Genie assistant. How can I help you today?";
    buttons = [
      { id: "products", title: "Browse Products" },
      { id: "support", title: "Get Support" },
      { id: "deals", title: "Current Deals" }
    ];
  }

  // Send response
  await sendWhatsAppMessage(phone, responseText, buttons);

  // Save bot response to database
  await supabase
    .from("whatsapp_messages")
    .insert({
      conversation_id: conversation.id,
      sender_type: "bot",
      message_type: buttons.length > 0 ? "interactive" : "text",
      content: {
        text: responseText,
        buttons: buttons
      },
      delivered: false,
      read: false
    });
}

async function searchProducts(searchTerm: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, image")
    .ilike("name", `%${searchTerm}%`)
    .is("deleted_at", null)
    .limit(5);

  return products || [];
}

async function sendWhatsAppMessage(phone: string, message: string, buttons: any[] = []) {
  const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials not configured");
    return;
  }

  let messageBody: any;

  if (buttons.length > 0) {
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
  } else {
    // Send text message
    messageBody = {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message }
    };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
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
    }

  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}