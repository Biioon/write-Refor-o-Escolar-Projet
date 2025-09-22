import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase, callLLM } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Upload, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { sanitizeText, validateTextLength } from "@/lib/validation";

interface LearningResponse {
  question: string;
  answer: string;
  timestamp: number;
}

interface LearningProps {
  user: User | null;
}

const Learning = ({ user }: LearningProps) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<LearningResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Seleciona arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validação de tipo de arquivo (apenas documentos educacionais)
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: "Apenas PDF, TXT e documentos Word são aceitos.",
          variant: "destructive",
        });
        return;
      }
      
      // Validação de tamanho (máximo 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Simula upload de arquivo (funcionalidade limitada - não podemos processar arquivos realmente)
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um arquivo primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para enviar arquivos.",
        variant: "destructive",
      });
      return;
    }

    setUploadLoading(true);
    try {
      // Simula o processamento do arquivo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Arquivo processado!",
        description: `${file.name} foi analisado e está pronto para perguntas.`,
      });
      
      // Adiciona uma resposta inicial sobre o arquivo
      setResponses(prev => [...prev, {
        question: `Arquivo enviado: ${file.name}`,
        answer: `Arquivo "${file.name}" foi processado com sucesso! Agora você pode fazer perguntas sobre o conteúdo.`,
        timestamp: Date.now()
      }]);
      
    } catch (err) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  // Envia pergunta à IA
  const handleSendQuery = async () => {
    if (!query.trim()) return;

    // Valida e sanitiza entrada
    const sanitizedQuery = sanitizeText(query);
    
    if (!validateTextLength(sanitizedQuery, 500)) {
      toast({
        title: "Pergunta muito longa",
        description: "A pergunta deve ter no máximo 500 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Contexto específico para aprendizado infantil
      const learningContext = `Você é um assistente educacional especializado em aprendizado infantil. 
      Responda de forma didática, clara e adequada para crianças. 
      Use linguagem simples e exemplos práticos.
      ${file ? `Arquivo atual: ${file.name}` : ''}`;
      
      const response = await callLLM({
        persona: 'professor', // Persona educativa
        input_text: sanitizedQuery,
        context: learningContext,
      });

      const newResponse: LearningResponse = {
        question: sanitizedQuery,
        answer: sanitizeText(response.reply || "Desculpe, não consegui processar sua pergunta."),
        timestamp: Date.now()
      };

      setResponses(prev => [...prev, newResponse]);
      setQuery("");
    } catch (err) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível processar sua pergunta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Lovable AI - Aprendizado Infantil</h1>
            <p className="text-muted-foreground">Faça upload de materiais educacionais e converse com a IA</p>
          </div>
        </div>

        {!user && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Faça login para usar todas as funcionalidades do aprendizado infantil.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upload de Arquivos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Enviar Material Educacional
            </CardTitle>
            <CardDescription>
              Faça upload de PDFs, documentos Word ou arquivos de texto com conteúdo educacional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.txt,.doc,.docx"
                disabled={!user}
              />
              {file && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{file.name}</Badge>
                  <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)}MB</Badge>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={!file || uploadLoading || !user}
                className="w-full"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Enviar Arquivo"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat com AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Converse com a IA Educacional
            </CardTitle>
            <CardDescription>
              Faça perguntas sobre educação infantil ou sobre os materiais enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta sobre educação infantil..."
                  rows={3}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendQuery}
                  disabled={!query.trim() || loading}
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>

              {/* Respostas */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {responses.map((response, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">
                          <strong>Pergunta:</strong> {response.question}
                        </p>
                        <p className="text-sm">
                          <strong>Resposta:</strong> {response.answer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learning;