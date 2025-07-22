
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
        // Handle web payment
        const formData = new FormData();
        formData.append('id', integrationId);
        formData.append('reference', payment.reference);
        formData.append('amount', payment.items[0].amount.toString());
        formData.append('additionalinfo', payment.items[0].name);
        formData.append('returnurl', payment.returnUrl);
        formData.append('resulturl', payment.resultUrl);
        formData.append('authemail', payment.email);
        
        // Generate hash for security
        const values = `${integrationId}${payment.reference}${payment.items[0].amount}${payment.items[0].name}${payment.returnUrl}${payment.resultUrl}${payment.email}`;
        const hash = await generateHash(values + integrationKey);
        formData.append('hash', hash);

        const response = await fetch('https://www.paynow.co.zw/interface/initiatetransaction', {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();
        console.log('Paynow web response:', responseText);

        // Parse response
        const result = parsePaynowResponse(responseText);
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } else if (type === 'mobile') {
        // Handle mobile payment
        const formData = new FormData();
        formData.append('id', integrationId);
        formData.append('reference', payment.reference);
        formData.append('amount', payment.items[0].amount.toString());
        formData.append('additionalinfo', payment.items[0].name);
        formData.append('authemail', payment.email);
        formData.append('phone', payment.phone);
        formData.append('method', payment.method);
        
        // Generate hash for security
        const values = `${integrationId}${payment.reference}${payment.items[0].amount}${payment.items[0].name}${payment.email}${payment.phone}${payment.method}`;
        const hash = await generateHash(values + integrationKey);
        formData.append('hash', hash);

        const response = await fetch('https://www.paynow.co.zw/interface/remotetransaction', {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();
        console.log('Paynow mobile response:', responseText);

        // Parse response
        const result = parsePaynowResponse(responseText);
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } else if (type === 'poll') {
        // Handle status polling
        const response = await fetch(pollUrl);
        const responseText = await response.text();
        console.log('Paynow poll response:', responseText);

        // Parse response
        const result = parsePaynowResponse(responseText);
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response('Invalid request type', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Paynow payment error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to generate SHA512 hash
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-512', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

// Helper function to parse Paynow response
function parsePaynowResponse(responseText: string) {
  const lines = responseText.split('\n');
  const result: any = { success: false };

  for (const line of lines) {
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      const trimmedKey = key.trim().toLowerCase();
      const trimmedValue = value.trim();

      switch (trimmedKey) {
        case 'status':
          result.status = trimmedValue;
          result.success = trimmedValue.toLowerCase() === 'ok';
          break;
        case 'browserurl':
          result.redirectUrl = trimmedValue;
          break;
        case 'pollurl':
          result.pollUrl = trimmedValue;
          break;
        case 'paynowreference':
          result.reference = trimmedValue;
          break;
        case 'instructions':
          result.instructions = trimmedValue;
          break;
        case 'error':
          result.error = trimmedValue;
          break;
        case 'paid':
          result.paid = trimmedValue.toLowerCase() === 'true';
          break;
        case 'amount':
          result.amount = parseFloat(trimmedValue);
          break;
      }
    }
  }

  if (!result.success && !result.error) {
    result.error = 'Unknown error occurred';
  }

  return result;
}
