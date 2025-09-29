import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthorizedUser {
  id: string;
  email: string;
  name: string;
  profile: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserProfile {
  id: string;
  name: string;
  description: string;
  allowedTools: string[];
  isActive: boolean;
}

interface NotificationData {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetProfiles: string[];
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface AdminContextType {
  // Usuários autorizados
  authorizedUsers: AuthorizedUser[];
  addAuthorizedUser: (userData: Omit<AuthorizedUser, 'id' | 'createdAt'>) => void;
  updateAuthorizedUser: (userId: string, updates: Partial<AuthorizedUser>) => void;
  deleteAuthorizedUser: (userId: string) => void;
  toggleAuthorizedUserStatus: (userId: string) => void;
  
  // Perfis de usuário
  userProfiles: UserProfile[];
  addUserProfile: (profile: Omit<UserProfile, 'id'>) => void;
  updateUserProfile: (profileId: string, updates: Partial<UserProfile>) => void;
  deleteUserProfile: (profileId: string) => void;
  
  // Notificações
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'createdAt'>) => void;
  updateNotification: (notificationId: string, updates: Partial<NotificationData>) => void;
  deleteNotification: (notificationId: string) => void;
  toggleNotificationStatus: (notificationId: string) => void;
  
  // Helpers
  isUserAuthorized: (email: string) => boolean;
  getUserProfile: (email: string) => string;
  getUserAllowedTools: (email: string) => string[];
  getNotificationsForProfile: (profile: string) => NotificationData[];
  isAdmin: (email: string) => boolean;
}

const defaultUserProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    allowedTools: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    isActive: true
  },
  {
    id: '2',
    name: 'Procurador',
    description: 'Acesso às ferramentas jurídicas',
    allowedTools: ['1', '3', '4', '6', '7', '10', '11', '12'],
    isActive: true
  },
  {
    id: '3',
    name: 'Assessor',
    description: 'Acesso limitado às ferramentas básicas',
    allowedTools: ['1', '3', '6', '10', '11', '12'],
    isActive: true
  },
  {
    id: '4',
    name: 'Estagiário',
    description: 'Acesso básico de consulta',
    allowedTools: ['6', '11', '12'],
    isActive: true
  }
];

// Lista de emails administradores (hardcoded para segurança)
const ADMIN_EMAILS = [
  'carlos.admin@pge.sc.gov.br',
  'admin@pge.sc.gov.br'
];

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(defaultUserProfiles);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Initialize with mock data
  useEffect(() => {
    const mockAuthorizedUsers: AuthorizedUser[] = [
      {
        id: '1',
        email: 'carlos.admin@pge.sc.gov.br',
        name: 'Carlos Admin',
        profile: '1', // Administrador
        isActive: true,
        createdAt: '2024-01-01T08:00:00Z',
        lastLogin: '2024-01-15T07:00:00Z'
      },
      {
        id: '2',
        email: 'joao.silva@pge.sc.gov.br',
        name: 'João Silva',
        profile: '2', // Procurador
        isActive: true,
        createdAt: '2024-01-01T09:00:00Z',
        lastLogin: '2024-01-15T10:30:00Z'
      },
      {
        id: '3',
        email: 'maria.santos@pge.sc.gov.br',
        name: 'Maria Santos',
        profile: '3', // Assessor
        isActive: true,
        createdAt: '2024-01-02T14:00:00Z',
        lastLogin: '2024-01-15T09:15:00Z'
      },
      {
        id: '4',
        email: 'pedro.oliveira@pge.sc.gov.br',
        name: 'Pedro Oliveira',
        profile: '4', // Estagiário
        isActive: true,
        createdAt: '2024-01-03T08:30:00Z',
        lastLogin: '2024-01-14T16:45:00Z'
      },
      {
        id: '5',
        email: 'ana.costa@pge.sc.gov.br',
        name: 'Ana Costa',
        profile: '3', // Assessor
        isActive: false,
        createdAt: '2024-01-04T11:00:00Z'
      }
    ];

    const mockNotifications: NotificationData[] = [
      {
        id: '1',
        title: 'Nova versão disponível',
        description: 'IA PGE foi atualizada com novas funcionalidades de análise jurisprudencial',
        type: 'info',
        targetProfiles: ['2', '3'], // Procurador e Assessor
        isActive: true,
        createdAt: '2024-01-15T08:00:00Z'
      },
      {
        id: '2',
        title: 'Manutenção programada',
        description: 'Sistema Miner estará em manutenção no sábado das 22h às 6h',
        type: 'warning',
        targetProfiles: ['1', '2', '3', '4'], // Todos
        isActive: true,
        createdAt: '2024-01-14T17:00:00Z',
        expiresAt: '2024-01-20T06:00:00Z'
      },
      {
        id: '3',
        title: 'Backup concluído',
        description: 'Base de dados atualizada com sucesso',
        type: 'success',
        targetProfiles: ['1'], // Apenas administradores
        isActive: true,
        createdAt: '2024-01-13T02:00:00Z'
      }
    ];

    setAuthorizedUsers(mockAuthorizedUsers);
    setNotifications(mockNotifications);
  }, []);

  // Authorized Users Management
  const addAuthorizedUser = (userData: Omit<AuthorizedUser, 'id' | 'createdAt'>) => {
    const user: AuthorizedUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAuthorizedUsers(prev => [...prev, user]);
  };

  const updateAuthorizedUser = (userId: string, updates: Partial<AuthorizedUser>) => {
    setAuthorizedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteAuthorizedUser = (userId: string) => {
    setAuthorizedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const toggleAuthorizedUserStatus = (userId: string) => {
    setAuthorizedUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  // User Profiles Management
  const addUserProfile = (profileData: Omit<UserProfile, 'id'>) => {
    const profile: UserProfile = {
      ...profileData,
      id: Date.now().toString()
    };
    setUserProfiles(prev => [...prev, profile]);
  };

  const updateUserProfile = (profileId: string, updates: Partial<UserProfile>) => {
    setUserProfiles(prev => prev.map(profile => 
      profile.id === profileId ? { ...profile, ...updates } : profile
    ));
  };

  const deleteUserProfile = (profileId: string) => {
    setUserProfiles(prev => prev.filter(profile => profile.id !== profileId));
  };

  // Notifications Management
  const addNotification = (notificationData: Omit<NotificationData, 'id' | 'createdAt'>) => {
    const notification: NotificationData = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notification]);
  };

  const updateNotification = (notificationId: string, updates: Partial<NotificationData>) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, ...updates } : notification
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const toggleNotificationStatus = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isActive: !notification.isActive } 
        : notification
    ));
  };

  // Helper functions
  const isUserAuthorized = (email: string): boolean => {
    const user = authorizedUsers.find(u => u.email === email && u.isActive);
    return !!user;
  };

  const getUserProfile = (email: string): string => {
    const user = authorizedUsers.find(u => u.email === email && u.isActive);
    return user?.profile || '4'; // Default to Estagiário
  };

  const getUserAllowedTools = (email: string): string[] => {
    const profileId = getUserProfile(email);
    const profile = userProfiles.find(p => p.id === profileId && p.isActive);
    return profile?.allowedTools || [];
  };

  const getNotificationsForProfile = (profileId: string): NotificationData[] => {
    const now = new Date();
    return notifications.filter(notification => {
      // Check if notification is active
      if (!notification.isActive) return false;
      
      // Check if notification is expired
      if (notification.expiresAt && new Date(notification.expiresAt) < now) return false;
      
      // Check if profile is targeted
      return notification.targetProfiles.includes(profileId);
    });
  };

  const isAdmin = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email);
  };

  return (
    <AdminContext.Provider value={{
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
      toggleNotificationStatus,
      
      isUserAuthorized,
      getUserProfile,
      getUserAllowedTools,
      getNotificationsForProfile,
      isAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}