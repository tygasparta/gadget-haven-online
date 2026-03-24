import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Raw TLS HTTP client to bypass Deno's strict HTTP parser
async function rawHttpGet(
  hostname: string,
  path: string,
  headers: Record<string, string>
): Promise<{ status: number; body: string }> {
  const conn = await Deno.connectTls({ hostname, port: 443 });

  try {
    const headerLines = Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\r\n");

    const httpRequest = [
      `GET ${path} HTTP/1.1`,
      `Host: ${hostname}`,
      headerLines,
      "Connection: close",
      "",
      "",
    ].join("\r\n");

    await conn.write(new TextEncoder().encode(httpRequest));

    const chunks: Uint8Array[] = [];
    const buf = new Uint8Array(8192);
    try {
      while (true) {
        const n = await conn.read(buf);
        if (n === null) break;
        chunks.push(buf.slice(0, n));
      }
    } catch {
      // Connection closed
    }

    const fullResponse = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0))
    );

    const headerEnd = fullResponse.indexOf("\r\n\r\n");
    const headerSection = fullResponse.substring(0, headerEnd);
    const statusLine = headerSection.split("\r\n")[0];
    const statusMatch = statusLine.match(/HTTP\/\d\.\d\s+(\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1]) : 0;

    let responseBody = fullResponse.substring(headerEnd + 4);

    if (headerSection.toLowerCase().includes("transfer-encoding: chunked")) {
      responseBody = decodeChunked(responseBody);
    }

    return { status, body: responseBody };
  } finally {
    conn.close();
  }
}

function decodeChunked(data: string): string {
  let result = "";
  let remaining = data;

  while (remaining.length > 0) {
    const lineEnd = remaining.indexOf("\r\n");
    if (lineEnd === -1) break;

    const chunkSizeHex = remaining.substring(0, lineEnd).trim();
    const chunkSize = parseInt(chunkSizeHex, 16);

    if (isNaN(chunkSize) || chunkSize === 0) break;

    const chunkData = remaining.substring(lineEnd + 2, lineEnd + 2 + chunkSize);
    result += chunkData;
    remaining = remaining.substring(lineEnd + 2 + chunkSize + 2);
  }

  return result;
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

    const { referenceNumber } = await req.json();

    if (!referenceNumber) {
      throw new Error("referenceNumber is required");
    }

    const pesepayMode = Deno.env.get("PESEPAY_MODE") || "sandbox";
    const isLive = pesepayMode === "live";
    const hostname = isLive ? "api.pesepay.com" : "api.test.sandbox.pesepay.com";
    const path = isLive
      ? `/api/payments-engine/v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`
      : `/payments-engine/v1/payments/check-payment?referenceNumber=${encodeURIComponent(referenceNumber)}`;

    let responseData: any;

    if (isLive) {
      const rawResponse = await rawHttpGet(hostname, path, {
        "Authorization": integrationKey,
        "Content-Type": "application/json",
      });

      if (rawResponse.status >= 400) {
        throw new Error(`PesePay API error (${rawResponse.status}): ${rawResponse.body.substring(0, 300)}`);
      }

      responseData = JSON.parse(rawResponse.body);
    } else {
      const response = await fetch(`https://${hostname}${path}`, {
        method: "GET",
        headers: {
          "Authorization": integrationKey,
          "Content-Type": "application/json",
        },
      });
      responseData = await response.json();

      if (!response.ok) {
        throw new Error(`PesePay API error (${response.status}): ${JSON.stringify(responseData)}`);
      }
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
