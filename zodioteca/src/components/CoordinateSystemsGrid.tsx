import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COORDINATE_SYSTEMS, COORDINATE_SYSTEMS_INTRO, SYSTEMS_COMPARISON } from '../types/coordinateSystem';
import StandardModal from './StandardModal';
import FavoriteToggleButton from './FavoriteToggleButton';

const CoordinateSystemsGrid: React.FC = () => {
  const location = useLocation();
  const [selectedSystem, setSelectedSystem] = useState<typeof COORDINATE_SYSTEMS[0] | null>(null);
  
  // Auto-abrir modal si viene desde favoritos
  useEffect(() => {
    const state = location.state as { autoOpen?: string; fromFavorites?: boolean } | null;
    if (state?.autoOpen && state?.fromFavorites) {
      const system = COORDINATE_SYSTEMS.find(s => s.id === state.autoOpen);
      if (system) {
        setSelectedSystem(system);
        window.history.replaceState({}, document.title);
        // Scroll + destello
        setTimeout(() => {
          const element = document.querySelector(`[data-id="system-${state.autoOpen}"]`) as HTMLElement;
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Efecto destello
            element.classList.add('animate-pulse-highlight');
            setTimeout(() => {
              element.classList.remove('animate-pulse-highlight');
            }, 2000);
          }
        }, 300);
      }
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      {/* Introducción */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-xl border-2 border-cyan-200 dark:border-cyan-700">
        <h3 className="text-2xl font-bold mb-3 text-cyan-900 dark:text-cyan-200 flex items-center gap-2">
          🌌 Sistemas de Coordenadas Celestes
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {COORDINATE_SYSTEMS_INTRO}
        </p>
      </div>

      {/* Grid de Sistemas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {COORDINATE_SYSTEMS.map((system) => (
          <div
            key={system.id}
            onClick={() => setSelectedSystem(system)}
            className={`
              relative bg-gradient-to-br ${system.gradient}
              rounded-xl p-6 shadow-lg hover:shadow-2xl 
              border-2 border-white/20
              hover:scale-105 transition-all duration-300
              cursor-pointer overflow-hidden
            `}
          >
            <div className="absolute top-2 right-2 z-10">
              <FavoriteToggleButton
                item={{
                  type: 'coordinate-system',
                  scope: 'global',
                  title: system.name,
                  icon: system.symbol,
                  route: `/glossary?categoria=coordinate-systems#system-${system.id}`,
                  targetId: system.id,
                  tags: [system.base],
                  pinned: false
                }}
                size="sm"
                variant="amber"
              />
            </div>
            {/* Efecto de brillo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl filter drop-shadow-lg">{system.symbol}</span>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {system.name}
                </h3>
              </div>

              {/* Base */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                <p className="text-xs text-white/90 font-semibold mb-1">Base:</p>
                <p className="text-sm text-white">{system.base}</p>
              </div>

              {/* Coordenadas */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-white/90 font-semibold mb-1">Coordenadas:</p>
                <p className="text-sm text-white">{system.coordinates}</p>
              </div>

              {/* Indicador de click */}
              <div className="mt-4 text-center text-white/70 text-xs">
                👆 Click para ver detalles completos
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla comparativa */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 overflow-x-auto">
        <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          ✨ Comparación Conceptual
        </h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              {SYSTEMS_COMPARISON.headers.map((header, idx) => (
                <th key={idx} className="text-left p-3 font-bold text-gray-900 dark:text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SYSTEMS_COMPARISON.rows.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3 font-semibold text-gray-900 dark:text-white">{row.system}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{row.base}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{row.use}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{row.symbolic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal detallado */}
      {selectedSystem && (
        <StandardModal
          isOpen={true}
          onClose={() => setSelectedSystem(null)}
          title={selectedSystem.name}
          subtitle={selectedSystem.base}
          icon={selectedSystem.symbol}
          gradientColors={selectedSystem.gradient}
        >
          <div className="p-6 space-y-6">
            {/* Plano de Referencia */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                📐 Plano de Referencia
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedSystem.referencePlane}
              </p>
            </div>

            {/* Descripción Técnica */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-lg">
                🔬 Descripción Técnica
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedSystem.technicalDescription.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 dark:text-gray-300 mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Uso en Astrología */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-lg">
                ⭐ Uso en Astrología
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedSystem.astrologicalUse.split('\n').map((line, idx) => (
                  line.trim() && (
                    <p key={idx} className="text-gray-700 dark:text-gray-300 mb-2">
                      {line}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Visión Filosófica */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
              <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2 text-lg">
                🧘 Visión Filosófica
              </h4>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {selectedSystem.philosophicalVision.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 dark:text-gray-300 mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Puntos Clave */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-lg">
                💡 Puntos Clave
              </h4>
              <ul className="space-y-2">
                {selectedSystem.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-cyan-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StandardModal>
      )}
    </div>
  );
};

export default CoordinateSystemsGrid;
