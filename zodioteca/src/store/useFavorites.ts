/**
 * Zustand Store Simplificado para Favoritos
 * Versión 2.0 - Sistema de bookmarks inteligentes
 * 
 * Filosofía:
 * - Sin sanitización compleja (los datos vienen de la app, son seguros)
 * - Sin decay scoring complejo (solo pinned + lastUsedAt)
 * - Sin validaciones excesivas (confiamos en TypeScript)
 * - Persistencia simple en localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FavoriteItem,
  FavoritesState,
  FavoritesFilter,
} from '../types/favorites';
import {
  isFavoriteItem,
  createFavoriteItem,
  FAVORITES_STORAGE_KEY,
} from '../types/favorites';
import { logger } from '../utils/logger';
import { favoritesService } from '../services/favoritesService';

// ============================================
// CONSTANTES
// ============================================

const MAX_FAVORITES = 100;

// ============================================
// INTERFACE DEL STORE
// ============================================

interface FavoritesStoreState extends FavoritesState {
  // ========== CRUD ==========
  
  /**
   * Agregar favorito
   * Genera ID automáticamente si no existe
   */
  add: (item: Omit<FavoriteItem, 'id' | 'createdAt' | 'lastUsedAt'>) => string | null;
  
  /**
   * Eliminar favorito por ID
   */
  remove: (id: string) => void;
  
  /**
   * Alternar pin
   */
  togglePin: (id: string) => void;
  
  /**
   * Marcar como usado (actualiza lastUsedAt)
   */
  touch: (id: string) => void;
  
  // ========== CONSULTAS ==========
  
  /**
   * Verificar si existe
   */
  has: (id: string) => boolean;
  
  /**
   * Listar todos con filtros opcionales
   */
  list: (filter?: FavoritesFilter) => FavoriteItem[];
  
  /**
   * Obtener por carta específica
   */
  getByChart: (chartId: string) => FavoriteItem[];
  
  /**
   * Buscar por texto
   */
  search: (query: string) => FavoriteItem[];
  
  // ========== UTILIDADES ==========
  
  /**
   * Limpiar todos
   */
  clear: () => void;
  
  /**
   * Exportar a JSON
   */
  exportToJSON: () => string;
  
  /**
   * Importar desde JSON
   */
  importFromJSON: (json: string) => { success: boolean; imported: number; errors: string[] };
}

// ============================================
// STORE
// ============================================

export const useFavorites = create<FavoritesStoreState>()(
  persist(
    (set, get) => ({
      // ========== ESTADO INICIAL ==========
      items: {},
      order: [],
      maxItems: MAX_FAVORITES,
      
      // ========== CRUD ==========
      
      add: (itemData) => {
        const state = get();
        
        // Validar límite
        if (Object.keys(state.items).length >= state.maxItems) {
          logger.warn(`❌ Límite alcanzado (${state.maxItems})`);
          return null;
        }
        
        // Crear favorito completo con defaults
        const item = createFavoriteItem(itemData);
        
        // Verificar duplicado
        if (state.items[item.id]) {
          logger.warn(`⚠️ Ya existe: ${item.title}`);
          return null;
        }
        
        // Agregar
        set({
          items: { ...state.items, [item.id]: item },
          order: [item.id, ...state.order], // Nuevo al principio
        });
        
        logger.log(`✅ Agregado: ${item.title} (${item.id})`);
        
        // 🔄 Auto-save en la nube (no bloquear)
        favoritesService.save(item).catch(err => 
          logger.warn('⚠️ No se pudo guardar en cloud:', err)
        );
        
        return item.id;
      },
      
      remove: (id) => {
        const state = get();
        
        // Buscar por ID directo
        let itemToRemove = state.items[id];
        let realId = id;
        
        // Si no existe, buscar por tipo+título (compatibilidad)
        if (!itemToRemove) {
          const [type, ...titleParts] = id.split('_');
          const searchTitle = titleParts.join('_');
          
          const found = Object.entries(state.items).find(([, item]) => 
            item.type === type && 
            item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === searchTitle
          );
          
          if (found) {
            [realId, itemToRemove] = found;
          }
        }
        
        if (!itemToRemove) {
          logger.warn(`⚠️ No encontrado: ${id}`);
          return;
        }
        
        // Eliminar
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [realId]: _removed, ...rest } = state.items;
        
        set({
          items: rest,
          order: state.order.filter((itemId) => itemId !== realId),
        });
        
        logger.log(`🗑️ Eliminado: ${itemToRemove.title}`);
        
        // 🔄 Auto-remove en la nube (no bloquear)
        favoritesService.remove(realId).catch(err => 
          logger.warn('⚠️ No se pudo eliminar de cloud:', err)
        );
      },
      
      togglePin: (id) => {
        const state = get();
        const item = state.items[id];
        
        if (!item) {
          logger.warn(`⚠️ No encontrado: ${id}`);
          return;
        }
        
        const updatedItem = {
          ...item,
          pinned: !item.pinned,
        };
        
        set({
          items: {
            ...state.items,
            [id]: updatedItem,
          },
        });
        
        logger.log(`📌 ${item.pinned ? 'Desanclado' : 'Anclado'}: ${item.title}`);
        
        // 🔄 Auto-save en la nube (no bloquear)
        favoritesService.save(updatedItem).catch(err => 
          logger.warn('⚠️ No se pudo actualizar pin en cloud:', err)
        );
      },
      
      touch: (id) => {
        const state = get();
        const item = state.items[id];
        
        if (!item) return;
        
        const updatedItem = {
          ...item,
          lastUsedAt: Date.now(),
        };
        
        set({
          items: {
            ...state.items,
            [id]: updatedItem,
          },
        });
        
        // 🔄 Auto-save lastUsedAt en la nube (no bloquear)
        favoritesService.save(updatedItem).catch(err => 
          logger.warn('⚠️ No se pudo actualizar lastUsedAt en cloud:', err)
        );
      },
      
      // ========== CONSULTAS ==========
      
      has: (id) => {
        const state = get();
        
        // Búsqueda directa
        if (state.items[id]) return true;
        
        // Búsqueda por tipo+título
        const [type, ...titleParts] = id.split('_');
        const searchTitle = titleParts.join('_');
        
        return Object.values(state.items).some(item => 
          item.type === type && 
          item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === searchTitle
        );
      },
      
      list: (filter) => {
        const state = get();
        let items = state.order
          .map((id) => state.items[id])
          .filter(Boolean) as FavoriteItem[];
        
        // Aplicar filtros
        if (filter?.type) {
          items = items.filter((item) => item.type === filter.type);
        }
        
        if (filter?.scope) {
          items = items.filter((item) => item.scope === filter.scope);
        }
        
        if (filter?.chartId) {
          items = items.filter((item) => item.chartId === filter.chartId);
        }
        
        if (filter?.tags?.length) {
          items = items.filter((item) =>
            filter.tags!.some((tag) => item.tags.includes(tag))
          );
        }
        
        if (filter?.pinnedOnly) {
          items = items.filter((item) => item.pinned);
        }
        
        // Ordenar: pinned primero, luego por campo especificado
        items.sort((a, b) => {
          // Pinned siempre primero
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          
          // Ordenar por campo
          const sortBy = filter?.sortBy || 'lastUsedAt';
          
          if (sortBy === 'createdAt') {
            return b.createdAt - a.createdAt;
          }
          if (sortBy === 'lastUsedAt') {
            return b.lastUsedAt - a.lastUsedAt;
          }
          if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
          }
          
          return 0;
        });
        
        // Limitar resultados
        if (filter?.limit) {
          items = items.slice(0, filter.limit);
        }
        
        return items;
      },
      
      getByChart: (chartId) => {
        return get().list({ scope: 'chart', chartId });
      },
      
      search: (query) => {
        const state = get();
        const lowerQuery = query.toLowerCase().trim();
        
        if (!lowerQuery) return [];
        
        return Object.values(state.items).filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          const tagsMatch = item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
          const iconMatch = item.icon?.toLowerCase().includes(lowerQuery);
          
          return titleMatch || tagsMatch || iconMatch;
        });
      },
      
      // ========== UTILIDADES ==========
      
      clear: () => {
        set({ items: {}, order: [] });
        logger.log('🗑️ Todos los favoritos eliminados');
      },
      
      exportToJSON: () => {
        const state = get();
        const data = {
          version: 2,
          exported: new Date().toISOString(),
          items: Object.values(state.items),
        };
        return JSON.stringify(data, null, 2);
      },
      
      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          const state = get();
          
          if (!data.items || !Array.isArray(data.items)) {
            return { success: false, imported: 0, errors: ['Formato inválido'] };
          }
          
          let imported = 0;
          const errors: string[] = [];
          const newItems = { ...state.items };
          const newOrder = [...state.order];
          
          for (const item of data.items) {
            // Validar estructura
            if (!isFavoriteItem(item)) {
              errors.push(`Item inválido: ${item.title || 'sin título'}`);
              continue;
            }
            
            // No sobrescribir existentes
            if (newItems[item.id]) {
              errors.push(`Ya existe: ${item.title}`);
              continue;
            }
            
            // Agregar
            newItems[item.id] = item;
            newOrder.unshift(item.id);
            imported++;
          }
          
          set({ items: newItems, order: newOrder });
          
          logger.log(`✅ Importados ${imported} favoritos`);
          return { success: true, imported, errors };
          
        } catch (error) {
          logger.error('❌ Error al importar:', error);
          return {
            success: false,
            imported: 0,
            errors: ['Error al parsear JSON'],
          };
        }
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 2,
      // Migración desde v1 (si existe)
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          logger.log('🔄 Migrando favoritos v1 → v2');
          // Limpiar y empezar de cero (estructura muy diferente)
          return {
            items: {},
            order: [],
            maxItems: MAX_FAVORITES,
          };
        }
        return persistedState;
      },
    }
  )
);
