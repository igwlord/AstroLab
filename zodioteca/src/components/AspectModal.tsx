import React, { useEffect, useRef } from 'react';
import type { Aspect } from '../types/aspect';

interface AspectModalProps {
  aspect: Aspect;
  onClose: () => void;
}

const AspectModal: React.FC<AspectModalProps> = ({ aspect, onClose }) => {
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
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${styles.gradient} text-white p-8 rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-7xl">{aspect.symbol}</span>
              <div>
                <h2 className="text-3xl font-bold">{aspect.name}</h2>
                <p className="text-xl opacity-90">{aspect.angle}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {aspect.polarity}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              Orbe: {aspect.orb}
            </span>
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
              {aspect.description}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className={`${styles.bg} p-4 rounded-lg`}>
            <h3 className={`text-lg font-semibold mb-2 ${styles.text}`}>
              ✨ Manifestación Cotidiana
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {aspect.manifestation}
            </p>
          </div>

          {/* Propiedades */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{aspect.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{aspect.chakra}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{aspect.frequency} Hz</p>
              </div>
              <button
                onClick={playFrequency}
                className={`w-full px-4 py-2 bg-gradient-to-r ${styles.gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                ▶ Reproducir Frecuencia
              </button>
              <audio
                ref={audioRef}
                src={`/media/${aspect.frequency}.mp3`}
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
              {aspect.exercise}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectModal;
