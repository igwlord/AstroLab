import React from 'react';
import type { ShapePattern } from '../types/chartShape';
import { SHAPE_INTERPRETATIONS } from '../types/chartShape';

interface ChartShapeStatsProps {
  pattern: ShapePattern;
}

const ChartShapeStats: React.FC<ChartShapeStatsProps> = ({ pattern }) => {
  // Obtener interpretación completa
  const interpretation = SHAPE_INTERPRETATIONS[pattern.type];

  return (
    <div className="chart-shape-stats p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Título del patrón */}
      <div className="pattern-header">
        <h2 className="text-base md:text-lg lg:text-xl font-bold text-purple-600 dark:text-yellow-400 line-clamp-2">
          {pattern.name}
        </h2>
        {pattern.subType && (
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            ({pattern.subType})
          </span>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Confianza: {(pattern.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Descripción */}
      <div className="pattern-description">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {pattern.description}
        </p>
        {/* Texto de personalidad con impacto visual */}
        <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-l-4 border-purple-500 dark:border-yellow-400">
          <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
            {interpretation.psychologicalTheme}
          </p>
        </div>
      </div>

      {/* Palabras clave */}
      <div className="keywords">
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Palabras Clave
        </h3>
        <div className="flex flex-wrap gap-2">
          {pattern.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Información geométrica */}
      <div className="geometric-info space-y-2">
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Geometría
        </h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Span (amplitud):</span>
          <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
            {pattern.span.toFixed(1)}°
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Gap máximo:</span>
          <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
            {pattern.maxGap.toFixed(1)}°
          </span>
        </div>
      </div>

      {/* Planetas clave */}
      {(pattern.leadingPlanet || pattern.trailingPlanet || pattern.handlePlanet) && (
        <div className="key-planets space-y-2">
          <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Planetas Clave
          </h3>
          {pattern.leadingPlanet && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Líder:</span>
              <span className="font-semibold text-purple-600 dark:text-yellow-400">
                {pattern.leadingPlanet}
              </span>
            </div>
          )}
          {pattern.trailingPlanet && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Final:</span>
              <span className="font-semibold text-purple-600 dark:text-yellow-400">
                {pattern.trailingPlanet}
              </span>
            </div>
          )}
          {pattern.handlePlanet && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Handle:</span>
              <span className="font-semibold text-purple-600 dark:text-yellow-400">
                {pattern.handlePlanet}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hemisferios */}
      <div className="hemispheres space-y-3">
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Distribución Hemisférica
        </h3>
        
        {/* Norte/Sur */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Norte</span>
            <span className="font-mono">{pattern.hemispheres.north.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${pattern.hemispheres.north}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Sur</span>
            <span className="font-mono">{pattern.hemispheres.south.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${pattern.hemispheres.south}%` }}
            />
          </div>
        </div>

        {/* Este/Oeste */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Este</span>
            <span className="font-mono">{pattern.hemispheres.east.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500"
              style={{ width: `${pattern.hemispheres.east}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Oeste</span>
            <span className="font-mono">{pattern.hemispheres.west.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${pattern.hemispheres.west}%` }}
            />
          </div>
        </div>
      </div>

      {/* Elementos */}
      <div className="elements space-y-3">
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Distribución Elemental
        </h3>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">🔥 Fuego</span>
            <span className="font-mono">{pattern.elements.fire.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${pattern.elements.fire}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">🌍 Tierra</span>
            <span className="font-mono">{pattern.elements.earth.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600"
              style={{ width: `${pattern.elements.earth}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">💨 Aire</span>
            <span className="font-mono">{pattern.elements.air.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400"
              style={{ width: `${pattern.elements.air}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">💧 Agua</span>
            <span className="font-mono">{pattern.elements.water.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${pattern.elements.water}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modalidades */}
      <div className="modalities space-y-3">
        <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Modalidades
        </h3>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Cardinal</span>
            <span className="font-mono">{pattern.modalities.cardinal.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${pattern.modalities.cardinal}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Fijo</span>
            <span className="font-mono">{pattern.modalities.fixed.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${pattern.modalities.fixed}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Mutable</span>
            <span className="font-mono">{pattern.modalities.mutable.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500"
              style={{ width: `${pattern.modalities.mutable}%` }}
            />
          </div>
        </div>
      </div>

      {/* Link al glosario */}
      <div className="glossary-link mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <a
          href="/glosario"
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-yellow-400 hover:text-purple-700 dark:hover:text-yellow-300 transition-colors"
        >
          <span>📚 Leer más en el Glosario</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};


export default ChartShapeStats;
