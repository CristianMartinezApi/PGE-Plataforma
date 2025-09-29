import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfileData {
  avatar?: string;
  theme: 'light' | 'dark' | 'system';
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    compactView: boolean;
  };
}

interface UserProfileContextType {
  profileData: UserProfileData;
  updateAvatar: (avatar: string | undefined) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  updatePreferences: (preferences: Partial<UserProfileData['preferences']>) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}

interface UserProfileProviderProps {
  children: ReactNode;
}

const defaultProfileData: UserProfileData = {
  theme: 'system',
  preferences: {
    notifications: true,
    emailAlerts: true,
    compactView: false
  }
};

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const [profileData, setProfileData] = useState<UserProfileData>(defaultProfileData);

  // Carregar dados do perfil do localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('pge-user-profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({ ...defaultProfileData, ...parsed });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      // Se houver erro, manter dados padrão
      setProfileData(defaultProfileData);
    }
  }, []);

  // Salvar dados do perfil no localStorage sempre que houver mudança
  const saveProfile = (newProfileData: UserProfileData) => {
    setProfileData(newProfileData);
    localStorage.setItem('pge-user-profile', JSON.stringify(newProfileData));
  };

  const updateAvatar = (avatar: string | undefined) => {
    const newProfileData = {
      ...profileData,
      avatar
    };
    saveProfile(newProfileData);
  };

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    const newProfileData = {
      ...profileData,
      theme
    };
    saveProfile(newProfileData);
  };

  const updatePreferences = (preferences: Partial<UserProfileData['preferences']>) => {
    const newProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        ...preferences
      }
    };
    saveProfile(newProfileData);
  };

  const resetProfile = () => {
    localStorage.removeItem('pge-user-profile');
    setProfileData(defaultProfileData);
  };

  return (
    <UserProfileContext.Provider value={{
      profileData,
      updateAvatar,
      updateTheme,
      updatePreferences,
      resetProfile
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}