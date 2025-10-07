import React from 'react';
import type { RelationalTechnique } from '../types/relational';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface RelationalModalProps {
  technique: RelationalTechnique | null;
  isOpen: boolean;
  onClose: () => void;
}

const RelationalModal: React.FC<RelationalModalProps> = ({ technique, isOpen, onClose }) => {
  if (!isOpen || !technique) return null;

  const getTechniqueGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Sinastría': 'from-pink-500 to-rose-600',
      'Carta Compuesta': 'from-purple-500 to-violet-600',
      'Carta Davison': 'from-indigo-500 to-purple-700',
      'Astrocartografía Relacional': 'from-blue-500 to-cyan-600',
      'Tránsitos a la Compuesta/Davison': 'from-amber-500 to-orange-600',
      'Sinastría Kármica': 'from-violet-600 to-fuchsia-700'
    };
    return gradients[name] || 'from-pink-500 to-purple-600';
  };

  const gradient = getTechniqueGradient(technique.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={technique.name}
      subtitle="Técnica Relacional"
      icon="💞"
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 modal-content">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {technique.description}
            </p>
          </div>

          {/* Aspectos Clave */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              🔑 Aspectos Clave
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {technique.keyAspects}
            </p>
          </div>

          {/* Ejemplo Práctico */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
              💡 Ejemplo Práctico
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {technique.practicalExample}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {technique.shadows}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakras:</span>
                <p className="text-gray-600 dark:text-gray-400">{technique.chakras}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge */}
          <FrequencyBadge
            frequency={technique.frequency + ' Hz'}
            onClose={onClose}
          />

          {/* Ejercicio Holístico */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
              🌟 Ejercicio Holístico
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {technique.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default RelationalModal;
