import React, { useRef } from 'react';
import type { MoonSign } from '../types/moonSign';
import StandardModal from './StandardModal';

interface MoonSignModalProps {
  moonSign: MoonSign | null;
  isOpen: boolean;
  onClose: () => void;
}

const MoonSignModal: React.FC<MoonSignModalProps> = ({ moonSign, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFrequency = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  if (!isOpen || !moonSign) return null;

  const getElementStyles = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fuego':
        return {
          gradient: 'from-red-500 to-orange-600',
          text: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20'
        };
      case 'tierra':
        return {
          gradient: 'from-green-600 to-emerald-700',
          text: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20'
        };
      case 'aire':
        return {
          gradient: 'from-yellow-400 to-amber-500',
          text: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        };
      case 'agua':
        return {
          gradient: 'from-blue-500 to-cyan-600',
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      default:
        return {
          gradient: 'from-purple-600 to-pink-600',
          text: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-900/20'
        };
    }
  };

  const styles = getElementStyles(moonSign.element);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Luna en ${moonSign.sign}`}
      subtitle={moonSign.element}
      icon="🌙"
      gradientColors={styles.gradient}
    >
      <div className={`${styles.bg} modal-content`}>
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {moonSign.description}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className={`${styles.bg} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold mb-2 ${styles.text}`}>
              ✨ Manifestación Cotidiana
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {moonSign.manifestation}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {moonSign.shadows}
            </p>
          </div>

          {/* Propiedades */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{moonSign.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{moonSign.chakra}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{moonSign.frequency} Hz</p>
              </div>
              <button
                onClick={playFrequency}
                className={`w-full px-4 py-2 bg-gradient-to-r ${styles.gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                ▶ Reproducir Frecuencia
              </button>
              <audio
                ref={audioRef}
                src={`/media/${moonSign.frequency}.mp3`}
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
              {moonSign.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default MoonSignModal;
