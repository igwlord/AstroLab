import React from 'react';

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

  // Símbolos y colores de aspectos
  const aspectInfo: Record<string, { symbol: string; color: string }> = {
    'conjuncion': { symbol: '☌', color: '#8B5CF6' }, // purple
    'oposicion': { symbol: '☍', color: '#EF4444' }, // red
    'trigono': { symbol: '△', color: '#10B981' }, // green
    'cuadratura': { symbol: '□', color: '#F59E0B' }, // orange
    'sextil': { symbol: '⚹', color: '#3B82F6' }, // blue
    'semisextil': { symbol: '⚺', color: '#6366F1' }, // indigo
    'quincuncio': { symbol: '⚻', color: '#EAB308' }, // yellow
    'semicuadratura': { symbol: '∠', color: '#F59E0B' }, // amber
    'sesquicuadratura': { symbol: '⚼', color: '#F43F5E' } // rose
  };

  const getAspectInfo = (type: string) => {
    const normalized = type.toLowerCase().replace(/\s+/g, '');
    return aspectInfo[normalized] || { symbol: '•', color: '#6B7280' };
  };

  // Lista de planetas en orden estándar
  const planetOrder = ['Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón', 'Quirón', 'Lilith (Mean)', 'Nodo Norte', 'Nodo Sur', 'Parte de la Fortuna', 'Vértex'];
  
  // Usar los planetas proporcionados o la lista por defecto
  const planets = propPlanets.length > 0 
    ? propPlanets.map(p => p.name) 
    : planetOrder.filter(p => {
        // Verificar si el planeta tiene algún aspecto
        return aspects.some(a => a.planet1 === p || a.planet2 === p);
      });

  // Crear matriz de aspectos
  const getAspectBetween = (p1: string, p2: string) => {
    return aspects.find(a => 
      (a.planet1 === p1 && a.planet2 === p2) || 
      (a.planet1 === p2 && a.planet2 === p1)
    );
  };

  // Agrupar aspectos por tipo
  const groupedAspects = aspects.reduce((acc, aspect) => {
    const type = aspect.type || 'Otro';
    if (!acc[type]) acc[type] = [];
    acc[type].push(aspect);
    return acc;
  }, {} as Record<string, Aspect[]>);

  // Ordenar tipos de aspectos (mayores primero)
  const orderedTypes = Object.keys(groupedAspects).sort((a, b) => {
    const order = ['Conjunción', 'Oposición', 'Trígono', 'Cuadratura', 'Sextil'];
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

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
          <div key={type} className={`${info.bg} rounded-lg p-4 border-2 ${info.color.replace('text-', 'border-').replace(' dark:text-', ' dark:border-')}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-lg font-bold ${info.color} flex items-center gap-2`}>
                <span className="text-2xl">{info.symbol}</span>
                {type}
                <span className="text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
                  {category === 'mayor' ? 'Mayor' : 'Menor'}
                </span>
              </h4>
              <span className={`px-3 py-1 rounded-full font-bold text-sm ${info.color} bg-white/50 dark:bg-black/20`}>
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
                        <span className="text-base mr-1">{planetSymbols[aspect.planet1] || '•'}</span>
                        {aspect.planet1}
                      </td>
                      <td className="text-center py-2 px-2">
                        <span className="text-xl font-bold">{info.symbol}</span>
                      </td>
                      <td className="py-2 px-2 font-semibold">
                        <span className="text-base mr-1">{planetSymbols[aspect.planet2] || '•'}</span>
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
          {Object.entries(aspectInfo).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`text-xl ${value.color}`}>{value.symbol}</span>
              <span className="text-gray-700 dark:text-gray-300 capitalize">{key}</span>
            </div>
          ))}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
          <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Mayores</div>
          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {aspects.filter(a => a.category === 'mayor').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
          <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Menores</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
            {aspects.filter(a => a.category === 'menor').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700 col-span-2">
          <div className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">Exactitud Promedio</div>
          <div className="text-xl font-bold text-green-700 dark:text-green-300">
            {aspects.length > 0 
              ? ((aspects.reduce((sum, a) => sum + (a.exactness || 0), 0) / aspects.length).toFixed(1))
              : '0'
            }%
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectsTable;
