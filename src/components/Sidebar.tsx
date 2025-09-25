import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Palette, 
  TreePine, 
  Rocket,
  Users,
  Heart,
  GraduationCap,
  Menu,
  Star
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  persona: string;
  setPersona: (persona: string) => void;
  themeSelection: string;
  setThemeSelection: (theme: string) => void;
}

export const Sidebar = ({ 
  persona, 
  setPersona, 
  themeSelection, 
  setThemeSelection 
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const themes = [
    { id: 'default', icon: Palette, label: 'Padrão', color: 'hsl(217 91% 60%)' },
    { id: 'aventura', icon: TreePine, label: 'Aventura', color: 'hsl(142 70% 50%)' },
    { id: 'espaco', icon: Rocket, label: 'Espaço', color: 'hsl(270 80% 65%)' }
  ];

  const personas = [
    { id: 'amigo', icon: Users, label: 'Amigo(a)', emoji: '👥' },
    { id: 'pai', icon: Heart, label: 'Pai/Mãe', emoji: '❤️' },
    { id: 'professor', icon: GraduationCap, label: 'Professor(a)', emoji: '👨‍🏫' }
  ];

  // Auto-collapse no mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <aside className={`${isMobile ? 'w-16' : collapsed ? 'w-16' : 'w-64'} bg-card border-r border-border transition-all duration-300 flex flex-col overflow-hidden`}>
      {/* Header com toggle */}
      <div className="p-3 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full ${isMobile || collapsed ? 'px-2' : 'justify-start'}`}
        >
          <Menu className="w-4 h-4" />
          {!isMobile && !collapsed && <span className="ml-2">Menu</span>}
        </Button>
      </div>

      <div className="flex-1 p-2 space-y-4 overflow-y-auto custom-scrollbar">
        {/* Temas */}
        <div className="space-y-2">
          {!isMobile && !collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground px-2">
              Temas
            </h3>
          )}
          <div className="space-y-1">
            {themes.map((theme) => {
              const IconComponent = theme.icon;
              const isActive = themeSelection === theme.id;
              return (
                <Button
                  key={theme.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full ${isMobile || collapsed ? 'px-2 justify-center' : 'justify-start'} h-10 transition-all duration-200`}
                  onClick={() => setThemeSelection(theme.id)}
                  style={isActive ? { backgroundColor: theme.color, color: 'white' } : {}}
                >
                  <IconComponent className="w-4 h-4" />
                  {!isMobile && !collapsed && <span className="ml-2">{theme.label}</span>}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Personas */}
        <div className="space-y-2">
          {!isMobile && !collapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground px-2">
              Assistente
            </h3>
          )}
          <div className="space-y-1">
            {personas.map((p) => {
              const IconComponent = p.icon;
              const isActive = persona === p.id;
              return (
                <Button
                  key={p.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full ${isMobile || collapsed ? 'px-2 justify-center' : 'justify-start'} h-10 transition-all duration-200`}
                  onClick={() => setPersona(p.id)}
                >
                  {isMobile || collapsed ? (
                    <span className="text-lg">{p.emoji}</span>
                  ) : (
                    <>
                      <IconComponent className="w-4 h-4" />
                      <span className="ml-2">{p.label}</span>
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Seção de figurinhas */}
        {!isMobile && !collapsed && (
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground px-2">
              Meu Álbum
            </h3>
            <Button
              variant="ghost"
              className="w-full justify-start h-10"
            >
              <Star className="w-4 h-4" />
              <span className="ml-2">Figurinhas (0)</span>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};