import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Create Supabase service client to update order
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Update order status to paid
      const { data: updatedOrder } = await supabaseService
        .from("orders")
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString() 
        })
        .eq('payment_reference', sessionId)
        .select()
        .single();

      if (updatedOrder && session.metadata?.cart_items) {
        // Create order items if they don't exist
        const cartItems = JSON.parse(session.metadata.cart_items);
        const orderItems = cartItems.map((item: any) => ({
          order_id: updatedOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));

        await supabaseService.from("order_items").upsert(orderItems);

        // Clear user's cart if user_id exists
        if (session.metadata?.user_id && session.metadata.user_id !== "guest") {
          await supabaseService
            .from("cart_items")
            .delete()
            .eq('user_id', session.metadata.user_id);
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        order: updatedOrder,
        session: {
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      payment_status: session.payment_status 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});