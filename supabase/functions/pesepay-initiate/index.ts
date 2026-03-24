import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// AES-256-CBC encryption using Web Crypto API
async function encryptPayload(data: string, encryptionKey: string): Promise<string> {
  const keyBytes = new TextEncoder().encode(encryptionKey);
  const iv = keyBytes.slice(0, 16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(data);

  // PKCS7 padding
  const blockSize = 16;
  const padLen = blockSize - (encoded.length % blockSize);
  const padded = new Uint8Array(encoded.length + padLen);
  padded.set(encoded);
  for (let i = encoded.length; i < padded.length; i++) {
    padded[i] = padLen;
  }

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    padded
  );

  // Base64 encode
  const bytes = new Uint8Array(encrypted);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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

  // Base64 decode
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
  // Remove PKCS7 padding
  const padLen = decoded.charCodeAt(decoded.length - 1);
  const unpadded = decoded.slice(0, decoded.length - padLen);
  return JSON.parse(unpadded);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawIntegrationKey = Deno.env.get("PESEPAY_INTEGRATION_KEY");
    const rawEncryptionKey = Deno.env.get("PESEPAY_ENCRYPTION_KEY");

    if (!rawIntegrationKey || !rawEncryptionKey) {
      throw new Error("PesePay credentials not configured");
    }

    // Sanitize keys - remove any non-printable ASCII characters, whitespace, newlines
    const integrationKey = rawIntegrationKey.replace(/[^\x20-\x7E]/g, '').trim();
    const encryptionKey = rawEncryptionKey.replace(/[^\x20-\x7E]/g, '').trim();

    console.log("Integration key length:", integrationKey.length, "Encryption key length:", encryptionKey.length);

    const { amount, currencyCode, reasonForPayment, orderDbId } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const returnUrl = "https://gadgetgenie.org/payment-success";
    const resultUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/pesepay-result`;

    const paymentBody = {
      amountDetails: {
        amount: amount,
        currencyCode: currencyCode || "USD",
      },
      reasonForPayment: reasonForPayment || "GadgetGenie Online Payment",
      resultUrl: resultUrl,
      returnUrl: returnUrl,
    };

    console.log("PesePay payment body (before encryption):", JSON.stringify(paymentBody));

    const encryptedPayload = await encryptPayload(
      JSON.stringify(paymentBody),
      encryptionKey
    );

    console.log("Encrypted payload created, sending to PesePay...");

    // Determine API URL based on mode
    const pesepayMode = Deno.env.get("PESEPAY_MODE") || "sandbox";
    const apiUrl =
      pesepayMode === "live"
        ? "https://api.pesepay.com/api/payments-engine/v1/payments/initiate"
        : "https://api.test.sandbox.pesepay.com/payments-engine/v1/payments/initiate";

    console.log("Using PesePay API URL:", apiUrl);

    // Use HTTP/1.1 client to avoid HTTP/2 parsing issues with PesePay's server
    const httpClient = Deno.createHttpClient({ http2: false });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": integrationKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: encryptedPayload }),
      // @ts-ignore - Deno-specific option to force HTTP/1.1
      client: httpClient,
    });

    const responseData = await response.json();
    console.log("PesePay raw response status:", response.status);

    if (!response.ok) {
      console.error("PesePay API error:", JSON.stringify(responseData));
      throw new Error(
        `PesePay API error (${response.status}): ${JSON.stringify(responseData)}`
      );
    }

    if (!responseData.payload) {
      console.error("No payload in PesePay response:", JSON.stringify(responseData));
      throw new Error("Invalid response from PesePay - no payload");
    }

    // Decrypt the response
    const decryptedResponse = await decryptPayload(
      responseData.payload,
      encryptionKey
    );

    console.log("PesePay decrypted response:", JSON.stringify(decryptedResponse));

    const { redirectUrl, referenceNumber, pollUrl } = decryptedResponse;

    if (!redirectUrl || !referenceNumber) {
      throw new Error("Missing redirectUrl or referenceNumber in PesePay response");
    }

    // Update payment record if orderDbId provided
    if (orderDbId) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await supabaseClient
        .from("payment_records")
        .insert({
          amount: amount,
          payment_method: "pesepay",
          payment_reference: referenceNumber,
          status: "pending",
          order_id: orderDbId,
          redirect_url: redirectUrl,
          poll_url: pollUrl || null,
        });

      // Update order with payment reference
      await supabaseClient
        .from("orders")
        .update({ payment_reference: referenceNumber })
        .eq("id", orderDbId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl,
        referenceNumber,
        pollUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("PesePay initiation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
