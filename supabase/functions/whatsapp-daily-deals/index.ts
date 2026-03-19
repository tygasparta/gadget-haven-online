import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

console.log("WhatsApp Daily Deals Notifier starting...");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STORE_NAME = "GadgetGenie";
const WEBSITE_URL = "https://gadget-haven-online.lovable.app";
const SALES_WHATSAPP = "263776337910";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
}

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
    console.error(`Failed to send to ${phone}:`, result);
  } else {
    console.log(`Sent to ${phone}:`, result.messages?.[0]?.id);
  }
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = getSupabase();

    // Get all subscribed users
    const { data: subscribers, error: subError } = await supabase
      .from("whatsapp_subscriptions")
      .select("phone_number")
      .eq("subscribed_deals", true);

    if (subError) {
      console.error("Error fetching subscribers:", subError);
      throw subError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers found");
      return new Response(JSON.stringify({ message: "No subscribers", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${subscribers.length} subscribers`);

    // Get today's best deals
    const { data: deals } = await supabase
      .from("products")
      .select("id, name, price, original_price, discount_percentage, brand, category, stock")
      .is("deleted_at", null)
      .gt("discount_percentage", 0)
      .gt("stock", 0)
      .order("discount_percentage", { ascending: false })
      .limit(5);

    if (!deals || deals.length === 0) {
      console.log("No deals available today");
      return new Response(JSON.stringify({ message: "No deals today", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the deals message
    const dealsList = deals.map((d, i) => {
      const savings = d.original_price ? `~$${d.original_price}~ → ` : "";
      return `${i + 1}. *${d.name}*\n   ${savings}*$${d.price}* ${d.discount_percentage ? `(-${d.discount_percentage}%)` : ""}\n   ${d.brand ? `🏢 ${d.brand}` : ""} ${d.category ? `• ${d.category}` : ""}`;
    }).join("\n\n");

    const message = 
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔥 *${STORE_NAME} Daily Deals*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Good morning! ☀️ Here are today's\nhottest deals just for you:\n\n` +
      `${dealsList}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛒 Reply *deals* to browse all offers\n` +
      `🔍 Reply *search <name>* to find items\n` +
      `🔕 Reply *unsubscribe* to stop alerts\n` +
      `━━━━━━━━━━━━━━━━━━━━`;

    let sentCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      try {
        // Send the deals message
        await sendWhatsAppMessage(sub.phone_number, {
          messaging_product: "whatsapp",
          to: sub.phone_number,
          type: "text",
          text: { body: message }
        });

        // Send CTA to website
        await sendWhatsAppMessage(sub.phone_number, {
          messaging_product: "whatsapp",
          to: sub.phone_number,
          type: "interactive",
          interactive: {
            type: "cta_url",
            body: {
              text: `🌐 Shop all deals on our website!`
            },
            action: {
              name: "cta_url",
              parameters: {
                display_text: "🛍️ Shop Now",
                url: `${WEBSITE_URL}/deals`
              }
            }
          }
        });

        sentCount++;
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`Failed to send to ${sub.phone_number}:`, e);
        failCount++;
      }
    }

    console.log(`Daily deals sent: ${sentCount} success, ${failCount} failed`);

    return new Response(JSON.stringify({ 
      message: "Daily deals sent", 
      sent: sentCount, 
      failed: failCount,
      deals: deals.length 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in daily deals function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
