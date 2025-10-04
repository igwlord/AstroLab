import React from 'react';
import ConfigurationsGrid from '../components/ConfigurationsGrid';

const TestConfigurationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-200 mb-2">
            ⚡ Configuraciones Planetarias
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Patrones geométricos formados por aspectos entre planetas
          </p>
        </div>
        
        <ConfigurationsGrid />
      </div>
    </div>
  );
};

export default TestConfigurationsPage;
