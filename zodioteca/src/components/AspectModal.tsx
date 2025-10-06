import React, { useRef } from 'react';
import type { Aspect } from '../types/aspect';
import StandardModal from './StandardModal';

interface AspectModalProps {
  aspect: Aspect | null;
  isOpen: boolean;
  onClose: () => void;
}

const AspectModal: React.FC<AspectModalProps> = ({ aspect, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFrequency = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  if (!isOpen || !aspect) return null;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'major':
        return {
          gradient: 'from-blue-600 to-purple-600',
          text: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'minor':
        return {
          gradient: 'from-indigo-600 to-violet-600',
          text: 'text-indigo-600 dark:text-indigo-400',
          bg: 'bg-indigo-50 dark:bg-indigo-900/20'
        };
      case 'creative':
        return {
          gradient: 'from-amber-600 to-orange-600',
          text: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-900/20'
        };
      default:
        return {
          gradient: 'from-gray-600 to-gray-800',
          text: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-900/20'
        };
    }
  };

  const styles = getCategoryStyles(aspect.category);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={aspect.name}
      subtitle={aspect.angle}
      icon={aspect.symbol}
      gradientColors={styles.gradient}
    >
      <div className={`${styles.bg} modal-content`}>
        {/* Badges */}
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <span className="modal-badge bg-white/20 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            {aspect.polarity}
          </span>
          <span className="modal-badge bg-white/20 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            Orbe: {aspect.orb}
          </span>
        </div>
          {/* Descripción */}
          <div>
            <h3 className="modal-h4 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="modal-text text-gray-700 dark:text-gray-300">
              {aspect.description}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className={`${styles.bg} modal-section`}>
            <h3 className={`modal-h4 ${styles.text}`}>
              ✨ Manifestación Cotidiana
            </h3>
            <p className="modal-text text-gray-700 dark:text-gray-300">
              {aspect.manifestation}
            </p>
          </div>

          {/* Propiedades */}
          <div className="modal-grid">
            <div className="space-y-2 sm:space-y-3">
              <div>
                <span className="modal-text-sm font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="modal-text-sm text-gray-600 dark:text-gray-400">{aspect.color}</p>
              </div>
              <div>
                <span className="modal-text-sm font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="modal-text-sm text-gray-600 dark:text-gray-400">{aspect.chakra}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <span className="modal-text-sm font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="modal-text-sm text-gray-600 dark:text-gray-400">{aspect.frequency} Hz</p>
              </div>
              <button
                onClick={playFrequency}
                className={`w-full px-3 py-2 sm:px-4 text-sm sm:text-base bg-gradient-to-r ${styles.gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                ▶ <span className="hidden sm:inline">Reproducir </span>Frecuencia
              </button>
              <audio
                ref={audioRef}
                src={`/media/${aspect.frequency}.mp3`}
                preload="none"
              />
            </div>
          </div>

          {/* Ejercicio Holístico */}
          <div className="modal-section bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="modal-h4 text-purple-800 dark:text-purple-300">
              🌟 Ejercicio Holístico
            </h3>
            <p className="modal-text text-gray-700 dark:text-gray-300">
              {aspect.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default AspectModal;
