import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create PesePay signature using Web Crypto API
async function createPesePaySignature(payload: string, encryptionKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(encryptionKey);
  const data = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
      console.error('Missing PesePay keys');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment service configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestData = await req.json();
    console.log('Request data received:', {
      amount: requestData.amount,
      currencyCode: requestData.currencyCode,
      merchantReference: requestData.merchantReference,
      reasonForPayment: requestData.reasonForPayment
    });

    // Prepare payment payload according to PesePay docs
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

    const payloadString = JSON.stringify(paymentPayload);
    console.log('Making API request to PesePay with payload:', payloadString);

    // Create proper authentication headers for PesePay
    const timestamp = Date.now().toString();
    const signature = await createPesePaySignature(payloadString + timestamp, encryptionKey);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': integrationKey,
      'X-Timestamp': timestamp,
      'X-Signature': signature
    };

    console.log('Request headers prepared with signature authentication');

    try {
      const response = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
        method: 'POST',
        headers: headers,
        body: payloadString,
      });

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
      
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to connect to payment service',
          details: fetchError instanceof Error ? fetchError.message : 'Network error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('PesePay function error:', error);
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
