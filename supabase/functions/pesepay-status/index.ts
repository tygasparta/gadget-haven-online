import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function base64Decode(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function removePadding(data: Uint8Array): Uint8Array {
  const paddingLength = data[data.length - 1];
  return data.slice(0, data.length - paddingLength);
}

async function decryptPayload(encryptedPayload: string, encryptionKey: string): Promise<string> {
  const combined = base64Decode(encryptedPayload);
  const iv = combined.slice(0, 16);
  const encryptedData = combined.slice(16);

  const keyData = new TextEncoder().encode(encryptionKey.padEnd(32).slice(0, 32));
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    encryptedData
  );

  const unpaddedData = removePadding(new Uint8Array(decrypted));
  return new TextDecoder().decode(unpaddedData);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const integrationKey = Deno.env.get('PESEPAY_INTEGRATION_KEY')?.trim();
    const encryptionKey = Deno.env.get('PESEPAY_ENCRYPTION_KEY')?.trim();

    if (!integrationKey || !encryptionKey) {
      console.error('Missing PesePay credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing PesePay credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const referenceNumber = url.searchParams.get('referenceNumber');

    if (!referenceNumber) {
      return new Response(
        JSON.stringify({ success: false, error: 'Reference number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Checking PesePay status for reference:', referenceNumber);

    // Make request to PesePay
    const response = await fetch(
      `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${referenceNumber}`,
      {
        method: 'GET',
        headers: {
          'authorization': integrationKey,
          'content-type': 'application/json'
        }
      }
    );

    console.log('PesePay status API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PesePay API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `PesePay API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();
    console.log('PesePay status raw response:', JSON.stringify(responseData, null, 2));

    // Decrypt the response payload
    if (responseData.payload) {
      const decryptedResponse = await decryptPayload(responseData.payload, encryptionKey);
      const parsedResponse = JSON.parse(decryptedResponse);
      console.log('Decrypted PesePay status response:', JSON.stringify(parsedResponse, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          transaction: parsedResponse
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('No payload in PesePay status response');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid response format from PesePay' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    console.error('Error in pesepay-status:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});