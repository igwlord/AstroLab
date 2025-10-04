import React, { useEffect, useRef } from 'react';
import type { RelationalTechnique } from '../types/relational';

interface RelationalModalProps {
  technique: RelationalTechnique;
  onClose: () => void;
}

const RelationalModal: React.FC<RelationalModalProps> = ({ technique, onClose }) => {
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
  const frequencyNumber = typeof technique.frequency === 'number' ? technique.frequency : 639;

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
              <span className="text-7xl">{technique.symbol}</span>
              <div>
                <h2 className="text-3xl font-bold">{technique.name}</h2>
                <p className="text-xl opacity-90">
                  {technique.category === 'main' ? 'Técnica Principal' : 'Técnica Complementaria'}
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakras:</span>
                <p className="text-gray-600 dark:text-gray-400">{technique.chakras}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{technique.frequency} Hz</p>
              </div>
            </div>
            <div className="space-y-3">
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
              {technique.exercise}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationalModal;
