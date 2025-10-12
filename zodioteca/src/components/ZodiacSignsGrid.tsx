import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ZODIAC_SIGNS } from '../types/zodiacSign';
import type { ZodiacSign } from '../types/zodiacSign';
import ZodiacModal from './ZodiacModal';
import FavoriteToggleButton from './FavoriteToggleButton';

const ZodiacSignsGrid: React.FC = () => {
  const location = useLocation();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Auto-abrir modal si viene desde favoritos
  useEffect(() => {
    const state = location.state as { autoOpen?: string; fromFavorites?: boolean } | null;
    if (state?.autoOpen && state?.fromFavorites) {
      // Buscar el signo por targetId (formato: "aries", "taurus", etc.)
      const sign = ZODIAC_SIGNS.find(s => s.id.toLowerCase() === state.autoOpen!.toLowerCase());
      if (sign) {
        setSelectedSign(sign);
        setIsModalOpen(true);
        
        // Limpiar el state para evitar re-abrir
        window.history.replaceState({}, document.title);
        
        // Scroll al elemento
        setTimeout(() => {
          const element = document.querySelector(`[data-id="${state.autoOpen}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [location.state]);

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
      aire: '🌀',
      agua: '💧'
    };
    return icons[element as keyof typeof icons];
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Título e introducción */}
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-2">
          Los 12 Signos del Zodíaco
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-3 sm:px-4">
          Explora la sabiduría de cada signo zodiacal: su arquetipo, elemento, chakra y frecuencia vibratoria.
          <span className="hidden sm:inline"> Haz clic en cualquier signo para conocer su descripción completa y ejercicio holístico.</span>
        </p>
      </div>

      {/* Grid de signos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {ZODIAC_SIGNS.map((sign) => (
          <div
            key={sign.id}
            className="relative group"
          >
            {/* Botón de Favorito - Sistema v2 */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20 opacity-80 hover:opacity-100 transition-opacity">
              <FavoriteToggleButton
                item={{
                  type: 'glossary-sign',
                  scope: 'global',
                  title: sign.name,
                  icon: sign.symbol,
                  route: `/glossary?categoria=signs#sign-${sign.id}`,
                  targetId: sign.id,
                  tags: ['Signos', sign.element, sign.modality],
                  pinned: false,
                }}
                size="sm"
                variant="amber"
              />
            </div>
            
            <button
              data-id={sign.id}
              onClick={() => handleSignClick(sign)}
              className={`
                w-full h-full relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6
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
              <div className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2">
                <div className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                  {sign.symbol}
                </div>
                <div className="text-xs sm:text-sm font-bold">{sign.name}</div>
                <div className="text-[10px] sm:text-xs opacity-90 hidden sm:block">{sign.dateRange.split('–')[0].trim()}</div>
                <div className="text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                  {getElementIcon(sign.element)} <span className="hidden sm:inline">{sign.element}</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Leyenda de elementos */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 md:mb-4 text-center">
          Los 4 Elementos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🔥</span>
            <span className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">Fuego</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Impulso, acción, entusiasmo
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🌱</span>
            <span className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300">Tierra</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Sustancia, cuerpo, constancia
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">🌀</span>
            <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">Aire</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
              Ideas, comunicación, perspectiva
            </span>
          </div>
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 md:space-y-2 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl">
            <span className="text-2xl sm:text-3xl">💧</span>
            <span className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300">Agua</span>
            <span className="text-[10px] sm:text-xs text-center text-gray-600 dark:text-gray-400 hidden sm:block">
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
