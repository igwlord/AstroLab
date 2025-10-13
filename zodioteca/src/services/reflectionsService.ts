/**
 * Reflections Service
 * Handles all database operations for user reflections
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';
import type { 
  Reflection, 
  ReflectionInput, 
  ReflectionUpdate, 
  ReflectionFilters,
  ReflectionStats 
} from '../types/reflection';

// Create Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

/**
 * Get all reflections for the current user
 */
export async function getReflections(filters?: ReflectionFilters): Promise<Reflection[]> {
  let query = supabase
    .from('user_reflections')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  if (filters?.chart_id) {
    query = query.eq('chart_id', filters.chart_id);
  }

  if (filters?.date_from) {
    query = query.gte('created_at', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('created_at', filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reflections:', error);
    throw new Error('No se pudieron cargar las reflexiones');
  }

  return data || [];
}

/**
 * Get a single reflection by ID
 */
export async function getReflection(id: string): Promise<Reflection | null> {
  const { data, error } = await supabase
    .from('user_reflections')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching reflection:', error);
    throw new Error('No se pudo cargar la reflexión');
  }

  return data;
}

/**
 * Create a new reflection
 */
export async function createReflection(input: ReflectionInput): Promise<Reflection> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('user_reflections')
    .insert({
      user_id: user.id,
      title: input.title,
      content: input.content,
      tags: input.tags || [],
      chart_id: input.chart_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating reflection:', error);
    throw new Error('No se pudo crear la reflexión');
  }

  return data;
}

/**
 * Update an existing reflection
 */
export async function updateReflection(
  id: string, 
  update: ReflectionUpdate
): Promise<Reflection> {
  const { data, error } = await supabase
    .from('user_reflections')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating reflection:', error);
    throw new Error('No se pudo actualizar la reflexión');
  }

  return data;
}

/**
 * Delete a reflection
 */
export async function deleteReflection(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_reflections')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting reflection:', error);
    throw new Error('No se pudo eliminar la reflexión');
  }
}

/**
 * Get reflection statistics for the current user
 */
export async function getReflectionStats(): Promise<ReflectionStats> {
  interface StatsRow {
    created_at: string;
    tags: string[];
  }

  const { data: allReflections, error } = await supabase
    .from('user_reflections')
    .select('created_at, tags')
    .returns<StatsRow[]>();

  if (error) {
    console.error('Error fetching stats:', error);
    return { total: 0, this_month: 0, this_week: 0, total_tags: [] };
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const thisMonth = allReflections.filter(
    (r: StatsRow) => new Date(r.created_at) >= startOfMonth
  ).length;

  const thisWeek = allReflections.filter(
    (r: StatsRow) => new Date(r.created_at) >= startOfWeek
  ).length;

  // Extract unique tags
  const tagsSet = new Set<string>();
  allReflections.forEach((r: StatsRow) => {
    r.tags?.forEach((tag: string) => tagsSet.add(tag));
  });

  return {
    total: allReflections.length,
    this_month: thisMonth,
    this_week: thisWeek,
    total_tags: Array.from(tagsSet),
  };
}

/**
 * Get reflections linked to a specific natal chart
 */
export async function getReflectionsByChart(chartId: string): Promise<Reflection[]> {
  const { data, error } = await supabase
    .from('user_reflections')
    .select('*')
    .eq('chart_id', chartId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chart reflections:', error);
    throw new Error('No se pudieron cargar las reflexiones de esta carta');
  }

  return data || [];
}
