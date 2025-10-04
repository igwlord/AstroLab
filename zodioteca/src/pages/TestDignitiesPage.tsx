import React from 'react';
import DignitiesGrid from '../components/DignitiesGrid';

const TestDignitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-200 mb-2">
            👑 Dignidades Planetarias
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            La fuerza y debilidad de los planetas según su posición zodiacal
          </p>
        </div>
        
        <DignitiesGrid />
      </div>
    </div>
  );
};

export default TestDignitiesPage;
