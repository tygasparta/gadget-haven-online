
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
      const { type, payment, pollUrl } = await req.json()

      // Get Paynow credentials from environment
      const integrationId = Deno.env.get('PAYNOW_INTEGRATION_ID') || '21058';
      const integrationKey = Deno.env.get('PAYNOW_INTEGRATION_KEY') || 'ece6db09-1654-4bcf-8494-ac98155f41e7';

      if (type === 'web') {
        // For development/testing, return a mock successful response
        const mockResponse = {
          success: true,
          status: 'Ok',
          redirectUrl: `${new URL(req.url).origin}/payment/success?reference=${payment.reference}&test=true`,
          pollUrl: `${new URL(req.url).origin}/api/paynow/poll?reference=${payment.reference}`,
          reference: payment.reference
        };

        console.log('Returning mock web payment response:', mockResponse);
        
        return new Response(JSON.stringify(mockResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } else if (type === 'mobile') {
        // For development/testing, return a mock successful response
        const mockResponse = {
          success: true,
          status: 'Ok',
          pollUrl: `${new URL(req.url).origin}/api/paynow/poll?reference=${payment.reference}`,
          reference: payment.reference,
          instructions: `Please check your ${payment.method === 'ecocash' ? 'EcoCash' : 'OneMoney'} app to complete the payment of $${payment.items[0].amount}`
        };

        console.log('Returning mock mobile payment response:', mockResponse);
        
        return new Response(JSON.stringify(mockResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } else if (type === 'poll') {
        // For development/testing, return a mock paid status
        const mockPollResponse = {
          success: true,
          status: 'Paid',
          paid: true,
          reference: new URL(pollUrl).searchParams.get('reference'),
          amount: 53.19
        };

        console.log('Returning mock poll response:', mockPollResponse);
        
        return new Response(JSON.stringify(mockPollResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
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
    console.error('Paynow payment error:', error);
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
