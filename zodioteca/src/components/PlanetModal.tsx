import React from 'react';
import type { Planet } from '../types/planet';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface PlanetModalProps {
  planet: Planet | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlanetModal: React.FC<PlanetModalProps> = ({ planet, isOpen, onClose }) => {
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
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={planet.name}
      subtitle={`Planeta ${planet.rhythm}`}
      icon={planet.symbol}
      gradientColors={categoryStyle.gradient}
    >
      <div className={`${categoryStyle.bg} p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6`}>
        {/* Badges de características */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${categoryStyle.badge} text-xs sm:text-sm font-semibold`}>
            {categoryStyle.icon} {planet.category === 'personal' ? 'Personal' : planet.category === 'social' ? 'Social' : 'Transpersonal'}
          </span>
          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${categoryStyle.badge} text-xs sm:text-sm font-semibold`}>
            ♛ Rige: {planet.rulership}
          </span>
        </div>
          {/* Descripción extensa */}
          <section>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-light">{planet.symbol}</span>
              Esencia Arquetípica
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg">
              {planet.description}
            </p>
          </section>

          {/* Manifestación cotidiana */}
          <section className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${categoryStyle.border} ${categoryStyle.badge}`}>
            <h4 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="leading-relaxed text-sm sm:text-base">
              {planet.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {/* Características astrológicas */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <h4 className="font-bold text-base sm:text-lg text-purple-900 dark:text-purple-100 mb-2 sm:mb-3">
                🪐 Características Astrológicas
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <h4 className="font-bold text-base sm:text-lg text-purple-900 dark:text-purple-100 mb-2 sm:mb-3">
                🧘 Dimensión Holística
              </h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold">Color:</span> 
                  <span className="ml-2 inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300" 
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
              </div>
            </div>
          </div>

          {/* Frequency Badge - Reemplaza el reproductor */}
          <FrequencyBadge
            frequency={planet.frequency}
            onClose={onClose}
          />

          {/* Ejercicio holístico */}
          <section className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-300 dark:border-purple-700">
            <h4 className="font-bold text-base sm:text-lg md:text-xl text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🧘‍♀️</span>
              Ejercicio Holístico de Integración
            </h4>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm sm:text-base">
              {planet.holisticExercise}
            </p>
          </section>
        </div>
    </StandardModal>
  );
};

export default PlanetModal;
