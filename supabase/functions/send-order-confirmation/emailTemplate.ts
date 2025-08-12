
import type { EmailTemplateData } from './types.ts';

export const generateEmailHTML = (data: EmailTemplateData): string => {
  // Dynamische Labels für die Timeline
  const etaShort = data.estimatedDelivery.replace('Stunden', 'Std.');
  const receivedLabel = 'heute';
  const processingLabel = `bis ${etaShort}`;
  const deliveryLabel = `spätestens in ${etaShort}`;

  // Euro-Formatierung
  const formatEuro = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
      value || 0
    );

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Renovirt – Bestellbestätigung ${data.orderNumber}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    /* E-Mail Reset */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; height:auto; line-height:100%; }
    table { border-collapse:collapse !important; }
    body { margin:0 !important; padding:0 !important; width:100% !important; background:#FAFAF7; }
    /* Utilities */
    .container { width:100%; max-width:600px; background:#FFFFFF; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,.06); overflow:hidden; }
    .px { padding-left:32px; padding-right:32px; }
    .btn { display:inline-block; padding:14px 26px; border-radius:8px; background:#91A56E; color:#fff !important; text-decoration:none; font-weight:700; }
    .subtle { color:#607160; }
    .muted { color:#1E2B20; opacity:.8; }
    .divider { height:1px; background:#E0E6D8; }
    .tag { display:inline-block; background:#D1A760; color:#fff; padding:6px 10px; border-radius:4px; font-weight:700; }
    /* Progress tracker */
    .track-wrap { position:relative; padding:24px 18px; background:#FAFAF7; border:1px solid #E0E6D8; border-radius:10px; }
    .track-line { position:relative; height:4px; background:#E0E6D8; margin:18px 18px; border-radius:4px; }
    .track-line .fill { position:absolute; top:0; left:0; height:4px; width:50%; background:#91A56E; border-radius:4px; }
    .dot { width:22px; height:22px; border-radius:50%; background:#E0E6D8; border:2px solid #E0E6D8; display:flex; align-items:center; justify-content:center; }
    .dot svg { display:block; }
    .dot.active { background:#91A56E; border-color:#91A56E; }
    .step { font-size:13px; color:#1E2B20; text-align:center; }
    .step small { display:block; color:#607160; margin-top:4px; }
    /* Cards */
    .card { background:#FAFAF7; border-left:4px solid #D1A760; border-radius:8px; }
    .shop { background:#FAFAF7; border-radius:10px; }
    /* Mobile */
    @media screen and (max-width:600px){
      .px { padding-left:20px !important; padding-right:20px !important; }
    }
  </style>
</head>
<body style="font-family: Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px 30px; background: linear-gradient(135deg, #5C7040, #91A56E);">
              <h1 style="margin:0; font-size:28px; letter-spacing:1px; color:#FFFFFF;">RENOVIRT</h1>
              <p style="margin:8px 0 0; font-size:14px; color:#F3EBD8;">Professionelle Bildbearbeitung für Immobilien</p>
            </td>
          </tr>

          <!-- Hero confirm -->
          <tr>
            <td class="px" style="padding-top:34px;">
              <h2 style="margin:0 0 6px; font-size:22px; color:#1E2B20;">Danke! Ihre Bestellung ist bestätigt.</h2>
              <p class="muted" style="margin:0 0 18px; font-size:15px;">
                Wir starten jetzt mit der Bearbeitung. Sie erhalten eine E-Mail, sobald Ihre Dateien fertig sind.
              </p>
            </td>
          </tr>

          <!-- Progress tracker -->
          <tr>
            <td class="px">
              <div class="track-wrap">
                <table width="100%" role="presentation">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%">
                        <tr>
                          <td align="left" width="33%">
                            <div class="dot active">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E2B20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            </div>
                          </td>
                          <td align="center" width="33%">
                            <div class="dot active">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E2B20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="8"/>
                                <circle cx="12" cy="12" r="2"/>
                              </svg>
                            </div>
                          </td>
                          <td align="right" width="33%">
                            <div class="dot">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E2B20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="9"/>
                                <path d="M12 7v5l3 3"/>
                              </svg>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <div class="track-line">
                        <div class="fill"></div>
                      </div>
                      <table role="presentation" width="100%">
                        <tr>
                          <td class="step" align="left" width="33%">
                            Eingegangen
                            <small>${receivedLabel}</small>
                          </td>
                          <td class="step" align="center" width="33%">
                            In Bearbeitung
                            <small>${processingLabel}</small>
                          </td>
                          <td class="step" align="right" width="33%">
                            Voraussichtliche Lieferung
                            <small>${deliveryLabel}</small>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" class="px" style="padding:22px 0 8px;">
              <a href="https://renovirt.de/dashboard" target="_blank" class="btn">Bestellung ansehen</a>
            </td>
          </tr>

          <!-- Order details -->
          <tr>
            <td class="px" style="padding-top:24px; padding-bottom:6px;">
              <h3 style="margin:0 0 6px; font-size:18px; color:#1E2B20;">Bestelldetails</h3>
              <p class="subtle" style="margin:0 0 14px; font-size:13px;">Bestätigung: ${data.orderNumber}</p>
              <div class="card" style="padding:22px;">
                <table role="presentation" width="100%" style="font-size:14px; color:#1E2B20;">
                  <tr>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;">Paket</td>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;" align="right">${data.orderDetails.packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;">Foto-Typ</td>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;" align="right">${data.orderDetails.photoType}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;">Bildanzahl</td>
                    <td style="padding:8px 0; border-bottom:1px solid #E0E6D8;" align="right">${data.orderDetails.imageCount}</td>
                  </tr>
                  ${data.extrasHtml}
                  <tr>
                    <td style="padding:12px 0; font-weight:700;">Gesamtpreis</td>
                    <td style="padding:12px 0;" align="right"><span class="tag">${formatEuro(data.orderDetails.totalPrice)}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">Voraussichtliche Lieferung</td>
                    <td style="padding:4px 0;" align="right">innerhalb von ${data.estimatedDelivery}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Payment & summary block (Etsy-ähnlich) -->
          <tr>
            <td class="px" style="padding-top:12px;">
              <table role="presentation" width="100%" style="font-size:14px; color:#1E2B20;">
                <tr>
                  <td width="50%" valign="top" style="padding-right:14px;">
                    <h4 style="margin:0 0 10px; font-size:16px; color:#1E2B20;">Rechnungsdetails</h4>
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="padding:6px 0;">Zwischensumme</td>
                        <td style="padding:6px 0;" align="right">—</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">Umsatzsteuer</td>
                        <td style="padding:6px 0;" align="right">—</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">Service/Transfer</td>
                        <td style="padding:6px 0;" align="right">—</td>
                      </tr>
                      <tr>
                        <td class="divider" colspan="2" style="padding-top:8px;"></td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-weight:700;">Gesamt</td>
                        <td style="padding:10px 0; font-weight:700;" align="right">${formatEuro(data.orderDetails.totalPrice)}</td>
                      </tr>
                      <tr>
                        <td style="padding:2px 0; color:#607160;">Zahlungsart</td>
                        <td style="padding:2px 0; color:#607160;" align="right">auf Rechnung</td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding-left:14px;">
                    <h4 style="margin:0 0 10px; font-size:16px; color:#1E2B20;">Projekt</h4>
                    <p style="margin:0 0 6px; font-size:14px;">Objekt: —</p>
                    <p style="margin:0; font-size:13px;" class="subtle">Falls Sie weitere Dateien ergänzen möchten, antworten Sie einfach auf diese E-Mail.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Help box -->
          <tr>
            <td class="px" style="padding:24px 0 8px;">
              <div class="shop" style="padding:18px; text-align:center;">
                <p style="margin:0 0 10px; font-size:14px; color:#1E2B20;">Fragen zur Bestellung?</p>
                <a href="mailto:info@renovirt.de" class="btn" style="background:#393939;">Hilfe anfordern</a>
                <p class="subtle" style="margin:10px 0 0; font-size:12px;">oder antworten Sie direkt auf diese E-Mail</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:26px 30px; font-size:12px; line-height:1.6; color:#607160; background:#FAFAF7;">
              © ${data.currentYear} Renovirt – eine Marke der NPS Media GmbH<br/>
              <a href="https://renovirt.de/datenschutz" target="_blank" style="color:#607160; text-decoration:none;">Datenschutz</a> •
              <a href="https://renovirt.de/impressum" target="_blank" style="color:#607160; text-decoration:none;">Impressum</a>
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
