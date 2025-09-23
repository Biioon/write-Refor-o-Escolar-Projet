import { supabase } from "@/integrations/supabase/client";

// Mock LLM API call for development
export const callLLM = async ({ persona, input_text, context }: { persona: string; input_text: string; context: string; }): Promise<{ reply: string; }> => {
  try {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: { 
        message: input_text, 
        persona, 
        context 
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Erro na comunicação com o serviço de IA');
    }

    return { reply: data.reply || "Desculpe, não consegui processar sua mensagem." };
  } catch (error) {
    console.error('CallLLM error:', error);
    return { 
      reply: "Ops! Ocorreu um erro ao se comunicar com a IA. Tente novamente." 
    };
  }
};

// Mock webhook sender
export async function sendDataToWebhook(data: any) {
  try {
    console.log("Dados que seriam enviados para webhook:", data);
    // In production, implement actual webhook call
    // await fetch(API_SEND_URL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data)
    // });
  } catch (err) {
    console.error("Erro ao enviar dados:", err);
  }
}