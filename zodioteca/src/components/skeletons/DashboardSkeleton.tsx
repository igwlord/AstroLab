import React from 'react';
import Skeleton from '../Skeleton';

/**
 * Skeleton loading para el Dashboard
 * Muestra placeholders astrológicos mientras carga el clima diario
 */
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header del clima astrológico */}
      <div className="text-center space-y-4">
        <Skeleton variant="text" className="h-8 w-64 mx-auto" />
        <Skeleton variant="text" className="h-4 w-96 mx-auto" />
      </div>

      {/* Cards del clima */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <Skeleton variant="circular" className="w-10 h-10" />
              <div className="flex-1">
                <Skeleton variant="text" className="h-4 w-20 mb-1" />
                <Skeleton variant="text" className="h-3 w-16" />
              </div>
            </div>
            <Skeleton variant="text" className="h-4 w-full mb-2" />
            <Skeleton variant="text" className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Chart Wheel skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="text-center mb-4">
          <Skeleton variant="text" className="h-6 w-48 mx-auto mb-2" />
          <Skeleton variant="text" className="h-4 w-64 mx-auto" />
        </div>
        <div className="flex justify-center">
          <Skeleton variant="circular" className="w-64 h-64" />
        </div>
      </div>

      {/* Planetas actuales skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <Skeleton variant="text" className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton variant="planetary" className="w-8 h-8" />
              <div>
                <Skeleton variant="text" className="h-4 w-16 mb-1" />
                <Skeleton variant="text" className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;