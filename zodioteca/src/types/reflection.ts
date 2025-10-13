/**
 * Reflection Types
 * Types for the user reflections/journal system
 */

export interface Reflection {
  id: string;
  user_id: string;
  chart_id: string | null; // Vinculación opcional a una carta natal
  title: string;
  content: string;
  tags: string[];
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface ReflectionInput {
  chart_id?: string | null;
  title: string;
  content: string;
  tags?: string[];
}

export interface ReflectionUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  chart_id?: string | null;
}

export interface ReflectionFilters {
  search?: string; // Búsqueda en título y contenido
  tags?: string[]; // Filtrar por tags específicos
  chart_id?: string; // Filtrar por carta natal
  date_from?: string; // Fecha desde (ISO 8601)
  date_to?: string; // Fecha hasta (ISO 8601)
}

export interface ReflectionStats {
  total: number;
  this_month: number;
  this_week: number;
  total_tags: string[];
}
