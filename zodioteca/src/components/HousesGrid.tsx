import React, { useState } from 'react';
import { HOUSES } from '../types/house';
import type { House } from '../types/house';
import HouseModal from './HouseModal';

const HousesGrid: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'angular' | 'succedent' | 'cadent'>('all');

  const handleHouseClick = (house: House) => {
    setSelectedHouse(house);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedHouse(null), 300);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      angular: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
      succedent: 'from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700',
      cadent: 'from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700'
    };
    return colors[category as keyof typeof colors];
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      angular: '🔷',
      succedent: '🔶',
      cadent: '🔹'
    };
    return icons[category as keyof typeof icons];
  };

  const filteredHouses = selectedFilter === 'all' 
    ? HOUSES 
    : HOUSES.filter(h => h.category === selectedFilter);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Título e introducción */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
          Las 12 Casas Astrológicas
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
          Explora los escenarios de vida donde se desarrollan las energías planetarias.
          <span className="hidden sm:inline"> Cada casa representa un área específica de tu experiencia vital.</span>
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
          🏛️ <span className="hidden xs:inline">Todas </span>({HOUSES.length})
        </button>
        <button
          onClick={() => setSelectedFilter('angular')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'angular'
              ? 'bg-red-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
          }`}
        >
          🔷 <span className="hidden xs:inline">Angulares </span>({HOUSES.filter(h => h.category === 'angular').length})
        </button>
        <button
          onClick={() => setSelectedFilter('succedent')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'succedent'
              ? 'bg-green-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
          }`}
        >
          🔶 <span className="hidden xs:inline">Sucedentes </span>({HOUSES.filter(h => h.category === 'succedent').length})
        </button>
        <button
          onClick={() => setSelectedFilter('cadent')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            selectedFilter === 'cadent'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}
        >
          🔹 <span className="hidden xs:inline">Cadentes </span>({HOUSES.filter(h => h.category === 'cadent').length})
        </button>
      </div>

      {/* Grid de casas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {filteredHouses.map((house) => (
          <button
            key={house.id}
            data-id={house.number.toString()}
            onClick={() => handleHouseClick(house)}
            className={`
              group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6
              bg-gradient-to-br ${getCategoryColor(house.category)}
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
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold group-hover:scale-110 transition-transform duration-300">
                {house.number}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-center">{house.name}</div>
              <div className="text-[10px] sm:text-xs text-center opacity-90 line-clamp-2 hidden sm:block">{house.title}</div>
              <div className="text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                <span className="hidden sm:inline">{getCategoryIcon(house.category)} </span>{house.category === 'angular' ? 'Ang' : house.category === 'succedent' ? 'Suc' : 'Cad'}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda de categorías */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 md:mb-4 text-center">
          Clasificación de las Casas
        </h3>
        <div className="grid md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🔷</span>
            <span className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">Angulares</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Casas I, IV, VII, X - Acción e iniciativa
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🔶</span>
            <span className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300">Sucedentes</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Casas II, V, VIII, XI - Consolidación y recursos
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🔹</span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">Cadentes</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Casas III, VI, IX, XII - Aprendizaje y adaptación
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <HouseModal
        house={selectedHouse}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default HousesGrid;
