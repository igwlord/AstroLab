import React from 'react';
import { normalizeAspectKey, getAspectUI } from '../constants/aspectsStandard';

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  exactness?: number;
  category?: string;
  symbol?: string;
}

interface AspectsTableProps {
  aspects: Aspect[];
}

const AspectsTable: React.FC<AspectsTableProps> = ({ aspects }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = React.useState(false);
  
  // Símbolos de planetas
  const planetSymbols: Record<string, string> = {
    'Sol': '☉',
    'Luna': '☽',
    'Mercurio': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Neptuno': '♆',
    'Plutón': '♇',
    'Quirón': '⚷',
    'Lilith': '⚸',
    'Nodo Norte': '☊',
    'Nodo Sur': '☋',
    'Parte Fortuna': '⊕',
    'Vértex': 'Vx'
  };

  // Símbolos y colores de aspectos desde el estándar centralizado
  const getAspectInfo = (type: string) => {
    const key = normalizeAspectKey(type);
    if (key) {
      return getAspectUI(key);
    }
    return { symbol: '•', color: '#6B7280' };
  };

  // Lista de planetas en orden estándar (solo los principales)
  const planetOrder = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón', 'Quirón', 'Lilith (Mean)', 'Nodo Norte', 'Nodo Sur', 'Parte de la Fortuna', 'Vértex'];
  
  // Filtrar solo planetas que tengan aspectos
  const activePlanets = planetOrder.filter(p => 
    aspects.some(a => a.planet1 === p || a.planet2 === p)
  );

  // Crear matriz de aspectos
  const getAspectBetween = (p1: string, p2: string) => {
    return aspects.find(a => 
      (a.planet1 === p1 && a.planet2 === p2) || 
      (a.planet1 === p2 && a.planet2 === p1)
    );
  };

  // Renderizar la tabla (reutilizable para modal)
  const renderTable = (scale: number = 1) => (
    <table className="w-full border-collapse" style={{ fontSize: `${scale * 100}%` }}>
      <thead>
        <tr>
          {/* Columna de planetas verticales */}
          <th className="w-16 sm:w-20 border border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-900/30"></th>
          {/* Headers horizontales - Solo los planetas que NO están en la columna vertical */}
          {activePlanets.slice(1).map((planet, idx) => (
            <th 
              key={idx}
              className="w-10 sm:w-12 h-10 sm:h-12 border border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-center"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300">
                  {planetSymbols[planet] || planet.charAt(0)}
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-600 dark:text-gray-400 hidden sm:block mt-0.5">
                  {planet.split(' ')[0].slice(0, 4)}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Filas de planetas - Escalonadas (cada fila tiene una celda menos) */}
        {activePlanets.slice(0, -1).map((rowPlanet, rowIdx) => (
          <tr key={rowIdx}>
            {/* Celda del planeta (izquierda) */}
            <td className="border border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-2 py-1">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300">
                  {planetSymbols[rowPlanet] || '•'}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {rowPlanet}
                </span>
              </div>
            </td>

            {/* Celdas de aspectos - Solo para planetas posteriores (matriz triangular) */}
            {activePlanets.slice(rowIdx + 1).map((colPlanet, colIdx) => {
              const aspect = getAspectBetween(rowPlanet, colPlanet);
              const info = aspect ? getAspectInfo(aspect.type) : null;

              return (
                <td 
                  key={colIdx}
                  className="w-10 sm:w-12 h-10 sm:h-12 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  {aspect && info ? (
                    <div className="flex flex-col items-center justify-center h-full p-1">
                      <span 
                        className="text-lg sm:text-xl font-bold"
                        style={{ 
                          color: info.color,
                          textShadow: `0 0 4px ${info.color}40`,
                          lineHeight: '1'
                        }}
                      >
                        {info.symbol}
                      </span>
                      <span 
                        className="text-[8px] sm:text-[9px] font-mono text-amber-600 dark:text-amber-400 mt-0.5"
                      >
                        {Math.abs(aspect.orb).toFixed(1)}°
                      </span>
                    </div>
                  ) : null}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <span>⚡</span>
            Tabla de Aspectos
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-600 dark:text-gray-400">Total:</span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-bold">
                {aspects.length}
              </span>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="md:hidden px-3 py-1.5 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              🔍 Zoom
            </button>
          </div>
        </div>

        {/* TABLA TRIANGULAR ESTILO ASTRO-SEEK */}
        <div className="overflow-x-auto">
          {renderTable(0.7)}
        </div>

      {/* Leyenda */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3">🔑 Leyenda de Aspectos</h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {['Conjunción', 'Oposición', 'Cuadratura', 'Trígono', 'Sextil', 'Semisextil', 'Semicuadratura', 'Quincuncio'].map((name) => {
            const info = getAspectInfo(name);
            return (
              <div key={name} className="flex items-center gap-2">
                <span 
                  className="text-2xl font-bold"
                  style={{ color: info.color }}
                >
                  {info.symbol}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700 text-[10px] text-gray-600 dark:text-gray-400 text-center">
          <strong>Orbe:</strong> Desviación del ángulo exacto. Más cerca de 0° = aspecto más fuerte
        </div>
      </div>

        {/* Resumen estadístico */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
            <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Aspectos Mayores</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {aspects.filter(a => a.category === 'mayor').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
            <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Aspectos Menores</div>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {aspects.filter(a => a.category === 'menor').length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700 col-span-2">
            <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Exactitud Promedio</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {aspects.length > 0 
                ? ((aspects.reduce((sum, a) => sum + (a.exactness || 0), 0) / aspects.length).toFixed(1))
                : '0'
              }%
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Zoom para móviles */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 backdrop-blur-sm transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div 
              className="overflow-auto max-h-full max-w-full bg-white dark:bg-gray-900 rounded-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2 sticky top-0 bg-white dark:bg-gray-900 z-10 pb-2">
                <span>⚡</span>
                Tabla de Aspectos
              </h3>
              <div className="min-w-[600px]">
                {renderTable(1)}
              </div>
              
              {/* Leyenda en modal */}
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3">🔑 Leyenda de Aspectos</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['Conjunción', 'Oposición', 'Cuadratura', 'Trígono', 'Sextil', 'Semisextil', 'Semicuadratura', 'Quincuncio'].map((name) => {
                    const info = getAspectInfo(name);
                    return (
                      <div key={name} className="flex items-center gap-2">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: info.color }}
                        >
                          {info.symbol}
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
              Desplaza para ver toda la tabla • Pellizca para hacer zoom
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AspectsTable;
