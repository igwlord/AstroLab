import React from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';
import SolarPlayer from './SolarPlayer';

// Símbolos zodiacales EXACTOS de NatalChartWheelPro
const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

interface ZodiacWheelProps {
  frequencies: ZodiacFrequency[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  autoPlay?: boolean;
}

const ZodiacWheel: React.FC<ZodiacWheelProps> = ({ frequencies, selectedId, onSelect, autoPlay = false }) => {
  // Obtener la frecuencia seleccionada
  const selectedFrequency = frequencies.find(f => f.id === selectedId) || null;

  // Calcular la posición de cada signo en el círculo (empezando desde Aries a las 12:00)
  const getPosition = (index: number) => {
    // Empezamos en 90° (arriba, 12:00) y vamos en sentido horario
    const angle = 90 - (index * 30); // 360° / 12 signos = 30° por signo
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
        <SolarPlayer selectedFrequency={selectedFrequency} autoPlay={autoPlay} />
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
              group
              ${isSelected 
                ? 'scale-110 z-20 shadow-2xl ring-4 ring-white dark:ring-gray-900' 
                : 'hover:scale-105 hover:z-10 hover:shadow-xl'
              }
            `}
            style={{
              ...position,
              backgroundColor: frequency.color.hex,
              boxShadow: isSelected 
                ? `0 0 40px ${frequency.color.hex}, 0 0 80px ${frequency.color.hex}80` 
                : `0 4px 15px ${frequency.color.hex}40`,
            }}
          >
            {/* Anillo exterior con gradiente - NUEVO */}
            <div 
              className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
              style={{
                background: `conic-gradient(from 0deg, ${frequency.color.hex}00, ${frequency.color.hex}ff, ${frequency.color.hex}00)`,
                animation: isSelected ? 'spin 4s linear infinite' : 'none',
              }}
            ></div>

            {/* Círculo interno con brillo - NUEVO */}
            <div 
              className={`absolute inset-[4px] rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-black/20' : 'bg-black/10'}`}
              style={{
                backdropFilter: 'blur(2px)',
              }}
            >
              {/* Símbolo SVG con MISMO estilo que NatalChartWheelPro */}
              <div className="flex flex-col items-center justify-center gap-0.5">
                <svg 
                  viewBox="0 0 100 100" 
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 transition-all duration-300 ${isSelected ? 'scale-110' : ''}`}
                  style={{
                    filter: isSelected 
                      ? `drop-shadow(0 0 8px ${frequency.color.hex}) drop-shadow(0 0 16px white) drop-shadow(0 4px 8px rgba(0,0,0,0.5))` 
                      : `drop-shadow(0 0 4px ${frequency.color.hex}) drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
                  }}
                >
                  <text
                    x="50"
                    y="50"
                    fontSize="60"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: '"Noto Sans Symbols 2", "Noto Sans Symbols", "Segoe UI Symbol", Arial, sans-serif',
                      fontWeight: 400,
                      WebkitTextStrokeWidth: isSelected ? '2px' : '1px',
                      WebkitTextStrokeColor: 'white',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    {SIGN_SYMBOLS[index]}
                  </text>
                </svg>
                
                {/* Nombre del signo con mejor contraste - MÁS CERCA */}
                <span 
                  className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold transition-all duration-300 ${isSelected ? 'text-white scale-105' : 'text-white/90'}`}
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {frequency.name}
                </span>
              </div>
            </div>

            {/* Partículas flotantes cuando está seleccionado - NUEVO */}
            {isSelected && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full animate-ping pointer-events-none"
                    style={{
                      backgroundColor: 'white',
                      top: `${30 + Math.cos(i * Math.PI / 4) * 40}%`,
                      left: `${30 + Math.sin(i * Math.PI / 4) * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s',
                      filter: `drop-shadow(0 0 4px ${frequency.color.hex})`,
                    }}
                  />
                ))}
              </>
            )}

            {/* Halo animado que respira - MEJORADO */}
            {isSelected && (
              <>
                <div 
                  className="absolute inset-[-30%] rounded-full animate-breathe pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle, ${frequency.color.hex}80 0%, ${frequency.color.hex}40 50%, transparent 80%)`,
                    filter: 'blur(20px)',
                  }}
                ></div>
                <div 
                  className="absolute inset-[-20%] rounded-full animate-breathe pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle, ${frequency.color.hex} 0%, ${frequency.color.hex}60 40%, transparent 70%)`,
                    filter: 'blur(15px)',
                    animationDelay: '0.5s',
                  }}
                ></div>
                <div 
                  className="absolute inset-[-10%] rounded-full animate-pulse pointer-events-none -z-10"
                  style={{
                    backgroundColor: frequency.color.hex,
                    filter: 'blur(8px)',
                    opacity: 0.6,
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
