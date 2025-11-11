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
    const payload = await req.json();
    
    console.log('EcoCash webhook received:', payload);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { reference, status, transactionId } = payload;

    if (!reference) {
      throw new Error('No payment reference provided');
    }

    // Update payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payment_records')
      .update({
        status: status === 'SUCCESS' ? 'completed' : 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('payment_reference', reference)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment record:', paymentError);
      throw paymentError;
    }

    console.log('Updated payment record:', paymentRecord);

    // Update order status if payment was successful
    if (status === 'SUCCESS' && paymentRecord.order_id) {
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_reference: transactionId || reference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.order_id);

      if (orderError) {
        console.error('Error updating order:', orderError);
      } else {
        console.log('Order updated successfully:', paymentRecord.order_id);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ecocash-webhook function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
