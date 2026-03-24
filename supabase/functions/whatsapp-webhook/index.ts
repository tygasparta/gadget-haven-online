import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

console.log("GadgetGenie WhatsApp Bot v5.0 starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const STORE_NAME = "GadgetGenie";
const STORE_TAGLINE = "Your Smart Shopping Assistant 🧞‍♂️";
const SALES_WHATSAPP = "263776337910";
const WEBSITE_URL = "https://gadgetgenie.org";


function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}

function firstName(fullName: string | null): string {
  if (!fullName) return "there";
  return fullName.split(" ")[0];
}

function timeGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
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
    text: { preview_url: true, body: text }
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

// ===== CART MANAGEMENT =====

async function getCartItems(phone: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("whatsapp_cart_items")
    .select(`
      id,
      product_id,
      quantity,
      products:product_id (
        id, name, price, stock, image
      )
    `)
    .eq("phone_number", phone);
  return data || [];
}

async function addToCart(phone: string, productId: number, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  // Check product exists and in stock
  const { data: product } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .eq("id", productId)
    .is("deleted_at", null)
    .single();

  if (!product) {
    await sendText(phone, `😔 Sorry ${name}, this product is no longer available.`);
    return;
  }

  if ((product.stock ?? 0) <= 0) {
    await sendText(phone, `❌ Sorry ${name}, *${product.name}* is out of stock.`);
    return;
  }

  // Upsert cart item
  const { data: existing } = await supabase
    .from("whatsapp_cart_items")
    .select("id, quantity")
    .eq("phone_number", phone)
    .eq("product_id", productId)
    .single();

  if (existing) {
    await supabase
      .from("whatsapp_cart_items")
      .update({ quantity: existing.quantity + 1, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("whatsapp_cart_items")
      .insert({ phone_number: phone, product_id: productId, quantity: 1 });
  }

  const cartItems = await getCartItems(phone);
  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);

  await sendText(phone,
    `✅ *Added to Cart!*\n\n` +
    `📱 ${product.name}\n` +
    `💰 $${product.price}\n\n` +
    `🛒 *Cart:* ${totalItems} item${totalItems !== 1 ? 's' : ''} • *$${totalPrice.toFixed(2)}*`
  );

  await sendButtons(phone, `What next, ${name}?`, [
    { id: "cart_view", title: "🛒 View Cart" },
    { id: "cart_checkout", title: "💳 Checkout" },
    { id: "menu_categories", title: "🛍️ Shop More" }
  ]);
}

async function sendCartView(phone: string, userName: string | null) {
  const name = firstName(userName);
  const cartItems = await getCartItems(phone);

  if (cartItems.length === 0) {
    await sendText(phone,
      `🛒 *Your Cart is Empty*\n\n` +
      `Hey ${name}, you haven't added anything yet.\n` +
      `Browse our products and tap *🛒 Add to Cart*!`
    );
    await sendButtons(phone, "Start shopping?", [
      { id: "menu_categories", title: "🛍️ Shop Now" },
      { id: "menu_deals", title: "🔥 Deals" },
      { id: "menu_main", title: "🏠 Menu" }
    ]);
    return;
  }

  const lines = cartItems.map((item: any, i: number) => {
    const p = item.products;
    return `${i + 1}. *${p.name}*\n   💰 $${p.price} × ${item.quantity} = *$${(p.price * item.quantity).toFixed(2)}*`;
  }).join("\n\n");

  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;

  await sendText(phone,
    `🛒 *Your Cart*\n\n` +
    `${lines}\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 *${totalItems} item${totalItems !== 1 ? 's' : ''}*\n` +
    `💵 Subtotal: $${subtotal.toFixed(2)}\n` +
    `📋 Tax (2%): $${tax.toFixed(2)}\n` +
    `🚚 Shipping: *FREE* (collect at shop)\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Total: $${total.toFixed(2)}*`
  );

  await sendButtons(phone, `Ready to pay, ${name}?`, [
    { id: "cart_checkout", title: "💳 Pay Now" },
    { id: "cart_remove_pick", title: "🗑️ Remove Item" },
    { id: "cart_clear", title: "🗑️ Clear All" }
  ]);
}

async function clearCart(phone: string, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  await supabase
    .from("whatsapp_cart_items")
    .delete()
    .eq("phone_number", phone);

  await sendText(phone,
    `🗑️ *Cart Cleared*\n\n` +
    `Your cart is now empty, ${name}.\n` +
    `Ready to start fresh? 🛍️`
  );

  await sendButtons(phone, "What's next?", [
    { id: "menu_categories", title: "🛍️ Shop Now" },
    { id: "menu_deals", title: "🔥 Deals" },
    { id: "menu_main", title: "🏠 Menu" }
  ]);
}

async function removeFromCart(phone: string, productId: number, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  const { data: item } = await supabase
    .from("whatsapp_cart_items")
    .select("id, products:product_id (name)")
    .eq("phone_number", phone)
    .eq("product_id", productId)
    .single();

  if (!item) {
    await sendText(phone, `${name}, this item isn't in your cart.`);
    return;
  }

  await supabase
    .from("whatsapp_cart_items")
    .delete()
    .eq("id", item.id);

  await sendText(phone,
    `✅ Removed *${(item as any).products?.name || 'item'}* from your cart.`
  );

  await sendCartView(phone, userName);
}

// ===== CHECKOUT & PAYMENT =====

async function handleCheckout(phone: string, userName: string | null) {
  const name = firstName(userName);
  const cartItems = await getCartItems(phone);

  if (cartItems.length === 0) {
    await sendText(phone,
      `🛒 Your cart is empty, ${name}!\n\nBrowse products first and add items to your cart.`
    );
    await sendButtons(phone, "Start shopping?", [
      { id: "menu_categories", title: "🛍️ Shop Now" },
      { id: "menu_deals", title: "🔥 Deals" },
      { id: "menu_main", title: "🏠 Menu" }
    ]);
    return;
  }

  // Validate stock
  const outOfStock: string[] = [];
  for (const item of cartItems) {
    const p = item.products as any;
    if ((p.stock ?? 0) < item.quantity) {
      outOfStock.push(p.name);
    }
  }

  if (outOfStock.length > 0) {
    await sendText(phone,
      `⚠️ *Stock Issue*\n\n` +
      `Sorry ${name}, these items are no longer available in the quantity you need:\n\n` +
      outOfStock.map(n => `  ❌ ${n}`).join("\n") +
      `\n\nPlease update your cart and try again.`
    );
    return;
  }

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Show order summary and confirm
  const itemLines = cartItems.map((item: any) => {
    const p = item.products;
    return `  📱 ${p.name} ×${item.quantity} — $${(p.price * item.quantity).toFixed(2)}`;
  }).join("\n");

  await sendText(phone,
    `📋 *Order Summary*\n\n` +
    `${itemLines}\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 ${totalItems} item${totalItems !== 1 ? 's' : ''}\n` +
    `💵 Subtotal: $${subtotal.toFixed(2)}\n` +
    `📋 Tax (2%): $${tax.toFixed(2)}\n` +
    `🚚 Collection: *FREE*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Total: $${total.toFixed(2)}*\n\n` +
    `📍 *Collect at shop* after payment\n` +
    `💳 Payment via *PesePay*`
  );

  await sendButtons(phone, `Confirm your order, ${name}?`, [
    { id: "cart_confirm_pay", title: "✅ Pay Now" },
    { id: "cart_view", title: "🛒 Edit Cart" },
    { id: "menu_main", title: "❌ Cancel" }
  ]);
}

async function processPayment(phone: string, userName: string | null) {
  const name = firstName(userName);
  const supabase = getSupabase();
  const cartItems = await getCartItems(phone);

  if (cartItems.length === 0) {
    await sendText(phone, `🛒 Your cart is empty, ${name}! Add items first.`);
    return;
  }

  await sendText(phone,
    `⏳ *Processing your order, ${name}...*\n\n` +
    `Setting up your payment link.\nPlease wait a moment! 🔄`
  );

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  try {
    // Create order in database
    const itemNames = cartItems.map((item: any) => item.products.name).join(", ");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: total,
        status: "pending",
        payment_method: "pesepay",
        shipping_method: "collection",
        source: "whatsapp",
        customer_phone: phone,
        billing_address: {
          firstName: userName || "WhatsApp Customer",
          lastName: "",
          address: "Shop Collection",
          city: "Shop Location",
          zipCode: "00000",
          country: "Zimbabwe"
        }
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    console.log("WhatsApp order created:", order.id);

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
    }

    // Initiate PesePay payment via the edge function
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const paymentResponse = await fetch(`${supabaseUrl}/functions/v1/pesepay-initiate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: total,
        currencyCode: "USD",
        reasonForPayment: `GadgetGenie WhatsApp Order #${order.id.substring(0, 8)} - ${totalItems} item(s)`,
        orderDbId: order.id
      })
    });

    const paymentData = await paymentResponse.json();

    if (!paymentData.success || !paymentData.redirectUrl) {
      throw new Error(paymentData.error || "Failed to create payment link");
    }

    console.log("PesePay payment link generated:", paymentData.referenceNumber);

    // Store the phone number with the payment reference for later notification
    // We use the order's customer_phone field for this

    // Clear cart after successful order creation
    await supabase
      .from("whatsapp_cart_items")
      .delete()
      .eq("phone_number", phone);

    // Send payment link via WhatsApp
    await sendText(phone,
      `✅ *Order Created!*\n\n` +
      `📋 Order ID: *#${order.id.substring(0, 8)}*\n` +
      `💰 Total: *$${total.toFixed(2)}*\n` +
      `📦 ${totalItems} item${totalItems !== 1 ? 's' : ''}\n\n` +
      `⏰ *Complete payment within 30 minutes*\n` +
      `_Your order will be cancelled if\npayment is not received._`
    );

    // Send the payment CTA button
    await sendWhatsAppMessage(phone, {
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "cta_url",
        body: {
          text: `💳 *Tap below to pay securely via PesePay*\n\nAccepts EcoCash, Visa, Mastercard & more.`
        },
        action: {
          name: "cta_url",
          parameters: {
            display_text: `💳 Pay $${total.toFixed(2)} Now`,
            url: paymentData.redirectUrl
          }
        }
      }
    });

    await sendText(phone,
      `💡 *After payment:*\n` +
      `✅ You'll receive a confirmation here\n` +
      `📍 Collect your order at our shop\n` +
      `📦 Track anytime: _track ${order.id.substring(0, 8)}_\n\n` +
      `Need help? Type *help* 💬`
    );

  } catch (error) {
    console.error("WhatsApp checkout error:", error);
    await sendText(phone,
      `❌ *Payment Error*\n\n` +
      `Sorry ${name}, something went wrong.\n` +
      `Please try again or contact support.\n\n` +
      `📞 wa.me/${SALES_WHATSAPP}`
    );
  }
}

// ===== AI ASSISTANT =====

async function getAIResponse(userMessage: string, context: string, userName: string | null): Promise<string | null> {
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
The customer's name is: ${userName || "unknown"}.${userName ? ` Address them as ${firstName(userName)}.` : ""}

STORE INFO:
- Name: ${STORE_NAME}
- Website: ${WEBSITE_URL}
- Payment: PesePay (EcoCash, Visa, Mastercard)
- Shipping: Free collection at shop
- Returns: 14-day return policy
- Location: Zimbabwe

CAPABILITIES (tell users about these):
- Browse products by category (type "browse")
- Search products (type "search <product name>")
- View hot deals (type "deals")
- Track orders (type "track <order-id>")
- 🛒 Add to cart & pay via WhatsApp (type "cart")
- Subscribe to daily deals (type "subscribe")
- Get help (type "help")

RULES:
- Keep responses under 200 words
- Use emojis naturally but not excessively
- If asked about a specific product, suggest they type "search <product name>"
- Never make up product information or prices
- Always stay in character as a shopping assistant
- Be warm and professional
- If unrelated to shopping, politely redirect
- Users can now buy directly on WhatsApp — mention this when relevant

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

async function sendProductRecommendations(phone: string, currentProductId: number, category: string | null, userName: string | null) {
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
      ? `$${p.price} (${p.discount_percentage}% off)`
      : `$${p.price}`;
    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${priceText} • ${p.brand || ""}`.substring(0, 72)
    };
  });

  const name = firstName(userName);
  await sendList(
    phone,
    `✨ *Picked for you, ${name}*\n\n` +
    `🎯 ${similar.length} similar product${similar.length > 1 ? "s" : ""}\n    in *${category}*\n\n` +
    `_Customers who viewed this also\nliked these items_ 👇`,
    "View Similar",
    [{
      title: `More in ${category}`,
      rows: rows
    }]
  );
}

// ===== SUBSCRIPTION MANAGEMENT =====

async function handleSubscribe(phone: string, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);
  
  const { data: existing } = await supabase
    .from("whatsapp_subscriptions")
    .select("id, subscribed_deals")
    .eq("phone_number", phone)
    .single();

  if (existing?.subscribed_deals) {
    await sendText(phone,
      `✅ *Already Subscribed, ${name}!*\n\n` +
      `You're already on the VIP deals list! 🎉\n\n` +
      `Type *unsubscribe* to opt out.`
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
    `🎉 *Welcome to VIP Deals, ${name}!*\n\n` +
    `You'll now receive daily curated deals:\n\n` +
    `  🏷️  Flash sales & exclusives\n` +
    `  📱  New arrivals first\n` +
    `  🔥  Limited-time steals\n\n` +
    `_Type *unsubscribe* anytime to stop._`
  );
}

async function handleUnsubscribe(phone: string, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  const { data: existing } = await supabase
    .from("whatsapp_subscriptions")
    .select("id, subscribed_deals")
    .eq("phone_number", phone)
    .single();

  if (!existing || !existing.subscribed_deals) {
    await sendText(phone,
      `ℹ️ ${name}, you're not currently subscribed.\n\nType *subscribe* to get daily deals!`
    );
    return;
  }

  await supabase
    .from("whatsapp_subscriptions")
    .update({ subscribed_deals: false, updated_at: new Date().toISOString() })
    .eq("id", existing.id);

  await sendText(phone,
    `🔕 *Unsubscribed, ${name}*\n\n` +
    `No more daily deal alerts.\n` +
    `We'll miss you! 💛\n\n` +
    `_Type *subscribe* to rejoin anytime._`
  );
}

// ===== BOT MENUS & FLOWS =====

async function sendMainMenu(phone: string, userName: string | null) {
  const name = firstName(userName);
  const greeting = timeGreeting();

  const header = 
    `🧞‍♂️ *${STORE_NAME}*\n\n` +
    `${greeting}, *${name}*! 👋\n\n` +
    `I'm your personal shopping assistant. How can I help today?\n\n` +
    `💡 _Tip: Ask me anything naturally!_\n` +
    `    _"Do you have iPhones?"_\n` +
    `    _"What's on sale today?"_`;

  await sendButtons(phone, header, [
    { id: "menu_categories", title: "🛍️ Shop Now" },
    { id: "menu_deals", title: "🔥 Today's Deals" },
    { id: "menu_more", title: "⚡ More Options" }
  ]);
}

async function sendMoreOptions(phone: string, userName: string | null) {
  const name = firstName(userName);
  await sendList(phone,
    `⚡ *More Options*\n\nWhat would you like to do, ${name}?`,
    "Choose Option",
    [{
      title: "Services",
      rows: [
        { id: "menu_search", title: "🔍 Search Products", description: "Find products by name or keyword" },
        { id: "cart_view", title: "🛒 My Cart", description: "View your shopping cart" },
        { id: "menu_track", title: "📦 Track My Order", description: "Check your order status" },
        { id: "menu_subscribe", title: "🔔 Daily Deals", description: "Get daily deal alerts on WhatsApp" },
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
    `🛍️ *Shop by Category*\n\n` +
    `Browse our curated collections.\nTap any category to explore! 👇\n\n` +
    `📦 ${categories.length} categories available`,
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
      ? `$${p.price} (${p.discount_percentage}% off)`
      : `$${p.price}`;
    const stock = (p.stock ?? 0) > 0 ? "✅ In stock" : "❌ Sold out";

    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${stock} · ${priceText}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `🛍️ *${category}*\n\n` +
    `📦 ${products.length} product${products.length > 1 ? 's' : ''} found\n\n` +
    `Tap any item to see full details,\nspecs & pricing 👇`,
    "Browse Products",
    [{
      title: category,
      rows: rows
    }]
  );
}

async function sendProductDetail(phone: string, productId: number, userName: string | null) {
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
    ? `✅ *In Stock* — ${product.stock} units`
    : `❌ *Out of Stock*`;

  const ratingStars = product.rating
    ? "★".repeat(Math.min(Math.round(product.rating), 5)) + "☆".repeat(5 - Math.min(Math.round(product.rating), 5)) + ` ${product.rating}/5 (${product.reviews || 0})`
    : "☆☆☆☆☆ No reviews yet";

  let priceBlock = `💰 *$${product.price}*`;
  if (product.original_price && product.discount_percentage && product.discount_percentage > 0) {
    const saved = (product.original_price - product.price).toFixed(2);
    priceBlock = `💰 ~$${product.original_price}~ ➜ *$${product.price}*\n🏷️ Save *$${saved}* (${product.discount_percentage}% off!)`;
  }

  const brandLine = product.brand ? `🏢 ${product.brand}` : "";

  let specsBlock = "";
  if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
    const specs = product.specifications.slice(0, 6).map((s: any) =>
      `  ◦ ${s.key || s.name}: *${s.value}*`
    ).join("\n");
    specsBlock = `\n\n📋 *Specifications*\n${specs}`;
  }

  let boxBlock = "";
  if (product.whats_in_box && product.whats_in_box.length > 0) {
    const items = product.whats_in_box.slice(0, 5).map((item: string) => `  ☑️ ${item}`).join("\n");
    boxBlock = `\n\n🎁 *What's in the Box*\n${items}`;
  }

  const descBlock = product.description
    ? `\n\n${product.description.substring(0, 200)}${product.description.length > 200 ? "..." : ""}`
    : "";

  const message = [
    `📱 *${product.name}*`,
    ``,
    brandLine,
    ``,
    priceBlock,
    `${ratingStars}`,
    stockLine,
    specsBlock,
    boxBlock,
    descBlock,
    ``,
    ``
  ].filter(l => l !== false && l !== null && l !== undefined).join("\n");

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

  const name = firstName(userName);
  
  if (inStock) {
    await sendButtons(phone,
      `What would you like to do, ${name}?`,
      [
        { id: `addcart_${product.id}`, title: "🛒 Add to Cart" },
        { id: "menu_categories", title: "🛍️ Shop More" },
        { id: "cart_view", title: "🛒 View Cart" }
      ]
    );
  } else {
    await sendButtons(phone,
      `😔 Out of stock. Browse alternatives, ${name}?`,
      [
        { id: "menu_categories", title: "🛍️ Shop More" },
        { id: "menu_search", title: "🔍 Search" },
        { id: "menu_main", title: "🏠 Main Menu" }
      ]
    );
  }

  // Send product recommendations from same category
  await sendProductRecommendations(phone, productId, product.category, userName);
}

async function sendDeals(phone: string, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  const { data: deals } = await supabase
    .from("products")
    .select("id, name, price, original_price, discount_percentage, brand")
    .is("deleted_at", null)
    .gt("discount_percentage", 0)
    .order("discount_percentage", { ascending: false })
    .limit(10);

  if (!deals || deals.length === 0) {
    await sendText(phone, `🔜 No active deals right now, ${name}.\nCheck back soon for hot offers!`);
    await sendMainMenu(phone, userName);
    return;
  }

  const rows = deals.map(p => ({
    id: `prod_${p.id}`,
    title: p.name.substring(0, 24),
    description: `$${p.price} · Save ${p.discount_percentage}%`.substring(0, 72)
  }));

  await sendList(
    phone,
    `🔥 *Today's Hot Deals*\n\n` +
    `Hey ${name}! 🎯\n\n` +
    `🏷️ Up to *${deals[0].discount_percentage}% OFF*\n` +
    `⏰ Limited-time offers\n\n` +
    `Tap to view any deal 👇`,
    "View All Deals",
    [{
      title: "🔥 Hot Deals",
      rows: rows
    }]
  );
}

async function sendHelp(phone: string, userName: string | null) {
  const name = firstName(userName);
  await sendText(phone,
    `💬 *Help & Support*\n\n` +
    `Hi ${name}! Here's everything I can do:\n\n` +
    `🔍 *Search*\n` +
    `    _search Samsung Galaxy_\n\n` +
    `🛒 *Cart*\n` +
    `    _cart_ — View your cart\n` +
    `    _checkout_ — Pay & order\n\n` +
    `📦 *Track Order*\n` +
    `    _track abc12345_\n\n` +
    `🛍️ *Browse* — Type _browse_\n` +
    `🔥 *Deals* — Type _deals_\n` +
    `🔔 *Subscribe* — Type _subscribe_\n` +
    `🔕 *Unsubscribe* — Type _unsubscribe_\n\n` +
    `📞 *Sales:* wa.me/${SALES_WHATSAPP}\n` +
    `🌐 *Web:* ${WEBSITE_URL}\n` +
    `🔄 14-day returns · 🚚 Free collection\n` +
    `💳 PesePay (EcoCash, Visa, Mastercard)\n\n` +
    `💡 _Or just chat — I'm AI-powered!_ 🧞‍♂️`
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

async function sendOrderTrackingPrompt(phone: string, userName: string | null) {
  const name = firstName(userName);
  await sendText(phone,
    `📦 *Track Your Order*\n\n` +
    `Hey ${name}, send your order ID:\n\n` +
    `👉 *track <order-id>*\n\n` +
    `_Example: track abc12345-6789_\n\n` +
    `📧 _Find it in your confirmation\nemail or account dashboard._`
  );
}

async function sendOrderStatus(phone: string, orderId: string, userName: string | null) {
  const supabase = getSupabase();
  const name = firstName(userName);

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total_amount, payment_method, shipping_method, created_at, updated_at")
    .eq("id", orderId.trim())
    .single();

  if (!order) {
    await sendText(phone,
      `❌ *Order Not Found*\n\n` +
      `Sorry ${name}, no order with ID:\n_${orderId}_\n\n` +
      `Double-check and try again.`
    );
    return;
  }

  const statusConfig: Record<string, { emoji: string; label: string; bar: string }> = {
    "pending":    { emoji: "⏳", label: "Pending",    bar: "🟡⚪⚪⚪⚪" },
    "confirmed":  { emoji: "✅", label: "Confirmed",  bar: "🟢🟡⚪⚪⚪" },
    "processing": { emoji: "⚙️", label: "Processing", bar: "🟢🟢🟡⚪⚪" },
    "shipped":    { emoji: "🚚", label: "Shipped",    bar: "🟢🟢🟢🟡⚪" },
    "delivered":  { emoji: "📬", label: "Delivered",  bar: "🟢🟢🟢🟢🟢" },
    "cancelled":  { emoji: "❌", label: "Cancelled",  bar: "🔴🔴🔴🔴🔴" },
  };

  const status = statusConfig[order.status || "pending"] || { emoji: "📋", label: order.status, bar: "⚪⚪⚪⚪⚪" };
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
      const pname = productMap.get(i.product_id) || "Product";
      return `  ◦ ${pname} ×${i.quantity} — $${i.price}`;
    }).join("\n");
    itemsBlock = `\n\n🛒 *Items*\n${lines}`;
  }

  await sendText(phone,
    `📦 *Order Tracking*\n\n` +
    `Hey ${name}! Here's your order:\n\n` +
    `📋 *ID:* _${order.id.substring(0, 8)}..._\n` +
    `📅 *Placed:* ${orderDate}\n\n` +
    `${status.emoji} *${status.label}*\n` +
    `${status.bar}\n\n` +
    `💰 *Total:* $${order.total_amount}` +
    (order.payment_method ? `\n💳 *Pay:* ${order.payment_method}` : "") +
    (order.shipping_method ? `\n🚚 *Ship:* ${order.shipping_method}` : "") +
    itemsBlock +
    `\n\n🕐 _Last updated: ${lastUpdate}_`
  );

  await sendButtons(phone, `What's next, ${name}?`, [
    { id: "menu_categories", title: "🛍️ Shop More" },
    { id: "menu_deals", title: "🔥 Deals" },
    { id: "menu_main", title: "🏠 Main Menu" }
  ]);
}

// ===== PRODUCT SEARCH =====

async function sendSearchPrompt(phone: string, userName: string | null) {
  const name = firstName(userName);
  await sendText(phone,
    `🔍 *Product Search*\n\n` +
    `${name}, type *search* + keyword:\n\n` +
    `  _search iPhone_\n` +
    `  _search Samsung Galaxy_\n` +
    `  _search headphones_\n\n` +
    `💡 _Or describe what you want —\nI understand natural language!_ 🧞‍♂️`
  );
}

async function searchProducts(phone: string, query: string, userName: string | null) {
  const supabase = getSupabase();
  const searchTerm = `%${query.trim()}%`;
  const name = firstName(userName);

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
      `Sorry ${name}! Try:\n` +
      `  ◦ A different keyword\n` +
      `  ◦ Brand name (Samsung, Apple)\n` +
      `  ◦ Category (Smartphones, Audio)\n\n` +
      `_Or ask me naturally!_ 🧞‍♂️`
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
      ? `$${p.price} (${p.discount_percentage}% off)`
      : `$${p.price}`;
    const stock = (p.stock ?? 0) > 0 ? "✅" : "❌";

    return {
      id: `prod_${p.id}`,
      title: p.name.substring(0, 24),
      description: `${stock} ${priceText} · ${p.brand || ""}`.substring(0, 72)
    };
  });

  await sendList(
    phone,
    `🔍 *"${query}"*\n\n` +
    `Found *${products.length}* result${products.length > 1 ? "s" : ""} for you, ${name}! 🎯`,
    "View Results",
    [{
      title: "Search Results",
      rows: rows
    }]
  );
}

// ===== CONVERSATION STORAGE =====

async function storeUserMessage(phone: string, content: any, messageId: string | null, userName: string | null) {
  const supabase = getSupabase();

  const { data: existingConvo } = await supabase
    .from("whatsapp_conversations")
    .select("id")
    .eq("phone_number", phone)
    .single();

  let conversationId: string;

  if (existingConvo) {
    conversationId = existingConvo.id;
    const updateData: any = { last_message_at: new Date().toISOString(), status: "active" };
    if (userName) updateData.user_name = userName;
    await supabase
      .from("whatsapp_conversations")
      .update(updateData)
      .eq("id", conversationId);
  } else {
    const { data: newConvo } = await supabase
      .from("whatsapp_conversations")
      .insert({
        phone_number: phone,
        status: "active",
        user_name: userName || null,
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

// ===== Get stored user name =====

async function getUserName(phone: string): Promise<string | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("whatsapp_conversations")
    .select("user_name")
    .eq("phone_number", phone)
    .single();
  return data?.user_name || null;
}

// ===== MESSAGE PROCESSING =====

async function processMessage(phone: string, messageText: string, messageId: string | null, userName: string | null) {
  await storeUserMessage(phone, messageText, messageId, userName);

  if (!userName) {
    userName = await getUserName(phone);
  }

  const text = messageText.toLowerCase().trim();

  // Greeting / Menu triggers
  if (["hi", "hello", "hey", "start", "menu", "home", "hie", "main menu", "yo", "sup"].includes(text)) {
    await sendMainMenu(phone, userName);
    return;
  }

  // Help triggers
  if (["help", "support", "contact", "question", "help me", "assist"].includes(text)) {
    await sendHelp(phone, userName);
    return;
  }

  // Deals triggers
  if (["deals", "offers", "sale", "discount", "discounts", "hot deals", "promo"].includes(text)) {
    await sendDeals(phone, userName);
    return;
  }

  // Browse triggers
  if (["browse", "products", "shop", "categories", "category", "catalog", "catalogue", "shop now"].includes(text)) {
    await sendCategories(phone);
    return;
  }

  // Cart triggers
  if (["cart", "my cart", "view cart", "shopping cart", "basket"].includes(text)) {
    await sendCartView(phone, userName);
    return;
  }

  // Clear cart
  if (["clear cart", "empty cart", "remove all"].includes(text)) {
    await clearCart(phone, userName);
    return;
  }

  // Checkout triggers
  if (["checkout", "pay", "pay now", "place order", "order now", "buy", "purchase"].includes(text)) {
    await handleCheckout(phone, userName);
    return;
  }

  // Subscribe / Unsubscribe
  if (["subscribe", "notify me", "daily deals", "alerts", "notifications"].includes(text)) {
    await handleSubscribe(phone, userName);
    return;
  }
  if (["unsubscribe", "stop", "stop notifications", "no deals", "opt out"].includes(text)) {
    await handleUnsubscribe(phone, userName);
    return;
  }

  // Order tracking triggers
  if (["track", "order", "tracking", "my order", "order status", "where is my order"].includes(text)) {
    await sendOrderTrackingPrompt(phone, userName);
    return;
  }

  // Track with order ID
  if (text.startsWith("track ") && text.length > 6) {
    const orderId = messageText.trim().substring(6).trim();
    await sendOrderStatus(phone, orderId, userName);
    return;
  }

  // Search triggers
  if (["search", "find", "lookup", "look up"].includes(text)) {
    await sendSearchPrompt(phone, userName);
    return;
  }

  // Search with query
  if (text.startsWith("search ") && text.length > 7) {
    await searchProducts(phone, messageText.trim().substring(7).trim(), userName);
    return;
  }
  if (text.startsWith("find ") && text.length > 5) {
    await searchProducts(phone, messageText.trim().substring(5).trim(), userName);
    return;
  }

  // More options
  if (["more", "options", "more options", "other"].includes(text)) {
    await sendMoreOptions(phone, userName);
    return;
  }

  // Website
  if (["website", "site", "web", "online"].includes(text)) {
    await sendWebsiteLink(phone);
    return;
  }

  // ===== AI FALLBACK =====
  console.log("Using AI for unrecognized message:", text);

  const context = await getProductContext();
  const aiResponse = await getAIResponse(messageText, context, userName);

  if (aiResponse) {
    await sendText(phone, aiResponse);
    await sendButtons(phone, "Quick actions:", [
      { id: "menu_categories", title: "🛍️ Shop Now" },
      { id: "menu_search", title: "🔍 Search" },
      { id: "menu_main", title: "🏠 Menu" }
    ]);
  } else {
    await sendText(phone, `🤔 I'm not sure about that.\nLet me show you what I can do!`);
    await sendMainMenu(phone, userName);
  }
}

// Process interactive replies
async function processInteractiveReply(phone: string, replyId: string, replyTitle: string, userName: string | null) {
  await storeUserMessage(phone, `[Selected: ${replyTitle}]`, null, userName);

  if (!userName) {
    userName = await getUserName(phone);
  }

  const handlers: Record<string, () => Promise<void>> = {
    "menu_main": () => sendMainMenu(phone, userName),
    "menu_categories": () => sendCategories(phone),
    "menu_deals": () => sendDeals(phone, userName),
    "menu_help": () => sendHelp(phone, userName),
    "menu_more": () => sendMoreOptions(phone, userName),
    "menu_track": () => sendOrderTrackingPrompt(phone, userName),
    "menu_search": () => sendSearchPrompt(phone, userName),
    "menu_website": () => sendWebsiteLink(phone),
    "menu_subscribe": () => handleSubscribe(phone, userName),
    "cart_view": () => sendCartView(phone, userName),
    "cart_checkout": () => handleCheckout(phone, userName),
    "cart_confirm_pay": () => processPayment(phone, userName),
    "cart_clear": () => clearCart(phone, userName),
  };

  if (handlers[replyId]) {
    await handlers[replyId]();
    return;
  }

  // Add to cart from product detail
  if (replyId.startsWith("addcart_")) {
    const productId = parseInt(replyId.substring(8), 10);
    if (!isNaN(productId)) {
      await addToCart(phone, productId, userName);
      return;
    }
  }

  if (replyId.startsWith("cat_")) {
    await sendProductsByCategory(phone, replyId.substring(4));
    return;
  }

  if (replyId.startsWith("prod_")) {
    const productId = parseInt(replyId.substring(5), 10);
    if (!isNaN(productId)) {
      await sendProductDetail(phone, productId, userName);
      return;
    }
  }

  await sendMainMenu(phone, userName);
}

// Extract message data from webhook payload (includes contact name)
function extractMessageData(body: any) {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages || value.messages.length === 0) return null;

    const message = value.messages[0];
    const phone = message.from;
    const messageId = message.id;

    // Extract user's profile name from contacts array
    const contacts = value.contacts;
    const userName = contacts?.[0]?.profile?.name || null;
    console.log("User name from WhatsApp:", userName);

    if (message.type === "text") {
      return { phone, text: message.text.body, type: "text", messageId, userName };
    }

    if (message.type === "interactive") {
      const interactive = message.interactive;
      if (interactive.type === "button_reply") {
        return { phone, replyId: interactive.button_reply.id, replyTitle: interactive.button_reply.title, type: "interactive", messageId, userName };
      }
      if (interactive.type === "list_reply") {
        return { phone, replyId: interactive.list_reply.id, replyTitle: interactive.list_reply.title, type: "interactive", messageId, userName };
      }
    }

    if (message.from) {
      return { phone: message.from, text: "[unsupported message type]", type: "text", messageId, userName };
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
            await processInteractiveReply(msgData.phone, msgData.replyId!, msgData.replyTitle!, msgData.userName);
          } else {
            await processMessage(msgData.phone, msgData.text!, msgData.messageId, msgData.userName);
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
