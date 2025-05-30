
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  orderDetails: {
    packageName: string;
    photoType: string;
    imageCount: number;
    totalPrice: number;
    extras: string[];
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, orderDetails }: OrderConfirmationRequest = await req.json();

    const estimatedDelivery = orderDetails.extras.includes('Express Processing') ? '24h' : '24–48h';
    
    const extrasHtml = orderDetails.extras.length > 0 
      ? `<p><strong>Gewählte Extras:</strong> ${orderDetails.extras.join(', ')}</p>`
      : '';

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured. Order details:", { orderId, customerEmail, orderDetails });
      return new Response(JSON.stringify({ 
        message: "E-Mail-Service nicht konfiguriert",
        orderId,
        orderDetails 
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // For development, use the verified email address
    const toEmail = customerEmail === "hello@npsfilm.de" ? customerEmail : "hello@npsfilm.de";
    
    const emailResponse = await resend.emails.send({
      from: "HDR Service <hello@npsfilm.de>",
      to: [toEmail],
      subject: `Bestellbestätigung - Bestellung ${orderId.slice(-6)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Vielen Dank für Ihre Bestellung!</h1>
            <p style="color: #666; font-size: 16px;">Wir haben Ihre Zahlung erhalten und starten sofort mit der Bearbeitung.</p>
            ${customerEmail !== "hello@npsfilm.de" ? `<p style="color: #888; font-size: 14px;"><em>Hinweis: Diese E-Mail wurde an ${customerEmail} gesendet (Entwicklungsmodus)</em></p>` : ''}
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Bestelldetails</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Bestellnummer:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderId.slice(-6)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Kunden-E-Mail:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Paket:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderDetails.packageName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Foto-Typ:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderDetails.photoType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Anzahl Bilder:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderDetails.imageCount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Gesamtpreis:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">€${orderDetails.totalPrice.toFixed(2)}</td>
              </tr>
            </table>
            ${extrasHtml}
          </div>

          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d5a3d; margin-bottom: 10px;">Nächste Schritte</h3>
            <ul style="color: #2d5a3d; margin: 0; padding-left: 20px;">
              <li>Ihre Bilder werden professionell bearbeitet</li>
              <li>Voraussichtliche Fertigstellung: ${estimatedDelivery}</li>
              <li>Sie erhalten einen Download-Link per E-Mail</li>
            </ul>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
            <p><strong>Ihr HDR Service Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
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
