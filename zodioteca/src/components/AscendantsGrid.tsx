import React, { useState } from 'react';
import { ASCENDANTS } from '../types/ascendant';
import type { Ascendant } from '../types/ascendant';
import AscendantModal from './AscendantModal';

const AscendantsGrid: React.FC = () => {
  const [selectedAscendant, setSelectedAscendant] = useState<Ascendant | null>(null);

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

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-orange-900 dark:text-orange-200 flex items-center gap-1.5 sm:gap-2">
          🌅 ¿Qué es el Ascendente?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          El Ascendente es el signo que estaba en el horizonte Este en el momento exacto de tu nacimiento. 
          Representa tu <strong>máscara social</strong>, cómo te presentas al mundo, tu primera impresión y tu forma 
          de abordar la vida. <span className="hidden sm:inline">Es la puerta de entrada a tu carta natal.</span>
        </p>
      </div>

      {/* Grid de Ascendentes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {ASCENDANTS.map((ascendant) => (
          <button
            key={ascendant.sign}
            onClick={() => setSelectedAscendant(ascendant)}
            className={`bg-gradient-to-br ${getSignColor(ascendant.sign)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">{ascendant.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">ASC en {ascendant.sign}</h3>
              <p className="text-xs sm:text-sm opacity-90 mt-0.5 sm:mt-1">🌅</p>
            </div>
          </button>
        ))}
      </div>

      {/* Nota importante */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 md:p-4 rounded-lg border-l-2 sm:border-l-4 border-blue-500">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Nota:</strong> Para conocer tu Ascendente necesitas la hora exacta de nacimiento. 
          <span className="hidden sm:inline"> El Ascendente cambia aproximadamente cada 2 horas, por lo que incluso una diferencia de minutos puede cambiar tu signo ascendente.</span>
        </p>
      </div>

      {/* Modal */}
      <AscendantModal
        ascendant={selectedAscendant}
        isOpen={selectedAscendant !== null}
        onClose={() => setSelectedAscendant(null)}
      />
    </div>
  );
};

export default AscendantsGrid;
