import React from 'react';
import ZodiacSignsGrid from '../components/ZodiacSignsGrid';

const TestSignsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-900 dark:text-purple-100">
          Test de Signos Zodiacales
        </h1>
        <ZodiacSignsGrid />
      </div>
    </div>
  );
};

export default TestSignsPage;
