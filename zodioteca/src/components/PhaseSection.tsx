/**
 * PHASE SECTION - Sección de fase con lista de ejercicios
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from '../utils/icons';
import ExerciseCard from './ExerciseCard';
import type { ExercisePhase } from '../services/exercises/planGenerator';

interface PhaseSectionProps {
  phase: ExercisePhase;
  completedExercises: Set<string>;
  onExerciseComplete: (exerciseId: string) => void;
  onExerciseUncomplete: (exerciseId: string) => void;
}

export default function PhaseSection({ 
  phase, 
  completedExercises,
  onExerciseComplete,
  onExerciseUncomplete
}: PhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(phase.phaseNumber === 1); // Primera fase expandida por defecto

  const completedCount = phase.exercises.filter(ex => completedExercises.has(ex.id)).length;
  const totalCount = phase.exercises.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const levelColors: Record<string, string> = {
    'easy': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'medium': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'varied': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
  };

  const levelLabels: Record<string, string> = {
    'easy': 'Fácil',
    'medium': 'Medio',
    'varied': 'Variado'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-purple-200 dark:border-purple-700">
      {/* Header colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-4 md:p-6 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 flex-wrap">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                Fase {phase.phaseNumber}
              </h3>
              <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full font-medium ${levelColors[phase.level]}`}>
                {levelLabels[phase.level]}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {phase.days} días
              </span>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 line-clamp-2">
              {phase.instructions}
            </p>

            {/* Barra de progreso */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  {completedCount} / {totalCount}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Icono de expansión */}
          <div className="flex-shrink-0 text-purple-600 dark:text-purple-400">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </div>
        </div>
      </button>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="p-3 sm:p-4 md:p-6 pt-0 space-y-2 sm:space-y-3 md:space-y-4 animate-fadeIn">
          {/* Geometría Sagrada y Chakras */}
          {phase.sacredGeometry && phase.chakras && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* Geometría Sagrada */}
              <div 
                className="rounded-lg p-3 sm:p-4 border-2"
                style={{ 
                  borderColor: phase.sacredGeometry.color,
                  background: `linear-gradient(135deg, ${phase.sacredGeometry.color}15 0%, ${phase.sacredGeometry.color}05 100%)`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                    style={{ backgroundColor: phase.sacredGeometry.color }}
                  />
                  <h4 className="text-sm sm:text-base font-bold" style={{ color: phase.sacredGeometry.color }}>
                    🔮 {phase.sacredGeometry.name}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {phase.sacredGeometry.symbolism}
                </p>
                <details className="text-xs sm:text-sm">
                  <summary className="cursor-pointer text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300">
                    Ver guía de visualización
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 italic">
                    {phase.sacredGeometry.visualizationGuide}
                  </p>
                </details>
              </div>

              {/* Chakras */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 sm:p-4 border border-purple-200 dark:border-purple-700">
                <h4 className="text-sm sm:text-base font-bold text-purple-800 dark:text-purple-300 mb-2">
                  ⚡ Chakras Activados
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400">
                      Principal:
                    </span>
                    <span className="text-xs sm:text-sm bg-purple-100 dark:bg-purple-800 px-2 py-0.5 rounded-full text-purple-800 dark:text-purple-200">
                      {phase.chakras.primary}
                    </span>
                  </div>
                  {phase.chakras.secondary && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400">
                        Secundario:
                      </span>
                      <span className="text-xs sm:text-sm bg-purple-100 dark:bg-purple-800 px-2 py-0.5 rounded-full text-purple-800 dark:text-purple-200">
                        {phase.chakras.secondary}
                      </span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2">
                    <strong>Enfoque:</strong> {phase.chakras.focus}
                  </p>
                  <div className="mt-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded border border-purple-200 dark:border-purple-600">
                    <p className="text-xs sm:text-sm italic text-purple-700 dark:text-purple-300">
                      💫 "{phase.chakras.affirmation}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rutina diaria */}
          {phase.dailyRoutine && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2.5 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-purple-800 dark:text-purple-300 mb-1.5 sm:mb-2">
                📅 Rutina sugerida:
              </h4>
              <pre className="text-[11px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                {phase.dailyRoutine}
              </pre>
            </div>
          )}

          {/* Lista de ejercicios */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            {phase.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isCompleted={completedExercises.has(exercise.id)}
                onComplete={onExerciseComplete}
                onUncomplete={onExerciseUncomplete}
              />
            ))}
          </div>

          {/* Mensaje de completitud */}
          {progressPercent === 100 && (
            <div className="mt-2 sm:mt-3 md:mt-4 p-2.5 sm:p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-center">
              <p className="text-xs sm:text-sm md:text-base text-green-800 dark:text-green-300 font-semibold">
                🎉 ¡Felicitaciones! Completaste la Fase {phase.phaseNumber}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
