import React, { useEffect, useRef } from 'react';
import type { ZodiacSign } from '../types/zodiacSign';

interface ZodiacModalProps {
  sign: ZodiacSign | null;
  isOpen: boolean;
  onClose: () => void;
}

const ZodiacModal: React.FC<ZodiacModalProps> = ({ sign, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Stop audio when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
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

  const playFrequency = () => {
    if (!sign) return;
    
    const frequencyValue = sign.frequency.split('/')[0].trim().replace(' Hz', '');
    const audioPath = `/media/${frequencyValue}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err);
    });
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
        icon: '💨',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-scaleIn"
      >
        {/* Header con gradiente del elemento */}
        <div className={`relative bg-gradient-to-r ${elementStyle.gradient} text-white p-8 overflow-hidden`}>
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm z-10"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Contenido del header */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-6xl animate-bounce">{sign.symbol}</div>
              <div>
                <h2 className="text-4xl font-bold">{sign.name}</h2>
                <p className="text-white/90 text-lg">{sign.dateRange}</p>
              </div>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                {elementStyle.icon} {sign.element.charAt(0).toUpperCase() + sign.element.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                {sign.modality.charAt(0).toUpperCase() + sign.modality.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                {sign.polarity === 'positiva' ? '☀️ Masculino' : '🌙 Femenino'}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className={`${elementStyle.bg} overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6`}>
          {/* Descripción extensa */}
          <section>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span className="text-3xl">{sign.symbol}</span>
              Descripción Arquetípica
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {sign.description}
            </p>
          </section>

          {/* Manifestación cotidiana */}
          <section className={`p-4 rounded-xl border-2 ${elementStyle.border} ${elementStyle.badge}`}>
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="leading-relaxed">
              {sign.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Características astrológicas */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-3">
                📊 Características Astrológicas
              </h4>
              <div className="space-y-2 text-sm">
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
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-3">
                🧘 Dimensión Holística
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Color:</span> 
                  <span className="ml-2 inline-block w-4 h-4 rounded-full border border-gray-300" 
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
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Frecuencia:</span> {sign.frequency}
                  <button
                    onClick={playFrequency}
                    className="px-2 py-1 text-xs rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                    title="Reproducir frecuencia"
                  >
                    ▶️ Escuchar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ejercicio holístico */}
          <section className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-5 border-2 border-purple-300 dark:border-purple-700">
            <h4 className="font-bold text-xl text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span className="text-2xl">🧘‍♀️</span>
              Ejercicio Holístico de Integración
            </h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {sign.holisticExercise}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ZodiacModal;
