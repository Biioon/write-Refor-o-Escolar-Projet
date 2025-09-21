import { createClient } from "@supabase/supabase-js";

// Note: In production, these should be set via environment variables
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock LLM API call for development
export async function callLLM({ persona, input_text, context }: {
  persona: string;
  input_text: string;
  context: string;
}) {
  // This is a mock implementation
  // In production, replace with actual LLM API call
  
  const responses = {
    amigo: [
      "Que legal! Vamos descobrir isso juntos? 😊",
      "Oba! Essa é uma pergunta muito interessante!",
      "Ei, você está indo super bem! Vamos continuar?",
    ],
    pai: [
      "Que orgulho! Você está se esforçando tanto para aprender.",
      "Muito bem, querido(a)! Vamos explorar esse assunto juntos.",
      "Fico muito feliz em ver você estudando! Como posso ajudar?",
    ],
    professor: [
      "Excelente pergunta! Vamos analisar esse conceito passo a passo.",
      "Muito bem! Essa é uma observação muito perspicaz.",
      "Perfeito! Agora vamos aprofundar esse conhecimento.",
    ]
  };

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  const personaResponses = responses[persona as keyof typeof responses] || responses.professor;
  const randomResponse = personaResponses[Math.floor(Math.random() * personaResponses.length)];
  
  return {
    reply: `${randomResponse}\n\nSobre "${input_text}":\n\nEssa é uma questão muito interessante! ${persona === 'professor' ? 'Do ponto de vista educacional' : persona === 'pai' ? 'Como pai/mãe' : 'Como seu amigo'}, posso te ajudar a entender melhor. Que tal começarmos explorando os conceitos básicos?`
  };
}

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