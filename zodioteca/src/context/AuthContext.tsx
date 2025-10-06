import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthObject';
import type { AuthContextType, User } from './AuthObject';

// ============================================
// TIPOS
// ============================================

// Tipo User importado desde AuthObject

// Tipo importado desde AuthObject

// ============================================
// CONTEXT (local, sin Firebase)
// ============================================

// Context definido en AuthObject.ts para compatibilidad con Fast Refresh

const GUEST_KEY = 'zodioteca_guest_enabled';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar estado desde localStorage (modo prueba persistente)
  useEffect(() => {
    const isGuest = localStorage.getItem(GUEST_KEY) === '1';
    if (isGuest) {
      setUser({
        id: 'guest',
        name: 'Invitado',
        email: null,
        isAnonymous: true,
      });
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    // Deshabilitado: botón visible pero sin conexión
    return Promise.reject(new Error('Inicio con Google no disponible'));
  };

  const loginAnonymous = async () => {
    setUser({ id: 'guest', name: 'Invitado', email: null, isAnonymous: true });
    localStorage.setItem(GUEST_KEY, '1');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(GUEST_KEY);
  };

  const syncSettings = async (settings: Record<string, unknown>) => {
    // Guardado local únicamente en modo prueba
    try {
      localStorage.setItem('zodioteca_settings', JSON.stringify(settings));
    } catch {
      // no-op
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    loginAnonymous,
    logout,
    syncSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Nota: el hook useAuth vive en src/context/useAuth.ts para compatibilidad con Fast Refresh
