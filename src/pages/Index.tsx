import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { callLLM, sendDataToWebhook } from "@/lib/supabase";
import { ChatArea } from "@/components/ChatArea";
import { AuthModal } from "@/components/AuthModal";
import { ModernLayout } from "@/components/ModernLayout";
import { StudioPreview } from "@/components/StudioPreview";
import { RewardAnimation } from "@/components/RewardAnimation";
import { toast } from "@/hooks/use-toast";
import { sanitizeText, sanitizeNote, validateTextLength, validateEmail, validatePassword } from "@/lib/validation";

interface Message {
  id: number;
  text: string;
  from: 'user' | 'bot';
  ts: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [persona, setPersona] = useState('amigo');
  const [themeSelection, setThemeSelection] = useState('aventura');
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Olá! Sou seu tutor virtual 🎓 O que vamos estudar hoje?", 
      from: 'bot', 
      ts: Date.now() - 1000 
    }
  ]);
  const [input, setInput] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Authentication functions
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast({
        title: "Supabase não conectado",
        description: "Conecte o Supabase para usar autenticação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setAuthOpen(false);
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
    } catch (err: any) {
      toast({
        title: "Erro no login",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!supabase) {
      toast({
        title: "Supabase não conectado",
        description: "Conecte o Supabase para usar autenticação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setAuthOpen(false);
      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao BII0ON! Verifique seu email se necessário.",
      });
    } catch (err: any) {
      toast({
        title: "Erro no cadastro",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setMessages([]);
    toast({
      title: "Até logo!",
      description: "Você foi desconectado com sucesso.",
    });
  };

  // Save note function
  const saveNote = async (title: string, content: string) => {
    if (!supabase) {
      toast({
        title: "Supabase não conectado",
        description: "Conecte o Supabase para usar autenticação.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar anotações.",
        variant: "destructive",
      });
      return;
    }

    // Validate and sanitize inputs
    const sanitizedTitle = sanitizeText(title);
    const sanitizedContent = sanitizeNote(content);
    
    if (!validateTextLength(sanitizedTitle, 200)) {
      toast({
        title: "Título inválido",
        description: "O título deve ter entre 1 e 200 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateTextLength(sanitizedContent, 10000)) {
      toast({
        title: "Conteúdo inválido",
        description: "O conteúdo deve ter entre 1 e 10000 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .insert([
          {
            title: sanitizedTitle,
            content: sanitizedContent,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      // Send data to webhook
      await sendDataToWebhook({ title: sanitizedTitle, content: sanitizedContent, user_id: user.id });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: `Nota "${sanitizedTitle}" salva com sucesso! 📝`,
          from: 'bot',
          ts: Date.now(),
        },
      ]);

      toast({
        title: "Anotação salva!",
        description: `"${sanitizedTitle}" foi salva no seu caderno.`,
      });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a anotação.",
        variant: "destructive",
      });
    }
  };

  // Send message to LLM
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Validate and sanitize input
    const sanitizedInput = sanitizeText(input);
    
    if (!validateTextLength(sanitizedInput, 1000)) {
      toast({
        title: "Mensagem muito longa",
        description: "A mensagem deve ter no máximo 1000 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: sanitizedInput,
      from: 'user',
      ts: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = messages.map(m => `${m.from}: ${sanitizeText(m.text)}`).join('\n');
      const response = await callLLM({
        persona,
        input_text: sanitizedInput,
        context,
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: sanitizeText(response.reply || "Desculpe, não consegui processar sua mensagem."),
          from: 'bot',
          ts: Date.now(),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Ops! Ocorreu um erro. Tente novamente.",
          from: 'bot',
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeSelection);
  }, [themeSelection]);

  const triggerReward = () => {
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);
  };

  return (
    <ModernLayout
      theme={themeSelection}
      onThemeChange={setThemeSelection}
      persona={persona}
      onPersonaChange={setPersona}
    >
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative">
        {/* Reward Animation Overlay */}
        {showReward && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            <RewardAnimation />
          </div>
        )}
        
        {/* Left Side - Chat */}
        <div className="w-full md:w-1/2 flex flex-col border-r">
          <ChatArea
            tab={tab}
            setTab={setTab}
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
            onSaveNote={saveNote}
            persona={persona}
            setPersona={setPersona}
            themeSelection={themeSelection}
            setThemeSelection={setThemeSelection}
            onTriggerReward={triggerReward}
          />
        </div>
        
        {/* Right Side - Studio Preview */}
        <div className="hidden md:flex md:w-1/2 p-4">
          <StudioPreview onTriggerReward={triggerReward} />
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    </ModernLayout>
  );
};

export default Index;
