import React, { useState } from 'react';
import { useAudioPlayer } from '../context/useAudioPlayer';

interface FloatingMiniPlayerProps {
  isMobile?: boolean;
}

// Función para obtener emoji de fase lunar según volumen
const getMoonPhase = (volume: number): string => {
  if (volume === 0) return '🌑'; // Luna nueva
  if (volume <= 0.25) return '🌒'; // Creciente
  if (volume <= 0.5) return '🌓'; // Cuarto creciente
  if (volume <= 0.75) return '🌔'; // Gibosa creciente
  return '🌕'; // Luna llena
};

const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({ isMobile = false }) => {
  const { currentFrequency, isPlaying, toggle, next, previous, volume, setVolume } = useAudioPlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  // No mostrar si no hay frecuencia seleccionada
  if (!currentFrequency) return null;

  // Versión mobile integrada en el menú (COMPACTA)
  if (isMobile) {
    return (
      <div className="mt-3 pt-3 border-t border-purple-500/30 mx-0">
        <div 
          className={`relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-purple-500/30 overflow-hidden transition-all duration-500 w-full ${
            isPlaying ? 'p-5' : 'p-3'
          }`}
        >
          {/* Imagen de fondo del signo zodiacal - Tatuaje sutil */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none"
            style={{
              filter: 'blur(0.5px)',
            }}
          >
            <span 
              className="text-[180px] leading-none select-none"
              style={{
                color: currentFrequency.color.hex,
              }}
            >
              {currentFrequency.symbol}
            </span>
          </div>

          {/* Brillo de fondo animado */}
          {isPlaying && (
            <div 
              className="absolute inset-0 opacity-15 animate-pulse pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${currentFrequency.color.hex}66, transparent 80%)`,
              }}
            />
          )}

          <div className="relative z-10">
            {/* Indicador visual arriba a la derecha - 3 capas de ondas */}
            {isPlaying && (
              <div className="absolute top-0 right-0 w-10 h-6 flex items-center justify-center">
                {/* Capa 1: Rápida */}
                <div className="absolute flex items-center gap-0.5">
                  <div className="w-0.5 h-3 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-4 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.15s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-3 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.3s', animationDuration: '1s' }}></div>
                </div>
                {/* Capa 2: Color del signo */}
                <div className="absolute flex items-center justify-center">
                  <div className="w-0.5 h-4 rounded-full animate-wave" style={{ animationDelay: '0.2s', animationDuration: '1.5s', background: currentFrequency.color.hex }}></div>
                </div>
              </div>
            )}

            {/* Header compacto */}
            <div className={`flex items-center justify-center ${isPlaying ? 'mb-3' : 'mb-2'}`}>
              <div className="text-center">
                <h3 className="text-white font-bold text-base">
                  {currentFrequency.name}
                </h3>
                <p className="text-purple-200 text-sm">
                  {currentFrequency.frequency} Hz
                </p>
              </div>
            </div>

            {/* Barra de volumen con fases lunares - MÓVIL */}
            <div className={`px-0 ${isPlaying ? 'mb-3' : 'mb-2'}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl flex-shrink-0 transition-transform duration-300" style={{ transform: `scale(${0.8 + volume * 0.4})` }}>
                  {getMoonPhase(volume)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="flex-1 h-2 rounded-full appearance-none bg-white/20 outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${currentFrequency.color.hex} 0%, ${currentFrequency.color.hex} ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                  aria-label="Volumen"
                />
                <span className="text-purple-200 text-xs font-medium w-10 text-right">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            {/* Controles compactos */}
            <div className={`flex items-center justify-between w-full ${isPlaying ? 'px-0' : 'px-0'}`}>
              <button
                onClick={previous}
                className={`rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all ${
                  isPlaying ? 'w-11 h-11' : 'w-9 h-9'
                }`}
                aria-label="Frecuencia anterior"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button
                onClick={toggle}
                className={`rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                  isPlaying ? 'w-16 h-16' : 'w-12 h-12'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg className={`text-white ${isPlaying ? 'w-8 h-8' : 'w-6 h-6'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className={`text-white ml-0.5 ${isPlaying ? 'w-8 h-8' : 'w-6 h-6'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={next}
                className={`rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all ${
                  isPlaying ? 'w-11 h-11' : 'w-9 h-9'
                }`}
                aria-label="Siguiente frecuencia"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versión desktop flotante (COMPACTA)
  return (
    <>
      {/* Mini Player - Desktop */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50 animate-slideUp">
        <div 
          className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden"
          style={{
            width: isExpanded ? '320px' : '280px',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Decoración de fondo - Estrellas */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-2 left-3 text-yellow-200 text-xs">✦</div>
            <div className="absolute top-2 right-3 text-purple-200 text-xs">✧</div>
          </div>

          {/* Brillo de fondo animado cuando está reproduciendo */}
          {isPlaying && (
            <div 
              className="absolute inset-0 opacity-20 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${currentFrequency.color.hex}44, transparent 70%)`,
              }}
            />
          )}

          <div className="relative z-10 p-3">
            {/* Botón expandir/colapsar - posición absoluta arriba derecha */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-2 right-2 text-purple-300 hover:text-white transition-colors p-0.5 z-20"
              aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                {isExpanded ? (
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                )}
              </svg>
            </button>

            {/* Header centrado con símbolo y nombre */}
            <div className="flex flex-col items-center text-center mb-2.5 pt-1">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl mb-2 ring-2 ring-white/20"
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
              >
                <span className="text-2xl drop-shadow-2xl filter brightness-110">{currentFrequency.symbol}</span>
              </div>
              
              <h3 className="text-white font-bold text-sm mb-0.5">
                {currentFrequency.name}
              </h3>
              <p className="text-purple-200 text-xs font-medium">
                {currentFrequency.frequency} Hz
              </p>
            </div>

            {/* Info adicional expandida */}
            {isExpanded && (
              <div className="mb-2.5 p-1.5 bg-white/5 rounded-lg border border-white/10">
                <p className="text-purple-200 text-[10px]">
                  <span className="text-purple-300">🔮</span> {currentFrequency.chakra.name.split(' ')[0]}
                </p>
                <p className="text-purple-200 text-[10px] mt-0.5">
                  <span className="text-purple-300">🌟</span> {currentFrequency.element}
                </p>
              </div>
            )}

            {/* Barra de volumen con fases lunares - DESKTOP */}
            <div className="mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <span 
                  className="text-xl flex-shrink-0 transition-all duration-300 drop-shadow-lg" 
                  style={{ 
                    transform: `scale(${0.8 + volume * 0.4})`,
                    filter: `drop-shadow(0 0 ${volume * 8}px ${currentFrequency.color.hex})`
                  }}
                >
                  {getMoonPhase(volume)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="flex-1 h-2 rounded-full appearance-none outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${currentFrequency.color.hex} 0%, ${currentFrequency.color.hex} ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                  aria-label="Volumen"
                />
                <span className="text-purple-200 text-xs font-medium w-10 text-right">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-center gap-2.5">
              {/* Botón anterior */}
              <button
                onClick={previous}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Frecuencia anterior"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              {/* Botón play/pause principal */}
              <button
                onClick={toggle}
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400"
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}

                {/* Pulso animado cuando está reproduciendo */}
                {isPlaying && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        boxShadow: `0 0 25px ${currentFrequency.color.hex}`,
                      }}
                    ></div>
                  </>
                )}
              </button>

              {/* Botón siguiente - CORREGIDO */}
              <button
                onClick={next}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Siguiente frecuencia"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}>
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
            </div>

            {/* Visualización de ondas mejorada - 3 capas */}
            {isPlaying && (
              <div className="mt-2 relative h-6 flex items-center justify-center overflow-hidden">
                {/* Capa 1: Ondas rápidas (alta frecuencia) */}
                <div className="absolute flex items-center justify-center gap-0.5">
                  <div className="w-0.5 h-2 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-3 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.1s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-4 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-3 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.3s', animationDuration: '1s' }}></div>
                  <div className="w-0.5 h-2 bg-purple-300/60 rounded-full animate-wave" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
                </div>
                {/* Capa 2: Ondas medias (media frecuencia) */}
                <div className="absolute flex items-center justify-center gap-1">
                  <div className="w-0.5 h-3 rounded-full animate-wave" style={{ animationDelay: '0.2s', animationDuration: '1.5s', background: currentFrequency.color.hex }}></div>
                  <div className="w-0.5 h-5 rounded-full animate-wave" style={{ animationDelay: '0.4s', animationDuration: '1.5s', background: currentFrequency.color.hex }}></div>
                  <div className="w-0.5 h-4 rounded-full animate-wave" style={{ animationDelay: '0.6s', animationDuration: '1.5s', background: currentFrequency.color.hex }}></div>
                </div>
                {/* Capa 3: Ondas lentas (baja frecuencia) */}
                <div className="absolute flex items-center justify-center gap-2">
                  <div className="w-0.5 h-4 bg-white/40 rounded-full animate-wave" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                  <div className="w-0.5 h-5 bg-white/40 rounded-full animate-wave" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default FloatingMiniPlayer;
