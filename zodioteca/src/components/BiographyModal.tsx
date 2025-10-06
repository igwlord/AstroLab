import React, { useEffect } from 'react';

interface BiographyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BiographyModal: React.FC<BiographyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-fadeIn"
      style={{ padding: '1rem' }}
      onClick={onClose}
    >
      {/* Fondo oscuro sólido con estrellas animadas */}
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl">
        {/* Estrellas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
        
        {/* Efecto de nebulosa */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/30 via-indigo-600/10 to-transparent animate-pulse-slow"></div>
      </div>

      {/* Modal Content */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-purple-900/95 via-indigo-900/95 to-purple-950/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.5)] border-2 border-purple-400/50 overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: 'auto', marginBottom: 'auto' }}
      >
        {/* Contenedor con scroll interno */}
        <div>
          {/* Header con efectos */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-purple-900 to-purple-900/95 backdrop-blur-md border-b border-purple-400/50 p-4 sm:p-6">
            <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <span className="text-4xl sm:text-5xl md:text-6xl animate-float drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                  🌙
                </span>
                <span className="absolute -top-2 -right-2 text-xl sm:text-2xl animate-spin-slow">✨</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 tracking-wider drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                  ASTRO LAB
                </h2>
                <p className="text-xs sm:text-sm text-purple-300/90 italic tracking-wide mt-1">
                  "Donde el cielo se convierte en guía"
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 sm:p-3 rounded-full bg-purple-800/50 hover:bg-purple-700/70 border border-purple-400/30 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido de la biografía */}
        <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-gradient-to-b from-black/40 via-purple-950/40 to-black/40">
          {/* Sección 1 */}
          <div className="animate-slideInUp bg-purple-950/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-purple-500/20" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start space-x-3 sm:space-x-4 group">
              <span className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">✨</span>
              <div>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
                  <span className="font-bold text-amber-300">Astro Lab es la fusión de estrellas, frecuencias y coaching.</span>
                  <br className="hidden sm:block" />
                  Un laboratorio cósmico creado para que cada astrólog@, buscador o alma curiosa descubra una forma{' '}
                  <span className="text-yellow-300 font-semibold">más integral de leer las cartas</span>: una mirada que combina astrología, coaching ontológico y sabiduría holística{' '}
                  <span className="inline-block animate-bounce-slow">🜃💫</span>
                </p>
              </div>
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center justify-center space-x-2 opacity-50">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="text-xl sm:text-2xl animate-pulse">⭐</span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>

          {/* Sección 2 */}
          <div className="animate-slideInUp bg-purple-950/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-purple-500/20" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start space-x-3 sm:space-x-4 group">
              <span className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">🌌</span>
              <div>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
                  <span className="font-bold text-amber-300">Nació de mi pasión por la tecnología, el cosmos y las trayectorias de los astros.</span>
                  <br className="hidden sm:block" />
                  Desde siempre me fascinó cómo los planetas dibujan patrones invisibles que también vibran dentro de nosotros. En Astro Lab esos códigos celestes se traducen en experiencias, herramientas y conocimiento para acompañar procesos de transformación profunda.
                </p>
              </div>
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center justify-center space-x-2 opacity-50">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="text-xl sm:text-2xl animate-pulse">🌟</span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>

          {/* Sección 3 */}
          <div className="animate-slideInUp bg-purple-950/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-purple-500/20" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start space-x-3 sm:space-x-4 group">
              <span className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">🪐</span>
              <div>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
                  <span className="font-bold text-amber-300">Aquí la astrología se convierte en un lenguaje de conciencia.</span>
                  <br className="hidden sm:block" />
                  Cada carta es una red de energía, una ecuación de alma y propósito. El objetivo no es solo interpretar el cielo, sino{' '}
                  <span className="text-yellow-300 font-semibold">activar tu frecuencia, comprender tus ciclos y expandir tu propio universo interior</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Separador decorativo */}
          <div className="flex items-center justify-center space-x-2 opacity-50">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="text-xl sm:text-2xl animate-pulse">💫</span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>

          {/* Sección 4 */}
          <div className="animate-slideInUp bg-purple-950/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-purple-500/20" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start space-x-3 sm:space-x-4 group">
              <span className="text-3xl sm:text-4xl md:text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">🔮</span>
              <div>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed font-light">
                  <span className="font-bold text-amber-300">Astro Lab no es solo un sitio. Es un espacio de exploración, conexión y evolución.</span>
                  <br className="hidden sm:block" />
                  Un punto donde la ciencia y la espiritualidad se encuentran para recordarte algo simple y eterno:
                </p>
              </div>
            </div>
          </div>

          {/* Frase final destacada */}
          <div className="animate-slideInUp" style={{ animationDelay: '0.5s' }}>
            <div className="relative mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-800/40 via-indigo-800/40 to-purple-900/40 border-2 border-amber-400/40 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              {/* Decoración de esquinas */}
              <div className="absolute -top-3 -left-3 text-2xl sm:text-3xl animate-pulse">✨</div>
              <div className="absolute -top-3 -right-3 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute -bottom-3 -left-3 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
              <div className="absolute -bottom-3 -right-3 text-2xl sm:text-3xl animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
              
              <div className="text-center space-y-3">
                <span className="text-3xl sm:text-4xl md:text-5xl block animate-float">🌠</span>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 italic leading-relaxed tracking-wide">
                  "El universo no está fuera de vos,<br className="hidden sm:block" /> está latiendo adentro."
                </p>
              </div>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="flex justify-center items-center space-x-2 pt-4 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
            <span className="text-xl sm:text-2xl animate-bounce-slow">🌙</span>
            <span className="text-xl sm:text-2xl animate-bounce-slow" style={{ animationDelay: '0.2s' }}>⭐</span>
            <span className="text-xl sm:text-2xl animate-bounce-slow" style={{ animationDelay: '0.4s' }}>💜</span>
            <span className="text-xl sm:text-2xl animate-bounce-slow" style={{ animationDelay: '0.6s' }}>✨</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BiographyModal;
