
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

    // Initialize Stripe with environment variable
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("Stripe is not configured");
      throw new Error("Stripe is not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      console.error("Payment Intent not found");
      throw new Error("Payment Intent not found");
    }

    console.log("Payment Intent status:", paymentIntent.status);

    // Create Supabase service client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update payment status based on payment intent status
    let paymentStatus = "pending";
    let paymentFlowStatus = "payment_pending";

    if (paymentIntent.status === "succeeded") {
      paymentStatus = "paid";
      paymentFlowStatus = "payment_completed";
    } else if (paymentIntent.status === "payment_failed") {
      paymentStatus = "failed";
      paymentFlowStatus = "payment_failed";
    }

    console.log("Updating order payment status:", { paymentStatus, paymentFlowStatus });

    // Update the order using our enhanced function
    const { error: updateError } = await supabase.rpc('update_order_payment_status', {
      p_order_id: paymentIntent.metadata?.orderId,
      p_payment_status: paymentStatus,
      p_stripe_session_id: paymentIntentId
    });

    if (updateError) {
      console.error("Failed to update order:", updateError);
      throw updateError;
    }

    // Create notification for successful payment
    if (paymentStatus === "paid") {
      console.log("Creating success notification");
      const { error: notificationError } = await supabase
        .from("order_notifications")
        .insert({
          order_id: paymentIntent.metadata?.orderId,
          user_id: paymentIntent.metadata?.userId,
          title: "Zahlung erfolgreich",
          message: "Ihre Zahlung wurde erfolgreich verarbeitet. Die Bearbeitung Ihrer Bilder beginnt nun.",
          type: "success",
          notification_type: "payment_success"
        });

      if (notificationError) {
        console.error("Failed to create notification:", notificationError);
      }
    }

    console.log("Payment verification completed successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentStatus,
        paymentFlowStatus
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
