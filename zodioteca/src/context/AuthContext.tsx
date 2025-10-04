import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    
    // Simulamos una llamada a la API - en el futuro será Firebase
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Usuario demo para testing
    const mockUser: User = {
      id: '1',
      name: 'Usuario Demo',
      email: email,
      avatar: '🌟'
    };
    
    setUser(mockUser);
    setIsLoading(false);
    
    // Guardamos en localStorage para persistencia
    localStorage.setItem('zodioteca_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zodioteca_user');
  };

  // Revisar si hay usuario guardado al inicializar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('zodioteca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading: isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};