/**
 * Hook personalizado para compartir el clima astrológico del día
 * entre múltiples componentes sin duplicar la carga.
 * 
 * Usa singleton pattern para garantizar una sola instancia de carga.
 */

import { useState, useEffect } from 'react';
import { getDailyAstrologicalWeather, type DailyWeather } from '../services/dailyWeather';
import { logger } from '../utils/logger';

// Singleton state compartido entre todas las instancias del hook
let sharedWeather: DailyWeather | null = null;
let sharedIsLoading = false;
let sharedError: string | null = null;
let loadingPromise: Promise<void> | null = null;
const listeners: Set<() => void> = new Set();

/**
 * Hook para obtener el clima astrológico del día.
 * Múltiples componentes pueden usar este hook y solo se hará 1 carga.
 */
export function useDailyWeather() {
  const [weather, setWeather] = useState<DailyWeather | null>(sharedWeather);
  const [isLoading, setIsLoading] = useState(sharedIsLoading);
  const [error, setError] = useState<string | null>(sharedError);

  useEffect(() => {
    // Función para actualizar el estado local
    const updateState = () => {
      setWeather(sharedWeather);
      setIsLoading(sharedIsLoading);
      setError(sharedError);
    };

    // Registrar listener
    listeners.add(updateState);

    // Si ya hay datos, usarlos inmediatamente
    if (sharedWeather) {
      updateState();
      return () => {
        listeners.delete(updateState);
      };
    }

    // Si ya hay una carga en progreso, esperar
    if (loadingPromise) {
      loadingPromise.then(updateState);
      return () => {
        listeners.delete(updateState);
      };
    }

    // Iniciar nueva carga (solo la primera instancia del hook)
    if (!sharedIsLoading && !sharedWeather) {
      sharedIsLoading = true;
      
      // Notificar a todos los listeners que empezó la carga
      listeners.forEach(listener => listener());

      loadingPromise = (async () => {
        try {
          logger.log('🌌 [useDailyWeather] Cargando clima astrológico...');
          const data = await getDailyAstrologicalWeather();
          sharedWeather = data;
          sharedError = null;
        } catch (err) {
          logger.error('❌ [useDailyWeather] Error cargando clima:', err);
          sharedError = 'Error al cargar el clima astrológico';
        } finally {
          sharedIsLoading = false;
          loadingPromise = null;
          
          // Notificar a todos los listeners
          listeners.forEach(listener => listener());
        }
      })();
    }

    // Cleanup
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  // Función para forzar actualización
  const refresh = async () => {
    sharedIsLoading = true;
    sharedWeather = null;
    sharedError = null;
    
    // Notificar cambio
    listeners.forEach(listener => listener());

    try {
      const data = await getDailyAstrologicalWeather(true); // forceRefresh
      sharedWeather = data;
      sharedError = null;
    } catch (err) {
      logger.error('❌ Error refrescando clima:', err);
      sharedError = 'Error al refrescar el clima astrológico';
    } finally {
      sharedIsLoading = false;
      listeners.forEach(listener => listener());
    }
  };

  return {
    weather,
    isLoading,
    error,
    refresh
  };
}

/**
 * Limpiar el estado compartido (útil para testing o logout)
 */
export function clearDailyWeather() {
  sharedWeather = null;
  sharedIsLoading = false;
  sharedError = null;
  loadingPromise = null;
  listeners.forEach(listener => listener());
}
