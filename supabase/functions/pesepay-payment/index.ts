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

    // Try different approaches to fix the invalid HTTP header error
    try {
      console.log('Attempting PesePay API call - Method 1: Simple headers');
      
      const requestBody = JSON.stringify({ 
        payload: JSON.stringify(paymentPayload)
      });
      
      console.log('Request body:', requestBody);

      // Try with simple object headers (not Headers constructor)
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
          responseData = JSON.parse(responseText);
          console.log('PesePay parsed response:', JSON.stringify(responseData, null, 2));
          
          // Return the actual response from PesePay if available
          if (responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl) {
            const redirectUrl = responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl;
            return new Response(JSON.stringify({
              success: true,
              redirectUrl: redirectUrl,
              referenceNumber: requestData.merchantReference,
              pollUrl: responseData.pollUrl || `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${requestData.merchantReference}`
            }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        } catch (parseError) {
          console.error('Failed to parse PesePay response as JSON:', parseError);
          // Return error instead of fallback
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to parse PesePay response',
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
        
        // Return the actual error instead of fallback
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `PesePay API error: ${pesePayResponse.status}`,
            details: errorText,
            method: 'Method 1'
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
    } catch (firstError) {
      console.error('Method 1 failed:', firstError);
      
      // Try Method 2: Different header case
      try {
        console.log('Attempting PesePay API call - Method 2: Different header format');
        
        const requestBody = JSON.stringify({ 
          payload: JSON.stringify(paymentPayload)
        });

        const pesePayResponse = await fetch('https://api.pesepay.com/api/payments-engine/v1/payments/initiate', {
          method: 'POST',
          headers: {
            'Authorization': cleanIntegrationKey,
            'Content-Type': 'application/json'
          },
          body: requestBody,
        });
        
        console.log('Method 2 - Response status:', pesePayResponse.status);
        console.log('Method 2 - Response ok:', pesePayResponse.ok);
        
        if (pesePayResponse.ok) {
          const responseText = await pesePayResponse.text();
          console.log('Method 2 - PesePay raw response:', responseText);
          
          let responseData;
          try {
            responseData = JSON.parse(responseText);
            console.log('Method 2 - PesePay parsed response:', JSON.stringify(responseData, null, 2));
            
            if (responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl) {
              const redirectUrl = responseData.redirectUrl || responseData.paymentUrl || responseData.checkoutUrl;
              return new Response(JSON.stringify({
                success: true,
                redirectUrl: redirectUrl,
                referenceNumber: requestData.merchantReference,
                pollUrl: responseData.pollUrl || `https://api.pesepay.com/api/payments-engine/v1/payments/check-payment?referenceNumber=${requestData.merchantReference}`
              }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              });
            }
          } catch (parseError) {
            console.error('Method 2 - Failed to parse PesePay response as JSON:', parseError);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Failed to parse PesePay response (Method 2)',
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
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `PesePay API error (Method 2): ${pesePayResponse.status}`,
              details: errorText
            }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (secondError) {
        console.error('Method 2 failed:', secondError);
        
        // Return the actual errors instead of fallback
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'All PesePay API methods failed',
            details: {
              method1: firstError instanceof Error ? firstError.message : 'Unknown error',
              method2: secondError instanceof Error ? secondError.message : 'Unknown error'
            }
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    // Fallback return (should not reach here, but needed for TypeScript)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unexpected code path reached'
      }),
      { 
        status: 500,
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