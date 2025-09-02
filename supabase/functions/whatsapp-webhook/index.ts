import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
    const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");

    // Handle webhook verification (GET request)
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully");
        return new Response(challenge, { status: 200 });
      } else {
        console.log("Webhook verification failed");
        return new Response("Verification failed", { status: 403 });
      }
    }

    // Handle incoming messages (POST request)
    if (req.method === "POST") {
      const body = await req.json();
      console.log("Incoming webhook:", JSON.stringify(body, null, 2));

      // Check if it's a WhatsApp message
      if (body.entry && body.entry[0]?.changes && body.entry[0]?.changes[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const phone = message.from;
        const messageText = message.text?.body || "";
        const messageId = message.id;

        console.log(`Message from ${phone}: ${messageText}`);

        // Find or create conversation
        let { data: conversation, error: convError } = await supabase
          .from("whatsapp_conversations")
          .select("*")
          .eq("phone_number", phone)
          .single();

        if (convError || !conversation) {
          // Create new conversation
          const { data: newConv, error: createError } = await supabase
            .from("whatsapp_conversations")
            .insert({
              phone_number: phone,
              user_name: body.entry[0].changes[0].value?.contacts?.[0]?.profile?.name || phone,
              status: "active",
              last_message_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating conversation:", createError);
            return new Response("Error", { status: 500 });
          }
          conversation = newConv;
        }

        // Save incoming message
        await supabase.from("whatsapp_messages").insert({
          conversation_id: conversation.id,
          message_id: messageId,
          sender_type: "user",
          message_type: "text",
          content: { text: messageText },
          delivered: true,
          read: false
        });

        // Process the message and generate response
        await processUserMessage(conversation, messageText, phone, ACCESS_TOKEN);

        // Update conversation last message time
        await supabase
          .from("whatsapp_conversations")
          .update({ 
            last_message_at: new Date().toISOString(),
            status: "active"
          })
          .eq("id", conversation.id);
      }

      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function processUserMessage(conversation: any, messageText: string, phone: string, accessToken: string) {
  const lowerText = messageText.toLowerCase().trim();
  
  let response = "";
  let buttons = [];

  if (lowerText === "hi" || lowerText === "hello" || lowerText === "start") {
    // Send welcome message with menu
    response = "👋 Welcome to GadgetGenie! How can I help you today?\n\n📱 Choose an option below or type your request:";
    buttons = [
      { id: "products", title: "View Products" },
      { id: "search", title: "Search Products" },
      { id: "support", title: "Get Support" }
    ];
  } else if (lowerText === "products" || lowerText === "menu") {
    // Show product categories
    response = "📱 Here are our product categories:\n\n• Phones\n• Audio\n• Accessories\n\nType the category name to browse products!";
  } else if (lowerText.includes("search") || lowerText.includes("find")) {
    // Handle search queries
    const searchTerm = lowerText.replace(/search|find/g, "").trim();
    if (searchTerm) {
      const products = await searchProducts(searchTerm);
      if (products.length > 0) {
        response = `🔍 Found ${products.length} products for "${searchTerm}":\n\n`;
        products.slice(0, 3).forEach((product, index) => {
          response += `${index + 1}. ${product.name}\n💰 $${product.price}\n⭐ ${product.rating}/5\n\n`;
        });
        response += "Type 'buy [product name]' to purchase or 'details [product name]' for more info!";
      } else {
        response = `😔 No products found for "${searchTerm}". Try searching for phones, headphones, or accessories!`;
      }
    } else {
      response = "🔍 What would you like to search for? Example: 'search iPhone' or 'find headphones'";
    }
  } else if (lowerText.includes("price") || lowerText.includes("cost")) {
    // Handle price queries
    const productName = lowerText.replace(/price|cost|of|for/g, "").trim();
    if (productName) {
      const products = await searchProducts(productName);
      if (products.length > 0) {
        const product = products[0];
        response = `💰 ${product.name}\nPrice: $${product.price}\n⭐ Rating: ${product.rating}/5\n\nType 'buy ${product.name}' to purchase!`;
      } else {
        response = "❌ Product not found. Try searching by exact name or browse our categories!";
      }
    }
  } else if (lowerText.includes("buy") || lowerText.includes("order")) {
    // Handle purchase intent
    response = "🛒 Great! To place an order, please visit our website or provide:\n\n1. Product name\n2. Quantity needed\n3. Your delivery address\n\nOur team will assist you with the purchase process!";
  } else {
    // Default response with suggestions
    response = "🤔 I didn't quite understand that. Here's what I can help you with:\n\n📱 Type 'products' - Browse our catalog\n🔍 Type 'search [item]' - Find specific products\n💰 Type 'price [product]' - Get pricing info\n🛒 Type 'buy [product]' - Purchase items\n💬 Type 'support' - Get help\n\nWhat would you like to do?";
  }

  // Send response to WhatsApp
  await sendWhatsAppMessage(phone, response, accessToken, buttons);

  // Save bot response to database
  await supabase.from("whatsapp_messages").insert({
    conversation_id: conversation.id,
    sender_type: "bot",
    message_type: buttons.length > 0 ? "interactive" : "text",
    content: { 
      text: response, 
      buttons: buttons.length > 0 ? buttons : undefined 
    },
    delivered: false,
    read: false
  });
}

async function searchProducts(searchTerm: string) {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, rating, image, description")
      .ilike("name", `%${searchTerm}%`)
      .is("deleted_at", null)
      .limit(5);

    if (error) {
      console.error("Product search error:", error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

async function sendWhatsAppMessage(phone: string, message: string, accessToken: string, buttons: any[] = []) {
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  
  try {
    let messageBody;

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
            buttons: buttons.map((btn, index) => ({
              type: "reply",
              reply: {
                id: btn.id,
                title: btn.title
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

    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageBody)
    });

    const result = await response.json();
    console.log("WhatsApp API Response:", result);

    if (!response.ok) {
      console.error("Failed to send message:", result);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}