import React, { useState } from 'react';
import { ASPECTS } from '../types/aspect';
import type { Aspect } from '../types/aspect';
import AspectModal from './AspectModal';
import { normalizeAspectKey, getAspectUI } from '../constants/aspectsStandard';

const AspectsGrid: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<Aspect | null>(null);
  const [filter, setFilter] = useState<'all' | 'major' | 'minor' | 'creative'>('all');
  const [specificAspect, setSpecificAspect] = useState<string | null>(null);

  // Filtrar por categoría y luego por aspecto específico si está seleccionado
  let filteredAspects = filter === 'all' 
    ? ASPECTS 
    : ASPECTS.filter(aspect => aspect.category === filter);
  
  if (specificAspect) {
    filteredAspects = filteredAspects.filter(aspect => aspect.name === specificAspect);
  }

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
      {/* Filtros */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center px-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="hidden xs:inline">Todos </span>({ASPECTS.length})
        </button>
        <button
          onClick={() => setFilter('major')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'major'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="hidden xs:inline">Mayores </span>({ASPECTS.filter(a => a.category === 'major').length})
        </button>
        <button
          onClick={() => setFilter('minor')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'minor'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="hidden xs:inline">Menores </span>({ASPECTS.filter(a => a.category === 'minor').length})
        </button>
        <button
          onClick={() => setFilter('creative')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'creative'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="hidden xs:inline">Creativos </span>({ASPECTS.filter(a => a.category === 'creative').length})
        </button>
      </div>

      {/* Filtros específicos por aspecto (colores) */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-2 sm:p-3 md:p-4 rounded-xl">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-center">
          🎨 <span className="hidden sm:inline">Filtrar por Aspecto Específico</span><span className="sm:hidden">Aspecto</span>
        </h4>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSpecificAspect(null)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              specificAspect === null
                ? 'bg-gray-700 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
            }`}
          >
            Todos
          </button>
          {ASPECTS.map((aspect) => {
            const normalizedKey = normalizeAspectKey(aspect.name);
            if (!normalizedKey) return null;
            
            const standardAspect = getAspectUI(normalizedKey);
            const hexColor = standardAspect.color;
            
            return (
              <button
                key={aspect.name}
                onClick={() => setSpecificAspect(specificAspect === aspect.name ? null : aspect.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  specificAspect === aspect.name
                    ? 'shadow-lg scale-105 ring-2 ring-offset-2 ring-purple-500'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: specificAspect === aspect.name ? hexColor : `${hexColor}40`,
                  color: specificAspect === aspect.name ? '#ffffff' : hexColor,
                  border: `2px solid ${hexColor}`
                }}
              >
                <span className="text-base">{standardAspect.symbol}</span>
                <span>{aspect.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
          💡 Toca un aspecto para filtrar solo ese tipo
        </p>
      </div>

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
              className={`bg-gradient-to-br ${getCategoryColor(aspect.category)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
            >
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
