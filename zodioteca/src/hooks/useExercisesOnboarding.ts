/**
 * useExercisesOnboarding - Hook para manejar onboarding de Ejercicios
 * 
 * Gestiona:
 * - Primera visita a la sección
 * - Preferencia "No volver a mostrar"
 * - Persistencia en localStorage
 * - Reset desde configuración
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'exercises_onboarding_seen';
const ONBOARDING_VERSION = '1.0'; // Para re-mostrar si hay cambios importantes

interface OnboardingState {
  seen: boolean;
  version: string;
  timestamp: number;
}

export function useExercisesOnboarding() {
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estado desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        // Primera visita
        setShouldShowWelcome(true);
      } else {
        const state: OnboardingState = JSON.parse(stored);
        
        // Re-mostrar si la versión cambió (nuevas features)
        if (state.version !== ONBOARDING_VERSION) {
          setShouldShowWelcome(true);
        } else {
          setShouldShowWelcome(!state.seen);
        }
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      setShouldShowWelcome(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marcar como visto
  const markAsSeen = useCallback((dontShowAgain: boolean = false) => {
    const state: OnboardingState = {
      seen: dontShowAgain,
      version: ONBOARDING_VERSION,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setShouldShowWelcome(false);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  }, []);

  // Reset onboarding (para testing o desde settings)
  const resetOnboarding = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setShouldShowWelcome(true);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, []);

  // Mostrar modal manualmente (desde menú ayuda, por ejemplo)
  const showWelcome = useCallback(() => {
    setShouldShowWelcome(true);
  }, []);

  return {
    shouldShowWelcome,
    isLoading,
    markAsSeen,
    resetOnboarding,
    showWelcome,
  };
}
