import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { LearningLink } from "./LearningLink";

interface NavbarProps {
  user: User | null;
  onAuthOpen: () => void;
  onSignOut: () => void;
}

export const Navbar = ({ user, onAuthOpen, onSignOut }: NavbarProps) => {
  return (
    <nav className="flex items-center justify-between bg-background border-b border-border px-6 h-16 shadow-card">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          BII0ON
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <LearningLink />
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
              <UserIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        ) : (
          <Button
            onClick={onAuthOpen}
            className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Button>
        )}
      </div>
    </nav>
  );
};