import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

console.log("WhatsApp automated bot webhook starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Create Supabase client with service role for DB access
function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}

// Send a WhatsApp message via the Meta API
async function sendWhatsAppMessage(phone: string, messageBody: any) {
  const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials not configured");
    return null;
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(messageBody)
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("Failed to send message:", result);
  } else {
    console.log("Message sent successfully:", result.messages?.[0]?.id);
  }

  // Store bot message in DB
  try {
    const supabase = getSupabase();
    const { data: conversation } = await supabase
      .from("whatsapp_conversations")
      .select("id")
      .eq("phone_number", phone)
      .single();

    if (conversation) {
      await supabase.from("whatsapp_messages").insert({
        conversation_id: conversation.id,
        sender_type: "bot",
        message_type: messageBody.type || "text",
        content: messageBody,
        delivered: response.ok,
        message_id: result.messages?.[0]?.id || null,
      });
    }
  } catch (e) {
    console.error("Error storing bot message:", e);
  }

  return result;
}

// Send a text message
async function sendText(phone: string, text: string) {
  return sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text }
  });
}

// Send interactive button message
async function sendButtons(phone: string, bodyText: string, buttons: { id: string; title: string }[]) {
  return sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.slice(0, 3).map(btn => ({
          type: "reply",
          reply: { id: btn.id, title: btn.title.substring(0, 20) }
        }))
      }
    }
  });
}

// Send interactive list message
async function sendList(phone: string, bodyText: string, buttonLabel: string, sections: any[]) {
  return sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: buttonLabel.substring(0, 20),
        sections: sections
      }
    }
  });
}

// ===== BOT LOGIC =====

async function sendMainMenu(phone: string) {
  await sendButtons(phone, 
    "👋 Welcome to *Gadget Haven*! 🛒\n\nHow can I help you today?",
    [
      { id: "menu_categories", title: "📱 Browse Products" },
      { id: "menu_deals", title: "🔥 Hot Deals" },
      { id: "menu_help", title: "💬 Help & Support" }
    ]
  );
}

async function sendCategories(phone: string) {
  const supabase = getSupabase();

  // Get distinct categories from products
  const { data: products } = await supabase
    .from("products")
    .select("category")
    .is("deleted_at", null)
    .not("category", "is", null);

  const categories = [...new Set((products || []).map(p => p.category).filter(Boolean))];

  if (categories.length === 0) {
    await sendText(phone, "Sorry, no product categories available right now. Please check back later!");
    return;
  }

  const rows = categories.slice(0, 10).map((cat, i) => ({
    id: `cat_${cat}`,
    title: (cat as string).substring(0, 24),
    description: `Browse ${cat} products`
  }));

  await sendList(
    phone,
    "📱 *Product Categories*\n\nSelect a category to browse our products:",
    "View Categories",
    [{
      title: "Categories",
      rows: rows
    }]
  );
}

async function sendProductsByCategory(phone: string, category: string) {
  const supabase = getSupabase();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, original_price, discount_percentage, brand, stock, image, rating, reviews")
    .eq("category", category)
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .limit(10);

  if (!products || products.length === 0) {
    await sendText(phone, `No products found in "${category}". Try another category!`);
    await sendCategories(phone);
    return;
  }

  // Build product list
  const rows = products.map(p => {
    const priceText = p.discount_percentage && p.discount_percentage > 0
      ? `$${p.price} (${p.discount_percentage}% OFF)`
      : `$${p.price}`;
    const stockText = (p.stock ?? 0) > 0 ? "In Stock" : "Out of Stock";
    
    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${priceText} • ${stockText}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `🛍️ *${category}*\n\nWe found ${products.length} product${products.length > 1 ? 's' : ''}. Tap to view details:`,
    "View Products",
    [{
      title: category,
      rows: rows
    }]
  );
}

async function sendProductDetail(phone: string, productId: number) {
  const supabase = getSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .is("deleted_at", null)
    .single();

  if (!product) {
    await sendText(phone, "Sorry, this product is no longer available.");
    return;
  }

  const stockStatus = (product.stock ?? 0) > 0 ? `✅ In Stock (${product.stock} available)` : "❌ Out of Stock";
  const rating = product.rating ? `⭐ ${product.rating}/5 (${product.reviews || 0} reviews)` : "No reviews yet";

  let priceSection = `💰 *Price:* $${product.price}`;
  if (product.original_price && product.discount_percentage && product.discount_percentage > 0) {
    priceSection = `💰 *Price:* ~$${product.original_price}~ → *$${product.price}* (${product.discount_percentage}% OFF! 🎉)`;
  }

  // Build specs text
  let specsText = "";
  if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
    const specs = product.specifications.slice(0, 6).map((s: any) => `  • ${s.key || s.name}: ${s.value}`).join("\n");
    specsText = `\n\n📋 *Specifications:*\n${specs}`;
  }

  // Build what's in box text
  let boxText = "";
  if (product.whats_in_box && product.whats_in_box.length > 0) {
    const items = product.whats_in_box.slice(0, 5).map((item: string) => `  📦 ${item}`).join("\n");
    boxText = `\n\n🎁 *What's in the Box:*\n${items}`;
  }

  const brandText = product.brand ? `🏷️ *Brand:* ${product.brand}\n` : "";

  const message = `📱 *${product.name}*\n\n${brandText}${priceSection}\n${rating}\n${stockStatus}${specsText}${boxText}\n\n${product.description ? `📝 ${product.description.substring(0, 300)}` : ""}`;

  // Send product image if available
  if (product.image && (product.image.startsWith("http://") || product.image.startsWith("https://"))) {
    await sendWhatsAppMessage(phone, {
      messaging_product: "whatsapp",
      to: phone,
      type: "image",
      image: {
        link: product.image,
        caption: message.substring(0, 1024)
      }
    });
  } else {
    await sendText(phone, message);
  }

  // Send action buttons
  await sendButtons(phone,
    "What would you like to do?",
    [
      { id: "menu_categories", title: "📱 Browse More" },
      { id: "menu_deals", title: "🔥 Hot Deals" },
      { id: "menu_main", title: "🏠 Main Menu" }
    ]
  );
}

async function sendDeals(phone: string) {
  const supabase = getSupabase();

  const { data: deals } = await supabase
    .from("products")
    .select("id, name, price, original_price, discount_percentage, brand")
    .is("deleted_at", null)
    .gt("discount_percentage", 0)
    .order("discount_percentage", { ascending: false })
    .limit(10);

  if (!deals || deals.length === 0) {
    await sendText(phone, "No special deals right now. Check back soon! 🔜");
    await sendMainMenu(phone);
    return;
  }

  const rows = deals.map(p => ({
    id: `prod_${p.id}`,
    title: p.name.substring(0, 24),
    description: `$${p.price} (${p.discount_percentage}% OFF!)`.substring(0, 72)
  }));

  await sendList(
    phone,
    `🔥 *Hot Deals & Discounts*\n\nCheck out our best offers:`,
    "View Deals",
    [{
      title: "Current Deals",
      rows: rows
    }]
  );
}

async function sendHelp(phone: string) {
  await sendText(phone,
    `💬 *Help & Support*\n\n` +
    `Need assistance? Here's how we can help:\n\n` +
    `📞 *Contact us:* Send us a message here and our team will respond shortly.\n\n` +
    `🔄 *Returns:* We accept returns within 14 days of delivery.\n\n` +
    `🚚 *Shipping:* We offer collection and delivery options.\n\n` +
    `💳 *Payment:* We accept EcoCash, PayPal, and bank transfers.\n\n` +
    `Type *menu* anytime to go back to the main menu.`
  );
}

// Store incoming user message
async function storeUserMessage(phone: string, content: any, messageId: string | null) {
  const supabase = getSupabase();

  // Upsert conversation
  const { data: existingConvo } = await supabase
    .from("whatsapp_conversations")
    .select("id")
    .eq("phone_number", phone)
    .single();

  let conversationId: string;

  if (existingConvo) {
    conversationId = existingConvo.id;
    await supabase
      .from("whatsapp_conversations")
      .update({ last_message_at: new Date().toISOString(), status: "active" })
      .eq("id", conversationId);
  } else {
    const { data: newConvo } = await supabase
      .from("whatsapp_conversations")
      .insert({
        phone_number: phone,
        status: "active",
        last_message_at: new Date().toISOString()
      })
      .select("id")
      .single();
    conversationId = newConvo!.id;
  }

  // Store message
  await supabase.from("whatsapp_messages").insert({
    conversation_id: conversationId,
    sender_type: "user",
    message_type: "text",
    content: typeof content === "string" ? { body: content } : content,
    message_id: messageId,
  });
}

// Process incoming message
async function processMessage(phone: string, messageText: string, messageId: string | null) {
  // Store the user message first
  await storeUserMessage(phone, messageText, messageId);

  const text = messageText.toLowerCase().trim();

  // Main menu triggers
  if (["hi", "hello", "hey", "start", "menu", "home", "help me", "hie"].includes(text) || text === "main menu") {
    await sendMainMenu(phone);
    return;
  }

  // Help triggers
  if (["help", "support", "contact", "question"].includes(text)) {
    await sendHelp(phone);
    return;
  }

  // Deals triggers
  if (["deals", "offers", "sale", "discount", "discounts", "hot deals"].includes(text)) {
    await sendDeals(phone);
    return;
  }

  // Categories / browse triggers
  if (["browse", "products", "shop", "categories", "category", "catalog", "catalogue"].includes(text)) {
    await sendCategories(phone);
    return;
  }

  // Default: show main menu for any unrecognized text
  await sendText(phone, "I didn't quite understand that. Let me show you our menu! 😊");
  await sendMainMenu(phone);
}

// Process interactive button/list replies
async function processInteractiveReply(phone: string, replyId: string, replyTitle: string) {
  await storeUserMessage(phone, `[Selected: ${replyTitle}]`, null);

  // Main menu selections
  if (replyId === "menu_main") {
    await sendMainMenu(phone);
    return;
  }
  if (replyId === "menu_categories") {
    await sendCategories(phone);
    return;
  }
  if (replyId === "menu_deals") {
    await sendDeals(phone);
    return;
  }
  if (replyId === "menu_help") {
    await sendHelp(phone);
    return;
  }

  // Category selection (cat_CategoryName)
  if (replyId.startsWith("cat_")) {
    const category = replyId.substring(4);
    await sendProductsByCategory(phone, category);
    return;
  }

  // Product selection (prod_123)
  if (replyId.startsWith("prod_")) {
    const productId = parseInt(replyId.substring(5), 10);
    if (!isNaN(productId)) {
      await sendProductDetail(phone, productId);
      return;
    }
  }

  // Fallback
  await sendMainMenu(phone);
}

// Extract message data from webhook payload
function extractMessageData(body: any) {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages || value.messages.length === 0) {
      return null;
    }

    const message = value.messages[0];
    const phone = message.from;
    const messageId = message.id;

    // Text message
    if (message.type === "text") {
      return { phone, text: message.text.body, type: "text", messageId };
    }

    // Interactive reply (button or list)
    if (message.type === "interactive") {
      const interactive = message.interactive;
      if (interactive.type === "button_reply") {
        return {
          phone,
          replyId: interactive.button_reply.id,
          replyTitle: interactive.button_reply.title,
          type: "interactive",
          messageId
        };
      }
      if (interactive.type === "list_reply") {
        return {
          phone,
          replyId: interactive.list_reply.id,
          replyTitle: interactive.list_reply.title,
          type: "interactive",
          messageId
        };
      }
    }

    // For other message types (image, audio, etc.), treat as unrecognized
    if (message.from) {
      return { phone: message.from, text: "[unsupported message type]", type: "text", messageId };
    }

    return null;
  } catch (e) {
    console.error("Error extracting message:", e);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // GET: Webhook verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verification successful!");
      return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
    }
    console.log("❌ Webhook verification failed");
    return new Response("Forbidden", { status: 403 });
  }

  // POST: Process incoming messages
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("Webhook payload:", JSON.stringify(body, null, 2));

      const msgData = extractMessageData(body);

      if (!msgData) {
        // Could be a status update, not a message — acknowledge
        return new Response("OK", { status: 200 });
      }

      console.log("Processing message:", JSON.stringify(msgData));

      if (msgData.type === "interactive") {
        await processInteractiveReply(msgData.phone, msgData.replyId!, msgData.replyTitle!);
      } else {
        await processMessage(msgData.phone, msgData.text!, msgData.messageId);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Always return 200 to prevent Meta from retrying
      return new Response("OK", { status: 200 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
