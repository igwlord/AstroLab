import React, { useState, useRef, useEffect } from 'react';
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
  
  // Estados para el drag & drop (solo PC)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDragHint, setShowDragHint] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Cargar posición guardada del localStorage y mostrar hint si es primera vez
  useEffect(() => {
    const savedPosition = localStorage.getItem('miniPlayerPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Mostrar hint solo la primera vez
      const hasSeenHint = localStorage.getItem('miniPlayerDragHintSeen');
      if (!hasSeenHint) {
        setShowDragHint(true);
        localStorage.setItem('miniPlayerDragHintSeen', 'true');
        setTimeout(() => setShowDragHint(false), 4000);
      }
    }
  }, []);

  // Guardar posición en localStorage
  const savePosition = (newPosition: { x: number; y: number }) => {
    localStorage.setItem('miniPlayerPosition', JSON.stringify(newPosition));
  };

  // Iniciar arrastre - Área amplia de selección
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Solo excluir elementos específicos que necesitan interacción directa
    const isPlayButton = target.closest('[aria-label="Pausar"], [aria-label="Reproducir"]');
    const isVolumeSlider = target.closest('input[type="range"]');

    // Si es el botón de play o el slider de volumen, permitir la interacción normal
    if (isPlayButton || isVolumeSlider) {
      return;
    }

    // Para cualquier otro elemento, iniciar arrastre
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Mover durante el arrastre
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Permitir movimiento libre por toda la página (sin límites)
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        savePosition(position);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  // No mostrar si no hay frecuencia seleccionada
  if (!currentFrequency) return null;

  // Versión mobile integrada en el menú (COMPACTA)
  if (isMobile) {
    return (
      <div className="mt-3 pt-3 border-t border-purple-500/30 mx-0">
        <div 
          className={`relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-purple-500/30 overflow-hidden transition-all duration-500 w-full ${
            isPlaying ? 'p-5 animate-pulse' : 'p-3'
          }`}
          style={{
            boxShadow: isPlaying 
              ? `0 0 20px ${currentFrequency.color.hex}20, 0 0 40px ${currentFrequency.color.hex}10, 0 0 60px ${currentFrequency.color.hex}05, inset 0 0 20px ${currentFrequency.color.hex}05`
              : undefined,
          }}
        >
          {/* Imagen de fondo del signo zodiacal - Tatuaje sutil */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none z-0"
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
              className="absolute inset-0 opacity-10 animate-pulse pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${currentFrequency.color.hex}33, transparent 80%)`,
              }}
            />
          )}

          <div className="relative z-10">
            {/* Indicador visual arriba a la derecha - 3 capas de ondas */}
            {isPlaying && (
              <div className="absolute top-0 right-0 w-10 h-6 flex items-center justify-center z-20">
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

  // Versión desktop flotante (COMPACTA Y ARRASTRABLE)
  return (
    <>
      {/* Mini Player - Desktop */}
      <div 
        ref={playerRef}
        className="hidden md:block fixed z-50 animate-slideUp"
        style={{
          left: position.x === 0 && position.y === 0 ? 'auto' : `${position.x}px`,
          top: position.x === 0 && position.y === 0 ? 'auto' : `${position.y}px`,
          right: position.x === 0 && position.y === 0 ? '24px' : 'auto',
          bottom: position.x === 0 && position.y === 0 ? '24px' : 'auto',
        }}
      >
        {/* Hint de arrastre (solo primera vez) */}
        {showDragHint && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-bounce z-50">
            ✨ Arrástrame para moverme
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600"></div>
          </div>
        )}
        
        <div 
          className={`relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-purple-500/30 overflow-hidden ${
            isDragging ? 'scale-105 shadow-3xl ring-2 ring-purple-400/50' : ''
          }`}
          style={{
            width: '280px',
            transition: isDragging ? 'none' : 'all 0.3s ease',
            cursor: isDragging ? 'grabbing' : 'grab',
            boxShadow: isPlaying 
              ? `0 0 20px ${currentFrequency.color.hex}15, 0 0 40px ${currentFrequency.color.hex}08, 0 0 60px ${currentFrequency.color.hex}03, inset 0 0 20px ${currentFrequency.color.hex}03`
              : undefined,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Decoración de fondo - Estrellas */}
          <div className="absolute inset-0 opacity-15 z-0">
            <div className="absolute top-2 left-3 text-yellow-200 text-xs">✦</div>
            <div className="absolute top-2 right-3 text-purple-200 text-xs">✧</div>
          </div>

          {/* Brillo de fondo animado cuando está reproduciendo */}
          {isPlaying && (
            <div 
              className="absolute inset-0 opacity-12 animate-pulse pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${currentFrequency.color.hex}33, transparent 70%)`,
              }}
            />
          )}

          <div className="relative z-10 px-3 pb-3 pt-6">
            {/* Barra de agarre mejorada (drag handle) - Más visible y amplia */}
            <div 
              className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center opacity-60 hover:opacity-80 transition-opacity cursor-grab active:cursor-grabbing z-20"
              onMouseDown={handleMouseDown}
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

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
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all focus:outline-none"
                aria-label="Frecuencia anterior"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              {/* Botón play/pause principal */}
              <button
                onClick={toggle}
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all focus:outline-none"
                style={{
                  background: `linear-gradient(135deg, ${currentFrequency.color.hex}ee, ${currentFrequency.color.hex}99)`,
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                onMouseDown={(e) => e.stopPropagation()}
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

              {/* Botón siguiente - CORREGIDO */}
              <button
                onClick={next}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all focus:outline-none"
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
