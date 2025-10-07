import React, { useState, useRef, useEffect } from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';

interface SolarPlayerProps {
  selectedFrequency: ZodiacFrequency | null;
  autoPlay?: boolean;
}

const SolarPlayer: React.FC<SolarPlayerProps> = ({ selectedFrequency, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pausar y resetear cuando cambia la frecuencia
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }

    // Auto-reproducir si se indica
    if (autoPlay && selectedFrequency && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn('Auto-play blocked by browser:', err);
        });
      }, 500); // Pequeño delay para asegurar que el audio está listo
    }
  }, [selectedFrequency, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current || !selectedFrequency) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Audio element */}
      {selectedFrequency && (
        <audio
          ref={audioRef}
          src={selectedFrequency.audioFile}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Rayos del sol (8 rayos) */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 bg-gradient-to-t from-yellow-400 to-transparent transition-all duration-300 ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          style={{
            height: isPlaying ? '35%' : '25%',
            transform: `rotate(${i * 45}deg) translateY(-50%)`,
            transformOrigin: 'bottom center',
            opacity: isPlaying ? 0.8 : 0.4,
          }}
        />
      ))}

      {/* Círculo del sol */}
      <button
        onClick={togglePlay}
        disabled={!selectedFrequency}
        aria-label={selectedFrequency 
          ? `${isPlaying ? 'Pausar' : 'Reproducir'} frecuencia de ${selectedFrequency.name}, ${selectedFrequency.frequency} Hz`
          : 'Selecciona un signo para reproducir su frecuencia'
        }
        className={`
          relative z-10 w-full h-full rounded-full
          flex flex-col items-center justify-center
          transition-all duration-300 cursor-pointer
          focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-offset-2
          ${selectedFrequency 
            ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 hover:from-yellow-400 hover:via-yellow-500 hover:to-orange-500 shadow-lg hover:shadow-xl' 
            : 'bg-gradient-to-br from-gray-300 to-gray-400 cursor-not-allowed'
          }
          ${isPlaying ? 'scale-110 shadow-2xl' : 'scale-100'}
        `}
      >
        {/* Icono de play/pause */}
        <div className="text-white drop-shadow-lg mb-1">
          {!selectedFrequency ? (
            <span className="text-3xl sm:text-4xl md:text-5xl">✨</span>
          ) : isPlaying ? (
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        {/* Texto */}
        <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white drop-shadow">
          {selectedFrequency ? selectedFrequency.name : 'Frecuencias'}
        </p>
        
        {selectedFrequency && (
          <p className="text-[7px] sm:text-[8px] md:text-[9px] text-white/90 drop-shadow">
            {selectedFrequency.frequency} Hz
          </p>
        )}

        {/* Pulso de ondas cuando está reproduciendo - más lento y pausado */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ripple"></div>
            <div 
              className="absolute inset-0 rounded-full animate-ripple-slow"
              style={{
                boxShadow: `0 0 40px ${selectedFrequency?.color.hex || '#FCD34D'}`,
                animationDelay: '1s',
              }}
            ></div>
          </>
        )}
      </button>

      {/* Partículas flotantes cuando está reproduciendo */}
      {isPlaying && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-ping"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default SolarPlayer;
