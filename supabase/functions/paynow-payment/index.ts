
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Paynow } from 'npm:paynow@2.2.2'

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
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      })
    }

    const { type, ...requestData } = await req.json()
    
    // Get Paynow credentials from environment
    const integrationId = Deno.env.get('PAYNOW_INTEGRATION_ID')
    const integrationKey = Deno.env.get('PAYNOW_INTEGRATION_KEY')

    if (!integrationId || !integrationKey) {
      console.error('Missing Paynow credentials')
      return new Response(JSON.stringify({
        success: false,
        error: 'Payment service configuration error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Paynow with credentials
    const paynow = new Paynow(integrationId, integrationKey)
    paynow.resultUrl = requestData.resultUrl || 'https://your-domain.com/api/paynow/webhook'
    paynow.returnUrl = requestData.returnUrl || 'https://your-domain.com/payment/success'

    console.log('Processing Paynow request:', { type, reference: requestData.reference })

    if (type === 'web') {
      // Handle web payment
      const payment = paynow.createPayment(requestData.reference, requestData.email || '')
      
      // Add items to payment
      if (requestData.items && Array.isArray(requestData.items)) {
        requestData.items.forEach((item: any) => {
          payment.add(item.title || 'Item', item.amount || 0)
        })
      }

      const response = await paynow.send(payment)
      console.log('Web payment response:', response)

      return new Response(JSON.stringify({
        success: response.success,
        redirectUrl: response.redirectUrl,
        pollUrl: response.pollUrl,
        error: response.error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } else if (type === 'mobile') {
      // Handle mobile payment
      const payment = paynow.createPayment(requestData.reference, requestData.email || '')
      
      // Add items to payment
      if (requestData.items && Array.isArray(requestData.items)) {
        requestData.items.forEach((item: any) => {
          payment.add(item.title || 'Item', item.amount || 0)
        })
      }

      const cleanPhone = requestData.phoneNumber.replace(/\s+/g, '').replace(/^\+263/, '0')
      
      let response
      if (requestData.method === 'ecocash') {
        response = await paynow.sendEcoCash(payment, cleanPhone, 'ecocash')
      } else if (requestData.method === 'onemoney') {
        response = await paynow.sendOneMoney(payment, cleanPhone, 'onemoney')
      } else {
        throw new Error(`Unsupported mobile method: ${requestData.method}`)
      }

      console.log('Mobile payment response:', response)

      return new Response(JSON.stringify({
        success: response.success,
        pollUrl: response.pollUrl,
        instructions: response.instructions,
        error: response.error
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } else if (type === 'poll') {
      // Handle status polling
      const status = await paynow.pollTransaction(requestData.pollUrl)
      console.log('Poll status response:', status)

      return new Response(JSON.stringify({
        status: status.status,
        paid: status.paid,
        reference: status.reference,
        amount: status.amount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid request type'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Paynow payment error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
