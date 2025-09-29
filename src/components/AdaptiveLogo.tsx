import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import brasaoSCLight from 'figma:asset/36d872074029b5bb5766328c847b85f7bafaf753.png';

interface AdaptiveLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AdaptiveLogo({ className = '', size = 'md' }: AdaptiveLogoProps) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-20 h-20'
  };

  const containerClasses = {
    sm: 'w-8 h-8 p-0.5',
    md: 'w-12 h-12 p-1',
    lg: 'w-20 h-20 p-2'
  };

  // Para o tema escuro, aplicamos filtros para melhor contraste e visibilidade
  const imageStyle = theme === 'dark' ? {
    filter: 'brightness(0) invert(1) contrast(1.2)',
    transition: 'filter 0.3s ease'
  } : {
    transition: 'filter 0.3s ease'
  };

  return (
    <div className={`${containerClasses[size]} rounded-lg flex items-center justify-center bg-white dark:bg-white/5 dark:border-white/20 p-1 border border-border shadow-sm dark:shadow-none transition-all duration-300 ${className}`}>
      <ImageWithFallback 
        src={brasaoSCLight}
        alt="Brasão do Estado de Santa Catarina"
        className={`${sizeClasses[size]} object-contain transition-all duration-300`}
        style={imageStyle}
      />
    </div>
  );
}