/**
 * FavoriteCard - Tarjeta minimalista de favorito como enlace directo
 * 
 * Versión 2.0 - Sistema de bookmarks
 * 
 * Características:
 * - 🔗 Enlace directo (navega a ruta original)
 * - 🎨 Diseño minimalista (icono + título + categoría + ChevronRight)
 * - 📌 Badge de anclado
 * - 📱 Swipe-to-delete en móvil
 * - ♿ Accesibilidad completa
 * - 🎭 Animación hover sutil
 * - 🚫 Sin modal propio, sin preview complejo
 */

import { useState, useRef } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FavoriteItem } from '../types/favorites';
import { getFavoriteTypeLabel } from '../types/favorites';
import { useFavorites } from '../store/useFavorites';

// ============================================
// PROPS
// ============================================

interface FavoriteCardProps {
  /** Item del favorito */
  item: FavoriteItem;
  
  /** Callback al eliminar (opcional, usa store por defecto) */
  onRemove?: () => void;
  
  /** Callback al abrir (opcional, para compatibilidad) */
  onOpen?: () => void;
  
  /** Callback al anclar/desanclar (opcional, usa store por defecto) */
  onTogglePin?: () => void;
  
  /** Modo compacto (para dashboard/widgets) */
  compact?: boolean;
  
  /** Clase CSS adicional */
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

const FavoriteCard: FC<FavoriteCardProps> = ({
  item,
  onRemove,
  onOpen,
  onTogglePin,
  compact = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const { remove, togglePin, touch } = useFavorites();
  
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // =========== SWIPE TO DELETE (Mobile) ===========
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(false);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = Math.abs(touchStartY.current - currentY);
    
    // Si el movimiento es más horizontal que vertical, es un swipe
    if (Math.abs(diffX) > diffY && Math.abs(diffX) > 10) {
      setIsSwiping(true);
      // Prevenir scroll vertical cuando estamos haciendo swipe horizontal
      e.preventDefault();
      
      // Solo permitir swipe a la izquierda
      if (diffX > 0) {
        setSwipeOffset(Math.min(diffX, 100));
      } else {
        setSwipeOffset(0);
      }
    }
  };
  
  const handleTouchEnd = () => {
    // Si el swipe fue mayor a 60px, eliminar
    if (swipeOffset > 60) {
      handleRemove();
    } else {
      // Volver a la posición original con animación
      setSwipeOffset(0);
    }
    setIsSwiping(false);
  };
  
  // =========== ACCIONES ===========
  
  const handleClick = () => {
    // Actualizar lastUsedAt
    touch(item.id);
    
    // Si hay callback onOpen (compatibilidad), usarlo
    if (onOpen) {
      onOpen();
      return;
    }
    
    // Navegar a la ruta original con state para auto-abrir modal
    navigate(item.route, { 
      state: { 
        autoOpen: item.targetId,
        fromFavorites: true 
      } 
    });
  };
  
  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      remove(item.id);
    }
  };
  
  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation(); // No navegar al hacer click en pin
    
    if (onTogglePin) {
      onTogglePin();
    } else {
      togglePin(item.id);
    }
  };
  
  // =========== ESTILOS DINÁMICOS ===========
  
  const typeLabel = getFavoriteTypeLabel(item.type);
  
  // =========== RENDER ===========
  
  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y pinch-zoom' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background de eliminación (swipe) */}
      {swipeOffset > 0 && (
        <div
          className="absolute inset-0 bg-gradient-to-l from-red-500 to-red-600 flex items-center justify-end px-6 text-white font-bold rounded-xl z-0"
          style={{ 
            opacity: Math.min(swipeOffset / 80, 1),
            pointerEvents: 'none'
          }}
        >
          <span className="flex items-center gap-2 text-lg">
            <span className="text-2xl">🗑️</span>
            <span className="hidden sm:inline">Eliminar</span>
          </span>
        </div>
      )}
      
      {/* Card principal */}
      <div
        onClick={(e) => {
          // Solo navegar si no estamos haciendo swipe
          if (isSwiping || swipeOffset > 10) {
            e.preventDefault();
            return;
          }
          handleClick();
        }}
        className={`
          relative z-10
          ${compact ? 'p-3' : 'p-4'}
          bg-white/70 dark:bg-purple-900/20
          backdrop-blur-sm
          rounded-xl
          border-2 border-purple-200 dark:border-purple-700
          cursor-pointer
          transition-all duration-300 ease-out
          hover:border-purple-400 dark:hover:border-purple-500
          hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30
          ${swipeOffset === 0 ? 'hover:scale-[1.02] hover:-translate-y-0.5' : ''}
          active:scale-[0.98]
          active:translate-y-0
          group
        `}
        style={{
          transform: swipeOffset > 0 
            ? `translateX(-${swipeOffset}px)` 
            : undefined,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        role="link"
        tabIndex={0}
        aria-label={`Ir a ${item.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Contenido */}
        <div className="flex items-center gap-3">
          {/* Icono */}
          <span 
            className={`
              ${compact ? 'text-2xl' : 'text-3xl'} 
              flex-shrink-0
              transition-transform duration-300
              group-hover:scale-110
            `} 
            aria-hidden="true"
          >
            {item.icon || '⭐'}
          </span>
          
          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Título */}
            <h3 
              className={`
                ${compact ? 'text-sm' : 'text-base'}
                font-bold 
                text-purple-900 dark:text-white
                truncate
                mb-0.5
              `}
            >
              {item.title}
            </h3>
            
            {/* Categoría */}
            <p 
              className={`
                ${compact ? 'text-xs' : 'text-sm'}
                text-gray-600 dark:text-gray-400
                truncate
              `}
            >
              {typeLabel}
              {item.scope === 'chart' && item.chartId && ' • Por carta'}
            </p>
          </div>
          
          {/* Badges y acciones */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Badge de anclado */}
            {item.pinned && (
              <button
                onClick={handleTogglePin}
                className={`
                  ${compact ? 'text-base' : 'text-lg'}
                  transition-transform duration-200
                  hover:scale-125
                  active:scale-95
                `}
                aria-label="Desanclar favorito"
                title="Desanclar"
              >
                📌
              </button>
            )}
            
            {/* Botón de pin (solo visible al hover si no está pinned) */}
            {!item.pinned && !compact && (
              <button
                onClick={handleTogglePin}
                className="
                  text-lg
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200
                  hover:scale-125
                  active:scale-95
                "
                aria-label="Anclar favorito"
                title="Anclar"
              >
                📌
              </button>
            )}
            
            {/* ChevronRight */}
            <span 
              className={`
                ${compact ? 'text-lg' : 'text-xl'}
                text-purple-400 dark:text-purple-500
                transition-transform duration-300
                group-hover:translate-x-1
              `}
              aria-hidden="true"
            >
              ›
            </span>
          </div>
        </div>
        
        {/* Tags (solo si hay y no es compacto) */}
        {!compact && item.tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="
                  px-2 py-0.5
                  bg-purple-100 dark:bg-purple-800/30
                  text-purple-700 dark:text-purple-300
                  text-xs font-medium
                  rounded-full
                "
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteCard;
