
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Test order data
    const testOrderData = {
      orderNumber: "TEST-2024-001",
      customerEmail: "hello@npsfilm.de",
      orderDetails: {
        packageName: "Premium Paket",
        photoType: "Kamera",
        imageCount: 15,
        totalPrice: 149.99,
        extras: ["Express Bearbeitung", "HDR Enhancement"]
      }
    };

    const estimatedDelivery = testOrderData.orderDetails.extras.includes('Express Bearbeitung') ? '24 Stunden' : '24–48 Stunden';
    
    const extrasHtml = testOrderData.orderDetails.extras.length > 0 
      ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #374151; font-weight: 500;">Gewählte Extras:</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">
            ${testOrderData.orderDetails.extras.join(', ')}
          </td>
        </tr>
      `
      : '';

    const emailResponse = await resend.emails.send({
      from: "Renovirt <info@renovirt.de>",
      to: [testOrderData.customerEmail],
      subject: `TEST - Bestellbestätigung – Auftrag ${testOrderData.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bestellbestätigung Renovirt</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  
                  <!-- Header Section -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 40px 30px; text-align: center;">
                      <div style="background-color: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.025em;">RENOVIRT</h1>
                      </div>
                      <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0; opacity: 0.95;">Vielen Dank für Ihre Bestellung!</h2>
                      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 8px 0 0; font-weight: 400;">Wir haben Ihre Zahlung erhalten und beginnen sofort mit der professionellen Bearbeitung Ihrer Immobilienfotos.</p>
                      <div style="background-color: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; margin-top: 16px; font-size: 14px; font-weight: 600;">
                        🧪 TEST E-MAIL
                      </div>
                    </td>
                  </tr>

                  <!-- Success Icon Section -->
                  <tr>
                    <td style="padding: 30px 40px 20px; text-align: center;">
                      <div style="display: inline-block; width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; font-weight: bold;">✓</div>
                      </div>
                      <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 16px 0 8px;">Bestellung erfolgreich eingegangen</h3>
                      <p style="color: #6b7280; font-size: 14px; margin: 0;">Auftragsnummer: <strong style="color: #1f2937;">${testOrderData.orderNumber}</strong></p>
                    </td>
                  </tr>

                  <!-- Order Details Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
                        <div style="background-color: #ffffff; padding: 20px; border-bottom: 1px solid #e5e7eb;">
                          <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px;">Ihre Bestelldetails</h3>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                <span style="color: #374151; font-weight: 500;">Paket:</span>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: 600;">
                                ${testOrderData.orderDetails.packageName}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                <span style="color: #374151; font-weight: 500;">Foto-Typ:</span>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">
                                ${testOrderData.orderDetails.photoType}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                <span style="color: #374151; font-weight: 500;">Anzahl Bilder:</span>
                              </td>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937;">
                                ${testOrderData.orderDetails.imageCount}
                              </td>
                            </tr>
                            ${extrasHtml}
                            <tr>
                              <td style="padding: 16px 0 0;">
                                <span style="color: #1f2937; font-weight: 600; font-size: 16px;">Gesamtpreis:</span>
                              </td>
                              <td style="padding: 16px 0 0; text-align: right;">
                                <span style="color: #1f2937; font-weight: 700; font-size: 18px;">€${testOrderData.orderDetails.totalPrice.toFixed(2)}</span>
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
                      <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border-radius: 8px; padding: 24px; border: 1px solid #d1fae5;">
                        <h3 style="color: #065f46; font-size: 18px; font-weight: 600; margin: 0 0 20px; display: flex; align-items: center;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #10b981; border-radius: 50%; margin-right: 12px; text-align: center; line-height: 24px; color: white; font-size: 12px;">⏱</span>
                          Ihre Bestellung wird jetzt bearbeitet
                        </h3>
                        
                        <div style="margin-bottom: 16px;">
                          <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="display: inline-block; width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="color: #065f46; font-weight: 500;">Zahlung eingegangen ✓</span>
                          </div>
                          <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="display: inline-block; width: 8px; height: 8px; background-color: #fbbf24; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="color: #065f46; font-weight: 500;">Professionelle Bearbeitung läuft</span>
                          </div>
                          <div style="display: flex; align-items: center;">
                            <span style="display: inline-block; width: 8px; height: 8px; background-color: #d1d5db; border-radius: 50%; margin-right: 12px;"></span>
                            <span style="color: #065f46; font-weight: 500;">Download-Link folgt per E-Mail</span>
                          </div>
                        </div>

                        <div style="background-color: rgba(16, 185, 129, 0.1); border-radius: 6px; padding: 16px; border-left: 4px solid #10b981;">
                          <p style="margin: 0; color: #065f46; font-weight: 600;">
                            ⏰ Voraussichtliche Fertigstellung: ${estimatedDelivery}
                          </p>
                          <p style="margin: 8px 0 0; color: #047857; font-size: 14px;">
                            Sie erhalten eine separate E-Mail mit dem Download-Link, sobald Ihre bearbeiteten Fotos bereit sind.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Features Section -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 16px; text-align: center;">Das erwartet Sie</h3>
                      <div style="display: flex; justify-content: space-between; gap: 16px;">
                        <div style="flex: 1; text-align: center; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🎨</div>
                          <h4 style="color: #1f2937; font-size: 14px; font-weight: 600; margin: 0 0 4px;">Professionelle Bearbeitung</h4>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Von erfahrenen Foto-Editoren</p>
                        </div>
                        <div style="flex: 1; text-align: center; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🏠</div>
                          <h4 style="color: #1f2937; font-size: 14px; font-weight: 600; margin: 0 0 4px;">Immobilien-Spezialist</h4>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Optimiert für Makler & Architekten</p>
                        </div>
                        <div style="flex: 1; text-align: center; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                          <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
                          <h4 style="color: #1f2937; font-size: 14px; font-weight: 600; margin: 0 0 4px;">DSGVO-konform</h4>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Sichere Verarbeitung in Deutschland</p>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Support Section -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; text-align: center; border: 1px solid #e2e8f0;">
                        <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px;">Fragen zu Ihrer Bestellung?</h3>
                        <p style="color: #475569; font-size: 14px; margin: 0 0 16px;">Unser Support-Team steht Ihnen gerne zur Verfügung.</p>
                        <div style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                          <a href="mailto:support@renovirt.de" style="color: white; text-decoration: none;">support@renovirt.de</a>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <div style="margin-bottom: 16px;">
                        <h4 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 8px;">RENOVIRT</h4>
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">Professionelle Bildbearbeitung für Immobilienfotos</p>
                      </div>
                      
                      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
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

    console.log("Test E-Mail erfolgreich gesendet:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: "Test-E-Mail wurde an hello@npsfilm.de gesendet",
      emailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Senden der Test-E-Mail:", error);
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
