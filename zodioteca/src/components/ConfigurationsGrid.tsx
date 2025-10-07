import React, { useState } from 'react';
import { CONFIGURATIONS } from '../types/configuration';
import type { Configuration } from '../types/configuration';
import ConfigurationModal from './ConfigurationModal';

const ConfigurationsGrid: React.FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);

  const getConfigGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Stellium': 'from-yellow-500 to-amber-600',
      'Gran Trígono': 'from-green-500 to-emerald-600',
      'T-Cuadrada (T-Square)': 'from-red-600 to-rose-700',
      'Cruz Cósmica (Gran Cuadratura)': 'from-gray-900 to-red-900',
      'Yod (El Dedo de Dios)': 'from-purple-600 to-violet-700',
      'Cometa (Figura de la Cometa)': 'from-cyan-500 to-blue-600',
      'Kite (Cometa Alado)': 'from-amber-500 to-purple-600'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-amber-900 dark:text-amber-200 flex items-center gap-1.5 sm:gap-2">
          ⚡ ¿Qué son las Configuraciones Planetarias?
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
          Las configuraciones planetarias son <strong>patrones geométricos</strong> formados por varios planetas 
          conectados mediante aspectos<span className="hidden sm:inline">. Estas figuras crean dinámicas especiales en la carta natal que pueden 
          indicar <strong>talentos extraordinarios, desafíos recurrentes o destinos kármicos</strong>. Son como 
          "firmas energéticas" que marcan la vida de forma profunda</span>.
        </p>
      </div>

      {/* Grid de Configuraciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {CONFIGURATIONS.map((config) => (
          <button
            key={config.name}
            data-id={config.name.toLowerCase()}
            onClick={() => setSelectedConfig(config)}
            className={`bg-gradient-to-br ${getConfigGradient(config.name)} text-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3`}
          >
            <span className="text-4xl sm:text-5xl md:text-6xl">{config.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-xs sm:text-sm leading-tight">{config.name}</h3>
              <p className="text-[10px] sm:text-xs opacity-90 mt-0.5 sm:mt-1">{config.chakra}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          ⚡ Tipos de Configuraciones
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌟</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Stellium:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Concentración de 3+ planetas (foco vital)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔺</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Gran Trígono:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Triángulo de 120° (talentos naturales)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">⛓️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">T-Cuadrada:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Tensión dinámica (impulso de crecimiento)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">✝️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Cruz Cósmica:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Máxima tensión (resiliencia extrema)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">☝️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Yod:</strong>
              <span className="text-gray-600 dark:text-gray-400"> El Dedo de Dios (destino kármico)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌠</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Cometa:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Talento canalizado (dirección clara)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Nota:</strong> No todas las cartas natales tienen configuraciones planetarias. 
          Cuando aparecen, suelen ser uno de los indicadores más importantes de la vida de la persona.
        </p>
      </div>

      {/* Modal */}
      <ConfigurationModal
        configuration={selectedConfig}
        isOpen={selectedConfig !== null}
        onClose={() => setSelectedConfig(null)}
      />
    </div>
  );
};

export default ConfigurationsGrid;
