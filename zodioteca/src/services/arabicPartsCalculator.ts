/**
 * Calculador de Partes Árabes (Arabic Parts / Lots)
 * 
 * Las Partes Árabes son puntos calculados matemáticamente que representan
 * la síntesis de tres factores astrológicos. La más famosa es la Parte de la Fortuna.
 * 
 * Fórmula general:
 * Parte = Ascendente + Punto1 - Punto2
 * 
 * Para cartas nocturnas (Sol bajo horizonte), algunas partes invierten la fórmula.
 */

export interface ArabicPart {
  name: string;
  symbol: string;
  type: 'fortune' | 'spirit' | 'love' | 'destiny' | 'courage' | 'children' | 'commerce';
  sign: string;
  degree: number;
  longitude: number;
  house: number;
  description: string;
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
 * Normaliza un ángulo al rango 0-360
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Determina si la carta es diurna (Sol sobre horizonte) o nocturna
 * 
 * CORRECCIÓN: El horizonte va del Ascendente (Casa 1) al Descendente (Casa 7)
 * - Diurna: Sol en casas 7, 8, 9, 10, 11, 12 (SOBRE el horizonte)
 * - Nocturna: Sol en casas 1, 2, 3, 4, 5, 6 (BAJO el horizonte)
 * 
 * El ángulo desde el Descendente (ASC+180°) al Sol, medido en sentido anti-horario:
 * - Si está entre 0° y 180°: Sol está SOBRE horizonte (Diurna)
 * - Si está entre 180° y 360°: Sol está BAJO horizonte (Nocturna)
 */
function isChartDiurnal(sunLongitude: number, ascendantLongitude: number): boolean {
  // Descendente está a 180° del Ascendente
  const descendant = normalizeAngle(ascendantLongitude + 180);
  
  // Calcular ángulo desde el Descendente al Sol (sentido anti-horario)
  const angleFromDesc = normalizeAngle(sunLongitude - descendant);
  
  // Si el ángulo es 0-180°, el Sol está sobre el horizonte (casas 7-12)
  return angleFromDesc >= 0 && angleFromDesc < 180;
}

/**
 * Calcula la Parte de la Fortuna
 * La parte más importante, representa prosperidad material y bienestar físico
 * 
 * Carta Diurna: Asc + Luna - Sol
 * Carta Nocturna: Asc + Sol - Luna
 */
export function calculatePartOfFortune(
  ascendant: number,
  sun: number,
  moon: number,
  houseCusps: number[]
): ArabicPart {
  const isDiurnal = isChartDiurnal(sun, ascendant);
  
  let longitude: number;
  if (isDiurnal) {
    // Diurna: Asc + Luna - Sol
    longitude = normalizeAngle(ascendant + moon - sun);
  } else {
    // Nocturna: Asc + Sol - Luna
    longitude = normalizeAngle(ascendant + sun - moon);
  }
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte de la Fortuna',
    symbol: '⊗',
    type: 'fortune',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Prosperidad material, bienestar físico, donde encontramos satisfacción mundana'
  };
}

/**
 * Calcula la Parte del Espíritu
 * Complemento de la Fortuna, representa aspiraciones espirituales y propósito
 * 
 * Carta Diurna: Asc + Sol - Luna
 * Carta Nocturna: Asc + Luna - Sol
 */
export function calculatePartOfSpirit(
  ascendant: number,
  sun: number,
  moon: number,
  houseCusps: number[]
): ArabicPart {
  const isDiurnal = isChartDiurnal(sun, ascendant);
  
  let longitude: number;
  if (isDiurnal) {
    // Diurna: Asc + Sol - Luna (inverso a Fortuna)
    longitude = normalizeAngle(ascendant + sun - moon);
  } else {
    // Nocturna: Asc + Luna - Sol
    longitude = normalizeAngle(ascendant + moon - sun);
  }
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte del Espíritu',
    symbol: '☉',
    type: 'spirit',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Propósito espiritual, aspiraciones del alma, búsqueda de significado'
  };
}

/**
 * Calcula la Parte del Amor (Eros)
 * Representa el amor romántico y la atracción
 * 
 * Fórmula: Asc + Venus - Regente de Venus por signo
 * Simplificada: Asc + Venus - Sol (variante común)
 */
export function calculatePartOfLove(
  ascendant: number,
  venus: number,
  sun: number,
  houseCusps: number[]
): ArabicPart {
  // Variante simplificada: Asc + Venus - Sol
  const longitude = normalizeAngle(ascendant + venus - sun);
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte del Amor',
    symbol: '♡',
    type: 'love',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Amor romántico, atracción, relaciones íntimas y pasión'
  };
}

/**
 * Calcula la Parte del Destino (Fortuna Maior)
 * Representa el camino de vida y propósito kármico
 * 
 * Fórmula: Asc + Parte de Fortuna - Sol
 */
export function calculatePartOfDestiny(
  ascendant: number,
  sun: number,
  moon: number,
  houseCusps: number[]
): ArabicPart {
  // Primero calcular Parte de Fortuna
  const partOfFortune = calculatePartOfFortune(ascendant, sun, moon, houseCusps);
  
  // Parte de Destino: Asc + Fortuna - Sol
  const longitude = normalizeAngle(ascendant + partOfFortune.longitude - sun);
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte del Destino',
    symbol: '☆',
    type: 'destiny',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Propósito kármico, destino, lo que venimos a cumplir en esta vida'
  };
}

/**
 * Calcula la Parte del Coraje (Marte)
 * Representa valentía, acción y fuerza de voluntad
 * 
 * Fórmula: Asc + Parte de Fortuna - Marte
 */
export function calculatePartOfCourage(
  ascendant: number,
  sun: number,
  moon: number,
  mars: number,
  houseCusps: number[]
): ArabicPart {
  // Primero calcular Parte de Fortuna
  const partOfFortune = calculatePartOfFortune(ascendant, sun, moon, houseCusps);
  
  // Parte de Coraje: Asc + Fortuna - Marte
  const longitude = normalizeAngle(ascendant + partOfFortune.longitude - mars);
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte del Coraje',
    symbol: '⚔',
    type: 'courage',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Valentía, acción decisiva, fuerza de voluntad y determinación'
  };
}

/**
 * Calcula la Parte de los Hijos
 * Representa fertilidad, creatividad y relación con los hijos
 * 
 * Fórmula: Asc + Júpiter - Saturno
 */
export function calculatePartOfChildren(
  ascendant: number,
  jupiter: number,
  saturn: number,
  houseCusps: number[]
): ArabicPart {
  const longitude = normalizeAngle(ascendant + jupiter - saturn);
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte de los Hijos',
    symbol: '👶',
    type: 'children',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Fertilidad, creatividad, proyectos creativos y relación con los hijos'
  };
}

/**
 * Calcula la Parte del Comercio
 * Representa negocios, transacciones y habilidades mercantiles
 * 
 * Fórmula: Asc + Parte de Fortuna - Mercurio
 */
export function calculatePartOfCommerce(
  ascendant: number,
  sun: number,
  moon: number,
  mercury: number,
  houseCusps: number[]
): ArabicPart {
  // Primero calcular Parte de Fortuna
  const partOfFortune = calculatePartOfFortune(ascendant, sun, moon, houseCusps);
  
  // Parte de Comercio: Asc + Fortuna - Mercurio
  const longitude = normalizeAngle(ascendant + partOfFortune.longitude - mercury);
  
  const zodiac = longitudeToSign(longitude);
  const house = calculateHouseForLongitude(longitude, houseCusps);
  
  return {
    name: 'Parte del Comercio',
    symbol: '💰',
    type: 'commerce',
    sign: zodiac.sign,
    degree: zodiac.degree,
    longitude,
    house,
    description: 'Negocios, transacciones, habilidades comerciales y ganancias monetarias'
  };
}

/**
 * Calcula todas las Partes Árabes principales
 */
export async function calculateArabicParts(
  planets: { name: string; longitude: number }[],
  ascendantLongitude: number,
  houseCusps: number[]
): Promise<ArabicPart[]> {
  // Extraer longitudes planetarias
  const getPlanetLon = (name: string): number => {
    const planet = planets.find(p => p.name === name);
    return planet ? planet.longitude : 0;
  };
  
  const sun = getPlanetLon('Sol');
  const moon = getPlanetLon('Luna');
  const mercury = getPlanetLon('Mercurio');
  const venus = getPlanetLon('Venus');
  const mars = getPlanetLon('Marte');
  const jupiter = getPlanetLon('Júpiter');
  const saturn = getPlanetLon('Saturno');
  
  const parts: ArabicPart[] = [];
  
  // Calcular las 7 partes principales
  parts.push(calculatePartOfFortune(ascendantLongitude, sun, moon, houseCusps));
  parts.push(calculatePartOfSpirit(ascendantLongitude, sun, moon, houseCusps));
  parts.push(calculatePartOfLove(ascendantLongitude, venus, sun, houseCusps));
  parts.push(calculatePartOfDestiny(ascendantLongitude, sun, moon, houseCusps));
  parts.push(calculatePartOfCourage(ascendantLongitude, sun, moon, mars, houseCusps));
  parts.push(calculatePartOfChildren(ascendantLongitude, jupiter, saturn, houseCusps));
  parts.push(calculatePartOfCommerce(ascendantLongitude, sun, moon, mercury, houseCusps));
  
  return parts;
}
