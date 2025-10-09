import React from 'react';
import SignatureFlipCard from './SignatureFlipCard';

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
}

interface DominancesTableProps {
  planets: Planet[];
}

const DominancesTable: React.FC<DominancesTableProps> = ({ planets }) => {
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
    'Plutón': '♇'
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

  // Símbolos de elementos
  const elementSymbols: Record<string, string> = {
    'Fuego': '🔥',
    'Tierra': '🌍',
    'Aire': '💨',
    'Agua': '💧'
  };

  // Calcular dominancias planetarias (Método Moderno)
  const calculatePlanetaryDominance = () => {
    const scores: Record<string, number> = {};
    
    planets.forEach(planet => {
      const name = planet.name;
      if (!scores[name]) scores[name] = 0;
      
      // Puntos por signo (según regencias)
      const rulerOf = getPlanetRulerOf(name);
      if (rulerOf.includes(planet.sign)) scores[name] += 2;
      
      // Puntos por casa angular (1, 4, 7, 10)
      if ([1, 4, 7, 10].includes(planet.house)) scores[name] += 3;
      
      // Puntos por aspectos (simplificado - todos suman)
      scores[name] += 1;
    });

    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const sorted = Object.entries(scores)
      .map(([name, points]) => ({
        name,
        points,
        percentage: total > 0 ? (points / total) * 100 : 0
      }))
      .sort((a, b) => b.points - a.points);
    
    return sorted;
  };

  // Calcular dominancias de elementos
  const calculateElementDominance = () => {
    const elements: Record<string, { count: number; planets: string[] }> = {
      'Fuego': { count: 0, planets: [] },
      'Tierra': { count: 0, planets: [] },
      'Aire': { count: 0, planets: [] },
      'Agua': { count: 0, planets: [] }
    };

    const fireSignos = ['Aries', 'Leo', 'Sagitario'];
    const earthSignos = ['Tauro', 'Virgo', 'Capricornio'];
    const airSignos = ['Géminis', 'Libra', 'Acuario'];
    const waterSignos = ['Cáncer', 'Escorpio', 'Piscis'];

    planets.forEach(planet => {
      if (fireSignos.includes(planet.sign)) {
        elements['Fuego'].count += 2;
        elements['Fuego'].planets.push(planet.name);
      } else if (earthSignos.includes(planet.sign)) {
        elements['Tierra'].count += 2;
        elements['Tierra'].planets.push(planet.name);
      } else if (airSignos.includes(planet.sign)) {
        elements['Aire'].count += 2;
        elements['Aire'].planets.push(planet.name);
      } else if (waterSignos.includes(planet.sign)) {
        elements['Agua'].count += 2;
        elements['Agua'].planets.push(planet.name);
      }
    });

    // Añadir puntos transpersonales (menos peso)
    Object.entries(elements).forEach(([element, data]) => {
      elements[element].count += data.planets.length > 0 ? 1 : 0;
    });

    const total = Object.values(elements).reduce((sum, el) => sum + el.count, 0);
    const sorted = Object.entries(elements)
      .map(([name, data]) => ({
        name,
        points: data.count,
        percentage: total > 0 ? (data.count / total) * 100 : 0
      }))
      .sort((a, b) => b.points - a.points);

    return sorted;
  };

  // Calcular modalidades (Cardinal, Fijo, Mutable)
  const calculateModalities = () => {
    const modalities: Record<string, number> = {
      'Cardinal': 0,
      'Fijo': 0,
      'Mutable': 0
    };

    const cardinalSignos = ['Aries', 'Cáncer', 'Libra', 'Capricornio'];
    const fijoSignos = ['Tauro', 'Leo', 'Escorpio', 'Acuario'];
    const mutableSignos = ['Géminis', 'Virgo', 'Sagitario', 'Piscis'];

    planets.forEach(planet => {
      if (cardinalSignos.includes(planet.sign)) modalities['Cardinal']++;
      else if (fijoSignos.includes(planet.sign)) modalities['Fijo']++;
      else if (mutableSignos.includes(planet.sign)) modalities['Mutable']++;
    });

    const total = Object.values(modalities).reduce((sum, val) => sum + val, 0);
    const sorted = Object.entries(modalities)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return sorted;
  };

  // Calcular polaridades (Masculino/Femenino)
  const calculatePolarities = () => {
    const polarities: Record<string, number> = {
      'Masculino': 0,
      'Femenino': 0
    };

    const masculineSignos = ['Aries', 'Géminis', 'Leo', 'Libra', 'Sagitario', 'Acuario'];
    const feminineSignos = ['Tauro', 'Cáncer', 'Virgo', 'Escorpio', 'Capricornio', 'Piscis'];

    planets.forEach(planet => {
      if (masculineSignos.includes(planet.sign)) polarities['Masculino']++;
      else if (feminineSignos.includes(planet.sign)) polarities['Femenino']++;
    });

    const total = Object.values(polarities).reduce((sum, val) => sum + val, 0);
    const sorted = Object.entries(polarities)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    return sorted;
  };

  const planetDominance = calculatePlanetaryDominance();
  const elementDominance = calculateElementDominance();
  const modalities = calculateModalities();
  const polarities = calculatePolarities();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200 dark:border-purple-700 space-y-6">
      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
        <span>👑</span>
        Planetas Dominantes
      </h3>

      {/* Tabla de Planetas Dominantes */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] sm:text-xs md:text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30">
              <th className="text-left py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">Planeta</th>
              <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100">Signo</th>
              <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden sm:table-cell">Casa</th>
              <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden md:table-cell">Gobernante<br/><span className="text-[9px] font-normal">(excl.)</span></th>
              <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden md:table-cell">Aspectos<br/><span className="text-[9px] font-normal">(excl.)</span></th>
              <th className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">Puntos</th>
              <th className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">%</th>
            </tr>
          </thead>
          <tbody>
            {planetDominance.map((item, idx) => (
              <tr key={idx} className="border-b border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <td className="py-1.5 sm:py-2 px-1.5 sm:px-3 font-semibold text-gray-800 dark:text-gray-200">
                  <span className="text-sm sm:text-base mr-0.5 sm:mr-1">{planetSymbols[item.name] || '•'}</span>
                  <span className="hidden xs:inline">{item.name}</span>
                </td>
                <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3">
                  <span className="font-bold text-base sm:text-lg">{signSymbols[planets.find(p => p.name === item.name)?.sign || ''] || ''}</span>
                </td>
                <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-mono text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                  {planets.find(p => p.name === item.name)?.house || '-'}
                </td>
                <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">+0</td>
                <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">+0</td>
                <td className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-700 dark:text-purple-300">{item.points}</td>
                <td className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">{item.percentage.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Elementos Dominantes */}
      <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
        <h4 className="text-base sm:text-lg font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
          <span>🔮</span>
          Elemento Dominante
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] sm:text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30">
                <th className="text-left py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">Elemento</th>
                <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden md:table-cell">
                  <span className="text-base mr-1">☉</span>
                  Pers.
                  <br/><span className="text-[9px] font-normal">(?)</span>
                </th>
                <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden md:table-cell">
                  <span className="text-base mr-1">♅</span>
                  Transp.
                  <br/><span className="text-[9px] font-normal">(?)</span>
                </th>
                <th className="text-center py-1.5 sm:py-2 px-1 sm:px-3 font-bold text-purple-900 dark:text-purple-100 hidden md:table-cell">
                  Dom.
                  <br/><span className="text-[9px] font-normal">(?)</span>
                </th>
                <th className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">Puntos</th>
                <th className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">%</th>
              </tr>
            </thead>
            <tbody>
              {elementDominance.map((item, idx) => (
                <tr key={idx} className="border-b border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <td className="py-1.5 sm:py-2 px-1.5 sm:px-3 font-semibold text-gray-800 dark:text-gray-200">
                    <span className="text-sm sm:text-base mr-0.5 sm:mr-1">{elementSymbols[item.name] || ''}</span>
                    {item.name}
                  </td>
                  <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">+2</td>
                  <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">+1</td>
                  <td className="text-center py-1.5 sm:py-2 px-1 sm:px-3 text-gray-700 dark:text-gray-300 hidden md:table-cell">+0</td>
                  <td className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-700 dark:text-purple-300">{item.points}</td>
                  <td className="text-right py-1.5 sm:py-2 px-1.5 sm:px-3 font-bold text-purple-900 dark:text-purple-100">{item.percentage.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Firma Astrológica - FLIP CARD */}
      <SignatureFlipCard
        signatureSign={getSignatureSign(modalities[0].name, elementDominance[0].name)}
        modality={modalities[0].name}
        element={elementDominance[0].name}
        elementDominance={elementDominance}
        modalities={modalities}
      />

      {/* Grid de Modalidades y Polaridades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-200 dark:border-purple-700">
        {/* Modalidades */}
        <div>
          <h4 className="text-base font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
            <span>⚡</span>
            Modalidades
          </h4>
          <div className="space-y-2">
            {modalities.map((item, idx) => (
              <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{item.count} planetas</p>
              </div>
            ))}
          </div>
        </div>

        {/* Polaridades */}
        <div>
          <h4 className="text-base font-bold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
            <span>☯️</span>
            Polaridades
          </h4>
          <div className="space-y-2">
            {polarities.map((item, idx) => (
              <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{item.count} planetas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: Determinar qué signos gobierna cada planeta
const getPlanetRulerOf = (planet: string): string[] => {
  const rulerships: Record<string, string[]> = {
    'Sol': ['Leo'],
    'Luna': ['Cáncer'],
    'Mercurio': ['Géminis', 'Virgo'],
    'Venus': ['Tauro', 'Libra'],
    'Marte': ['Aries', 'Escorpio'],
    'Júpiter': ['Sagitario', 'Piscis'],
    'Saturno': ['Capricornio', 'Acuario'],
    'Urano': ['Acuario'],
    'Neptuno': ['Piscis'],
    'Plutón': ['Escorpio']
  };
  return rulerships[planet] || [];
};

// Helper: Determinar firma astrológica
const getSignatureSign = (modality: string, element: string): string => {
  const signatures: Record<string, Record<string, string>> = {
    'Cardinal': {
      'Fuego': 'Aries',
      'Tierra': 'Capricornio',
      'Aire': 'Libra',
      'Agua': 'Cáncer'
    },
    'Fijo': {
      'Fuego': 'Leo',
      'Tierra': 'Tauro',
      'Aire': 'Acuario',
      'Agua': 'Escorpio'
    },
    'Mutable': {
      'Fuego': 'Sagitario',
      'Tierra': 'Virgo',
      'Aire': 'Géminis',
      'Agua': 'Piscis'
    }
  };
  return signatures[modality]?.[element] || '?';
};

export default DominancesTable;
