import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateNote } from "./CreateNote";
import { 
  MessageCircle, 
  BookOpen, 
  Send, 
  Loader2,
  Bot,
  User
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
}

export const ChatArea = ({ 
  tab, 
  setTab, 
  messages, 
  input, 
  setInput, 
  onSend, 
  loading,
  onSaveNote 
}: ChatAreaProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-background">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-6 mt-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="caderno" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Caderno
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          <div className="flex-1 overflow-auto p-6 space-y-4 bg-background">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Olá! Como posso ajudar?
                </h3>
                <p className="text-muted-foreground">
                  Faça uma pergunta ou conte sobre o que está estudando
                </p>
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
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <Card className={`max-w-[80%] p-4 ${
                    message.from === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {new Date(message.ts).toLocaleTimeString()}
                    </span>
                  </Card>

                  {message.from === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Pensando...
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border bg-background">
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua dúvida ou conte o que está estudando..."
                className="flex-1 bg-secondary border-border"
                disabled={loading}
              />
              <Button
                onClick={onSend}
                disabled={loading || !input.trim()}
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
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

        <TabsContent value="caderno" className="flex-1 m-0">
          <div className="h-full overflow-auto bg-background">
            <CreateNote onSave={onSaveNote} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};