import React, { useState } from 'react';
import { HOLISTIC_EXERCISES } from '../data/holisticExercises';
import type { HolisticSignData } from '../data/holisticExercises';

interface SignatureFlipCardProps {
  signatureSign: string;
  modality: string;
  element: string;
  elementDominance: Array<{ name: string; points: number; percentage: number }>;
  modalities: Array<{ name: string; count: number; percentage: number }>;
}

const SignatureFlipCard: React.FC<SignatureFlipCardProps> = ({
  signatureSign,
  modality,
  element,
  elementDominance,
  modalities,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
    'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
  };

  const elementSymbols: Record<string, string> = {
    'Fuego': '🔥',
    'Tierra': '🌍',
    'Aire': '💨',
    'Agua': '💧'
  };

  // Obtener datos holísticos del signo
  const holisticData: HolisticSignData | undefined = HOLISTIC_EXERCISES[signatureSign];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="pt-4 border-t-2 border-purple-300 dark:border-purple-600 perspective-1000">
      <div 
        className={`relative w-full transition-transform duration-700 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* FRONT SIDE - Original Design */}
        <div className={`backface-hidden ${isFlipped ? 'pointer-events-none' : ''}`}>
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 sm:border-4 border-amber-300 dark:border-amber-600 shadow-xl">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-4xl">✨</span>
              <h4 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                Firma Astrológica
              </h4>
              <span className="text-2xl sm:text-4xl">✨</span>
            </div>

            {/* Signo Resultante */}
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-3 sm:mb-4 border-2 border-amber-200 dark:border-amber-700 shadow-lg">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">
                  Tu Signo Dominante
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  <span className="text-4xl sm:text-6xl">{signSymbols[signatureSign] || '♌'}</span>
                  <div>
                    <p className="text-2xl sm:text-4xl font-black text-amber-700 dark:text-amber-300">
                      {signatureSign}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {modality} + {element}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {/* Elemento Dominante */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg sm:rounded-xl p-2 sm:p-4 border-2 border-red-200 dark:border-red-700">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <span className="text-lg sm:text-2xl">{elementSymbols[elementDominance[0].name] || '🔥'}</span>
                  <h5 className="text-xs sm:text-sm font-bold text-red-900 dark:text-red-100 uppercase">Elemento</h5>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {elementDominance.map((el, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <span className="text-xs sm:text-base">{elementSymbols[el.name]}</span>
                        <span className={idx === 0 ? 'font-bold text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}>
                          {el.name}
                        </span>
                      </span>
                      <span className={idx === 0 ? 'font-bold text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}>
                        {el.points}pts ({el.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modalidad Dominante */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl p-2 sm:p-4 border-2 border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <span className="text-lg sm:text-2xl">⚡</span>
                  <h5 className="text-xs sm:text-sm font-bold text-purple-900 dark:text-purple-100 uppercase">Modalidad</h5>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {modalities.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className={idx === 0 ? 'font-bold text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}>
                        {mod.name}
                      </span>
                      <span className={idx === 0 ? 'font-bold text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'}>
                        {mod.count}pl ({mod.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hint para dar vuelta */}
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700 flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg">👆</span>
              <p className="text-[10px] sm:text-xs text-center text-amber-800 dark:text-amber-200 font-semibold">
                Toca para ver ejercicios holísticos
              </p>
              <span className="text-base sm:text-lg">🔄</span>
            </div>
          </div>
        </div>

        {/* BACK SIDE - Holistic Exercises */}
        <div 
          className={`absolute inset-0 backface-hidden rotate-y-180 ${!isFlipped ? 'pointer-events-none' : ''}`}
          style={{ backgroundColor: holisticData?.color || '#9333ea' }}
        >
          <div className="rounded-xl sm:rounded-2xl p-3 sm:p-6 border-2 sm:border-4 border-white/30 shadow-xl h-full overflow-y-auto">
            {holisticData ? (
              <div className="text-white space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="text-center border-b-2 border-white/30 pb-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl sm:text-5xl">{signSymbols[signatureSign]}</span>
                    <h4 className="text-xl sm:text-3xl font-black">
                      {signatureSign}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm opacity-90">
                    {holisticData.element} • {holisticData.modality}
                  </p>
                </div>

                {/* Sacred Geometry & Frequency */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3">
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs opacity-80 uppercase font-semibold mb-1">Geometría Sagrada</p>
                    <p className="text-sm sm:text-lg font-bold">{holisticData.geometry}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs opacity-80 uppercase font-semibold mb-1">Frecuencia</p>
                    <p className="text-sm sm:text-lg font-bold">{holisticData.frequency}</p>
                  </div>
                </div>

                {/* Exercises */}
                <div>
                  <h5 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                    <span>🧘</span>
                    Ejercicios de Integración
                  </h5>
                  <div className="space-y-2">
                    {holisticData.exercises.map((exercise, idx) => (
                      <div key={idx} className="bg-white/10 rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs">
                        <p className="font-bold mb-1">{idx + 1}. {exercise.title}</p>
                        <p className="opacity-90 mb-1"><strong>Objetivo:</strong> {exercise.goal}</p>
                        <ol className="list-decimal list-inside space-y-0.5 opacity-90 ml-1">
                          {exercise.steps.map((step, stepIdx) => (
                            <li key={stepIdx}>{step}</li>
                          ))}
                        </ol>
                        {exercise.mantra && (
                          <p className="mt-1 italic opacity-80">💫 Mantra: "{exercise.mantra}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crystals */}
                <div>
                  <h5 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                    <span>💎</span>
                    Cristales Recomendados
                  </h5>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {holisticData.crystals.map((crystal, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold"
                      >
                        {crystal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Aromas */}
                <div>
                  <h5 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
                    <span>🌿</span>
                    Aromas & Aceites
                  </h5>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {holisticData.aromas.map((aroma, idx) => (
                      <span 
                        key={idx} 
                        className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold"
                      >
                        {aroma}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frequency Reference */}
                <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
                  <p className="text-[10px] sm:text-xs opacity-90">
                    🎵 Encuentra música de <strong>{holisticData.frequency}</strong> en la sección <strong>'Frecuencias'</strong> de la app
                  </p>
                </div>

                {/* Back hint */}
                <div className="pt-2 border-t border-white/30 flex items-center justify-center gap-2">
                  <span className="text-base sm:text-lg">👆</span>
                  <p className="text-[10px] sm:text-xs text-center font-semibold opacity-90">
                    Toca para volver
                  </p>
                  <span className="text-base sm:text-lg">🔄</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <p className="text-sm">No hay datos disponibles para este signo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for 3D flip effect */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default SignatureFlipCard;
