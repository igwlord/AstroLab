import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface EphemerisLoadingScreenProps {
  onComplete?: () => void;
}

/**
 * 🌟 Loading Screen para carga de Swiss Ephemeris
 * 
 * Se muestra mientras se descarga y inicializa el archivo de efemérides (12 MB)
 * Proporciona feedback visual al usuario durante la carga inicial
 */
const EphemerisLoadingScreen: React.FC<EphemerisLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Inicializando...');

  useEffect(() => {
    // Simular progreso mientras carga
    const messages = [
      'Conectando con Swiss Ephemeris...',
      'Descargando datos de efemérides...',
      'Cargando posiciones planetarias...',
      'Inicializando cálculos astronómicos...',
      'Preparando calculadora astrológica...',
      '¡Casi listo!'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < messages.length) {
        setMessage(messages[currentStep]);
        setProgress((currentStep / messages.length) * 100);
      } else {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    }, 800); // Cambiar mensaje cada 800ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950">
      {/* Fondo con estrellas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-md w-full px-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Icono animado */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 animate-pulse"></div>
              <Loader2 className="relative w-16 h-16 text-purple-300 animate-spin" />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Cargando AstroLab
          </h2>

          {/* Mensaje */}
          <p className="text-purple-200 text-center mb-6 min-h-[1.5rem]">
            {message}
          </p>

          {/* Barra de progreso */}
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>

          {/* Porcentaje */}
          <div className="text-center mt-3 text-purple-300 text-sm font-medium">
            {Math.round(progress)}%
          </div>

          {/* Info adicional */}
          <div className="mt-6 text-center text-xs text-purple-300/70">
            ✨ Cargando datos astronómicos precisos
          </div>
        </div>
      </div>

      <style>{`
        .stars,
        .stars2,
        .stars3 {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .stars {
          background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+') repeat;
          animation: animateStars 50s linear infinite;
        }

        .stars2 {
          background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+PC9zdmc+') repeat;
          animation: animateStars 100s linear infinite;
        }

        .stars3 {
          background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IndoaXRlIi8+PC9zdmc+') repeat;
          animation: animateStars 150s linear infinite;
        }

        @keyframes animateStars {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </div>
  );
};

export default EphemerisLoadingScreen;
