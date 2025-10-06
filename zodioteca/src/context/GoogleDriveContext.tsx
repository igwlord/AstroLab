// ============================================
// GOOGLE DRIVE AUTHENTICATION CONTEXT V2
// Implementación directa con Google Identity Services
// ============================================

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
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

// Tipos para Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

// ============================================
// CONTEXT
// ============================================

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const GoogleDriveProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWaitingForPopup, setIsWaitingForPopup] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showPopupBlockedAlert, setShowPopupBlockedAlert] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  
  // ⚠️ REF para evitar dobles llamadas al popup
  const requestingRef = useRef(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Cargar el script de Google Identity Services
  useEffect(() => {
    if (!clientId) {
      logger.error('⚠️ VITE_GOOGLE_CLIENT_ID no configurado');
      return;
    }

    // Cargar el script si no está cargado
    if (!document.getElementById('google-identity-services')) {
      const script = document.createElement('script');
      script.id = 'google-identity-services';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.body.appendChild(script);
    } else if (window.google) {
      initializeGoogleAuth();
    }
  }, [clientId]);

  // Inicializar Google Auth
  const initializeGoogleAuth = () => {
    if (!window.google || !clientId) return;

    logger.log('🔧 Inicializando Google Identity Services...');

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email',
        callback: (response: any) => {
          // ✅ Liberar el flag primero
          requestingRef.current = false;
          
          logger.log('✅ Token recibido correctamente');
          logger.log('📦 Response type:', typeof response);
          logger.log('📦 Response keys:', Object.keys(response || {}));
          
          // Google puede devolver el token de diferentes formas
          const token = response.access_token || response.token || response;
          
          if (token && typeof token === 'string') {
            logger.log('🎉 Token válido encontrado');
            setDriveAccessToken(token);
            setIsAuthenticated(true);
            setIsConnecting(false);
            setIsWaitingForPopup(false);
            fetchUserInfo(token);
          } else {
            logger.error('❌ Token no válido en response:', response);
            setIsConnecting(false);
            setIsWaitingForPopup(false);
          }
        },
        error_callback: (error: any) => {
          // ✅ Liberar el flag primero
          requestingRef.current = false;
          
          logger.error('❌ Error de Google:', error);
          logger.error('🔍 Error type:', error?.type);
          logger.error('🔍 Error message:', error?.message);
          setIsConnecting(false);
          setIsWaitingForPopup(false);
          
          // Solo mostrar alerta si NO es "popup_closed" (usuario canceló)
          if (error?.type !== 'popup_closed' && error?.message !== 'Popup window closed') {
            logger.error('🚨 Mostrando alerta de error');
            setShowPopupBlockedAlert(true);
          } else {
            logger.log('ℹ️ Usuario cerró el popup manualmente');
          }
        },
      } as any);

      setTokenClient(client);
      logger.log('✅ Google Identity Services inicializado');
    } catch (error) {
      logger.error('❌ Error al inicializar Google:', error);
    }
  };

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
  const handleLogin = useCallback(() => {
    if (!tokenClient) {
      logger.error('❌ Token client no inicializado');
      setShowPopupBlockedAlert(true);
      return;
    }
    
    // ⚠️ Evitar dobles llamadas
    if (requestingRef.current) {
      logger.log('⏳ Login ya en curso, se evita abrir otro popup');
      return;
    }

    logger.log('🚀 Iniciando autenticación con Google Drive...');
    logger.log('📍 Origin:', window.location.origin);
    logger.log('🔑 Client ID:', clientId?.substring(0, 20) + '...');
    
    // ⚠️ CRÍTICO: Llamar al popup PRIMERO, antes de setState
    requestingRef.current = true;
    
    try {
      // Solicitar el token - esto abrirá el popup
      // prompt: 'consent' fuerza el selector de cuenta la primera vez
      tokenClient.requestAccessToken({ prompt: 'consent' });
      logger.log('✅ Popup de autenticación lanzado');
      
      // ✅ Ahora sí, actualizar estados (DESPUÉS del popup)
      setIsConnecting(true);
      setIsWaitingForPopup(true);
    } catch (error) {
      requestingRef.current = false;
      logger.error('❌ Error al lanzar popup:', error);
      setIsConnecting(false);
      setIsWaitingForPopup(false);
      setShowPopupBlockedAlert(true);
    }
  }, [tokenClient, clientId]);

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
// WRAPPER - Ya no necesita GoogleOAuthProvider
// ============================================

export const GoogleDriveWrapper = ({ children }: { children: ReactNode }) => {
  return <GoogleDriveProvider>{children}</GoogleDriveProvider>;
};
