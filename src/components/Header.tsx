import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { AdaptiveLogo } from './AdaptiveLogo';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <AdaptiveLogo size="md" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                PGE - Plataforma
              </h1>
              <p className="text-sm text-muted-foreground">Procuradoria-Geral do Estado de Santa Catarina</p>
            </div>
          </div>

          {/* Campo de Busca */}
          <div className="flex-1 max-w-2xl ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar ferramentas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full bg-muted/30 border-border focus:border-[--pge-blue] focus:ring-[--pge-blue] text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}