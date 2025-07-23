
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      const { type, order_id, amount, currency, notify_url } = await req.json()

      // Get Dischub credentials from environment
      const apiKey = Deno.env.get('DISCHUB_API_KEY');
      const recipientEmail = Deno.env.get('DISCHUB_RECIPIENT_EMAIL');

      if (!apiKey || !recipientEmail) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Dischub credentials not configured' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        });
      }

      if (type === 'create_order') {
        console.log('Creating Dischub payment order:', { order_id, amount, currency });
        
        // Validate currency
        if (currency !== 'USD' && currency !== 'ZWG') {
          return new Response(JSON.stringify({
            success: false,
            error: 'Invalid currency. Only USD and ZWG are supported.'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          });
        }

        // Validate amount limits
        if (currency === 'USD' && amount > 480) {
          return new Response(JSON.stringify({
            success: false,
            error: 'USD amount exceeds maximum limit of $480.00'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          });
        }

        if (currency === 'ZWG' && amount > 7000) {
          return new Response(JSON.stringify({
            success: false,
            error: 'ZWG amount exceeds maximum limit of ZWG 7,000.00'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          });
        }

        // Prepare request to Dischub API
        const dischubRequest = {
          api_key: apiKey,
          notify_url: notify_url,
          order_id: order_id,
          recipient: recipientEmail,
          amount: amount,
          currency: currency
        };

        console.log('Sending request to Dischub API:', { ...dischubRequest, api_key: '[REDACTED]' });

        // Call Dischub API
        const dischubResponse = await fetch('https://dischub.co.zw/api/orders/create/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dischubRequest),
        });

        const dischubData = await dischubResponse.json();
        console.log('Dischub API response:', dischubData);

        if (dischubData.status === 'success') {
          return new Response(JSON.stringify({
            success: true,
            status: 'success',
            message: dischubData.message,
            recipient: recipientEmail,
            order_id: order_id
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: dischubData.message || 'Payment order creation failed'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          });
        }
      }

      return new Response(JSON.stringify({ success: false, error: 'Invalid request type' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Dischub payment error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 200, // Return 200 to avoid frontend errors, but with success: false
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
