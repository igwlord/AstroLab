import React, { useState } from 'react';
import { MOON_SIGNS } from '../types/moonSign';
import type { MoonSign } from '../types/moonSign';
import MoonSignModal from './MoonSignModal';

const MoonSignsGrid: React.FC = () => {
  const [selectedMoonSign, setSelectedMoonSign] = useState<MoonSign | null>(null);
  const [filter, setFilter] = useState<'all' | 'fuego' | 'tierra' | 'aire' | 'agua'>('all');

  const filteredMoonSigns = filter === 'all' 
    ? MOON_SIGNS 
    : MOON_SIGNS.filter(moon => moon.element.toLowerCase() === filter);

  const getElementColor = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fuego':
        return 'from-red-500 to-orange-600';
      case 'tierra':
        return 'from-green-600 to-emerald-700';
      case 'aire':
        return 'from-yellow-400 to-amber-500';
      case 'agua':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-purple-600 to-pink-600';
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
          <span className="hidden xs:inline">Todos </span>({MOON_SIGNS.length})
        </button>
        <button
          onClick={() => setFilter('fuego')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'fuego'
              ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🔥 <span className="hidden xs:inline">Fuego </span>({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'fuego').length})
        </button>
        <button
          onClick={() => setFilter('tierra')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'tierra'
              ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🌱 <span className="hidden xs:inline">Tierra </span>({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'tierra').length})
        </button>
        <button
          onClick={() => setFilter('aire')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'aire'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          💨 <span className="hidden xs:inline">Aire </span>({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'aire').length})
        </button>
        <button
          onClick={() => setFilter('agua')}
          className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${
            filter === 'agua'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          💧 <span className="hidden xs:inline">Agua </span>({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'agua').length})
        </button>
      </div>

      {/* Grid de Lunas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {filteredMoonSigns.map((moonSign) => (
          <button
            key={moonSign.sign}
            onClick={() => setSelectedMoonSign(moonSign)}
            className={`bg-gradient-to-br ${getElementColor(moonSign.element)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">🌙</span>
            <div className="text-center">
              <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">Luna en {moonSign.sign}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm opacity-90">{moonSign.element}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🌙 Elementos Lunares
        </h4>
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-500 to-orange-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Fuego:</strong> Pasión, impulso, acción
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-600 to-emerald-700"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Tierra:</strong> Estabilidad, seguridad
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-amber-500"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Aire:</strong> Comunicación, mente
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-cyan-600"></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>Agua:</strong> Emoción, intuición
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <MoonSignModal
        moonSign={selectedMoonSign}
        isOpen={selectedMoonSign !== null}
        onClose={() => setSelectedMoonSign(null)}
      />
    </div>
  );
};

export default MoonSignsGrid;
