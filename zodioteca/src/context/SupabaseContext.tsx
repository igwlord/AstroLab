/**
 * Supabase Authentication Context
 * Sistema de autenticación y sincronización con Supabase
 * Reemplaza GoogleDriveContext con algo más simple y confiable
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseService';
import { favoritesService } from '../services/favoritesService';
import { useFavorites } from '../store/useFavorites';
import { logger } from '../utils/logger';

// ============================================
// TIPOS
// ============================================

interface SupabaseContextType {
  // Estado de autenticación
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Métodos de autenticación
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;

  // UI
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

// ============================================
// CONTEXT
// ============================================

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Inicializar sesión al montar
  useEffect(() => {
    logger.log('🔧 Inicializando Supabase Auth...');

    // Verificar si hay sesión activa
    const currentUser = supabase.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
      logger.log('✅ Sesión restaurada:', currentUser.email);
    } else {
      setIsLoading(false);
    }

    // Escuchar cambios en autenticación
    const { data: authListener } = supabase.onAuthStateChange((newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      logger.log(newSession ? '✅ Sesión actualizada' : '👋 Sesión cerrada');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ============================================
  // MÉTODOS DE AUTENTICACIÓN
  // ============================================

  const handleSignUp = useCallback(async (email: string, password: string) => {
    try {
      logger.log('📝 Registrando usuario...');
      setIsLoading(true);

      const { user: newUser, error } = await supabase.signUp(email, password);

      if (error) {
        return { error };
      }

      setUser(newUser);
      logger.log('✅ Usuario registrado:', email);
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar';
      logger.error('❌ Error en signup:', message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      logger.log('🔐 Iniciando sesión...');
      setIsLoading(true);

      const { user: loggedUser, session: newSession, error } = await supabase.signIn(email, password);

      if (error) {
        return { error };
      }

      setUser(loggedUser);
      setSession(newSession);
      logger.log('✅ Sesión iniciada:', email);
      
      // 🔄 Sincronizar favoritos en background (no bloquear el login)
      setTimeout(async () => {
        try {
          logger.log('🔄 Iniciando sync de favoritos...');
          // Nota: Acceder al store en un timeout evita problemas de hooks
          const favoritesRecord = useFavorites.getState().items;
          const favoritesArray = Object.values(favoritesRecord);
          
          const result = await favoritesService.syncOnLogin(favoritesArray);
          
          if (result.success) {
            logger.log('✅ Favoritos sincronizados:', result);
            
            // Actualizar el store con los favoritos combinados (local + cloud)
            if (result.merged && result.merged.length > 0) {
              // Convertir array a objeto con IDs como keys
              const mergedItems = Object.fromEntries(
                result.merged.map(fav => [fav.id, fav])
              );
              
              // Actualizar el store Zustand directamente
              useFavorites.setState({
                items: mergedItems,
                order: result.merged.map(f => f.id)
              });
              
              logger.log(`📥 Store actualizado: ${result.merged.length} favoritos cargados`);
              
              if (result.added > 0 || result.updated > 0) {
                logger.log(`📊 Cambios: ${result.added} nuevos, ${result.updated} actualizados`);
              }
            }
          } else {
            logger.warn('⚠️ No se pudo sincronizar favoritos:', result.error);
          }
        } catch (syncError) {
          logger.error('❌ Error en sync de favoritos:', syncError);
          // No fallar el login si falla el sync
        }
      }, 1000);
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      logger.error('❌ Error en signin:', message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      logger.log('👋 Cerrando sesión...');
      await supabase.signOut();
      setUser(null);
      setSession(null);
      logger.log('✅ Sesión cerrada');
    } catch (error) {
      logger.error('❌ Error al cerrar sesión:', error);
    }
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    try {
      logger.log('📧 Solicitando reset de contraseña...');
      const { error } = await supabase.resetPassword(email);
      
      if (error) {
        return { error };
      }

      logger.log('✅ Email de recuperación enviado');
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar email';
      logger.error('❌ Error en resetPassword:', message);
      return { error: message };
    }
  }, []);

  // ============================================
  // PROVIDER VALUE
  // ============================================

  const value: SupabaseContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    showAuthModal,
    setShowAuthModal,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
};
