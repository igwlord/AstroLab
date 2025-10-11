import React, { useEffect, useRef } from 'react';
import type { ZodiacSign } from '../types/zodiacSign';
import FrequencyBadge from './FrequencyBadge';

interface ZodiacModalProps {
  sign: ZodiacSign | null;
  isOpen: boolean;
  onClose: () => void;
}

const ZodiacModal: React.FC<ZodiacModalProps> = ({ sign, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !sign) return null;

  const getElementStyles = (element: string) => {
    const styles = {
      fuego: {
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        bg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        badge: 'bg-red-500/20 text-red-700 dark:text-red-300',
        icon: '🔥',
        border: 'border-red-300 dark:border-red-700'
      },
      tierra: {
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        icon: '🌱',
        border: 'border-green-300 dark:border-green-700'
      },
      aire: {
        gradient: 'from-blue-400 via-cyan-400 to-sky-400',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        icon: '🌀',
        border: 'border-blue-300 dark:border-blue-700'
      },
      agua: {
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        bg: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
        badge: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
        icon: '💧',
        border: 'border-indigo-300 dark:border-indigo-700'
      }
    };

    return styles[element as keyof typeof styles];
  };

  const elementStyle = getElementStyles(sign.element);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pt-16 pb-4 px-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[calc(100vh-5rem)] sm:max-h-[88vh] my-auto overflow-hidden rounded-lg sm:rounded-2xl shadow-2xl animate-scaleIn"
      >
        {/* Header con gradiente del elemento */}
        <div className={`relative bg-gradient-to-r ${elementStyle.gradient} text-white p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden`}>
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Contenido del header - debe estar ANTES con z-index menor */}
          <div className="relative z-[1] pr-12 sm:pr-14 md:pr-16">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-1 sm:mb-2">
              <div className="modal-icon-lg animate-bounce">{sign.symbol}</div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">{sign.name}</h2>
                <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg">{sign.dateRange}</p>
              </div>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 md:mt-4">
              <span className="modal-badge bg-white/20 backdrop-blur-sm">
                {elementStyle.icon} {sign.element.charAt(0).toUpperCase() + sign.element.slice(1)}
              </span>
              <span className="modal-badge bg-white/20 backdrop-blur-sm">
                {sign.modality === 'cardinal' ? '⚡' : sign.modality === 'fija' ? '🔒' : '♻️'} {sign.modality.charAt(0).toUpperCase() + sign.modality.slice(1)}
              </span>
              <span className="modal-badge bg-white/20 backdrop-blur-sm">
                {sign.polarity === 'positiva' ? '♂️ Masculino' : '♀️ Femenino'}
              </span>
            </div>
          </div>

          {/* Botón cerrar - DEBE ESTAR AL FINAL del header con z-index MÁS ALTO */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="group absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 active:bg-white/50 transition-all backdrop-blur-sm text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
            aria-label="Cerrar modal"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              minWidth: '48px',
              minHeight: '48px',
              zIndex: 9999,
              pointerEvents: 'all',
              cursor: 'pointer'
            }}
          >
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-300 pointer-events-none" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="bg-white dark:bg-gray-900 overflow-y-auto max-h-[calc(88vh-100px)] sm:max-h-[calc(90vh-140px)] md:max-h-[calc(90vh-180px)] lg:max-h-[calc(90vh-200px)] modal-content">
          {/* Descripción extensa */}
          <section>
            <h3 className="modal-h3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <span className="modal-icon-md">{sign.symbol}</span>
              Descripción Arquetípica
            </h3>
            <p className="modal-text text-gray-800 dark:text-gray-200">
              {sign.description}
            </p>
          </section>

          {/* Manifestación cotidiana */}
          <section className={`modal-section border-2 ${elementStyle.border} bg-gradient-to-br ${elementStyle.bg}`}>
            <h4 className="modal-h4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="modal-text text-gray-800 dark:text-gray-200">
              {sign.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="modal-grid">
            {/* Características astrológicas */}
            <div className="modal-card bg-white dark:bg-gray-800">
              <h4 className="modal-h4 text-purple-900 dark:text-purple-100">
                📊 Características Astrológicas
              </h4>
              <div className="space-y-1.5 sm:space-y-2 modal-text-sm">
                <div>
                  <span className="font-semibold">Elemento:</span> {elementStyle.icon} {sign.element.charAt(0).toUpperCase() + sign.element.slice(1)}
                </div>
                <div>
                  <span className="font-semibold">Modalidad:</span> {sign.modality.charAt(0).toUpperCase() + sign.modality.slice(1)}
                </div>
                <div>
                  <span className="font-semibold">Polaridad:</span> {sign.polarity === 'positiva' ? '☀️ Positiva (Masculina)' : '🌙 Negativa (Femenina)'}
                </div>
                <div>
                  <span className="font-semibold">Regente:</span> {sign.ruler}
                </div>
                <div>
                  <span className="font-semibold">Casa Natural:</span> {sign.naturalHouse}
                </div>
              </div>
            </div>

            {/* Características holísticas */}
            <div className="modal-card bg-white dark:bg-gray-800">
              <h4 className="modal-h4 text-purple-900 dark:text-purple-100">
                🧘 Dimensión Holística
              </h4>
              <div className="space-y-1.5 sm:space-y-2 modal-text-sm text-gray-800 dark:text-gray-200">
                <div>
                  <span className="font-semibold">Color:</span> 
                  <span className="ml-2 inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300" 
                    style={{ backgroundColor: sign.color.includes('rojo') ? '#DC2626' : 
                             sign.color.includes('verde') ? '#059669' : 
                             sign.color.includes('amarillo') ? '#FBBF24' :
                             sign.color.includes('plata') ? '#C0C0C0' :
                             sign.color.includes('dorado') ? '#FFD700' :
                             sign.color.includes('rosa') ? '#F472B6' :
                             sign.color.includes('granate') ? '#7F1D1D' :
                             sign.color.includes('púrpura') ? '#9333EA' :
                             sign.color.includes('gris') ? '#4B5563' :
                             sign.color.includes('azul') ? '#3B82F6' :
                             sign.color.includes('violeta') ? '#8B5CF6' : '#6B7280' 
                    }}
                  ></span> {sign.color}
                </div>
                <div>
                  <span className="font-semibold">Chakra:</span> {sign.chakra}
                </div>
              </div>
            </div>
          </div>

          {/* Frequency Badge - Reemplaza el reproductor */}
          <FrequencyBadge
            frequency={sign.frequency}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ZodiacModal;
