/**
 * Página de demostración del NatalChartWheel
 * Muestra todas las variantes y opciones del componente
 */

import React, { useState } from 'react';
import NatalChartWheelV2 from '../components/NatalChartWheelV2';
import type { ChartData, ThemeType, ModeType, PlanetLabelsType } from '../types/chartWheel';
import {
  CHART_ASTRO_SEEK_REFERENCE,
  CHART_SOLSTICE_MID_LATITUDE,
  CHART_HIGH_LATITUDE,
  CHART_NIGHT_TIME,
  CHART_CLUSTERED_PLANETS,
} from '../../test/fixtures/chartData';

const DEMO_CHARTS: Record<string, ChartData> = {
  'Astro-Seek Reference (16/07/1988)': CHART_ASTRO_SEEK_REFERENCE,
  'Solsticio (latitud media)': CHART_SOLSTICE_MID_LATITUDE,
  'Latitud Alta (65°N)': CHART_HIGH_LATITUDE,
  'Hora Nocturna': CHART_NIGHT_TIME,
  'Planetas Agrupados': CHART_CLUSTERED_PLANETS,
};

const NatalChartWheelDemo: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<string>('Astro-Seek Reference (16/07/1988)');
  const [size, setSize] = useState<number>(640);
  const [theme, setTheme] = useState<ThemeType>('violet');
  const [mode, setMode] = useState<ModeType>('zodiacFixed');
  const [planetLabels, setPlanetLabels] = useState<PlanetLabelsType>('none');
  const [debug, setDebug] = useState<boolean>(false);

  const currentData = DEMO_CHARTS[selectedChart];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          NatalChartWheel Demo
        </h1>

        {/* Controles */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dataset */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Dataset
              </label>
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {Object.keys(DEMO_CHARTS).map((name) => (
                  <option key={name} value={name} className="text-gray-900">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tamaño: {size}px
              </label>
              <input
                type="range"
                min="320"
                max="1024"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Theme */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Tema
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('violet')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    theme === 'violet'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Violeta
                </button>
                <button
                  onClick={() => setTheme('classic')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    theme === 'classic'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Clásico
                </button>
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Modo
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('zodiacFixed')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    mode === 'zodiacFixed'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Zodíaco Fijo
                </button>
                <button
                  onClick={() => setMode('ascRelative')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    mode === 'ascRelative'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Relativo ASC
                </button>
              </div>
            </div>

            {/* Planet Labels */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Etiquetas Planetas
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlanetLabels('none')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    planetLabels === 'none'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Sin
                </button>
                <button
                  onClick={() => setPlanetLabels('inline')}
                  className={`flex-1 px-3 py-2 rounded-lg ${
                    planetLabels === 'inline'
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  Inline
                </button>
              </div>
            </div>

            {/* Debug */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Debug
              </label>
              <button
                onClick={() => setDebug(!debug)}
                className={`w-full px-3 py-2 rounded-lg ${
                  debug
                    ? 'bg-pink-600 text-white'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {debug ? 'Activado' : 'Desactivado'}
              </button>
            </div>
          </div>
        </div>

        {/* Componente */}
        <div className="flex justify-center">
          <NatalChartWheelV2
            data={currentData}
            size={size}
            theme={theme}
            mode={mode}
            planetLabels={planetLabels}
            debug={debug}
          />
        </div>

        {/* Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Información del Dataset</h2>
          <div className="text-white/80 space-y-2">
            <p><strong>Casas:</strong> {currentData.houses.length}</p>
            <p><strong>Planetas:</strong> {currentData.planets.length}</p>
            <p><strong>Aspectos:</strong> {currentData.aspects?.length || 0}</p>
            <p><strong>Puntos especiales:</strong> {currentData.points?.length || 0}</p>
            
            <div className="mt-4 p-4 bg-white/10 rounded">
              <p className="text-sm">
                <strong>ASC (Casa 1):</strong> {currentData.houses[0].cusp.toFixed(2)}°
              </p>
              <p className="text-sm">
                <strong>MC (Casa 10):</strong>{' '}
                {currentData.houses.find((h) => h.number === 10)?.cusp.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>

        {/* Documentación */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Documentación</h2>
          <div className="text-white/80 space-y-2 text-sm">
            <p>📐 <strong>Geometría:</strong> Según auditoría ultra-detallada (rudea astro modelo.md)</p>
            <p>🎨 <strong>Temas:</strong> Violeta (moderno) y Clásico (Astro-Seek)</p>
            <p>📍 <strong>Sistema:</strong> Zodíaco Fijo (0° Aries izquierda, antihorario)</p>
            <p>🎯 <strong>Precisión:</strong> Tolerancia angular &lt; 0.1°</p>
            <p>📦 <strong>Export:</strong> SVG (vector) y PNG (raster 2×DPI)</p>
            <p>🔍 <strong>Debug:</strong> Overlay con retícula y círculos guía</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NatalChartWheelDemo;
