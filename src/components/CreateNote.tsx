import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

interface CreateNoteProps {
  onSave: (title: string, content: string) => void;
}

export const CreateNote = ({ onSave }: CreateNoteProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    onSave(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <Card className="p-6 m-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Nova Anotação
      </h3>
      
      <div className="space-y-4">
        <Input
          placeholder="Título da anotação"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-secondary border-border"
        />
        
        <Textarea
          placeholder="Escreva suas anotações aqui..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="bg-secondary border-border resize-none"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Save className="w-4 h-4" />
            Salvar Anotação
          </Button>
        </div>
      </div>
    </Card>
  );
};