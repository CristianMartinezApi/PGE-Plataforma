# PGE - Plataforma Institucional
## Documentação Técnica Completa

### Versão: 1.0.0
### Última atualização: 05/09/2025

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Componentes Principais](#componentes-principais)
6. [Contextos e Estados](#contextos-e-estados)
7. [Sistema de Temas](#sistema-de-temas)
8. [Autenticação](#autenticação)
9. [Ferramentas Implementadas](#ferramentas-implementadas)
10. [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral

A **PGE - Plataforma** é um hub de ferramentas digitais desenvolvido para a Procuradoria-Geral do Estado de Santa Catarina. A plataforma oferece acesso centralizado a diversas ferramentas institucionais com interface moderna, responsiva e seguindo a identidade visual institucional.

### Objetivos Principais
- Centralizar acesso às ferramentas digitais da PGE-SC
- Proporcionar experiência de usuário moderna e intuitiva
- Garantir segurança e controle de acesso adequados
- Facilitar a gestão e manutenção das ferramentas

### Características Principais
- ✅ Interface responsiva (desktop/tablet/mobile)
- ✅ Sistema de temas claro/escuro
- ✅ Autenticação com email institucional
- ✅ Controle de permissões por usuário
- ✅ Sistema de favoritos e histórico
- ✅ Busca e filtros por categoria
- ✅ Logos adaptativos ao tema

---

## 🏗️ Arquitetura

### Padrão Arquitetural
- **Frontend**: React 18 com TypeScript
- **Estilização**: Tailwind CSS v4 com variáveis CSS customizadas
- **Estado**: Context API do React
- **Componentes**: Arquitetura modular com componentes reutilizáveis

### Fluxo de Dados
```
App.tsx (Provider Principal)
├── ThemeProvider (Tema global)
├── UserProfileProvider (Perfil do usuário)
└── AdminProvider (Controle administrativo)
    └── AppContent (Conteúdo principal)
        ├── LoginScreen (Não autenticado)
        ├── LoadingScreen (Carregamento)
        └── MainPlatform (Autenticado)
            ├── Header
            ├── Sidebar
            ├── ToolGrid/ToolContent
            └── Footer
```

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18**: Framework principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS v4**: Framework de estilização
- **Lucide React**: Biblioteca de ícones

### Componentes UI
- **ShadCN/UI**: Componentes base customizáveis
- **Custom Components**: Componentes específicos da aplicação

### Funcionalidades
- **Context API**: Gerenciamento de estado global
- **LocalStorage**: Persistência de sessão
- **CSS Variables**: Sistema de cores dinâmico

---

## 📁 Estrutura do Projeto

```
/
├── App.tsx                     # Componente principal
├── components/                 # Componentes reutilizáveis
│   ├── AdaptiveLogo.tsx       # Logo adaptável ao tema
│   ├── Header.tsx             # Cabeçalho principal
│   ├── Sidebar.tsx            # Barra lateral
│   ├── ToolCard.tsx           # Card de ferramenta
│   ├── ToolLayout.tsx         # Layout base para ferramentas
│   ├── LoginScreen.tsx        # Tela de login
│   ├── LoadingScreen.tsx      # Tela de carregamento
│   ├── Footer.tsx             # Rodapé
│   ├── tools/                 # Ferramentas específicas
│   │   ├── MinerTool.tsx      # Ferramenta de mineração
│   │   ├── IAPGETool.tsx      # IA da PGE
│   │   ├── DocumentsTool.tsx  # Gestão de documentos
│   │   ├── AdminTool.tsx      # Administração
│   │   └── UserProfileTool.tsx # Perfil do usuário
│   └── ui/                    # Componentes base (ShadCN)
├── contexts/                  # Contextos de estado global
│   ├── ThemeContext.tsx       # Contexto de tema
│   ├── AdminContext.tsx       # Contexto administrativo
│   └── UserProfileContext.tsx # Contexto de perfil
├── styles/
│   └── globals.css           # Estilos globais e variáveis
└── docs/                     # Documentação
```

---

## 🧩 Componentes Principais

### 1. App.tsx
**Função**: Componente raiz com providers e roteamento básico
**Responsabilidades**:
- Configuração de providers globais
- Controle de estado de autenticação
- Roteamento entre telas (login, loading, dashboard, ferramentas)

### 2. Header.tsx
**Função**: Cabeçalho com busca e navegação
**Funcionalidades**:
- Campo de busca global
- Logo institucional adaptável
- Botão de alternância de tema
- Navegação responsiva

### 3. Sidebar.tsx
**Função**: Barra lateral com navegação e informações do usuário
**Funcionalidades**:
- Perfil do usuário
- Ferramentas favoritas
- Histórico de ferramentas recentes
- Filtros por categoria
- Logout

### 4. ToolCard.tsx
**Função**: Card individual para cada ferramenta
**Funcionalidades**:
- Exibição de ícone, nome e descrição
- Botão de favorito
- Animações hover
- Responsive design

### 5. AdaptiveLogo.tsx
**Função**: Logo que se adapta ao tema (claro/escuro)
**Características**:
- Troca automática entre versões do brasão
- Otimização para diferentes tamanhos
- Transições suaves

---

## 🔄 Contextos e Estados

### ThemeContext
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```
**Responsabilidade**: Gerenciar tema global da aplicação

### AdminContext
```typescript
interface AdminContextType {
  isUserAuthorized: (email: string) => boolean;
  isAdmin: (email: string) => boolean;
  getUser: (email: string) => User | undefined;
  updateUser: (email: string, updates: Partial<User>) => void;
}
```
**Responsabilidade**: Controle de permissões e usuários administrativos

### UserProfileContext
```typescript
interface UserProfileContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}
```
**Responsabilidade**: Gerenciar preferências do usuário

---

## 🎨 Sistema de Temas

### Paleta de Cores PGE
```css
/* Modo Claro */
--pge-blue: #0056A6;        /* Azul institucional */
--pge-white: #FFFFFF;       /* Branco */
--pge-light-gray: #F4F6F8;  /* Cinza claro */
--pge-dark-gray: #333333;   /* Cinza escuro */

/* Modo Escuro */
--pge-blue: #4a9eff;        /* Azul mais claro */
--pge-white: #1a1a1a;       /* Fundo escuro */
--pge-light-gray: #1a1a1a;  /* Fundo escuro */
--pge-dark-gray: #ffffff;   /* Texto claro */
```

### Características
- **Transições suaves**: Animações de 0.3s para mudanças de tema
- **Variáveis CSS**: Sistema flexível e reutilizável
- **Responsive**: Adaptação automática em todos os dispositivos
- **Acessibilidade**: Contraste adequado em ambos os temas

---

## 🔐 Autenticação

### Active Directory Integration

A plataforma está totalmente integrada com o Active Directory da PGE-SC, proporcionando autenticação corporativa segura e gerenciamento de permissões baseado em grupos.

#### Arquitetura de Autenticação

```typescript
// Fluxo de autenticação AD
AuthContext
├── ActiveDirectoryService
│   ├── LDAP Connection
│   ├── User Authentication
│   ├── Group Membership
│   └── Token Management
├── JWT Token System
│   ├── Access Token (8h)
│   ├── Refresh Token (30d)
│   └── Auto-refresh (5min antes)
└── Session Persistence
    ├── LocalStorage
    ├── Validation
    └── Cleanup
```

#### Configuração por Ambiente

**Desenvolvimento**:
```env
REACT_APP_AD_ENABLED=false
REACT_APP_MOCK_AUTH=true
```

**Produção**:
```env
REACT_APP_AD_ENABLED=true
REACT_APP_AD_DOMAIN=pge.sc.gov.br
REACT_APP_AD_SERVER_URL=ldaps://ad.pge.sc.gov.br:636
```

#### Grupos de Usuários

- **PGE_Users**: Usuários padrão da plataforma
- **PGE_Admins**: Administradores com acesso total
- **PA_Team**: Procuradoria Administrativa
- **PJ_Team**: Procuradoria Judicial
- **TI_Team**: Tecnologia da Informação
- **RH_Team**: Recursos Humanos

---

## 🔐 Autenticação (Sistema Anterior)

### Sistema Atual (Simulado)
- **Validação**: Email deve conter "@pge.sc.gov.br"
- **Persistência**: LocalStorage para manter sessão
- **Usuários de teste**: Predefinidos no código
- **Timeout**: Simulação de delay de API (1.5s)

### Usuários de Teste
```javascript
const testUsers = {
  'joao.silva@pge.sc.gov.br': 'João Silva',
  'maria.santos@pge.sc.gov.br': 'Maria Santos',
  'pedro.oliveira@pge.sc.gov.br': 'Pedro Oliveira',
  'ana.costa@pge.sc.gov.br': 'Ana Costa',
  'carlos.admin@pge.sc.gov.br': 'Carlos Admin' // Admin
};
```

### ✅ Implementação Active Directory (Concluída)
- **Protocolo**: LDAP com suporte a SSL/TLS
- **Serviço**: `ActiveDirectoryService` para gerenciar conexões
- **Contexto**: `AuthContext` para estado global de autenticação
- **Tokens**: JWT com auto-refresh antes da expiração
- **Grupos**: Verificação de permissões baseada em grupos AD
- **Configuração**: Sistema flexível via variáveis de ambiente
- **Compatibilidade**: Suporte híbrido com sistema anterior

---

## ⚙️ Ferramentas Implementadas

### 1. Miner Tool
**Status**: 🟢 Implementada
**Função**: Sistema de mineração de dados e análise de documentos jurídicos
**Funcionalidades**:
- Upload de documentos (PDF, DOC, DOCX)
- Análise automática de conteúdo
- Extração de entidades (nomes, datas, valores)
- Geração de relatórios

### 2. IA PGE Tool
**Status**: 🟢 Implementada
**Função**: Assistente de IA para consultas jurídicas
**Funcionalidades**:
- Chat interativo
- Base de conhecimento jurídico
- Análise de documentos
- Sugestões contextuais

### 3. Documents Tool
**Status**: 🟢 Implementada
**Função**: Repositório central de documentos
**Funcionalidades**:
- Upload e organização
- Sistema de pastas
- Controle de versões
- Compartilhamento

### 4. Admin Tool
**Status**: 🟢 Implementada (Restrita)
**Função**: Administração do sistema
**Funcionalidades**:
- Gestão de usuários
- Configurações globais
- Logs do sistema
- Controle de permissões

### 5. User Profile Tool
**Status**: 🟢 Implementada
**Função**: Gerenciamento de perfil pessoal
**Funcionalidades**:
- Informações pessoais
- Preferências do sistema
- Histórico de atividades
- Configurações de notificação

### Ferramentas Planejadas
- **Pautas**: Gerenciamento de agenda institucional
- **Relatórios**: Dashboard de indicadores
- **Gestão de Usuários**: Administração completa
- **Base de Dados**: Acesso a bases jurídicas
- **Configurações**: Personalização avançada
- **Segurança**: Monitoramento e auditoria
- **Jurisprudência**: Consulta de precedentes
- **Biblioteca Digital**: Acervo digital
- **Comunicação**: Sistema interno

---

## 🔮 Próximos Passos

### ✅ Fase 1: Autenticação AD (Concluída)
- [x] Implementar serviço de autenticação LDAP
- [x] Configurar integração com Active Directory
- [x] Atualizar fluxo de login
- [x] Sincronização de dados de usuário
- [x] Sistema de configuração flexível
- [x] Documentação técnica completa

### Fase 2: Ferramentas Core (Próxima)
- [ ] Implementar ferramenta de Pautas
- [ ] Desenvolver Dashboard de Relatórios
- [ ] Criar sistema de Base de Dados
- [ ] Implementar Jurisprudência

### Fase 3: Funcionalidades Avançadas
- [ ] Sistema de notificações push
- [ ] Workflow de aprovações
- [ ] Integração com sistemas externos
- [ ] Analytics e métricas de uso

### Fase 4: Otimizações
- [ ] Cache inteligente
- [ ] Performance optimization
- [ ] Progressive Web App (PWA)
- [ ] Offline capabilities

---

## 📊 Métricas de Qualidade

### Código
- **TypeScript**: 100% tipado
- **Componentes**: 100% funcionais
- **Responsividade**: Desktop/Tablet/Mobile
- **Acessibilidade**: WCAG 2.1 AA (em desenvolvimento)

### Performance
- **First Paint**: < 1s (objetivo)
- **Interactive**: < 2s (objetivo)
- **Bundle Size**: Otimizado com tree-shaking

### Segurança
- **Autenticação**: Baseada em domínio institucional
- **Autorização**: Por perfil de usuário
- **Dados**: Não armazenamento de informações sensíveis no frontend

---

## 👥 Contribuição

### Padrões de Código
- **ESLint**: Configuração padrão React/TypeScript
- **Prettier**: Formatação automática
- **Commits**: Conventional Commits
- **Branches**: GitFlow

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: mudanças de estilo
refactor: refatoração de código
test: adição de testes
```

---

## 🚀 Deploy e Ambiente

### Desenvolvimento
- **Node.js**: 18+
- **Package Manager**: npm/yarn
- **Dev Server**: Vite/CRA

### Produção
- **Build**: Otimizado para produção
- **Hosting**: A definir (Azure/AWS)
- **CDN**: Para assets estáticos
- **Monitoramento**: A implementar

---

**Documento mantido por**: Equipe de Desenvolvimento PGE-SC  
**Próxima revisão**: Após implementação AD