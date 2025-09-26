import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateNote } from "./CreateNote";
import { RewardAnimation } from "./RewardAnimation";
import { 
  MessageCircle, 
  BookOpen, 
  Send, 
  Loader2,
  Bot,
  User,
  Star,
  Heart
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  from: 'user' | 'bot';
  ts: number;
}

interface ChatAreaProps {
  tab: string;
  setTab: (tab: string) => void;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  onSend: () => void;
  loading: boolean;
  onSaveNote: (title: string, content: string) => void;
  persona?: string;
  setPersona?: (persona: string) => void;
  themeSelection?: string;
  setThemeSelection?: (theme: string) => void;
  onTriggerReward?: () => void;
}

export const ChatArea = ({ 
  tab, 
  setTab, 
  messages, 
  input, 
  setInput, 
  onSend, 
  loading, 
  onSaveNote,
  persona,
  setPersona,
  themeSelection,
  setThemeSelection,
  onTriggerReward
}: ChatAreaProps) => {
  const [showReward, setShowReward] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSendWithReward = () => {
    onSend();
    // Mostrar animação de recompensa ocasionalmente
    if (Math.random() > 0.7 && onTriggerReward) {
      onTriggerReward();
    }
  };

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getPersonaEmoji = () => {
    switch(persona) {
      case 'amigo': return '👥';
      case 'pai': return '❤️';
      case 'professor': return '👨‍🏫';
      default: return '🤖';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-xl">{getPersonaEmoji()}</span>
          </div>
          <div>
            <h2 className="font-semibold">Chat com IA</h2>
            <p className="text-sm text-muted-foreground">
              Modo: {persona === 'amigo' ? 'Amigo' : persona === 'pai' ? 'Pai/Mãe' : 'Professor'}
            </p>
          </div>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="caderno" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Caderno
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">{/* Content will go here */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <div className="text-6xl mb-4">{getPersonaEmoji()}</div>
                  <p className="text-lg font-medium">Olá! Como posso ajudar?</p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Digite sua pergunta ou dúvida de estudos.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.from === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.from === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                      <span className="text-sm">{getPersonaEmoji()}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl transition-all duration-200 ${
                      message.from === 'user'
                        ? 'bg-gradient-primary text-primary-foreground shadow-lg'
                        : 'bg-card border text-card-foreground shadow-card'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {new Date(message.ts).toLocaleTimeString()}
                    </span>
                  </div>
                  {message.from === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-glow">
                  <span className="text-sm">{getPersonaEmoji()}</span>
                </div>
                <div className="bg-card border p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={handleSendWithReward} 
                disabled={loading || !input.trim()}
                size="icon"
                className="bg-gradient-primary hover:opacity-90 shadow-lg hover:shadow-glow transition-all duration-200"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="caderno" className="flex-1 mt-0">
          <div className="h-full overflow-auto">
            <CreateNote onSave={onSaveNote} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};