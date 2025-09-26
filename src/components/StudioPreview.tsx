import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticleCanvas } from "./ParticleCanvas";
import { EducationalCalculator } from "./EducationalCalculator";
import { InteractiveMap } from "./InteractiveMap";
import { DigitalEbook } from "./DigitalEbook";
import { Sparkles, Calculator, Map, BookOpen, Play, Pause } from "lucide-react";

type PreviewMode = "welcome" | "calculator" | "map" | "ebook";

interface StudioPreviewProps {
  onTriggerReward?: () => void;
}

export const StudioPreview = ({ onTriggerReward }: StudioPreviewProps) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("welcome");
  const [particlesRunning, setParticlesRunning] = useState(true);

  const openPreview = (mode: PreviewMode) => {
    setPreviewMode(mode);
    if (onTriggerReward && mode !== "welcome") {
      // Trigger reward animation when opening interactive content
      setTimeout(() => onTriggerReward(), 500);
    }
  };

  const renderContent = () => {
    switch (previewMode) {
      case "calculator":
        return <EducationalCalculator />;
      case "map":
        return <InteractiveMap />;
      case "ebook":
        return <DigitalEbook />;
      default:
        return (
          <div className="text-center space-y-6 max-w-2xl mx-auto py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Estúdio Interativo de Aprendizado
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Aqui a IA abre ferramentas educativas incríveis! Experimente cada uma e descubra 
              como o aprendizado pode ser divertido e envolvente.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Button
                onClick={() => openPreview("calculator")}
                variant="outline"
                className="h-24 flex-col gap-2 bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20"
              >
                <Calculator className="w-8 h-8" />
                <span className="font-semibold">Calculadora</span>
                <Badge variant="secondary" className="text-xs">Matemática</Badge>
              </Button>
              
              <Button
                onClick={() => openPreview("map")}
                variant="outline"
                className="h-24 flex-col gap-2 bg-gradient-to-br from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 border-accent/20"
              >
                <Map className="w-8 h-8" />
                <span className="font-semibold">Mapa</span>
                <Badge variant="secondary" className="text-xs">Geografia</Badge>
              </Button>
              
              <Button
                onClick={() => openPreview("ebook")}
                variant="outline"
                className="h-24 flex-col gap-2 bg-gradient-to-br from-info/10 to-warning/10 hover:from-info/20 hover:to-warning/20 border-info/20"
              >
                <BookOpen className="w-8 h-8" />
                <span className="font-semibold">E-book</span>
                <Badge variant="secondary" className="text-xs">Ciências</Badge>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="relative h-full bg-card/95 backdrop-blur shadow-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Estúdio Educativo
        </CardTitle>
        <div className="flex items-center gap-2">
          {previewMode !== "welcome" && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setPreviewMode("welcome")}
            >
              ← Voltar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setParticlesRunning(!particlesRunning)}
            className="flex items-center gap-1"
          >
            {particlesRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Animar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative h-[calc(100%-5rem)] overflow-auto">
        {/* Particle background */}
        <div className="absolute inset-0">
          <ParticleCanvas running={particlesRunning} />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 h-full flex items-center justify-center p-4">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
};