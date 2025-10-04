import React, { useEffect, useRef } from 'react';
import type { House } from '../types/house';

interface HouseModalProps {
  house: House | null;
  isOpen: boolean;
  onClose: () => void;
}

const HouseModal: React.FC<HouseModalProps> = ({ house, isOpen, onClose }) => {
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
    if (!house) return;
    
    const frequencyValue = house.frequency.split('/')[0].trim().replace(' Hz', '');
    const audioPath = `/media/${frequencyValue}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  };

  if (!isOpen || !house) return null;

  const getCategoryStyles = (category: string) => {
    const styles = {
      angular: {
        gradient: 'from-red-600 via-rose-600 to-pink-600',
        bg: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
        badge: 'bg-red-500/20 text-red-700 dark:text-red-300',
        icon: '🔷',
        border: 'border-red-300 dark:border-red-700'
      },
      succedent: {
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        bg: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
        badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        icon: '🔶',
        border: 'border-green-300 dark:border-green-700'
      },
      cadent: {
        gradient: 'from-blue-600 via-cyan-600 to-sky-600',
        bg: 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        icon: '🔹',
        border: 'border-blue-300 dark:border-blue-700'
      }
    };

    return styles[category as keyof typeof styles];
  };

  const categoryStyle = getCategoryStyles(house.category);
  const categoryName = house.category === 'angular' ? 'Angular' : house.category === 'succedent' ? 'Sucedente' : 'Cadente';

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
              <div className="text-6xl font-bold">{house.number}</div>
              <div>
                <h2 className="text-4xl font-bold">{house.name}</h2>
                <p className="text-white/90 text-xl">{house.title}</p>
              </div>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                {categoryStyle.icon} {categoryName}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                Signo natural: {house.naturalSign}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className={`${categoryStyle.bg} overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6`}>
          {/* Descripción extensa */}
          <section>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <span className="text-4xl font-bold">{house.number}</span>
              Arquetipo de la Casa
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {house.description}
            </p>
          </section>

          {/* Manifestación cotidiana */}
          <section className={`p-4 rounded-xl border-2 ${categoryStyle.border} ${categoryStyle.badge}`}>
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="leading-relaxed">
              {house.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Características astrológicas */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
              <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-3">
                🏠 Características Astrológicas
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Categoría:</span> {categoryStyle.icon} {categoryName}
                </div>
                <div>
                  <span className="font-semibold">Signo Natural:</span> {house.naturalSign}
                </div>
                <div>
                  <span className="font-semibold">Regente Natural:</span> {house.naturalRuler}
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
                      house.color.includes('rojo') ? '#DC2626' :
                      house.color.includes('verde esmeralda') ? '#10B981' :
                      house.color.includes('amarillo') ? '#FBBF24' :
                      house.color.includes('blanco') || house.color.includes('plateado') ? '#C0C0C0' :
                      house.color.includes('dorado') ? '#FFD700' :
                      house.color.includes('verde oliva') ? '#84CC16' :
                      house.color.includes('rosa') ? '#F472B6' :
                      house.color.includes('negro') || house.color.includes('granate') ? '#7F1D1D' :
                      house.color.includes('púrpura') ? '#9333EA' :
                      house.color.includes('gris') ? '#4B5563' :
                      house.color.includes('azul eléctrico') ? '#06B6D4' :
                      house.color.includes('violeta') ? '#8B5CF6' : '#6B7280'
                    }}
                  ></span> {house.color}
                </div>
                <div>
                  <span className="font-semibold">Chakra:</span> {house.chakra}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Frecuencia:</span> {house.frequency}
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
              {house.holisticExercise}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HouseModal;
