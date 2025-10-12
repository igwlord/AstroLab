/**
 * Sistema de Favoritos Simplificado - Tipos TypeScript
 * Versión 2.0 - Octubre 2025
 * 
 * Filosofía: Favoritos = Bookmarks inteligentes (no copias de datos)
 * - ID predecible basado en tipo + título
 * - Navegación directa a la fuente original
 * - Estructura minimalista (10 campos máximo)
 * - Sin modales duplicados
 */

// ============================================
// TIPOS BASE
// ============================================

/**
 * Tipo de favorito - Mapea a secciones de la app
 */
export type FavoriteType =
  // Glosario
  | 'glossary-sign'          // Signos zodiacales
  | 'glossary-house'         // Casas astrológicas
  | 'glossary-planet'        // Planetas
  | 'glossary-moon-sign'     // Luna en signos
  | 'glossary-ascendant'     // Ascendentes
  | 'glossary-asteroid'      // Asteroides
  | 'glossary-aspect'        // Aspectos astrológicos
  | 'glossary-celestial-body' // Cuerpos celestes (Lilith, Quirón, etc.)
  | 'glossary-relational'    // Técnicas relacionales (Sinastría, etc.)
  | 'glossary-polarization'  // Polarizaciones zodiacales
  | 'glossary-dimension'     // Dimensiones avanzadas (Dracónica, etc.)
  // Cartas y análisis
  | 'chart-aspect'           // Aspectos específicos
  | 'chart-configuration'    // Configuraciones (T-Square, etc.)
  | 'chart-shape'            // Formas de carta (Racimo, Cuenco, etc.)
  | 'saved-chart'            // Carta guardada completa
  // Frecuencias y prácticas
  | 'frequency-exercise'     // Ejercicios de frecuencia
  | 'frequency-ritual'       // Rituales
  | 'frequency-meditation'   // Meditaciones
  // Otros
  | 'dignity'                // Dignidades planetarias
  | 'coordinate-system'      // Sistemas de coordenadas
  | 'house-system';          // Sistemas de casas

/**
 * Ámbito del favorito
 * - global: Visible siempre
 * - chart: Solo visible en contexto de una carta específica
 */
export type FavoriteScope = 'global' | 'chart';

// ============================================
// ITEM DE FAVORITO (SIMPLIFICADO)
// ============================================

/**
 * Favorito = Bookmark inteligente a un recurso de la app
 * Solo guarda lo esencial para navegar de vuelta
 */
export interface FavoriteItem {
  // ========== IDENTIFICACIÓN ==========
  /** ID único: tipo_titulo-normalizado (ej: "glossary-sign_aries") */
  id: string;
  
  /** Tipo de favorito */
  type: FavoriteType;
  
  /** Título del recurso */
  title: string;
  
  /** Icono/emoji representativo (opcional) */
  icon?: string;
  
  // ========== NAVEGACIÓN ==========
  /** Ruta de la página donde está el recurso (ej: "/glossary") */
  route: string;
  
  /** ID del elemento para scroll automático (opcional, ej: "sign-aries") */
  targetId?: string;
  
  // ========== CONTEXTO ==========
  /** Ámbito: global o vinculado a carta */
  scope: FavoriteScope;
  
  /** ID de carta (solo si scope='chart') */
  chartId?: string;
  
  /** Tags para filtrado (ej: ["signos", "fuego"]) */
  tags: string[];
  
  // ========== METADATA ==========
  /** Favorito anclado (siempre primero) */
  pinned: boolean;
  
  /** Timestamp de creación */
  createdAt: number;
  
  /** Timestamp de último uso (para ordenar por relevancia) */
  lastUsedAt: number;
}

// ============================================
// HELPERS Y UTILIDADES
// ============================================

/**
 * Generar ID único predecible
 * Formato: tipo_titulo-normalizado
 * 
 * @example
 * generateFavoriteId('glossary-sign', 'Aries') 
 * // → "glossary-sign_aries"
 * 
 * generateFavoriteId('glossary-planet', 'Marte ♂') 
 * // → "glossary-planet_marte"
 */
export function generateFavoriteId(type: FavoriteType, title: string): string {
  const normalizedTitle = title
    .toLowerCase()
    .replace(/\s+/g, '-')           // Espacios → guiones
    .replace(/[^a-z0-9-]/g, '')     // Solo letras, números, guiones
    .replace(/-+/g, '-')            // Múltiples guiones → uno solo
    .replace(/^-|-$/g, '');         // Eliminar guiones al inicio/final
  
  return `${type}_${normalizedTitle}`;
}

/**
 * Obtener categoría legible de un tipo
 */
export function getFavoriteCategory(type: FavoriteType): string {
  const categories: Record<FavoriteType, string> = {
    'glossary-sign': 'Signo Zodiacal',
    'glossary-house': 'Casa Astrológica',
    'glossary-planet': 'Planeta',
    'glossary-moon-sign': 'Luna en Signo',
    'glossary-ascendant': 'Ascendente',
    'glossary-asteroid': 'Asteroide',
    'glossary-aspect': 'Aspecto',
    'glossary-celestial-body': 'Cuerpo Celeste',
    'glossary-relational': 'Técnica Relacional',
    'glossary-polarization': 'Polarización',
    'glossary-dimension': 'Dimensión Avanzada',
    'chart-aspect': 'Aspecto',
    'chart-configuration': 'Configuración',
    'chart-shape': 'Forma de Carta',
    'saved-chart': 'Carta Guardada',
    'frequency-exercise': 'Ejercicio',
    'frequency-ritual': 'Ritual',
    'frequency-meditation': 'Meditación',
    'dignity': 'Dignidad',
    'coordinate-system': 'Sistema de Coordenadas',
    'house-system': 'Sistema de Casas',
  };
  return categories[type];
}

/**
 * Obtener etiqueta legible de un tipo (alias de getFavoriteCategory)
 * Mantiene compatibilidad con código existente
 */
export function getFavoriteTypeLabel(type: FavoriteType): string {
  return getFavoriteCategory(type);
}

/**
 * Validar estructura de FavoriteItem
 */
export function isFavoriteItem(item: unknown): item is FavoriteItem {
  if (!item || typeof item !== 'object') return false;
  
  const fav = item as Partial<FavoriteItem>;
  
  return (
    typeof fav.id === 'string' &&
    typeof fav.type === 'string' &&
    typeof fav.title === 'string' &&
    typeof fav.route === 'string' &&
    (fav.scope === 'global' || fav.scope === 'chart') &&
    Array.isArray(fav.tags) &&
    typeof fav.pinned === 'boolean' &&
    typeof fav.createdAt === 'number' &&
    typeof fav.lastUsedAt === 'number'
  );
}

/**
 * Crear favorito con valores por defecto
 */
export function createFavoriteItem(
  data: Pick<FavoriteItem, 'type' | 'title' | 'route'> & Partial<FavoriteItem>
): FavoriteItem {
  const now = Date.now();
  const id = data.id || generateFavoriteId(data.type, data.title);
  
  return {
    id,
    type: data.type,
    title: data.title,
    icon: data.icon,
    route: data.route,
    targetId: data.targetId,
    scope: data.scope || 'global',
    chartId: data.chartId,
    tags: data.tags || [],
    pinned: data.pinned || false,
    createdAt: data.createdAt || now,
    lastUsedAt: data.lastUsedAt || now,
  };
}

// ============================================
// TIPOS PARA ZUSTAND STORE
// ============================================

/**
 * Estado del store de favoritos
 */
export interface FavoritesState {
  /** Diccionario de favoritos por ID */
  items: Record<string, FavoriteItem>;
  
  /** Orden de visualización (array de IDs) */
  order: string[];
  
  /** Límite máximo de favoritos */
  maxItems: number;
}

/**
 * Filtros para listar favoritos
 */
export interface FavoritesFilter {
  /** Filtrar por tipo */
  type?: FavoriteType;
  
  /** Filtrar por ámbito */
  scope?: FavoriteScope;
  
  /** Filtrar por carta específica */
  chartId?: string;
  
  /** Filtrar por tags (OR - al menos uno coincide) */
  tags?: string[];
  
  /** Solo favoritos anclados */
  pinnedOnly?: boolean;
  
  /** Ordenar por campo */
  sortBy?: 'createdAt' | 'lastUsedAt' | 'title';
  
  /** Límite de resultados */
  limit?: number;
}

// ============================================
// CONSTANTES
// ============================================

/**
 * Versión del schema (para migraciones futuras si es necesario)
 */
export const FAVORITES_SCHEMA_VERSION = 2;

/**
 * Key de localStorage
 */
export const FAVORITES_STORAGE_KEY = 'astrolab-favorites-v2';
