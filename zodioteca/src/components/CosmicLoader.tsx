import React, { useState, useEffect } from 'react';

interface CosmicLoaderProps {
  onComplete: () => void;
}

const LOADING_PHRASES = [
  { text: 'Sincronizando frecuencias planetarias', icon: '🪐', duration: 800 },
  { text: 'Conectando con el laboratorio cósmico', icon: '🔬', duration: 800 },
  { text: 'Uniendo constelaciones universales', icon: '✨', duration: 800 },
  { text: 'Calibrando energías astrales', icon: '🌟', duration: 700 },
  { text: 'Activando portal dimensional', icon: '🌀', duration: 700 },
];

const CosmicLoader: React.FC<CosmicLoaderProps> = ({ onComplete }) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentPhrase < LOADING_PHRASES.length) {
      const timer = setTimeout(() => {
        setCurrentPhrase(prev => prev + 1);
      }, LOADING_PHRASES[currentPhrase].duration);

      return () => clearTimeout(timer);
    } else {
      // Fade out antes de completar
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
      }, 300);

      return () => clearTimeout(fadeTimer);
    }
  }, [currentPhrase, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Fondo estrellado sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-900">
        {/* Estrellas sutiles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
        </div>

        {/* Efecto de nebulosa suave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent animate-pulse-slow"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Logo animado */}
        <div className="mb-8 animate-float">
          <div className="relative inline-block">
            <span className="text-8xl sm:text-9xl drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] animate-glow-pulse">
              🌙
            </span>
            <span className="absolute -top-4 -right-4 text-4xl sm:text-5xl animate-spin-slow">✨</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 tracking-wider mb-12 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-fadeIn">
          ASTRO LAB
        </h1>

        {/* Frases de carga */}
        <div className="h-24 sm:h-28 flex items-center justify-center">
          {LOADING_PHRASES.map((phrase, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-500 ${
                index === currentPhrase
                  ? 'opacity-100 translate-y-0 scale-100'
                  : index < currentPhrase
                  ? 'opacity-0 -translate-y-8 scale-95'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="flex items-center gap-4 justify-center">
                <span className="text-4xl sm:text-5xl animate-bounce-slow">
                  {phrase.icon}
                </span>
                <p className="text-xl sm:text-2xl md:text-3xl text-purple-200 font-light tracking-wide">
                  {phrase.text}
                  <span className="animate-pulse">...</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de progreso */}
        <div className="mt-12 w-full max-w-md mx-auto">
          <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden backdrop-blur-sm border border-purple-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              style={{
                width: `${((currentPhrase + 1) / LOADING_PHRASES.length) * 100}%`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Porcentaje */}
          <p className="text-purple-300 text-sm mt-3 font-medium">
            {Math.round(((currentPhrase + 1) / LOADING_PHRASES.length) * 100)}%
          </p>
        </div>

        {/* Partículas orbitales */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  animation: `orbit ${3 + i}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  style={{
                    transform: `translateX(${80 + i * 40}px)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CosmicLoader;
