import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-b-2 sm:border-b-[3px] border-purple-600 dark:border-purple-400 mx-auto mb-3 sm:mb-4"></div>
        <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300">Cargando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;