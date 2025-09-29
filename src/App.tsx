import React, { useState, useMemo, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { ToolCard } from './components/ToolCard';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ToolLayout } from './components/ToolLayout';
import { MinerTool } from './components/tools/MinerTool';
import { IAPGETool } from './components/tools/IAPGETool';
import { DocumentsTool } from './components/tools/DocumentsTool';
import { AdminTool } from './components/tools/AdminTool';
import { ParecerJuridicoTool } from './components/tools/ParecerJuridicoTool';   // Added
import { AtosNormativosTool } from './components/tools/AtosNormativosTool';   // Added
import { PautasTool } from './components/tools/PautasTool';                   // Added
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileTool } from './components/tools/UserProfileTool';
import { 
  Search, 
  FileText, 
  Brain, 
  BarChart3, 
  Users, 
  Calendar, 
  Database, 
  Settings, 
  Shield,
  Gavel,
  BookOpen,
  MessageSquare,
  Menu,
  User
} from 'lucide-react';
import { Button } from './components/ui/button';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const tools: Tool[] = [
  {
    id: '1',
    name: 'Miner',
    description: 'Sistema de mineração de dados e análise de documentos jurídicos',
    icon: <Search className="w-8 h-8" />,
    category: 'análise'
  },
  {
    id: '2',
    name: 'Pautas',
    description: 'Gerenciamento de pautas e agenda institucional',
    icon: <Calendar className="w-8 h-8" />,
    category: 'gestão'
  },
  {
    id: '3',
    name: 'IA PGE',
    description: 'Assistente de inteligência artificial para consultas jurídicas',
    icon: <Brain className="w-8 h-8" />,
    category: 'ia'
  },
  {
    id: '4',
    name: 'Relatórios',
    description: 'Dashboard de relatórios e indicadores de performance',
    icon: <BarChart3 className="w-8 h-8" />,
    category: 'análise'
  },
  {
    id: '5',
    name: 'Gestão de Usuários',
    description: 'Administração de usuários e permissões do sistema',
    icon: <Users className="w-8 h-8" />,
    category: 'gestão'
  },
  {
    id: '6',
    name: 'Documentos',
    description: 'Repositório central de documentos e arquivos institucionais',
    icon: <FileText className="w-8 h-8" />,
    category: 'documentos'
  },
  {
    id: '7',
    name: 'Base de Dados',
    description: 'Acesso às bases de dados jurídicas e institucionais',
    icon: <Database className="w-8 h-8" />,
    category: 'dados'
  },
  {
    id: '8',
    name: 'Configurações',
    description: 'Configurações do sistema e personalização da plataforma',
    icon: <Settings className="w-8 h-8" />,
    category: 'sistema'
  },
  {
    id: '9',
    name: 'Segurança',
    description: 'Monitoramento de segurança e auditoria do sistema',
    icon: <Shield className="w-8 h-8" />,
    category: 'sistema'
  },
  {
    id: '10',
    name: 'Jurisprudência',
    description: 'Consulta e análise de jurisprudência e precedentes',
    icon: <Gavel className="w-8 h-8" />,
    category: 'jurídico'
  },
  {
    id: '11',
    name: 'Biblioteca Digital',
    description: 'Acervo digital de livros, artigos e publicações jurídicas',
    icon: <BookOpen className="w-8 h-8" />,
    category: 'documentos'
  },
  {
    id: '12',
    name: 'Comunicação',
    description: 'Sistema de comunicação interna e notificações',
    icon: <MessageSquare className="w-8 h-8" />,
    category: 'comunicação'
  },
  {                                                                              // Added
    id: '13',                                                                    // Added
    name: 'Parecer Jurídico',                                                   // Added
    description: 'Sistema de elaboração e gestão de pareceres jurídicos',       // Added
    icon: <Gavel className="w-8 h-8" />,                                        // Added
    category: 'jurídico'                                                        // Added
  },                                                                             // Added
  {                                                                              // Added
    id: '14',                                                                    // Added
    name: 'Atos Normativos',                                                    // Added
    description: 'Gestão de decretos, portarias e demais atos normativos',     // Added
    icon: <BookOpen className="w-8 h-8" />,                                     // Added
    category: 'jurídico'                                                        // Added
  }                                                                              // Added
];

function AppContent() {
  const { isUserAuthorized, isAdmin: isAdminByEmail } = useAdmin();
  const { 
    isAuthenticated, 
    isLoading, 
    isInitializing, 
    user, 
    error, 
    login, 
    logout, 
    clearError,
    isAdmin: isAdminByGroups 
  } = useAuth();

  // Estados da plataforma
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(['1', '3', '6']); // IDs das ferramentas favoritas
  const [recentTools, setRecentTools] = useState<string[]>(['3', '1', '4', '2']); // IDs das ferramentas recentes
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'tool' | 'profile'>('dashboard');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Função de login adaptada para novo contexto
  const handleLogin = async (email: string, password: string) => {
    clearError(); // Limpar erros anteriores
    const success = await login(email, password);
    
    if (!success) {
      // O erro já está sendo gerenciado pelo contexto de autenticação
      console.log('Login falhou - erro gerenciado pelo AuthContext');
    }
  };

  // Função de logout adaptada
  const handleLogout = async () => {
    await logout();
    setCurrentView('dashboard');
    setSelectedTool(null);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    // Filtro especial para área administrativa - apenas admins podem acessar
    // Usar tanto a verificação por grupo AD quanto por email (compatibilidade)
    const isUserAdmin = user && (isAdminByGroups() || isAdminByEmail(user.email));
    if (user && !isUserAdmin) {
      filtered = filtered.filter(tool => tool.id !== '5'); // Remove Gestão de Usuários para não-admins
    }
    
    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    
    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory, user, isAdminByGroups, isAdminByEmail]);

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      // Adicionar à lista de recentes
      setRecentTools(prev => {
        const newRecents = [toolId, ...prev.filter(id => id !== toolId)];
        return newRecents.slice(0, 10); // Manter apenas os 10 mais recentes
      });
      
      setSelectedTool(tool);
      setCurrentView('tool');
    }
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSidebarToolSelect = (toolId: string) => {
    handleToolClick(toolId);
    setSidebarOpen(false); // Fechar sidebar no mobile
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTool(null);
  };

  const handleHomeClick = () => {
    setCurrentView('dashboard');
    setSelectedTool(null);
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const handleProfileSelect = () => {
    setCurrentView('profile');
    setSelectedTool(null);
  };

  const renderToolContent = () => {
    if (!selectedTool) return null;

    const toolProps = {
      onBack: handleBackToDashboard,
      onHome: handleHomeClick
    };

    switch (selectedTool.id) {
      case '1': // Miner
        return (
          <ToolLayout
            toolName={selectedTool.name}
            toolDescription={selectedTool.description}
            icon={selectedTool.icon}
            onBack={handleBackToDashboard}
            onHome={handleHomeClick}
          >
            <MinerTool {...toolProps} />
          </ToolLayout>
        );
      case '2': // Pautas
        return (
          <ToolLayout
            toolName={selectedTool.name}
            toolDescription={selectedTool.description}
            icon={selectedTool.icon}
            onBack={handleBackToDashboard}
            onHome={handleHomeClick}
          >
            <PautasTool {...toolProps} />
          </ToolLayout>
        );
      case '3': // IA PGE
        return (
          <ToolLayout
            toolName={selectedTool.name}
            toolDescription={selectedTool.description}
            icon={selectedTool.icon}
            onBack={handleBackToDashboard}
            onHome={handleHomeClick}
          >
            <IAPGETool {...toolProps} />
          </ToolLayout>
        );
      case '5': // Gestão de Usuários (Admin)
        const isUserAdmin = user && (isAdminByGroups() || isAdminByEmail(user.email));
        if (isUserAdmin) {
          return (
            <ToolLayout
              toolName={selectedTool.name}
              toolDescription={selectedTool.description}
              icon={selectedTool.icon}
              onBack={handleBackToDashboard}
              onHome={handleHomeClick}
            >
              <AdminTool {...toolProps} />
            </ToolLayout>
          );
        } else {
          return (
            <ToolLayout
              toolName={selectedTool.name}
              toolDescription={selectedTool.description}
              icon={selectedTool.icon}
              onBack={handleBackToDashboard}
              onHome={handleHomeClick}
            >
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-muted">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Acesso Negado</h3>
                <p className="text-muted-foreground mb-4">
                  Você não tem permissão para acessar esta área administrativa.
                  <br />
                  Apenas administradores podem gerenciar usuários, perfis, categorias e notificações.
                </p>
                <Button onClick={handleBackToDashboard} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                  Voltar ao Dashboard
                </Button>
              </div>
            </ToolLayout>
          );
        }
      case '6': // Documentos
        return (
          <ToolLayout
            toolName={selectedTool.name}
            toolDescription={selectedTool.description}
            icon={selectedTool.icon}
            onBack={handleBackToDashboard}
            onHome={handleHomeClick}
          >
            <DocumentsTool {...toolProps} />
          </ToolLayout>
        );
      case '13': // Parecer Jurídico                                              // Added
        return (                                                                  // Added
          <ToolLayout                                                             // Added
            toolName={selectedTool.name}                                         // Added
            toolDescription={selectedTool.description}                           // Added
            icon={selectedTool.icon}                                             // Added
            onBack={handleBackToDashboard}                                       // Added
            onHome={handleHomeClick}                                             // Added
          >                                                                       // Added
            <ParecerJuridicoTool {...toolProps} />                               // Added
          </ToolLayout>                                                           // Added
        );                                                                        // Added
      case '14': // Atos Normativos                                              // Added
        return (                                                                  // Added
          <ToolLayout                                                             // Added
            toolName={selectedTool.name}                                         // Added
            toolDescription={selectedTool.description}                           // Added
            icon={selectedTool.icon}                                             // Added
            onBack={handleBackToDashboard}                                       // Added
            onHome={handleHomeClick}                                             // Added
          >                                                                       // Added
            <AtosNormativosTool {...toolProps} />                                // Added
          </ToolLayout>                                                           // Added
        );                                                                        // Added
      default:
        return (
          <ToolLayout
            toolName={selectedTool.name}
            toolDescription={selectedTool.description}
            icon={selectedTool.icon}
            onBack={handleBackToDashboard}
            onHome={handleHomeClick}
          >
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center bg-muted">
                <div className="text-[--pge-blue]">
                  {selectedTool.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Ferramenta em Desenvolvimento</h3>
              <p className="text-muted-foreground mb-4">
                Esta ferramenta está sendo desenvolvida e estará disponível em breve.
              </p>
              <Button onClick={handleBackToDashboard} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                Voltar ao Dashboard
              </Button>
            </div>
          </ToolLayout>
        );
    }
  };

  // Mostra tela de carregamento inicial
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Se não está autenticado, mostra tela de login
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error || ''}
      />
    );
  }

  // Se está na visualização de ferramenta, renderiza o conteúdo da ferramenta
  if (currentView === 'tool') {
    return renderToolContent();
  }

  // Se está na visualização de perfil, renderiza o perfil do usuário
  if (currentView === 'profile') {
    return (
      <ToolLayout
        toolName="Meu Perfil"
        toolDescription="Gerencie suas informações pessoais e preferências"
        icon={<User className="w-8 h-8" />}
        onBack={handleBackToDashboard}
        onHome={handleHomeClick}
      >
        <UserProfileTool 
          user={user ? {
            name: user.displayName || user.firstName + ' ' + user.lastName,
            email: user.email
          } : undefined}
          onBack={handleBackToDashboard}
          onHome={handleHomeClick}
        />
      </ToolLayout>
    );
  }

  // Renderiza a plataforma principal
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            tools={filteredTools}
            favorites={favorites}
            recentTools={recentTools}
            selectedCategory={selectedCategory}
            user={user ? {
              name: user.displayName || user.firstName + ' ' + user.lastName,
              email: user.email
            } : null}
            onToggleFavorite={handleToggleFavorite}
            onCategorySelect={handleCategorySelect}
            onToolSelect={handleSidebarToolSelect}
            onLogout={handleLogout}
            onProfileSelect={handleProfileSelect}
          />
        </div>

        {/* Sidebar - Mobile (Overlay) */}
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar
                tools={filteredTools}
                favorites={favorites}
                recentTools={recentTools}
                selectedCategory={selectedCategory}
                user={user}
                onToggleFavorite={handleToggleFavorite}
                onCategorySelect={handleCategorySelect}
                onToolSelect={handleSidebarToolSelect}
                onLogout={handleLogout}
                onProfileSelect={handleProfileSelect}
              />
            </div>
          </>
        )}

        {/* Conteúdo Principal */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Botão Mobile Menu e Título */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-foreground">
                      Ferramentas Disponíveis
                    </h2>
                    <p className="text-muted-foreground">
                      Selecione uma ferramenta para acessar suas funcionalidades
                    </p>
                  </div>
                </div>
                {(searchTerm || selectedCategory !== 'all') && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {searchTerm && (
                      <div className="flex items-center bg-card rounded-full px-3 py-1 text-sm border border-border">
                        <span className="text-muted-foreground">Busca: </span>
                        <span className="font-medium ml-1 text-foreground">{searchTerm}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0 ml-2"
                          onClick={() => setSearchTerm('')}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    {selectedCategory !== 'all' && (
                      <div className="flex items-center bg-card rounded-full px-3 py-1 text-sm border border-border">
                        <span className="text-muted-foreground">Categoria: </span>
                        <span className="font-medium ml-1 capitalize text-foreground">{selectedCategory}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0 ml-2"
                          onClick={() => setSelectedCategory('all')}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center">
                      {filteredTools.length} resultado(s) encontrado(s)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de Ferramentas */}
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    id={tool.id}
                    name={tool.name}
                    description={tool.description}
                    icon={tool.icon}
                    isFavorite={favorites.includes(tool.id)}
                    onClick={() => handleToolClick(tool.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma ferramenta encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar sua busca ou limpe os filtros para ver todas as ferramentas
                </p>
                <div className="flex justify-center space-x-2">
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                    >
                      Limpar busca
                    </Button>
                  )}
                  {selectedCategory !== 'all' && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Mostrar todas as categorias
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProfileProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}