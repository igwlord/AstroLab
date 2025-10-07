import React from 'react';
import type { Configuration } from '../types/configuration';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface ConfigurationModalProps {
  configuration: Configuration | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ configuration, isOpen, onClose }) => {
  if (!isOpen || !configuration) return null;

  const getConfigGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Stellium': 'from-yellow-500 to-amber-600',
      'Gran Trígono': 'from-green-500 to-emerald-600',
      'T-Cuadrada (T-Square)': 'from-red-600 to-rose-700',
      'Cruz Cósmica (Gran Cuadratura)': 'from-gray-900 to-red-900',
      'Yod (El Dedo de Dios)': 'from-purple-600 to-violet-700',
      'Cometa (Figura de la Cometa)': 'from-cyan-500 to-blue-600',
      'Kite (Cometa Alado)': 'from-amber-500 to-purple-600'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const gradient = getConfigGradient(configuration.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={configuration.name}
      subtitle="Configuración Planetaria"
      icon={configuration.symbol}
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 modal-content">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {configuration.description}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              ✨ Manifestación Cotidiana
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {configuration.manifestation}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {configuration.shadows}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{configuration.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{configuration.chakra}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge */}
          <FrequencyBadge
            frequency={configuration.frequency + ' Hz'}
            onClose={onClose}
          />

          {/* Ejercicio Holístico */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
              🌟 Ejercicio Holístico
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {configuration.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default ConfigurationModal;
