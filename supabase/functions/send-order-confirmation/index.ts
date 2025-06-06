
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
    customerSalutation?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderNumber, customerEmail, orderDetails }: OrderConfirmationRequest = await req.json();

    const estimatedDelivery = orderDetails.extras.includes('Express Bearbeitung') ? '24 Stunden' : '48 Stunden';
    
    // Format customer greeting (proper German formal address)
    const getCustomerGreeting = () => {
      if (orderDetails.customerSalutation && orderDetails.customerLastName) {
        return `Sehr geehrte${orderDetails.customerSalutation === 'Frau' ? ' ' : 'r '}${orderDetails.customerSalutation} ${orderDetails.customerLastName}`;
      } else if (orderDetails.customerFirstName) {
        return `Sehr geehrte Damen und Herren`;
      }
      return 'Sehr geehrte Damen und Herren';
    };

    const customerGreeting = getCustomerGreeting();
    
    const extrasHtml = orderDetails.extras.length > 0 
      ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; font-weight: 500; color: #304D30;">
            Gewählte Extras:
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; text-align: right; color: #333333;">
            ${orderDetails.extras.join(', ')}
          </td>
        </tr>
      `
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

    const emailResponse = await resend.emails.send({
      from: "Renovirt <info@renovirt.de>",
      to: [customerEmail],
      subject: `✅ Ihre Bilder sind in Bearbeitung – Bestellung ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bestellbestätigung Renovirt</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
          
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background-color: #304D30; padding: 30px; text-align: center;">
                      <h1 style="color: #D1A760; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 1px;">RENOVIRT</h1>
                      <p style="color: #ffffff; font-size: 14px; margin: 8px 0 0; opacity: 0.9;">Professionelle Bildbearbeitung für Immobilien</p>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <!-- Greeting -->
                      <p style="color: #304D30; font-size: 16px; margin: 0 0 20px; font-weight: 500;">
                        ${customerGreeting},
                      </p>
                      
                      <!-- Main Message -->
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 25px;">
                        vielen Dank für Ihre Bestellung bei <strong>Renovirt</strong>!<br>
                        Ihre Bilder sind nun bei uns eingegangen und werden innerhalb von <strong>${estimatedDelivery}</strong> professionell bearbeitet.
                      </p>

                      <!-- Order Details Box -->
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #D1A760;">
                        <h3 style="color: #304D30; font-size: 18px; font-weight: 600; margin: 0 0 20px;">Ihre Bestelldetails</h3>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; font-weight: 500; color: #304D30;">
                              📁 Bestellnummer:
                            </td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; text-align: right; color: #333333; font-weight: 600;">
                              ${orderNumber}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; font-weight: 500; color: #304D30;">
                              📦 Paket:
                            </td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; text-align: right; color: #333333;">
                              ${orderDetails.packageName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; font-weight: 500; color: #304D30;">
                              📸 Foto-Typ:
                            </td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; text-align: right; color: #333333;">
                              ${orderDetails.photoType}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; font-weight: 500; color: #304D30;">
                              🖼️ Anzahl Bilder:
                            </td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #E5E5E5; text-align: right; color: #333333;">
                              ${orderDetails.imageCount}
                            </td>
                          </tr>
                          ${extrasHtml}
                          <tr>
                            <td style="padding: 15px 0 0; font-weight: 600; color: #304D30; font-size: 16px;">
                              💰 Gesamtpreis:
                            </td>
                            <td style="padding: 15px 0 0; text-align: right;">
                              <span style="background-color: #D1A760; color: white; padding: 8px 16px; border-radius: 4px; font-weight: 600; font-size: 16px;">€${orderDetails.totalPrice.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0 0; font-weight: 500; color: #304D30;">
                              ⏳ Voraussichtliche Lieferung:
                            </td>
                            <td style="padding: 8px 0 0; text-align: right; color: #333333; font-weight: 600;">
                              ${estimatedDelivery}
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Call to Action -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://renovirt.de/dashboard" style="background-color: #D1A760; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                          Zur Bestellübersicht
                        </a>
                      </div>

                      <!-- Support Information -->
                      <div style="background-color: #E4EBD9; border-radius: 6px; padding: 20px; margin: 25px 0;">
                        <p style="color: #304D30; font-size: 14px; margin: 0; text-align: center;">
                          <strong>Fragen zu Ihrer Bestellung?</strong><br>
                          Antworten Sie einfach auf diese E-Mail oder schreiben Sie an <a href="mailto:info@renovirt.de" style="color: #304D30; text-decoration: underline;">info@renovirt.de</a>
                        </p>
                      </div>

                      <!-- Closing -->
                      <p style="color: #333333; font-size: 14px; margin: 25px 0 0; text-align: center;">
                        Wir freuen uns darauf, Ihre Bilder zum Strahlen zu bringen! ✨
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #E4EBD9; padding: 25px 30px; text-align: center;">
                      <p style="color: #304D30; font-size: 12px; margin: 0 0 8px;">
                        © ${new Date().getFullYear()} Renovirt – Eine Marke der NPS Media GmbH
                      </p>
                      <p style="color: #304D30; font-size: 12px; margin: 0;">
                        <a href="https://renovirt.de/datenschutz" style="color: #304D30; text-decoration: none;">Datenschutz</a> • 
                        <a href="https://renovirt.de/impressum" style="color: #304D30; text-decoration: none;">Impressum</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Professionelle Bestellbestätigung E-Mail erfolgreich gesendet:", emailResponse);

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
