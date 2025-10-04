import React from 'react';
import RelationalGrid from '../components/RelationalGrid';

const TestRelationalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-900 dark:text-pink-200 mb-2">
            💞 Astrología Relacional
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Técnicas para analizar vínculos y relaciones entre cartas natales
          </p>
        </div>
        
        <RelationalGrid />
      </div>
    </div>
  );
};

export default TestRelationalPage;
