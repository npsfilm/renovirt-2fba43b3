
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

    const estimatedDelivery = orderDetails.extras.includes('Express Bearbeitung') ? '24 Stunden' : '24–48 Stunden';
    
    const extrasHtml = orderDetails.extras.length > 0 
      ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #374151;">
            Gewählte Extras:
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827;">
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
      subject: `Bestellbestätigung – Auftrag ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bestellbestätigung Renovirt</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6; color: #111827;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  
                  <!-- Header Image Section -->
                  <tr>
                    <td style="padding: 0;">
                      <img src="https://ycslzlguhswgdpafqhab.supabase.co/storage/v1/object/public/renovirt-images/324e26b6-39d0-4343-8c60-c527cb277b11.png" alt="Bestellbestätigung" style="width: 100%; height: auto; display: block; max-height: 200px; object-fit: cover;">
                    </td>
                  </tr>

                  <!-- Header Section -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background-color: #ffffff;">
                      <div style="margin-bottom: 24px;">
                        <h1 style="color: #a7c957; font-size: 32px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.5px;">RENOVIRT</h1>
                        <p style="color: #6b7280; font-size: 16px; margin: 0; font-weight: 500;">Professionelle Bildbearbeitung für Immobilienfotos</p>
                      </div>
                      
                      <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); color: white; padding: 32px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px;">Vielen Dank für Ihre Bestellung!</h2>
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0;">Ihre Bestellung wurde erfolgreich eingegangen</p>
                      </div>
                      
                      <div style="background-color: #f3f4f6; border: 2px solid #a7c957; border-radius: 12px; padding: 20px; display: inline-block;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">Auftragsnummer</p>
                        <p style="margin: 4px 0 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: 1px;">${orderNumber}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Order Details Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; border: 1px solid #e5e7eb;">
                        <h3 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 24px; text-align: center; padding-bottom: 16px; border-bottom: 2px solid #a7c957;">Ihre Bestelldetails</h3>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 16px;">
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
                              Paket:
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 700;">
                              ${orderDetails.packageName}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
                              Foto-Typ:
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827;">
                              ${orderDetails.photoType}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">
                              Anzahl Bilder:
                            </td>
                            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827;">
                              ${orderDetails.imageCount}
                            </td>
                          </tr>
                          ${extrasHtml}
                          <tr>
                            <td style="padding: 20px 0 0; font-weight: 700; color: #111827; font-size: 18px;">
                              Gesamtpreis:
                            </td>
                            <td style="padding: 20px 0 0; text-align: right;">
                              <span style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 20px;">€${orderDetails.totalPrice.toFixed(2)}</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <!-- Process Timeline Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background: linear-gradient(135deg, #fff8e1 0%, #fffbf0 100%); border-radius: 12px; padding: 30px; border: 1px solid #f59e0b;">
                        <h3 style="color: #92400e; font-size: 20px; font-weight: 700; margin: 0 0 24px; text-align: center;">Bearbeitungsstatus</h3>
                        
                        <div style="margin-bottom: 24px;">
                          <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 16px; background-color: rgba(167, 201, 87, 0.1); border-radius: 8px; border-left: 4px solid #a7c957;">
                            <div style="width: 16px; height: 16px; background-color: #a7c957; border-radius: 50%; margin-right: 16px;"></div>
                            <span style="color: #2d5016; font-weight: 600;">✓ Zahlung eingegangen</span>
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 16px; background-color: rgba(245, 158, 11, 0.1); border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <div style="width: 16px; height: 16px; background-color: #f59e0b; border-radius: 50%; margin-right: 16px;"></div>
                            <span style="color: #92400e; font-weight: 600;">⏳ Professionelle Bearbeitung läuft</span>
                          </div>
                          <div style="display: flex; align-items: center; padding: 16px; background-color: rgba(156, 163, 175, 0.1); border-radius: 8px; border-left: 4px solid #9ca3af;">
                            <div style="width: 16px; height: 16px; background-color: #9ca3af; border-radius: 50%; margin-right: 16px;"></div>
                            <span style="color: #6b7280; font-weight: 600;">📧 Download-Link folgt per E-Mail</span>
                          </div>
                        </div>

                        <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 12px; padding: 24px; text-align: center;">
                          <p style="margin: 0; color: #ffffff; font-weight: 700; font-size: 18px;">
                            Voraussichtliche Fertigstellung: ${estimatedDelivery}
                          </p>
                          <p style="margin: 12px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                            Sie erhalten eine separate E-Mail mit dem Download-Link, sobald Ihre bearbeiteten Fotos bereit sind.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Features Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <h3 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 20px; text-align: center;">Das erwartet Sie</h3>
                      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div style="text-align: center; background-color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
                          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold;">✓</div>
                          <h4 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Professionelle Bearbeitung</h4>
                          <p style="color: #6b7280; font-size: 14px; margin: 0;">Von erfahrenen Foto-Editoren</p>
                        </div>
                        <div style="text-align: center; background-color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
                          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold;">🏠</div>
                          <h4 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Immobilien-Spezialist</h4>
                          <p style="color: #6b7280; font-size: 14px; margin: 0;">Optimiert für Makler & Architekten</p>
                        </div>
                        <div style="text-align: center; background-color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #e5e7eb;">
                          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold;">🔒</div>
                          <h4 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 8px;">DSGVO-konform</h4>
                          <p style="color: #6b7280; font-size: 14px; margin: 0;">Sichere Verarbeitung in Deutschland</p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Support Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #f0f9ff; border-radius: 12px; padding: 30px; text-align: center; border: 1px solid #0ea5e9;">
                        <h3 style="color: #0c4a6e; font-size: 20px; font-weight: 700; margin: 0 0 12px;">Fragen zu Ihrer Bestellung?</h3>
                        <p style="color: #0369a1; font-size: 16px; margin: 0 0 20px;">Unser Support-Team steht Ihnen gerne zur Verfügung.</p>
                        <a href="mailto:support@renovirt.de" style="display: inline-block; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          support@renovirt.de
                        </a>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <div style="margin-bottom: 20px;">
                        <h4 style="color: #a7c957; font-size: 24px; font-weight: 700; margin: 0 0 8px;">RENOVIRT</h4>
                        <p style="color: #6b7280; font-size: 16px; margin: 0; font-weight: 500;">Professionelle Bildbearbeitung für Immobilienfotos</p>
                      </div>
                      
                      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                          © 2024 Renovirt – Eine Marke der NPS Media GmbH
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                          Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese Nachricht.
                        </p>
                      </div>
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
