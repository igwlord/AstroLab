import React from 'react';
import type { Polarization } from '../types/polarization';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface PolarizationModalProps {
  polarization: Polarization | null;
  isOpen: boolean;
  onClose: () => void;
}

const PolarizationModal: React.FC<PolarizationModalProps> = ({ polarization, isOpen, onClose }) => {
  if (!isOpen || !polarization) return null;

  const getPolarizationGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Polarización por Planeta': 'from-indigo-600 to-purple-700',
      'Polarización por Signo': 'from-blue-600 to-indigo-700',
      'Polarización por Elemento': 'from-red-500 to-orange-600',
      'Polarización por Modalidad': 'from-yellow-500 to-amber-600',
      'Neptuno Polarizado': 'from-violet-600 to-purple-700',
      'Saturno Polarizado': 'from-gray-800 to-gray-900',
      'Marte Polarizado': 'from-red-600 to-rose-700',
      'Venus Polarizado': 'from-pink-500 to-rose-600'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const gradient = getPolarizationGradient(polarization.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={polarization.name}
      subtitle="Polarización Astrológica"
      icon={polarization.symbol}
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 modal-content">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {polarization.description}
            </p>
          </div>

          {/* Ejemplo */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              💡 Ejemplo
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {polarization.example}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {polarization.shadows}
            </p>
          </div>

          {/* Integración */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">
              ⚖️ Integración
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {polarization.integration}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{polarization.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{polarization.chakra}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge */}
          <FrequencyBadge
            frequency={polarization.frequency + ' Hz'}
            onClose={onClose}
          />
        </div>
    </StandardModal>
  );
};

export default PolarizationModal;
