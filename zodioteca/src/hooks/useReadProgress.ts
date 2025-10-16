/**
 * Hook para trackear el progreso de lectura de las secciones del plan de ejercicios
 * Persiste en localStorage por chartId
 */

import { useState, useEffect, useCallback } from 'react';

interface ReadProgressData {
  [chartId: string]: {
    readSections: string[];
    lastRead: string;
    totalSections: number;
  };
}

const STORAGE_KEY = 'astrolab-exercise-read-progress';

export function useReadProgress(chartId: string | undefined) {
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar progreso desde localStorage al montar
  useEffect(() => {
    if (!chartId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: ReadProgressData = JSON.parse(stored);
        const chartProgress = data[chartId];
        
        if (chartProgress?.readSections) {
          setReadSections(new Set(chartProgress.readSections));
        }
      }
    } catch (error) {
      console.error('Error loading read progress:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [chartId]);

  // Guardar progreso en localStorage
  const saveProgress = useCallback((sections: Set<string>, total: number) => {
    if (!chartId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data: ReadProgressData = stored ? JSON.parse(stored) : {};

      data[chartId] = {
        readSections: Array.from(sections),
        lastRead: new Date().toISOString(),
        totalSections: total
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving read progress:', error);
    }
  }, [chartId]);

  // Marcar una sección como leída
  const markAsRead = useCallback((sectionId: string, totalSections: number) => {
    setReadSections(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(sectionId)) {
        newSet.add(sectionId);
        saveProgress(newSet, totalSections);
      }
      return newSet;
    });
  }, [saveProgress]);

  // Verificar si una sección fue leída
  const isRead = useCallback((sectionId: string): boolean => {
    return readSections.has(sectionId);
  }, [readSections]);

  // Resetear todo el progreso
  const resetProgress = useCallback(() => {
    if (!chartId) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: ReadProgressData = JSON.parse(stored);
        delete data[chartId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      setReadSections(new Set());
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, [chartId]);

  // Obtener estadísticas
  const getStats = useCallback((totalSections: number) => {
    const readCount = readSections.size;
    const percentage = totalSections > 0 ? Math.round((readCount / totalSections) * 100) : 0;
    const isComplete = readCount === totalSections && totalSections > 0;

    return {
      readCount,
      totalSections,
      percentage,
      isComplete,
      remaining: totalSections - readCount
    };
  }, [readSections]);

  return {
    readSections,
    markAsRead,
    isRead,
    resetProgress,
    getStats,
    isLoaded
  };
}
