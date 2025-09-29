/**
 * Environment Configuration
 * Configurações de ambiente para a PGE Plataforma
 */

export interface EnvironmentConfig {
  // Configurações gerais
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };

  // Configurações de Active Directory
  activeDirectory: {
    enabled: boolean;
    domain: string;
    serverUrl: string;
    baseDN: string;
    userGroupDN: string;
    adminGroupDN: string;
    sslEnabled: boolean;
    timeout: number;
  };

  // URLs e endpoints
  api: {
    baseUrl: string;
    authEndpoint: string;
    timeout: number;
    retryAttempts: number;
  };

  // Configurações de sessão
  session: {
    tokenExpirationHours: number;
    refreshTokenExpirationDays: number;
    rememberMeDays: number;
    autoRefreshMinutes: number;
  };

  // Configurações de segurança
  security: {
    passwordMinLength: number;
    loginAttemptsLimit: number;
    lockoutDurationMinutes: number;
    requireEmailDomain: string[];
  };

  // Features habilitadas
  features: {
    mockAuthForDevelopment: boolean;
    autoLogin: boolean;
    ssoEnabled: boolean;
    auditLogging: boolean;
  };
}

// Função auxiliar para acessar variáveis de ambiente de forma segura
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Verificar se estamos no ambiente do navegador
  if (typeof window !== 'undefined') {
    // No navegador, as variáveis estão disponíveis via import.meta.env ou process.env
    return (window as any).__REACT_APP_ENV__?.[key] || defaultValue;
  }
  
  // Verificar se process está disponível (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

// Função para obter configurações baseadas no ambiente
const getEnvironmentConfig = (): EnvironmentConfig => {
  // Detectar ambiente de forma segura
  const nodeEnv = getEnvVar('NODE_ENV', 'development');
  const isDevelopment = nodeEnv === 'development';
  const isProduction = nodeEnv === 'production';

  return {
    app: {
      name: 'PGE - Plataforma',
      version: getEnvVar('REACT_APP_VERSION', '1.0.0'),
      environment: (nodeEnv as any) || 'development',
      debug: isDevelopment || getEnvVar('REACT_APP_DEBUG') === 'true'
    },

    activeDirectory: {
      enabled: getEnvVar('REACT_APP_AD_ENABLED') === 'true' || isProduction,
      domain: getEnvVar('REACT_APP_AD_DOMAIN', 'pge.sc.gov.br'),
      serverUrl: getEnvVar('REACT_APP_AD_SERVER_URL', 'ldaps://ad.pge.sc.gov.br:636'),
      baseDN: getEnvVar('REACT_APP_AD_BASE_DN', 'DC=pge,DC=sc,DC=gov,DC=br'),
      userGroupDN: getEnvVar('REACT_APP_AD_USER_GROUP', 'CN=PGE_Users,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br'),
      adminGroupDN: getEnvVar('REACT_APP_AD_ADMIN_GROUP', 'CN=PGE_Admins,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br'),
      sslEnabled: getEnvVar('REACT_APP_AD_SSL_ENABLED', 'true') !== 'false',
      timeout: parseInt(getEnvVar('REACT_APP_AD_TIMEOUT', '5000'))
    },

    api: {
      baseUrl: getEnvVar('REACT_APP_API_BASE_URL', isDevelopment ? 'http://localhost:3001' : 'https://api.pge.sc.gov.br'),
      authEndpoint: getEnvVar('REACT_APP_AUTH_ENDPOINT', '/api/auth'),
      timeout: parseInt(getEnvVar('REACT_APP_API_TIMEOUT', '10000')),
      retryAttempts: parseInt(getEnvVar('REACT_APP_API_RETRY_ATTEMPTS', '3'))
    },

    session: {
      tokenExpirationHours: parseInt(getEnvVar('REACT_APP_TOKEN_EXPIRATION_HOURS', '8')),
      refreshTokenExpirationDays: parseInt(getEnvVar('REACT_APP_REFRESH_TOKEN_EXPIRATION_DAYS', '30')),
      rememberMeDays: parseInt(getEnvVar('REACT_APP_REMEMBER_ME_DAYS', '30')),
      autoRefreshMinutes: parseInt(getEnvVar('REACT_APP_AUTO_REFRESH_MINUTES', '5'))
    },

    security: {
      passwordMinLength: parseInt(getEnvVar('REACT_APP_PASSWORD_MIN_LENGTH', '6')),
      loginAttemptsLimit: parseInt(getEnvVar('REACT_APP_LOGIN_ATTEMPTS_LIMIT', '5')),
      lockoutDurationMinutes: parseInt(getEnvVar('REACT_APP_LOCKOUT_DURATION_MINUTES', '15')),
      requireEmailDomain: getEnvVar('REACT_APP_REQUIRED_EMAIL_DOMAINS', 'pge.sc.gov.br').split(',')
    },

    features: {
      mockAuthForDevelopment: isDevelopment && getEnvVar('REACT_APP_MOCK_AUTH', 'true') !== 'false',
      autoLogin: getEnvVar('REACT_APP_AUTO_LOGIN') === 'true',
      ssoEnabled: getEnvVar('REACT_APP_SSO_ENABLED') === 'true' || isProduction,
      auditLogging: getEnvVar('REACT_APP_AUDIT_LOGGING', 'true') !== 'false'
    }
  };
};

// Configurações exportadas
export const config = getEnvironmentConfig();

// Funções utilitárias
export const isProduction = () => config.app.environment === 'production';
export const isDevelopment = () => config.app.environment === 'development';
export const isStaging = () => config.app.environment === 'staging';

// Validação de configuração
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar configurações obrigatórias
  if (!config.activeDirectory.domain) {
    errors.push('Domínio do Active Directory não configurado');
  }

  if (config.activeDirectory.enabled && !config.activeDirectory.serverUrl) {
    errors.push('URL do servidor Active Directory não configurada');
  }

  if (config.session.tokenExpirationHours < 1) {
    errors.push('Tempo de expiração do token deve ser maior que 1 hora');
  }

  if (config.security.passwordMinLength < 6) {
    errors.push('Comprimento mínimo da senha deve ser pelo menos 6 caracteres');
  }

  if (config.security.requireEmailDomain.length === 0) {
    errors.push('Pelo menos um domínio de email deve ser configurado');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Log de configuração (apenas em desenvolvimento)
if (isDevelopment() && config.app.debug) {
  console.group('🔧 Configuração da Aplicação');
  console.log('Ambiente:', config.app.environment);
  console.log('AD Habilitado:', config.activeDirectory.enabled);
  console.log('Mock Auth:', config.features.mockAuthForDevelopment);
  console.log('SSO Habilitado:', config.features.ssoEnabled);
  console.log('Domínio AD:', config.activeDirectory.domain);
  console.groupEnd();

  const validation = validateConfig();
  if (!validation.valid) {
    console.warn('⚠️ Configuração inválida:', validation.errors);
  }
}

export default config;