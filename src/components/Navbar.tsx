import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, GraduationCap } from "lucide-react";
import { LearningLink } from "./LearningLink";

interface NavbarProps {
  user: User | null;
  onAuthOpen: () => void;
  onSignOut: () => void;
}

export const Navbar = ({ user, onAuthOpen, onSignOut }: NavbarProps) => {
  return (
    <nav className="bg-card border-b border-border px-3 md:px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-foreground truncate">Writer Reforço</h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Reforço Escolar Inteligente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
            <LearningLink />
          </div>
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs md:text-sm text-muted-foreground hidden md:block max-w-32 truncate">
                Olá, {user.user_metadata?.name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                className="flex items-center gap-1 md:gap-2 h-9 md:h-10 px-2 md:px-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={onAuthOpen}
              className="bg-gradient-primary hover:opacity-90 h-9 md:h-10 px-3 md:px-4"
            >
              <LogIn className="w-4 h-4 mr-1 md:mr-2" />
              <span className="text-sm md:text-base">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};