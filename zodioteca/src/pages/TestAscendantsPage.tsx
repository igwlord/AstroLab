import React from 'react';
import AscendantsGrid from '../components/AscendantsGrid';

const TestAscendantsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-900 dark:text-orange-100">
          🌅 Test de Ascendentes
        </h1>
        <AscendantsGrid />
      </div>
    </div>
  );
};

export default TestAscendantsPage;
