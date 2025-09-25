import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Utility: pad string for AES
function pad(text: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const padLen = 16 - (data.length % 16);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
}

// Utility: base64 encode
function base64Encode(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// AES Encrypt payload with encryptionKey
async function encryptPayload(payload: string, encryptionKey: string): Promise<string> {
  // Convert key to 32-byte (256-bit) key
  const keyData = new TextEncoder().encode(encryptionKey.padEnd(32).slice(0, 32));
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );

  const padded = pad(payload);
  
  // Create a proper ArrayBuffer from the padded data
  const paddedBuffer = new ArrayBuffer(padded.length);
  const view = new Uint8Array(paddedBuffer);
  view.set(padded);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    paddedBuffer,
  );

  // Prepend IV to encrypted data, then base64 encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return base64Encode(combined.buffer);
}

serve(async (req) => {
  console.log('PesePay payment function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const integrationKey = (Deno.env.get("PESEPAY_INTEGRATION_KEY") || "").trim();
    const encryptionKey = (Deno.env.get("PESEPAY_ENCRYPTION_KEY") || "").trim();

    if (!integrationKey || !encryptionKey) {
      console.error('Missing PesePay keys in environment variables');
      return new Response(
        JSON.stringify({ success: false, error: "Missing PesePay keys in environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const requestData = await req.json();
    console.log('Request data received:', {
      amount: requestData.amount,
      currencyCode: requestData.currencyCode,
      merchantReference: requestData.merchantReference,
      reasonForPayment: requestData.reasonForPayment
    });

    const transaction = {
      amountDetails: {
        amount: requestData.amount,
        currencyCode: requestData.currencyCode,
      },
      reasonForPayment: requestData.reasonForPayment,
      resultUrl: requestData.resultUrl,
      returnUrl: requestData.returnUrl,
    };

    // Encrypt payload with AES
    const encryptedPayload = await encryptPayload(JSON.stringify(transaction), encryptionKey);

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": integrationKey, // must be raw key
    };

    console.log("Auth header length:", integrationKey.length);
    console.log("Encrypted payload length:", encryptedPayload.length);

    const response = await fetch(
      "https://api.pesepay.com/api/payments-engine/v1/payments/initiate",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ payload: encryptedPayload }),
      },
    );

    console.log('PesePay response status:', response.status);
    console.log('PesePay response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('PesePay raw response:', responseText);

    if (response.ok) {
      try {
        const responseData = JSON.parse(responseText);
        console.log('Parsed PesePay response:', JSON.stringify(responseData, null, 2));
        
        // Check for various possible redirect URL field names
        const redirectUrl = responseData.redirectUrl || 
                           responseData.paymentUrl || 
                           responseData.checkoutUrl ||
                           responseData.redirect_url ||
                           responseData.payment_url;
        
        if (redirectUrl) {
          return new Response(JSON.stringify({
            success: true,
            redirectUrl: redirectUrl,
            referenceNumber: responseData.referenceNumber || responseData.reference || requestData.merchantReference,
            pollUrl: responseData.pollUrl || `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${responseData.referenceNumber || requestData.merchantReference}`,
            transactionReference: responseData.transactionReference || responseData.reference
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          console.log('No redirect URL found in response, returning full response');
          return new Response(JSON.stringify({
            success: true,
            data: responseData,
            message: 'Payment initiated but no redirect URL provided'
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
      } catch (parseError) {
        console.error('Failed to parse PesePay response:', parseError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to parse payment service response',
            details: parseError instanceof Error ? parseError.message : 'Parse error',
            rawResponse: responseText
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      console.error('PesePay API error:', response.status, responseText);
      
      // Try to parse error response
      let errorDetails = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorDetails = errorData.message || errorData.error || responseText;
      } catch {
        // Keep original response text if not JSON
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payment service error: ${response.status}`,
          details: errorDetails,
          statusCode: response.status
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (err) {
    console.error("Error in PesePay payment:", err instanceof Error ? err.message : 'Unknown error');
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
