/**
 * Active Directory Authentication Service
 * Serviço para integração com Active Directory da PGE-SC
 */

export interface ADUser {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  department: string;
  title: string;
  phone?: string;
  groups: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ADAuthResponse {
  success: boolean;
  user?: ADUser;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  error?: string;
  errorCode?: string;
}

import { config } from '../config/environment';

class ActiveDirectoryService {
  private isInitialized: boolean = false;
  private authToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor() {
    // Log de configuração em desenvolvimento
    if (config.app.debug) {
      console.log('🔧 ActiveDirectoryService inicializado com configurações:', {
        enabled: config.activeDirectory.enabled,
        domain: config.activeDirectory.domain,
        mockAuth: config.features.mockAuthForDevelopment
      });
    }
  }

  /**
   * Inicializa o serviço AD
   */
  async initialize(): Promise<boolean> {
    try {
      if (config.app.debug) {
        console.log('🔌 Inicializando conexão com Active Directory...');
        console.log('📍 Servidor:', config.activeDirectory.serverUrl);
        console.log('🏢 Domínio:', config.activeDirectory.domain);
      }
      
      // Em ambiente de desenvolvimento, apenas simular
      if (config.features.mockAuthForDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.isInitialized = true;
        if (config.app.debug) {
          console.log('✅ Modo de desenvolvimento: autenticação simulada habilitada');
        }
        return true;
      }

      // Em produção, fazer conexão real com AD
      if (config.activeDirectory.enabled) {
        // TODO: Implementar conexão LDAP real
        // const ldapClient = new LDAPClient(config.activeDirectory);
        // await ldapClient.connect();
        
        // Por enquanto simular para demonstração
        await new Promise(resolve => setTimeout(resolve, config.activeDirectory.timeout));
        this.isInitialized = true;
        
        if (config.app.debug) {
          console.log('✅ Conexão com Active Directory estabelecida');
        }
        return true;
      }

      console.warn('⚠️ Active Directory não habilitado nas configurações');
      return false;
    } catch (error) {
      console.error('❌ Erro ao inicializar conexão com AD:', error);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Autentica usuário via Active Directory
   */
  async authenticateUser(email: string, password: string): Promise<ADAuthResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Validar formato do email
      if (!this.isValidPGEEmail(email)) {
        return {
          success: false,
          error: `Email deve ser de um dos domínios: ${config.security.requireEmailDomain.join(', ')}`,
          errorCode: 'INVALID_DOMAIN'
        };
      }

      // Simular autenticação AD (em produção seria uma chamada LDAP real)
      console.log(`Autenticando usuário: ${email}`);
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Para demonstração, vamos simular usuários válidos
      const mockUser = await this.getMockADUser(email, password);
      
      if (!mockUser) {
        return {
          success: false,
          error: 'Credenciais inválidas ou usuário não encontrado no Active Directory',
          errorCode: 'INVALID_CREDENTIALS'
        };
      }

      // Gerar tokens
      const tokens = await this.generateTokens(mockUser);

      return {
        success: true,
        user: mockUser,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt
      };

    } catch (error) {
      console.error('Erro na autenticação AD:', error);
      return {
        success: false,
        error: 'Erro interno do servidor de autenticação',
        errorCode: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Valida token de acesso
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Em produção, validaria o token JWT
      // Por enquanto, simular validação
      return token === this.authToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date();
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  /**
   * Renova token de acesso usando refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<ADAuthResponse> {
    try {
      if (refreshToken !== this.refreshToken) {
        return {
          success: false,
          error: 'Refresh token inválido',
          errorCode: 'INVALID_REFRESH_TOKEN'
        };
      }

      // Simular renovação de token
      const newTokens = await this.generateTokens();

      return {
        success: true,
        token: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresAt: newTokens.expiresAt
      };

    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return {
        success: false,
        error: 'Erro ao renovar token de acesso',
        errorCode: 'REFRESH_ERROR'
      };
    }
  }

  /**
   * Busca usuário no Active Directory
   */
  async getUserByEmail(email: string): Promise<ADUser | null> {
    try {
      if (!this.isValidPGEEmail(email)) {
        return null;
      }

      // Em produção seria uma query LDAP real
      return await this.getMockADUser(email);
    } catch (error) {
      console.error('Erro ao buscar usuário no AD:', error);
      return null;
    }
  }

  /**
   * Busca grupos do usuário
   */
  async getUserGroups(email: string): Promise<string[]> {
    try {
      const user = await this.getUserByEmail(email);
      return user?.groups || [];
    } catch (error) {
      console.error('Erro ao buscar grupos do usuário:', error);
      return [];
    }
  }

  /**
   * Verifica se usuário é administrador
   */
  async isUserAdmin(email: string): Promise<boolean> {
    try {
      const groups = await this.getUserGroups(email);
      return groups.includes('PGE_Admins') || groups.includes('Domain Admins');
    } catch (error) {
      console.error('Erro ao verificar permissões de admin:', error);
      return false;
    }
  }

  /**
   * Logout do usuário
   */
  async logout(): Promise<void> {
    try {
      this.authToken = null;
      this.refreshToken = null;
      this.tokenExpiresAt = null;
      
      // Limpar localStorage
      localStorage.removeItem('pge-auth-token');
      localStorage.removeItem('pge-refresh-token');
      localStorage.removeItem('pge-token-expires');
      
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  }

  // Métodos privados

  /**
   * Valida se email é de um domínio autorizado
   */
  private isValidPGEEmail(email: string): boolean {
    const emailLower = email.toLowerCase();
    return config.security.requireEmailDomain.some(domain => 
      emailLower.endsWith(`@${domain}`)
    );
  }

  /**
   * Gera tokens de acesso e refresh
   */
  private async generateTokens(user?: ADUser): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    // Em produção, seria gerado um JWT real com bibliotecas como jsonwebtoken
    const accessToken = `access_token_${Date.now()}_${Math.random()}`;
    const refreshToken = `refresh_token_${Date.now()}_${Math.random()}`;
    
    // Usar configurações centralizadas para expiração
    const expiresAt = new Date(Date.now() + config.session.tokenExpirationHours * 60 * 60 * 1000);

    this.authToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiresAt = expiresAt;

    // Salvar tokens no localStorage
    localStorage.setItem('pge-auth-token', accessToken);
    localStorage.setItem('pge-refresh-token', refreshToken);
    localStorage.setItem('pge-token-expires', expiresAt.toISOString());

    if (config.app.debug) {
      console.log('🔑 Tokens gerados:', {
        expiresAt: expiresAt.toISOString(),
        expirationHours: config.session.tokenExpirationHours
      });
    }

    return {
      accessToken,
      refreshToken,
      expiresAt
    };
  }

  /**
   * Simula usuários do Active Directory para demonstração
   */
  private async getMockADUser(email: string, password?: string): Promise<ADUser | null> {
    // Simular usuários do AD da PGE-SC
    const mockUsers: Record<string, ADUser> = {
      'joao.silva@pge.sc.gov.br': {
        id: '1001',
        email: 'joao.silva@pge.sc.gov.br',
        displayName: 'João Silva',
        firstName: 'João',
        lastName: 'Silva',
        department: 'Procuradoria Administrativa',
        title: 'Procurador do Estado',
        phone: '+55 48 3221-0001',
        groups: ['PGE_Users', 'PA_Team'],
        isActive: true,
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      'maria.santos@pge.sc.gov.br': {
        id: '1002',
        email: 'maria.santos@pge.sc.gov.br',
        displayName: 'Maria Santos',
        firstName: 'Maria',
        lastName: 'Santos',
        department: 'Procuradoria Judicial',
        title: 'Procuradora do Estado',
        phone: '+55 48 3221-0002',
        groups: ['PGE_Users', 'PJ_Team'],
        isActive: true,
        createdAt: new Date('2023-02-10'),
        updatedAt: new Date()
      },
      'pedro.oliveira@pge.sc.gov.br': {
        id: '1003',
        email: 'pedro.oliveira@pge.sc.gov.br',
        displayName: 'Pedro Oliveira',
        firstName: 'Pedro',
        lastName: 'Oliveira',
        department: 'Tecnologia da Informação',
        title: 'Analista de Sistemas',
        phone: '+55 48 3221-0003',
        groups: ['PGE_Users', 'TI_Team'],
        isActive: true,
        createdAt: new Date('2023-03-05'),
        updatedAt: new Date()
      },
      'ana.costa@pge.sc.gov.br': {
        id: '1004',
        email: 'ana.costa@pge.sc.gov.br',
        displayName: 'Ana Costa',
        firstName: 'Ana',
        lastName: 'Costa',
        department: 'Recursos Humanos',
        title: 'Analista de RH',
        phone: '+55 48 3221-0004',
        groups: ['PGE_Users', 'RH_Team'],
        isActive: true,
        createdAt: new Date('2023-04-12'),
        updatedAt: new Date()
      },
      'carlos.admin@pge.sc.gov.br': {
        id: '1005',
        email: 'carlos.admin@pge.sc.gov.br',
        displayName: 'Carlos Admin',
        firstName: 'Carlos',
        lastName: 'Administrador',
        department: 'Tecnologia da Informação',
        title: 'Coordenador de TI',
        phone: '+55 48 3221-0005',
        groups: ['PGE_Users', 'PGE_Admins', 'TI_Team'],
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date()
      }
    };

    const user = mockUsers[email.toLowerCase()];
    
    if (!user) {
      return null;
    }

    // Se a senha foi fornecida, simular validação (em produção seria validação LDAP real)
    if (password && password.length < 6) {
      return null;
    }

    // Atualizar último login
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    return user;
  }
}

// Singleton instance
export const adService = new ActiveDirectoryService();
export default adService;