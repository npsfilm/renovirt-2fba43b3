import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AccountExistsRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email }: AccountExistsRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const loginUrl = `${Deno.env.get("SUPABASE_URL")?.replace("/rest/v1", "") || "https://app.renovirt.de"}/auth`;
    const passwordResetUrl = `${Deno.env.get("SUPABASE_URL")?.replace("/rest/v1", "") || "https://app.renovirt.de"}/auth`;
    
    const emailResponse = await resend.emails.send({
      from: "Renovirt <noreply@renovirt.de>",
      to: [email],
      subject: "Konto bereits vorhanden - Renovirt",
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Konto bereits vorhanden</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb;">
           
            <!-- Header -->
            <div style="padding: 40px 30px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <h1 style="color: #374151; margin: 0; font-size: 28px; font-weight: 600;">Renovirt</h1>
            </div>
           
            <!-- Content -->
            <div style="padding: 40px 30px;">

              <!-- Warnbox -->
              <div style="border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 30px; background-color: #fefce8;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 24px; height: 24px; background: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <span style="color: white; font-weight: bold; font-size: 16px;">!</span>
                  </div>
                  <h2 style="margin: 0; color: #854d0e; font-size: 18px; font-weight: 600;">Konto bereits vorhanden</h2>
                </div>
                <p style="margin: 0; color: #854d0e; line-height: 1.5;">
                  Ihre E-Mail-Adresse ist bereits bei uns registriert. Vermutlich wurde versucht, ein neues Konto anzulegen – das ist nicht notwendig.
                </p>
              </div>
             
              <!-- Nächste Schritte -->
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Was können Sie jetzt tun?</h3>

              <!-- Anmelden -->
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">✓ Direkt anmelden</h4>
                <p style="margin: 0 0 15px 0; color: #6b7280; line-height: 1.5; font-size: 14px;">
                  Sie haben bereits ein Konto? Dann können Sie sich hier einloggen.
                </p>
                <a href="${loginUrl}" 
                   style="display: inline-block; background: #B5C1A5; color: #1f2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Jetzt anmelden &rarr;
                </a>
              </div>
               
              <!-- Passwort zurücksetzen -->
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">🔐 Passwort vergessen?</h4>
                <p style="margin: 0 0 15px 0; color: #6b7280; line-height: 1.5; font-size: 14px;">
                  Kein Problem – hier können Sie ganz einfach ein neues Passwort festlegen.
                </p>
                <a href="${passwordResetUrl}" 
                   style="display: inline-block; background: #B5C1A5; color: #1f2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  Passwort zurücksetzen &rarr;
                </a>
              </div>

              <!-- Sicherheitshinweis -->
              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600;">🔒 Sicherheit geht vor</h4>
                <p style="margin: 0; color: #6b7280; line-height: 1.5; font-size: 13px;">
                  Diese E-Mail wurde automatisch verschickt, da ein Konto mit Ihrer E-Mail-Adresse erstellt werden sollte. Wenn Sie das nicht waren, können Sie diese Nachricht einfach ignorieren – Ihr bestehendes Konto bleibt sicher.
                </p>
              </div>

              <!-- Kontakt -->
              <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                  Fragen? Unser Team hilft gerne weiter: <br>
                  <a href="mailto:support@renovirt.de" style="color: #B5C1A5; text-decoration: underline;">support@renovirt.de</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                &copy; 2025 Renovirt – Professionelle Immobilienfotografie und digitale Bildbearbeitung
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Account exists notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Account exists notification sent" 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in send-account-exists-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);