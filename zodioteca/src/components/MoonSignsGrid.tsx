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
          Todos ({MOON_SIGNS.length})
        </button>
        <button
          onClick={() => setFilter('fuego')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'fuego'
              ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🔥 Fuego ({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'fuego').length})
        </button>
        <button
          onClick={() => setFilter('tierra')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'tierra'
              ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🌱 Tierra ({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'tierra').length})
        </button>
        <button
          onClick={() => setFilter('aire')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'aire'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          💨 Aire ({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'aire').length})
        </button>
        <button
          onClick={() => setFilter('agua')}
          className={`px-4 py-2 rounded-full transition-all ${
            filter === 'agua'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          💧 Agua ({MOON_SIGNS.filter(m => m.element.toLowerCase() === 'agua').length})
        </button>
      </div>

      {/* Grid de Lunas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMoonSigns.map((moonSign) => (
          <button
            key={moonSign.sign}
            onClick={() => setSelectedMoonSign(moonSign)}
            className={`bg-gradient-to-br ${getElementColor(moonSign.element)} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-3`}
          >
            <span className="text-6xl">🌙</span>
            <div className="text-center">
              <h3 className="font-bold text-lg">Luna en {moonSign.sign}</h3>
              <p className="text-sm opacity-90">{moonSign.element}</p>
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
      {selectedMoonSign && (
        <MoonSignModal
          moonSign={selectedMoonSign}
          onClose={() => setSelectedMoonSign(null)}
        />
      )}
    </div>
  );
};

export default MoonSignsGrid;
