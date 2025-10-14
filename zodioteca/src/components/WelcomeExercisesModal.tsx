/**
 * WelcomeExercisesModal - Modal de onboarding para sección Ejercicios
 * 
 * Características:
 * - Explica qué son los ejercicios personalizados
 * - Cómo se generan (análisis astrológico)
 * - Qué incluyen (21 días, frecuencias, técnicas)
 * - Checkbox "No volver a mostrar"
 * - Botones: Cargar Carta | Cerrar
 */

import { useState } from 'react';
import type { FC } from 'react';

interface WelcomeExercisesModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onLoadChart: () => void;
}

const WelcomeExercisesModal: FC<WelcomeExercisesModalProps> = ({
  isOpen,
  onClose,
  onLoadChart,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  const handleLoadChart = () => {
    onClose(dontShowAgain);
    onLoadChart();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full my-2 sm:my-auto animate-scaleIn"
        style={{ maxHeight: 'calc(100vh - 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll wrapper */}
        <div className="overflow-y-auto rounded-2xl" style={{ maxHeight: 'calc(100vh - 1rem)' }}>
          {/* Header - Optimizado para móviles */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-4 sm:p-6 md:p-8 rounded-t-2xl text-white">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 transition-all shadow-lg hover:scale-110 active:scale-95 text-lg sm:text-xl font-bold touch-manipulation"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 block animate-bounce">🧘✨</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                Bienvenido a Ejercicios Personalizados
              </h2>
              <p className="text-purple-100 text-sm sm:text-base md:text-lg">
                Tu plan de bienestar astrológico en 21 días
              </p>
            </div>
          </div>

        {/* Content - Optimizado para móviles */}
        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          {/* ¿Qué son? */}
          <section>
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-lg sm:text-xl">💡</span>
              ¿Qué son los Ejercicios Personalizados?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Son prácticas únicas generadas a partir del análisis profundo de tu <strong>carta natal</strong>.
              Cada plan es diferente, diseñado específicamente para tu configuración astrológica.
            </p>
          </section>

          {/* ¿Cómo se generan? */}
          <section>
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-lg sm:text-xl">🔮</span>
              ¿Cómo se generan?
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <span className="text-lg sm:text-2xl">1️⃣</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Análisis Astrológico</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Evaluamos planetas, aspectos, casas, dignidades y formas de tu carta
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <span className="text-lg sm:text-2xl">2️⃣</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Detección de Necesidades</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Identificamos áreas que requieren equilibrio (Luna estresada, Mercurio retrógrado, etc.)
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <span className="text-lg sm:text-2xl">3️⃣</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Selección Inteligente</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Elegimos ejercicios que mejor se adaptan a tu perfil energético único
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ¿Qué incluyen? - Optimizado para móviles */}
          <section>
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-lg sm:text-xl">📦</span>
              ¿Qué incluye tu plan?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🎵</span>
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Frecuencias Sonoras</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Tonos específicos para armonización
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">💬</span>
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Afirmaciones</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Mantras alineados con tu energía
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🌬️</span>
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Respiración</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Técnicas para equilibrar chakras
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">🧘</span>
                <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Prácticas</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Ejercicios de meditación y foco
                </p>
              </div>
            </div>
          </section>

          {/* Plan de 21 días - Optimizado para móviles */}
          <section className="bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-lg sm:text-xl">📅</span>
              Plan de 21 Días
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">
              Tu viaje está dividido en 3 fases de 7 días cada una:
            </p>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-16 sm:w-20 text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">Días 1-7</span>
                <span className="text-gray-600 dark:text-gray-400">Fase de Introducción y Adaptación</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 sm:w-20 text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">Días 8-14</span>
                <span className="text-gray-600 dark:text-gray-400">Fase de Profundización y Práctica</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-16 sm:w-20 text-purple-700 dark:text-purple-300 font-semibold text-xs sm:text-sm">Días 15-21</span>
                <span className="text-gray-600 dark:text-gray-400">Fase de Integración y Consolidación</span>
              </div>
            </div>
          </section>

          {/* Checkbox "No volver a mostrar" */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <input
              type="checkbox"
              id="dont-show-again"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
            />
            <label 
              htmlFor="dont-show-again" 
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              No volver a mostrar este mensaje. Podés reactivarlo desde Configuración si necesitás recordar cómo funciona.
            </label>
          </div>
        </div>

          {/* Footer con botones - Optimizado para móviles */}
          <div className="sticky bottom-0 p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex flex-col sm:flex-row gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLoadChart}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] touch-manipulation text-sm sm:text-base"
          >
            🚀 Cargar mi Carta Natal
          </button>

          <button
            onClick={handleClose}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 touch-manipulation text-sm sm:text-base"
          >
            Explorar primero
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeExercisesModal;
