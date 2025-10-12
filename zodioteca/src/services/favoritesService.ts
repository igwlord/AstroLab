/**
 * Servicio de Sincronización de Favoritos con Supabase
 * Sistema simplificado de sync bidireccional con merge inteligente
 * 
 * Características:
 * - Auto-sync al login
 * - Auto-save en cada cambio
 * - Merge por lastUsedAt (el más reciente gana)
 * - Respaldo local primero (funciona offline)
 */

import { supabase } from './supabaseService';
import type { FavoriteItem } from '../types/favorites';
import { logger } from '../utils/logger';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';

// ============================================
// CLIENTE SUPABASE
// ============================================

const client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// ============================================
// TIPOS
// ============================================

export interface SupabaseFavorite {
  id: string;
  user_id: string;
  favorite_id: string; // ID generado por la app
  type: string;
  title: string;
  icon: string;
  route: string;
  target_id: string;
  scope: 'global' | 'chart';
  chart_id: string | null;
  tags: string[];
  pinned: boolean;
  created_at: string;
  last_used_at: string;
  synced_at: string;
}

interface SyncResult {
  success: boolean;
  added: number;
  updated: number;
  removed: number;
  merged?: FavoriteItem[]; // Favoritos combinados (local + cloud)
  error?: string;
}

// ============================================
// SERVICIO
// ============================================

class FavoritesService {
  private tableName = 'favorites';
  private isSyncing = false;
  
  // Rate limiting para auto-save
  private saveQueue = new Map<string, ReturnType<typeof setTimeout>>();
  private SAVE_DEBOUNCE_MS = 500; // 500ms de debounce

  /**
   * Sincronizar favoritos al login
   * Merge bidireccional: local + cloud → resultado combinado
   */
  async syncOnLogin(localFavorites: FavoriteItem[]): Promise<SyncResult> {
    if (this.isSyncing) {
      logger.warn('⚠️ Sync ya en progreso, cancelando...');
      return { success: false, added: 0, updated: 0, removed: 0, error: 'Sync en progreso' };
    }

    try {
      this.isSyncing = true;
      logger.log('🔄 Iniciando sync de favoritos...');

      // 1. Obtener favoritos de la nube
      const cloudFavorites = await this.fetchAll();
      if (!cloudFavorites) {
        return { success: false, added: 0, updated: 0, removed: 0, error: 'Error al obtener favoritos de la nube' };
      }

      // 2. Hacer merge inteligente
      const merged = this.mergeFavorites(localFavorites, cloudFavorites);

      // 3. Subir los cambios a la nube
      const uploadResult = await this.uploadBatch(merged.toUpload);

      // 4. Retornar favoritos combinados para actualizar el store local
      logger.log('✅ Sync completado:', {
        local: localFavorites.length,
        cloud: cloudFavorites.length,
        merged: merged.final.length,
        uploaded: uploadResult.success ? merged.toUpload.length : 0
      });

      return {
        success: true,
        added: merged.added,
        updated: merged.updated,
        removed: 0,
        merged: merged.final, // Retornar favoritos combinados
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en sync:', message);
      return { success: false, added: 0, updated: 0, removed: 0, error: message };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Merge inteligente entre favoritos locales y de la nube
   * Estrategia: el más reciente (por lastUsedAt) gana
   */
  private mergeFavorites(local: FavoriteItem[], cloud: SupabaseFavorite[]) {
    const localMap = new Map(local.map(f => [f.id, f]));
    const cloudMap = new Map(cloud.map(f => [f.favorite_id, f]));
    
    const final: FavoriteItem[] = [];
    const toUpload: FavoriteItem[] = [];
    let added = 0;
    let updated = 0;

    // Procesar locales
    for (const localFav of local) {
      const cloudFav = cloudMap.get(localFav.id);
      
      if (!cloudFav) {
        // Solo existe local → subir a la nube
        final.push(localFav);
        toUpload.push(localFav);
        added++;
      } else {
        // Existe en ambos → comparar lastUsedAt
        const localDate = new Date(localFav.lastUsedAt).getTime();
        const cloudDate = new Date(cloudFav.last_used_at).getTime();
        
        if (localDate >= cloudDate) {
          // Local más reciente → mantener local y subir
          final.push(localFav);
          toUpload.push(localFav);
          updated++;
        } else {
          // Cloud más reciente → usar cloud
          final.push(this.fromSupabase(cloudFav));
        }
      }
    }

    // Agregar favoritos que solo existen en la nube
    for (const cloudFav of cloud) {
      if (!localMap.has(cloudFav.favorite_id)) {
        final.push(this.fromSupabase(cloudFav));
        added++;
      }
    }

    return { final, toUpload, added, updated };
  }

  /**
   * Guardar UN favorito en la nube (auto-save con debounce)
   * Previene múltiples llamadas innecesarias en clicks rápidos
   */
  async save(favorite: FavoriteItem): Promise<boolean> {
    return new Promise((resolve) => {
      // Cancelar save pendiente para este favorito
      const existingTimeout = this.saveQueue.get(favorite.id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Agendar nuevo save después del debounce
      const timeout = setTimeout(async () => {
        this.saveQueue.delete(favorite.id);
        const result = await this._performSave(favorite);
        resolve(result);
      }, this.SAVE_DEBOUNCE_MS);

      this.saveQueue.set(favorite.id, timeout);
    });
  }

  /**
   * Realizar el save real (separado para el debounce)
   */
  private async _performSave(favorite: FavoriteItem): Promise<boolean> {
    try {
      const user = supabase.getCurrentUser();
      if (!user) {
        logger.warn('⚠️ No hay usuario logueado, guardando solo local');
        return false;
      }

      const data = this.toSupabase(favorite, user.id);
      
      const { error } = await client
        .from(this.tableName)
        .upsert(data, { 
          onConflict: 'user_id,favorite_id'
        });

      if (error) {
        logger.error('❌ Error al guardar favorito:', error.message);
        return false;
      }

      logger.log('✅ Favorito guardado en cloud:', favorite.title);
      return true;
    } catch (error) {
      logger.error('❌ Error al guardar favorito:', error);
      return false;
    }
  }

  /**
   * Eliminar favorito de la nube
   */
  async remove(favoriteId: string): Promise<boolean> {
    try {
      const user = supabase.getCurrentUser();
      if (!user) {
        return false;
      }

      const { error } = await client
        .from(this.tableName)
        .delete()
        .eq('user_id', user.id)
        .eq('favorite_id', favoriteId);

      if (error) {
        logger.error('❌ Error al eliminar favorito:', error.message);
        return false;
      }

      logger.log('✅ Favorito eliminado de cloud:', favoriteId);
      return true;
    } catch (error) {
      logger.error('❌ Error al eliminar favorito:', error);
      return false;
    }
  }

  /**
   * Obtener todos los favoritos de la nube
   */
  async fetchAll(): Promise<SupabaseFavorite[] | null> {
    try {
      const user = supabase.getCurrentUser();
      if (!user) {
        return null;
      }

      const { data, error } = await client
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      if (error) {
        logger.error('❌ Error al obtener favoritos:', error.message);
        return null;
      }

      return data as SupabaseFavorite[];
    } catch (error) {
      logger.error('❌ Error al obtener favoritos:', error);
      return null;
    }
  }

  /**
   * Subir múltiples favoritos en batch
   */
  private async uploadBatch(favorites: FavoriteItem[]): Promise<{ success: boolean }> {
    if (favorites.length === 0) {
      return { success: true };
    }

    try {
      const user = supabase.getCurrentUser();
      if (!user) {
        return { success: false };
      }

      const data = favorites.map(f => this.toSupabase(f, user.id));
      
      const { error } = await client
        .from(this.tableName)
        .upsert(data, { 
          onConflict: 'user_id,favorite_id'
        });

      if (error) {
        logger.error('❌ Error en batch upload:', error.message);
        return { success: false };
      }

      logger.log('✅ Batch upload completado:', favorites.length);
      return { success: true };
    } catch (error) {
      logger.error('❌ Error en batch upload:', error);
      return { success: false };
    }
  }

  /**
   * Convertir FavoriteItem → SupabaseFavorite
   */
  private toSupabase(item: FavoriteItem, userId: string): Omit<SupabaseFavorite, 'id' | 'synced_at'> {
    return {
      user_id: userId,
      favorite_id: item.id,
      type: item.type,
      title: item.title,
      icon: item.icon || '⭐',
      route: item.route,
      target_id: item.targetId || '',
      scope: item.scope,
      chart_id: item.chartId || null,
      tags: item.tags,
      pinned: item.pinned,
      created_at: new Date(item.createdAt).toISOString(),
      last_used_at: new Date(item.lastUsedAt).toISOString(),
    };
  }

  /**
   * Convertir SupabaseFavorite → FavoriteItem
   */
  private fromSupabase(item: SupabaseFavorite): FavoriteItem {
    return {
      id: item.favorite_id,
      type: item.type as FavoriteItem['type'],
      title: item.title,
      icon: item.icon,
      route: item.route,
      targetId: item.target_id,
      scope: item.scope,
      chartId: item.chart_id || undefined,
      tags: item.tags,
      pinned: item.pinned,
      createdAt: new Date(item.created_at).getTime(),
      lastUsedAt: new Date(item.last_used_at).getTime(),
    };
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const favoritesService = new FavoritesService();
