/**
 * WEEKLY PHASE SECTION - Vista semanal de ejercicios
 * Muestra una fase como "semana" con progreso día por día
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from '../utils/icons';
import type { ExercisePhase } from '../services/exercises/planGenerator';

interface WeeklyPhaseSectionProps {
  phase: ExercisePhase;
  weekNumber: number; // 1, 2, o 3
  completedDays: Record<string, number[]>; // { exerciseId: [1, 2, 3] } días completados
  onDayComplete: (exerciseId: string, day: number) => void;
  onDayUncomplete: (exerciseId: string, day: number) => void;
  isCurrentWeek?: boolean; // Si es la semana activa
  isLocked?: boolean; // Si está bloqueada (futuro)
}

export default function WeeklyPhaseSection({
  phase,
  weekNumber,
  completedDays,
  onDayComplete,
  onDayUncomplete,
  isCurrentWeek = false,
  isLocked = false
}: WeeklyPhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isCurrentWeek);

  // Calcular progreso total de la semana
  const totalDays = phase.exercises.length * 7; // 2 ejercicios × 7 días = 14 checks
  const completedDaysCount = Object.values(completedDays).reduce(
    (sum, days) => sum + days.length,
    0
  );
  const progressPercent = totalDays > 0 ? Math.round((completedDaysCount / totalDays) * 100) : 0;

  const phaseLabels: Record<number, string> = {
    1: '🌱 Fundación',
    2: '🌿 Profundización', 
    3: '🌳 Integración'
  };

  const phaseDays: Record<number, string> = {
    1: 'Días 1-7',
    2: 'Días 8-14',
    3: 'Días 15-21'
  };

  if (isLocked) {
    return (
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
        {/* Overlay bloqueado con blur */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gray-200/30 dark:bg-gray-900/30 z-10"></div>
        
        <div className="relative z-20 p-6 sm:p-8 text-center">
          {/* Icono de candado animado */}
          <div className="inline-block animate-bounce mb-4">
            <div className="text-6xl">🔒</div>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            FASE {weekNumber}: {phaseLabels[weekNumber]}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {phaseDays[weekNumber]}
          </p>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-4 max-w-md mx-auto">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              🎯 Completa los <strong className="text-purple-600 dark:text-purple-400">7 días</strong> de la Fase {weekNumber - 1} para desbloquear
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Marca cualquier día en cualquier ejercicio - cuenta como 1 día completado �
            </p>
          </div>

          {/* Preview de ejercicios bloqueados */}
          <div className="mt-6 opacity-40">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-2 font-medium">
              Vista previa de ejercicios:
            </div>
            <div className="space-y-2">
              {phase.exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 text-xs text-gray-500 dark:text-gray-400"
                >
                  {i + 1}. {ex.title} • {ex.category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden border-2 transition-all ${
      isCurrentWeek 
        ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30' 
        : 'border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800'
    }`}>
      {/* Header colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 sm:p-6 text-left transition-colors touch-manipulation ${
          isCurrentWeek 
            ? 'hover:bg-purple-100/50 dark:hover:bg-purple-900/40' 
            : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Badge de "FASE SUGERIDA" */}
            {isCurrentWeek && (
              <div className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-md animate-pulse">
                <span>⚡</span>
                <span>FASE SUGERIDA</span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-white">
                Fase {weekNumber}
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {phaseDays[weekNumber]}
              </span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3">
              {phaseLabels[weekNumber]}
            </p>

            {/* Instrucciones de la fase */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
              {phase.instructions}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mb-4 italic">
              💡 Puedes hacer estos ejercicios a tu ritmo durante tus 21 días
            </p>

            {/* Barra de progreso de fase */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  {completedDaysCount} de {totalDays} marcas completadas
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Icono de expansión */}
          <div className="flex-shrink-0 text-purple-600 dark:text-purple-400 self-center">
            {isExpanded ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </div>
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 space-y-6 animate-fadeIn">
          {/* Geometría Sagrada y Chakras */}
          {phase.sacredGeometry && phase.chakras && (
            <div className="grid grid-cols-1 gap-4 mb-4">
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

          {/* Ejercicios de la semana con checkboxes por día */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-purple-900 dark:text-white flex items-center gap-2">
              <span>📋</span>
              <span>Ejercicios de esta semana:</span>
            </h4>

            {phase.exercises.map((exercise, idx) => {
              const exerciseDays = completedDays[exercise.id] || [];
              const daysCompleted = exerciseDays.length;

              return (
                <div
                  key={exercise.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 border-2 border-purple-200 dark:border-purple-700 shadow-md"
                >
                  {/* Header del ejercicio */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-base sm:text-lg font-bold text-purple-900 dark:text-white mb-1">
                        {exercise.title}
                      </h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                          ⏱️ {exercise.duration || '10 min'}
                        </span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded-full text-purple-700 dark:text-purple-300 font-medium">
                          {exercise.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {exercise.description}
                      </p>
                    </div>
                  </div>

                  {/* Progreso del ejercicio */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        Progreso: {daysCompleted}/7 días
                      </span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {Math.round((daysCompleted / 7) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(daysCompleted / 7) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Checkboxes de días */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Marca cada día que completes:
                    </p>
                    <div className="grid grid-cols-7 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map(day => {
                        const isCompleted = exerciseDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              if (isCompleted) {
                                onDayUncomplete(exercise.id, day);
                              } else {
                                onDayComplete(exercise.id, day);
                              }
                            }}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all shadow-sm hover:scale-110 active:scale-95 ${
                              isCompleted
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title={`Día ${day}`}
                          >
                            {isCompleted ? '✓' : day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instrucciones expandibles */}
                  {exercise.steps && exercise.steps.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                        📖 Ver instrucciones paso a paso
                      </summary>
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                        <ol className="list-decimal list-inside space-y-1">
                          {exercise.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </details>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mensaje de completitud */}
          {progressPercent === 100 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl text-center shadow-sm">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-base text-green-800 dark:text-green-300 font-bold">
                ¡Felicitaciones! Completaste la Fase {weekNumber}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {weekNumber < 3 
                  ? 'Continúa con la siguiente fase cuando estés listo'
                  : '¡Has completado todas las fases del programa! 🌟'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
