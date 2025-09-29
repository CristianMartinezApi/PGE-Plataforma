import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Search,
  UserPlus,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle,
  FolderTree,
  Tag,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  FileText,
  Brain,
  Gavel,        // Added
  BookOpen      // Added
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Switch } from '../ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { useAdmin } from '../../contexts/AdminContext';

interface AdminToolProps {
  onBack: () => void;
  onHome: () => void;
}

const availableTools = [
  { id: '1', name: 'Miner', category: 'análise' },
  { id: '2', name: 'Pautas', category: 'gestão' },
  { id: '3', name: 'IA PGE', category: 'ia' },
  { id: '4', name: 'Relatórios', category: 'análise' },
  { id: '5', name: 'Gestão de Usuários', category: 'gestão' },
  { id: '6', name: 'Documentos', category: 'documentos' },
  { id: '7', name: 'Base de Dados', category: 'dados' },
  { id: '8', name: 'Configurações', category: 'sistema' },
  { id: '9', name: 'Segurança', category: 'sistema' },
  { id: '10', name: 'Jurisprudência', category: 'jurídico' },
  { id: '11', name: 'Biblioteca Digital', category: 'documentos' },
  { id: '12', name: 'Comunicação', category: 'comunicação' },
  { id: '13', name: 'Parecer Jurídico', category: 'jurídico' },      // Added
  { id: '14', name: 'Atos Normativos', category: 'jurídico' }        // Added
];

const availableIcons = [
  { value: 'FolderTree', label: 'Pasta de Árvore', icon: <FolderTree className="w-4 h-4" /> },
  { value: 'Tag', label: 'Tag', icon: <Tag className="w-4 h-4" /> },
  { value: 'Search', label: 'Pesquisa', icon: <Search className="w-4 h-4" /> },
  { value: 'Settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  { value: 'FileText', label: 'Documento', icon: <FileText className="w-4 h-4" /> },
  { value: 'Brain', label: 'Cérebro', icon: <Brain className="w-4 h-4" /> },
  { value: 'Shield', label: 'Escudo', icon: <Shield className="w-4 h-4" /> },
  { value: 'Users', label: 'Usuários', icon: <Users className="w-4 h-4" /> },
  { value: 'Gavel', label: 'Martelo de Juiz', icon: <Gavel className="w-4 h-4" /> },     // Added
  { value: 'BookOpen', label: 'Livro Aberto', icon: <BookOpen className="w-4 h-4" /> }   // Added
];

const availableColors = [
  { value: '#0056A6', label: 'Azul PGE' },
  { value: '#28A745', label: 'Verde' },
  { value: '#DC3545', label: 'Vermelho' },
  { value: '#FFC107', label: 'Amarelo' },
  { value: '#9C27B0', label: 'Roxo' },
  { value: '#FF9800', label: 'Laranja' },
  { value: '#17A2B8', label: 'Ciano' },
  { value: '#6C757D', label: 'Cinza' }
];

export function AdminTool({ onBack, onHome }: AdminToolProps) {
  const {
    authorizedUsers,
    addAuthorizedUser,
    updateAuthorizedUser,
    deleteAuthorizedUser,
    toggleAuthorizedUserStatus,
    userProfiles,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
    notifications,
    addNotification,
    updateNotification,
    deleteNotification,
    toggleNotificationStatus
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para usuários autorizados
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    profile: '4'
  });

  // Estados para perfis
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    allowedTools: [] as string[]
  });

  // Estados para notificações
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    description: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    targetProfiles: [] as string[],
    expiresAt: ''
  });

  // Estados para categorias
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Análise',
      description: 'Ferramentas de análise e mineração de dados',
      icon: 'Search',
      color: '#0056A6',
      isActive: true,
      subcategories: [
        { id: '1-1', name: 'Mineração de Dados', description: 'Análise de documentos jurídicos', toolIds: ['1'] },
        { id: '1-2', name: 'Relatórios', description: 'Dashboard e indicadores', toolIds: ['4'] }
      ]
    },
    {
      id: '2',
      name: 'Gestão',
      description: 'Ferramentas de gestão administrativa',
      icon: 'Settings',
      color: '#28A745',
      isActive: true,
      subcategories: [
        { id: '2-1', name: 'Agenda', description: 'Pautas e agendamento', toolIds: ['2'] },
        { id: '2-2', name: 'Usuários', description: 'Gestão de usuários', toolIds: ['5'] }
      ]
    },
    {
      id: '3',
      name: 'Inteligência Artificial',
      description: 'Ferramentas de IA e automação',
      icon: 'Brain',
      color: '#9C27B0',
      isActive: true,
      subcategories: [
        { id: '3-1', name: 'Assistente IA', description: 'Consultas jurídicas automatizadas', toolIds: ['3'] }
      ]
    },
    {
      id: '4',
      name: 'Documentos',
      description: 'Gestão de documentos e arquivos',
      icon: 'FileText',
      color: '#FF9800',
      isActive: true,
      subcategories: [
        { id: '4-1', name: 'Repositório', description: 'Arquivos institucionais', toolIds: ['6'] },
        { id: '4-2', name: 'Biblioteca', description: 'Acervo digital', toolIds: ['11'] }
      ]
    }
  ]);
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'FolderTree',
    color: '#0056A6'
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2', '3', '4']);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    categoryId: '',
    name: '',
    description: ''
  });

  const filteredUsers = authorizedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para usuários
  const handleAddUser = () => {
    if (!newUser.email || !newUser.name) {
      toast.error('Email e nome são obrigatórios');
      return;
    }

    if (!newUser.email.includes('@pge.sc.gov.br')) {
      toast.error('Email deve ser do domínio @pge.sc.gov.br');
      return;
    }

    addAuthorizedUser({
      email: newUser.email,
      name: newUser.name,
      profile: newUser.profile,
      isActive: true
    });

    setNewUser({ email: '', name: '', profile: '4' });
    setIsAddUserOpen(false);
    toast.success('Usuário adicionado com sucesso');
  };

  const handleEditUser = () => {
    if (!editingUser) return;

    updateAuthorizedUser(editingUser.id, editingUser);
    setEditingUser(null);
    setIsEditUserOpen(false);
    toast.success('Usuário atualizado com sucesso');
  };

  // Funções para perfis
  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.description) {
      toast.error('Nome e descrição são obrigatórios');
      return;
    }

    addUserProfile({
      name: newProfile.name,
      description: newProfile.description,
      allowedTools: newProfile.allowedTools,
      isActive: true
    });

    setNewProfile({ name: '', description: '', allowedTools: [] });
    setIsAddProfileOpen(false);
    toast.success('Perfil criado com sucesso');
  };

  const handleEditProfile = () => {
    if (!editingProfile) return;

    updateUserProfile(editingProfile.id, editingProfile);
    setEditingProfile(null);
    setIsEditProfileOpen(false);
    toast.success('Perfil atualizado com sucesso');
  };

  // Funções para notificações
  const handleAddNotification = () => {
    if (!newNotification.title || !newNotification.description) {
      toast.error('Título e descrição são obrigatórios');
      return;
    }

    if (newNotification.targetProfiles.length === 0) {
      toast.error('Selecione pelo menos um perfil de usuário');
      return;
    }

    addNotification({
      title: newNotification.title,
      description: newNotification.description,
      type: newNotification.type,
      targetProfiles: newNotification.targetProfiles,
      isActive: true,
      expiresAt: newNotification.expiresAt || undefined
    });

    setNewNotification({
      title: '',
      description: '',
      type: 'info',
      targetProfiles: [],
      expiresAt: ''
    });
    setIsAddNotificationOpen(false);
    toast.success('Notificação criada com sucesso');
  };

  // Funções para categorias
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      toast.error('Nome e descrição são obrigatórios');
      return;
    }

    const newCategoryData = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      color: newCategory.color,
      isActive: true,
      subcategories: []
    };

    setCategories([...categories, newCategoryData]);
    setNewCategory({
      name: '',
      description: '',
      icon: 'FolderTree',
      color: '#0056A6'
    });
    setIsAddCategoryOpen(false);
    toast.success('Categoria criada com sucesso');
  };

  const handleEditCategory = () => {
    if (!editingCategory) return;

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    setIsEditCategoryOpen(false);
    toast.success('Categoria atualizada com sucesso');
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success('Categoria removida com sucesso');
  };

  const handleToggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.description || !newSubcategory.categoryId) {
      toast.error('Nome, descrição e categoria são obrigatórios');
      return;
    }

    const newSubcategoryData = {
      id: `sub-${Date.now()}`,
      name: newSubcategory.name,
      description: newSubcategory.description,
      toolIds: []
    };

    setCategories(categories.map(cat => 
      cat.id === newSubcategory.categoryId 
        ? { ...cat, subcategories: [...cat.subcategories, newSubcategoryData] }
        : cat
    ));
    
    setNewSubcategory({
      categoryId: '',
      name: '',
      description: ''
    });
    setIsAddSubcategoryOpen(false);
    toast.success('Subcategoria adicionada com sucesso');
  };

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
        : cat
    ));
    toast.success('Subcategoria removida com sucesso');
  };

  const getProfileName = (profileId: string) => {
    const profile = userProfiles.find(p => p.id === profileId);
    return profile?.name || 'Desconhecido';
  };

  const getProfileBadgeColor = (profileName: string) => {
    const colors: { [key: string]: string } = {
      'Administrador': 'bg-destructive/10 text-destructive',
      'Procurador': 'bg-[--pge-blue]/10 text-[--pge-blue]',
      'Assessor': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      'Estagiário': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
    };
    return colors[profileName] || 'bg-muted text-muted-foreground';
  };

  const getNotificationBadgeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'info': 'bg-[--pge-blue]/10 text-[--pge-blue]',
      'warning': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      'success': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      'error': 'bg-destructive/10 text-destructive'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'FolderTree': <FolderTree className={className} />,
      'Tag': <Tag className={className} />,
      'Search': <Search className={className} />,
      'Settings': <Settings className={className} />,
      'FileText': <FileText className={className} />,
      'Brain': <Brain className={className} />,
      'Shield': <Shield className={className} />,
      'Users': <Users className={className} />,
      'Gavel': <Gavel className={className} />,     // Added
      'BookOpen': <BookOpen className={className} />   // Added
    };
    return iconMap[iconName] || <FolderTree className={className} />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Área Administrativa
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de usuários, perfis, categorias e notificações
          </p>
        </div>
        <Alert className="max-w-md border-[--pge-blue]/20 bg-[--pge-blue]/10">
          <AlertTriangle className="w-4 h-4 text-[--pge-blue]" />
          <AlertDescription className="text-[--pge-blue] text-sm">
            Apenas administradores têm acesso a esta área
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Perfis</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <FolderTree className="w-4 h-4" />
            <span>Categorias</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Usuários */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[--pge-blue]" />
                  <span>Usuários Autorizados</span>
                </CardTitle>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Usuário Autorizado</DialogTitle>
                      <DialogDescription>
                        Adicione um novo usuário à lista de pessoas autorizadas
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="user-email">Email Institucional</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="usuario@pge.sc.gov.br"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-name">Nome Completo</Label>
                        <Input
                          id="user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="João Silva"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user-profile">Perfil</Label>
                        <Select 
                          value={newUser.profile} 
                          onValueChange={(value) => setNewUser({...newUser, profile: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {userProfiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddUser} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getProfileBadgeColor(getProfileName(user.profile))}>
                            {getProfileName(user.profile)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setIsEditUserOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAuthorizedUserStatus(user.id)}
                            >
                              {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAuthorizedUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                Total: {filteredUsers.length} usuários
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Perfis */}
        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[--pge-blue]" />
                  <span>Perfis de Usuário</span>
                </CardTitle>
                <Dialog open={isAddProfileOpen} onOpenChange={setIsAddProfileOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Perfil</DialogTitle>
                      <DialogDescription>
                        Defina um novo perfil de usuário com suas permissões
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile-name">Nome do Perfil</Label>
                        <Input
                          id="profile-name"
                          value={newProfile.name}
                          onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                          placeholder="Ex: Analista Jurídico"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-description">Descrição</Label>
                        <Textarea
                          id="profile-description"
                          value={newProfile.description}
                          onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                          placeholder="Descreva as responsabilidades deste perfil..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Ferramentas Permitidas</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded p-3">
                          {availableTools.map(tool => (
                            <div key={tool.id} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={newProfile.allowedTools.includes(tool.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewProfile({
                                      ...newProfile,
                                      allowedTools: [...newProfile.allowedTools, tool.id]
                                    });
                                  } else {
                                    setNewProfile({
                                      ...newProfile,
                                      allowedTools: newProfile.allowedTools.filter(id => id !== tool.id)
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm">{tool.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddProfileOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddProfile} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                          Criar Perfil
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {userProfiles.map((profile) => (
                <Card key={profile.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={profile.isActive ? "default" : "secondary"}>
                          {profile.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsEditProfileOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {profile.id !== '1' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUserProfile(profile.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Ferramentas Permitidas:</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {availableTools.map(tool => (
                          <div key={tool.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={profile.allowedTools.includes(tool.id)}
                              readOnly
                            />
                            <span className="text-sm">{tool.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Usuários com este perfil: {authorizedUsers.filter(u => u.profile === profile.id).length}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Categorias */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FolderTree className="w-5 h-5" style={{ color: 'var(--pge-blue)' }} />
                  <span>Gestão de Categorias</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Tag className="w-4 h-4 mr-2" />
                        Adicionar Subcategoria
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Subcategoria</DialogTitle>
                        <DialogDescription>
                          Crie uma nova subcategoria dentro de uma categoria existente
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subcategory-category">Categoria Pai</Label>
                          <Select 
                            value={newSubcategory.categoryId} 
                            onValueChange={(value) => setNewSubcategory({...newSubcategory, categoryId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria..." />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subcategory-name">Nome da Subcategoria</Label>
                          <Input
                            id="subcategory-name"
                            value={newSubcategory.name}
                            onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                            placeholder="Ex: Análise Avançada"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subcategory-description">Descrição</Label>
                          <Textarea
                            id="subcategory-description"
                            value={newSubcategory.description}
                            onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                            placeholder="Descreva o propósito desta subcategoria..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddSubcategory} style={{ backgroundColor: 'var(--pge-blue)' }}>
                            Adicionar Subcategoria
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button style={{ backgroundColor: 'var(--pge-blue)' }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Categoria</DialogTitle>
                        <DialogDescription>
                          Defina uma nova categoria principal para organizar as ferramentas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="category-name">Nome da Categoria</Label>
                          <Input
                            id="category-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                            placeholder="Ex: Relatórios Avançados"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category-description">Descrição</Label>
                          <Textarea
                            id="category-description"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                            placeholder="Descreva o propósito desta categoria..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category-icon">Ícone</Label>
                          <Select 
                            value={newCategory.icon} 
                            onValueChange={(value) => setNewCategory({...newCategory, icon: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((iconOption) => (
                                <SelectItem key={iconOption.value} value={iconOption.value}>
                                  <div className="flex items-center space-x-2">
                                    {iconOption.icon}
                                    <span>{iconOption.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category-color">Cor</Label>
                          <Select 
                            value={newCategory.color} 
                            onValueChange={(value) => setNewCategory({...newCategory, color: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableColors.map((colorOption) => (
                                <SelectItem key={colorOption.value} value={colorOption.value}>
                                  <div className="flex items-center space-x-2">
                                    <div 
                                      className="w-4 h-4 rounded-full border" 
                                      style={{ backgroundColor: colorOption.value }}
                                    />
                                    <span>{colorOption.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddCategory} style={{ backgroundColor: 'var(--pge-blue)' }}>
                            Criar Categoria
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category) => (
                <Card key={category.id} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCategoryExpansion(category.id)}
                          className="p-1"
                        >
                          {expandedCategories.includes(category.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </Button>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20', color: category.color }}
                        >
                          {renderIcon(category.icon, "w-5 h-5")}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-pge-text-secondary">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className="text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.subcategories.length} subcategorias
                        </Badge>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsEditCategoryOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedCategories.includes(category.id) && (
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-pge-text-secondary mb-3">
                        <ArrowRight className="w-4 h-4" />
                        <span>Subcategorias</span>
                      </div>
                      
                      {category.subcategories.length === 0 ? (
                        <div className="text-center py-6 text-pge-text-secondary">
                          <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma subcategoria criada</p>
                          <p className="text-xs">Use o botão "Adicionar Subcategoria" para criar</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <Card key={subcategory.id} className="bg-pge-light-gray border-l-4" style={{ borderLeftColor: category.color }}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{subcategory.name}</h4>
                                    <p className="text-sm text-pge-text-secondary">{subcategory.description}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {subcategory.toolIds.length} ferramentas
                                      </Badge>
                                      {subcategory.toolIds.map(toolId => {
                                        const tool = availableTools.find(t => t.id === toolId);
                                        return tool ? (
                                          <Badge key={toolId} variant="secondary" className="text-xs">
                                            {tool.name}
                                          </Badge>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}

              <div className="mt-6 text-sm text-pge-text-secondary">
                Total: {categories.length} categorias principais • {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)} subcategorias
              </div>
            </CardContent>
          </Card>

          {/* Dialog de Edição de Categoria */}
          <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Categoria</DialogTitle>
                <DialogDescription>
                  Modifique as configurações da categoria
                </DialogDescription>
              </DialogHeader>
              {editingCategory && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-category-name">Nome</Label>
                    <Input
                      id="edit-category-name"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category-description">Descrição</Label>
                    <Textarea
                      id="edit-category-description"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category-icon">Ícone</Label>
                    <Select 
                      value={editingCategory.icon} 
                      onValueChange={(value) => setEditingCategory({...editingCategory, icon: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((iconOption) => (
                          <SelectItem key={iconOption.value} value={iconOption.value}>
                            <div className="flex items-center space-x-2">
                              {iconOption.icon}
                              <span>{iconOption.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-category-color">Cor</Label>
                    <Select 
                      value={editingCategory.color} 
                      onValueChange={(value) => setEditingCategory({...editingCategory, color: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map((colorOption) => (
                          <SelectItem key={colorOption.value} value={colorOption.value}>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: colorOption.value }}
                              />
                              <span>{colorOption.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEditCategory} style={{ backgroundColor: 'var(--pge-blue)' }}>
                      Salvar
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Aba de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" style={{ color: 'var(--pge-blue)' }} />
                  <span>Notificações do Sistema</span>
                </CardTitle>
                <Dialog open={isAddNotificationOpen} onOpenChange={setIsAddNotificationOpen}>
                  <DialogTrigger asChild>
                    <Button style={{ backgroundColor: 'var(--pge-blue)' }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Notificação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Notificação</DialogTitle>
                      <DialogDescription>
                        Envie uma notificação para usuários específicos
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notification-title">Título</Label>
                        <Input
                          id="notification-title"
                          value={newNotification.title}
                          onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                          placeholder="Título da notificação"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notification-description">Descrição</Label>
                        <Textarea
                          id="notification-description"
                          value={newNotification.description}
                          onChange={(e) => setNewNotification({...newNotification, description: e.target.value})}
                          placeholder="Conteúdo da notificação..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notification-type">Tipo</Label>
                        <Select 
                          value={newNotification.type} 
                          onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Informação</SelectItem>
                            <SelectItem value="warning">Aviso</SelectItem>
                            <SelectItem value="success">Sucesso</SelectItem>
                            <SelectItem value="error">Erro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Perfis de Destino</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-3">
                          {userProfiles.map(profile => (
                            <div key={profile.id} className="flex items-center space-x-2">
                              <Checkbox 
                                checked={newNotification.targetProfiles.includes(profile.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewNotification({
                                      ...newNotification,
                                      targetProfiles: [...newNotification.targetProfiles, profile.id]
                                    });
                                  } else {
                                    setNewNotification({
                                      ...newNotification,
                                      targetProfiles: newNotification.targetProfiles.filter(id => id !== profile.id)
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm">{profile.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notification-expires">Data de Expiração (Opcional)</Label>
                        <Input
                          id="notification-expires"
                          type="datetime-local"
                          value={newNotification.expiresAt}
                          onChange={(e) => setNewNotification({...newNotification, expiresAt: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddNotificationOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddNotification} style={{ backgroundColor: 'var(--pge-blue)' }}>
                          Criar Notificação
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto text-pge-text-secondary mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-pge-text-primary mb-2">
                    Nenhuma notificação criada
                  </h3>
                  <p className="text-pge-text-secondary mb-4">
                    Crie notificações para comunicar informações importantes aos usuários
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              <Badge className={getNotificationBadgeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              <Badge variant={notification.isActive ? "default" : "secondary"}>
                                {notification.isActive ? 'Ativa' : 'Inativa'}
                              </Badge>
                            </div>
                            <p className="text-sm text-pge-text-secondary mb-3">{notification.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-pge-text-secondary">
                              <span>Perfis: {notification.targetProfiles.map(id => getProfileName(id)).join(', ')}</span>
                              {notification.expiresAt && (
                                <span>Expira: {new Date(notification.expiresAt).toLocaleDateString('pt-BR')}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleNotificationStatus(notification.id)}
                            >
                              {notification.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-sm text-pge-text-secondary">
                Total: {notifications.length} notificações • {notifications.filter(n => n.isActive).length} ativas
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}