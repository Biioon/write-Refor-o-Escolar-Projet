import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Palette, 
  TreePine, 
  Rocket,
  Users,
  Heart,
  GraduationCap
} from "lucide-react";

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
  const themes = [
    { id: 'default', icon: Palette, label: 'Padrão' },
    { id: 'aventura', icon: TreePine, label: 'Aventura' },
    { id: 'espaco', icon: Rocket, label: 'Espaço' }
  ];

  const personas = [
    { id: 'amigo', icon: Users, label: 'Amigo(a)' },
    { id: 'pai', icon: Heart, label: 'Pai/Mãe' },
    { id: 'professor', icon: GraduationCap, label: 'Professor(a)' }
  ];

  return (
    <aside className="w-64 bg-background border-r border-border p-4 flex flex-col gap-6">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Temas Visuais
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            return (
              <Button
                key={theme.id}
                variant={themeSelection === theme.id ? "default" : "ghost"}
                className="justify-start gap-2 h-auto py-2"
                onClick={() => setThemeSelection(theme.id)}
              >
                <IconComponent className="w-4 h-4" />
                {theme.label}
              </Button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Personalidade do Assistente
        </h3>
        <div className="flex flex-col gap-2">
          {personas.map((p) => {
            const IconComponent = p.icon;
            return (
              <Button
                key={p.id}
                variant={persona === p.id ? "default" : "ghost"}
                className="justify-start gap-2 h-auto py-3"
                onClick={() => setPersona(p.id)}
              >
                <IconComponent className="w-4 h-4" />
                {p.label}
              </Button>
            );
          })}
        </div>
      </Card>
    </aside>
  );
};