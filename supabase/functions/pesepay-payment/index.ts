import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AES encryption function for PesePay
async function encryptPayload(payload: string, encryptionKey: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Convert encryption key to proper format (hex to ArrayBuffer)
    const keyBytes = new Uint8Array(encryptionKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    // Encrypt the payload
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encoder.encode(payload)
    );
    
    // Combine IV and encrypted data, then encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt payload');
  }
}

// AES decryption function for PesePay response
async function decryptPayload(encryptedData: string, encryptionKey: string): Promise<string> {
  try {
    const decoder = new TextDecoder();
    
    // Convert encryption key to proper format
    const keyBytes = new Uint8Array(encryptionKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
    
    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    
    // Decode base64 and extract IV and encrypted data
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt payload');
  }
}

serve(async (req) => {
  console.log('PesePay payment function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const integrationKey = Deno.env.get('PESEPAY_INTEGRATION_KEY');
    const encryptionKey = Deno.env.get('PESEPAY_ENCRYPTION_KEY');
    
    console.log('Raw integration key:', integrationKey);
    console.log('Integration key type:', typeof integrationKey);
    
    if (!integrationKey || !encryptionKey) {
      console.error('Missing PesePay credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment service configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Clean and validate the integration key
    const cleanIntegrationKey = integrationKey.trim();
    console.log('Cleaned integration key length:', cleanIntegrationKey.length);
    
    // Check for invalid characters in the integration key
    const invalidChars = /[^\w\-]/g;
    if (invalidChars.test(cleanIntegrationKey)) {
      console.error('Integration key contains invalid characters');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid integration key format' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestData = await req.json();
    console.log('Request data received:', { ...requestData, customerPhone: '***' });

    // Prepare payment payload
    const paymentPayload = {
      amountDetails: {
        amount: requestData.amount,
        currencyCode: requestData.currencyCode
      },
      merchantReference: requestData.merchantReference,
      reasonForPayment: requestData.reasonForPayment,
      resultUrl: requestData.resultUrl,
      returnUrl: requestData.returnUrl
    };

    console.log('Sending payment request to PesePay API');
    console.log('Integration key length:', cleanIntegrationKey ? cleanIntegrationKey.length : 'undefined');
    console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));

    // Encrypt the payload as required by PesePay
    try {
      console.log('Encrypting payload for PesePay...');
      const encryptedPayload = await encryptPayload(JSON.stringify(paymentPayload), encryptionKey);
      console.log('Payload encrypted successfully');
      
      const requestBody = JSON.stringify({
        payload: encryptedPayload
      });
      
      console.log('Sending encrypted request to PesePay API');
      
      const pesePayResponse = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'authorization': cleanIntegrationKey,
          'content-type': 'application/json'
        },
        body: requestBody,
      });
      
      console.log('Response status:', pesePayResponse.status);
      console.log('Response ok:', pesePayResponse.ok);
      
      if (pesePayResponse.ok) {
        const responseText = await pesePayResponse.text();
        console.log('PesePay raw response:', responseText);
        
        let responseData;
        try {
          const parsedResponse = JSON.parse(responseText);
          
          if (parsedResponse.payload) {
            // Decrypt the response payload
            const decryptedPayload = await decryptPayload(parsedResponse.payload, encryptionKey);
            console.log('Decrypted payload:', decryptedPayload);
            responseData = JSON.parse(decryptedPayload);
          } else {
            responseData = parsedResponse;
          }
          
          console.log('PesePay parsed response:', JSON.stringify(responseData, null, 2));
          
          // Return the actual response from PesePay if available
          if (responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl) {
            const redirectUrl = responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl;
            return new Response(JSON.stringify({
              success: true,
              redirectUrl: redirectUrl,
              referenceNumber: responseData.referenceNumber || requestData.merchantReference,
              pollUrl: responseData.pollUrl || `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${responseData.referenceNumber || requestData.merchantReference}`
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            console.log('No redirect URL found in response, returning full response data');
            return new Response(JSON.stringify({
              success: true,
              ...responseData
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        } catch (parseError) {
          console.error('Failed to parse or decrypt PesePay response:', parseError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to process PesePay response',
              details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else {
        const errorText = await pesePayResponse.text();
        console.error('PesePay API error response:', errorText);
        console.error('PesePay API error status:', pesePayResponse.status);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `PesePay API error: ${pesePayResponse.status}`,
            details: errorText
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
    } catch (encryptionError) {
      console.error('Encryption/API error:', encryptionError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to process payment request',
          details: encryptionError instanceof Error ? encryptionError.message : 'Unknown encryption error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('PesePay payment function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});