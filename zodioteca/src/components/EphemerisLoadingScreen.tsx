import React, { useEffect, useMemo, useRef, useState } from 'react';

interface EphemerisLoadingScreenProps {
  onComplete?: () => void;
  durationMs?: number;
  starCount?: number;
  showPercent?: boolean;
}

/**
 * 🌟 Loading Screen para carga de Swiss Ephemeris
 * Versión optimizada con SVG custom, requestAnimationFrame y accesibilidad AAA
 */
const EphemerisLoadingScreen: React.FC<EphemerisLoadingScreenProps> = ({
  onComplete,
  durationMs = 5000,
  starCount = 25,
  showPercent = true
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [phase, setPhase] = useState<number>(0);
  const [fadeIn, setFadeIn] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const preferReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const messages = useMemo(
    () => [
      'Cargando laboratorio de estrellas...',
      'Calibrando telescopio...',
      'Cartografiando nebulosas...',
      'Alineando efemérides...'
    ],
    []
  );

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      scale: 0.8 + Math.random() * 0.6, // Mucho más pequeñas
      delay: Math.random() * 8,
      duration: 3 + Math.random() * 5, // Más lentas
      opacity: 0.2 + Math.random() * 0.5 // Más sutiles
    }));
  }, [starCount]);

  // Partículas orbitando alrededor de la tarjeta
  const orbitParticles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      delay: i * 0.5,
      size: 3 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.4
    }));
  }, []);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    startRef.current = startTime;

    const safeDuration = Math.max(600, durationMs);
    const messagesCount = messages.length;
    const messageSegment = safeDuration / messagesCount;

    const step = (now: number) => {
      const elapsed = now - (startRef.current || startTime);
      const pct = Math.min(1, elapsed / safeDuration);
      setProgress(pct * 100);

      const idx = Math.min(messagesCount - 1, Math.floor(elapsed / messageSegment));
      setMessageIndex(idx);

      const phaseSmooth = Math.min(1, elapsed / safeDuration);
      setPhase(phaseSmooth);

      if (elapsed >= safeDuration) {
        setProgress(100);
        setPhase(1);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        // Iniciar fade out antes de completar
        setFadeOut(true);
        window.setTimeout(() => onComplete?.(), 500);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (preferReduced) {
      setProgress(100);
      setPhase(1);
      onComplete?.();
      return;
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, messages, onComplete, preferReduced]);

  // Iniciar fade in después de montar
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const phaseToMask = (p: number) => 1 - p;
  const ariaMessage = messages[messageIndex] || 'Iniciando...';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex items-center justify-center min-h-screen bg-gradient-to-b from-[#050514] via-[#0b0a1c] to-[#060419] text-white font-sans transition-opacity duration-500 ${
        fadeIn ? 'opacity-0' : fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* ELIMINADAS las partículas ✨ gigantes que se movían rápido */}

        {stars.map((s) => (
          <div
            key={`star-${s.id}`}
            aria-hidden
            style={{
              position: 'absolute',
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${Math.max(1.5, s.scale)}px`, // Más pequeñas: 1.5-1.9px
              height: `${Math.max(1.5, s.scale)}px`,
              borderRadius: '50%',
              background: 'rgba(255,245,210,0.85)',
              boxShadow: '0 0 4px rgba(255,230,180,0.4)', // Menos brillo
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center gap-6 px-6">
        <div className="relative flex items-center justify-center" style={{ minHeight: '200px' }}>
          {/* Luna - Centrada en el fondo */}
          <div
            aria-hidden
            className="absolute flex items-center justify-center"
            style={{ 
              width: 160, 
              height: 160, 
              zIndex: 1
            }}
          >
            <svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luna">
              <defs>
                <radialGradient id="moonGrad" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#fffbee" />
                  <stop offset="55%" stopColor="#f2ecd9" />
                  <stop offset="100%" stopColor="#e7e2d5" />
                </radialGradient>

                <filter id="halo" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <mask id="moonMask">
                  <rect x="0" y="0" width="200" height="200" fill="white" />
                  <circle
                    id="terminator"
                    cx={200 * phaseToMask(phase)}
                    cy="100"
                    r="70"
                    fill="black"
                    style={{ transition: 'cx 400ms linear' }}
                  />
                </mask>
              </defs>

              <circle cx="100" cy="100" r="78" fill="url(#moonGrad)" filter="url(#halo)" opacity="0.14" />

              <g mask="url(#moonMask)">
                <circle cx="100" cy="100" r="68" fill="url(#moonGrad)" />
                <circle cx="120" cy="80" r="6" fill="#e0d9c8" opacity="0.35" />
                <circle cx="87" cy="118" r="4.2" fill="#dfd8c6" opacity="0.28" />
                <circle cx="68" cy="85" r="3" fill="#e6e0cf" opacity="0.22" />
              </g>
            </svg>

            <div
              aria-hidden
              style={{
                position: 'absolute',
                width: 240,
                height: 240,
                borderRadius: '50%',
                filter: 'blur(18px)',
                background: 'radial-gradient(circle, rgba(243,216,135,0.12), transparent 45%)',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Línea de conexión sutil entre telescopio y luna */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '120px',
              height: '2px',
              marginLeft: '-20px',
              marginTop: '-10px',
              background: 'linear-gradient(90deg, transparent, rgba(162,224,255,0.2), rgba(162,224,255,0.1))',
              transform: 'rotate(35deg)',
              filter: 'blur(1px)',
              animation: 'beamPulse 3s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          {/* Telescopio SVG - Delante, apuntando hacia la luna */}
          <div
            aria-hidden
            className="absolute select-none"
            style={{
              bottom: '-20px',
              right: '-30px',
              width: 110,
              height: 110,
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.6))',
              zIndex: 10
            }}
          >
            <div style={{ 
              width: 110, 
              height: 110, 
              animation: 'telescopePoint 4200ms ease-in-out infinite',
              transformOrigin: 'center center'
            }}>
              <svg viewBox="0 0 120 120" width="110" height="110" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="telTitle telDesc">
                <title id="telTitle">Telescopio</title>
                <desc id="telDesc">Telescopio apuntando hacia la luna</desc>
                <defs>
                  <linearGradient id="metalGrad" x1="0" x2="1">
                    <stop offset="0%" stopColor="#a7b0c6" />
                    <stop offset="50%" stopColor="#dfe6f4" />
                    <stop offset="100%" stopColor="#8f95a8" />
                  </linearGradient>
                  <linearGradient id="tubeGrad" x1="0" x2="1">
                    <stop offset="0%" stopColor="#2b2f4a" />
                    <stop offset="100%" stopColor="#121225" />
                  </linearGradient>
                  <radialGradient id="lensGrad" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#dff7ff" />
                    <stop offset="60%" stopColor="#a2e0ff" />
                    <stop offset="100%" stopColor="#5aa6d6" />
                  </radialGradient>
                  <linearGradient id="glowBeam" x1="0" x2="1">
                    <stop offset="0%" stopColor="rgba(223,247,255,0)" />
                    <stop offset="30%" stopColor="rgba(162,224,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(90,166,214,0)" />
                  </linearGradient>
                </defs>

                {/* Rayo de luz del telescopio hacia la luna */}
                <line 
                  x1="25" y1="28" x2="-15" y2="15" 
                  stroke="url(#glowBeam)" 
                  strokeWidth="6" 
                  opacity="0.4"
                  strokeLinecap="round"
                  style={{ animation: 'beamPulse 2s ease-in-out infinite' }}
                />

                {/* Tripod legs */}
                <g transform="translate(15,35)">
                  <path d="M10 55 L26 10" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M55 55 L39 10" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M32 55 L68 18" stroke="url(#metalGrad)" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Mount */}
                <g transform="translate(25,20)">
                  <ellipse cx="35" cy="16" rx="14" ry="5" fill="rgba(0,0,0,0.35)" />
                  <rect x="30" y="5" width="10" height="22" rx="3" fill="url(#metalGrad)" />
                </g>

                {/* Tube - Rotado para apuntar hacia arriba-izquierda (hacia la luna) */}
                <g transform="translate(10,10) rotate(-35 50 35)">
                  <rect x="20" y="20" width="80" height="20" rx="9" fill="url(#tubeGrad)" />
                  {/* lens */}
                  <ellipse cx="100" cy="30" rx="11" ry="9" fill="url(#lensGrad)" />
                  {/* subtle reflection on tube */}
                  <path d="M30 28 C45 21, 65 21, 85 28" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" fill="none" />
                </g>

                {/* small accent lights */}
                <circle cx="46" cy="32" r="2" fill="#ffd98a" opacity="0.95" />
                <circle cx="50" cy="36" r="1.4" fill="#fff" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl relative">
          {/* Partículas orbitando alrededor de la tarjeta */}
          {orbitParticles.map((particle) => (
            <div
              key={`orbit-${particle.id}`}
              aria-hidden
              className="absolute"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,230,180,0.9), rgba(255,200,100,0.6))',
                boxShadow: '0 0 8px rgba(255,230,180,0.6)',
                opacity: particle.opacity,
                animation: `orbitCard 8s linear ${particle.delay}s infinite`,
                top: '50%',
                left: '50%',
                marginTop: '-1.5px',
                marginLeft: '-1.5px'
              }}
            />
          ))}
          
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h3 className="text-center text-lg font-semibold" style={{ color: '#fff7e8' }}>
              Iniciando AstroLab
            </h3>

            <p
              className="text-center mt-3 min-h-[1.25rem] font-medium"
              style={{ color: 'rgba(242,233,216,0.95)' }}
            >
              {ariaMessage}
            </p>

            <div className="mt-5">
              <div
                aria-hidden
                className="relative w-full h-2 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-200 ease-out"
                  style={{
                    width: `${Math.min(100, progress)}%`,
                    boxShadow: '0 0 14px rgba(249,230,160,0.45)'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #f3d887, #f9e6b0)'
                    }}
                  />
                </div>
              </div>

              {showPercent && (
                <div className="text-center mt-3 text-sm font-medium" style={{ color: '#f3d887' }}>
                  {Math.round(progress)}%
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-xs" style={{ color: 'rgba(242,233,216,0.72)' }}>
              Noche clara • Detalles precisos • Cielo en sintonía
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }

        @keyframes telescopePoint {
          0%, 100% { 
            transform: rotate(-3deg) translateY(0px); 
          }
          50% { 
            transform: rotate(1deg) translateY(-2px); 
          }
        }

        @keyframes beamPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        @keyframes orbitCard {
          0% {
            transform: rotate(0deg) translateX(280px) translateY(0px) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: rotate(90deg) translateX(280px) translateY(0px) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: rotate(180deg) translateX(280px) translateY(0px) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: rotate(270deg) translateX(280px) translateY(0px) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: rotate(360deg) translateX(280px) translateY(0px) scale(1);
            opacity: 0.8;
          }
        }

        @media (max-width: 640px) {
          @keyframes orbitCard {
            0% {
              transform: rotate(0deg) translateX(160px) translateY(0px) scale(1);
              opacity: 0.8;
            }
            25% {
              transform: rotate(90deg) translateX(160px) translateY(0px) scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: rotate(180deg) translateX(160px) translateY(0px) scale(1);
              opacity: 0.8;
            }
            75% {
              transform: rotate(270deg) translateX(160px) translateY(0px) scale(1.2);
              opacity: 0.9;
            }
            100% {
              transform: rotate(360deg) translateX(160px) translateY(0px) scale(1);
              opacity: 0.8;
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default EphemerisLoadingScreen;
