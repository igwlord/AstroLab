import { ADVANCED_DIMENSIONS } from '../types/advancedDimension';

export default function AdvancedDimensionsGrid() {
  
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-purple-900 dark:text-purple-200 flex items-center gap-1.5 sm:gap-2">
          🌠 ¿Qué son las Dimensiones Astrológicas?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          Son técnicas avanzadas que exploran diferentes capas de la práctica astrológica: desde la carta dracónica que revela el alma, 
          hasta la astrocartografía que mapea tu energía en el mundo. Cada dimensión ofrece una perspectiva única para el autoconocimiento y la sanación.
        </p>
      </div>

      {/* Grid de Dimensiones */}
      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {ADVANCED_DIMENSIONS.map((dimension) => (
          <div
            key={dimension.id}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6
              bg-gradient-to-br ${dimension.gradient} text-white
              shadow-lg border-2 ${dimension.border}`}
          >
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl">
                    {dimension.icon}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{dimension.name}</h3>
                    <p className="text-xs sm:text-sm opacity-90">{dimension.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                  {dimension.frequency}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 opacity-95 line-clamp-3">
                {dimension.description}
              </p>

              {/* Ejercicios */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold opacity-90">Ejercicios Holísticos:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {dimension.exercises.map((exercise, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-base sm:text-lg">{exercise.icon}</span>
                        <span className="text-xs sm:text-sm font-medium">{exercise.title}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs opacity-80 line-clamp-2">{exercise.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer - Chakra y Duración */}
              {dimension.chakra && (
                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                    <span className="opacity-70">Chakra:</span>
                    <span className="font-medium">{dimension.chakra}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                    <span className="opacity-70">⏱️</span>
                    <span className="font-medium">{dimension.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Nota final */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-purple-200 dark:border-purple-700">
        <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200 text-center">
          💫 Cada dimensión astrológica ofrece una ventana única hacia el autoconocimiento. 
          Explora estas técnicas con la guía de un astrólogo profesional para profundizar tu comprensión.
        </p>
      </div>
    </div>
  );
}
