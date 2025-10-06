import React from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';
import SolarPlayer from './SolarPlayer';

interface ZodiacWheelProps {
  frequencies: ZodiacFrequency[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ZodiacWheel: React.FC<ZodiacWheelProps> = ({ frequencies, selectedId, onSelect }) => {
  // Obtener la frecuencia seleccionada
  const selectedFrequency = frequencies.find(f => f.id === selectedId) || null;

  // Calcular la posición de cada signo en el círculo (empezando desde Aries en la posición de las 9)
  const getPosition = (index: number) => {
    // Empezamos en 180° (izquierda) y vamos en sentido antihorario
    const angle = 180 - (index * 30); // 360° / 12 signos = 30° por signo
    const radian = (angle * Math.PI) / 180;
    const radius = 42; // Porcentaje del radio del círculo

    return {
      left: `${50 + radius * Math.cos(radian)}%`,
      top: `${50 - radius * Math.sin(radian)}%`,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      {/* Círculo exterior con degradado */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 shadow-2xl"></div>
      
      {/* Anillos concéntricos */}
      <div className="absolute inset-[15%] rounded-full border-2 border-purple-200/30 dark:border-purple-700/30"></div>
      <div className="absolute inset-[30%] rounded-full border-2 border-purple-200/20 dark:border-purple-700/20"></div>
      
      {/* Centro con reproductor solar */}
      <div className="absolute inset-[35%]">
        <SolarPlayer selectedFrequency={selectedFrequency} />
      </div>

      {/* Signos zodiacales posicionados en círculo */}
      {frequencies.map((frequency, index) => {
        const position = getPosition(index);
        const isSelected = selectedId === frequency.id;

        return (
          <button
            key={frequency.id}
            onClick={() => onSelect(frequency.id)}
            aria-label={`Seleccionar frecuencia de ${frequency.name}, ${frequency.frequency} Hz`}
            aria-pressed={isSelected}
            className={`
              absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
              rounded-full flex flex-col items-center justify-center
              transition-all duration-300 cursor-pointer
              focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2
              ${isSelected 
                ? 'scale-110 z-20 shadow-2xl ring-4 ring-white dark:ring-gray-900' 
                : 'hover:scale-105 hover:z-10 hover:shadow-xl'
              }
            `}
            style={{
              ...position,
              backgroundColor: frequency.color.hex,
              boxShadow: isSelected 
                ? `0 0 30px ${frequency.color.hex}` 
                : `0 4px 15px ${frequency.color.hex}40`,
            }}
          >
            {/* Símbolo del signo */}
            <span className="text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-lg">
              {frequency.symbol}
            </span>
            
            {/* Nombre del signo (siempre visible) */}
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white mt-0.5 drop-shadow">
              {frequency.name}
            </span>

            {/* Halo animado que respira cuando está seleccionado - detrás del círculo */}
            {isSelected && (
              <>
                <div 
                  className="absolute inset-[-25%] rounded-full animate-breathe pointer-events-none -z-10"
                  style={{
                    backgroundColor: frequency.color.hex,
                    filter: 'blur(20px)',
                    opacity: 0.5,
                  }}
                ></div>
                <div 
                  className="absolute inset-[-15%] rounded-full animate-breathe pointer-events-none -z-10"
                  style={{
                    backgroundColor: frequency.color.hex,
                    filter: 'blur(12px)',
                    opacity: 0.3,
                    animationDelay: '0.5s',
                  }}
                ></div>
              </>
            )}
          </button>
        );
      })}

      {/* Líneas divisorias sutiles (opcional) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => {
          const angle = 180 - (i * 30);
          const radian = (angle * Math.PI) / 180;
          const startRadius = 35;
          const endRadius = 48;
          
          return (
            <line
              key={i}
              x1={`${50 + startRadius * Math.cos(radian)}%`}
              y1={`${50 - startRadius * Math.sin(radian)}%`}
              x2={`${50 + endRadius * Math.cos(radian)}%`}
              y2={`${50 - endRadius * Math.sin(radian)}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-purple-400 dark:text-purple-600"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ZodiacWheel;
