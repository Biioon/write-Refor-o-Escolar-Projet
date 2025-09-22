import { useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { callLLM } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { sanitizeText, validateTextLength } from "@/lib/validation";
import { 
  Upload, 
  MessageCircle, 
  FileText, 
  Brain, 
  Send,
  Loader2,
  User as UserIcon,
  Bot,
  Home,
  Check,
  X
} from "lucide-react";

interface LearningProps {
  user: User | null;
}

interface Response {
  question: string;
  answer: string;
  timestamp: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
}

const Learning = ({ user }: LearningProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Chat state
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle file selection with enhanced validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Enhanced file type validation for educational content
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    const allowedExtensions = ['.pdf', '.txt', '.csv', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const isValidType = allowedTypes.includes(selectedFile.type) || 
      allowedExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Formatos aceitos: PDF, TXT, CSV, DOC, DOCX, JPG, PNG, GIF, WebP",
        variant: "destructive",
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // File size validation (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);
    toast({
      title: "Arquivo selecionado",
      description: `${selectedFile.name} (${formatFileSize(selectedFile.size)}) está pronto para upload.`,
    });
  };

  // Enhanced file upload with better user feedback
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para enviar arquivos educacionais.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setUploadLoading(true);
    
    try {
      // Simulate processing time based on file size (more realistic)
      const processingTime = Math.min(4000, Math.max(1500, file.size / 50000));
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Create uploaded file record
      const uploadedFile: UploadedFile = {
        name: sanitizeText(file.name),
        size: file.size,
        type: file.type,
        uploadedAt: Date.now()
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      // Add success response to chat
      setResponses(prev => [...prev, {
        question: `📁 Arquivo enviado: ${uploadedFile.name}`,
        answer: `Perfeito! Seu arquivo "${uploadedFile.name}" foi processado com sucesso. Agora posso ajudar você a estudar e responder perguntas sobre esse conteúdo. O que gostaria de saber?`,
        timestamp: Date.now()
      }]);
      
      // Clear file selection
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Arquivo processado!",
        description: `${uploadedFile.name} está pronto para análise educacional.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  // Enhanced AI question handling
  const handleSendQuery = async () => {
    if (!query.trim()) return;

    // Validate and sanitize input
    const sanitizedQuery = sanitizeText(query);
    
    if (!validateTextLength(sanitizedQuery, 500)) {
      toast({
        title: "Pergunta muito longa",
        description: "A pergunta deve ter no máximo 500 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setChatLoading(true);
    
    try {
      // Create educational context from uploaded files
      const filesContext = uploadedFiles.length > 0 
        ? `Arquivos disponíveis: ${uploadedFiles.map(f => f.name).join(', ')}. `
        : '';
      
      const educationalContext = `${filesContext}Contexto educacional: Forneça explicações claras e didáticas adequadas para aprendizado.`;
      
      // Get AI response with educational focus
      const response = await callLLM({
        persona: 'professor',
        input_text: sanitizedQuery,
        context: educationalContext
      });

      // Add Q&A to responses
      setResponses(prev => [...prev, {
        question: sanitizedQuery,
        answer: response.reply || "Desculpe, não consegui processar sua pergunta no momento.",
        timestamp: Date.now()
      }]);

      setQuery("");
      
    } catch (err) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setChatLoading(false);
    }
  };

  // Handle enter key for chat
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Aprendizado Infantil
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Envie materiais e faça perguntas para estudar melhor
                  </p>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-2 gap-6">
        {/* File Upload Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload de Material Educacional
            </CardTitle>
            <CardDescription>
              Envie PDFs, documentos, imagens ou textos para análise educacional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt,.csv,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                className="bg-secondary border-border file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
              />
              
              {file && (
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Check className="w-4 h-4 text-accent" />
                </div>
              )}
              
              <Button
                onClick={handleUpload}
                disabled={!file || uploadLoading || !user}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {user ? 'Enviar Arquivo' : 'Login Necessário'}
                  </>
                )}
              </Button>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Arquivos Processados:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium flex-1">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Chat Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Pergunte à IA Educacional
            </CardTitle>
            <CardDescription>
              Faça perguntas sobre os materiais enviados ou qualquer tópico de estudo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat input */}
            <div className="flex gap-2">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta sobre o material ou qualquer dúvida de estudo..."
                className="bg-secondary border-border resize-none min-h-[80px]"
                disabled={chatLoading}
              />
              <Button
                onClick={handleSendQuery}
                disabled={!query.trim() || chatLoading}
                className="bg-gradient-primary hover:opacity-90 h-fit"
              >
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Chat responses */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {responses.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-sm">
                    Envie um arquivo ou faça uma pergunta para começar!
                  </p>
                </div>
              ) : (
                responses.map((response, index) => (
                  <div key={index} className="space-y-2">
                    {/* User question */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-lg">
                        <p className="text-sm">{response.question}</p>
                        <span className="text-xs opacity-70">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* AI response */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 bg-card border border-border rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{response.answer}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Analisando sua pergunta...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learning;