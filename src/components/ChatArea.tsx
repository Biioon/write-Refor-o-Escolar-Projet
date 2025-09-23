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
  persona?: string;
  setPersona?: (persona: string) => void;
  themeSelection?: string;
  setThemeSelection?: (theme: string) => void;
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
  setThemeSelection
}: ChatAreaProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card">
      {/* Mobile settings panel */}
      <div className="md:hidden bg-secondary/50 border-b border-border">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Persona:</span>
            <select 
              value={persona || 'amigo'} 
              onChange={(e) => setPersona?.(e.target.value)}
              className="bg-secondary text-foreground text-sm rounded px-2 py-1 border border-border"
            >
              <option value="amigo">👥 Amigo</option>
              <option value="professor">👨‍🏫 Professor</option>
              <option value="mentor">🧙‍♂️ Mentor</option>
            </select>
          </div>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-3 md:mx-4 mt-3 md:mt-4">
          <TabsTrigger value="chat" className="flex items-center gap-2 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="caderno" className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" />
            <span className="hidden xs:inline">Caderno</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center px-4">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base md:text-lg font-medium">Inicie uma conversa!</p>
                  <p className="text-sm mt-2">Digite sua pergunta abaixo.</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 md:gap-3 ${
                    message.from === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.from === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${
                      message.from === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {new Date(message.ts).toLocaleTimeString()}
                    </span>
                  </div>
                  {message.from === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start gap-2 md:gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-secondary p-3 md:p-4 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-optimized input area */}
          <div className="border-t border-border p-3 md:p-4 bg-background/95 backdrop-blur">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-base" // 16px prevents zoom on iOS
                disabled={loading}
              />
              <Button 
                onClick={onSend} 
                disabled={loading || !input.trim()}
                size="icon"
                className="bg-gradient-primary hover:opacity-90 min-h-[44px] min-w-[44px]"
              >
                <Send className="w-4 h-4" />
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