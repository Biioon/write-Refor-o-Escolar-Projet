import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LogIn, UserPlus, X } from "lucide-react";
import { validateEmail, validatePassword, sanitizeText } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

export const AuthModal = ({ isOpen, onClose, onSignIn, onSignUp }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    // Validate inputs
    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'signup') {
      const sanitizedName = sanitizeText(name);
      if (!sanitizedName.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, insira seu nome.",
          variant: "destructive",
        });
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        toast({
          title: "Senha inválida",
          description: passwordValidation.message,
          variant: "destructive",
        });
        return;
      }

      onSignUp(sanitizedName, email, password);
    } else {
      if (!password.trim()) {
        toast({
          title: "Senha obrigatória",
          description: "Por favor, insira sua senha.",
          variant: "destructive",
        });
        return;
      }
      onSignIn(email, password);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-xl">
            Bem-vindo ao Writer Reforço Escolar
          </DialogTitle>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="login" className="flex items-center gap-2 text-sm md:text-base">
              <LogIn className="w-4 h-4" />
              <span className="hidden xs:inline">Entrar</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2 text-sm md:text-base">
              <UserPlus className="w-4 h-4" />
              <span className="hidden xs:inline">Cadastrar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <Input
              placeholder="Seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border text-base h-12"
            />
            <Input
              placeholder="Sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border text-base h-12"
            />
            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-primary hover:opacity-90 h-12 text-base font-medium"
            >
              Entrar
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border text-base h-12"
            />
            <Input
              placeholder="Seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border text-base h-12"
            />
            <Input
              placeholder="Sua senha (mín. 8 caracteres)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-secondary border-border text-base h-12"
            />
            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-primary hover:opacity-90 h-12 text-base font-medium"
            >
              Criar Conta
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};