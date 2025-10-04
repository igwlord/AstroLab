import React, { useState } from 'react';
import { ASPECTS } from '../types/aspect';
import type { Aspect } from '../types/aspect';
import AspectModal from './AspectModal';

const AspectsGrid: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<Aspect | null>(null);
  const [filter, setFilter] = useState<'all' | 'major' | 'minor' | 'creative'>('all');

  const filteredAspects = filter === 'all' 
    ? ASPECTS 
    : ASPECTS.filter(aspect => aspect.category === filter);

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
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Todos ({ASPECTS.length})
        </button>
        <button
          onClick={() => setFilter('major')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'major'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Mayores ({ASPECTS.filter(a => a.category === 'major').length})
        </button>
        <button
          onClick={() => setFilter('minor')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'minor'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Menores ({ASPECTS.filter(a => a.category === 'minor').length})
        </button>
        <button
          onClick={() => setFilter('creative')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'creative'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Creativos ({ASPECTS.filter(a => a.category === 'creative').length})
        </button>
      </div>

      {/* Grid de Aspectos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredAspects.map((aspect) => (
          <button
            key={aspect.name}
            onClick={() => setSelectedAspect(aspect)}
            className={`bg-gradient-to-br ${getCategoryColor(aspect.category)} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-3`}
          >
            <span className="text-6xl">{aspect.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-lg">{aspect.name}</h3>
              <p className="text-sm opacity-90">{aspect.angle}</p>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">
                {getCategoryName(aspect.category)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
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
