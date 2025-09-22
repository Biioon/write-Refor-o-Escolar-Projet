import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, callLLM, sendDataToWebhook } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  from: 'user' | 'bot';
  ts: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [persona, setPersona] = useState('amigo');
  const [themeSelection, setThemeSelection] = useState('default');
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
        description: "Bem-vindo ao BII0ON!",
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
        description: "Conecte o Supabase para salvar anotações.",
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

    try {
      const { error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      // Send data to webhook
      await sendDataToWebhook({ title, content, user_id: user.id });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: `Nota "${title}" salva com sucesso! 📝`,
          from: 'bot',
          ts: Date.now(),
        },
      ]);

      toast({
        title: "Anotação salva!",
        description: `"${title}" foi salva no seu caderno.`,
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

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      from: 'user',
      ts: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = messages.map(m => `${m.from}: ${m.text}`).join('\n');
      const response = await callLLM({
        persona,
        input_text: userMessage.text,
        context,
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.reply || "Desculpe, não consegui processar sua mensagem.",
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar user={user} onAuthOpen={() => setAuthOpen(true)} onSignOut={signOut} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          persona={persona}
          setPersona={setPersona}
          themeSelection={themeSelection}
          setThemeSelection={setThemeSelection}
        />
        
        <ChatArea
          tab={tab}
          setTab={setTab}
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          loading={loading}
          onSaveNote={saveNote}
        />
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    </div>
  );
};

export default Index;
