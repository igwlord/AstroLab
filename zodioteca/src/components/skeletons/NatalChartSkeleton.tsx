import React from 'react';
import Skeleton from '../Skeleton';

/**
 * Skeleton loading para NatalChartPage
 * Muestra placeholders mientras carga la carta natal completa
 */
const NatalChartSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton variant="text" className="h-10 w-80 mx-auto" />
        <Skeleton variant="text" className="h-5 w-96 mx-auto" />
      </div>

      {/* Form skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <Skeleton variant="text" className="h-6 w-32" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <Skeleton variant="text" className="h-6 w-32" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
            <Skeleton variant="rectangular" className="h-12 w-full" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Skeleton variant="rectangular" className="h-12 w-48" />
        </div>
      </div>

      {/* Chart area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart wheel */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <Skeleton variant="text" className="h-6 w-40 mx-auto" />
          </div>
          <div className="flex justify-center">
            <Skeleton variant="circular" className="w-80 h-80" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <Skeleton variant="text" className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton variant="planetary" className="w-6 h-6" />
                  <Skeleton variant="text" className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <Skeleton variant="text" className="h-5 w-20 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton variant="text" className="h-4 w-full" key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-5 w-20" />
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="text" className="h-5 w-32" />
                <Skeleton variant="text" className="h-4 w-full" />
                <Skeleton variant="text" className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartSkeleton;