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

import { useRef } from 'react';
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
  
  /** Callback al abrir (opcional, para compatibilidad) */
  onOpen?: () => void;
  
  /** Callback al eliminar */
  onDelete?: (id: string) => void;
  
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
  onOpen,
  onDelete,
  compact = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const { touch } = useFavorites();
  
  const cardRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // No navegar al hacer click en delete
    if (onDelete) {
      onDelete(item.id);
    }
  };
  
  // =========== ESTILOS DINÁMICOS ===========
  
  const typeLabel = getFavoriteTypeLabel(item.type);
  
  // =========== RENDER ===========
  
  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Card principal */}
      <div
        onClick={handleClick}
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
          hover:scale-[1.02] hover:-translate-y-0.5
          active:scale-[0.98]
          active:translate-y-0
          group
        `}
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
            
            {/* Botón de eliminar */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={`
                  ${compact ? 'text-base' : 'text-lg'}
                  text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                  transition-all duration-200
                  hover:scale-125
                  active:scale-95
                  opacity-0 group-hover:opacity-100
                `}
                aria-label="Eliminar favorito"
                title="Eliminar"
              >
                🗑️
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
