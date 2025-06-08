
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Payment verification request received");

    const { paymentIntentId } = await req.json();

    if (!paymentIntentId) {
      console.error("Payment Intent ID is required");
      throw new Error("Payment Intent ID is required");
    }

    console.log("Verifying payment intent:", paymentIntentId);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("Stripe is not configured");
      throw new Error("Stripe is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      console.error("Payment Intent not found");
      throw new Error("Payment Intent not found");
    }

    console.log("Payment Intent status:", paymentIntent.status);

    let paymentStatus = "pending";
    let paymentFlowStatus = "payment_pending";

    if (paymentIntent.status === "succeeded") {
      paymentStatus = "paid";
      paymentFlowStatus = "payment_completed";
    } else if (paymentIntent.status === "payment_failed") {
      paymentStatus = "failed";
      paymentFlowStatus = "payment_failed";
    }

    console.log("Payment verification completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentStatus,
        paymentFlowStatus,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment verification error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
