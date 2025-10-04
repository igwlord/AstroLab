import React, { useState } from 'react';
import { ZODIAC_SIGNS } from '../types/zodiacSign';
import type { ZodiacSign } from '../types/zodiacSign';
import ZodiacModal from './ZodiacModal';

const ZodiacSignsGrid: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignClick = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSign(null), 300);
  };

  const getElementColor = (element: string) => {
    const colors = {
      fuego: 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
      tierra: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      aire: 'from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500',
      agua: 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
    };
    return colors[element as keyof typeof colors];
  };

  const getElementIcon = (element: string) => {
    const icons = {
      fuego: '🔥',
      tierra: '🌱',
      aire: '💨',
      agua: '💧'
    };
    return icons[element as keyof typeof icons];
  };

  return (
    <div className="space-y-8">
      {/* Título e introducción */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Los 12 Signos del Zodíaco
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explora la sabiduría de cada signo zodiacal: su arquetipo, elemento, chakra y frecuencia vibratoria.
          Haz clic en cualquier signo para conocer su descripción completa y ejercicio holístico.
        </p>
      </div>

      {/* Grid de signos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {ZODIAC_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => handleSignClick(sign)}
            className={`
              group relative overflow-hidden rounded-2xl p-6
              bg-gradient-to-br ${getElementColor(sign.element)}
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
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {sign.symbol}
              </div>
              <div className="text-sm font-bold">{sign.name}</div>
              <div className="text-xs opacity-90">{sign.dateRange.split('–')[0].trim()}</div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                {getElementIcon(sign.element)} {sign.element}
              </div>
            </div>

            {/* Indicador hover */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm">
                Ver más →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda de elementos */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 text-center">
          Los 4 Elementos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl">
            <span className="text-3xl">🔥</span>
            <span className="font-bold text-red-700 dark:text-red-300">Fuego</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">
              Impulso, acción, entusiasmo
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
            <span className="text-3xl">🌱</span>
            <span className="font-bold text-green-700 dark:text-green-300">Tierra</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">
              Sustancia, cuerpo, constancia
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <span className="text-3xl">💨</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">Aire</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">
              Ideas, comunicación, perspectiva
            </span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
            <span className="text-3xl">💧</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300">Agua</span>
            <span className="text-xs text-center text-gray-600 dark:text-gray-400">
              Emoción, intuición, empatía
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ZodiacModal
        sign={selectedSign}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ZodiacSignsGrid;
