import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthChange, 
  signInWithGoogle, 
  signInAnonymousMode, 
  signOutUser,
  getUserSettings,
  saveUserSettings,
  handleRedirectResult
} from '../services/firebase';

interface User {
  id: string;
  name: string;
  email: string | null;
  avatar?: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: (useRedirect?: boolean) => Promise<{ success: boolean; error?: string; pending?: boolean }>;
  loginAnonymous: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  syncSettings: (settings: any) => Promise<void>;
  loadSettings: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const redirectCheckedRef = useRef(false);
  
  // Timeout de seguridad: si después de 5 segundos sigue loading, forzar false
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [AuthContext] Timeout: forzando isLoading = false después de 5 segundos');
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Escucha cambios de autenticación de Firebase
  useEffect(() => {
    console.log('🔵 [AuthContext] Inicializando auth...');
    
    // Primero verificar si hay un redirect result pendiente
    const checkRedirect = async () => {
      // CRÍTICO: Solo llamar una vez (previene doble llamada por React.StrictMode)
      if (redirectCheckedRef.current) {
        console.log('🔵 [AuthContext] Redirect ya verificado, saltando...');
        return;
      }
      redirectCheckedRef.current = true;
      
      console.log('🔵 [AuthContext] Verificando redirect result...');
      const redirectResult = await handleRedirectResult();
      
      if (redirectResult.success && redirectResult.user) {
        console.log('✅ [AuthContext] Usuario logueado via redirect:', redirectResult.user.email);
      } else if (redirectResult.error) {
        console.error('❌ [AuthContext] Error en redirect:', redirectResult.error);
      } else {
        console.log('🔵 [AuthContext] No hay redirect result (login normal)');
      }
    };
    
    checkRedirect();

    const unsubscribe = onAuthChange((firebaseUser) => {
      console.log('🔵 [AuthContext] onAuthChange disparado:', firebaseUser ? firebaseUser.email : 'no user');
      
      if (firebaseUser) {
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuario de Prueba',
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || '🌟',
          isAnonymous: firebaseUser.isAnonymous
        };
        setUser(mappedUser);
        console.log('✅ [AuthContext] Usuario configurado:', mappedUser.email);
        
        // Cargar settings si el usuario no es anónimo
        if (!firebaseUser.isAnonymous) {
          console.log('🔵 [AuthContext] Cargando settings desde la nube...');
          getUserSettings(firebaseUser.uid).then((result) => {
            if (result.success && result.settings) {
              localStorage.setItem('zodioteca_settings', JSON.stringify(result.settings));
              console.log('✅ [AuthContext] Settings cargados y guardados localmente');
            }
          });
        }
      } else {
        console.log('🔵 [AuthContext] No hay usuario, limpiando estado');
        setUser(null);
      }
      
      console.log('🔵 [AuthContext] Configurando isLoading = false');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (useRedirect = false) => {
    console.log('🔵 [AuthContext] loginWithGoogle llamado', { useRedirect });
    
    // CRÍTICO: Evitar múltiples llamadas simultáneas
    if (isLoading) {
      console.log('⚠️ [AuthContext] Ya hay un login en progreso, ignorando...');
      return { success: false, error: 'Login en progreso' };
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔵 [AuthContext] Llamando a signInWithGoogle...', { useRedirect });
      const result = await signInWithGoogle(useRedirect);
      
      console.log('🔵 [AuthContext] Resultado recibido:', result);
      
      // Si es pending (redirect), no hacer nada más
      if (result.pending) {
        console.log('🔄 [AuthContext] Redirigiendo a Google...');
        return result;
      }
      
      // Si login exitoso, cargar settings
      if (result.success && result.user) {
        console.log('✅ [AuthContext] Login exitoso, cargando settings...');
        const settingsResult = await getUserSettings(result.user.uid);
        if (settingsResult.success && settingsResult.settings) {
          localStorage.setItem('zodioteca_settings', JSON.stringify(settingsResult.settings));
          console.log('✅ [AuthContext] Settings cargados desde la nube');
        }
      } else if (!result.success) {
        console.error('❌ [AuthContext] Error en login:', result.error);
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('❌ [AuthContext] Error inesperado:', error);
      setIsLoading(false);
      return { success: false, error: String(error) };
    }
  };

  const loginAnonymous = async () => {
    setIsLoading(true);
    const result = await signInAnonymousMode();
    setIsLoading(false);
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    await signOutUser();
    setUser(null);
    localStorage.removeItem('zodioteca_settings');
    setIsLoading(false);
  };

  const syncSettings = async (settings: any) => {
    if (user && !user.isAnonymous) {
      await saveUserSettings(user.id, settings);
    }
    localStorage.setItem('zodioteca_settings', JSON.stringify(settings));
  };

  const loadSettings = async () => {
    if (user && !user.isAnonymous) {
      const result = await getUserSettings(user.id);
      if (result.success && result.settings) {
        localStorage.setItem('zodioteca_settings', JSON.stringify(result.settings));
        return result.settings;
      }
    }
    
    // Fallback a localStorage
    const localSettings = localStorage.getItem('zodioteca_settings');
    return localSettings ? JSON.parse(localSettings) : null;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginAnonymous,
    logout,
    loading: isLoading,
    syncSettings,
    loadSettings
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