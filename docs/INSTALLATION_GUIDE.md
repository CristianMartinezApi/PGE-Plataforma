# Guia de Instalação e Configuração
## PGE - Plataforma Institucional

### 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Active Directory](#active-directory)
5. [Desenvolvimento](#desenvolvimento)
6. [Deploy](#deploy)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário
- **Node.js**: 18.0.0 ou superior
- **npm**: 8.0.0 ou superior (ou yarn 1.22.0+)
- **Git**: Para versionamento
- **Editor**: VS Code (recomendado)

### Extensões VS Code Recomendadas
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## 📥 Instalação

### 1. Clone do Repositório
```bash
# Clonar o repositório
git clone https://github.com/pge-sc/plataforma.git
cd plataforma

# Ou se estiver usando SSH
git clone git@github.com:pge-sc/plataforma.git
cd plataforma
```

### 2. Instalação de Dependências
```bash
# Usar npm
npm install

# Ou usar yarn
yarn install
```

### 3. Verificação da Instalação
```bash
# Executar testes básicos
npm run lint
npm run type-check

# Executar em modo desenvolvimento
npm start
```

---

## ⚙️ Configuração

### 1. Configuração do Ambiente

#### Desenvolvimento
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações para desenvolvimento
vim .env
```

Configuração mínima para desenvolvimento:
```env
# Ambiente
NODE_ENV=development
REACT_APP_DEBUG=true

# Active Directory (desabilitado em dev)
REACT_APP_AD_ENABLED=false
REACT_APP_MOCK_AUTH=true

# Domínio obrigatório
REACT_APP_REQUIRED_EMAIL_DOMAINS=pge.sc.gov.br
```

#### Produção
```env
# Ambiente
NODE_ENV=production
REACT_APP_DEBUG=false

# Active Directory (habilitado)
REACT_APP_AD_ENABLED=true
REACT_APP_AD_DOMAIN=pge.sc.gov.br
REACT_APP_AD_SERVER_URL=ldaps://ad.pge.sc.gov.br:636
REACT_APP_AD_BASE_DN=DC=pge,DC=sc,DC=gov,DC=br

# SSO e recursos de produção
REACT_APP_SSO_ENABLED=true
REACT_APP_AUDIT_LOGGING=true
```

### 2. Verificação da Configuração
```bash
# Script para validar configuração
npm run config:validate

# Ou executar validação manual
npm start
# Verificar no console do navegador se há erros de configuração
```

---

## 🔐 Active Directory

### 1. Configuração do AD

#### Grupos Necessários
Criar os seguintes grupos no Active Directory:

```ldap
# Grupo base de usuários
CN=PGE_Users,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br

# Grupo de administradores
CN=PGE_Admins,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br

# Grupos departamentais (opcionais)
CN=PA_Team,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
CN=PJ_Team,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
CN=TI_Team,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
CN=RH_Team,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
```

#### Configuração de Rede
```bash
# Verificar conectividade com o AD
nslookup ad.pge.sc.gov.br

# Testar porta LDAPS
telnet ad.pge.sc.gov.br 636

# Verificar certificados SSL
openssl s_client -connect ad.pge.sc.gov.br:636
```

### 2. Configuração da Aplicação

```env
# Configurações completas do AD
REACT_APP_AD_ENABLED=true
REACT_APP_AD_DOMAIN=pge.sc.gov.br
REACT_APP_AD_SERVER_URL=ldaps://ad.pge.sc.gov.br:636
REACT_APP_AD_BASE_DN=DC=pge,DC=sc,DC=gov,DC=br
REACT_APP_AD_USER_GROUP=CN=PGE_Users,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
REACT_APP_AD_ADMIN_GROUP=CN=PGE_Admins,OU=Groups,DC=pge,DC=sc,DC=gov,DC=br
REACT_APP_AD_SSL_ENABLED=true
REACT_APP_AD_TIMEOUT=5000
```

### 3. Testes de Integração

```bash
# Script para testar AD (se disponível)
npm run test:ad

# Ou testar manualmente na aplicação
# 1. Acessar a tela de login
# 2. Usar credenciais AD reais
# 3. Verificar grupos e permissões no console
```

---

## 💻 Desenvolvimento

### 1. Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Executar em modo desenvolvimento
npm run dev        # Alias para start

# Build
npm run build      # Build de produção
npm run preview    # Visualizar build local

# Qualidade de código
npm run lint       # ESLint
npm run lint:fix   # Corrigir erros do ESLint
npm run type-check # Verificação TypeScript

# Testes
npm test           # Executar testes
npm run test:coverage # Cobertura de testes

# Utilitários
npm run clean      # Limpar arquivos temporários
npm run analyze    # Analisar bundle
```

### 2. Estrutura de Desenvolvimento

```
src/
├── components/          # Componentes React
├── contexts/           # Contextos de estado
├── services/           # Serviços (AD, API)
├── config/            # Configurações
├── types/             # Tipos TypeScript
├── utils/             # Utilitários
├── hooks/             # Custom hooks
├── styles/            # Estilos globais
└── docs/              # Documentação
```

### 3. Padrões de Código

```typescript
// Nomenclatura de componentes
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // ...
};

// Nomenclatura de hooks
export const useCustomHook = () => {
  // ...
};

// Nomenclatura de tipos
export interface ComponentProps {
  title: string;
  isVisible: boolean;
}
```

---

## 🚀 Deploy

### 1. Build de Produção

```bash
# Criar build otimizado
npm run build

# Verificar build
npm run preview

# Analisar bundle (opcional)
npm run analyze
```

### 2. Docker (Recomendado)

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build da imagem
docker build -t pge-plataforma .

# Executar container
docker run -d -p 80:80 \
  -e REACT_APP_AD_ENABLED=true \
  -e REACT_APP_AD_DOMAIN=pge.sc.gov.br \
  pge-plataforma
```

### 3. Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pge-plataforma
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pge-plataforma
  template:
    metadata:
      labels:
        app: pge-plataforma
    spec:
      containers:
      - name: app
        image: pge-plataforma:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_AD_ENABLED
          value: "true"
        - name: REACT_APP_AD_DOMAIN
          value: "pge.sc.gov.br"
```

### 4. Nginx

```nginx
# nginx.conf
server {
    listen 80;
    server_name plataforma.pge.sc.gov.br;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Segurança
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

---

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Autenticação AD
```
Erro: "Conexão com AD falhou"
```

**Soluções**:
```bash
# Verificar conectividade
ping ad.pge.sc.gov.br

# Verificar configuração
echo $REACT_APP_AD_SERVER_URL

# Verificar certificados
openssl s_client -connect ad.pge.sc.gov.br:636
```

#### 2. Erro de Permissões
```
Erro: "Usuário não tem permissão"
```

**Soluções**:
- Verificar se usuário está no grupo `PGE_Users`
- Confirmar DN dos grupos no AD
- Validar configuração `REACT_APP_AD_USER_GROUP`

#### 3. Problemas de Build
```
Erro: "Module not found"
```

**Soluções**:
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Verificar versões
node --version
npm --version

# Limpar cache
npm cache clean --force
```

#### 4. Problemas de Certificado SSL
```
Erro: "SSL certificate verification failed"
```

**Soluções**:
```bash
# Desenvolvimento (não recomendado para produção)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Ou configurar certificado correto
REACT_APP_AD_SSL_CERT_PATH=/path/to/cert.pem
```

### Logs e Debug

#### 1. Habilitar Logs Detalhados
```env
REACT_APP_DEBUG=true
REACT_APP_AUDIT_LOGGING=true
```

#### 2. Console do Navegador
```javascript
// Verificar configuração
console.log('Config:', window.__PGE_CONFIG__);

// Verificar estado de autenticação
console.log('Auth State:', localStorage.getItem('pge-auth-token'));
```

#### 3. Network Tab
- Verificar chamadas para AD
- Analisar tempos de resposta
- Verificar headers de autenticação

### Contato para Suporte

- **Email**: desenvolvimento@pge.sc.gov.br
- **Teams**: Canal #pge-plataforma
- **Telefone**: +55 48 3221-0000 (ramal TI)

---

**Última atualização**: 05/09/2025  
**Versão do documento**: 1.1.0