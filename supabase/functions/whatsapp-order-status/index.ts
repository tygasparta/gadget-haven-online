import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STORE_NAME = "GadgetGenie";

const statusConfig: Record<string, { emoji: string; label: string; bar: string; message: string }> = {
  pending:    { emoji: "⏳", label: "Pending",    bar: "🟡⚪⚪⚪⚪", message: "Your order is being reviewed." },
  confirmed:  { emoji: "✅", label: "Confirmed",  bar: "🟢🟡⚪⚪⚪", message: "Your order has been confirmed and is being prepared!" },
  processing: { emoji: "⚙️", label: "Processing", bar: "🟢🟢🟡⚪⚪", message: "Your order is now being processed." },
  shipped:    { emoji: "🚚", label: "Shipped",    bar: "🟢🟢🟢🟡⚪", message: "Your order has been shipped and is on its way!" },
  delivered:  { emoji: "📬", label: "Delivered",  bar: "🟢🟢🟢🟢🟢", message: "Your order has been delivered. Enjoy! 🎉" },
  completed:  { emoji: "🎉", label: "Completed",  bar: "🟢🟢🟢🟢🟢", message: "Your order is complete. Thank you for shopping with us!" },
  cancelled:  { emoji: "❌", label: "Cancelled",  bar: "🔴🔴🔴🔴🔴", message: "Your order has been cancelled. Contact us if you have questions." },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, customerPhone } = await req.json();

    if (!orderId || !newStatus || !customerPhone) {
      return new Response(JSON.stringify({ error: "Missing orderId, newStatus, or customerPhone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
      return new Response(JSON.stringify({ error: "WhatsApp credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get order details
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, total_amount, created_at, shipping_method")
      .eq("id", orderId)
      .single();

    // Get customer name from conversation
    const { data: convo } = await supabase
      .from("whatsapp_conversations")
      .select("user_name")
      .eq("phone_number", customerPhone)
      .single();

    const customerName = convo?.user_name?.split(" ")[0] || "there";
    const status = statusConfig[newStatus] || { emoji: "📋", label: newStatus, bar: "⚪⚪⚪⚪⚪", message: `Your order status has been updated to ${newStatus}.` };
    const shortId = orderId.substring(0, 8).toUpperCase();

    const messageBody = 
      `${status.emoji} *Order Update*\n\n` +
      `Hey ${customerName}! Your order status has changed:\n\n` +
      `📋 *Order:* #${shortId}\n` +
      `📊 *Status:* ${status.emoji} *${status.label}*\n` +
      `${status.bar}\n\n` +
      `${status.message}\n\n` +
      (order ? `💰 *Total:* $${Number(order.total_amount).toFixed(2)}\n` : "") +
      (order?.shipping_method === "collection" ? `📍 *Collection:* Pick up at our shop\n` : "") +
      `\n` +
      `Need help? Type *help* or contact us! 💬\n` +
      `_Track anytime: track ${orderId.substring(0, 8)}_`;

    // Send WhatsApp message
    const response = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: customerPhone,
        type: "text",
        text: { preview_url: false, body: messageBody },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send WhatsApp status notification:", result);
      return new Response(JSON.stringify({ error: "Failed to send message", details: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("WhatsApp order status notification sent:", result.messages?.[0]?.id);

    // Store the bot message in conversation history
    if (convo) {
      const { data: conversation } = await supabase
        .from("whatsapp_conversations")
        .select("id")
        .eq("phone_number", customerPhone)
        .single();

      if (conversation) {
        await supabase.from("whatsapp_messages").insert({
          conversation_id: conversation.id,
          sender_type: "bot",
          message_type: "text",
          content: { messaging_product: "whatsapp", to: customerPhone, type: "text", text: { body: messageBody } },
          delivered: true,
          message_id: result.messages?.[0]?.id || null,
        });
      }
    }

    return new Response(JSON.stringify({ success: true, messageId: result.messages?.[0]?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("WhatsApp order status error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
