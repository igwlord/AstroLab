import React from 'react';

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde?: boolean;
}

interface House {
  number: number;
  sign: string;
  degree: number;
}

interface ElementStats {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

interface PolarityStats {
  masculine: number;
  feminine: number;
}

interface ChartDataTableProps {
  planets: Planet[];
  houses: House[];
  elementStats?: ElementStats;
  polarityStats?: PolarityStats;
}

const ChartDataTable: React.FC<ChartDataTableProps> = ({ planets, houses, elementStats, polarityStats }) => {
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

  // Símbolos de signos
  const signSymbols: Record<string, string> = {
    'Aries': '♈',
    'Tauro': '♉',
    'Géminis': '♊',
    'Cáncer': '♋',
    'Leo': '♌',
    'Virgo': '♍',
    'Libra': '♎',
    'Escorpio': '♏',
    'Sagitario': '♐',
    'Capricornio': '♑',
    'Acuario': '♒',
    'Piscis': '♓'
  };

  const formatDegree = (deg: number) => {
    const degrees = Math.floor(deg);
    const minutes = Math.floor((deg - degrees) * 60);
    return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
  };

  // Debug: ver qué nombres estamos recibiendo
  console.log('🔍 Todos los planetas recibidos:', planets.map(p => p.name));

  // Separar planetas principales de puntos avanzados (solo los 10 planetas clásicos)
  const MAIN_PLANETS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
  const mainPlanets = planets.filter(p => MAIN_PLANETS.includes(p.name));
  
  const advancedPoints = {
    nodoNorte: planets.find(p => p.name === 'Nodo Norte'),
    lilith: planets.find(p => p.name === 'Lilith'),
    quiron: planets.find(p => p.name === 'Quirón'),
    fortuna: planets.find(p => p.name === 'Parte de la Fortuna'),
    vertex: planets.find(p => p.name === 'Vértex')
  };

  console.log('🔍 Puntos avanzados encontrados:', {
    nodoNorte: advancedPoints.nodoNorte?.name,
    lilith: advancedPoints.lilith?.name,
    quiron: advancedPoints.quiron?.name,
    fortuna: advancedPoints.fortuna?.name,
    vertex: advancedPoints.vertex?.name
  });

  const renderPlanetRow = (planet: Planet | undefined, symbol: string) => {
    // Siempre mostrar la fila, aunque no haya datos
    return (
      <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
        {/* Símbolo */}
        <span className="text-sm w-4 font-semibold">{symbol}:</span>
        
        {planet ? (
          <>
            {/* Signo */}
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[planet.sign] || ''}
            </span>
            
            {/* Grados */}
            <span className="font-mono text-[10px] w-[48px] font-medium">
              {formatDegree(planet.degree)}
            </span>
            
            {/* Casa (columna alineada) */}
            <span className="text-[10px] text-gray-700 dark:text-gray-400 w-6 text-center font-medium">
              {planet.house}
            </span>
            
            {/* Retrógrado (columna alineada a la derecha) */}
            <span className="text-red-600 dark:text-red-400 font-bold text-[10px] w-3 text-center">
              {planet.retrograde ? 'R' : ''}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm w-4"></span>
            <span className="font-mono text-[10px] w-[48px]"></span>
            <span className="text-[10px] w-6"></span>
            <span className="text-[10px] w-3"></span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-transparent text-[10px] leading-tight space-y-2 py-2">
      {/* Título: Planetas y Asteroides */}
      <div className="text-[11px] font-bold text-gray-900 dark:text-gray-400 mb-1">
        Planetas y Asteroides:
      </div>

      {/* Planetas principales */}
      <div className="space-y-0">
        {mainPlanets.map((planet, idx) => (
          <div 
            key={idx}
            className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]"
          >
            {/* Símbolo */}
            <span className="text-sm w-4 font-semibold">{planetSymbols[planet.name]}:</span>
            
            {/* Signo */}
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[planet.sign] || ''}
            </span>
            
            {/* Grados */}
            <span className="font-mono text-[10px] w-[48px] font-medium">
              {formatDegree(planet.degree)}
            </span>
            
            {/* Casa (columna alineada) */}
            <span className="text-[10px] text-gray-700 dark:text-gray-400 w-6 text-center font-medium">
              {planet.house}
            </span>
            
            {/* Retrógrado (columna alineada a la derecha) */}
            <span className="text-red-600 dark:text-red-400 font-bold text-[10px] w-3 text-center">
              {planet.retrograde ? 'R' : ''}
            </span>
          </div>
        ))}
        
        {/* Puntos avanzados */}
        {renderPlanetRow(advancedPoints.nodoNorte, '☊')}
        {renderPlanetRow(advancedPoints.lilith, '⚸')}
        {renderPlanetRow(advancedPoints.quiron, '⚷')}
        {renderPlanetRow(advancedPoints.fortuna, '⊕')}
        {renderPlanetRow(advancedPoints.vertex, 'Vx')}
      </div>

      {/* Separador */}
      <div className="border-t border-gray-400 dark:border-gray-600 my-2"></div>

      {/* Título: Casas */}
      <div className="text-[11px] font-bold text-gray-900 dark:text-gray-400 mb-1">
        Casas:
      </div>

      {/* Casas en 2 columnas - Orden: AC/DC, 2/8, 3/9, IC/MC, 5/11, 6/12 */}
      <div className="space-y-0">
        {/* Fila 1: AC - DC */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-semibold">AC:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[0]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[0] ? formatDegree(houses[0].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-semibold">DC:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[6]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[6] ? formatDegree(houses[6].degree) : ''}
            </span>
          </div>
        </div>

        {/* Fila 2: 2 - 8 */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">2:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[1]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[1] ? formatDegree(houses[1].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">8:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[7]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[7] ? formatDegree(houses[7].degree) : ''}
            </span>
          </div>
        </div>

        {/* Fila 3: 3 - 9 */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">3:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[2]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[2] ? formatDegree(houses[2].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">9:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[8]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[8] ? formatDegree(houses[8].degree) : ''}
            </span>
          </div>
        </div>

        {/* Fila 4: IC - MC */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-semibold">IC:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[3]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[3] ? formatDegree(houses[3].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-semibold">MC:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[9]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[9] ? formatDegree(houses[9].degree) : ''}
            </span>
          </div>
        </div>

        {/* Fila 5: 5 - 11 */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">5:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[4]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[4] ? formatDegree(houses[4].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">11:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[10]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[10] ? formatDegree(houses[10].degree) : ''}
            </span>
          </div>
        </div>

        {/* Fila 6: 6 - 12 */}
        <div className="grid grid-cols-2 gap-x-3">
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">6:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[5]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[5] ? formatDegree(houses[5].degree) : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px]">
            <span className="text-[10px] w-6 font-medium">12:</span>
            <span className="text-sm w-4 text-center text-purple-600 dark:text-purple-400 font-semibold">
              {signSymbols[houses[11]?.sign] || ''}
            </span>
            <span className="font-mono text-[10px] font-medium">
              {houses[11] ? formatDegree(houses[11].degree) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Elementos y Polaridades */}
      {(elementStats || polarityStats) && (
        <>
          {/* Separador */}
          <div className="border-t border-gray-400 dark:border-gray-600 my-2"></div>

          {/* Elementos */}
          {elementStats && (
            <div className="mb-2">
              <div className="text-[11px] font-bold text-gray-900 dark:text-gray-400 mb-1">
                Elementos:
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{elementStats.fire}x 🔥</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Fuego</span>
                </div>
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{elementStats.earth}x 🪴</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Tierra</span>
                </div>
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{elementStats.air}x 🌬️</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Aire</span>
                </div>
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{elementStats.water}x 💧</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Agua</span>
                </div>
              </div>
            </div>
          )}

          {/* Polaridades */}
          {polarityStats && (
            <div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0">
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{polarityStats.masculine}x ♂️</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Masc</span>
                </div>
                <div className="flex items-center text-gray-800 dark:text-gray-300 py-[1px] text-[10px]">
                  <span className="w-8 font-semibold">{polarityStats.feminine}x ♀️</span>
                  <span className="text-gray-700 dark:text-gray-400 text-[10px]">Fem</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChartDataTable;
