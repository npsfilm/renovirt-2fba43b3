
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userId, sessionId } = await req.json();
    const startTime = Date.now();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user context if logged in
    let userContext = '';
    if (userId) {
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('first_name, last_name, company')
        .eq('user_id', userId)
        .single();

      const { data: orders } = await supabase
        .from('orders')
        .select('id, status, photo_type, image_count, total_price, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (profile) {
        userContext += `Kunde: ${profile.first_name} ${profile.last_name}`;
        if (profile.company) userContext += ` (${profile.company})`;
        userContext += '\n';
      }

      if (orders && orders.length > 0) {
        userContext += `Letzte Bestellungen:\n`;
        orders.forEach(order => {
          userContext += `- Bestellung ${order.id}: ${order.photo_type}, ${order.image_count} Bilder, Status: ${order.status}, €${order.total_price}\n`;
        });
      }
    }

    // Get FAQ context
    const { data: faqDocs } = await supabase
      .from('help_documents')
      .select('title, content')
      .eq('is_active', true);

    let faqContext = '';
    if (faqDocs && faqDocs.length > 0) {
      faqContext = 'FAQ-Wissen:\n' + faqDocs.map(doc => `${doc.title}: ${doc.content}`).join('\n\n');
    }

    // Prepare system prompt
    const systemPrompt = `Du bist ein hilfreicher AI-Assistent für RenoviRT, ein Unternehmen für professionelle Bildbearbeitung von Immobilienfotos. 

WICHTIGE REGELN:
- Antworte immer auf Deutsch
- Sei freundlich und professionell
- Gib spezifische, hilfreiche Antworten
- Wenn du die Antwort nicht kennst, sage es ehrlich und empfehle den Support zu kontaktieren
- Nutze die verfügbaren Informationen über den Kunden und die FAQ

VERFÜGBARE INFORMATIONEN:
${userContext}

${faqContext}

SERVICES:
- Immobilienfotos bearbeiten (HDR, Belichtungskorrektur, Farboptimierung)
- Verschiedene Pakete verfügbar
- Schnelle Bearbeitungszeiten
- Professionelle Qualität

Beantworte die Frage des Kunden basierend auf diesen Informationen.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const aiResponse = data.choices[0].message.content;
    const responseTime = Date.now() - startTime;

    // Log interaction to database
    await supabase
      .from('help_interactions')
      .insert({
        user_id: userId || null,
        session_id: sessionId,
        question: question,
        ai_response: aiResponse,
        response_time_ms: responseTime,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    return new Response(JSON.stringify({
      response: aiResponse,
      responseTime: responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-help-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
