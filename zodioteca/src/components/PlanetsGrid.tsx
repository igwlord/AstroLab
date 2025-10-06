import React, { useState } from 'react';
import { PLANETS } from '../types/planet';
import type { Planet } from '../types/planet';
import PlanetModal from './PlanetModal';

const PlanetsGrid: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'personal' | 'social' | 'transpersonal'>('all');

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlanet(null), 300);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
      social: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
      transpersonal: 'from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700'
    };
    return colors[category as keyof typeof colors];
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      personal: '⭐',
      social: '🌍',
      transpersonal: '✨'
    };
    return icons[category as keyof typeof icons];
  };

  const filteredPlanets = selectedFilter === 'all' 
    ? PLANETS 
    : PLANETS.filter(p => p.category === selectedFilter);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Título e introducción */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
          Los 10 Planetas Astrológicos
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
          Explora los arquetipos planetarios: su esencia, ritmo, chakra y frecuencia vibratoria.
          <span className="hidden sm:inline"> Haz clic en cualquier planeta para conocer su descripción completa y ejercicio holístico.</span>
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap px-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'all'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          🪐 <span className="hidden xs:inline">Todos </span>({PLANETS.length})
        </button>
        <button
          onClick={() => setSelectedFilter('personal')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'personal'
              ? 'bg-amber-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/30'
          }`}
        >
          ⭐ <span className="hidden xs:inline">Personales </span>({PLANETS.filter(p => p.category === 'personal').length})
        </button>
        <button
          onClick={() => setSelectedFilter('social')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'social'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}
        >
          🌍 <span className="hidden xs:inline">Sociales </span>({PLANETS.filter(p => p.category === 'social').length})
        </button>
        <button
          onClick={() => setSelectedFilter('transpersonal')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'transpersonal'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          ✨ <span className="hidden xs:inline">Transp. </span>({PLANETS.filter(p => p.category === 'transpersonal').length})
        </button>
      </div>

      {/* Grid de planetas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {filteredPlanets.map((planet) => (
          <button
            key={planet.id}
            onClick={() => handlePlanetClick(planet)}
            className={`
              group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6
              bg-gradient-to-br ${getCategoryColor(planet.category)}
              text-white shadow-lg hover:shadow-2xl
              transform hover:scale-105 transition-all duration-300
              cursor-pointer
            `}
          >
            {/* Patrón de fondo animado */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '15px 15px'
              }}></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light group-hover:scale-110 transition-transform duration-300">
                {planet.symbol}
              </div>
              <div className="text-xs sm:text-sm font-bold">{planet.name}</div>
              <div className="text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                <span className="hidden sm:inline">{getCategoryIcon(planet.category)} </span>{planet.rhythm}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda de categorías */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 md:mb-4 text-center">
          Clasificación Planetaria
        </h3>
        <div className="grid md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">⭐</span>
            <span className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300">Personales</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Identidad, emoción, mente, amor y acción
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🌍</span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">Sociales</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Expansión, estructura y contexto cultural
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">✨</span>
            <span className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300">Transpersonales</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Innovación, espiritualidad y transformación
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PlanetModal
        planet={selectedPlanet}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default PlanetsGrid;
