/**
 * EXERCISE CARD - Card individual de ejercicio con expansión
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Clock, Calendar } from 'lucide-react';
import type { ExerciseTemplate } from '../services/exercises/exerciseDatabase';

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
  isCompleted?: boolean;
  onComplete?: (exerciseId: string) => void;
  onUncomplete?: (exerciseId: string) => void;
}

export default function ExerciseCard({ 
  exercise, 
  isCompleted = false,
  onComplete,
  onUncomplete 
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

  const energyLevelEmoji: Record<string, string> = {
    'low': '🌙',
    'medium': '☀️',
    'high': '⚡'
  };

  const timingEmoji: Record<string, string> = {
    'morning': '🌅',
    'evening': '🌙',
    'anytime': '⏰'
  };

  const handleToggleComplete = () => {
    if (isCompleted && onUncomplete) {
      onUncomplete(exercise.id);
    } else if (!isCompleted && onComplete) {
      onComplete(exercise.id);
    }
  };

  return (
    <div className={`
      border rounded-lg p-2.5 sm:p-3 md:p-4 transition-all duration-200 
      ${isCompleted 
        ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700 opacity-75' 
        : 'bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 hover:shadow-md'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <h4 className={`font-semibold text-sm sm:text-base md:text-lg truncate ${isCompleted ? 'line-through text-gray-600 dark:text-gray-400' : 'text-purple-900 dark:text-white'}`}>
              {exercise.title}
            </h4>
            {isCompleted && (
              <span className="text-green-600 dark:text-green-400 flex-shrink-0">
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2">
            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${categoryColors[exercise.category] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
              {exercise.category}
            </span>
            
            {exercise.duration && (
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-0.5 sm:gap-1">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {exercise.duration}min
              </span>
            )}
            
            {exercise.energyLevel && (
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                {energyLevelEmoji[exercise.energyLevel]}
              </span>
            )}
            
            {exercise.timing && (
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                {timingEmoji[exercise.timing]}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
            {exercise.description}
          </p>

          {exercise.frequency && (
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {exercise.frequency}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
          <button
            onClick={handleToggleComplete}
            className={`
              px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium transition-all flex items-center gap-0.5 sm:gap-1
              ${isCompleted 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-600 ring-2 ring-emerald-300 dark:ring-emerald-700' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md'
              }
            `}
          >
            <Check className={`w-3 h-3 sm:w-4 sm:h-4 ${isCompleted ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isCompleted ? '✓ Completado' : 'Completar'}</span>
            <span className="sm:hidden">{isCompleted ? '✓' : '○'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center gap-0.5 sm:gap-1 justify-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Menos</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Ver</span>
              </>
            )}
          </button>
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
