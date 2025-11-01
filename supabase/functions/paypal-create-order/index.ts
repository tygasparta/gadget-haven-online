import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'USD', orderId } = await req.json();

    console.log('Creating PayPal order:', { amount, currency, orderId });

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
      console.error('Token response error:', await tokenResponse.text());
      throw new Error('Failed to get PayPal access token');
    }

    const { access_token } = await tokenResponse.json();

    // Create order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        reference_id: orderId,
        description: `Order #${orderId}`,
      }],
      application_context: {
        return_url: `${req.headers.get('origin')}/payment-success?provider=paypal&order_id=${orderId}`,
        cancel_url: `${req.headers.get('origin')}/checkout?cancelled=true`,
        brand_name: 'GadgetGenie',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
      },
    };

    const createOrderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!createOrderResponse.ok) {
      const errorText = await createOrderResponse.text();
      console.error('Create order error:', errorText);
      throw new Error('Failed to create PayPal order');
    }

    const order = await createOrderResponse.json();
    console.log('PayPal order created:', order.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        approvalUrl: order.links.find((link: any) => link.rel === 'approve')?.href,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PayPal create order error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
