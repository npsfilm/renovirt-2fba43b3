
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
          <td style="padding: 12px 0; border-bottom: 1px solid #e8f5e8;">
            <span style="color: #2d5016; font-weight: 500;">Gewählte Extras:</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e8f5e8; text-align: right; color: #1a1a1a;">
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
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); line-height: 1.6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden;">
                  
                  <!-- Header Image Section -->
                  <tr>
                    <td style="padding: 0;">
                      <img src="https://ycslzlguhswgdpafqhab.supabase.co/storage/v1/object/public/renovirt-images/324e26b6-39d0-4343-8c60-c527cb277b11.png" alt="Ihre Bestellung ist eingegangen" style="width: 100%; height: auto; display: block; border-radius: 24px 24px 0 0;">
                    </td>
                  </tr>

                  <!-- Welcome Section -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background-color: #ffffff;">
                      <div style="margin-bottom: 24px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); padding: 16px 32px; border-radius: 50px; margin-bottom: 20px;">
                          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.025em;">RENOVIRT</h1>
                        </div>
                      </div>
                      
                      <div style="display: inline-block; background: linear-gradient(135deg, #f0f8ff 0%, #e8f4fd 100%); padding: 24px; border-radius: 20px; border: 2px solid #a7c957; margin-bottom: 20px;">
                        <div style="font-size: 48px; margin-bottom: 12px;">😊</div>
                        <h2 style="color: #2d5016; font-size: 28px; font-weight: 700; margin: 0 0 12px; line-height: 1.2;">Vielen Dank!</h2>
                        <p style="color: #4a5a2a; font-size: 18px; margin: 0; font-weight: 500;">Ihre Bestellung ist eingegangen</p>
                      </div>
                      
                      <p style="color: #6b7280; font-size: 16px; margin: 0; line-height: 1.5;">In 48h erhalten Sie Ihre professionell bearbeiteten Bilder.</p>
                    </td>
                  </tr>

                  <!-- Order Number Highlight -->
                  <tr>
                    <td style="padding: 0 40px 30px; text-align: center;">
                      <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 20px; padding: 20px; display: inline-block;">
                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500; opacity: 0.9;">Auftragsnummer</p>
                        <p style="margin: 4px 0 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1px;">${orderNumber}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Order Details Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background: linear-gradient(135deg, #f8fdf4 0%, #f0f8e8 100%); border-radius: 20px; border: 2px solid #e8f5e8; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); padding: 20px; text-align: center;">
                          <h3 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0;">Ihre Bestelldetails</h3>
                        </div>
                        <div style="padding: 30px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8;">
                                <div style="display: flex; align-items: center;">
                                  <div style="font-size: 24px; margin-right: 12px;">📦</div>
                                  <div>
                                    <span style="color: #2d5016; font-weight: 600; font-size: 16px;">Paket</span>
                                  </div>
                                </div>
                              </td>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8; text-align: right;">
                                <span style="color: #1a1a1a; font-weight: 700; font-size: 16px;">${orderDetails.packageName}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8;">
                                <div style="display: flex; align-items: center;">
                                  <div style="font-size: 24px; margin-right: 12px;">📸</div>
                                  <div>
                                    <span style="color: #2d5016; font-weight: 600; font-size: 16px;">Foto-Typ</span>
                                  </div>
                                </div>
                              </td>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8; text-align: right;">
                                <span style="color: #1a1a1a; font-weight: 600; font-size: 16px;">${orderDetails.photoType}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8;">
                                <div style="display: flex; align-items: center;">
                                  <div style="font-size: 24px; margin-right: 12px;">🔢</div>
                                  <div>
                                    <span style="color: #2d5016; font-weight: 600; font-size: 16px;">Anzahl Bilder</span>
                                  </div>
                                </div>
                              </td>
                              <td style="padding: 16px 0; border-bottom: 2px solid #e8f5e8; text-align: right;">
                                <span style="color: #1a1a1a; font-weight: 600; font-size: 16px;">${orderDetails.imageCount}</span>
                              </td>
                            </tr>
                            ${extrasHtml}
                            <tr>
                              <td style="padding: 20px 0 0;">
                                <div style="display: flex; align-items: center;">
                                  <div style="font-size: 24px; margin-right: 12px;">💰</div>
                                  <div>
                                    <span style="color: #2d5016; font-weight: 700; font-size: 18px;">Gesamtpreis</span>
                                  </div>
                                </div>
                              </td>
                              <td style="padding: 20px 0 0; text-align: right;">
                                <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); color: white; padding: 12px 20px; border-radius: 50px; display: inline-block;">
                                  <span style="font-weight: 700; font-size: 20px;">€${orderDetails.totalPrice.toFixed(2)}</span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Process Timeline Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background: linear-gradient(135deg, #fff8e1 0%, #fffbf0 100%); border-radius: 20px; padding: 30px; border: 2px solid #f0d000;">
                        <div style="text-align: center; margin-bottom: 24px;">
                          <div style="font-size: 32px; margin-bottom: 12px;">⏱️</div>
                          <h3 style="color: #8b6914; font-size: 22px; font-weight: 700; margin: 0;">Ihre Bestellung wird bearbeitet</h3>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                          <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 12px; background-color: rgba(167, 201, 87, 0.1); border-radius: 12px;">
                            <span style="display: inline-block; width: 16px; height: 16px; background-color: #a7c957; border-radius: 50%; margin-right: 16px;"></span>
                            <span style="color: #2d5016; font-weight: 600; font-size: 16px;">Zahlung eingegangen ✓</span>
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 12px; background-color: rgba(255, 193, 7, 0.1); border-radius: 12px;">
                            <span style="display: inline-block; width: 16px; height: 16px; background-color: #ffc107; border-radius: 50%; margin-right: 16px;"></span>
                            <span style="color: #8b6914; font-weight: 600; font-size: 16px;">Professionelle Bearbeitung läuft 🎨</span>
                          </div>
                          <div style="display: flex; align-items: center; padding: 12px; background-color: rgba(156, 163, 175, 0.1); border-radius: 12px;">
                            <span style="display: inline-block; width: 16px; height: 16px; background-color: #9ca3af; border-radius: 50%; margin-right: 16px;"></span>
                            <span style="color: #6b7280; font-weight: 600; font-size: 16px;">Download-Link folgt per E-Mail 📧</span>
                          </div>
                        </div>

                        <div style="background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); border-radius: 16px; padding: 24px; text-align: center;">
                          <div style="font-size: 24px; margin-bottom: 8px;">⏰</div>
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
                      <h3 style="color: #2d5016; font-size: 20px; font-weight: 700; margin: 0 0 20px; text-align: center;">Das erwartet Sie</h3>
                      <div style="display: flex; justify-content: space-between; gap: 16px;">
                        <div style="flex: 1; text-align: center; background: linear-gradient(135deg, #f8fdf4 0%, #f0f8e8 100%); padding: 24px; border-radius: 16px; border: 2px solid #e8f5e8;">
                          <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
                          <h4 style="color: #2d5016; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Professionelle Bearbeitung</h4>
                          <p style="color: #4a5a2a; font-size: 13px; margin: 0;">Von erfahrenen Foto-Editoren</p>
                        </div>
                        <div style="flex: 1; text-align: center; background: linear-gradient(135deg, #f8fdf4 0%, #f0f8e8 100%); padding: 24px; border-radius: 16px; border: 2px solid #e8f5e8;">
                          <div style="font-size: 32px; margin-bottom: 12px;">🏠</div>
                          <h4 style="color: #2d5016; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Immobilien-Spezialist</h4>
                          <p style="color: #4a5a2a; font-size: 13px; margin: 0;">Optimiert für Makler & Architekten</p>
                        </div>
                        <div style="flex: 1; text-align: center; background: linear-gradient(135deg, #f8fdf4 0%, #f0f8e8 100%); padding: 24px; border-radius: 16px; border: 2px solid #e8f5e8;">
                          <div style="font-size: 32px; margin-bottom: 12px;">🔒</div>
                          <h4 style="color: #2d5016; font-size: 16px; font-weight: 700; margin: 0 0 8px;">DSGVO-konform</h4>
                          <p style="color: #4a5a2a; font-size: 13px; margin: 0;">Sichere Verarbeitung in Deutschland</p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Support Section -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <div style="background: linear-gradient(135deg, #f1f8ff 0%, #e6f2ff 100%); border-radius: 20px; padding: 30px; text-align: center; border: 2px solid #bdd7f7;">
                        <div style="font-size: 28px; margin-bottom: 16px;">💬</div>
                        <h3 style="color: #1e3a8a; font-size: 20px; font-weight: 700; margin: 0 0 12px;">Fragen zu Ihrer Bestellung?</h3>
                        <p style="color: #1e40af; font-size: 16px; margin: 0 0 20px; font-weight: 500;">Unser Support-Team steht Ihnen gerne zur Verfügung.</p>
                        <div style="display: inline-block; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          <a href="mailto:support@renovirt.de" style="color: white; text-decoration: none;">support@renovirt.de</a>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f8fdf4 0%, #f0f8e8 100%); padding: 30px 40px; text-align: center; border-top: 2px solid #e8f5e8;">
                      <div style="margin-bottom: 20px;">
                        <div style="display: inline-block; background: linear-gradient(135deg, #a7c957 0%, #8fb339 100%); padding: 12px 24px; border-radius: 50px; margin-bottom: 12px;">
                          <h4 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0;">RENOVIRT</h4>
                        </div>
                        <p style="color: #2d5016; font-size: 16px; margin: 0; font-weight: 600;">Professionelle Bildbearbeitung für Immobilienfotos</p>
                      </div>
                      
                      <div style="border-top: 1px solid #d1fae5; padding-top: 20px;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">
                          © 2024 Renovirt – Eine Marke der NPS Media GmbH
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
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
