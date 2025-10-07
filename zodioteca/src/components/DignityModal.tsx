import React from 'react';
import type { Dignity } from '../types/dignity';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface DignityModalProps {
  dignity: Dignity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DignityModal: React.FC<DignityModalProps> = ({ dignity, isOpen, onClose }) => {
  if (!isOpen || !dignity) return null;

  const getDignityGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Domicilio (Regencia)': 'from-yellow-500 to-amber-600',
      'Exaltación': 'from-white to-yellow-200',
      'Exilio (Detrimento)': 'from-gray-500 to-gray-700',
      'Caída': 'from-blue-800 to-indigo-900',
      'Recepción Mutua': 'from-green-500 to-emerald-600',
      'Triplicidad': 'from-red-500 to-orange-600',
      'Decanatos': 'from-purple-500 to-pink-600',
      'Términos / Límites': 'from-amber-700 to-brown-800',
      'Faces (Faz/Decan)': 'from-violet-400 to-purple-500'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const gradient = getDignityGradient(dignity.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={dignity.name}
      subtitle="Dignidad Planetaria"
      icon={dignity.symbol}
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 modal-content">
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {dignity.description}
            </p>
          </div>

          {/* Ejemplo */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              💡 Ejemplo
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {dignity.example}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {dignity.shadows}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{dignity.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{dignity.chakra}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge */}
          <FrequencyBadge
            frequency={dignity.frequency + ' Hz'}
            onClose={onClose}
          />

          {/* Ejercicio Holístico */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
              🌟 Ejercicio Holístico
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {dignity.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default DignityModal;
