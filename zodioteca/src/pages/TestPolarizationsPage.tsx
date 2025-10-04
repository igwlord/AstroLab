import React from 'react';
import PolarizationsGrid from '../components/PolarizationsGrid';

const TestPolarizationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-200 mb-2">
            ⚖️ Polarizaciones Planetarias
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Desequilibrios energéticos y su integración consciente
          </p>
        </div>
        
        <PolarizationsGrid />
      </div>
    </div>
  );
};

export default TestPolarizationsPage;
