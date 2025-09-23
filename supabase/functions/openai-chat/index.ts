import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, persona, context } = await req.json();

    // Create system prompt based on persona
    let systemPrompt = "";
    switch (persona) {
      case 'professor':
        systemPrompt = "Você é um professor experiente e paciente. Ensine de forma clara, didática e sempre incentive o aprendizado. Use exemplos práticos e faça perguntas que estimulem o pensamento crítico.";
        break;
      case 'amigo':
        systemPrompt = "Você é um amigo prestativo e encorajador. Seja empático, use linguagem casual e sempre ofereça apoio emocional junto com suas respostas. Celebre os sucessos e ajude nas dificuldades.";
        break;
      case 'mentor':
        systemPrompt = "Você é um mentor sábio e experiente. Guie através de perguntas reflexivas, compartilhe insights valiosos e ajude a desenvolver habilidades de pensamento independente.";
        break;
      default:
        systemPrompt = "Você é um assistente educacional especializado em reforço escolar. Seja claro, paciente e adaptativo ao nível do estudante.";
    }

    console.log('Making request to OpenAI with persona:', persona);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt + ' Contexto da conversa anterior: ' + (context || 'Primeira mensagem')
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: "Desculpe, ocorreu um erro. Tente novamente em alguns instantes."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});