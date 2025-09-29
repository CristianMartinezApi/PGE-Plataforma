import React from 'react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-foreground">
              © 2025 Procuradoria-Geral do Estado de Santa Catarina
            </p>
            <p className="text-xs text-muted-foreground">
              Todos os direitos reservados
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              Desenvolvido pela equipe EPPE da PGE-SC
            </p>
            <p className="text-xs text-muted-foreground">
              Versão 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}