import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Verificar preferência do sistema
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Aplicar tema ao documento
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setEffectiveTheme(newTheme);
  };

  // Salvar tema no localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('pge-theme', newTheme);
    
    if (newTheme === 'system') {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    } else {
      applyTheme(newTheme);
    }
  };

  // Carregar tema salvo e aplicar
  useEffect(() => {
    // Primeiro verificar se há tema no perfil do usuário
    const savedProfile = localStorage.getItem('pge-user-profile');
    let profileTheme: Theme | null = null;
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        profileTheme = parsed.theme;
      } catch (error) {
        console.error('Erro ao carregar tema do perfil:', error);
      }
    }
    
    // Usar tema do perfil se disponível, senão usar tema salvo diretamente
    const savedTheme = profileTheme || localStorage.getItem('pge-theme') as Theme;
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
      
      if (savedTheme === 'system') {
        const systemTheme = getSystemTheme();
        applyTheme(systemTheme);
      } else {
        applyTheme(savedTheme);
      }
    } else {
      // Se não há tema salvo, usar system como padrão
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    }
  }, []);

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      effectiveTheme,
      setTheme: handleSetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}