import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AES Encryption utilities
function pad(text: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const padLen = 16 - (data.length % 16);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
}

function base64Encode(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function encryptPayload(payload: string, encryptionKey: string): Promise<string> {
  // Use first 16 characters as IV and full 32 characters as key
  const iv = new TextEncoder().encode(encryptionKey.slice(0, 16));
  const keyData = new TextEncoder().encode(encryptionKey.padEnd(32).slice(0, 32));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  const padded = pad(payload);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    padded as BufferSource
  );

  // Prepend IV to encrypted data, then base64 encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return base64Encode(combined.buffer);
}

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
    let integrationKey = Deno.env.get('PESEPAY_INTEGRATION_KEY');
    let encryptionKey = Deno.env.get('PESEPAY_ENCRYPTION_KEY');

    if (!integrationKey || !encryptionKey) {
      console.error('Missing PesePay credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing PesePay credentials' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean the keys thoroughly
    integrationKey = integrationKey.trim().replace(/[\r\n\t\0]/g, '');
    encryptionKey = encryptionKey.trim().replace(/[\r\n\t\0]/g, '');

    console.log('Integration key length:', integrationKey.length);
    console.log('Integration key format check:', /^[a-f0-9-]{36}$/.test(integrationKey));
    console.log('Encryption key length:', encryptionKey.length);

    // Validate key formats
    if (integrationKey.length !== 36) {
      throw new Error('Invalid integration key length');
    }
    if (encryptionKey.length !== 32) {
      throw new Error('Invalid encryption key length');
    }

    const body = await req.json();
    console.log('Initiating PesePay transaction:', JSON.stringify(body, null, 2));

    // Prepare transaction payload
    const transaction = {
      amountDetails: {
        amount: body.amount,
        currencyCode: body.currencyCode
      },
      reasonForPayment: body.reasonForPayment,
      resultUrl: body.resultUrl,
      returnUrl: body.returnUrl
    };

    console.log('Transaction payload:', JSON.stringify(transaction, null, 2));

    // Encrypt the payload
    const encryptedPayload = await encryptPayload(JSON.stringify(transaction), encryptionKey);
    console.log('Payload encrypted successfully');

    // Make request with minimal headers
    console.log('Making request to PesePay API...');
    console.log('Request payload length:', encryptedPayload.length);
    
    const response = await fetch(
      'https://api.pesepay.com/api/payments-engine/v1/payments/initiate',
      {
        method: 'POST',
        headers: {
          'authorization': integrationKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({ payload: encryptedPayload })
      }
    );

    console.log('PesePay API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('PesePay API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `PesePay API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();
    console.log('PesePay raw response:', JSON.stringify(responseData, null, 2));

    // Decrypt the response payload
    if (responseData.payload) {
      const decryptedResponse = await decryptPayload(responseData.payload, encryptionKey);
      const parsedResponse = JSON.parse(decryptedResponse);
      console.log('Decrypted PesePay response:', JSON.stringify(parsedResponse, null, 2));

      return new Response(
        JSON.stringify({
          success: true,
          redirectUrl: parsedResponse.redirectUrl,
          referenceNumber: parsedResponse.referenceNumber,
          pollUrl: parsedResponse.pollUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('No payload in PesePay response');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid response format from PesePay' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    console.error('Error in pesepay-initiate:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});