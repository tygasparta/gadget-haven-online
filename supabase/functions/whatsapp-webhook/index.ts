import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

console.log("GadgetGenie WhatsApp Bot v3.0 starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const STORE_NAME = "GadgetGenie";
const STORE_TAGLINE = "Your Smart Shopping Assistant";
const SALES_WHATSAPP = "263776337910";
const WEBSITE_URL = "https://gadget-haven-online.lovable.app";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}

// ===== MESSAGE SENDING HELPERS =====

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
    console.log("Message sent:", result.messages?.[0]?.id);
  }

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

async function sendText(phone: string, text: string) {
  return sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text }
  });
}

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

async function sendBuyButton(phone: string, productName: string, price: number) {
  const buyMessage = encodeURIComponent(
    `Hi ${STORE_NAME}! 👋\n\nI'd like to purchase:\n📱 ${productName}\n💰 $${price}\n\nPlease assist me!`
  );
  const buyUrl = `https://wa.me/${SALES_WHATSAPP}?text=${buyMessage}`;

  await sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "cta_url",
      body: {
        text: `🛒 *Ready to purchase?*\nTap below to chat with our sales team and complete your order instantly!`
      },
      action: {
        name: "cta_url",
        parameters: {
          display_text: "💳 Buy Now",
          url: buyUrl
        }
      }
    }
  });
}

// ===== AI ASSISTANT =====

async function getAIResponse(userMessage: string, context: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.log("AI not available - LOVABLE_API_KEY not set");
    return null;
  }

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are ${STORE_NAME}'s WhatsApp shopping assistant — friendly, helpful, and concise.

STORE INFO:
- Name: ${STORE_NAME}
- Website: ${WEBSITE_URL}
- Payment: EcoCash, PayPal, bank transfers
- Shipping: Collection & delivery available
- Returns: 14-day return policy
- Location: Zimbabwe

CAPABILITIES (tell users about these):
- Browse products by category (type "browse")
- Search products (type "search <product name>")
- View hot deals (type "deals")
- Track orders (type "track <order-id>")
- Subscribe to daily deals (type "subscribe")
- Get help (type "help")

RULES:
- Keep responses under 200 words
- Use emojis naturally but not excessively
- If asked about a specific product, suggest they type "search <product name>"
- If asked about prices, suggest browsing categories or searching
- If asked to buy, explain they can browse products and use the Buy Now button
- Never make up product information or prices
- Always stay in character as a shopping assistant
- Be warm and professional
- If the question is completely unrelated to shopping/electronics, politely redirect

PRODUCT CONTEXT:
${context}`
          },
          { role: "user", content: userMessage }
        ],
        max_tokens: 300,
      })
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("AI error:", e);
    return null;
  }
}

async function getProductContext(): Promise<string> {
  const supabase = getSupabase();
  
  const { data: categories } = await supabase
    .from("products")
    .select("category")
    .is("deleted_at", null)
    .not("category", "is", null);

  const uniqueCategories = [...new Set((categories || []).map(p => p.category).filter(Boolean))];

  const { data: featured } = await supabase
    .from("products")
    .select("name, price, brand, category")
    .is("deleted_at", null)
    .eq("is_featured", true)
    .limit(5);

  const { data: deals } = await supabase
    .from("products")
    .select("name, price, discount_percentage")
    .is("deleted_at", null)
    .gt("discount_percentage", 0)
    .order("discount_percentage", { ascending: false })
    .limit(5);

  let context = `Categories: ${uniqueCategories.join(", ")}\n`;
  if (featured?.length) {
    context += `Featured: ${featured.map(p => `${p.name} ($${p.price})`).join(", ")}\n`;
  }
  if (deals?.length) {
    context += `Top Deals: ${deals.map(p => `${p.name} ($${p.price}, ${p.discount_percentage}% off)`).join(", ")}`;
  }
  return context;
}

// ===== PRODUCT RECOMMENDATIONS =====

async function sendProductRecommendations(phone: string, currentProductId: number, category: string | null) {
  if (!category) return;
  
  const supabase = getSupabase();
  const { data: similar } = await supabase
    .from("products")
    .select("id, name, price, brand, discount_percentage, stock")
    .eq("category", category)
    .neq("id", currentProductId)
    .is("deleted_at", null)
    .gt("stock", 0)
    .order("is_featured", { ascending: false })
    .limit(5);

  if (!similar || similar.length === 0) return;

  const rows = similar.map(p => {
    const priceText = p.discount_percentage && p.discount_percentage > 0
      ? `$${p.price} (-${p.discount_percentage}%)`
      : `$${p.price}`;
    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${priceText} • ${p.brand || ""}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `💡 *You Might Also Like*\n━━━━━━━━━━━━━━━━━━━━\n\n🎯 ${similar.length} similar product${similar.length > 1 ? "s" : ""} in *${category}*`,
    "View Similar",
    [{
      title: `More in ${category}`,
      rows: rows
    }]
  );
}

// ===== SUBSCRIPTION MANAGEMENT =====

async function handleSubscribe(phone: string) {
  const supabase = getSupabase();
  
  const { data: existing } = await supabase
    .from("whatsapp_subscriptions")
    .select("id, subscribed_deals")
    .eq("phone_number", phone)
    .single();

  if (existing?.subscribed_deals) {
    await sendText(phone,
      `✅ *Already Subscribed!*\n━━━━━━━━━━━━━━━━━━━━\n\n` +
      `You're already receiving daily deals! 🎉\n\n` +
      `Type *unsubscribe* to stop notifications.`
    );
    return;
  }

  if (existing) {
    await supabase
      .from("whatsapp_subscriptions")
      .update({ subscribed_deals: true, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("whatsapp_subscriptions")
      .insert({ phone_number: phone, subscribed_deals: true });
  }

  await sendText(phone,
    `🔔 *Subscribed to Daily Deals!*\n━━━━━━━━━━━━━━━━━━━━\n\n` +
    `You'll receive our best deals every day! 🎉\n\n` +
    `🏷️ Flash sales & exclusive discounts\n` +
    `📱 New product arrivals\n` +
    `🔥 Limited-time offers\n\n` +
    `Type *unsubscribe* anytime to stop.`
  );
}

async function handleUnsubscribe(phone: string) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("whatsapp_subscriptions")
    .select("id, subscribed_deals")
    .eq("phone_number", phone)
    .single();

  if (!existing || !existing.subscribed_deals) {
    await sendText(phone,
      `ℹ️ You're not currently subscribed to daily deals.\n\nType *subscribe* to start receiving deals!`
    );
    return;
  }

  await supabase
    .from("whatsapp_subscriptions")
    .update({ subscribed_deals: false, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  await sendText(phone,
    `🔕 *Unsubscribed*\n━━━━━━━━━━━━━━━━━━━━\n\n` +
    `You won't receive daily deal notifications anymore.\n\n` +
    `Type *subscribe* anytime to re-enable! 💡`
  );
}

// ===== BOT MENUS & FLOWS =====

async function sendMainMenu(phone: string) {
  const header = `━━━━━━━━━━━━━━━━━━━━\n` +
    `   🧞 *${STORE_NAME}*\n` +
    `   _${STORE_TAGLINE}_\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Welcome! 👋 I'm your personal\nshopping assistant. I can help\nyou find the perfect gadget!\n\n` +
    `💡 _Tip: You can type naturally!\nAsk me anything about products._`;

  await sendButtons(phone, header, [
    { id: "menu_categories", title: "🛍️ Shop Now" },
    { id: "menu_deals", title: "🔥 Today's Deals" },
    { id: "menu_more", title: "⚡ More Options" }
  ]);
}

async function sendMoreOptions(phone: string) {
  await sendList(phone,
    `⚡ *More Options*\n\nWhat would you like to do?`,
    "Choose Option",
    [{
      title: "Services",
      rows: [
        { id: "menu_search", title: "🔍 Search Products", description: "Find products by name or keyword" },
        { id: "menu_track", title: "📦 Track My Order", description: "Check your order status" },
        { id: "menu_subscribe", title: "🔔 Daily Deals", description: "Subscribe to daily deal alerts" },
        { id: "menu_help", title: "💬 Help & Support", description: "Get assistance from our team" },
        { id: "menu_website", title: "🌐 Visit Website", description: "Browse our full catalog online" }
      ]
    }]
  );
}

async function sendCategories(phone: string) {
  const supabase = getSupabase();

  const { data: products } = await supabase
    .from("products")
    .select("category")
    .is("deleted_at", null)
    .not("category", "is", null);

  const categories = [...new Set((products || []).map(p => p.category).filter(Boolean))];

  if (categories.length === 0) {
    await sendText(phone, "😔 No categories available right now. Check back soon!");
    return;
  }

  const categoryRows = categories.slice(0, 10).map((cat) => {
    const count = (products || []).filter(p => p.category === cat).length;
    return {
      id: `cat_${cat}`,
      title: (cat as string).substring(0, 24),
      description: `${count} product${count !== 1 ? 's' : ''} available`
    };
  });

  await sendList(
    phone,
    `🛍️ *Shop by Category*\n━━━━━━━━━━━━━━━━━━━━\n\nBrowse our collection by category.\nTap to explore! 👇`,
    "View Categories",
    [{
      title: "All Categories",
      rows: categoryRows
    }]
  );
}

async function sendProductsByCategory(phone: string, category: string) {
  const supabase = getSupabase();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, original_price, discount_percentage, brand, stock")
    .eq("category", category)
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .limit(10);

  if (!products || products.length === 0) {
    await sendText(phone, `No products found in *${category}*. Try another category! 🔄`);
    await sendCategories(phone);
    return;
  }

  const rows = products.map(p => {
    const priceText = p.discount_percentage && p.discount_percentage > 0
      ? `$${p.price} (-${p.discount_percentage}%)`
      : `$${p.price}`;
    const stock = (p.stock ?? 0) > 0 ? "✅" : "❌";

    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${stock} ${priceText} • ${p.brand || ""}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `🛍️ *${category}*\n━━━━━━━━━━━━━━━━━━━━\n\n📦 ${products.length} product${products.length > 1 ? 's' : ''} found\nTap any item for full details & pricing`,
    "Browse Products",
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
    await sendText(phone, "😔 Sorry, this product is no longer available.");
    return;
  }

  const inStock = (product.stock ?? 0) > 0;
  const stockLine = inStock
    ? `✅ *In Stock* — ${product.stock} available`
    : `❌ *Out of Stock*`;

  const ratingStars = product.rating
    ? "⭐".repeat(Math.min(Math.round(product.rating), 5)) + ` ${product.rating}/5 (${product.reviews || 0} reviews)`
    : "No reviews yet";

  let priceBlock = `💰 *$${product.price}*`;
  if (product.original_price && product.discount_percentage && product.discount_percentage > 0) {
    priceBlock = `💰 ~$${product.original_price}~ → *$${product.price}*\n🏷️ *SAVE ${product.discount_percentage}%!*`;
  }

  const brandLine = product.brand ? `🏢 *Brand:* ${product.brand}` : "";

  let specsBlock = "";
  if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
    const specs = product.specifications.slice(0, 5).map((s: any) =>
      `   ▸ ${s.key || s.name}: *${s.value}*`
    ).join("\n");
    specsBlock = `\n\n📋 *Key Specs*\n${specs}`;
  }

  let boxBlock = "";
  if (product.whats_in_box && product.whats_in_box.length > 0) {
    const items = product.whats_in_box.slice(0, 5).map((item: string) => `   📦 ${item}`).join("\n");
    boxBlock = `\n\n🎁 *In the Box*\n${items}`;
  }

  const descBlock = product.description
    ? `\n\n📝 ${product.description.substring(0, 250)}`
    : "";

  const message = [
    `━━━━━━━━━━━━━━━━━━━━`,
    `📱 *${product.name}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    ``,
    brandLine,
    priceBlock,
    ratingStars,
    stockLine,
    specsBlock,
    boxBlock,
    descBlock
  ].filter(Boolean).join("\n");

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

  // Buy Now CTA if in stock
  if (inStock) {
    await sendBuyButton(phone, product.name, product.price);
  }

  await sendButtons(phone,
    inStock
      ? "🛍️ Continue shopping?"
      : "😔 This item is out of stock. Browse alternatives?",
    [
      { id: "menu_categories", title: "🛍️ Shop More" },
      { id: "menu_search", title: "🔍 Search" },
      { id: "menu_main", title: "🏠 Main Menu" }
    ]
  );

  // Send product recommendations from same category
  await sendProductRecommendations(phone, productId, product.category);
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
    await sendText(phone, "🔜 No active deals right now — check back soon for hot offers!");
    await sendMainMenu(phone);
    return;
  }

  const rows = deals.map(p => ({
    id: `prod_${p.id}`,
    title: p.name.substring(0, 24),
    description: `$${p.price} • Save ${p.discount_percentage}%!`.substring(0, 72)
  }));

  await sendList(
    phone,
    `🔥 *Today's Hot Deals*\n━━━━━━━━━━━━━━━━━━━━\n\n🏷️ Up to *${deals[0].discount_percentage}% OFF*!\nDon't miss these limited-time offers 👇`,
    "View All Deals",
    [{
      title: "🔥 Hot Deals",
      rows: rows
    }]
  );
}

async function sendHelp(phone: string) {
  await sendText(phone,
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💬 *${STORE_NAME} Support*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `How can we help you?\n\n` +
    `🔍 *Search:* Type _search_ + product name\n` +
    `   Example: _search Samsung Galaxy_\n\n` +
    `📦 *Track:* Type _track_ + order ID\n` +
    `   Example: _track abc12345_\n\n` +
    `🛍️ *Browse:* Type _browse_ or _shop_\n\n` +
    `🔥 *Deals:* Type _deals_ or _offers_\n\n` +
    `🔔 *Subscribe:* Type _subscribe_ for daily deals\n` +
    `🔕 *Unsubscribe:* Type _unsubscribe_ to stop\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📞 *Contact Sales:* wa.me/${SALES_WHATSAPP}\n` +
    `🌐 *Website:* ${WEBSITE_URL}\n` +
    `🔄 *Returns:* 14-day return policy\n` +
    `🚚 *Shipping:* Collection & delivery\n` +
    `💳 *Payment:* EcoCash • PayPal • Bank\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💡 _Or just ask me anything — I'm AI-powered!_ 🧞`
  );
}

async function sendWebsiteLink(phone: string) {
  await sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "interactive",
    interactive: {
      type: "cta_url",
      body: {
        text: `🌐 *Visit ${STORE_NAME} Online*\n\nBrowse our full catalog, manage your account, and shop with ease!`
      },
      action: {
        name: "cta_url",
        parameters: {
          display_text: "🌐 Open Website",
          url: WEBSITE_URL
        }
      }
    }
  });
}

// ===== ORDER TRACKING =====

async function sendOrderTrackingPrompt(phone: string) {
  await sendText(phone,
    `📦 *Track Your Order*\n━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Send your order ID in this format:\n\n` +
    `👉 *track <order-id>*\n\n` +
    `_Example: track abc12345-6789_\n\n` +
    `📧 Find your order ID in your\nconfirmation email or account.`
  );
}

async function sendOrderStatus(phone: string, orderId: string) {
  const supabase = getSupabase();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total_amount, payment_method, shipping_method, created_at, updated_at")
    .eq("id", orderId.trim())
    .single();

  if (!order) {
    await sendText(phone,
      `❌ *Order Not Found*\n\n` +
      `No order found with ID:\n_${orderId}_\n\n` +
      `Please check and try again.`
    );
    return;
  }

  const statusConfig: Record<string, { emoji: string; label: string; progress: string }> = {
    "pending": { emoji: "⏳", label: "Pending", progress: "▓░░░░" },
    "confirmed": { emoji: "✅", label: "Confirmed", progress: "▓▓░░░" },
    "processing": { emoji: "⚙️", label: "Processing", progress: "▓▓▓░░" },
    "shipped": { emoji: "🚚", label: "Shipped", progress: "▓▓▓▓░" },
    "delivered": { emoji: "📬", label: "Delivered", progress: "▓▓▓▓▓" },
    "cancelled": { emoji: "❌", label: "Cancelled", progress: "✕✕✕✕✕" },
  };

  const status = statusConfig[order.status || "pending"] || { emoji: "📋", label: order.status, progress: "░░░░░" };
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const lastUpdate = new Date(order.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, price, product_id")
    .eq("order_id", order.id);

  let itemsBlock = "";
  if (items && items.length > 0) {
    const productIds = items.map(i => i.product_id).filter(Boolean);
    const { data: products } = await supabase.from("products").select("id, name").in("id", productIds);
    const productMap = new Map((products || []).map(p => [p.id, p.name]));

    const lines = items.map(i => {
      const name = productMap.get(i.product_id) || "Product";
      return `   ▸ ${name} ×${i.quantity} — $${i.price}`;
    }).join("\n");
    itemsBlock = `\n\n🛒 *Items*\n${lines}`;
  }

  await sendText(phone,
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *Order Status*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📋 *ID:* _${order.id.substring(0, 8)}..._\n` +
    `📅 *Date:* ${orderDate}\n\n` +
    `${status.emoji} *Status: ${status.label}*\n` +
    `[${status.progress}]\n\n` +
    `💰 *Total:* $${order.total_amount}` +
    (order.payment_method ? `\n💳 *Payment:* ${order.payment_method}` : "") +
    (order.shipping_method ? `\n🚚 *Shipping:* ${order.shipping_method}` : "") +
    itemsBlock +
    `\n\n🕐 _Updated: ${lastUpdate}_`
  );

  await sendButtons(phone, "What's next?", [
    { id: "menu_categories", title: "🛍️ Shop More" },
    { id: "menu_deals", title: "🔥 Deals" },
    { id: "menu_main", title: "🏠 Main Menu" }
  ]);
}

// ===== PRODUCT SEARCH =====

async function sendSearchPrompt(phone: string) {
  await sendText(phone,
    `🔍 *Product Search*\n━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Type *search* followed by a keyword:\n\n` +
    `   _search iPhone_\n` +
    `   _search Samsung Galaxy_\n` +
    `   _search headphones_\n` +
    `   _search laptop_\n\n` +
    `💡 _Or just describe what you're\nlooking for — I'm AI-powered!_ 🧞`
  );
}

async function searchProducts(phone: string, query: string) {
  const supabase = getSupabase();
  const searchTerm = `%${query.trim()}%`;

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, original_price, discount_percentage, brand, stock, category")
    .is("deleted_at", null)
    .or(`name.ilike.${searchTerm},brand.ilike.${searchTerm},category.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order("is_featured", { ascending: false })
    .limit(10);

  if (!products || products.length === 0) {
    await sendText(phone,
      `🔍 No results for "*${query}*"\n\n` +
      `💡 *Try:*\n` +
      `   ▸ Different keyword\n` +
      `   ▸ Brand name (Samsung, Apple)\n` +
      `   ▸ Category (Smartphones, Audio)\n\n` +
      `_Or ask me in natural language!_ 🧞`
    );
    await sendButtons(phone, "Browse instead?", [
      { id: "menu_categories", title: "🛍️ Categories" },
      { id: "menu_deals", title: "🔥 Deals" },
      { id: "menu_main", title: "🏠 Menu" }
    ]);
    return;
  }

  const rows = products.map(p => {
    const priceText = p.discount_percentage && p.discount_percentage > 0
      ? `$${p.price} (-${p.discount_percentage}%)`
      : `$${p.price}`;
    const stock = (p.stock ?? 0) > 0 ? "✅" : "❌";

    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${stock} ${priceText} • ${p.brand || ""}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `🔍 *Results for "${query}"*\n━━━━━━━━━━━━━━━━━━━━\n\n🎯 Found ${products.length} match${products.length > 1 ? "es" : ""}`,
    "View Results",
    [{
      title: "Search Results",
      rows: rows
    }]
  );
}

// ===== CONVERSATION STORAGE =====

async function storeUserMessage(phone: string, content: any, messageId: string | null) {
  const supabase = getSupabase();

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

  await supabase.from("whatsapp_messages").insert({
    conversation_id: conversationId,
    sender_type: "user",
    message_type: "text",
    content: typeof content === "string" ? { body: content } : content,
    message_id: messageId,
  });
}

// ===== MESSAGE PROCESSING =====

async function processMessage(phone: string, messageText: string, messageId: string | null) {
  await storeUserMessage(phone, messageText, messageId);

  const text = messageText.toLowerCase().trim();

  // Greeting / Menu triggers
  if (["hi", "hello", "hey", "start", "menu", "home", "hie", "main menu", "yo", "sup"].includes(text)) {
    await sendMainMenu(phone);
    return;
  }

  // Help triggers
  if (["help", "support", "contact", "question", "help me", "assist"].includes(text)) {
    await sendHelp(phone);
    return;
  }

  // Deals triggers
  if (["deals", "offers", "sale", "discount", "discounts", "hot deals", "promo"].includes(text)) {
    await sendDeals(phone);
    return;
  }

  // Browse triggers
  if (["browse", "products", "shop", "categories", "category", "catalog", "catalogue", "shop now"].includes(text)) {
    await sendCategories(phone);
    return;
  }

  // Subscribe / Unsubscribe
  if (["subscribe", "notify me", "daily deals", "alerts", "notifications"].includes(text)) {
    await handleSubscribe(phone);
    return;
  }
  if (["unsubscribe", "stop", "stop notifications", "no deals", "opt out"].includes(text)) {
    await handleUnsubscribe(phone);
    return;
  }

  // Order tracking triggers
  if (["track", "order", "tracking", "my order", "order status", "where is my order"].includes(text)) {
    await sendOrderTrackingPrompt(phone);
    return;
  }

  // Track with order ID
  if (text.startsWith("track ") && text.length > 6) {
    const orderId = messageText.trim().substring(6).trim();
    await sendOrderStatus(phone, orderId);
    return;
  }

  // Search triggers
  if (["search", "find", "lookup", "look up"].includes(text)) {
    await sendSearchPrompt(phone);
    return;
  }

  // Search with query
  if (text.startsWith("search ") && text.length > 7) {
    await searchProducts(phone, messageText.trim().substring(7).trim());
    return;
  }
  if (text.startsWith("find ") && text.length > 5) {
    await searchProducts(phone, messageText.trim().substring(5).trim());
    return;
  }

  // More options
  if (["more", "options", "more options", "other"].includes(text)) {
    await sendMoreOptions(phone);
    return;
  }

  // Website
  if (["website", "site", "web", "online"].includes(text)) {
    await sendWebsiteLink(phone);
    return;
  }

  // Buy/purchase intent
  if (["buy", "purchase", "order", "checkout"].includes(text)) {
    await sendText(phone,
      `🛒 *Ready to Purchase?*\n\n` +
      `Browse our products first, then tap\n*Buy Now* on any item to connect\nwith our sales team!\n\n` +
      `Or contact sales directly: 👇`
    );
    await sendWhatsAppMessage(phone, {
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "cta_url",
        body: { text: `💬 Chat with our sales team` },
        action: {
          name: "cta_url",
          parameters: {
            display_text: "💬 Contact Sales",
            url: `https://wa.me/${SALES_WHATSAPP}`
          }
        }
      }
    });
    return;
  }

  // ===== AI FALLBACK =====
  console.log("Using AI for unrecognized message:", text);

  const context = await getProductContext();
  const aiResponse = await getAIResponse(messageText, context);

  if (aiResponse) {
    await sendText(phone, aiResponse);
    await sendButtons(phone, "Quick actions:", [
      { id: "menu_categories", title: "🛍️ Shop Now" },
      { id: "menu_search", title: "🔍 Search" },
      { id: "menu_main", title: "🏠 Menu" }
    ]);
  } else {
    await sendText(phone, `🤔 I'm not sure about that.\nLet me show you what I can do!`);
    await sendMainMenu(phone);
  }
}

// Process interactive replies
async function processInteractiveReply(phone: string, replyId: string, replyTitle: string) {
  await storeUserMessage(phone, `[Selected: ${replyTitle}]`, null);

  const handlers: Record<string, () => Promise<void>> = {
    "menu_main": () => sendMainMenu(phone),
    "menu_categories": () => sendCategories(phone),
    "menu_deals": () => sendDeals(phone),
    "menu_help": () => sendHelp(phone),
    "menu_more": () => sendMoreOptions(phone),
    "menu_track": () => sendOrderTrackingPrompt(phone),
    "menu_search": () => sendSearchPrompt(phone),
    "menu_website": () => sendWebsiteLink(phone),
    "menu_subscribe": () => handleSubscribe(phone),
  };

  if (handlers[replyId]) {
    await handlers[replyId]();
    return;
  }

  if (replyId.startsWith("cat_")) {
    await sendProductsByCategory(phone, replyId.substring(4));
    return;
  }

  if (replyId.startsWith("prod_")) {
    const productId = parseInt(replyId.substring(5), 10);
    if (!isNaN(productId)) {
      await sendProductDetail(phone, productId);
      return;
    }
  }

  await sendMainMenu(phone);
}

// Extract message data from webhook payload
function extractMessageData(body: any) {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages || value.messages.length === 0) return null;

    const message = value.messages[0];
    const phone = message.from;
    const messageId = message.id;

    if (message.type === "text") {
      return { phone, text: message.text.body, type: "text", messageId };
    }

    if (message.type === "interactive") {
      const interactive = message.interactive;
      if (interactive.type === "button_reply") {
        return { phone, replyId: interactive.button_reply.id, replyTitle: interactive.button_reply.title, type: "interactive", messageId };
      }
      if (interactive.type === "list_reply") {
        return { phone, replyId: interactive.list_reply.id, replyTitle: interactive.list_reply.title, type: "interactive", messageId };
      }
    }

    if (message.from) {
      return { phone: message.from, text: "[unsupported message type]", type: "text", messageId };
    }

    return null;
  } catch (e) {
    console.error("Error extracting message:", e);
    return null;
  }
}

// ===== MAIN SERVER =====

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified!");
      return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
    }
    console.log("❌ Verification failed");
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method === "POST") {
    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Failed to parse body:", e);
      return new Response("OK", { status: 200 });
    }

    console.log("Webhook from:", req.headers.get("user-agent"));
    const msgData = extractMessageData(body);

    if (!msgData) {
      console.log("No message data (status update)");
      return new Response("OK", { status: 200 });
    }

    console.log("Processing:", JSON.stringify(msgData));

    EdgeRuntime.waitUntil(
      (async () => {
        try {
          if (msgData.type === "interactive") {
            await processInteractiveReply(msgData.phone, msgData.replyId!, msgData.replyTitle!);
          } else {
            await processMessage(msgData.phone, msgData.text!, msgData.messageId);
          }
          console.log("✅ Done for", msgData.phone);
        } catch (error) {
          console.error("Error:", error);
        }
      })()
    );

    return new Response("OK", { status: 200 });
  }

  return new Response("Method not allowed", { status: 405 });
});
