import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";

interface EbookPage {
  id: number;
  title: string;
  content: string;
  image?: string;
}

const ebookPages: EbookPage[] = [
  {
    id: 1,
    title: "O que são Aracnídeos?",
    content: "Os aracnídeos são uma classe de artrópodes que incluem aranhas, escorpiões, carrapatos e ácaros. Eles possuem oito patas e não têm antenas nem asas. Seu corpo é dividido em duas partes: cefalotórax e abdômen.",
    image: "🕷️"
  },
  {
    id: 2, 
    title: "Características Principais",
    content: "• 8 patas articuladas\n• Corpo dividido em cefalotórax e abdômen\n• Respiração através de pulmões foliáceos ou traqueias\n• Alimentação principalmente carnívora\n• Digestão externa (injetam enzimas na presa)",
    image: "🔬"
  },
  {
    id: 3,
    title: "Tipos de Aracnídeos",
    content: "Aranhas 🕷️: Produzem teias e veneno\nEscorpiões 🦂: Possuem cauda com ferrão\nCarrapatos: Parasitas que se alimentam de sangue\nÁcaros: Microscópicos, vivem no solo e plantas",
    image: "🦂"
  },
  {
    id: 4,
    title: "Importância Ecológica",
    content: "Os aracnídeos são fundamentais para o equilíbrio dos ecossistemas. As aranhas controlam populações de insetos, enquanto outros aracnídeos ajudam na decomposição da matéria orgânica. Eles são predadores naturais muito eficientes!",
    image: "🌿"
  }
];

export const DigitalEbook = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage(prev => (prev + 1) % ebookPages.length);
  };

  const prevPage = () => {
    setCurrentPage(prev => (prev - 1 + ebookPages.length) % ebookPages.length);
  };

  const currentContent = ebookPages[currentPage];

  return (
    <Card className="w-full max-w-3xl mx-auto bg-card/95 backdrop-blur shadow-card">
      <CardHeader>
        <CardTitle className="text-center flex items-center gap-2 justify-center">
          <BookOpen className="w-6 h-6" />
          E-book Digital: Aracnídeos
        </CardTitle>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">Ciências</Badge>
          <Badge variant="outline">Biologia</Badge>
          <Badge variant="outline">Educativo</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Page content */}
        <div className="bg-background/50 rounded-lg p-6 min-h-[300px] border">
          <div className="text-center mb-4">
            <div className="text-6xl mb-4">{currentContent.image}</div>
            <h2 className="text-2xl font-bold mb-4">{currentContent.title}</h2>
          </div>
          
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="leading-relaxed whitespace-pre-line text-center">
              {currentContent.content}
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {ebookPages.length}
            </span>
            <div className="flex gap-1">
              {ebookPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={nextPage}
            disabled={currentPage === ebookPages.length - 1}
            className="flex items-center gap-2"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 justify-center pt-4 border-t">
          <Button variant="default" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};