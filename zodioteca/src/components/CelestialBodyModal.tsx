import React, { useRef } from 'react';
import type { CelestialBody } from '../types/celestialBody';
import StandardModal from './StandardModal';

interface CelestialBodyModalProps {
  celestialBody: CelestialBody | null;
  isOpen: boolean;
  onClose: () => void;
}

const CelestialBodyModal: React.FC<CelestialBodyModalProps> = ({ celestialBody, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFrequency = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  if (!isOpen || !celestialBody) return null;

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'shadow':
        return 'from-gray-900 to-red-900';
      case 'healer':
        return 'from-purple-600 to-violet-700';
      case 'centaur':
        return 'from-amber-700 to-red-800';
      case 'transneptunian':
        return 'from-indigo-800 to-purple-900';
      case 'comet':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-purple-600 to-pink-600';
    }
  };

  const gradient = getCategoryGradient(celestialBody.category);
  const frequencyNumber = typeof celestialBody.frequency === 'number' ? celestialBody.frequency : 639;

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={celestialBody.name}
      subtitle="Cuerpo Celeste"
      icon={celestialBody.symbol}
      gradientColors={gradient}
    >
      <div className="p-8 space-y-6">
          {/* Mitología */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📜 Mitología
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {celestialBody.mythology}
            </p>
          </div>

          {/* Astrología */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              ✨ Significado Astrológico
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {celestialBody.astrology}
            </p>
          </div>

          {/* Manifestación */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
              🌟 Manifestación
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {celestialBody.manifestation}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {celestialBody.shadows}
            </p>
          </div>

          {/* Relaciones */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-300">
              🔗 Relaciones con Casas y Planetas
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {celestialBody.relations}
            </p>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{celestialBody.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{celestialBody.chakra}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">💎 Piedra:</span>
                <p className="text-gray-600 dark:text-gray-400">{celestialBody.stone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{celestialBody.frequency} Hz</p>
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
            {celestialBody.exercise}
          </p>
        </div>
      </div>
    </StandardModal>
  );
};

export default CelestialBodyModal;
