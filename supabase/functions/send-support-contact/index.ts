import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportContactRequest {
  subject: string;
  message: string;
  userEmail?: string;
  searchQuery?: string;
  aiResult?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY nicht konfiguriert');
    }
    const resend = new Resend(resendApiKey);

    const { subject, message, userEmail, searchQuery, aiResult }: SupportContactRequest = await req.json();

    if (!subject || !message) {
      return new Response(JSON.stringify({ error: 'Betreff und Nachricht sind erforderlich' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile if authenticated
    const authHeader = req.headers.get('authorization');
    let userProfile = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        const { data: profile } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        userProfile = profile;
      }
    }

    // Create support email content
    const userName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Unbekannter Benutzer';
    const fromEmail = userEmail || userProfile?.billing_email || 'noreply@renovirt.de';
    
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
          Neue Support-Anfrage von ${userName}
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Betreff:</h3>
          <p style="margin: 5px 0; font-weight: bold;">${subject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Nachricht:</h3>
          <p style="margin: 5px 0; white-space: pre-wrap;">${message}</p>
        </div>
    `;

    if (userProfile) {
      emailContent += `
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Kundeninformationen:</h3>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>E-Mail:</strong> ${userProfile.billing_email || 'Nicht verfügbar'}</p>
          <p><strong>Unternehmen:</strong> ${userProfile.company || 'Nicht verfügbar'}</p>
          <p><strong>Rolle:</strong> ${userProfile.role || 'Nicht verfügbar'}</p>
        </div>
      `;
    }

    if (searchQuery && aiResult) {
      emailContent += `
        <div style="background-color: #fff8dc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0;">Kontext der Anfrage:</h3>
          <p><strong>Ursprüngliche Suchanfrage:</strong> "${searchQuery}"</p>
          <p><strong>AI-Antwort:</strong></p>
          <p style="font-style: italic; color: #666;">${aiResult.substring(0, 300)}${aiResult.length > 300 ? '...' : ''}</p>
        </div>
      `;
    }

    emailContent += `
        <div style="border-top: 1px solid #e5e5e5; padding-top: 15px; margin-top: 30px; color: #666; font-size: 12px;">
          <p>Diese Nachricht wurde automatisch über das Renovirt Support-System generiert.</p>
          <p>Zeitstempel: ${new Date().toLocaleString('de-DE')}</p>
        </div>
      </div>
    `;

    // Send email to support
    const emailResponse = await resend.emails.send({
      from: "Renovirt Support <info@renovirt.de>",
      to: ["support@renovirt.de"],
      subject: `Support-Anfrage: ${subject}`,
      html: emailContent,
      reply_to: fromEmail,
    });

    console.log("Support-E-Mail erfolgreich gesendet:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Support-Anfrage erfolgreich gesendet',
      emailId: emailResponse.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fehler beim Senden der Support-E-Mail:', error);
    return new Response(JSON.stringify({ 
      error: 'Fehler beim Senden der Support-Anfrage',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});