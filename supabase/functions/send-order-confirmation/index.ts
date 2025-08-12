
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { EmailService } from './emailService.ts';
import { corsHeaders } from './utils.ts';
import type { OrderConfirmationRequest } from './types.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentifizierung prüfen (JWT erforderlich)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderNumber, customerEmail, orderDetails }: OrderConfirmationRequest = await req.json();

    // Log incoming request for debugging
    console.log('Received order confirmation request:', {
      orderNumber,
      customerEmail,
      hasOrderDetails: !!orderDetails,
      orderDetailsKeys: orderDetails ? Object.keys(orderDetails) : []
    });

    // Validate request data
    if (!orderNumber || !customerEmail || !orderDetails) {
      const errorMsg = 'Missing required fields in request';
      console.error(errorMsg, { orderNumber, customerEmail, hasOrderDetails: !!orderDetails });
      return new Response(JSON.stringify({ 
        error: errorMsg,
        received: { orderNumber, customerEmail, hasOrderDetails: !!orderDetails }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Check if RESEND_API_KEY is configured
    const configCheck = EmailService.checkConfiguration();
    if (!configCheck.success) {
      console.log("RESEND_API_KEY nicht konfiguriert. Bestelldetails:", { orderNumber, customerEmail, orderDetails });
      return new Response(JSON.stringify({ 
        message: configCheck.message,
        orderNumber,
        orderDetails 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const emailService = new EmailService();
    const emailResponse = await emailService.sendOrderConfirmation(orderNumber, customerEmail, orderDetails);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Fehler in der send-order-confirmation Funktion:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
