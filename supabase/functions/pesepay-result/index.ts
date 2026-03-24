import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function decryptPayload(encryptedBase64: string, encryptionKey: string): Promise<any> {
  const keyBytes = new TextEncoder().encode(encryptionKey);
  const iv = keyBytes.slice(0, 16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const binary = atob(encryptedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    bytes
  );

  const decoded = new TextDecoder().decode(decrypted);
  return JSON.parse(decoded);
}

// Send WhatsApp message helper for payment confirmations
async function sendWhatsAppMessage(phone: string, messageBody: any) {
  const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.log("WhatsApp credentials not configured — skipping notification");
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
    console.error("Failed to send WhatsApp message:", result);
  } else {
    console.log("WhatsApp confirmation sent:", result.messages?.[0]?.id);
  }
  return result;
}

async function sendWhatsAppOrderConfirmation(phone: string, order: any, items: any[]) {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Get product names for the order items
  const productIds = items.map(i => i.product_id).filter(Boolean);
  let itemLines = "";
  
  if (productIds.length > 0) {
    const { data: products } = await supabaseClient
      .from("products")
      .select("id, name")
      .in("id", productIds);
    
    const productMap = new Map((products || []).map(p => [p.id, p.name]));
    
    itemLines = items.map(i => {
      const name = productMap.get(i.product_id) || "Product";
      return `  ✅ ${name} ×${i.quantity} — $${i.price}`;
    }).join("\n");
  }

  const message =
    `🎉 *Payment Confirmed!*\n\n` +
    `Your order has been paid successfully!\n\n` +
    `📋 *Order:* #${order.id.substring(0, 8)}\n` +
    `💰 *Total:* $${order.total_amount}\n` +
    `💳 *Payment:* PesePay ✅\n\n` +
    (itemLines ? `🛒 *Items:*\n${itemLines}\n\n` : "") +
    `📍 *Collection:*\n` +
    `  📍 Shop address: 123 Main Street\n` +
    `  ⏰ We'll notify you when ready\n` +
    `  🪪 Bring valid ID for collection\n\n` +
    `📦 Track anytime: _track ${order.id.substring(0, 8)}_\n\n` +
    `Thank you for shopping with GadgetGenie! 🧞‍♂️`;

  await sendWhatsAppMessage(phone, {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { preview_url: false, body: message }
  });

  // Store the confirmation in conversations
  try {
    const { data: conversation } = await supabaseClient
      .from("whatsapp_conversations")
      .select("id")
      .eq("phone_number", phone)
      .single();

    if (conversation) {
      await supabaseClient.from("whatsapp_messages").insert({
        conversation_id: conversation.id,
        sender_type: "bot",
        message_type: "text",
        content: { body: message },
        delivered: true,
      });
    }
  } catch (e) {
    console.error("Error storing confirmation message:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const encryptionKey = Deno.env.get("PESEPAY_ENCRYPTION_KEY");
    if (!encryptionKey) {
      throw new Error("PESEPAY_ENCRYPTION_KEY not configured");
    }

    const body = await req.json();
    console.log("PesePay result webhook received:", JSON.stringify(body));

    let transactionData = body;

    // If payload is encrypted, decrypt it
    if (body.payload && typeof body.payload === "string") {
      transactionData = await decryptPayload(body.payload, encryptionKey);
      console.log("Decrypted transaction data:", JSON.stringify(transactionData));
    }

    const referenceNumber = transactionData.referenceNumber;
    const transactionStatus = transactionData.transactionStatus;

    if (!referenceNumber) {
      console.error("No referenceNumber in result data");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Map PesePay status to our status
    let paymentStatus = "pending";
    let orderStatus = "pending";

    if (transactionStatus === "SUCCESS") {
      paymentStatus = "completed";
      orderStatus = "confirmed";
    } else if (transactionStatus === "FAILED" || transactionStatus === "CANCELLED") {
      paymentStatus = "failed";
      orderStatus = "cancelled";
    }

    console.log(`Updating payment ${referenceNumber}: status=${paymentStatus}, orderStatus=${orderStatus}`);

    // Update payment record
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from("payment_records")
      .update({ status: paymentStatus })
      .eq("payment_reference", referenceNumber)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment record:", paymentError);
    }

    // Update order status and send WhatsApp notification if applicable
    if (paymentRecord?.order_id) {
      const { error: orderError } = await supabaseClient
        .from("orders")
        .update({ status: orderStatus })
        .eq("id", paymentRecord.order_id);

      if (orderError) {
        console.error("Error updating order:", orderError);
      }

      // If payment succeeded, check if this is a WhatsApp order and send confirmation
      if (transactionStatus === "SUCCESS") {
        const { data: order } = await supabaseClient
          .from("orders")
          .select("id, total_amount, source, customer_phone, payment_method")
          .eq("id", paymentRecord.order_id)
          .single();

        if (order?.source === "whatsapp" && order?.customer_phone) {
          console.log("Sending WhatsApp payment confirmation to:", order.customer_phone);

          // Get order items
          const { data: orderItems } = await supabaseClient
            .from("order_items")
            .select("product_id, quantity, price")
            .eq("order_id", order.id);

          await sendWhatsAppOrderConfirmation(
            order.customer_phone,
            order,
            orderItems || []
          );
        }
      }
    }

    return new Response(JSON.stringify({ received: true, status: paymentStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("PesePay result processing error:", error);
    return new Response(
      JSON.stringify({
        received: true,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
