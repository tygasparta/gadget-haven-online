import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('PesePay payment function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const integrationKey = Deno.env.get('PESEPAY_INTEGRATION_KEY');
    const encryptionKey = Deno.env.get('PESEPAY_ENCRYPTION_KEY');
    
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

    console.log('Sending payment request to PesePay API');

    // For now, we'll use a simplified approach without encryption
    // In production, you would need to implement proper encryption/decryption
    const pesePayResponse = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
      method: 'POST',
      headers: {
        'authorization': integrationKey,  // PesePay expects integration key directly, not Bearer prefix
        'content-type': 'application/json',
      },
      body: JSON.stringify({ 
        payload: JSON.stringify(paymentPayload)
      }),
    });

    if (!pesePayResponse.ok) {
      const errorText = await pesePayResponse.text();
      console.error('PesePay API error:', errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payment gateway error: ${pesePayResponse.status}` 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const responseData = await pesePayResponse.json();
    console.log('PesePay response received');

    // In a real implementation, you would decrypt the response payload here
    // For now, we'll return a mock response structure
    return new Response(
      JSON.stringify({
        success: true,
        redirectUrl: `https://gateway.pesepay.com/payment/${requestData.merchantReference}`,
        referenceNumber: requestData.merchantReference,
        pollUrl: `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${requestData.merchantReference}`
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

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