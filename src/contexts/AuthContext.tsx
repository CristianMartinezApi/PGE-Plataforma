/**
 * Authentication Context with Active Directory Integration
 * Contexto de autenticação integrado com Active Directory
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import adService, { ADUser, ADAuthResponse } from '../services/ActiveDirectoryService';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  user: ADUser | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
  isAdmin: () => boolean;
  hasPermission: (group: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado de autenticação
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null,
    error: null
  });

  // Verificar sessão existente ao carregar
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Auto-refresh token antes de expirar
  useEffect(() => {
    if (authState.token && authState.expiresAt) {
      const timeUntilExpiry = authState.expiresAt.getTime() - Date.now();
      const refreshTime = timeUntilExpiry - 5 * 60 * 1000; // 5 minutos antes

      if (refreshTime > 0) {
        const refreshTimeout = setTimeout(() => {
          refreshAuth();
        }, refreshTime);

        return () => clearTimeout(refreshTimeout);
      }
    }
  }, [authState.token, authState.expiresAt]);

  /**
   * Verifica se existe uma sessão salva
   */
  const checkExistingSession = async (): Promise<void> => {
    try {
      const savedToken = localStorage.getItem('pge-auth-token');
      const savedRefreshToken = localStorage.getItem('pge-refresh-token');
      const savedExpires = localStorage.getItem('pge-token-expires');
      const savedUser = localStorage.getItem('pge-user');

      if (savedToken && savedUser && savedExpires) {
        const expiresAt = new Date(savedExpires);
        const user = JSON.parse(savedUser) as ADUser;

        // Verificar se o token ainda é válido
        if (expiresAt > new Date()) {
          const isValid = await adService.validateToken(savedToken);
          
          if (isValid) {
            setAuthState(prev => ({
              ...prev,
              isAuthenticated: true,
              user,
              token: savedToken,
              refreshToken: savedRefreshToken,
              expiresAt,
              isInitializing: false
            }));
            
            console.log('Sessão restaurada com sucesso');
            return;
          }
        }

        // Token expirado, tentar renovar
        if (savedRefreshToken) {
          const refreshResult = await adService.refreshAccessToken(savedRefreshToken);
          
          if (refreshResult.success && refreshResult.token) {
            updateAuthState({
              isAuthenticated: true,
              user,
              token: refreshResult.token,
              refreshToken: refreshResult.refreshToken || savedRefreshToken,
              expiresAt: refreshResult.expiresAt || expiresAt
            });
            
            console.log('Token renovado automaticamente');
            return;
          }
        }

        // Limpar dados inválidos
        clearStoredAuth();
      }
    } catch (error) {
      console.error('Erro ao verificar sessão existente:', error);
      clearStoredAuth();
    } finally {
      setAuthState(prev => ({ ...prev, isInitializing: false }));
    }
  };

  /**
   * Realiza login do usuário
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      const response: ADAuthResponse = await adService.authenticateUser(email, password);

      if (response.success && response.user && response.token) {
        const authData = {
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken || null,
          expiresAt: response.expiresAt || null
        };

        updateAuthState(authData);
        saveAuthToStorage(authData);

        console.log('Login realizado com sucesso:', response.user.displayName);
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          error: response.error || 'Erro de autenticação desconhecido'
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }));
      console.error('Erro durante login:', error);
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = async (): Promise<void> => {
    try {
      await adService.logout();
      clearStoredAuth();
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        user: null,
        token: null,
        refreshToken: null,
        expiresAt: null,
        error: null
      });

      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  /**
   * Renova token de autenticação
   */
  const refreshAuth = async (): Promise<boolean> => {
    try {
      if (!authState.refreshToken) {
        console.warn('Refresh token não encontrado');
        return false;
      }

      const response = await adService.refreshAccessToken(authState.refreshToken);

      if (response.success && response.token) {
        const updatedAuth = {
          token: response.token,
          refreshToken: response.refreshToken || authState.refreshToken,
          expiresAt: response.expiresAt || authState.expiresAt
        };

        updateAuthState(updatedAuth);
        saveAuthToStorage({ ...authState, ...updatedAuth });

        console.log('Token renovado com sucesso');
        return true;
      } else {
        console.error('Falha ao renovar token:', response.error);
        await logout(); // Forçar novo login
        return false;
      }
    } catch (error) {
      console.error('Erro ao renovar autenticação:', error);
      await logout();
      return false;
    }
  };

  /**
   * Limpa erro de autenticação
   */
  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  /**
   * Verifica se usuário é administrador
   */
  const isAdmin = (): boolean => {
    if (!authState.user) return false;
    return authState.user.groups.includes('PGE_Admins') || 
           authState.user.groups.includes('Domain Admins');
  };

  /**
   * Verifica se usuário tem permissão específica
   */
  const hasPermission = (group: string): boolean => {
    if (!authState.user) return false;
    return authState.user.groups.includes(group);
  };

  // Funções auxiliares

  /**
   * Atualiza estado de autenticação
   */
  const updateAuthState = (updates: Partial<AuthState>): void => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  /**
   * Salva dados de autenticação no localStorage
   */
  const saveAuthToStorage = (data: Partial<AuthState>): void => {
    try {
      if (data.token) {
        localStorage.setItem('pge-auth-token', data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem('pge-refresh-token', data.refreshToken);
      }
      if (data.expiresAt) {
        localStorage.setItem('pge-token-expires', data.expiresAt.toISOString());
      }
      if (data.user) {
        localStorage.setItem('pge-user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Erro ao salvar dados de autenticação:', error);
    }
  };

  /**
   * Remove dados de autenticação do localStorage
   */
  const clearStoredAuth = (): void => {
    try {
      localStorage.removeItem('pge-auth-token');
      localStorage.removeItem('pge-refresh-token');
      localStorage.removeItem('pge-token-expires');
      localStorage.removeItem('pge-user');
      localStorage.removeItem('pge-authenticated'); // Compatibilidade com sistema antigo
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
    }
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshAuth,
    clearError,
    isAdmin,
    hasPermission
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;