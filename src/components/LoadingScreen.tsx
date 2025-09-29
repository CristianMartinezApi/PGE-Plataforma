import React from "react";
import { AdaptiveLogo } from "./AdaptiveLogo";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AdaptiveLogo
            size="lg"
            className="rounded-full shadow-lg animate-pulse"
          />
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 border-4 border-muted border-t-4 border-t-[--pge-blue] rounded-full animate-spin mx-auto"></div>
          <h2 className="text-lg font-medium text-foreground">
            Carregando Plataforma...
          </h2>
          <p className="text-muted-foreground">
            Aguarde enquanto preparamos tudo para você
          </p>
        </div>
      </div>
    </div>
  );
}