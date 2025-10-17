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

  const weekTitles: Record<number, string> = {
    1: '🔥 TU SEMANA ACTUAL (Días 1-7)',
    2: '📅 SEMANA 2 (Días 8-14)',
    3: '🎯 SEMANA 3 (Días 15-21)'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-purple-200 dark:border-purple-700">
      {/* HEADER - Plan claro y destacado - COMPACTO EN MÓVIL */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 p-3 sm:p-4 md:p-8">
        <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
          {weekTitles[weekNumber] || `Semana ${weekNumber}`}
        </h3>
        
        {/* Plan de la semana - Lo primero que ve el usuario */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-lg sm:text-xl md:text-2xl">📋</span>
            <span className="text-white font-semibold text-sm sm:text-base md:text-lg">Tu plan esta semana:</span>
          </div>
          <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed">
            {phase.instructions}
          </p>
        </div>

        {/* Rutina sugerida - MUY VISIBLE */}
        {phase.dailyRoutine && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <span className="text-lg sm:text-xl md:text-2xl">🎯</span>
              <span className="text-white font-semibold text-sm sm:text-base md:text-lg">Qué hacer cada día:</span>
            </div>
            <div className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {phase.dailyRoutine}
            </div>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="mt-2 sm:mt-3 md:mt-4">
          <div className="flex items-center justify-between text-white mb-1.5 sm:mb-2">
            <span className="font-semibold text-xs sm:text-sm md:text-base">Tu progreso:</span>
            <span className="font-bold text-sm sm:text-base md:text-lg">{completedCount}/7 días • {progressPercent}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3 md:h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* EJERCICIOS - Sección principal */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🔥</span>
          <h4 className="text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
            Tus ejercicios diarios
          </h4>
        </div>

        <div className="space-y-4">
          {phase.exercises.map((exercise, index) => (
            <div key={exercise.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {index + 1}️⃣
                </span>
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  {exercise.title}
                </span>
              </div>
              <ExerciseCard
                exercise={exercise}
                completedDays={completedDays[exercise.id] || []}
                onDayComplete={onDayComplete}
                onDayUncomplete={onDayUncomplete}
              />
            </div>
          ))}
        </div>

        {/* Mensaje de completitud */}
        {progressPercent === 100 && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl text-green-800 dark:text-green-300 font-bold">
              ¡Felicitaciones! Completaste la Semana {weekNumber}
            </p>
            <p className="text-base text-green-700 dark:text-green-400 mt-2">
              Estás un paso más cerca de tu transformación
            </p>
          </div>
        )}

        {/* Información adicional - Al final, colapsada */}
        {(phase.sacredGeometry || phase.chakras) && (
          <details className="mt-8 border-t-2 border-gray-200 dark:border-gray-700 pt-6">
            <summary className="cursor-pointer text-purple-700 dark:text-purple-300 font-semibold text-base flex items-center gap-2 hover:text-purple-900 dark:hover:text-purple-100">
              <span>✨</span>
              <span>Frecuencias y geometría (opcional)</span>
            </summary>
            
            <div className="mt-6 space-y-4">
              {/* Geometría Sagrada */}
              {phase.sacredGeometry && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.sacredGeometry.color }}
                    />
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {phase.sacredGeometry.name}
                    </h5>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {phase.sacredGeometry.symbolism}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    💡 {phase.sacredGeometry.visualizationGuide}
                  </p>
                </div>
              )}

              {/* Chakras */}
              {phase.chakras && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                    ⚡ Chakras activados
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Principal:</span>{' '}
                      <span className="text-gray-900 dark:text-white font-medium">{phase.chakras.primary}</span>
                    </div>
                    {phase.chakras.secondary && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Secundario:</span>{' '}
                        <span className="text-gray-900 dark:text-white font-medium">{phase.chakras.secondary}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <strong>Enfoque:</strong> {phase.chakras.focus}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 italic">
                        "{phase.chakras.affirmation}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
