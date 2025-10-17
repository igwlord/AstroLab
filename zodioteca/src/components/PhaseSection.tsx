/**
 * PHASE SECTION - Sección de fase con lista de ejercicios
 * Versión 2.0: Sistema de días (1-7) en lugar de checkboxes por ejercicio
 */

import ExerciseCard from './ExerciseCard';
import type { ExercisePhase } from '../services/exercises/planGenerator';

interface PhaseSectionProps {
  phase: ExercisePhase;
  completedDays: Record<string, number[]>; // NUEVO: { exerciseId: [1, 3, 5] }
  onDayComplete: (exerciseId: string, day: number) => void; // NUEVO
  onDayUncomplete: (exerciseId: string, day: number) => void; // NUEVO
  weekNumber: number; // NUEVO: 1, 2 o 3
}

export default function PhaseSection({ 
  phase, 
  completedDays,
  onDayComplete,
  onDayUncomplete,
  weekNumber
}: PhaseSectionProps) {
  // Calcular progreso basado en días únicos completados
  const uniqueDaysCompleted = new Set<number>();
  phase.exercises.forEach(ex => {
    const days = completedDays[ex.id] || [];
    days.forEach(day => uniqueDaysCompleted.add(day));
  });
  
  const completedCount = uniqueDaysCompleted.size;
  const totalCount = 7; // Siempre 7 días
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const levelColors: Record<string, string> = {
    'easy': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'varied': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
  };

  const weekTitles: Record<number, string> = {
    1: '🔥 TU SEMANA ACTUAL (Días 1-7)',
    2: '📅 SEMANA 2 (Días 8-14)',
    3: '🎯 SEMANA 3 (Días 15-21)'
  };

  const phaseNames: Record<number, string> = {
    1: 'Fundación',
    2: 'Integración',
    3: 'Expansión'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-purple-200 dark:border-purple-700">
      {/* Header - Optimizado para móvil */}
      <div className="w-full p-4 sm:p-4 md:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2 md:gap-3 mb-2 sm:mb-2 flex-wrap">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                {weekTitles[weekNumber] || `Semana ${weekNumber}`}
              </h3>
              <span className={`text-xs sm:text-xs px-2.5 sm:px-2.5 md:px-3 py-1 sm:py-1 rounded-full font-medium ${levelColors[phase.level]}`}>
                Fase {phase.phaseNumber}: {phaseNames[phase.phaseNumber]}
              </span>
            </div>

            <p className="text-sm sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
              {phase.instructions}
            </p>

            {/* Barra de progreso - Basada en días únicos completados */}
            <div className="space-y-2 sm:space-y-1.5 md:space-y-2">
              <div className="flex items-center justify-between text-sm sm:text-sm">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  {completedCount} de {totalCount} días completados
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-2 md:h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido - Siempre expandido */}
      <div className="px-4 sm:px-4 md:px-6 pb-4 sm:pb-4 md:pb-6 pt-0 space-y-4 sm:space-y-3 md:space-y-4">
          {/* Geometría Sagrada y Chakras - Mejor organización en móvil */}
          {phase.sacredGeometry && phase.chakras && (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Geometría Sagrada */}
              <div
                className="rounded-xl p-4 border-2 shadow-sm"
                style={{
                  borderColor: phase.sacredGeometry.color,
                  background: `linear-gradient(135deg, ${phase.sacredGeometry.color}15 0%, ${phase.sacredGeometry.color}05 100%)`
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: phase.sacredGeometry.color }}
                  />
                  <h4 className="text-base font-bold" style={{ color: phase.sacredGeometry.color }}>
                    🔮 {phase.sacredGeometry.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                  {phase.sacredGeometry.symbolism}
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300">
                    💡 Guía de visualización
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    {phase.sacredGeometry.visualizationGuide}
                  </p>
                </details>
              </div>

              {/* Chakras */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <h4 className="text-base font-bold text-purple-800 dark:text-purple-300 mb-3">
                  ⚡ Chakras Activados
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 min-w-[80px]">
                      Principal:
                    </span>
                    <span className="text-sm bg-purple-100 dark:bg-purple-800 px-3 py-1 rounded-full text-purple-800 dark:text-purple-200 font-medium">
                      {phase.chakras.primary}
                    </span>
                  </div>
                  {phase.chakras.secondary && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 min-w-[80px]">
                        Secundario:
                      </span>
                      <span className="text-sm bg-purple-100 dark:bg-purple-800 px-3 py-1 rounded-full text-purple-800 dark:text-purple-200 font-medium">
                        {phase.chakras.secondary}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>🎯 Enfoque:</strong> {phase.chakras.focus}
                    </p>
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                      <p className="text-sm italic text-purple-700 dark:text-purple-300">
                        💫 "{phase.chakras.affirmation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rutina diaria - Más legible en móvil */}
          {phase.dailyRoutine && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4 shadow-sm border border-purple-200 dark:border-purple-700">
              <h4 className="text-base font-semibold text-purple-800 dark:text-purple-300 mb-3">
                📅 Rutina sugerida:
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                {phase.dailyRoutine}
              </div>
            </div>
          )}

          {/* Lista de ejercicios - Mejor espaciado */}
          <div className="space-y-3 sm:space-y-2.5 md:space-y-3">
            {phase.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                completedDays={completedDays[exercise.id] || []}
                onDayComplete={onDayComplete}
                onDayUncomplete={onDayUncomplete}
              />
            ))}
          </div>

          {/* Mensaje de completitud - Más celebrativo */}
          {progressPercent === 100 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl text-center shadow-sm">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-base text-green-800 dark:text-green-300 font-bold">
                ¡Felicitaciones! Completaste la Fase {phase.phaseNumber}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Estás un paso más cerca de tu transformación
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
