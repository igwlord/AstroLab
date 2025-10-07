import React, { useState } from 'react';
import { CELESTIAL_BODIES } from '../types/celestialBody';
import type { CelestialBody } from '../types/celestialBody';
import CelestialBodyModal from './CelestialBodyModal';

const CelestialBodiesGrid: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [filter, setFilter] = useState<'all' | 'shadow' | 'healer' | 'centaur' | 'transneptunian' | 'comet'>('all');

  const filteredBodies = filter === 'all' 
    ? CELESTIAL_BODIES 
    : CELESTIAL_BODIES.filter(body => body.category === filter);

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'shadow':
        return 'from-gray-900 to-red-900';
      case 'healer':
        return 'from-purple-600 to-violet-700';
      case 'centaur':
        return 'from-amber-700 to-red-800';
      case 'transneptunian':
        return 'from-indigo-800 to-purple-900';
      case 'comet':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 sm:gap-2">
          🌌 ¿Qué son los Otros Cuerpos Celestes?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          Más allá de los planetas tradicionales, existen otros cuerpos celestes que aportan información profunda 
          sobre aspectos específicos de la psique humana: <strong>Lilith</strong> (la sombra), <strong>Quirón</strong> (la 
          herida sanadora)<span className="hidden sm:inline">, los <strong>Centauros</strong> (catalizadores), los <strong>Transneptunianos</strong> (evolución 
          colectiva) y los <strong>Cometas</strong> (cambios súbitos)</span>.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 sm:justify-center px-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Todos ({CELESTIAL_BODIES.length})
        </button>
        <button
          onClick={() => setFilter('shadow')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'shadow'
              ? 'bg-gradient-to-r from-gray-900 to-red-900 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🌑 Sombra ({CELESTIAL_BODIES.filter(b => b.category === 'shadow').length})
        </button>
        <button
          onClick={() => setFilter('healer')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'healer'
              ? 'bg-gradient-to-r from-purple-600 to-violet-700 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🧙‍♂️ Sanador ({CELESTIAL_BODIES.filter(b => b.category === 'healer').length})
        </button>
        <button
          onClick={() => setFilter('centaur')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'centaur'
              ? 'bg-gradient-to-r from-amber-700 to-red-800 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🐎 Centauros ({CELESTIAL_BODIES.filter(b => b.category === 'centaur').length})
        </button>
        <button
          onClick={() => setFilter('transneptunian')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'transneptunian'
              ? 'bg-gradient-to-r from-indigo-800 to-purple-900 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🌌 Transnept. ({CELESTIAL_BODIES.filter(b => b.category === 'transneptunian').length})
        </button>
        <button
          onClick={() => setFilter('comet')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'comet'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          ☄️ Cometas ({CELESTIAL_BODIES.filter(b => b.category === 'comet').length})
        </button>
      </div>

      {/* Grid de Cuerpos Celestes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {filteredBodies.map((body) => (
          <button
            key={body.name}
            data-id={body.name.toLowerCase()}
            onClick={() => setSelectedBody(body)}
            className={`bg-gradient-to-br ${getCategoryGradient(body.category)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">{body.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-xs sm:text-sm">{body.name}</h3>
              <p className="text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">{body.chakra}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🌌 Categorías de Cuerpos Celestes
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌑</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Sombra:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Lo reprimido y la autonomía (Lilith)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🧙‍♂️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Sanador:</strong>
              <span className="text-gray-600 dark:text-gray-400"> La herida que sana (Quirón)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🐎</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Centauros:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Catalizadores de cambio (Pholus, Nessus)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌌</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Transneptunianos:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Evolución colectiva (Eris, Sedna, etc.)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CelestialBodyModal
        celestialBody={selectedBody!}
        isOpen={selectedBody !== null}
        onClose={() => setSelectedBody(null)}
      />
    </div>
  );
};

export default CelestialBodiesGrid;
