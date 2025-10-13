import React, { useEffect, useMemo, useRef, useState } from 'react';

interface EphemerisLoadingScreenProps {
  onComplete?: () => void;
  durationMs?: number;
  starCount?: number;
  showPercent?: boolean;
}

// Estilos CSS para las animaciones
const styles = `
  @keyframes breathe {
    0%, 100% {
      transform: scale(0.95);
      box-shadow: 
        0 0 40px 10px rgba(255, 223, 150, 0.4),
        0 0 70px 25px rgba(255, 200, 80, 0.3),
        inset 0 0 20px rgba(255, 230, 180, 0.5);
    }
    50% {
      transform: scale(1);
      box-shadow: 
        0 0 60px 15px rgba(255, 223, 150, 0.6),
        0 0 100px 40px rgba(255, 200, 80, 0.4),
        inset 0 0 20px rgba(255, 230, 180, 0.7);
    }
  }
  
  @keyframes backgroundPan {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes realisticFill {
    0% { width: 0%; }
    70% { width: 90%; }
    100% { width: 100%; }
  }

  @keyframes lensFlare {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 0.2;
    }
    80% {
      transform: scale(1.5) rotate(45deg);
      opacity: 0.1;
    }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes orbit {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(360deg); }
  }

  @keyframes solarFlare {
    0% { transform: rotate(0deg); opacity: 0.5; }
    25% { transform: rotate(15deg) scale(1.1); opacity: 0.75; }
    50% { transform: rotate(-10deg); opacity: 0.6; }
    100% { transform: rotate(0deg); opacity: 0.5; }
  }

  @keyframes epicBarShimmer {
    0% { background-position: 150% 0; }
    100% { background-position: -150% 0; }
  }

  @keyframes sunFlash {
    0% { transform: scale(1); filter: brightness(1); }
    30% { transform: scale(1.5); filter: brightness(2); box-shadow: 0 0 250px 100px rgba(255,255,255,0.8); }
    60% { transform: scale(3); filter: brightness(3); box-shadow: 0 0 400px 150px rgba(255,255,255,0.9); }
    100% { transform: scale(50); opacity: 0; filter: brightness(5); box-shadow: 0 0 600px 300px #fff; }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

/**
 * 🌟 Loading Screen para carga de Swiss Ephemeris
 * Versión optimizada con requestAnimationFrame y accesibilidad AAA
 */
const EphemerisLoadingScreen: React.FC<EphemerisLoadingScreenProps> = ({
  onComplete,
  durationMs = 5000,
  starCount = 200,
  showPercent = true
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [fadeIn, setFadeIn] = useState<boolean>(true);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const preferReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const messages = useMemo(
    () => [
      'Cargando nebulosas de partículas...',
      'Laboratorio de cartas astrales en progreso...',
      'Alineando constelaciones...',
      'Consultando a los astros...',
      'Preparando tu viaje cósmico...',
      'Sintonizando frecuencias estelares...'
    ],
    []
  );

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 1
    }));
  }, [starCount]);

  // Planetas con órbitas más alejadas y tamaños reducidos
  const planets = useMemo(() => [
    { 
      size: 20, 
      texture: 'radial-gradient(circle at 25% 25%, #f0b0b0, #d9a6a6, #8c5a5a, #5c3a3a)', 
      orbitSize: 2.8, 
      duration: '16s', 
      angle: 65,
      glow: '0 0 8px rgba(217, 166, 166, 0.4)'
    },
    { 
      size: 32, 
      texture: 'radial-gradient(circle at 30% 30%, #d9e9f5, #a6c2d9, #6a8ca8, #3a4a5c)', 
      orbitSize: 3.8, 
      duration: '23s', 
      delay: '-7s', 
      hasMoon: true, 
      angle: 60,
      glow: '0 0 10px rgba(166, 194, 217, 0.5)'
    },
    { 
      size: 16, 
      texture: 'radial-gradient(circle at 35% 35%, #dff0d9, #c2d9a6, #7a9c6a, #4a5c3a)', 
      orbitSize: 2.2, 
      duration: '11s', 
      delay: '-3s', 
      angle: 55,
      glow: '0 0 6px rgba(194, 217, 166, 0.3)'
    }
  ], []);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // Cargar fuente Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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

      if (elapsed >= safeDuration) {
        setProgress(100);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        // Iniciar fade out de 1000ms antes de completar
        setFadeOut(true);
        window.setTimeout(() => onComplete?.(), 1000);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (preferReduced) {
      setProgress(100);
      onComplete?.();
      return;
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs, messages, onComplete, preferReduced]);

  // Iniciar fade in después de montar (800ms suave)
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const ariaMessage = messages[messageIndex] || 'Iniciando...';

  return (
    <>
      <style>{styles}</style>
      <div
        role="status"
        aria-live="polite"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(170deg, #100f1c, #1a1433, #3c2a66, #1a1433)',
          backgroundSize: '200% 200%',
          overflow: 'hidden',
          fontFamily: "'Cinzel', serif",
          color: 'white',
          zIndex: 9999,
          opacity: fadeIn ? 0 : fadeOut ? 0 : 1,
          transition: fadeIn 
            ? 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)' 
            : fadeOut 
            ? 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1)' 
            : 'opacity 300ms ease',
          animation: 'backgroundPan 20s ease infinite',
          boxShadow: 'inset 0 0 15vw rgba(0,0,0,0.5)'
        }}
      >
        {/* Estrellas con parpadeo y tamaños variados */}
        {stars.map((s) => (
          <div
            key={`star-${s.id}`}
            aria-hidden
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              borderRadius: '50%',
              width: `${s.size}px`,
              height: `${s.size}px`,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: 0.7,
              animation: `twinkle ${s.duration}s ease-in-out infinite alternate ${s.delay}s`,
              boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,0.8)`
            }}
          />
        ))}

        {/* Contenedor del sistema solar responsive */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(300px, 40vw, 400px)',
            height: 'clamp(300px, 40vw, 400px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px',
            zIndex: 10
          }}
        >
          {/* Planetas en órbita con texturas y lunas */}
          {planets.map((planet, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: `calc(clamp(300px, 40vw, 400px) * ${planet.orbitSize / 4})`,
                height: `calc(clamp(300px, 40vw, 400px) * ${planet.orbitSize / 4})`,
                borderRadius: '50%',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${planet.angle}deg)`,
                animation: `orbit ${planet.duration} linear infinite`,
                animationDelay: planet.delay || '0s'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0px',
                  transform: 'translate(-50%, -50%)',
                  width: `calc(clamp(300px, 40vw, 400px) / 10 * ${planet.size / 20})`,
                  height: `calc(clamp(300px, 40vw, 400px) / 10 * ${planet.size / 20})`,
                  borderRadius: '50%',
                  background: planet.texture,
                  boxShadow: `${planet.glow}, inset 0 0 ${planet.size / 2}px rgba(0,0,0,0.4), inset ${planet.size / 4}px ${planet.size / 4}px ${planet.size / 3}px rgba(255,255,255,0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 3s ease-in-out infinite',
                  animationDelay: planet.delay || '0s'
                }}
              >
                {/* Luna orbitando el planeta */}
                {planet.hasMoon && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '250%',
                      height: '250%',
                      transformStyle: 'preserve-3d',
                      animation: 'orbit 7s linear infinite'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0px',
                        transform: 'translate(-50%, -50%)',
                        width: '4px',
                        height: '4px',
                        background: 'radial-gradient(circle, #e0e0e0, #888)',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* El Sol ÉPICO con efectos pulidos */}
          <div
            className={progress >= 100 ? 'sun-flash' : ''}
            style={{
              width: 'calc(clamp(300px, 40vw, 400px) / 3.5)',
              height: 'calc(clamp(300px, 40vw, 400px) / 3.5)',
              background: 'radial-gradient(circle at 35% 35%, #fff9e6, #ffde59, #ffb347, #ff8c1a)',
              borderRadius: '50%',
              position: 'absolute',
              animation: progress >= 100 ? 'sunFlash 2.5s forwards ease-in-out' : 'breathe 5s cubic-bezier(0.45, 0, 0.55, 1) infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              boxShadow: '0 0 40px rgba(255, 222, 89, 0.6), 0 0 80px rgba(255, 179, 71, 0.4), 0 0 120px rgba(255, 200, 80, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Capa de brillo interno suave */}
            <div
              style={{
                position: 'absolute',
                width: '70%',
                height: '70%',
                background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6), transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            {/* Destello principal expandido */}
            <div
              style={{
                position: 'absolute',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,250,230,0.4) 0%, rgba(255,230,190,0.2) 40%, rgba(255,215,0,0) 70%)',
                animation: 'lensFlare 10s ease-in-out infinite',
                animationDelay: '3s',
                pointerEvents: 'none'
              }}
            />
            {/* Llamarada solar sutil */}
            <div
              style={{
                position: 'absolute',
                top: '-15%',
                left: '-15%',
                width: '130%',
                height: '130%',
                background: 'radial-gradient(circle, transparent 55%, rgba(255,200,80,0.3) 75%, transparent 90%)',
                borderRadius: '50%',
                animation: 'solarFlare 7s ease-in-out infinite alternate'
              }}
            />
          </div>
        </div>

        {/* Texto y Barra de Carga Mejorada */}
        <div
          style={{
            zIndex: 10,
            textAlign: 'center',
            marginTop: 'calc(clamp(300px, 40vw, 400px) * 0.3)',
            minHeight: '50px'
          }}
        >
          <p
            role="status"
            aria-live="polite"
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
              letterSpacing: '0.35rem',
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 0 10px rgba(255, 223, 150, 0.8), 0 0 20px rgba(255, 200, 80, 0.5), 0 0 30px rgba(138, 106, 184, 0.4)',
              transition: 'all 0.5s ease-in-out',
              textTransform: 'uppercase',
              fontWeight: '600',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            {ariaMessage}
          </p>

          {/* Barra de progreso estilo constelación MEJORADA */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '4px',
              margin: '35px auto 0 auto'
            }}
          >
            {/* Línea de fondo con brillo */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(138, 106, 184, 0.4), rgba(255, 223, 150, 0.3), rgba(138, 106, 184, 0.4), transparent)',
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: '0 0 8px rgba(138, 106, 184, 0.3)'
              }}
            />
            {/* Línea de progreso ÉPICA con gradiente animado */}
            <div
              style={{
                position: 'absolute',
                width: `${Math.min(100, progress)}%`,
                height: '3px',
                background: 'linear-gradient(90deg, #8a6ab8, #b896d4, #ffde59, #fff)',
                boxShadow: '0 0 15px rgba(255, 222, 89, 1), 0 0 25px rgba(184, 150, 212, 0.8), 0 0 35px rgba(138, 106, 184, 0.6)',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '3px',
                filter: 'brightness(1.2)'
              }}
            />
            {/* Punto brillante al final (cometa) - ALINEADO */}
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(100, progress)}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fff 0%, #ffde59 50%, #b896d4 100%)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.9), 0 0 25px rgba(255, 222, 89, 0.7), 0 0 35px rgba(184, 150, 212, 0.5)',
                transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Estela del cometa */}
              <div
                style={{
                  position: 'absolute',
                  right: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '30px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(184, 150, 212, 0.6), rgba(255, 222, 89, 0.8))',
                  borderRadius: '2px',
                  filter: 'blur(0.5px)'
                }}
              />
            </div>
            {/* Partículas estelares MEJORADAS */}
            {[0.15, 0.35, 0.55, 0.75, 0.95].map((pos, i) => (
              progress >= pos * 100 && (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${pos * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #fff, #ffde59)',
                    boxShadow: '0 0 12px rgba(255, 222, 89, 1), 0 0 18px rgba(184, 150, 212, 0.6)',
                    animation: 'twinkle 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              )
            ))}
          </div>

          {showPercent && (
            <div
              style={{
                marginTop: '20px',
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: '700',
                textShadow: '0 0 15px rgba(255, 222, 89, 0.9), 0 0 25px rgba(184, 150, 212, 0.6)',
                letterSpacing: '0.1rem',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              {Math.round(progress)}%
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EphemerisLoadingScreen;
