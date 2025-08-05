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
    
    const emailResponse = await resend.emails.send({
      from: "Renovirt <noreply@renovirt.de>",
      to: [email],
      subject: "Konto bereits vorhanden - Renovirt",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Konto bereits vorhanden</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Renovirt</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <span style="color: white; font-weight: bold; font-size: 14px;">!</span>
                  </div>
                  <h2 style="margin: 0; color: #92400e; font-size: 18px; font-weight: 600;">Konto bereits vorhanden</h2>
                </div>
                <p style="margin: 0; color: #92400e; line-height: 1.5;">
                  Es wurde versucht, ein neues Konto mit Ihrer E-Mail-Adresse zu erstellen. Es existiert jedoch bereits ein Konto unter dieser E-Mail-Adresse.
                </p>
              </div>
              
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Was können Sie tun?</h3>
              
              <div style="margin-bottom: 30px;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                  <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">📧 Anmelden</h4>
                  <p style="margin: 0 0 15px 0; color: #6b7280; line-height: 1.5; font-size: 14px;">
                    Wenn Sie Ihr Passwort noch kennen, können Sie sich direkt anmelden.
                  </p>
                  <a href="${loginUrl}" 
                     style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
                    Zur Anmeldung →
                  </a>
                </div>
                
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                  <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">🔒 Passwort vergessen?</h4>
                  <p style="margin: 0 0 15px 0; color: #6b7280; line-height: 1.5; font-size: 14px;">
                    Falls Sie Ihr Passwort vergessen haben, können Sie es zurücksetzen.
                  </p>
                  <a href="${loginUrl}" 
                     style="display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">
                    Passwort zurücksetzen →
                  </a>
                </div>
              </div>
              
              <!-- Security Note -->
              <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600;">🔐 Sicherheitshinweis</h4>
                <p style="margin: 0; color: #6b7280; line-height: 1.5; font-size: 13px;">
                  Diese E-Mail wurde automatisch versendet, da jemand versucht hat, ein Konto mit Ihrer E-Mail-Adresse zu erstellen. 
                  Falls Sie dies nicht waren, können Sie diese E-Mail ignorieren. Ihr bestehendes Konto ist sicher.
                </p>
              </div>
              
              <!-- Support -->
              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                  Haben Sie Fragen? Kontaktieren Sie uns unter 
                  <a href="mailto:support@renovirt.de" style="color: #3b82f6; text-decoration: none;">support@renovirt.de</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2024 Renovirt. Professionelle Immobilienfotografie.
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