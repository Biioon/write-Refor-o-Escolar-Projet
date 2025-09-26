import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EducationalCalculator = () => {
  const [display, setDisplay] = useState("");
  const [lastOperation, setLastOperation] = useState("");
  
  const handlePress = (value: string) => {
    if (value === "C") {
      setDisplay("");
      setLastOperation("");
      return;
    }
    
    if (value === "=") {
      try {
        // Safe evaluation using Function constructor
        const result = Function(`"use strict"; return (${display})`)();
        setLastOperation(`${display} = ${result}`);
        setDisplay(String(result));
      } catch {
        setDisplay("Erro");
        setLastOperation("");
      }
      return;
    }
    
    setDisplay(prev => prev + value);
  };

  const buttons = [
    { value: "C", variant: "destructive" as const, className: "col-span-2" },
    { value: "⌫", variant: "secondary" as const },
    { value: "/", variant: "secondary" as const },
    { value: "7", variant: "outline" as const },
    { value: "8", variant: "outline" as const },
    { value: "9", variant: "outline" as const },
    { value: "*", variant: "secondary" as const },
    { value: "4", variant: "outline" as const },
    { value: "5", variant: "outline" as const },
    { value: "6", variant: "outline" as const },
    { value: "-", variant: "secondary" as const },
    { value: "1", variant: "outline" as const },
    { value: "2", variant: "outline" as const },
    { value: "3", variant: "outline" as const },
    { value: "+", variant: "secondary" as const },
    { value: "0", variant: "outline" as const, className: "col-span-2" },
    { value: ".", variant: "outline" as const },
    { value: "=", variant: "default" as const },
  ];

  return (
    <Card className="w-full max-w-md mx-auto bg-card/95 backdrop-blur shadow-card">
      <CardHeader>
        <CardTitle className="text-center flex items-center gap-2 justify-center">
          🧮 Calculadora Educativa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastOperation && (
          <div className="text-sm text-muted-foreground text-right p-2 rounded bg-muted/50">
            {lastOperation}
          </div>
        )}
        
        <div className="text-right text-2xl font-mono p-4 rounded bg-background border min-h-[60px] flex items-center justify-end">
          {display || "0"}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              onClick={() => button.value === "⌫" ? setDisplay(prev => prev.slice(0, -1)) : handlePress(button.value)}
              className={`h-12 text-lg font-semibold ${button.className || ""}`}
            >
              {button.value}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};