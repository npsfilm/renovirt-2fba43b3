import { formatCurrency } from './utils.ts';
import type { AdminEmailTemplateData } from './types.ts';

export const generateAdminEmailHTML = (data: AdminEmailTemplateData): string => {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Bestellung - ${data.orderNumber}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffffff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;background:#1E2B20;border-radius:8px 8px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">
                      🔔 Neue Bestellung eingegangen
                    </h1>
                    <p style="margin:8px 0 0;color:#E4EBD9;font-size:16px;">
                      Auftrag ${data.orderNumber} • ${data.orderDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">
              
              <!-- Customer Info -->
              <div style="margin-bottom:32px;">
                <h2 style="margin:0 0 16px;color:#1E2B20;font-size:18px;font-weight:600;">
                  👤 Kundeninformationen
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc;border-radius:6px;padding:16px;">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">Name:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.customerName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">E-Mail:</strong>
                      <a href="mailto:${data.customerEmail}" style="color:#2563eb;margin-left:12px;text-decoration:none;">${data.customerEmail}</a>
                    </td>
                  </tr>
                  ${data.customerCompany ? `
                  <tr>
                    <td style="padding:8px 0;">
                      <strong style="color:#374151;">Unternehmen:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.customerCompany}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Order Details -->
              <div style="margin-bottom:32px;">
                <h2 style="margin:0 0 16px;color:#1E2B20;font-size:18px;font-weight:600;">
                  📦 Bestelldetails
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc;border-radius:6px;padding:16px;">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">Paket:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.packageName}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">Bildtyp:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.photoType}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">Anzahl Bilder:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.imageCount}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <strong style="color:#374151;">Gesamtpreis:</strong>
                      <span style="color:#059669;font-weight:600;margin-left:12px;font-size:18px;">${formatCurrency(data.totalPrice)}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Extras -->
              <div style="margin-bottom:32px;">
                <h2 style="margin:0 0 16px;color:#1E2B20;font-size:18px;font-weight:600;">
                  ⭐ Zusatzleistungen
                </h2>
                <div style="background:#f8fafc;border-radius:6px;padding:16px;">
                  ${data.extrasHtml}
                </div>
              </div>

              <!-- Payment Info -->
              <div style="margin-bottom:32px;">
                <h2 style="margin:0 0 16px;color:#1E2B20;font-size:18px;font-weight:600;">
                  💳 Zahlungsinformationen
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc;border-radius:6px;padding:16px;">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#374151;">Zahlungsart:</strong>
                      <span style="color:#1f2937;margin-left:12px;">${data.paymentMethod}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <strong style="color:#374151;">Status:</strong>
                      <span style="color:${data.paymentStatus === 'Bezahlt' ? '#059669' : '#d97706'};font-weight:600;margin-left:12px;">${data.paymentStatus}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Special Requests -->
              <div style="margin-bottom:32px;">
                <h2 style="margin:0 0 16px;color:#1E2B20;font-size:18px;font-weight:600;">
                  📝 Besondere Wünsche
                </h2>
                <div style="background:#f8fafc;border-radius:6px;padding:16px;">
                  ${data.specialRequestsHtml}
                </div>
              </div>

              <!-- Action Buttons -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${data.adminPanelUrl}" 
                   style="display:inline-block;background:#1E2B20;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-right:16px;">
                  🔧 Zur Admin-Oberfläche
                </a>
                <a href="mailto:${data.customerEmail}?subject=Re: Bestellung ${data.orderNumber}" 
                   style="display:inline-block;background:#E4EBD9;color:#1E2B20;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
                  ✉️ Kunde kontaktieren
                </a>
              </div>

              <!-- Alert Box -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#FEF3C7;border-radius:6px;border-left:4px solid #F59E0B;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0;color:#92400E;font-weight:600;">
                      ⚡ Sofortige Aktion erforderlich
                    </p>
                    <p style="margin:8px 0 0;color:#92400E;font-size:14px;">
                      Neue Bestellung eingegangen. Bitte überprüfen Sie die Details und beginnen Sie mit der Bearbeitung.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#f8fafc;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;">
                Diese E-Mail wurde automatisch generiert • Renovirt Admin System © ${data.currentYear}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};