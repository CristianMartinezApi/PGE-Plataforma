import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ToolLayoutProps {
  toolName: string;
  toolDescription: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onBack: () => void;
  onHome: () => void;
}

export function ToolLayout({ 
  toolName, 
  toolDescription, 
  icon, 
  children, 
  onBack, 
  onHome 
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header da Ferramenta */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navegação e Título */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50"
                >
                  <div className="text-[--pge-blue]">
                    {icon}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    {toolName}
                  </h1>
                  <p className="text-sm text-muted-foreground">{toolDescription}</p>
                </div>
              </div>
            </div>

            {/* Botão Home */}
            <Button
              variant="outline"
              size="sm"
              onClick={onHome}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo da Ferramenta */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}