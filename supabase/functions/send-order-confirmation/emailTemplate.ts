
import type { EmailTemplateData } from './types.ts';

export const generateEmailHTML = (data: EmailTemplateData): string => {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
    <meta charset="UTF-8">
    <title>Renovirt – Bestellbestätigung ${data.orderNumber}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>

    <body style="margin:0;padding:0;background:#FAFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E2B20;line-height:1.55;">

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAFAF7;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.06);overflow:hidden;">

            <!-- Title Image -->
            <tr>
              <td style="padding:0;text-align:center;">
                <img src="https://zjedwybadmqdcglhflbs.supabase.co/storage/v1/object/public/website-assets/9d9a5b47-d9c0-42ce-8cec-0e1efc95df5f.png" alt="Vielen Dank für Ihre Bestellung" style="width:100%;max-width:600px;height:auto;display:block;" />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background:#91A56E;padding:28px 30px;text-align:center;">
                <h1 style="margin:0;font-size:28px;font-weight:700;letter-spacing:1px;color:#FFFFFF;">RENOVIRT</h1>
                <p style="margin:6px 0 0;font-size:14px;font-weight:400;color:#F3EBD8;">Professionelle Bildbearbeitung für Immobilien</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:42px 32px;">

                <!-- Greeting -->
                <p style="margin:0 0 22px;font-size:16px;font-weight:500;">${data.customerGreeting},</p>

                <!-- Intro Copy -->
                <p style="margin:0 0 26px;font-size:16px;">
                  vielen Dank für Ihre Bestellung bei <strong>Renovirt</strong>.<br>
                  Ihre Bilder sind eingegangen und werden innerhalb von
                  <strong>${data.estimatedDelivery}</strong> für Sie bearbeitet.
                </p>

                <!-- Order Box -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAFAF7;border-left:4px solid #D1A760;border-radius:6px;">
                  <tr>
                    <td style="padding:24px 24px 6px;font-size:18px;font-weight:600;color:#1E2B20;">Ihre Bestelldetails</td>
                  </tr>
                  <tr><td style="padding:0 24px 18px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;">Bestellnummer</td>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;text-align:right;font-weight:600;">${data.orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;">Paket</td>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;text-align:right;">${data.orderDetails.packageName}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;">Foto-Typ</td>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;text-align:right;">${data.orderDetails.photoType}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;">Bildanzahl</td>
                        <td style="padding:8px 0;border-bottom:1px solid #E0E6D8;text-align:right;">${data.orderDetails.imageCount}</td>
                      </tr>
                      ${data.extrasHtml}
                      <tr>
                        <td style="padding:14px 0 0;font-weight:600;">Gesamtpreis</td>
                        <td style="padding:14px 0 0;text-align:right;">
                          <span style="display:inline-block;background:#D1A760;color:#FFFFFF;padding:6px 14px;border-radius:4px;font-weight:700;">
                            € ${data.orderDetails.totalPrice.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0 0;">Voraussichtliche Lieferung</td>
                        <td style="padding:8px 0 0;text-align:right;font-weight:600;">${data.estimatedDelivery}</td>
                      </tr>
                    </table>
                  </td></tr>
                </table>

                <!-- CTA -->
                <table width="100%" role="presentation" style="margin:34px 0;text-align:center;">
                  <tr>
                    <td>
                      <a href="https://renovirt.de/dashboard" style="background:#91A56E;color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:600;padding:14px 28px;border-radius:6px;display:inline-block;">
                        Zur Bestellübersicht
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Support box -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#E4EBD9;border-radius:6px;">
                  <tr>
                    <td style="padding:18px 24px;text-align:center;font-size:14px;">
                      <strong>Fragen zu Ihrer Bestellung?</strong><br>
                      Antworten Sie einfach auf diese E-Mail oder schreiben Sie an
                      <a href="mailto:info@renovirt.de" style="color:#1E2B20;text-decoration:underline;">info@renovirt.de</a>.
                    </td>
                  </tr>
                </table>

                <!-- Closing -->
                <p style="margin:26px 0 0;font-size:14px;text-align:center;">
                  Wir freuen uns darauf, Ihre Bilder zum Strahlen zu bringen.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#FAFAF7;padding:26px 30px;text-align:center;font-size:12px;color:#607160;">
                © ${data.currentYear} Renovirt – eine Marke der NPS Media GmbH<br>
                <a href="https://renovirt.de/datenschutz" style="color:#607160;text-decoration:none;">Datenschutz</a> • 
                <a href="https://renovirt.de/impressum" style="color:#607160;text-decoration:none;">Impressum</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

    </body>
    </html>
  `;
};
