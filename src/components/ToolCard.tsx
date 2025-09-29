import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (toolId: string) => void;
}

export function ToolCard({ 
  id, 
  name, 
  description, 
  icon, 
  isFavorite, 
  onClick, 
  onToggleFavorite 
}: ToolCardProps) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer group bg-card border border-border relative">
      {/* Botão de Favorito */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 w-8 h-8 p-0 opacity-70 hover:opacity-100 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(id);
        }}
      >
        <Star 
          className={`w-4 h-4 transition-colors duration-200 ${
            isFavorite 
              ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400' 
              : 'text-muted-foreground hover:text-yellow-500 dark:hover:text-yellow-400'
          }`} 
        />
      </Button>

      <CardContent className="p-6 flex flex-col h-full" onClick={onClick}>
        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 bg-muted/50">
            <div className="text-[--pge-blue]">
              {icon}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 text-center">
          <h3 className="font-semibold mb-2 text-foreground">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Botão de Acesso */}
        <Button
          className="w-full group/button bg-[--pge-blue] hover:bg-[--pge-blue]/90 border-[--pge-blue] text-white"
        >
          <span className="mr-2">Acessar</span>
          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200" />
        </Button>
      </CardContent>
    </Card>
  );
}