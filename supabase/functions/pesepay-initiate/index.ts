import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Raw TLS HTTP client to bypass Deno's strict HTTP parser
// PesePay's server returns "HTTP/1.1 404 " (trailing space, no reason phrase)
// which Deno's hyper-based fetch rejects as "invalid HTTP header parsed"
async function rawHttpPost(
  hostname: string,
  path: string,
  headers: Record<string, string>,
  body: string
): Promise<{ status: number; body: string }> {
  const conn = await Deno.connectTls({ hostname, port: 443 });

  try {
    const headerLines = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");

    const httpRequest = [
      `POST ${path} HTTP/1.1`,
      `Host: ${hostname}`,
      headerLines,
      `Content-Length: ${new TextEncoder().encode(body).length}`,
      "Connection: close",
      "",
      body,
    ].join("\r\n");

    await conn.write(new TextEncoder().encode(httpRequest));

    // Read ALL data until connection closes
    const allBytes: number[] = [];
    const buf = new Uint8Array(32768);
    try {
      while (true) {
        const n = await conn.read(buf);
        if (n === null) break;
        for (let i = 0; i < n; i++) {
          allBytes.push(buf[i]);
        }
      }
    } catch {
      // Connection closed by server
    }

    const rawData = new Uint8Array(allBytes);
    const fullResponse = new TextDecoder().decode(rawData);

    // Find header/body boundary
    const separatorIdx = fullResponse.indexOf("\r\n\r\n");
    if (separatorIdx === -1) {
      throw new Error("Invalid HTTP response - no header/body separator");
    }

    const headerSection = fullResponse.substring(0, separatorIdx);
    const statusLine = headerSection.split("\r\n")[0];
    const statusMatch = statusLine.match(/HTTP\/\d\.\d\s+(\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1]) : 0;

    // Get body bytes (after \r\n\r\n)
    const bodyStartIdx = fullResponse.indexOf("\r\n\r\n") + 4;
    let responseBody = fullResponse.substring(bodyStartIdx);

    // Handle chunked transfer encoding
    if (headerSection.toLowerCase().includes("transfer-encoding: chunked")) {
      // For chunked encoding, reassemble by reading chunk sizes
      const bodyBytes = rawData.slice(
        new TextEncoder().encode(fullResponse.substring(0, bodyStartIdx)).length
      );
      const bodyStr = new TextDecoder().decode(bodyBytes);
      
      let decoded = "";
      let pos = 0;
      while (pos < bodyStr.length) {
        // Find chunk size line
        const lineEnd = bodyStr.indexOf("\r\n", pos);
        if (lineEnd === -1) break;
        
        const sizeHex = bodyStr.substring(pos, lineEnd).trim();
        const chunkSize = parseInt(sizeHex, 16);
        
        if (isNaN(chunkSize) || chunkSize === 0) break;
        
        // Read chunk data
        const chunkStart = lineEnd + 2;
        decoded += bodyStr.substring(chunkStart, chunkStart + chunkSize);
        pos = chunkStart + chunkSize + 2; // skip \r\n after chunk data
      }
      
      responseBody = decoded;
    }

    console.log("Raw HTTP response - status:", status, "body length:", responseBody.length);

    return { status, body: responseBody };
  } finally {
    conn.close();
  }
}

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
    const rawIntegrationKey = Deno.env.get("PESEPAY_INTEGRATION_KEY");
    const rawEncryptionKey = Deno.env.get("PESEPAY_ENCRYPTION_KEY");

    if (!rawIntegrationKey || !rawEncryptionKey) {
      throw new Error("PesePay credentials not configured");
    }

    const integrationKey = rawIntegrationKey.replace(/[^\x20-\x7E]/g, '').trim();
    const encryptionKey = rawEncryptionKey.replace(/[^\x20-\x7E]/g, '').trim();

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

    console.log("PesePay payment body:", JSON.stringify(paymentBody));

    const encryptedPayload = await encryptPayload(
      JSON.stringify(paymentBody),
      encryptionKey
    );

    const pesepayMode = Deno.env.get("PESEPAY_MODE") || "sandbox";

    // Choose hostname and path based on mode
    const isLive = pesepayMode === "live";
    const hostname = isLive ? "api.pesepay.com" : "api.test.sandbox.pesepay.com";
    const path = isLive
      ? "/api/payments-engine/v1/payments/initiate"
      : "/payments-engine/v1/payments/initiate";

    console.log("Sending to PesePay:", hostname, path, "Mode:", pesepayMode);

    // Use raw TLS for live (PesePay live returns malformed HTTP headers)
    // Use standard fetch for sandbox (works correctly)
    let responseData: any;

    if (isLive) {
      const rawResponse = await rawHttpPost(
        hostname,
        path,
        {
          "Authorization": integrationKey,
          "Content-Type": "application/json",
        },
        JSON.stringify({ payload: encryptedPayload })
      );

      console.log("PesePay raw response status:", rawResponse.status);
      console.log("PesePay raw response body:", rawResponse.body.substring(0, 200));

      if (rawResponse.status >= 400) {
        throw new Error(`PesePay API error (${rawResponse.status}): ${rawResponse.body.substring(0, 300)}`);
      }

      try {
        responseData = JSON.parse(rawResponse.body);
      } catch {
        throw new Error(`Invalid JSON from PesePay: ${rawResponse.body.substring(0, 200)}`);
      }
    } else {
      const response = await fetch(
        `https://${hostname}${path}`,
        {
          method: "POST",
          headers: {
            "Authorization": integrationKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payload: encryptedPayload }),
        }
      );
      responseData = await response.json();

      if (!response.ok) {
        throw new Error(`PesePay API error (${response.status}): ${responseData.message || JSON.stringify(responseData)}`);
      }
    }

    if (!responseData.payload) {
      console.error("No payload in PesePay response:", JSON.stringify(responseData));
      throw new Error("Invalid response from PesePay - no payload");
    }

    const decryptedResponse = await decryptPayload(
      responseData.payload,
      encryptionKey
    );

    console.log("PesePay decrypted response:", JSON.stringify(decryptedResponse));

    const { redirectUrl, referenceNumber, pollUrl } = decryptedResponse;

    if (!redirectUrl || !referenceNumber) {
      throw new Error("Missing redirectUrl or referenceNumber in PesePay response");
    }

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
