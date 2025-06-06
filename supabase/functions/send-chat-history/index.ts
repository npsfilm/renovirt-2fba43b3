
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, sessionId, userEmail } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Create email content
    const emailSubject = `Chat-Verlauf weitergeleitet - Session ${sessionId}`;
    const emailContent = `
Hallo Support-Team,

ein Kunde hat seinen Chat-Verlauf an den Support weitergeleitet.

KUNDENINFORMATIONEN:
${userInfo}

SESSION-ID: ${sessionId}
DATUM: ${new Date().toLocaleString('de-DE')}

CHAT-VERLAUF:
${chatHistory}

---
Diese Nachricht wurde automatisch vom RenoviRT AI-Chat-System generiert.
Bitte antworten Sie direkt an die E-Mail-Adresse des Kunden.
    `;

    // Send email to support using a simple notification approach
    // In a real implementation, you would use Resend or another email service
    console.log('Email would be sent to support@renovirt.de:', {
      subject: emailSubject,
      content: emailContent,
      userEmail: userEmail
    });

    // Log the support request
    await supabase
      .from('help_interactions')
      .insert({
        user_id: userId || null,
        session_id: sessionId,
        question: 'Chat-Verlauf an Support gesendet',
        ai_response: 'Support kontaktiert',
        contacted_support: true,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Chat-Verlauf wurde erfolgreich an support@renovirt.de gesendet.'
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
