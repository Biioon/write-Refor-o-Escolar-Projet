import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, Star } from "lucide-react";

interface Region {
  id: string;
  name: string;
  capital: string;
  info: string;
  coordinates: { x: number; y: number };
}

const brazilRegions: Region[] = [
  {
    id: "norte",
    name: "Região Norte",
    capital: "Manaus (AM)",
    info: "Rica em biodiversidade, possui a maior floresta tropical do mundo.",
    coordinates: { x: 30, y: 20 }
  },
  {
    id: "nordeste", 
    name: "Região Nordeste",
    capital: "Salvador (BA)",
    info: "Famosa pelas praias, cultura e culinária típica.",
    coordinates: { x: 70, y: 30 }
  },
  {
    id: "centro-oeste",
    name: "Região Centro-Oeste", 
    capital: "Brasília (DF)",
    info: "Centro político do país e porta de entrada do Pantanal.",
    coordinates: { x: 40, y: 50 }
  },
  {
    id: "sudeste",
    name: "Região Sudeste",
    capital: "São Paulo (SP)", 
    info: "Centro econômico e financeiro do Brasil.",
    coordinates: { x: 60, y: 70 }
  },
  {
    id: "sul",
    name: "Região Sul",
    capital: "Porto Alegre (RS)",
    info: "Conhecida pelo clima mais frio e forte colonização europeia.",
    coordinates: { x: 50, y: 85 }
  }
];

export const InteractiveMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/95 backdrop-blur shadow-card">
      <CardHeader>
        <CardTitle className="text-center flex items-center gap-2 justify-center">
          <Globe className="w-6 h-6" />
          Mapa Interativo do Brasil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-gradient-to-b from-accent/20 to-primary/20 rounded-lg p-8 min-h-[400px] overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🌴</div>
            <div className="absolute top-8 right-8 text-4xl">🏖️</div>
            <div className="absolute bottom-8 left-8 text-5xl">🌾</div>
            <div className="absolute bottom-4 right-4 text-4xl">🏔️</div>
          </div>
          
          {/* Map regions */}
          {brazilRegions.map((region) => (
            <Button
              key={region.id}
              variant={selectedRegion?.id === region.id ? "default" : "outline"}
              size="sm"
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                hoveredRegion === region.id ? "scale-110 shadow-glow" : ""
              }`}
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`
              }}
              onClick={() => setSelectedRegion(region)}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {region.name.split(" ")[1]}
            </Button>
          ))}
          
          {/* Brasil outline decoration */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-8xl opacity-5 select-none">🇧🇷</div>
          </div>
        </div>
        
        {selectedRegion && (
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-accent mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{selectedRegion.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Capital principal:</strong> {selectedRegion.capital}
                  </p>
                  <p className="text-sm">{selectedRegion.info}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!selectedRegion && (
          <Card className="bg-muted/20">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">
                Clique em uma região do mapa para descobrir informações interessantes! 🗺️
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};