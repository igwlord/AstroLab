import React from 'react';
import AspectsGrid from '../components/AspectsGrid';

const TestAspectsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900 dark:text-blue-100">
          Test de Aspectos Astrológicos
        </h1>
        <AspectsGrid />
      </div>
    </div>
  );
};

export default TestAspectsPage;
