import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ASPECTS } from '../types/aspect';
import type { Aspect } from '../types/aspect';
import AspectModal from './AspectModal';
import { normalizeAspectKey, getAspectUI } from '../constants/aspectsStandard';
import FavoriteToggleButton from './FavoriteToggleButton';

const AspectsGrid: React.FC = () => {
  const location = useLocation();
  const [selectedAspect, setSelectedAspect] = useState<Aspect | null>(null);
  
  // Auto-abrir modal si viene desde favoritos
  useEffect(() => {
    const state = location.state as { autoOpen?: string; fromFavorites?: boolean } | null;
    if (state?.autoOpen && state?.fromFavorites) {
      const aspect = ASPECTS.find(a => a.name.toLowerCase() === state.autoOpen!.toLowerCase());
      if (aspect) {
        setSelectedAspect(aspect);
        window.history.replaceState({}, document.title);
        setTimeout(() => {
          const element = document.querySelector(`[data-id="${state.autoOpen}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [location.state]);

  // Mostrar todos los aspectos sin filtros
  const filteredAspects = ASPECTS;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'major':
        return 'from-blue-500 to-purple-600';
      case 'minor':
        return 'from-indigo-500 to-violet-600';
      case 'creative':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'major':
        return 'Mayor';
      case 'minor':
        return 'Menor';
      case 'creative':
        return 'Creativo';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Grid de Aspectos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {filteredAspects.map((aspect) => {
          const normalizedKey = normalizeAspectKey(aspect.name);
          const standardSymbol = normalizedKey ? getAspectUI(normalizedKey).symbol : aspect.symbol;
          
          return (
            <button
              key={aspect.name}
              data-id={aspect.name.toLowerCase()}
              onClick={() => setSelectedAspect(aspect)}
              className={`relative bg-gradient-to-br ${getCategoryColor(aspect.category)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
            >
              <div className="absolute top-1 right-1 z-30">
                <FavoriteToggleButton
                  item={{
                    type: 'glossary-aspect',
                    scope: 'global',
                    title: aspect.name,
                    icon: standardSymbol,
                    route: `/glossary?categoria=aspects#aspect-${aspect.name.toLowerCase()}`,
                    targetId: aspect.name.toLowerCase(),
                    tags: [aspect.category],
                    pinned: false
                  }}
                  size="sm"
                  variant="amber"
                />
              </div>
              <span className="text-4xl sm:text-5xl md:text-6xl">{standardSymbol}</span>
              <div className="text-center">
                <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">{aspect.name}</h3>
                <p className="text-[10px] sm:text-xs md:text-sm opacity-90">{aspect.angle}</p>
                <span className="text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full mt-1 sm:mt-2 inline-block">
                  {getCategoryName(aspect.category)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📊 Tipos de Aspectos
        </h4>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Mayores:</strong> Los más potentes (0°, 60°, 90°, 120°, 180°)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-violet-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Menores:</strong> Tensiones sutiles y ajustes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-500 to-orange-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Creativos:</strong> Talentos y dones especiales
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AspectModal
        aspect={selectedAspect}
        isOpen={selectedAspect !== null}
        onClose={() => setSelectedAspect(null)}
      />
    </div>
  );
};

export default AspectsGrid;
