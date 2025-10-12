/**
 * ExercisePlanSkeleton - Skeleton loader para generación de plan de ejercicios
 * 
 * Mejora la percepción de rendimiento mostrando la estructura del plan
 * mientras se genera en segundo plano (1-2 segundos)
 */

import type { FC } from 'react';

const ExercisePlanSkeleton: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-3 sm:p-4 md:p-8 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-4 md:mb-8">
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <div className="h-6 w-20 bg-purple-200 dark:bg-purple-800 rounded"></div>
            <div className="h-10 w-32 bg-purple-200 dark:bg-purple-800 rounded-lg"></div>
          </div>
          
          <div className="h-10 w-3/4 bg-purple-300 dark:bg-purple-700 rounded mb-2"></div>
          <div className="h-5 w-2/3 bg-purple-200 dark:bg-purple-800 rounded"></div>
        </div>

        {/* Resumen del plan skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
          <div className="h-7 w-48 bg-purple-200 dark:bg-purple-800 rounded mb-4"></div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 sm:p-3 md:p-4">
                <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2"></div>
                <div className="h-8 w-16 bg-purple-300 dark:bg-purple-600 rounded mb-1"></div>
                <div className="h-3 w-20 bg-purple-200 dark:bg-purple-700 rounded"></div>
              </div>
            ))}
          </div>

          {/* Áreas prioritarias skeleton */}
          <div>
            <div className="h-5 w-40 bg-purple-200 dark:bg-purple-800 rounded mb-2"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-7 w-24 bg-purple-100 dark:bg-purple-800 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Fases skeleton */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {[1, 2, 3].map((phase) => (
            <div key={phase} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 sm:p-4 md:p-6">
              {/* Phase header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-8 w-64 bg-purple-300 dark:bg-purple-700 rounded mb-2"></div>
                  <div className="h-4 w-48 bg-purple-200 dark:bg-purple-800 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-purple-200 dark:bg-purple-800 rounded-full"></div>
              </div>

              {/* Exercise cards */}
              <div className="space-y-3">
                {[1, 2, 3].map((exercise) => (
                  <div key={exercise} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="h-6 w-3/4 bg-purple-300 dark:bg-purple-700 rounded mb-2"></div>
                        <div className="h-4 w-full bg-purple-200 dark:bg-purple-800 rounded mb-1"></div>
                        <div className="h-4 w-5/6 bg-purple-200 dark:bg-purple-800 rounded"></div>
                      </div>
                      <div className="h-6 w-6 bg-purple-200 dark:bg-purple-800 rounded ml-3"></div>
                    </div>
                    
                    {/* Exercise footer */}
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-20 bg-purple-200 dark:bg-purple-800 rounded-full"></div>
                      <div className="h-6 w-16 bg-purple-200 dark:bg-purple-800 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Loading message */}
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-purple-700 dark:text-purple-300 text-lg font-medium animate-pulse">
            ✨ Analizando tu carta natal y generando plan personalizado...
          </p>
          <p className="text-purple-600 dark:text-purple-400 text-sm mt-2">
            Esto puede tomar unos segundos
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExercisePlanSkeleton;
