import React from 'react';
import { 
  Star, 
  Clock, 
  Filter, 
  Bell, 
  User, 
  Heart,
  Folder,
  Tag,
  Activity,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAdmin } from '../contexts/AdminContext';
import { useUserProfile } from '../contexts/UserProfileContext';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface SidebarProps {
  tools: Tool[];
  favorites: string[];
  recentTools: string[];
  selectedCategory: string;
  user?: {
    name: string;
    email: string;
  };
  onToggleFavorite: (toolId: string) => void;
  onCategorySelect: (category: string) => void;
  onToolSelect: (toolId: string) => void;
  onLogout?: () => void;
  onProfileSelect?: () => void;
}

export function Sidebar({ 
  tools, 
  favorites, 
  recentTools, 
  selectedCategory, 
  user,
  onToggleFavorite, 
  onCategorySelect,
  onToolSelect,
  onLogout,
  onProfileSelect
}: SidebarProps) {
  const { getUserProfile, getNotificationsForProfile } = useAdmin();
  const { profileData } = useUserProfile();
  
  const favoriteTools = tools.filter(tool => favorites.includes(tool.id));
  const recentToolsData = tools.filter(tool => recentTools.includes(tool.id)).slice(0, 5);
  
  // Obter notificações para o usuário atual
  const userProfileId = user ? getUserProfile(user.email) : '4';
  const userNotifications = getNotificationsForProfile(userProfileId);
  
  const categories = [
    { id: 'all', name: 'Todas', count: tools.length },
    { id: 'análise', name: 'Análise', count: tools.filter(t => t.category === 'análise').length },
    { id: 'gestão', name: 'Gestão', count: tools.filter(t => t.category === 'gestão').length },
    { id: 'documentos', name: 'Documentos', count: tools.filter(t => t.category === 'documentos').length },
    { id: 'ia', name: 'Inteligência Artificial', count: tools.filter(t => t.category === 'ia').length },
    { id: 'jurídico', name: 'Jurídico', count: tools.filter(t => t.category === 'jurídico').length },
    { id: 'sistema', name: 'Sistema', count: tools.filter(t => t.category === 'sistema').length },
    { id: 'comunicação', name: 'Comunicação', count: tools.filter(t => t.category === 'comunicação').length },
    { id: 'dados', name: 'Dados', count: tools.filter(t => t.category === 'dados').length },
  ];

  // Função para calcular tempo relativo
  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 0) {
      return `${diffInDays}d`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h`;
    } else {
      return 'agora';
    }
  };

  // Função para obter cor do badge da notificação
  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'success':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'error':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-[--pge-blue]/10 text-[--pge-blue]';
    }
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      <ScrollArea className="flex-1 p-4">
        {/* Perfil do Usuário */}
        {user && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-3 cursor-pointer hover:bg-muted rounded-lg p-2 -m-2">
                    <Avatar className="w-10 h-10">
                      {profileData.avatar ? (
                        <AvatarImage src={profileData.avatar} alt="Foto do perfil" />
                      ) : (
                        <AvatarFallback className="bg-[--pge-blue] text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={onProfileSelect}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        )}

        {/* Favoritos */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Heart className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Favoritos
              <Badge variant="secondary" className="ml-auto">
                {favorites.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {favoriteTools.length > 0 ? (
              <div className="space-y-2">
                {favoriteTools.slice(0, 4).map((tool) => (
                  <div 
                    key={tool.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => onToolSelect(tool.id)}
                  >
                    <div className="text-[--pge-blue]">
                      {React.cloneElement(tool.icon as React.ReactElement, { 
                        className: "w-4 h-4" 
                      })}
                    </div>
                    <span className="text-sm font-medium flex-1 truncate text-foreground">
                      {tool.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                    >
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                    </Button>
                  </div>
                ))}
                {favoriteTools.length > 4 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{favoriteTools.length - 4} mais
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma ferramenta favoritada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Ferramentas Recentes */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Clock className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentToolsData.length > 0 ? (
              <div className="space-y-2">
                {recentToolsData.map((tool) => (
                  <div 
                    key={tool.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => onToolSelect(tool.id)}
                  >
                    <div className="text-[--pge-blue]">
                      {React.cloneElement(tool.icon as React.ReactElement, { 
                        className: "w-4 h-4" 
                      })}
                    </div>
                    <span className="text-sm font-medium flex-1 truncate text-foreground">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma ferramenta acessada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Filtros por Categoria */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Filter className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-between text-sm h-8"
                  onClick={() => onCategorySelect(category.id)}
                  style={selectedCategory === category.id ? { backgroundColor: 'var(--pge-blue)', color: 'white' } : {}}
                >
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-2" />
                    {category.name}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Bell className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Notificações
              <Badge variant={userNotifications.length > 0 ? "destructive" : "secondary"} className="ml-auto">
                {userNotifications.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {userNotifications.length > 0 ? (
                userNotifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getNotificationColor(notification.type)} variant="secondary">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    {notification.expiresAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expira: {new Date(notification.expiresAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
                </div>
              )}
              
              {userNotifications.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{userNotifications.length - 3} mais notificações
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
}