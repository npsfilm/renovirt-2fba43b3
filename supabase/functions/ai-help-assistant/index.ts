
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
    const { question, userId, sessionId, hasExistingMessages } = await req.json();
    const startTime = Date.now();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for support keywords
    const supportKeywords = ['mitarbeiter', 'mitarbeiter sprechen', 'support', 'menschliche hilfe', 'persönliche beratung', 'agent', 'berater'];
    const questionLower = question.toLowerCase();
    const needsSupport = supportKeywords.some(keyword => questionLower.includes(keyword));

    if (needsSupport) {
      // If no existing messages, ask for more context first
      if (!hasExistingMessages) {
        const contextResponse = `Ich verstehe, dass Sie gerne mit einem Mitarbeiter sprechen möchten. Um Ihnen bestmöglich zu helfen, können Sie mir zunächst sagen, worum es geht? 

Möglicherweise kann ich Ihnen bereits eine schnelle Lösung anbieten. Falls nicht, leite ich Sie gerne an unseren persönlichen Support weiter.

Beschreiben Sie gerne Ihr Anliegen - ich bin hier, um zu helfen!`;

        // Log interaction
        await supabase
          .from('help_interactions')
          .insert({
            user_id: userId || null,
            session_id: sessionId,
            question: question,
            ai_response: contextResponse,
            response_time_ms: Date.now() - startTime,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        return new Response(JSON.stringify({
          response: contextResponse,
          responseTime: Date.now() - startTime
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // If there are existing messages, offer support options
        await supabase
          .from('help_interactions')
          .insert({
            user_id: userId || null,
            session_id: sessionId,
            question: question,
            ai_response: 'SUPPORT_REQUEST',
            response_time_ms: Date.now() - startTime,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        return new Response(JSON.stringify({
          response: 'SUPPORT_REQUEST',
          responseTime: Date.now() - startTime
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

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
        .select('id, order_number, status, photo_type, image_count, total_price, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (profile) {
        userContext += `Kunde: ${profile.first_name} ${profile.last_name}`;
        if (profile.company) userContext += ` (${profile.company})`;
        userContext += '\n';
      }

      if (orders && orders.length > 0) {
        // Check if user is asking about current/latest order specifically
        const currentOrderKeywords = ['aktuelle', 'letzte', 'neueste', 'wann fertig', 'wann sind meine bilder fertig', 'status meiner bestellung'];
        const isAskingAboutCurrentOrder = currentOrderKeywords.some(keyword => questionLower.includes(keyword));
        
        if (isAskingAboutCurrentOrder && !questionLower.includes('alle') && !questionLower.includes('übersicht')) {
          // Show only the latest order
          const latestOrder = orders[0];
          const orderNumber = latestOrder.order_number || `RV-${latestOrder.id.slice(0, 8)}`;
          userContext += `Aktuelle Bestellung:\n`;
          userContext += `- Bestellung ${orderNumber}: ${latestOrder.photo_type}, ${latestOrder.image_count} Bilder, Status: ${latestOrder.status}, €${latestOrder.total_price}\n`;
        } else {
          // Show all recent orders
          userContext += `Letzte Bestellungen:\n`;
          orders.forEach(order => {
            const orderNumber = order.order_number || `RV-${order.id.slice(0, 8)}`;
            userContext += `- Bestellung ${orderNumber}: ${order.photo_type}, ${order.image_count} Bilder, Status: ${order.status}, €${order.total_price}\n`;
          });
        }
      }
    }

    // Get FAQ context from help_documents - using maybeSingle to avoid errors if table doesn't exist
    const { data: faqDocs } = await supabase
      .from('help_documents')
      .select('title, content')
      .eq('is_active', true)
      .order('id', { ascending: true })
      .limit(10);

    let faqContext = '';
    if (faqDocs && faqDocs.length > 0) {
      faqContext = 'RENOVIRT FAQ-WISSENSDATENBANK:\n\n';
      faqDocs.forEach(doc => {
        faqContext += `FRAGE: ${doc.title}\nANTWORT: ${doc.content}\n\n`;
      });
    }

    // Optimized system prompt for concise, focused responses
    const systemPrompt = `Du bist der AI-Assistent für "renovirt", einen professionellen Bildbearbeitungsservice für Immobilienfotos.

WICHTIGE REGELN:
- Antworte IMMER auf Deutsch in einem freundlichen, professionellen Ton
- Halte Antworten kurz und präzise - maximal 2-3 Sätze für einfache Fragen
- Verwende KEINE Markdown-Formatierung (keine **, *, etc.)
- Nutze nur die verfügbare FAQ-Wissensdatenbank für Informationen
- Bei fehlenden Informationen empfiehl den direkten Support-Kontakt

KUNDENKONTEXT:
${userContext}

FAQ-WISSENSDATENBANK:
${faqContext}

SERVICES & PREISE:
- Basic-Paket: Farb-/Belichtungskorrektur, Perspektivkorrektur (48h)
- Premium-Paket: Basic + Objektentfernung, Retusche (24h)
- Staffelrabatte: 5% ab 10, 10% ab 20, 15% ab 30, 25% ab 40 Bildern

Beantworte die Frage kurz und hilfreich. Biete am Ende nur bei komplexeren Fragen weitere Hilfe an.`;

    // Call OpenAI API with updated model
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    if (!openAIResponse.ok) {
      console.error(`OpenAI API error: ${openAIResponse.status} - ${openAIResponse.statusText}`);
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error details:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    let aiResponse = data.choices[0].message.content;
    const responseTime = Date.now() - startTime;

    // Simple response post-processing
    if (aiResponse) {
      // Add contact info only for support-related responses
      if (aiResponse.includes('nicht verfügbar') || aiResponse.includes('Support kontaktieren')) {
        aiResponse += '\n\nSie erreichen unseren Support unter: support@renovirt.de';
      }
    }

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
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support unter support@renovirt.de',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
