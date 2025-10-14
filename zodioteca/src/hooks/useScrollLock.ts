/**
 * useScrollLock - Hook para bloquear/desbloquear el scroll del body
 *
 * Uso típico en modales:
 * - Bloquea el scroll cuando el modal está abierto
 * - Restaura el scroll cuando se cierra
 * - Maneja múltiples modales abiertos simultáneamente
 */

import { useEffect, useRef } from 'react';

export const useScrollLock = (isLocked: boolean = false) => {
  const originalOverflowRef = useRef<string>('');
  const originalPaddingRightRef = useRef<string>('');

  useEffect(() => {
    if (isLocked) {
      // Guardar valores originales
      originalOverflowRef.current = document.body.style.overflow;
      originalPaddingRightRef.current = document.body.style.paddingRight;

      // Calcular si hay scrollbar vertical
      const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
      const scrollbarWidth = hasScrollbar ? window.innerWidth - document.documentElement.clientWidth : 0;

      // Bloquear scroll
      document.body.style.overflow = 'hidden';

      // Compensar el espacio del scrollbar para evitar saltos visuales
      if (hasScrollbar) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // Restaurar valores originales
      document.body.style.overflow = originalOverflowRef.current;
      document.body.style.paddingRight = originalPaddingRightRef.current;
    }

    // Cleanup cuando el componente se desmonta
    return () => {
      document.body.style.overflow = originalOverflowRef.current;
      document.body.style.paddingRight = originalPaddingRightRef.current;
    };
  }, [isLocked]);
};