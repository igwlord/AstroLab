/**
 * EmptyExercisesState - Estado vacío para cuando no hay carta cargada
 * 
 * Características:
 * - Explicación visual de qué son los ejercicios
 * - Features destacadas
 * - CTA prominente "Cargar mi Carta"
 * - Preview ilustrativo
 */

import type { FC } from 'react';

interface EmptyExercisesStateProps {
  onLoadChart: () => void;
}

const EmptyExercisesState: FC<EmptyExercisesStateProps> = ({ onLoadChart }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        {/* Ilustración principal */}
        <div className="mb-8">
          <span className="text-8xl sm:text-9xl block mb-4 animate-float">
            🧘‍♀️
          </span>
          <div className="flex justify-center gap-4 text-4xl sm:text-5xl opacity-70">
            <span className="animate-pulse" style={{ animationDelay: '0ms' }}>🎵</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms' }}>💫</span>
            <span className="animate-pulse" style={{ animationDelay: '400ms' }}>🌙</span>
          </div>
        </div>

        {/* Título y descripción */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 dark:text-white mb-4">
          Tu Plan Personalizado te Espera
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Generamos un <strong>plan de 21 días</strong> único basado en tu carta natal.
          Cada ejercicio está diseñado específicamente para tu configuración astrológica.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:scale-105">
            <span className="text-4xl mb-3 block">📅</span>
            <h3 className="font-bold text-purple-900 dark:text-white mb-2">21 Días de Prácticas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plan estructurado en 3 fases progresivas de 7 días cada una
            </p>
          </div>

          <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:scale-105">
            <span className="text-4xl mb-3 block">🎵</span>
            <h3 className="font-bold text-purple-900 dark:text-white mb-2">Frecuencias Curativas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tonos específicos calculados según tu carta natal
            </p>
          </div>

          <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:scale-105">
            <span className="text-4xl mb-3 block">💬</span>
            <h3 className="font-bold text-purple-900 dark:text-white mb-2">Afirmaciones Personalizadas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mantras alineados con tu energía astrológica única
            </p>
          </div>

          <div className="bg-white/50 dark:bg-purple-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:scale-105">
            <span className="text-4xl mb-3 block">🌬️</span>
            <h3 className="font-bold text-purple-900 dark:text-white mb-2">Técnicas de Respiración</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ejercicios para equilibrar tus chakras según necesidades
            </p>
          </div>
        </div>

        {/* Proceso de generación */}
        <div className="bg-gradient-to-r from-purple-100 via-violet-100 to-indigo-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-indigo-900/30 p-6 sm:p-8 rounded-2xl max-w-3xl mx-auto mb-10">
          <h3 className="text-xl font-bold text-purple-900 dark:text-white mb-4">
            🔮 ¿Cómo se Genera tu Plan?
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Análisis Profundo</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Evaluamos planetas, aspectos, casas, dignidades y formas de tu carta
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Detección de Necesidades</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identificamos áreas que requieren equilibrio (Luna estresada, Mercurio retrógrado, etc.)
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Selección Inteligente</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Elegimos ejercicios que mejor se adaptan a tu perfil energético único
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <button
          onClick={onLoadChart}
          className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white text-lg font-bold rounded-2xl transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 inline-flex items-center gap-3"
        >
          <span className="text-2xl group-hover:animate-bounce">🚀</span>
          Cargar mi Carta Natal
          <span className="text-2xl group-hover:animate-spin">✨</span>
        </button>

        {/* Nota informativa */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
          💡 <strong>Tip:</strong> Si ya tenés tu carta cargada en otra sección, 
          volveremos a usarla aquí automáticamente
        </p>
      </div>
    </div>
  );
};

export default EmptyExercisesState;

// Animación float para el icono principal
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;
document.head.appendChild(style);
