
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderNumber: string;
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
    const { orderNumber, customerEmail, orderDetails }: OrderConfirmationRequest = await req.json();

    const estimatedDelivery = orderDetails.extras.includes('Express Bearbeitung') ? '24h' : '24–48h';
    
    const extrasHtml = orderDetails.extras.length > 0 
      ? `<p><strong>Gewählte Extras:</strong> ${orderDetails.extras.join(', ')}</p>`
      : '';

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.log("RESEND_API_KEY nicht konfiguriert. Bestelldetails:", { orderNumber, customerEmail, orderDetails });
      return new Response(JSON.stringify({ 
        message: "E-Mail-Service nicht konfiguriert",
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

    // Use info@renovirt.de as sender
    const emailResponse = await resend.emails.send({
      from: "Renovirt <info@renovirt.de>",
      to: [customerEmail],
      subject: `Bestellbestätigung - Bestellung ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Vielen Dank für Ihre Bestellung!</h1>
            <p style="color: #666; font-size: 16px;">Wir haben Ihre Zahlung erhalten und starten sofort mit der Bearbeitung.</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Bestelldetails</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Bestellnummer:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderNumber}</td>
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
            <p><strong>Ihr Renovirt Team</strong></p>
            <p style="color: #999; font-size: 12px;">Renovirt - Eine Marke der NPS Media GmbH</p>
          </div>
        </div>
      `,
    });

    console.log("Bestellbestätigung E-Mail erfolgreich gesendet:", emailResponse);

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
