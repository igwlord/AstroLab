import React, { useEffect, useRef } from 'react';
import type { Planet } from '../types/planet';

interface PlanetModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlanetModal: React.FC<PlanetModalProps> = ({ planet, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
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
    if (!planet) return;
    
    const frequencyValue = planet.frequency.split('/')[0].trim().replace(' Hz', '');
    const audioPath = `/media/${frequencyValue}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  };

  if (!isOpen || !planet) return null;

  const getCategoryStyles = (category: string) => {
    const styles = {
      personal: {
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
        badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
        icon: '⭐',
        border: 'border-amber-300 dark:border-amber-700'
      },
      social: {
        gradient: 'from-blue-500 via-indigo-500 to-purple-500',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        icon: '🌍',
        border: 'border-blue-300 dark:border-blue-700'
      },
      transpersonal: {
        gradient: 'from-purple-600 via-violet-600 to-fuchsia-600',
        bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20',
        badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
        icon: '✨',
        border: 'border-purple-300 dark:border-purple-700'
      }
    };

    return styles[category as keyof typeof styles];
  };

  const categoryStyle = getCategoryStyles(planet.category);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-scaleIn"
      >
        {/* Header con gradiente de la categoría */}
        <div className={`relative bg-gradient-to-r ${categoryStyle.gradient} text-white p-8 overflow-hidden`}>
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
              <div className="text-7xl font-light animate-pulse">{planet.symbol}</div>
              <div>
                <h2 className="text-4xl font-bold">{planet.name}</h2>
                <p className="text-white/90 text-lg capitalize">Planeta {planet.rhythm}</p>
              </div>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                {categoryStyle.icon} {planet.category === 'personal' ? 'Personal' : planet.category === 'social' ? 'Social' : 'Transpersonal'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                ♛ Rige: {planet.rulership}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className={`${categoryStyle.bg} overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6`}>
          {/* Descripción extensa */}
          <section>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span className="text-4xl font-light">{planet.symbol}</span>
              Esencia Arquetípica
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {planet.description}
            </p>
          </section>

          {/* Manifestación cotidiana */}
          <section className={`p-4 rounded-xl border-2 ${categoryStyle.border} ${categoryStyle.badge}`}>
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="leading-relaxed">
              {planet.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Características astrológicas */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-3">
                🪐 Características Astrológicas
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Ritmo:</span> {planet.rhythm === 'personal' ? '⭐ Personal' : planet.rhythm === 'social' ? '🌍 Social' : '✨ Transpersonal'}
                </div>
                <div>
                  <span className="font-semibold">Regencia:</span> {planet.rulership}
                </div>
                <div>
                  <span className="font-semibold">Exaltación:</span> {planet.exaltation}
                </div>
                <div>
                  <span className="font-semibold">Casa Natural:</span> {planet.naturalHouse}
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
                    style={{ backgroundColor: 
                      planet.color.includes('dorado') || planet.color.includes('amarillo') ? '#FFD700' :
                      planet.color.includes('plata') || planet.color.includes('blanco') ? '#C0C0C0' :
                      planet.color.includes('gris') ? '#94A3B8' :
                      planet.color.includes('verde') || planet.color.includes('rosa') ? '#10B981' :
                      planet.color.includes('rojo') ? '#DC2626' :
                      planet.color.includes('azul profundo') || planet.color.includes('púrpura') ? '#6366F1' :
                      planet.color.includes('negro') || planet.color.includes('marrón') ? '#1F2937' :
                      planet.color.includes('eléctrico') || planet.color.includes('turquesa') ? '#06B6D4' :
                      planet.color.includes('violeta') ? '#8B5CF6' :
                      planet.color.includes('granate') ? '#7F1D1D' : '#6B7280'
                    }}
                  ></span> {planet.color}
                </div>
                <div>
                  <span className="font-semibold">Chakra:</span> {planet.chakra}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Frecuencia:</span> {planet.frequency}
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
              {planet.holisticExercise}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PlanetModal;
