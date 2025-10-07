import React from 'react';
import type { Asteroid } from '../types/asteroid';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface AsteroidModalProps {
  asteroid: Asteroid | null;
  isOpen: boolean;
  onClose: () => void;
}

const AsteroidModal: React.FC<AsteroidModalProps> = ({ asteroid, isOpen, onClose }) => {
  if (!isOpen || !asteroid) return null;

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

  const gradient = getAsteroidGradient(asteroid.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={asteroid.name}
      subtitle="Asteroide"
      icon={asteroid.symbol}
      gradientColors={gradient}
    >
      <div className="p-8 space-y-6">
          {/* Mitología */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📜 Mitología y Arquetipo
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {asteroid.mythology}
            </p>
          </div>

          {/* Función Astrológica */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              ✨ Función Astrológica
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {asteroid.function}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
              🌟 Manifestación en la Vida Cotidiana
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {asteroid.manifestation}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras y Bloqueos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {asteroid.shadows}
            </p>
          </div>

          {/* Relaciones */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-300">
              🔗 Relación con Casas y Planetas
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {asteroid.relations}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{asteroid.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{asteroid.chakra}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">💎 Piedra:</span>
                <p className="text-gray-600 dark:text-gray-400">{asteroid.stone}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge - Reemplaza el reproductor */}
          <FrequencyBadge
            frequency={`${asteroid.frequency} Hz`}
            onClose={onClose}
          />

        {/* Ejercicio Holístico */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
            🌟 Ejercicio Holístico
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            {asteroid.exercise}
          </p>
        </div>
      </div>
    </StandardModal>
  );
};

export default AsteroidModal;
