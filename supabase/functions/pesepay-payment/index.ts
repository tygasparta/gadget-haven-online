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
    
    // Use encryption key as-is, pad or truncate to 32 bytes for AES-256
    const keyString = encryptionKey.padEnd(32, '0').substring(0, 32);
    const keyBytes = encoder.encode(keyString);
    
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
    const encoder = new TextEncoder();
    
    // Use encryption key as-is, pad or truncate to 32 bytes for AES-256
    const keyString = encryptionKey.padEnd(32, '0').substring(0, 32);
    const keyBytes = encoder.encode(keyString);
    
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
    
    console.log('Integration key available:', !!integrationKey);
    console.log('Encryption key available:', !!encryptionKey);
    
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

    console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));

    // Try making API request without encryption first
    try {
      console.log('Attempting PesePay API call...');
      
      const pesePayResponse = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integrationKey.trim()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentPayload),
      });
      
      console.log('Response status:', pesePayResponse.status);
      console.log('Response headers:', Object.fromEntries(pesePayResponse.headers.entries()));
      
      const responseText = await pesePayResponse.text();
      console.log('PesePay raw response:', responseText);
      
      if (pesePayResponse.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('PesePay parsed response:', JSON.stringify(responseData, null, 2));
          
          // Return the response from PesePay
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
            console.log('No redirect URL found, returning full response');
            return new Response(JSON.stringify({
              success: true,
              ...responseData
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
              error: 'Failed to process PesePay response',
              details: parseError instanceof Error ? parseError.message : 'Unknown parse error',
              rawResponse: responseText
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else {
        console.error('PesePay API error status:', pesePayResponse.status);
        console.error('PesePay API error response:', responseText);
        
        // If unencrypted fails, try with encryption
        if (pesePayResponse.status === 400 || pesePayResponse.status === 401) {
          console.log('Trying with encryption...');
          
          try {
            const encryptedPayload = await encryptPayload(JSON.stringify(paymentPayload), encryptionKey);
            console.log('Payload encrypted successfully');
            
            const encryptedResponse = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${integrationKey.trim()}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ payload: encryptedPayload }),
            });
            
            const encryptedResponseText = await encryptedResponse.text();
            console.log('Encrypted API response:', encryptedResponseText);
            
            if (encryptedResponse.ok) {
              const parsedResponse = JSON.parse(encryptedResponseText);
              
              if (parsedResponse.payload) {
                const decryptedPayload = await decryptPayload(parsedResponse.payload, encryptionKey);
                const responseData = JSON.parse(decryptedPayload);
                
                return new Response(JSON.stringify({
                  success: true,
                  redirectUrl: responseData.redirectUrl || responseData.paymentUrl,
                  referenceNumber: responseData.referenceNumber || requestData.merchantReference
                }), {
                  status: 200,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
              }
            }
          } catch (encryptionError) {
            console.error('Encryption attempt failed:', encryptionError);
          }
        }
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `PesePay API error: ${pesePayResponse.status}`,
            details: responseText
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
    } catch (apiError) {
      console.error('API call error:', apiError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to connect to PesePay API',
          details: apiError instanceof Error ? apiError.message : 'Unknown API error'
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
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});