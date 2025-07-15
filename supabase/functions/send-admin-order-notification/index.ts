import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { EmailService } from './emailService.ts';
import { corsHeaders } from './utils.ts';
import type { AdminOrderNotificationRequest } from './types.ts';

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderNumber, orderDetails, customerDetails, paymentDetails }: AdminOrderNotificationRequest = await req.json();

    console.log("Admin notification request received:", { orderNumber, customerDetails });

    // Check if RESEND_API_KEY is configured
    const configCheck = EmailService.checkConfiguration();
    if (!configCheck.success) {
      console.log("RESEND_API_KEY nicht konfiguriert. Admin-Benachrichtigung für Bestellung:", { orderNumber, orderDetails });
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
    const emailResponse = await emailService.sendAdminOrderNotification(
      orderNumber, 
      orderDetails, 
      customerDetails,
      paymentDetails
    );

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Fehler in der send-admin-order-notification Funktion:", error);
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