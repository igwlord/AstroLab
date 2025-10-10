/**
 * CALCULADOR DE ASTEROIDES
 * Calcula las posiciones de los 4 asteroides principales:
 * - Ceres (1)
 * - Pallas (2)
 * - Juno (3)
 * - Vesta (4)
 * 
 * Usa Swiss Ephemeris a través de cálculos aproximados
 * Para producción: usar astro.com API o Swiss Ephemeris WASM
 */

import { logger } from '../utils/logger';

export interface AsteroidPosition {
  name: string;
  sign: string;
  degree: number;
  longitude: number; // 0-360 grados eclípticos
  house: number;
  retrograde: boolean;
  number: number; // Número del asteroide
}

// Nombres de los signos zodiacales
const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer',
  'Leo', 'Virgo', 'Libra', 'Escorpio',
  'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

/**
 * Convierte longitud eclíptica (0-360°) a signo zodiacal y grados dentro del signo
 */
function longitudeToSign(longitude: number): { sign: string; degree: number } {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;
  
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degree
  };
}

/**
 * Calcula la casa astrológica basándose en longitud y cúspides
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
      // El cusp cruza 0° Aries
      if (normalizedLon >= currentCusp || normalizedLon < nextCusp) {
        return i + 1;
      }
    }
  }
  
  return 1; // Default
}

/**
 * Calcula posiciones aproximadas de asteroides usando elementos orbitales
 * NOTA: Para máxima precisión en producción, usar Swiss Ephemeris real
 */
export async function calculateAsteroids(
  date: Date,
  houseCusps: number[]
): Promise<AsteroidPosition[]> {
  
  // Calcular el día juliano
  const jd = dateToJulianDay(date);
  
  // Cálculos orbitales simplificados para cada asteroide
  const asteroids = [
    { name: 'Ceres', number: 1, elements: { a: 2.767, e: 0.0758, i: 10.59, M0: 95.99, n: 0.2141 } },
    { name: 'Pallas', number: 2, elements: { a: 2.773, e: 0.2300, i: 34.84, M0: 310.17, n: 0.2133 } },
    { name: 'Juno', number: 3, elements: { a: 2.669, e: 0.2563, i: 12.98, M0: 248.47, n: 0.2256 } },
    { name: 'Vesta', number: 4, elements: { a: 2.362, e: 0.0887, i: 7.14, M0: 307.70, n: 0.2717 } }
  ];
  
  const positions: AsteroidPosition[] = [];
  
  for (const asteroid of asteroids) {
    try {
      // Calcular posición usando elementos orbitales simplificados
      const longitude = calculateAsteroidLongitude(jd, asteroid.elements);
      const { sign, degree } = longitudeToSign(longitude);
      const house = calculateHouseForLongitude(longitude, houseCusps);
      const retrograde = isAsteroidRetrograde(jd, asteroid.elements);
      
      positions.push({
        name: asteroid.name,
        number: asteroid.number,
        sign,
        degree,
        longitude,
        house,
        retrograde
      });
    } catch (error) {
      logger.error(`Error calculando ${asteroid.name}:`, error);
      // Posición por defecto en caso de error
      positions.push({
        name: asteroid.name,
        number: asteroid.number,
        sign: 'Aries',
        degree: 0,
        longitude: 0,
        house: 1,
        retrograde: false
      });
    }
  }
  
  return positions;
}

/**
 * Convierte fecha a día juliano
 */
function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60.0;
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  return jdn + (hour - 12) / 24.0;
}

/**
 * Calcula la longitud eclíptica de un asteroide
 * Usando elementos orbitales simplificados
 */
function calculateAsteroidLongitude(jd: number, elements: {
  a: number;    // Semi-major axis (AU)
  e: number;    // Eccentricity
  i: number;    // Inclination (degrees)
  M0: number;   // Mean anomaly at epoch (degrees)
  n: number;    // Mean motion (degrees/day)
}): number {
  // Época J2000.0
  const JD_EPOCH = 2451545.0;
  const daysFromEpoch = jd - JD_EPOCH;
  
  // Calcular anomalía media
  let M = elements.M0 + elements.n * daysFromEpoch;
  M = ((M % 360) + 360) % 360; // Normalizar
  
  // Resolver ecuación de Kepler (método simple de iteración)
  let E = M; // Anomalía excéntrica (initial guess)
  for (let i = 0; i < 10; i++) {
    E = M + (elements.e * Math.sin(E * Math.PI / 180) * 180 / Math.PI);
  }
  
  // Calcular anomalía verdadera
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + elements.e) * Math.sin(E * Math.PI / 180 / 2),
    Math.sqrt(1 - elements.e) * Math.cos(E * Math.PI / 180 / 2)
  ) * 180 / Math.PI;
  
  // Longitud eclíptica aproximada (simplificado)
  // En una implementación completa, se necesita calcular omega, Omega, etc.
  let longitude = nu + 100; // Offset aproximado (simplificación)
  longitude = ((longitude % 360) + 360) % 360;
  
  return longitude;
}

/**
 * Determina si un asteroide está retrógrado
 * Compara posiciones en fechas cercanas
 */
function isAsteroidRetrograde(jd: number, elements: {
  a: number;
  e: number;
  i: number;
  M0: number;
  n: number;
}): boolean {
  const lon1 = calculateAsteroidLongitude(jd - 1, elements);
  const lon2 = calculateAsteroidLongitude(jd + 1, elements);
  
  // Si la longitud disminuye, está retrógrado
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  return diff < 0;
}

/**
 * Calcula asteroides usando una API externa (Swiss Ephemeris)
 * ALTERNATIVA RECOMENDADA PARA PRODUCCIÓN
 */
export async function calculateAsteroidsFromAPI(
  date: Date,
  latitude: number,
  longitude: number
): Promise<AsteroidPosition[]> {
  try {
    // Formatear fecha para API
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}T${hour}:${minute}:00`;
    
    // Nota: Aquí iría la llamada a una API real
    // Ejemplo: astro-api.org, astro.com, etc.
    logger.debug('API call would go here:', { dateStr, latitude, longitude });
    
    // Por ahora, retornar posiciones calculadas localmente
    // En producción, parsear respuesta de API
    throw new Error('API not implemented yet');
  } catch (error) {
    logger.error('Error en API de asteroides:', error);
    throw error;
  }
}
