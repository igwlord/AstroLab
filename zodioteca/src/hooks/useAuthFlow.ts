/**
 * Hook centralizado para manejar el flujo de autenticación
 * Usa un reducer para evitar bugs de estado inconsistente
 */

import { useReducer, useCallback, useEffect } from 'react';

// Estados posibles del flujo de autenticación
export type AuthFlowState = 
  | { phase: 'idle' }
  | { phase: 'authenticating', method: 'guest' | 'credentials' }
  | { phase: 'success', message: string, timestamp: number, destination: string }
  | { phase: 'loading', destination: string }
  | { phase: 'ready', destination: string }
  | { phase: 'error', message: string };

type AuthFlowAction =
  | { type: 'START_AUTH', method: 'guest' | 'credentials' }
  | { type: 'AUTH_SUCCESS', message: string, destination: string }
  | { type: 'START_LOADING', destination: string }
  | { type: 'COMPLETE_LOADING', destination: string }
  | { type: 'ERROR', message: string }
  | { type: 'RESET' };

function authFlowReducer(state: AuthFlowState, action: AuthFlowAction): AuthFlowState {
  switch (action.type) {
    case 'START_AUTH':
      return { phase: 'authenticating', method: action.method };
    
    case 'AUTH_SUCCESS':
      return { 
        phase: 'success', 
        message: action.message,
        timestamp: Date.now(),
        destination: action.destination
      };
    
    case 'START_LOADING':
      return { phase: 'loading', destination: action.destination };
    
    case 'COMPLETE_LOADING':
      return { phase: 'ready', destination: action.destination };
    
    case 'ERROR':
      return { phase: 'error', message: action.message };
    
    case 'RESET':
      return { phase: 'idle' };
    
    default:
      return state;
  }
}

export function useAuthFlow() {
  const [state, dispatch] = useReducer(authFlowReducer, { phase: 'idle' });

  // Guardar estado en sessionStorage para persistencia
  useEffect(() => {
    if (state.phase !== 'idle') {
      sessionStorage.setItem('auth-flow-state', JSON.stringify({
        phase: state.phase,
        timestamp: Date.now()
      }));
    }
  }, [state]);

  // Recuperar estado si la página se recarga
  useEffect(() => {
    const savedState = sessionStorage.getItem('auth-flow-state');
    if (savedState) {
      try {
        const { phase, timestamp } = JSON.parse(savedState);
        // Solo recuperar si fue hace menos de 1 minuto
        if (Date.now() - timestamp < 60000 && phase === 'loading') {
          // Continuar desde loading si estaba cargando
          console.log('🔄 Recuperando estado de carga...');
        }
      } catch (e) {
        console.error('Error recuperando estado:', e);
      }
    }
  }, []);

  const startAuth = useCallback((method: 'guest' | 'credentials') => {
    dispatch({ type: 'START_AUTH', method });
  }, []);

  const authSuccess = useCallback((message: string, destination: string) => {
    dispatch({ type: 'AUTH_SUCCESS', message, destination });
  }, []);

  const startLoading = useCallback((destination: string) => {
    dispatch({ type: 'START_LOADING', destination });
  }, []);

  const completeLoading = useCallback((destination: string) => {
    dispatch({ type: 'COMPLETE_LOADING', destination });
    // Limpiar sessionStorage al completar
    sessionStorage.removeItem('auth-flow-state');
  }, []);

  const error = useCallback((message: string) => {
    dispatch({ type: 'ERROR', message });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    sessionStorage.removeItem('auth-flow-state');
  }, []);

  return {
    state,
    startAuth,
    authSuccess,
    startLoading,
    completeLoading,
    error,
    reset,
    // Estados derivados para facilitar uso
    isIdle: state.phase === 'idle',
    isAuthenticating: state.phase === 'authenticating',
    isSuccess: state.phase === 'success',
    isLoading: state.phase === 'loading',
    isReady: state.phase === 'ready',
    isError: state.phase === 'error'
  };
}
