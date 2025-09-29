import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Palette, 
  Bell, 
  Mail, 
  Eye, 
  Upload,
  Trash2,
  Save,
  Monitor,
  Sun,
  Moon,
  Settings,
  Shield,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useTheme } from '../../contexts/ThemeContext';

interface UserProfileToolProps {
  user?: {
    name: string;
    email: string;
  };
  onBack: () => void;
  onHome: () => void;
}

export function UserProfileTool({ user, onBack, onHome }: UserProfileToolProps) {
  const { profileData, updateAvatar, updatePreferences } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Simular upload - converter para base64 para armazenamento local
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateAvatar(result);
        toast.success('Foto de perfil atualizada com sucesso');
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error('Erro ao processar a imagem');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem');
      setIsUploading(false);
    }

    // Limpar o input
    event.target.value = '';
  };

  const handleRemoveAvatar = () => {
    updateAvatar(undefined);
    toast.success('Foto de perfil removida');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(`Tema alterado para ${getThemeLabel(newTheme)}`);
  };

  const handlePreferenceChange = (key: keyof typeof profileData.preferences, value: boolean) => {
    updatePreferences({ [key]: value });
    toast.success('Preferência atualizada');
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Sistema';
      default: return 'Sistema';
    }
  };

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e preferências da plataforma
          </p>
        </div>
        <Alert className="max-w-md border-[--pge-blue]/20 bg-[--pge-blue]/10">
          <Shield className="w-4 h-4 text-[--pge-blue]" />
          <AlertDescription className="text-[--pge-blue] text-sm">
            Suas configurações são salvas automaticamente
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Foto e Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-[--pge-blue]" />
                <span>Informações do Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    {profileData.avatar ? (
                      <AvatarImage src={profileData.avatar} alt="Foto do perfil" />
                    ) : (
                      <AvatarFallback 
                        className="text-2xl bg-[--pge-blue] text-white"
                      >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Foto do Perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    Clique no ícone da câmera para alterar sua foto
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Enviando...' : 'Alterar Foto'}
                    </Button>
                    {profileData.avatar && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/70">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <Separator />

              {/* Informações do Usuário (somente leitura) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nome sincronizado com o sistema institucional
                  </p>
                </div>
                <div>
                  <Label htmlFor="email">Email Institucional</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    readOnly
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email não pode ser alterado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-[--pge-blue]" />
                <span>Preferências</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notificações */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="notifications">Notificações na Plataforma</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações sobre atualizações e informações importantes
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={profileData.preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <Separator />

              {/* Alertas por Email */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="emailAlerts">Alertas por Email</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas importantes por email institucional
                  </p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={profileData.preferences.emailAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
                />
              </div>

              <Separator />

              {/* Visualização Compacta */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <Label htmlFor="compactView">Visualização Compacta</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Usar interface mais compacta com menos espaçamento
                  </p>
                </div>
                <Switch
                  id="compactView"
                  checked={profileData.preferences.compactView}
                  onCheckedChange={(checked) => handlePreferenceChange('compactView', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-[--pge-blue]" />
                <span>Aparência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Tema da Interface</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {getThemeIcon(theme)}
                        <span>{getThemeLabel(theme)}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4" />
                        <span>Claro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <span>Escuro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>Sistema</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {theme === 'system' 
                    ? 'O tema seguirá a configuração do seu navegador/sistema operacional'
                    : `Interface será exibida no tema ${getThemeLabel(theme).toLowerCase()}`
                  }
                </p>
              </div>

              {/* Preview do tema */}
              <div className="border rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Preview:</p>
                <div className="bg-background border rounded p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[--pge-blue]"></div>
                    <div className="h-2 bg-foreground rounded w-20 opacity-80"></div>
                  </div>
                  <div className="h-1.5 bg-muted rounded w-full mb-1"></div>
                  <div className="h-1.5 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo das Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-[--pge-blue]" />
                <span>Resumo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Foto do perfil:</span>
                  <span className="font-medium text-foreground">
                    {profileData.avatar ? 'Personalizada' : 'Padrão'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tema:</span>
                  <span className="font-medium text-foreground">{getThemeLabel(theme)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notificações:</span>
                  <span className="font-medium text-foreground">
                    {profileData.preferences.notifications ? 'Ativadas' : 'Desativadas'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alertas por email:</span>
                  <span className="font-medium text-foreground">
                    {profileData.preferences.emailAlerts ? 'Ativados' : 'Desativados'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Dados pessoais são sincronizados com o sistema institucional</p>
                <p>• Configurações são salvas localmente no seu navegador</p>
                <p>• Para suporte técnico, entre em contato com a TI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}