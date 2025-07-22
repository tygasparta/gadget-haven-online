
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      // Handle Paynow webhook notification
      const formData = await req.formData()
      const reference = formData.get('reference')?.toString()
      const paynowreference = formData.get('paynowreference')?.toString()
      const amount = formData.get('amount')?.toString()
      const status = formData.get('status')?.toString()
      const pollurl = formData.get('pollurl')?.toString()
      const hash = formData.get('hash')?.toString()

      console.log('Paynow webhook received:', {
        reference,
        paynowreference,
        amount,
        status,
        pollurl,
        hash
      })

      if (reference && status) {
        // Extract order ID from reference (assuming format ORDER-{id})
        const orderIdMatch = reference.match(/ORDER-(\d+)/)
        if (orderIdMatch) {
          const orderId = orderIdMatch[1]
          
          // Update order status based on payment status
          let orderStatus = 'pending'
          if (status.toLowerCase() === 'paid') {
            orderStatus = 'confirmed'
          } else if (status.toLowerCase() === 'cancelled') {
            orderStatus = 'cancelled'
          }

          const { error } = await supabaseClient
            .from('orders')
            .update({ 
              status: orderStatus,
              payment_reference: paynowreference,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId)

          if (error) {
            console.error('Error updating order:', error)
            return new Response('Error updating order', { status: 500, headers: corsHeaders })
          }

          console.log(`Order ${orderId} updated to status: ${orderStatus}`)
        }
      }

      return new Response('OK', { headers: corsHeaders })
    }

    // Handle GET requests for payment status polling
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const reference = url.searchParams.get('reference')
      
      if (reference) {
        // You can implement status checking logic here if needed
        return new Response(JSON.stringify({ status: 'pending' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
