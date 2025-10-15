/**
 * COMPONENTE: AxisAnalysisModal
 * Modal con análisis completo de un eje arquetípico
 * Muestra importancia, ejercicios, urgencia y detalles técnicos
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { AxisAnalysis, AxisCategory } from '../services/exercises/chartAnalyzer';
import { getAspectSymbol } from '../services/exercises/chartAnalyzer';
import {
  getAxisImportance,
  getAxisExercises,
  getAxisUrgency,
  getAxisDescription
} from '../utils/interpretationHelpers';

interface AxisAnalysisModalProps {
  axis: AxisAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Obtiene emoji del eje según categoría
 */
function getCategoryEmoji(category: AxisCategory): string {
  const emojis: Record<AxisCategory, string> = {
    core: '👑',
    internal: '🌊',
    challenge: '⚡',
    expansion: '✨'
  };
  return emojis[category] || '⭐';
}

/**
 * Obtiene emoji de los planetas
 */
function getPlanetEmoji(planet: string): string {
  const emojis: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'Chiron': '⚷'
  };
  return emojis[planet] || '●';
}

/**
 * Formatea nombre de planeta para mostrar
 */
function getPlanetDisplayName(planet: string): string {
  const names: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'Uranus': 'Urano',
    'Neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'Chiron': 'Quirón'
  };
  return names[planet] || planet;
}

export default function AxisAnalysisModal({ axis, isOpen, onClose }: AxisAnalysisModalProps) {
  const urgency = getAxisUrgency(axis.score);
  const importance = getAxisImportance(axis.theme, axis.aspectType, axis.houses);
  const exercises = getAxisExercises(axis.theme, axis.category);
  const description = getAxisDescription(axis.theme);

  const categoryEmoji = getCategoryEmoji(axis.category);
  const planet1Emoji = getPlanetEmoji(axis.planets[0]);
  const planet2Emoji = getPlanetEmoji(axis.planets[1]);
  const aspectSymbol = getAspectSymbol(axis.aspectType);

  const planet1Name = getPlanetDisplayName(axis.planets[0]);
  const planet2Name = getPlanetDisplayName(axis.planets[1]);

  const urgencyLabel = urgency === 'Alta' ? 'Crítico' : urgency === 'Media' ? 'Trabajar' : 'Observar';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[calc(100vh-2rem)]
                         bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                         overflow-hidden flex flex-col"
            >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <div className="flex items-start gap-4 mb-3">
                <div className="text-5xl">{categoryEmoji}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {axis.theme}
                    </h2>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold ml-4
                      ${urgency === 'Alta' ? 'bg-red-500/20 text-red-700 dark:text-red-300' : ''}
                      ${urgency === 'Media' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' : ''}
                      ${urgency === 'Baja' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : ''}
                    `}>
                      {urgencyLabel}
                    </span>
                  </div>
                  <div className="text-base text-gray-600 dark:text-gray-400 flex items-center gap-3 mb-2">
                    <span>{planet1Emoji} {planet1Name}</span>
                    <span className="text-2xl">{aspectSymbol}</span>
                    <span>{planet2Emoji} {planet2Name}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {description}
                  </p>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Orbe:</span>
                  <span>{axis.orb.toFixed(1)}°</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Casas:</span>
                  <span>{axis.houses[0]} - {axis.houses[1]}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Score:</span>
                  <span>{axis.score.toFixed(1)}/20</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Categoría:</span>
                  <span className="capitalize">{axis.category}</span>
                </div>
              </div>
            </div>

            {/* Content scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Importancia */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎯</span>
                  <span>¿Por qué importa?</span>
                </h3>
                <div className="space-y-2">
                  {importance.map((point, i) => (
                    <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {point}
                    </p>
                  ))}
                </div>
              </section>

              {/* Ejercicios */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>💪</span>
                  <span>Ejercicios prácticos</span>
                </h3>
                <div className="space-y-3">
                  {exercises.map((exercise, i) => {
                    if (exercise === '') return <div key={i} className="h-2" />;
                    const isNote = exercise.startsWith('💎') || exercise.startsWith('🌊') || 
                                   exercise.startsWith('⚡') || exercise.startsWith('✨');
                    return (
                      <div 
                        key={i} 
                        className={isNote 
                          ? "p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm text-gray-700 dark:text-gray-300" 
                          : "flex gap-3 text-gray-700 dark:text-gray-300"
                        }
                      >
                        {!isNote && <span className="text-purple-500 font-bold">{i + 1}.</span>}
                        <span className="flex-1">{exercise}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Urgencia */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>⏰</span>
                  <span>Nivel de urgencia: {urgency}</span>
                </h3>
                <div className={`p-4 rounded-xl ${
                  urgency === 'Alta' ? 'bg-red-500/10 border border-red-500/20' :
                  urgency === 'Media' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                  'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {urgency === 'Alta' 
                      ? 'Este eje requiere atención inmediata. Los ejercicios pueden generar cambios significativos rápidamente. Dedica tiempo consciente a trabajar estas dinámicas.'
                      : urgency === 'Media'
                      ? 'Trabaja este eje de forma regular pero sin presión. La integración consciente facilitará tu evolución. Incorpora los ejercicios a tu rutina semanal.'
                      : 'Observa este eje con curiosidad. El trabajo puede ser más sutil pero igualmente valioso. Revisa periódicamente cómo se manifiesta en tu vida.'
                    }
                  </p>
                </div>
              </section>

              {/* Detalles técnicos */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🔧</span>
                  <span>Detalles técnicos</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white block mb-1">Tipo de aspecto</span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{axis.aspectType}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white block mb-1">Casas angulares</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {axis.houses.some(h => [1,4,7,10].includes(h)) ? 'Sí ✓' : 'No'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white block mb-1">Casas sensibles</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {axis.houses.some(h => [8,12].includes(h)) ? 'Sí ✓' : 'No'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white block mb-1">Score de impacto</span>
                    <span className="text-gray-700 dark:text-gray-300">{axis.score.toFixed(1)}/20</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {axis.score >= 15 
                    ? '⭐ Score alto: Este eje es estructurante y central en tu carta natal.'
                    : axis.score >= 10
                    ? '⭐ Score medio: Este eje es relevante y merece atención regular.'
                    : '⭐ Score moderado: Este eje opera de forma más sutil en tu psique.'
                  }
                </p>
              </section>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
