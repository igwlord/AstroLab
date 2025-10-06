import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  gradientColors: string; // e.g., 'from-red-500 via-orange-500 to-yellow-500'
  children: ReactNode;
}

/**
 * Modal estandarizado para todo el glosario
 * Basado en el diseño del modal de Signos del Zodíaco
 */
const StandardModal: React.FC<StandardModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  icon,
  gradientColors,
  children 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Cerrar al hacer clic en el backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      style={{ willChange: 'opacity' }}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-lg sm:rounded-2xl shadow-2xl animate-scaleIn"
        style={{ 
          willChange: 'transform, opacity',
          contain: 'layout style paint'
        }}
      >
        {/* Header con gradiente */}
        <div className={`relative bg-gradient-to-r ${gradientColors} text-white p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden`}>
          {/* Patrón de fondo con puntos */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Botón cerrar - redondo con X pequeña */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm z-10 text-white touch-manipulation"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-1 sm:mb-2">
              {icon && <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-bounce">{icon}</div>}
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{title}</h2>
                {subtitle && <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg">{subtitle}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="bg-white dark:bg-gray-900 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[calc(90vh-140px)] md:max-h-[calc(90vh-180px)] lg:max-h-[calc(90vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandardModal;
