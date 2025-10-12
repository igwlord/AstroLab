import React from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';
import FavoriteToggleButton from './FavoriteToggleButton';

interface FrequencyInfoPanelProps {
  frequency: ZodiacFrequency;
}

const FrequencyInfoPanel: React.FC<FrequencyInfoPanelProps> = ({ frequency }) => {
  return (
    <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-700 overflow-hidden">
      {/* Header compacto con gradiente del color del signo */}
      <div 
        className="relative p-4 sm:p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${frequency.color.hex}dd, ${frequency.color.hex}88)`,
        }}
      >
        {/* Botón de Favorito - Posición absoluta en esquina superior derecha */}
        <div className="absolute top-3 right-3 z-20">
          <FavoriteToggleButton
            item={{
              type: 'frequency-exercise',
              scope: 'global',
              title: `${frequency.name} - ${frequency.exercise.title}`,
              icon: frequency.symbol,
              route: `/frequencies?sign=${frequency.id}`,
              targetId: frequency.id,
              tags: ['Frecuencias', frequency.element, `${frequency.frequency}Hz`],
              pinned: false,
            }}
            size="sm"
            variant="amber"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl drop-shadow-lg">{frequency.symbol}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold drop-shadow-md">{frequency.name}</h2>
              <p className="text-xs sm:text-sm opacity-90">{frequency.element} • {frequency.dates}</p>
            </div>
          </div>
          
          {/* Información compacta de frecuencia y chakra */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs opacity-80">Frecuencia</p>
              <p className="text-xl font-bold">{frequency.frequency} Hz</p>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="text-right">
              <p className="text-xs opacity-80">Chakra</p>
              <p className="text-sm font-bold">{frequency.chakra.name.split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Info mobile */}
        <div className="sm:hidden flex gap-3 mt-3">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-xs opacity-80">Frecuencia</p>
            <p className="text-lg font-bold">{frequency.frequency} Hz</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-xs opacity-80">Chakra</p>
            <p className="text-sm font-bold">{frequency.chakra.name.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* Ejercicio holístico - Diseño impactante */}
      <div className="p-4 sm:p-6">
        {/* Afirmación principal - Card destacada */}
        <div 
          className="relative rounded-2xl p-6 text-white overflow-hidden mb-4 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${frequency.color.hex}ee, ${frequency.color.hex}99)`,
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">✨</span>
              <h3 className="text-lg sm:text-xl font-bold">{frequency.exercise.title}</h3>
            </div>
            <p className="text-base sm:text-lg font-medium italic leading-relaxed pl-11">
              "{frequency.exercise.affirmation}"
            </p>
          </div>
          {/* Decoración de fondo mejorada */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white blur-3xl"></div>
          </div>
          {/* Ícono decorativo */}
          <div className="absolute bottom-4 right-4 text-6xl opacity-20">
            🧘‍♀️
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Descripción del ejercicio */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
              <span>📖</span>
              Práctica
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {frequency.exercise.description}
            </p>
          </div>

          {/* Instrucciones compactas */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              <span>💡</span>
              Cómo practicar
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              Reproduce {frequency.frequency} Hz, cierra los ojos y realiza el ejercicio mientras repites la afirmación. 
              Practica 5-15 minutos diarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyInfoPanel;
