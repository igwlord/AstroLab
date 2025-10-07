import React, { useState } from 'react';
import { RELATIONAL_TECHNIQUES } from '../types/relational';
import type { RelationalTechnique } from '../types/relational';
import RelationalModal from './RelationalModal';

const RelationalGrid: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<RelationalTechnique | null>(null);
  const [filter, setFilter] = useState<'all' | 'main' | 'additional'>('all');

  const filteredTechniques = RELATIONAL_TECHNIQUES.filter(tech => 
    filter === 'all' || tech.category === filter
  );

  const getTechniqueGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Sinastría': 'from-pink-500 to-rose-600',
      'Carta Compuesta': 'from-purple-500 to-violet-600',
      'Carta Davison': 'from-indigo-500 to-purple-700',
      'Astrocartografía Relacional': 'from-blue-500 to-cyan-600',
      'Tránsitos a la Compuesta/Davison': 'from-amber-500 to-orange-600',
      'Sinastría Kármica': 'from-violet-600 to-fuchsia-700'
    };
    return gradients[name] || 'from-pink-500 to-purple-600';
  };

  const mainCount = RELATIONAL_TECHNIQUES.filter(t => t.category === 'main').length;
  const additionalCount = RELATIONAL_TECHNIQUES.filter(t => t.category === 'additional').length;

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-pink-900 dark:text-pink-200 flex items-center gap-1.5 sm:gap-2">
          💞 ¿Qué es la Astrología Relacional?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
          La astrología relacional estudia cómo <strong>interactúan las cartas natales</strong> de dos o más personas. 
          <span className="hidden sm:inline">Su objetivo no es "predecir si la relación es buena o mala", sino <strong>entender las dinámicas</strong>, 
          las áreas de atracción, los desafíos y las oportunidades de crecimiento en el vínculo.</span>
        </p>
        <div className="bg-white/50 dark:bg-gray-800/50 p-2 sm:p-3 md:p-4 rounded-lg mt-2 sm:mt-3">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">🌟 Resumen Comparativo</h4>
          <ul className="text-[10px] sm:text-xs md:text-sm space-y-0.5 sm:space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Sinastría:</strong> Dinámica persona a persona</li>
            <li><strong>Compuesta:</strong> Identidad de la pareja</li>
            <li className="hidden sm:list-item"><strong>Davison:</strong> Propósito y destino compartido</li>
            <li className="hidden sm:list-item"><strong>Astrocartografía:</strong> Dónde la pareja se activa</li>
          </ul>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-2 sm:flex-wrap px-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Todas ({RELATIONAL_TECHNIQUES.length})
        </button>
        <button
          onClick={() => setFilter('main')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'main'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Principales ({mainCount})
        </button>
        <button
          onClick={() => setFilter('additional')}
          className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${
            filter === 'additional'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Complement. ({additionalCount})
        </button>
      </div>

      {/* Grid de Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {filteredTechniques.map((technique) => (
          <button
            key={technique.name}
            data-id={technique.name.toLowerCase()}
            onClick={() => setSelectedTechnique(technique)}
            className={`bg-gradient-to-br ${getTechniqueGradient(technique.name)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 text-left`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">{technique.symbol}</span>
            <div className="text-center w-full">
              <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight">{technique.name}</h3>
              <p className="text-[10px] sm:text-xs opacity-90 mt-1 sm:mt-2 line-clamp-2">{technique.description}</p>
            </div>
            <span className="text-[10px] sm:text-xs bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full mt-auto">
              {technique.category === 'main' ? 'Principal' : 'Complementaria'}
            </span>
          </button>
        ))}
      </div>

      {/* Ejercicio Holístico General */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg border-2 border-purple-300 dark:border-purple-700">
        <h3 className="text-xl font-semibold mb-3 text-purple-900 dark:text-purple-200 flex items-center gap-2">
          🧘‍♂️ Ejercicio Holístico General para Relaciones
        </h3>
        <ol className="space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>1.</strong> Sentarse frente a frente y tomar las manos.</li>
          <li><strong>2.</strong> Respirar al unísono 3 minutos.</li>
          <li><strong>3.</strong> Cada uno dice en voz alta: <em>"En ti me reconozco, en ti me transformo"</em>.</li>
          <li><strong>4.</strong> Visualizar un círculo dorado que envuelve a ambos, protegiendo y nutriendo el vínculo.</li>
        </ol>
      </div>

      {/* Leyenda de Técnicas */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          📚 Técnicas de Astrología Relacional
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">💫</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Sinastría:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Comparación directa entre cartas</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔮</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Carta Compuesta:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Puntos medios (entidad propia)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌌</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Carta Davison:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Punto medio real (destino)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Astrocartografía:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Lugares favorables</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">⏰</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Tránsitos:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Ciclos relacionales</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔗</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Sinastría Kármica:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Vínculos del alma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RelationalModal
        technique={selectedTechnique}
        isOpen={selectedTechnique !== null}
        onClose={() => setSelectedTechnique(null)}
      />
    </div>
  );
};

export default RelationalGrid;
