import React, { useState } from 'react';
import { ASTEROIDS } from '../types/asteroid';
import type { Asteroid } from '../types/asteroid';
import AsteroidModal from './AsteroidModal';

const AsteroidsGrid: React.FC = () => {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const getAsteroidGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Ceres': 'from-green-500 to-emerald-600',
      'Palas Atenea': 'from-indigo-600 to-blue-700',
      'Juno': 'from-pink-500 to-rose-600',
      'Vesta': 'from-orange-500 to-red-600',
      'Hygiea': 'from-green-600 to-lime-700',
      'Eros': 'from-red-600 to-pink-700',
      'Psique': 'from-purple-600 to-violet-700'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-purple-900 dark:text-purple-200 flex items-center gap-2">
          ☄️ ¿Qué son los Asteroides?
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          Los asteroides son cuerpos celestes que orbitan entre Marte y Júpiter. En astrología, 
          los <strong>4 asteroides principales</strong> (Ceres, Palas, Juno, Vesta) representan arquetipos 
          femeninos fundamentales que complementan la información de los planetas tradicionales. Otros asteroides 
          como Eros, Psique e Hygiea añaden matices específicos sobre amor, alma y salud.
        </p>
      </div>

      {/* Grid de Asteroides */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ASTEROIDS.map((asteroid) => (
          <button
            key={asteroid.name}
            onClick={() => setSelectedAsteroid(asteroid)}
            className={`bg-gradient-to-br ${getAsteroidGradient(asteroid.name)} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-3`}
          >
            <span className="text-6xl">{asteroid.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-lg">{asteroid.name}</h3>
              <p className="text-sm opacity-90 mt-1">{asteroid.chakra}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ☄️ Los 4 Asteroides Principales
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Ceres:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Nutrición, maternidad, ciclos de vida</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🦉</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Palas Atenea:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Sabiduría, estrategia, creatividad</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">💍</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Juno:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Compromiso, matrimonio, lealtad</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Vesta:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Fuego sagrado, devoción, servicio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedAsteroid && (
        <AsteroidModal
          asteroid={selectedAsteroid}
          onClose={() => setSelectedAsteroid(null)}
        />
      )}
    </div>
  );
};

export default AsteroidsGrid;
