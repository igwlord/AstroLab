// ============================================
// GOOGLE DRIVE AUTHENTICATION CONTEXT
// Maneja la autenticación OAuth con Google Drive
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { 
  setDriveAccessToken, 
  getDriveAccessToken, 
  clearDriveAccessToken 
} from '../services/chartStorage';
import { logger } from '../utils/logger';
import PopupBlockedAlert from '../components/PopupBlockedAlert';
import PopupWaitingIndicator from '../components/PopupWaitingIndicator';

// ============================================
// TIPOS
// ============================================

interface GoogleDriveContextType {
  isAuthenticated: boolean;
  isConnecting: boolean;
  isWaitingForPopup: boolean;
  login: () => void;
  logout: () => void;
  userEmail: string | null;
  showPopupBlockedAlert: boolean;
  setShowPopupBlockedAlert: (show: boolean) => void;
}

// ============================================
// CONTEXT
// ============================================

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

// ============================================
// PROVIDER INTERNO
// ============================================

export const GoogleDriveProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWaitingForPopup, setIsWaitingForPopup] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showPopupBlockedAlert, setShowPopupBlockedAlert] = useState(false);
  const [popupOpenTime, setPopupOpenTime] = useState<number>(0);

  // Verificar token existente al montar
  useEffect(() => {
    const token = getDriveAccessToken();
    if (token) {
      setIsAuthenticated(true);
      fetchUserInfo(token);
    }
  }, []);

  // Obtener info del usuario
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email);
        logger.log('✅ Usuario autenticado:', data.email);
      } else {
        // Token inválido
        clearDriveAccessToken();
        setIsAuthenticated(false);
      }
    } catch (error) {
      logger.error('Error fetching user info:', error);
    }
  };

  // Login con Google
  const login = useGoogleLogin({
    onSuccess: (response) => {
      logger.log('✅ Login exitoso con Google Drive');
      setDriveAccessToken(response.access_token);
      setIsAuthenticated(true);
      setIsConnecting(false);
      setIsWaitingForPopup(false);
      fetchUserInfo(response.access_token);
    },
    onError: (error) => {
      logger.error('❌ Error en login con Google Drive:', error);
      setIsConnecting(false);
      setIsWaitingForPopup(false);
      // No mostrar alerta si el usuario simplemente canceló
      // Solo si es un error real
    },
    scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email',
    onNonOAuthError: (error) => {
      const timeOpen = Date.now() - popupOpenTime;
      const errorObj = error as { type?: string; message?: string };
      
      logger.error('❌ Error no-OAuth:', {
        error: errorObj,
        timeOpen: `${(timeOpen / 1000).toFixed(1)}s`,
        message: 'El popup se cerró antes de devolver el token'
      });
      
      setIsConnecting(false);
      setIsWaitingForPopup(false);
      
      // Si el popup se cerró después de que el usuario interactuó (>3 segundos),
      // es probablemente un problema de configuración de URIs
      if (errorObj.type === 'popup_closed') {
        if (timeOpen > 3000) {
          // El usuario tuvo tiempo de autenticarse - problema de configuración
          logger.error('� PROBLEMA: El popup se cerró DESPUÉS de autenticar.');
          logger.error('Esto sugiere que las URIs de redirección no están configuradas correctamente.');
          logger.error('Verifica que en Google Cloud Console tengas:');
          logger.error(`- JavaScript origin: ${window.location.origin}`);
          logger.error(`- Redirect URI: ${window.location.origin}`);
          // No mostrar alerta - el usuario ya intentó conectar
        } else {
          // Se cerró muy rápido - popup bloqueado o usuario canceló
          logger.log('ℹ️ Usuario canceló o popup bloqueado inmediatamente');
        }
      }
    },
    // CAMBIADO: Sin especificar 'flow' - usando el comportamiento predeterminado
    // flow: 'implicit', // COMENTADO para probar
  });

  const handleLogin = () => {
    // Log de debugging
    logger.log('🚀 Iniciando autenticación con Google Drive...');
    logger.log('📍 Origin:', window.location.origin);
    logger.log('📍 Full URL:', window.location.href);
    logger.log('🔑 Client ID configurado:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Sí' : 'No');
    
    setIsConnecting(true);
    setIsWaitingForPopup(true);
    setPopupOpenTime(Date.now()); // Registrar cuándo se abre
    try {
      login();
      logger.log('✅ Popup de Google lanzado');
    } catch (error) {
      logger.error('❌ Error al iniciar login:', error);
      setIsConnecting(false);
      setIsWaitingForPopup(false);
      setShowPopupBlockedAlert(true);
    }
  };

  const logout = () => {
    clearDriveAccessToken();
    setIsAuthenticated(false);
    setUserEmail(null);
    logger.log('👋 Desconectado de Google Drive');
  };

  return (
    <GoogleDriveContext.Provider
      value={{
        isAuthenticated,
        isConnecting,
        isWaitingForPopup,
        login: handleLogin,
        logout,
        userEmail,
        showPopupBlockedAlert,
        setShowPopupBlockedAlert,
      }}
    >
      {children}
      
      {/* Alerta cuando el popup fue bloqueado */}
      {showPopupBlockedAlert && (
        <PopupBlockedAlert
          onClose={() => setShowPopupBlockedAlert(false)}
          onRetry={handleLogin}
        />
      )}
      
      {/* Indicador cuando el popup está abierto esperando */}
      {isWaitingForPopup && !showPopupBlockedAlert && (
        <PopupWaitingIndicator
          onCancel={() => {
            setIsWaitingForPopup(false);
            setIsConnecting(false);
          }}
        />
      )}
    </GoogleDriveContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useGoogleDrive = () => {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDrive must be used within GoogleDriveProvider');
  }
  return context;
};

// ============================================
// WRAPPER CON OAUTH PROVIDER
// ============================================

export const GoogleDriveWrapper = ({ children }: { children: ReactNode }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    logger.error('⚠️ VITE_GOOGLE_CLIENT_ID no configurado');
    // Renderizar sin Google Drive
    return (
      <GoogleDriveContext.Provider
        value={{
          isAuthenticated: false,
          isConnecting: false,
          isWaitingForPopup: false,
          login: () => logger.error('Google Drive no configurado'),
          logout: () => {},
          userEmail: null,
          showPopupBlockedAlert: false,
          setShowPopupBlockedAlert: () => {},
        }}
      >
        {children}
      </GoogleDriveContext.Provider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleDriveProvider>{children}</GoogleDriveProvider>
    </GoogleOAuthProvider>
  );
};
