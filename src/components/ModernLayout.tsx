import { useState, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Palette, 
  User, 
  BookOpen, 
  Sparkles,
  Settings,
  LogIn
} from "lucide-react";

interface ModernLayoutProps {
  children: ReactNode;
  theme: string;
  onThemeChange: (theme: string) => void;
  persona: string;
  onPersonaChange: (persona: string) => void;
}

const themes = [
  { id: "default", name: "Padrão", icon: "🎨", description: "Tema clássico educativo" },
  { id: "aventura", name: "Aventura", icon: "🌲", description: "Explorar a natureza" },
  { id: "espaco", name: "Espaço", icon: "🚀", description: "Descobrir o universo" }
];

const personas = [
  { id: "amigo", name: "Amigo(a)", icon: "👥", description: "Companheiro de estudos" },
  { id: "pai", name: "Pai/Mãe", icon: "❤️", description: "Carinhoso e paciente" },
  { id: "professor", name: "Professor(a)", icon: "👨‍🏫", description: "Educador experiente" }
];

export const ModernLayout = ({ 
  children, 
  theme, 
  onThemeChange, 
  persona, 
  onPersonaChange 
}: ModernLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" data-theme={theme}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Writer Reforço
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Reforço Escolar Inteligente
                </p>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:flex">
              Aprendizado Infantil
            </Badge>
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-16 left-0 z-40 w-72 bg-card/95 backdrop-blur border-r 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:inset-y-0 md:top-0 md:h-[calc(100vh-4rem)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full p-4 space-y-6">
            {/* Theme Selection */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Temas Visuais</h3>
              </div>
              <div className="space-y-2">
                {themes.map((t) => (
                  <Button
                    key={t.id}
                    variant={theme === t.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onThemeChange(t.id)}
                    className="w-full justify-start gap-3"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Persona Selection */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Assistente Virtual</h3>
              </div>
              <div className="space-y-2">
                {personas.map((p) => (
                  <Button
                    key={p.id}
                    variant={persona === p.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPersonaChange(p.id)}
                    className="w-full justify-start gap-3"
                  >
                    <span className="text-lg">{p.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Ações Rápidas</h3>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  Caderno de Anotações
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </Button>
              </div>
            </Card>
          </div>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};