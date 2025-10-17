/**
 * EXERCISE CARD - Card individual de ejercicio con checkboxes de días
 * Versión 2.0: Sistema de 7 días por ejercicio
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from '../utils/icons';
import type { ExerciseTemplate } from '../services/exercises/exerciseDatabase';

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
  completedDays: number[]; // Array de días completados [1, 3, 5]
  onDayComplete?: (exerciseId: string, day: number) => void;
  onDayUncomplete?: (exerciseId: string, day: number) => void;
}

export default function ExerciseCard({ 
  exercise, 
  completedDays = [],
  onDayComplete,
  onDayUncomplete 
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColors: Record<string, string> = {
    'Respiración': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'Emocional': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    'Físico': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Comunicación': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'Mental': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'Estructura': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
    'Meditación': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    'Creatividad': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    'Autocuidado': 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300',
    'Mindfulness': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
    'Contemplación': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300',
    'Social': 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
  };

  const handleDayToggle = (day: number) => {
    if (completedDays.includes(day)) {
      onDayUncomplete?.(exercise.id, day);
    } else {
      onDayComplete?.(exercise.id, day);
    }
  };

  const completedCount = completedDays.length;

  return (
    <div className="border-2 border-purple-200 dark:border-purple-700 rounded-xl p-4 md:p-5 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 hover:shadow-lg transition-all">
      {/* Header del ejercicio - MÁS COMPACTO */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[exercise.category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
              {exercise.category}
            </span>
            
            {exercise.duration && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" />
                {exercise.duration} min/día
              </span>
            )}
          </div>

          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            {exercise.description}
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          aria-label={isExpanded ? 'Cerrar detalles' : 'Ver detalles'}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          )}
        </button>
      </div>

      {/* Checkboxes de días - Más grandes y claros */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
            Marca los días completados:
          </span>
          <span className="text-sm md:text-base text-purple-600 dark:text-purple-400 font-bold">
            {completedCount}/7 días
          </span>
        </div>

        {/* Grid de checkboxes - MÁS GRANDE */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = completedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`
                  aspect-square rounded-lg md:rounded-xl border-2 transition-all
                  flex items-center justify-center text-sm md:text-base font-bold
                  ${isCompleted
                    ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:scale-105'
                  }
                `}
                title={isCompleted ? `Día ${day} completado ✓` : `Marcar día ${day} como completado`}
                aria-label={`Día ${day}`}
              >
                {isCompleted ? '✓' : day}
              </button>
            );
          })}
        </div>

        {/* Barra de progreso - Más prominente */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 md:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(completedCount / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="mt-2.5 sm:mt-3 md:mt-4 pt-2.5 sm:pt-3 md:pt-4 border-t border-purple-200 dark:border-purple-700 space-y-2.5 sm:space-y-3 md:space-y-4 animate-fadeIn">
          {/* Pasos */}
          {exercise.steps && exercise.steps.length > 0 && (
            <div>
              <h5 className="text-xs sm:text-sm md:text-base font-semibold text-purple-800 dark:text-purple-300 mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                📝 Pasos:
              </h5>
              <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300">
                {exercise.steps.map((step, idx) => (
                  <li key={idx} className="ml-1 sm:ml-2">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Beneficios */}
          {exercise.benefits && exercise.benefits.length > 0 && (
            <div>
              <h5 className="text-xs sm:text-sm md:text-base font-semibold text-purple-800 dark:text-purple-300 mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                ✨ Beneficios:
              </h5>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300">
                {exercise.benefits.map((benefit, idx) => (
                  <li key={idx} className="ml-1 sm:ml-2">{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Materiales */}
          {exercise.materials && exercise.materials.length > 0 && (
            <div>
              <h5 className="text-xs sm:text-sm md:text-base font-semibold text-purple-800 dark:text-purple-300 mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                🎒 Materiales:
              </h5>
              <ul className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                {exercise.materials.map((material, idx) => (
                  <li key={idx} className="text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
