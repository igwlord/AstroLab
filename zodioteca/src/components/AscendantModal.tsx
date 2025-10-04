import React, { useRef } from 'react';
import type { Ascendant } from '../types/ascendant';
import StandardModal from './StandardModal';

interface AscendantModalProps {
  ascendant: Ascendant | null;
  isOpen: boolean;
  onClose: () => void;
}

const AscendantModal: React.FC<AscendantModalProps> = ({ ascendant, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFrequency = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  if (!isOpen || !ascendant) return null;

  const getSignColor = (sign: string) => {
    const colors: { [key: string]: string } = {
      'Aries': 'from-red-500 to-orange-600',
      'Tauro': 'from-green-600 to-emerald-700',
      'Géminis': 'from-yellow-400 to-amber-500',
      'Cáncer': 'from-blue-400 to-cyan-500',
      'Leo': 'from-yellow-500 to-orange-600',
      'Virgo': 'from-green-700 to-lime-600',
      'Libra': 'from-pink-400 to-rose-500',
      'Escorpio': 'from-red-900 to-purple-900',
      'Sagitario': 'from-purple-600 to-indigo-700',
      'Capricornio': 'from-gray-700 to-slate-900',
      'Acuario': 'from-cyan-500 to-blue-600',
      'Piscis': 'from-purple-500 to-violet-700'
    };
    return colors[sign] || 'from-purple-600 to-pink-600';
  };

  const gradient = getSignColor(ascendant.sign);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ascendente en ${ascendant.sign}`}
      subtitle="🌅 Primera impresión"
      icon={ascendant.symbol}
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 space-y-6">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {ascendant.description}
            </p>
          </div>

          {/* Manifestación Cotidiana */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              ✨ Manifestación Cotidiana
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {ascendant.manifestation}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {ascendant.shadows}
            </p>
          </div>

          {/* Regente */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-300">
              👑 Regente
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {ascendant.ruler}
            </p>
          </div>

          {/* Propiedades */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎨 Color:</span>
                <p className="text-gray-600 dark:text-gray-400">{ascendant.color}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{ascendant.chakra}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🎵 Frecuencia:</span>
                <p className="text-gray-600 dark:text-gray-400">{ascendant.frequency} Hz</p>
              </div>
              <button
                onClick={playFrequency}
                className={`w-full px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                ▶ Reproducir Frecuencia
              </button>
              <audio
                ref={audioRef}
                src={`/media/${ascendant.frequency}.mp3`}
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
              {ascendant.exercise}
            </p>
          </div>
        </div>
    </StandardModal>
  );
};

export default AscendantModal;
