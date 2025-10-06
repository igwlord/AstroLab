/**
 * Calculador de Nodos Lunares (Norte y Sur)
 * 
 * Los nodos lunares son los puntos donde la órbita de la Luna intersecta
 * el plano de la eclíptica. Representan el eje kármico en astrología.
 * 
 * - Nodo Norte (☊): Dirección evolutiva, lecciones a aprender
 * - Nodo Sur (☋): Karma pasado, dones innatos
 * 
 * Variantes:
 * - Media (Mean): Posición matemática promediada, movimiento uniforme
 * - Verdadera (True): Posición real osculating con perturbaciones
 */

export interface LunarNode {
  name: string;
  type: 'north' | 'south';
  variant: 'mean' | 'true';
  sign: string;
  degree: number;
  longitude: number;
  house: number;
  retrograde: boolean; // Los nodos siempre son retrógrados
}

// Signos del zodíaco
const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

/**
 * Convierte una longitud eclíptica en signo zodiacal y grado
 */
function longitudeToSign(longitude: number): { sign: string; degree: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree
  };
}

/**
 * Determina en qué casa astrológica cae una longitud
 */
function calculateHouseForLongitude(longitude: number, houseCusps: number[]): number {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];
    
    if (nextCusp > currentCusp) {
      if (normalizedLon >= currentCusp && normalizedLon < nextCusp) {
        return i + 1;
      }
    } else {
      if (normalizedLon >= currentCusp || normalizedLon < nextCusp) {
        return i + 1;
      }
    }
  }
  
  return 1;
}

/**
 * Convierte una fecha a Día Juliano
 */
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + 
            Math.floor(y / 400) - 32045;
  
  const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;
  
  return jd;
}

/**
 * Calcula la posición del Nodo Lunar Norte MEDIO
 * 
 * Fórmula de Jean Meeus "Astronomical Algorithms"
 * El nodo medio retrocede ~19.3° por año (período 18.6 años)
 */
function calculateMeanNorthNode(jd: number): number {
  // Siglos julianos desde J2000.0
  const T = (jd - 2451545.0) / 36525.0;
  
  // Longitud media del nodo ascendente (en grados)
  // Fórmula de Meeus
  let Omega = 125.04452 
    - 1934.136261 * T 
    + 0.0020708 * T * T 
    + T * T * T / 450000.0;
  
  // Normalizar a 0-360
  Omega = ((Omega % 360) + 360) % 360;
  
  return Omega;
}

/**
 * Calcula la posición del Nodo Lunar Norte VERDADERO
 * 
 * Incluye perturbaciones por la atracción solar y la excentricidad orbital
 */
function calculateTrueNorthNode(jd: number): number {
  // Siglos julianos desde J2000.0
  const T = (jd - 2451545.0) / 36525.0;
  
  // Primero calculamos el nodo medio
  const meanNode = calculateMeanNorthNode(jd);
  
  // Anomalía media del Sol (M)
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = M * Math.PI / 180;
  
  // Anomalía media de la Luna (M')
  const Mp = 134.96298 + 477198.867398 * T + 0.0086972 * T * T;
  const Mp_rad = Mp * Math.PI / 180;
  
  // Argumento de latitud de la Luna (F)
  const F = 93.27191 + 483202.017538 * T - 0.0036825 * T * T;
  const F_rad = F * Math.PI / 180;
  
  // Elongación Luna-Sol (D)
  const D = 297.85036 + 445267.111480 * T - 0.0019142 * T * T;
  const D_rad = D * Math.PI / 180;
  
  // Perturbaciones principales (términos más significativos de la serie)
  let correction = 0;
  
  // Términos periódicos (simplificados, los más importantes)
  correction += -1.4979 * Math.sin(2 * (D_rad - Mp_rad));
  correction += -0.1500 * Math.sin(M_rad);
  correction += -0.1226 * Math.sin(2 * D_rad);
  correction += +0.1176 * Math.sin(2 * F_rad);
  correction += -0.0801 * Math.sin(2 * (Mp_rad - F_rad));
  
  const trueNode = meanNode + correction;
  
  // Normalizar a 0-360
  return ((trueNode % 360) + 360) % 360;
}

/**
 * Calcula ambos nodos (Norte y Sur) en su variante especificada
 */
export async function calculateLunarNodes(
  date: Date,
  houseCusps: number[],
  variant: 'mean' | 'true' = 'mean'
): Promise<LunarNode[]> {
  const jd = dateToJulianDay(date);
  
  // Calcular Nodo Norte según variante
  let northNodeLongitude: number;
  if (variant === 'mean') {
    northNodeLongitude = calculateMeanNorthNode(jd);
  } else {
    northNodeLongitude = calculateTrueNorthNode(jd);
  }
  
  // Nodo Sur = Nodo Norte + 180° (punto opuesto)
  const southNodeLongitude = (northNodeLongitude + 180) % 360;
  
  // Convertir a signo y grado
  const northNodezodiac = longitudeToSign(northNodeLongitude);
  const southNodezodiac = longitudeToSign(southNodeLongitude);
  
  // Asignar casas
  const northNodeHouse = calculateHouseForLongitude(northNodeLongitude, houseCusps);
  const southNodeHouse = calculateHouseForLongitude(southNodeLongitude, houseCusps);
  
  const nodes: LunarNode[] = [
    {
      name: 'Nodo Norte',
      type: 'north',
      variant,
      sign: northNodezodiac.sign,
      degree: northNodezodiac.degree,
      longitude: northNodeLongitude,
      house: northNodeHouse,
      retrograde: true // Los nodos siempre son retrógrados (movimiento hacia atrás)
    },
    {
      name: 'Nodo Sur',
      type: 'south',
      variant,
      sign: southNodezodiac.sign,
      degree: southNodezodiac.degree,
      longitude: southNodeLongitude,
      house: southNodeHouse,
      retrograde: true // Los nodos siempre son retrógrados
    }
  ];
  
  return nodes;
}

/**
 * Función auxiliar para calcular solo el Nodo Norte
 */
export async function calculateNorthNode(
  date: Date,
  houseCusps: number[],
  variant: 'mean' | 'true' = 'mean'
): Promise<LunarNode> {
  const nodes = await calculateLunarNodes(date, houseCusps, variant);
  return nodes[0];
}

/**
 * Función auxiliar para calcular solo el Nodo Sur
 */
export async function calculateSouthNode(
  date: Date,
  houseCusps: number[],
  variant: 'mean' | 'true' = 'mean'
): Promise<LunarNode> {
  const nodes = await calculateLunarNodes(date, houseCusps, variant);
  return nodes[1];
}
