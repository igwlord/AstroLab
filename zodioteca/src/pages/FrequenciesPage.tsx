import { useState } from 'react';
import { ZODIAC_FREQUENCIES, getFrequencyOfTheDay } from '../data/zodiacFrequencies';
import ZodiacWheel from '../components/ZodiacWheel';
import FrequencyInfoPanel from '../components/FrequencyInfoPanel';

const FrequenciesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const frequencyOfTheDay = getFrequencyOfTheDay();
  const selectedFrequency = ZODIAC_FREQUENCIES.find(f => f.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 md:mb-4">
          Frecuencias Zodiacales
        </h1>
        <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300 px-2">
          Medita con sonidos holísticos y ejercicios de integración
        </p>
      </div>

      {/* Frequency of the Day Banner - Compacto */}
      <div 
        className="relative rounded-xl p-3 sm:p-4 mb-6 shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${frequencyOfTheDay.color.hex}dd, ${frequencyOfTheDay.color.hex}99)`,
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
              <span className="text-2xl sm:text-3xl">{frequencyOfTheDay.symbol}</span>
            </div>
            <div className="text-white">
              <p className="text-[10px] sm:text-xs font-semibold opacity-80">⭐ Frecuencia del Día</p>
              <p className="text-base sm:text-lg font-bold">{frequencyOfTheDay.name}</p>
            </div>
          </div>
          <div className="text-white text-right hidden sm:block">
            <p className="text-xs opacity-80">Solfeggio</p>
            <p className="text-lg font-bold">{frequencyOfTheDay.frequency} Hz</p>
          </div>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="absolute inset-0 rounded-full bg-white blur-2xl"></div>
        </div>
      </div>

      {/* Zodiac Wheel */}
      <div className="mb-6 sm:mb-8">
        <ZodiacWheel
          frequencies={ZODIAC_FREQUENCIES}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Panel de información del signo seleccionado */}
      {selectedFrequency && (
        <FrequencyInfoPanel frequency={selectedFrequency} />
      )}
    </div>
  );
};

export default FrequenciesPage;