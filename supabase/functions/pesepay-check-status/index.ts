import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  const padLen = decoded.charCodeAt(decoded.length - 1);
  const unpadded = decoded.slice(0, decoded.length - padLen);
  return JSON.parse(unpadded);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const integrationKey = Deno.env.get("PESEPAY_INTEGRATION_KEY")?.trim().replace(/[\r\n]/g, '');
    const encryptionKey = Deno.env.get("PESEPAY_ENCRYPTION_KEY")?.trim().replace(/[\r\n]/g, '');

    if (!integrationKey || !encryptionKey) {
      throw new Error("PesePay credentials not configured");
    }

    const { referenceNumber } = await req.json();

    if (!referenceNumber) {
      throw new Error("referenceNumber is required");
    }

    const pesepayMode = Deno.env.get("PESEPAY_MODE") || "sandbox";
    const apiUrl =
      pesepayMode === "live"
        ? `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`
        : `https://api.test.sandbox.pesepay.com/payments-engine/v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: integrationKey,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`PesePay API error (${response.status}): ${JSON.stringify(responseData)}`);
    }

    let transactionData = responseData;
    if (responseData.payload && typeof responseData.payload === "string") {
      transactionData = await decryptPayload(responseData.payload, encryptionKey);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: transactionData.transactionStatus,
        data: transactionData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("PesePay status check error:", error);
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
