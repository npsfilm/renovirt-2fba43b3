
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
    console.log("=== PAYMENT CREATION START ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    // Domain-Debugging für PayPal/Apple Pay/Google Pay
    const origin = req.headers.get("origin") || req.headers.get("referer");
    console.log("Request origin:", origin);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("User authentication failed:", userError);
      throw new Error("User not authenticated");
    }

    console.log("User authenticated:", user.id);

    const requestBody = await req.json();
    console.log("Request body:", requestBody);
    
    const { amount, orderId } = requestBody;

    if (!amount) {
      console.error("Missing required parameters - amount is required");
      throw new Error("Missing required parameters: amount");
    }

    console.log("Payment request validated:", { 
      orderId: orderId || 'temp-order', 
      amount,
      amountInCents: Math.round(amount * 100)
    });

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not configured");
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Stripe initialized successfully");

    const customers = await stripe.customers.list({ 
      email: user.email!, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.user_metadata?.first_name && user.user_metadata?.last_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
          : undefined,
        address: {
          country: 'DE', // Deutschland als Standardland für optimale Zahlungsmethoden
        },
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log("New customer created:", customerId);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      customer: customerId,
      metadata: {
        orderId: orderId || 'temp-order',
        userId: user.id,
      },
      // Nur automatic_payment_methods verwenden
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always', // Wichtig für PayPal, Klarna etc.
      },
      // Return URL für redirect payments (PayPal etc.)
      return_url: `${origin}/payment-success`,
      // Optimierte Einstellungen für deutsche/europäische Kunden
      payment_method_options: {
        klarna: {
          preferred_locale: 'de-DE',
        },
        sepa_debit: {
          mandate_options: {},
        },
      },
      // Verbesserte Rechnungsdetails für Klarna
      shipping: user.user_metadata?.address ? {
        address: {
          country: 'DE',
          line1: user.user_metadata.address || 'N/A',
          city: user.user_metadata.city || 'N/A',
          postal_code: user.user_metadata.postal_code || 'N/A',
        },
        name: user.user_metadata?.first_name && user.user_metadata?.last_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
          : user.email!,
      } : undefined,
    });

    console.log("Payment Intent created successfully:", {
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customerId: paymentIntent.customer
    });
    
    console.log("=== PAYMENT CREATION SUCCESS ===");

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        debug: {
          origin,
          allowedDomains: ['renovirt.lovable.app', 'app.renovirt.de', 'localhost'],
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("=== PAYMENT CREATION ERROR ===");
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: typeof error
    });
    
    // Stripe-spezifische Fehlerbehandlung
    if (error.type === 'StripeCardError') {
      console.error("Stripe Card Error:", error.code, error.param);
    } else if (error.type === 'StripeRateLimitError') {
      console.error("Stripe Rate Limit Error - too many requests");
    } else if (error.type === 'StripeInvalidRequestError') {
      console.error("Stripe Invalid Request Error:", error.param);
    } else if (error.type === 'StripeAPIError') {
      console.error("Stripe API Error - server side issue");
    } else if (error.type === 'StripeConnectionError') {
      console.error("Stripe Connection Error - network issue");
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.type || 'unknown',
          errorCode: error.code || 'none'
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
