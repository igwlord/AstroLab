import React, { useEffect, useRef } from 'react';
import type { Configuration } from '../types/configuration';

interface ConfigurationModalProps {
  configuration: Configuration;
  onClose: () => void;
}

const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ configuration, onClose }) => {
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
  const frequencyNumber = typeof configuration.frequency === 'number' ? configuration.frequency : 528;

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
              <span className="text-7xl">{configuration.symbol}</span>
              <div>
                <h2 className="text-3xl font-bold">{configuration.name}</h2>
                <p className="text-xl opacity-90">Configuración Planetaria</p>
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
          <div className="grid md:grid-cols-2 gap-4">
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
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{configuration.frequency} Hz</p>
              </div>
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
            </div>
          </div>

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
      </div>
    </div>
  );
};

export default ConfigurationModal;
