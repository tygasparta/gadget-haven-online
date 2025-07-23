
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
      const webhookData = await req.json()
      console.log('Received Dischub webhook:', webhookData)

      // Initialize Supabase client with service role key
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      )

      const { 
        transaction_id, 
        order_id, 
        reference, 
        status, 
        currency, 
        amount, 
        timestamp 
      } = webhookData

      // Update payment record
      const paymentStatus = status === 'success' ? 'paid' : 'failed'
      
      const { error: updateError } = await supabase
        .from('payment_records')
        .update({ 
          status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', order_id)

      if (updateError) {
        console.error('Error updating payment record:', updateError)
      } else {
        console.log('Payment record updated successfully')
      }

      // If payment is successful, update the associated order
      if (status === 'success') {
        // Try to extract order DB ID from payment reference
        const orderIdMatch = order_id.match(/ORDER-(.+)/)
        if (orderIdMatch) {
          const orderDbId = orderIdMatch[1]
          
          console.log('Updating order status for successful payment:', orderDbId)
          
          const { error: orderError } = await supabase
            .from('orders')
            .update({ 
              status: 'confirmed',
              payment_reference: order_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderDbId)

          if (orderError) {
            console.error('Error updating order status:', orderError)
          } else {
            console.log('Order status updated to confirmed')
          }
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Dischub webhook error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 200, // Return 200 so Dischub doesn't retry
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
