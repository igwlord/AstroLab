import React, { useEffect, useRef } from 'react';
import type { Polarization } from '../types/polarization';

interface PolarizationModalProps {
  polarization: Polarization;
  onClose: () => void;
}

const PolarizationModal: React.FC<PolarizationModalProps> = ({ polarization, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const playFrequency = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
  const frequencyNumber = typeof polarization.frequency === 'number' ? polarization.frequency : 528;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} text-white p-8 rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-7xl">{polarization.symbol}</span>
              <div>
                <h2 className="text-3xl font-bold">{polarization.name}</h2>
                <p className="text-xl opacity-90">
                  {polarization.category === 'type' ? 'Tipo de Polarización' : 'Ejemplo Planetario'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
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
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{polarization.frequency} Hz</p>
              </div>
              {typeof polarization.frequency === 'number' && (
                <>
                  <button
                    onClick={playFrequency}
                    className={`w-full px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    ▶ Reproducir Frecuencia
                  </button>
                  <audio
                    ref={audioRef}
                    src={`/media/${frequencyNumber}.mp3`}
                    preload="none"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolarizationModal;
