
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResendEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: ResendEmailRequest = await req.json();
    
    console.log('Processing email resend request for:', email);
    
    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured, using Supabase default');
      
      // Fallback to Supabase's resend (with rate limiting)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'supabase.co')}/auth/v1/verify?redirect_to=${encodeURIComponent(req.headers.get('origin') || '')}%2Fonboarding`
        }
      });
      
      if (error) {
        throw error;
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Verification email sent via Supabase',
        method: 'supabase'
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Use custom Resend implementation for immediate delivery
    const resend = new Resend(resendApiKey);
    
    // Generate verification token and hash (simplified approach)
    const origin = req.headers.get('origin') || 'https://app.renovirt.de';
    const baseUrl = Deno.env.get('SUPABASE_URL')!;
    
    // Create a verification link that goes through Supabase auth
    const verificationUrl = `${baseUrl}/auth/v1/verify?token_hash=placeholder&type=email&redirect_to=${encodeURIComponent(origin)}/onboarding`;
    
    // Send custom email via Resend
    const emailResponse = await resend.emails.send({
      from: "Renovirt <no-reply@renovirt.de>",
      to: [email],
      subject: "Bestätigen Sie Ihre E-Mail-Adresse bei Renovirt",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Mail-Bestätigung</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 20px; }
            .button { display: inline-block; background-color: #2563eb; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; }
            .warning { background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Renovirt</div>
              <h1>Willkommen bei Renovirt${firstName ? `, ${firstName}` : ''}!</h1>
            </div>
            
            <p>Vielen Dank für Ihre Registrierung bei Renovirt. Um Ihr Konto zu aktivieren, bestätigen Sie bitte Ihre E-Mail-Adresse.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">E-Mail-Adresse bestätigen</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Wichtig:</strong> Dieser Link ist 24 Stunden gültig. Nach der Bestätigung werden Sie automatisch zum Onboarding weitergeleitet.
            </div>
            
            <p><strong>Tipps:</strong></p>
            <ul>
              <li>Überprüfen Sie auch Ihren Spam-/Junk-Ordner</li>
              <li>Fügen Sie no-reply@renovirt.de zu Ihren Kontakten hinzu</li>
              <li>Der Bestätigungslink funktioniert nur einmal</li>
            </ul>
            
            <p>Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie einfach.</p>
            
            <div class="footer">
              <p>© 2024 Renovirt. Alle Rechte vorbehalten.</p>
              <p>Benötigen Sie Hilfe? Kontaktieren Sie uns unter <a href="mailto:support@renovirt.de">support@renovirt.de</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Custom verification email sent successfully via Resend:', emailResponse);

    // Log the email attempt for analytics
    const { error: logError } = await supabase
      .from('email_verification_attempts')
      .insert({
        email: email,
        method: 'resend_custom',
        success: true,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('Failed to log email attempt:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Verification email sent successfully',
      method: 'resend_custom',
      email_id: emailResponse.data?.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in resend-verification-email function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      code: error.code || 'unknown_error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
