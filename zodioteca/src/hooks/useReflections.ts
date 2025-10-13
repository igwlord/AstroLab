/**
 * useReflections Hook
 * Custom hook for managing reflections state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getReflections,
  getReflectionStats,
  createReflection,
  updateReflection,
  deleteReflection,
} from '../services/reflectionsService';
import type { Reflection, ReflectionInput, ReflectionStats } from '../types/reflection';

interface UseReflectionsReturn {
  reflections: Reflection[];
  stats: ReflectionStats;
  loading: boolean;
  error: string | null;
  createNewReflection: (input: ReflectionInput) => Promise<Reflection>;
  updateExistingReflection: (id: string, input: ReflectionInput) => Promise<Reflection>;
  removeReflection: (id: string) => Promise<void>;
  refreshReflections: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useReflections(): UseReflectionsReturn {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [stats, setStats] = useState<ReflectionStats>({
    total: 0,
    this_month: 0,
    this_week: 0,
    total_tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReflections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReflections();
      setReflections(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar reflexiones';
      setError(errorMessage);
      console.error('Error loading reflections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const data = await getReflectionStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  const createNewReflection = useCallback(
    async (input: ReflectionInput): Promise<Reflection> => {
      const newReflection = await createReflection(input);
      setReflections((prev) => [newReflection, ...prev]);
      await refreshStats();
      return newReflection;
    },
    [refreshStats]
  );

  const updateExistingReflection = useCallback(
    async (id: string, input: ReflectionInput): Promise<Reflection> => {
      const updatedReflection = await updateReflection(id, input);
      setReflections((prev) =>
        prev.map((r) => (r.id === id ? updatedReflection : r))
      );
      await refreshStats();
      return updatedReflection;
    },
    [refreshStats]
  );

  const removeReflection = useCallback(
    async (id: string): Promise<void> => {
      await deleteReflection(id);
      setReflections((prev) => prev.filter((r) => r.id !== id));
      await refreshStats();
    },
    [refreshStats]
  );

  useEffect(() => {
    refreshReflections();
    refreshStats();
  }, [refreshReflections, refreshStats]);

  return {
    reflections,
    stats,
    loading,
    error,
    createNewReflection,
    updateExistingReflection,
    removeReflection,
    refreshReflections,
    refreshStats,
  };
}
