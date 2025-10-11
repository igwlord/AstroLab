/**
 * Servicio de Supabase para AstroLab
 * Maneja autenticación y almacenamiento de cartas natales
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';
import { logger } from '../utils/logger';
import type { SavedChart } from './chartStorage';

// ============================================
// TIPOS
// ============================================

export interface SupabaseChart {
  id: string;
  user_id: string;
  name: string;
  date: string;
  data: any; // JSON con toda la data de la carta
  created_at: string;
  updated_at: string;
}

// ============================================
// CLIENTE SUPABASE
// ============================================

class SupabaseService {
  private client: SupabaseClient;
  private currentUser: User | null = null;

  constructor() {
    this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    this.initSession();
  }

  /**
   * Inicializa la sesión desde localStorage
   */
  private async initSession() {
    try {
      const { data } = await this.client.auth.getSession();
      if (data.session) {
        this.currentUser = data.session.user;
        logger.log('✅ Sesión de Supabase restaurada:', this.currentUser.email);
      }
    } catch (error) {
      logger.error('Error al restaurar sesión:', error);
    }
  }

  /**
   * Escuchar cambios en la autenticación
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.client.auth.onAuthStateChange((_event, session) => {
      this.currentUser = session?.user ?? null;
      callback(session);
    });
  }

  // ============================================
  // AUTENTICACIÓN
  // ============================================

  /**
   * Registrar nuevo usuario con email y contraseña
   */
  async signUp(email: string, password: string) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      logger.log('📝 Registrando usuario:', normalizedEmail);
      
      // ⚠️ NOTA: Supabase permite múltiples registros con el mismo email por diseño
      // La única forma 100% confiable de prevenirlo es con Row Level Security (RLS)
      // que ya está configurada en la tabla `charts` para aislar datos por user_id
      // Esto significa que incluso si se crea un duplicado, los datos NO se mezclan
      logger.log('✅ Procediendo con registro en Supabase...');
      
      logger.log('🔍 Email exacto que se enviará a Supabase:', JSON.stringify({ email: normalizedEmail }));
      
      const { data, error } = await this.client.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            registered_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        logger.error('❌ Error de Supabase:', error);
        
        // Detectar email duplicado
        if (error.message.includes('already') || 
            error.message.includes('exist') ||
            error.message.includes('duplicate')) {
          throw new Error('❌ Este email ya está registrado. Intenta iniciar sesión.');
        }
        throw error;
      }

      logger.log('📧 Respuesta de Supabase:', {
        user: data.user?.email,
        hasSession: !!data.session,
        userId: data.user?.id,
      });

      // Si Supabase devuelve user pero no session, puede ser que el email ya existe
      if (data.user && !data.session) {
        logger.warn('⚠️ Usuario creado pero sin sesión - puede que ya exista');
        // En algunos casos Supabase permite crear pero no retorna error
        return { 
          user: data.user, 
          error: 'Verifica tu email para confirmar la cuenta o intenta iniciar sesión si ya tienes cuenta.' 
        };
      }

      logger.log('✅ Usuario registrado:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al registrar:', message);
      return { user: null, error: message };
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  async signIn(email: string, password: string) {
    try {
      logger.log('🔐 Iniciando sesión:', email);
      
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      this.currentUser = data.user;
      logger.log('✅ Sesión iniciada:', data.user.email);
      return { user: data.user, session: data.session, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al iniciar sesión:', message);
      return { user: null, session: null, error: message };
    }
  }

  /**
   * Cerrar sesión
   */
  async signOut() {
    try {
      logger.log('👋 Cerrando sesión...');
      await this.client.auth.signOut();
      this.currentUser = null;
      logger.log('✅ Sesión cerrada');
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al cerrar sesión:', message);
      return { error: message };
    }
  }

  /**
   * Enviar email para restablecer contraseña
   */
  async resetPassword(email: string) {
    try {
      logger.log('📧 Enviando email de recuperación a:', email);
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      logger.log('✅ Email de recuperación enviado');
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al enviar email de recuperación:', message);
      return { error: message };
    }
  }

  /**
   * Actualizar contraseña (después de recibir el link)
   */
  async updatePassword(newPassword: string) {
    try {
      logger.log('🔒 Actualizando contraseña...');
      const { error } = await this.client.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      logger.log('✅ Contraseña actualizada');
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al actualizar contraseña:', message);
      return { error: message };
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // ============================================
  // CARTAS NATALES
  // ============================================

  /**
   * Guardar carta natal en Supabase
   */
  async saveChart(chart: SavedChart) {
    try {
      if (!this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const chartName = chart.data.personName || 'Carta sin nombre';
      logger.log('💾 Guardando carta en Supabase:', chartName);

      const chartData = {
        id: chart.id,
        user_id: this.currentUser.id,
        name: chartName,
        date: chart.data.birthData.date,
        data: chart, // Guardamos toda la carta como JSON
        updated_at: new Date().toISOString(),
      };

      // Upsert: inserta si no existe, actualiza si existe (por id)
      const { data, error } = await this.client
        .from('charts')
        .upsert(chartData, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;

      logger.log('✅ Carta guardada en Supabase:', data.id);
      return { data, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al guardar carta:', message);
      return { data: null, error: message };
    }
  }

  /**
   * Obtener todas las cartas del usuario
   */
  async getCharts(): Promise<{ data: SavedChart[] | null; error: string | null }> {
    try {
      if (!this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      logger.log('📥 Obteniendo cartas de Supabase...');

      const { data, error } = await this.client
        .from('charts')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Convertir de SupabaseChart a SavedChart
      const charts = data.map((row: { data: SavedChart }) => row.data);

      logger.log(`✅ ${charts.length} cartas obtenidas de Supabase`);
      return { data: charts, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al obtener cartas:', message);
      return { data: null, error: message };
    }
  }

  /**
   * Eliminar carta por ID
   */
  async deleteChart(chartId: string) {
    try {
      if (!this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      logger.log('🗑️ Eliminando carta:', chartId);

      const { error } = await this.client
        .from('charts')
        .delete()
        .eq('id', chartId)
        .eq('user_id', this.currentUser.id); // Seguridad: solo sus cartas

      if (error) throw error;

      logger.log('✅ Carta eliminada de Supabase');
      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al eliminar carta:', message);
      return { error: message };
    }
  }

  /**
   * Sincronizar cartas locales con Supabase
   */
  async syncCharts(localCharts: SavedChart[]) {
    try {
      if (!this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      logger.log('🔄 Sincronizando cartas con Supabase...');

      // Subir todas las cartas locales
      const uploads = localCharts.map((chart) => this.saveChart(chart));
      await Promise.all(uploads);

      // Descargar todas las cartas del servidor
      const { data: serverCharts } = await this.getCharts();

      logger.log('✅ Sincronización completa');
      return { data: serverCharts, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error al sincronizar:', message);
      return { data: null, error: message };
    }
  }
}

// ============================================
// EXPORTAR INSTANCIA ÚNICA
// ============================================

export const supabase = new SupabaseService();
