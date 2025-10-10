import React, { useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface FloatingMiniPlayerProps {
  isMobile?: boolean;
}

const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({ isMobile = false }) => {
  const { currentFrequency, isPlaying, toggle, next, previous } = useAudioPlayer();
  const [isExpanded, setIsExpanded] = useState(false);

  // No mostrar si no hay frecuencia seleccionada
  if (!currentFrequency) return null;

  // Versión mobile integrada en el menú (COMPACTA)
  if (isMobile) {
    return (
      <div className="mt-3 pt-3 border-t border-purple-500/30">
        <div 
          className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-purple-500/30 overflow-hidden"
        >
          {/* Brillo de fondo animado */}
          {isPlaying && (
            <div 
              className="absolute inset-0 opacity-15 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${currentFrequency.color.hex}66, transparent 80%)`,
              }}
            />
          )}

          <div className="relative z-10 p-2.5">
            {/* Header compacto */}
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
              >
                <span className="text-base">{currentFrequency.symbol}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs truncate">
                  {currentFrequency.name}
                </h3>
                <p className="text-purple-200 text-[10px]">
                  {currentFrequency.frequency} Hz
                </p>
              </div>

              {/* Indicador visual compacto */}
              {isPlaying && (
                <div className="flex items-center gap-0.5">
                  <div className="w-0.5 h-2 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                  <div className="w-0.5 h-3 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-0.5 h-2 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>

            {/* Controles compactos */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={previous}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all"
                aria-label="Frecuencia anterior"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button
                onClick={toggle}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95"
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
              </button>

              <button
                onClick={next}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all"
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
            width: isExpanded ? '280px' : '240px',
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
            {/* Header con símbolo del signo */}
            <div className="flex items-center gap-2 mb-2.5">
              <div 
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
              >
                <span className="text-lg drop-shadow-lg">{currentFrequency.symbol}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xs truncate">
                  {currentFrequency.name}
                </h3>
                <p className="text-purple-200 text-[10px]">
                  {currentFrequency.frequency} Hz
                </p>
              </div>

              {/* Botón expandir/colapsar */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-300 hover:text-white transition-colors p-0.5"
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

            {/* Indicador de reproducción */}
            {isPlaying && (
              <div className="mt-2 flex items-center justify-center gap-0.5">
                <div className="w-0.5 h-2 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0s' }}></div>
                <div className="w-0.5 h-3 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-0.5 h-4 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-0.5 h-3 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-0.5 h-2 bg-purple-300 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default FloatingMiniPlayer;
