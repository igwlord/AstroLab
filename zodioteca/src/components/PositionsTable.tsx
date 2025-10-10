import React from 'react';

interface Planet {
  name: string;
  ecliptic: number; // Longitud eclíptica
  latitude?: number; // Latitud eclíptica
  equator_ra?: number; // Ascensión Recta
  equator_decl?: number; // Declinación
  azimuth?: number;
  altitude?: number;
  speed?: number;
  sign: string;
  degree: number;
  house?: number;
}

interface PositionsTableProps {
  planets: Planet[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
}

const PositionsTable: React.FC<PositionsTableProps> = ({ planets, ascendant, midheaven }) => {
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

  // Convertir grados a formato DMS (Degrees, Minutes, Seconds)
  const toDMS = (decimal: number): string => {
    const degrees = Math.floor(decimal);
    const minutesFloat = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.floor((minutesFloat - minutes) * 60);
    return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg border border-purple-200 dark:border-purple-700 overflow-x-auto">
      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
        <span>📍</span>
        Posiciones de Planetas
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b-2 border-purple-300 dark:border-purple-600">
              <th className="text-left py-2 px-2 font-bold text-purple-900 dark:text-purple-100">Planeta</th>
              <th className="text-center py-2 px-2 font-bold text-purple-900 dark:text-purple-100">Signo</th>
              <th className="text-right py-2 px-2 font-bold text-purple-900 dark:text-purple-100">Casa</th>
              <th className="text-right py-2 px-2 font-bold text-purple-900 dark:text-purple-100">Longitud</th>
              <th className="text-right py-2 px-2 font-bold text-purple-900 dark:text-purple-100">Velocidad</th>
            </tr>
          </thead>
          <tbody>
            {/* Ascendente */}
            <tr className="border-b border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <td className="py-2 px-2 font-bold text-purple-700 dark:text-purple-300">
                <span className="text-base mr-1">⬆️</span>
                ASC
              </td>
              <td className="text-center py-2 px-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-lg w-6 text-center">{signSymbols[ascendant.sign] || ''}</span>
                  <span className="text-gray-600 dark:text-gray-400 w-24 text-left">{ascendant.sign}</span>
                </div>
              </td>
              <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">-</td>
              <td className="text-right py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{toDMS(ascendant.degree)}</td>
              <td className="text-right py-2 px-2 text-gray-500 dark:text-gray-500">-</td>
            </tr>

            {/* Medio Cielo */}
            <tr className="border-b border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <td className="py-2 px-2 font-bold text-purple-700 dark:text-purple-300">
                <span className="text-base mr-1">⏫</span>
                MC
              </td>
              <td className="text-center py-2 px-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-lg w-6 text-center">{signSymbols[midheaven.sign] || ''}</span>
                  <span className="text-gray-600 dark:text-gray-400 w-24 text-left">{midheaven.sign}</span>
                </div>
              </td>
              <td className="text-right py-2 px-2 text-gray-700 dark:text-gray-300">-</td>
              <td className="text-right py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{toDMS(midheaven.degree)}</td>
              <td className="text-right py-2 px-2 text-gray-500 dark:text-gray-500">-</td>
            </tr>

            {/* Planetas */}
            {planets.map((planet, idx) => {
              const house = planet.house || '-';
              const eclipticLong = planet.ecliptic || (planet.degree + getSignOffset(planet.sign));
              const speed = planet.speed || 0;
              
              return (
                <tr key={idx} className="border-b border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <td className="py-2 px-2 font-semibold text-gray-800 dark:text-gray-200">
                    <span className="text-base mr-1">{planetSymbols[planet.name] || '•'}</span>
                    {planet.name}
                  </td>
                  <td className="text-center py-2 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-lg w-6 text-center">{signSymbols[planet.sign] || ''}</span>
                      <span className="text-gray-600 dark:text-gray-400 w-24 text-left">{planet.sign}</span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{house}</td>
                  <td className="text-right py-2 px-2 font-mono text-gray-700 dark:text-gray-300">{toDMS(eclipticLong)}</td>
                  <td className="text-right py-2 px-2 font-mono text-gray-700 dark:text-gray-300">
                    {speed > 0 ? '+' : ''}{speed.toFixed(2)}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sistemas de Coordenadas - REDISEÑADO */}
      <div className="mt-6">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 border-4 border-indigo-300 dark:border-indigo-600 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-3xl">🌌</span>
            <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Sistemas de Coordenadas
            </h4>
            <span className="text-3xl">🔭</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sistema Eclíptica */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border-2 border-yellow-300 dark:border-yellow-600 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">☀️</span>
                <h5 className="text-lg font-bold text-yellow-800 dark:text-yellow-200">Eclíptica</h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Sistema basado en la <strong>órbita de la Tierra</strong> alrededor del Sol
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  📐 Define la posición de los planetas en el zodíaco
                </p>
              </div>
            </div>

            {/* Sistema Ecuador */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-blue-300 dark:border-blue-600 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🌍</span>
                <h5 className="text-lg font-bold text-blue-800 dark:text-blue-200">Ecuador</h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Sistema basado en el <strong>ecuador celeste</strong> (extensión del ecuador terrestre)
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  📐 Usa Ascensión Recta y Declinación
                </p>
              </div>
            </div>

            {/* Sistema Horizonte */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-300 dark:border-purple-600 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🧭</span>
                <h5 className="text-lg font-bold text-purple-800 dark:text-purple-200">Horizonte</h5>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Sistema basado en la <strong>posición del observador</strong> en la Tierra
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  📐 Usa Azimut y Altitud
                </p>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-4 p-3 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <p className="text-xs text-center text-gray-700 dark:text-gray-300">
              💡 <strong>Nota:</strong> Cada sistema ofrece una perspectiva única para ubicar los cuerpos celestes. La astrología tradicional usa principalmente el sistema <strong>Eclíptica</strong>.
              {' '}
              <a 
                href="/glossary?categoria=coordinates" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 underline font-semibold transition-colors"
              >
                Leer más →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper: Obtener offset del signo (0° Aries = 0°, 0° Tauro = 30°, etc.)
const getSignOffset = (sign: string): number => {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const index = signs.indexOf(sign);
  return index >= 0 ? index * 30 : 0;
};

export default PositionsTable;
