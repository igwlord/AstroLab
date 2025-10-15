import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';

interface PlanGenerationLoaderProps {
  onComplete: () => void;
}

interface Planet {
  radius: number;
  speed: number;
  angle: number;
  size: number;
  color: string;
}

const PlanGenerationLoader: FC<PlanGenerationLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const planetsRef = useRef<Planet[]>([
    { radius: 75, speed: 0.015, angle: Math.random() * Math.PI * 2, size: 12, color: '#4a90e2' },
    { radius: 125, speed: 0.010, angle: Math.random() * Math.PI * 2, size: 22, color: '#f5a623' },
    { radius: 175, speed: 0.007, angle: Math.random() * Math.PI * 2, size: 18, color: '#7ed321' },
    { radius: 225, speed: 0.005, angle: Math.random() * Math.PI * 2, size: 25, color: '#ff00ff' }
  ]);

  const phrases = [
    'Analizando tu carta natal...',
    'Calculando posiciones planetarias...',
    'Identificando áreas de crecimiento...',
    'Seleccionando ejercicios personalizados...',
    'Organizando tu plan de 21 días...'
  ];

  useEffect(() => {
    // Progreso visual más lento (8 segundos para dar tiempo a la carga real)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Esperar 2 segundos extra después de llegar al 100%
          setTimeout(onComplete, 2000);
          return 100;
        }
        return prev + 0.78; // 100 / (8000ms / 62.5ms) = 0.78% por tick
      });
    }, 62.5);

    // Cambiar frases cada segundo
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 1000);

    // Animación de órbitas
    const animateOrbits = () => {
      planetsRef.current = planetsRef.current.map(planet => ({
        ...planet,
        angle: planet.angle + planet.speed
      }));
      animationFrameRef.current = requestAnimationFrame(animateOrbits);
    };
    animateOrbits();

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete, phrases.length]);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0a000a, #1c0028)',
        boxShadow: 'inset 0 0 350px 120px rgba(0,0,0,0.85)'
      }}
    >
      {/* Sol central */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '60px',
          height: '60px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ffee88',
          animation: 'sun-breath 2.2s infinite alternate cubic-bezier(0.2, 0.8, 0.3, 1)',
          zIndex: 4
        }} 
      />

      {/* Planetas orbitando */}
      {planetsRef.current.map((planet, i) => {
        const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
        const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
        const x = centerX + planet.radius * Math.cos(planet.angle) - planet.size / 2;
        const y = centerY + planet.radius * Math.sin(planet.angle) - planet.size / 2;
        
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
              backgroundColor: planet.color,
              left: `${x}px`,
              top: `${y}px`,
              boxShadow: `0 0 10px ${planet.color}, 0 0 15px ${planet.color}, inset 0 0 6px rgba(255,180,255,0.8)`,
              animation: i === 3 ? 'pulse-magenta 2.5s infinite ease-in-out alternate' : i === 1 ? 'pulse-s2 2.8s infinite alternate ease-in-out' : 'blinka 2.5s infinite ease-in-out alternate',
              zIndex: 5
            }}
          />
        );
      })}

      {/* Contenido flotante - SIN cuadrado que tape */}
      <div 
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center px-6"
        style={{ zIndex: 10, maxWidth: '600px', width: '100%' }}
      >
        {/* Título */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Creando tu Plan
        </h2>

        {/* Barra de progreso */}
        <div className="space-y-3">
          <div className="flex justify-end text-sm text-white/60 font-medium">
            <span>{Math.round(progress)}%</span>
          </div>
          <div 
            className="relative h-3 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(3px)'
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8e2de2, #4a00e0)',
                boxShadow: '0 0 10px rgba(142, 45, 226, 0.5)'
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: 'shimmer 2s infinite' }}
              />
            </div>
          </div>
        </div>

        {/* Frase cambiante debajo de la barra */}
        <p 
          className="text-white/60 text-sm mt-4"
          style={{ animation: 'fade-in 0.5s ease-in' }}
        >
          {phrases[currentPhrase]}
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes sun-breath {
          from { box-shadow: 0 0 28px #fffb00, 0 0 10px yellow inset; }
          to { box-shadow: 0 0 38px #fffcd0, 0 0 15px #fff5cc inset; }
        }
        @keyframes blinka {
          0% { opacity: 0.6; filter: brightness(0.9); }
          100% { opacity: 1; filter: brightness(1.1); }
        }
        @keyframes pulse-s2 {
          from {
            box-shadow: 0 0 5px rgba(100,200,255,0.4), 0 0 8px rgba(100,200,255,0.3), inset 0 0 3px rgba(150,220,255,0.5);
            opacity: 0.7;
            filter: brightness(0.9);
          }
          to {
            box-shadow: 0 0 10px rgba(120,220,255,0.7), 0 0 15px rgba(120,220,255,0.6), inset 0 0 5px rgba(180,240,255,0.8);
            opacity: 1;
            filter: brightness(1.15);
          }
        }
        @keyframes pulse-magenta {
          from {
            box-shadow: 0 0 8px #ff00ff, 0 0 12px #ff00ff, inset 0 0 4px rgba(255,180,255,0.7);
            opacity: 0.7;
            filter: brightness(0.9);
          }
          to {
            box-shadow: 0 0 12px #ff00ff, 0 0 18px #ff00ff, inset 0 0 7px rgba(255,200,255,0.9);
            opacity: 1;
            filter: brightness(1.15);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PlanGenerationLoader;
