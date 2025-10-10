import React from 'react';
import { normalizeAspectKey, getAspectUI } from '../constants/aspectsStandard';
import { logger } from '../utils/logger';

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

interface Planet {
  name: string;
}

interface AspectsTableProps {
  aspects: Aspect[];
  planets?: Planet[];
}

// ⚡ Componente memoizado para estadísticas (evita recálculos)
const StatsSummary: React.FC<{ aspects: Aspect[] }> = React.memo(({ aspects }) => {
  const majorCount = React.useMemo(() => aspects.filter(a => a.category === 'mayor').length, [aspects]);
  const minorCount = React.useMemo(() => aspects.filter(a => a.category === 'menor').length, [aspects]);
  const avgExactness = React.useMemo(() => {
    if (aspects.length === 0) return 0;
    return aspects.reduce((sum, a) => sum + (a.exactness || 0), 0) / aspects.length;
  }, [aspects]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Mayores</div>
        <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
          {majorCount}
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Menores</div>
        <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
          {minorCount}
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700 col-span-2">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Exactitud Promedio</div>
        <div className="text-xl font-bold text-green-700 dark:text-green-300">
          {avgExactness.toFixed(1)}%
        </div>
      </div>
    </div>
  );
});

StatsSummary.displayName = 'StatsSummary';

const AspectsTable: React.FC<AspectsTableProps> = ({ aspects, planets: propPlanets = [] }) => {
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

  // Lista de planetas en orden estándar (comentado - no se usa en esta versión)
  // const planetOrder = ['Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón', 'Quirón', 'Lilith (Mean)', 'Nodo Norte', 'Nodo Sur', 'Parte de la Fortuna', 'Vértex'];
  
  // Evitar warning de variable no usada
  logger.debug('Planets provided:', propPlanets.length);

  // ⚡ OPTIMIZACIÓN: Memoizar agrupación de aspectos (evita reduce en cada render)
  const groupedAspects = React.useMemo(() => {
    return aspects.reduce((acc, aspect) => {
      const type = aspect.type || 'Otro';
      if (!acc[type]) acc[type] = [];
      acc[type].push(aspect);
      return acc;
    }, {} as Record<string, Aspect[]>);
  }, [aspects]);

  // ⚡ OPTIMIZACIÓN: Memoizar ordenamiento de tipos (evita sort en cada render)
  const orderedTypes = React.useMemo(() => {
    return Object.keys(groupedAspects).sort((a, b) => {
      const order = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [groupedAspects]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200 dark:border-purple-700 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
          <span>⚡</span>
          Aspectos de la Carta
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Total:</span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-bold">
            {aspects.length}
          </span>
        </div>
      </div>

      {orderedTypes.map(type => {
        const typeAspects = groupedAspects[type];
        const info = getAspectInfo(type);
        const category = typeAspects[0]?.category || 'menor';
        
        return (
          <div key={type} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <span className="text-2xl" style={{ color: info.color }}>{info.symbol}</span>
                {type}
                <span className="text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
                  {category === 'mayor' ? 'Mayor' : 'Menor'}
                </span>
              </h4>
              <span className="px-3 py-1 rounded-full font-bold text-sm text-purple-900 dark:text-purple-100 bg-white/50 dark:bg-black/20">
                {typeAspects.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-current opacity-50">
                    <th className="text-left py-2 px-2 font-bold">Planeta 1</th>
                    <th className="text-center py-2 px-2 font-bold">Aspecto</th>
                    <th className="text-left py-2 px-2 font-bold">Planeta 2</th>
                    <th className="text-right py-2 px-2 font-bold">Ángulo</th>
                    <th className="text-right py-2 px-2 font-bold">Orbe</th>
                    <th className="text-right py-2 px-2 font-bold">Exactitud</th>
                  </tr>
                </thead>
                <tbody>
                  {typeAspects.map((aspect, idx) => (
                    <tr key={idx} className="border-b border-current opacity-30 last:border-0 hover:bg-white/50 dark:hover:bg-black/20">
                      <td className="py-2 px-2 font-semibold">
                        <span className="text-base mr-1" style={{ fontFamily: '"Noto Sans Symbols 2", "Noto Sans Symbols", "Segoe UI Symbol", Arial, sans-serif' }}>
                          {planetSymbols[aspect.planet1] || '•'}
                          <title>{aspect.planet1}</title>
                        </span>
                        {aspect.planet1}
                      </td>
                      <td className="text-center py-2 px-2">
                        <span className="text-xl font-bold" style={{ fontFamily: '"Noto Sans Symbols 2", "Noto Sans Symbols", "Segoe UI Symbol", Arial, sans-serif' }}>
                          {info.symbol}
                          <title>{aspect.type}</title>
                        </span>
                      </td>
                      <td className="py-2 px-2 font-semibold">
                        <span className="text-base mr-1" style={{ fontFamily: '"Noto Sans Symbols 2", "Noto Sans Symbols", "Segoe UI Symbol", Arial, sans-serif' }}>
                          {planetSymbols[aspect.planet2] || '•'}
                          <title>{aspect.planet2}</title>
                        </span>
                        {aspect.planet2}
                      </td>
                      <td className="text-right py-2 px-2 font-mono">{aspect.angle.toFixed(1)}°</td>
                      <td className="text-right py-2 px-2 font-mono">{Math.abs(aspect.orb).toFixed(1)}°</td>
                      <td className="text-right py-2 px-2 font-bold">
                        {aspect.exactness !== undefined ? `${aspect.exactness.toFixed(0)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Leyenda */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-3">🔑 Leyenda de Aspectos</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          {['Conjunción', 'Oposición', 'Cuadratura', 'Trígono', 'Sextil', 'Semisextil', 'Semicuadratura', 'Quincuncio'].map((name) => {
            const info = getAspectInfo(name);
            return (
              <div key={name} className="flex items-center gap-2">
                <span 
                  className="text-xl" 
                  style={{ 
                    color: info.color,
                    fontFamily: '"Noto Sans Symbols 2", "Noto Sans Symbols", "Segoe UI Symbol", Arial, sans-serif'
                  }}
                  title={name}
                >
                  {info.symbol}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{name}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-gray-600 dark:text-gray-400">
          <div>
            <strong>Orbe:</strong> Desviación del ángulo exacto (más cerca de 0° = más fuerte)
          </div>
          <div>
            <strong>Exactitud:</strong> Porcentaje de precisión del aspecto (100% = exacto)
          </div>
        </div>
      </div>

      {/* Resumen estadístico */}
      <StatsSummary aspects={aspects} />
    </div>
  );
};

// ⚡ React.memo con comparación custom para evitar re-renders innecesarios
export default React.memo(AspectsTable, (prevProps, nextProps) => {
  // Solo re-render si aspects realmente cambian
  return (
    JSON.stringify(prevProps.aspects) === JSON.stringify(nextProps.aspects) &&
    JSON.stringify(prevProps.planets) === JSON.stringify(nextProps.planets)
  );
});
