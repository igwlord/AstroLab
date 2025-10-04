import React from 'react';
import CelestialBodiesGrid from '../components/CelestialBodiesGrid';

const TestCelestialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900 dark:text-indigo-100">
          🌌 Test de Otros Cuerpos Celestes
        </h1>
        <CelestialBodiesGrid />
      </div>
    </div>
  );
};

export default TestCelestialPage;
