
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, sessionId, userEmail, sendCopyToUser } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Get user profile information
    let userInfo = '';
    if (userId) {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('first_name, last_name, company, phone')
        .eq('user_id', userId)
        .single();

      if (profile) {
        userInfo = `
Kundenname: ${profile.first_name} ${profile.last_name}
${profile.company ? `Unternehmen: ${profile.company}` : ''}
${profile.phone ? `Telefon: ${profile.phone}` : ''}
E-Mail: ${userEmail || 'Nicht verfügbar'}
        `;
      }
    }

    // Format chat history
    const chatHistory = messages.map(msg => {
      const time = new Date(msg.timestamp).toLocaleString('de-DE');
      const sender = msg.type === 'user' ? 'Kunde' : 'AI-Assistent';
      return `[${time}] ${sender}: ${msg.content}`;
    }).join('\n\n');

    // Create email content for support team
    const supportEmailSubject = `Chat-Verlauf weitergeleitet - Session ${sessionId}`;
    const supportEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .chat-history { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .customer-info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🔄 Chat-Verlauf weitergeleitet</h2>
    <p>Ein Kunde hat seinen Chat-Verlauf an den Support weitergeleitet und benötigt persönliche Hilfe.</p>
  </div>
  
  <div class="customer-info">
    <h3>👤 Kundeninformationen:</h3>
    <pre>${userInfo}</pre>
    <p><strong>Session-ID:</strong> ${sessionId}</p>
    <p><strong>Datum:</strong> ${new Date().toLocaleString('de-DE')}</p>
  </div>
  
  <div class="chat-history">
    <h3>💬 Chat-Verlauf:</h3>
    <pre>${chatHistory}</pre>
  </div>
  
  <hr style="margin: 30px 0;">
  <p style="color: #666; font-size: 12px;">
    Diese Nachricht wurde automatisch vom RenoviRT AI-Chat-System generiert.<br>
    Bitte antworten Sie direkt an die E-Mail-Adresse des Kunden.
  </p>
</body>
</html>
    `;

    // Send email to support team
    const supportEmailResponse = await resend.emails.send({
      from: 'RenoviRT Chat System <noreply@renovirt.de>',
      to: ['support@renovirt.de'],
      subject: supportEmailSubject,
      html: supportEmailContent,
      reply_to: userEmail || 'noreply@renovirt.de'
    });

    if (supportEmailResponse.error) {
      console.error('Error sending support email:', supportEmailResponse.error);
      throw new Error('Failed to send email to support team');
    }

    // Send copy to user if requested
    if (sendCopyToUser && userEmail) {
      const userEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .chat-history { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>📧 Ihr Chat-Verlauf</h2>
    <p>Vielen Dank! Wir haben Ihren Chat-Verlauf erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
  </div>
  
  <div class="chat-history">
    <h3>💬 Ihr Chat-Verlauf:</h3>
    <pre>${chatHistory}</pre>
  </div>
  
  <hr style="margin: 30px 0;">
  <p style="color: #666;">
    <strong>Was passiert als Nächstes?</strong><br>
    • Unser Support-Team prüft Ihren Chat-Verlauf<br>
    • Sie erhalten innerhalb von 2-4 Stunden eine persönliche Antwort<br>
    • Bei dringenden Anfragen können Sie uns auch telefonisch erreichen<br><br>
    
    Mit freundlichen Grüßen<br>
    Ihr RenoviRT Team
  </p>
</body>
</html>
      `;

      await resend.emails.send({
        from: 'RenoviRT Support <support@renovirt.de>',
        to: [userEmail],
        subject: 'Bestätigung: Ihr Chat-Verlauf wurde weitergeleitet',
        html: userEmailContent
      });
    }

    // Log the support request
    await supabase
      .from('help_interactions')
      .insert({
        user_id: userId || null,
        session_id: sessionId,
        question: 'Chat-Verlauf an Support gesendet',
        ai_response: 'Support kontaktiert via E-Mail',
        contacted_support: true,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Chat-Verlauf wurde erfolgreich an support@renovirt.de gesendet.',
      supportEmailId: supportEmailResponse.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-chat-history function:', error);
    return new Response(JSON.stringify({ 
      error: 'Fehler beim Senden des Chat-Verlaufs.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
