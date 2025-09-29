import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Eye, EyeOff, Shield, AlertCircle, Globe, Lock } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { AdaptiveLogo } from './AdaptiveLogo';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginScreen({ onLogin, isLoading = false, error }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  // Carregar email salvo se existir
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('pge-remember-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email é obrigatório';
    } else if (!email.includes('@')) {
      errors.email = 'Digite um email válido';
    }
    
    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Salvar email se marcado para lembrar
      if (rememberEmail) {
        localStorage.setItem('pge-remember-email', email);
      } else {
        localStorage.removeItem('pge-remember-email');
      }
      
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo/Header da PGE */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AdaptiveLogo size="lg" className="rounded-full shadow-lg" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 text-foreground">
            PGE - Plataforma
          </h1>
          <p className="text-muted-foreground">
            Procuradoria-Geral do Estado de Santa Catarina
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-foreground">
              <Shield className="w-5 h-5 text-[--pge-blue]" />
              Acesso Institucional
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais institucionais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@pge.sc.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={formErrors.email ? 'border-destructive focus:border-destructive' : ''}
                  disabled={isLoading}
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${formErrors.password ? 'border-destructive focus:border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberEmail}
                  onCheckedChange={(checked) => setRememberEmail(checked as boolean)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Lembrar meu email
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full text-white hover:opacity-90 bg-[--pge-blue] hover:bg-[--pge-blue]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  'Entrar na Plataforma'
                )}
              </Button>
            </form>

            {/* Active Directory Info */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Autenticação Active Directory</span>
                </div>
                <div className="text-left space-y-3 bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-[--pge-blue] mt-0.5 flex-shrink-0" />
                    <div className="text-xs space-y-1 text-foreground">
                      <p className="font-medium">Sistema integrado com Active Directory da PGE-SC</p>
                      <p className="text-muted-foreground">
                        Use suas credenciais institucionais para acessar a plataforma
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground font-medium mb-2">
                      Usuários de Demonstração (ambiente de desenvolvimento):
                    </p>
                    <div className="text-xs space-y-1 text-foreground">
                      <p><strong>Admin:</strong> carlos.admin@pge.sc.gov.br <span className="text-[--pge-blue]">(Área Admin)</span></p>
                      <p><strong>Procurador:</strong> joao.silva@pge.sc.gov.br</p>
                      <p><strong>Assessor:</strong> maria.santos@pge.sc.gov.br</p>
                      <p><strong>Analista:</strong> pedro.oliveira@pge.sc.gov.br</p>
                      <p><strong>Servidor:</strong> ana.costa@pge.sc.gov.br</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Senha de teste: qualquer senha com 6+ caracteres
                    </p>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-[--pge-blue]">
                      <strong>Produção:</strong> A autenticação será realizada automaticamente via SSO (Single Sign-On) com suas credenciais de rede institucional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Problemas para acessar?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-sm h-auto p-0 text-[--pge-blue] hover:text-[--pge-blue]/80"
                  >
                    Esqueci minha senha
                  </Button>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-sm h-auto p-0 text-[--pge-blue] hover:text-[--pge-blue]/80"
                  >
                    Suporte técnico
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            © 2024 Procuradoria-Geral do Estado de Santa Catarina
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Sistema seguro e protegido
          </p>
        </div>
      </div>
    </div>
  );
}