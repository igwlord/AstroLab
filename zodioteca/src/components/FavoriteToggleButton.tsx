/**
 * FavoriteToggleButton - Botón universal para agregar/quitar favoritos
 * 
 * Características:
 * - ⭐ Toggle visual (☆ vacío / ★ lleno amarillo brillante)
 * - Efecto pop brillante al seleccionar (scale + rotate + glow)
 * - Accesibilidad completa (aria-pressed, keyboard, focus visible)
 * - Touch-target mínimo 44×44px (Apple HIG)
 * - Tooltip informativo
 * - stopPropagation para no interferir con clicks padre
 * - Soporte para ámbitos (global/chart)
 * - Feedback visual inmediato + vibración táctil
 * 
 * Versión 2.0 - Integrado con store simplificado
 */

import { useState, useCallback } from 'react';
import type { FC, MouseEvent, KeyboardEvent } from 'react';
import { useFavorites } from '../store/useFavorites';
import type { FavoriteItem } from '../types/favorites';
import { generateFavoriteId } from '../types/favorites';

// ============================================
// PROPS
// ============================================

interface FavoriteToggleButtonProps {
  /**
   * Datos del favorito (sin id, createdAt, lastUsedAt)
   */
  item: Omit<FavoriteItem, 'id' | 'createdAt' | 'lastUsedAt'>;
  
  /**
   * Tamaño del botón
   * - sm: 32px (mobile, cards pequeñas)
   * - md: 44px (default, touch-safe)
   * - lg: 56px (hero sections)
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante de color
   */
  variant?: 'amber' | 'gold' | 'purple' | 'gradient';
  
  /**
   * Mostrar tooltip al hacer hover
   */
  showTooltip?: boolean;
  
  /**
   * Callback al cambiar estado (opcional, para analytics)
   */
  onToggle?: (isFavorite: boolean) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Deshabilitar el botón
   */
  disabled?: boolean;
}

// ============================================
// COMPONENTE
// ============================================

const FavoriteToggleButton: FC<FavoriteToggleButtonProps> = ({
  item,
  size = 'md',
  variant = 'amber',
  showTooltip = true,
  onToggle,
  className = '',
  disabled = false,
}) => {
  const { has, add, remove } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  
  // Generar ID único usando la función del store (tipo_titulo-normalizado)
  const uniqueId = generateFavoriteId(item.type, item.title);
  
  // Verificar si ya es favorito (usa búsqueda dual: ID directo + tipo/título)
  const isFavorite = has(uniqueId);
  
  // =========== HANDLERS ===========
  
  const handleToggle = useCallback((e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    // Prevenir propagación (no abrir modales padre)
    e.stopPropagation();
    e.preventDefault();
    
    if (disabled) return;
    
    // Animación de feedback brillante (star-pop)
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500); // Duración del keyframe
    
    // Toggle favorito
    if (isFavorite) {
      remove(uniqueId);
      onToggle?.(false);
    } else {
      const newId = add(item);
      if (newId) {
        onToggle?.(true);
      }
    }
    
    // Vibración táctil en mobile (solo si está soportado)
    if ('vibrate' in navigator) {
      navigator.vibrate([10]); // 10ms de vibración sutil
    }
  }, [isFavorite, item, add, remove, onToggle, disabled, uniqueId]);
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    handleToggle(e);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    // Activar con Enter o Espacio
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e);
    }
  };
  
  // =========== ESTILOS DINÁMICOS ===========
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg min-w-[32px] min-h-[32px]',
    md: 'w-11 h-11 text-xl min-w-[44px] min-h-[44px]', // 44px = Apple touch target
    lg: 'w-14 h-14 text-2xl min-w-[56px] min-h-[56px]',
  };
  
  // Estilos para estrella: amarilla brillante (activo) / gris apagada (inactivo)
  // ⭐ Refactor 3: Colores simplificados, todas las variantes usan amarillo cuando activo
  const variantClasses = {
    amber: isFavorite
      ? 'text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.9)]'
      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600',
    gold: isFavorite
      ? 'text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.9)]'
      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600',
    purple: isFavorite
      ? 'text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.9)]'
      : 'text-gray-300 dark:text-gray-600 hover:text-purple-300 dark:hover:text-purple-600',
    gradient: isFavorite
      ? 'text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.9)]'
      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200 dark:hover:text-yellow-600',
  };
  
  // Animación pop brillante al toggle (definida en index.css @keyframes star-pop)
  const animationClasses = isAnimating
    ? 'animate-[star-pop_0.5s_ease-out]'
    : 'hover:scale-110 active:scale-95';
  
  // =========== TOOLTIP ===========
  
  const tooltipText = isFavorite
    ? 'Quitar de favoritos'
    : 'Agregar a favoritos';
  
  // =========== RENDER ===========
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        disabled={disabled}
        aria-pressed={isFavorite}
        aria-label={tooltipText}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${animationClasses}
          flex items-center justify-center
          rounded-full
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          select-none
          relative
          z-10
          ${className}
        `}
        style={{
          // Asegurar touch-target mínimo
          touchAction: 'manipulation',
        }}
      >
        {/* Estrella - Siempre llena cuando es favorito */}
        <span
          className="transition-all duration-200"
          aria-hidden="true"
        >
          {isFavorite ? '★' : '☆'}
        </span>
      </button>
      
      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div
          role="tooltip"
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-1.5
            bg-gray-900 dark:bg-gray-100
            text-white dark:text-gray-900
            text-xs font-medium
            rounded-lg
            whitespace-nowrap
            pointer-events-none
            z-50
            animate-fadeIn
            shadow-lg
          `}
        >
          {tooltipText}
          {/* Flecha del tooltip */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px"
            aria-hidden="true"
          >
            <div
              className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteToggleButton;
