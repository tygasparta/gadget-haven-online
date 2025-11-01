import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, paypal-transmission-id, paypal-transmission-time, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookEvent = await req.json();
    
    console.log('PayPal webhook received:', {
      event_type: webhookEvent.event_type,
      resource_type: webhookEvent.resource_type,
      summary: webhookEvent.summary,
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different webhook events
    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const resource = webhookEvent.resource;
        const orderId = resource.purchase_units?.[0]?.reference_id;
        
        if (orderId) {
          console.log('Payment completed for order:', orderId);
          
          await supabase
            .from('orders')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payment_records')
            .update({
              status: 'completed',
              payment_reference: resource.id,
            })
            .eq('order_id', orderId)
            .eq('payment_method', 'paypal');
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED': {
        const resource = webhookEvent.resource;
        const orderId = resource.purchase_units?.[0]?.reference_id;
        
        if (orderId) {
          console.log('Payment denied/declined for order:', orderId);
          
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payment_records')
            .update({
              status: 'failed',
            })
            .eq('order_id', orderId)
            .eq('payment_method', 'paypal');
        }
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        const resource = webhookEvent.resource;
        const orderId = resource.purchase_units?.[0]?.reference_id;
        
        if (orderId) {
          console.log('Payment refunded for order:', orderId);
          
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              payment_status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId);

          await supabase
            .from('payment_records')
            .update({
              status: 'refunded',
            })
            .eq('order_id', orderId)
            .eq('payment_method', 'paypal');
        }
        break;
      }

      default:
        console.log('Unhandled webhook event type:', webhookEvent.event_type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('PayPal webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
