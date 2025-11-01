import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paypalOrderId, orderDbId } = await req.json();

    console.log('Capturing PayPal order:', { paypalOrderId, orderDbId });

    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET');
    const PAYPAL_API_URL = Deno.env.get('PAYPAL_MODE') === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured');
    }

    // Get access token
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const { access_token } = await tokenResponse.json();

    // Capture order
    const captureResponse = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      console.error('Capture error:', errorText);
      throw new Error('Failed to capture PayPal payment');
    }

    const captureData = await captureResponse.json();
    console.log('PayPal payment captured:', captureData);

    // Update order in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (orderDbId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderDbId);

      if (updateError) {
        console.error('Error updating order:', updateError);
      } else {
        console.log('Order updated successfully');
      }

      // Update payment record
      const { error: paymentError } = await supabase
        .from('payment_records')
        .update({
          status: 'completed',
          payment_reference: captureData.id,
        })
        .eq('order_id', orderDbId)
        .eq('payment_method', 'paypal');

      if (paymentError) {
        console.error('Error updating payment record:', paymentError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        captureId: captureData.id,
        status: captureData.status,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PayPal capture error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
