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
  // Web Crypto API automatically handles PKCS7 padding removal
  return JSON.parse(decoded);
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

    // Update order status
    if (paymentRecord?.order_id) {
      const { error: orderError } = await supabaseClient
        .from("orders")
        .update({ status: orderStatus })
        .eq("id", paymentRecord.order_id);

      if (orderError) {
        console.error("Error updating order:", orderError);
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
