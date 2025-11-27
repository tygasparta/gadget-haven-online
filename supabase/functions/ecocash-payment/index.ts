import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, description, orderId, currency = 'USD' } = await req.json();

    console.log('Creating EcoCash payment:', { amount, description, orderId, currency });

    const merchantCode = Deno.env.get('ECOCASH_MERCHANT_CODE');
    const apiKey = Deno.env.get('ECOCASH_API_KEY');
    const apiUrl = Deno.env.get('ECOCASH_API_URL');

    if (!merchantCode || !apiKey || !apiUrl) {
      throw new Error('EcoCash credentials not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate unique payment reference
    const reference = `EC-${orderId}-${Date.now()}`;

    // Create payment request to EcoCash API
    // Include API credentials in the request body
    const ecocashPayload = {
      merchantCode,
      apiKey,
      amount: parseFloat(amount).toFixed(2),
      currency,
      reference,
      description,
      callbackUrl: `${supabaseUrl}/functions/v1/ecocash-webhook`,
      returnUrl: `https://gadgetgenie.org/payment-success?reference=${reference}`,
    };

    console.log('Sending request to EcoCash API:', apiUrl);
    console.log('Payload (without apiKey):', { ...ecocashPayload, apiKey: '[REDACTED]' });

    const ecocashResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ecocashPayload),
    });

    const responseText = await ecocashResponse.text();
    console.log('EcoCash API response status:', ecocashResponse.status);
    console.log('EcoCash API response body:', responseText);

    if (!ecocashResponse.ok) {
      console.error('EcoCash API error response:', {
        status: ecocashResponse.status,
        statusText: ecocashResponse.statusText,
        body: responseText
      });
      
      // Construct a detailed error message
      let errorMessage = `EcoCash API error (${ecocashResponse.status}): ${ecocashResponse.statusText}`;
      
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch {
          errorMessage += ` - ${responseText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    let ecocashData;
    try {
      ecocashData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse EcoCash response:', parseError);
      throw new Error('Invalid response from EcoCash API');
    }
    console.log('EcoCash response:', ecocashData);

    // Store payment record in database
    const { error: dbError } = await supabase
      .from('payment_records')
      .insert({
        order_id: orderId,
        amount,
        payment_method: 'ecocash',
        payment_reference: reference,
        status: 'pending',
        poll_url: ecocashData.pollUrl || null,
        redirect_url: ecocashData.redirectUrl || null,
        instructions: ecocashData.instructions || null,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        reference,
        redirectUrl: ecocashData.redirectUrl,
        pollUrl: ecocashData.pollUrl,
        instructions: ecocashData.instructions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ecocash-payment function:', error);
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: {
          name: error.name,
          stack: error.stack,
        }
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
