/**
 * SISTEMA DE DIGNIDADES PLANETARIAS
 * Define domicilio, exaltación, caída y exilio de cada planeta
 * Influye directamente en la severidad de las reglas
 */

export type DignityType = 'domicile' | 'exaltation' | 'fall' | 'detriment' | 'neutral';

export interface DignityInfo {
  type: DignityType;
  strength: number; // -2 (detriment) a +2 (domicile)
  description: string;
}

/**
 * Tabla de dignidades esenciales
 */
export const DIGNITIES = {
  domicile: {
    'Sun': ['Leo'],
    'Moon': ['Cancer'],
    'Mercury': ['Gemini', 'Virgo'],
    'Venus': ['Taurus', 'Libra'],
    'Mars': ['Aries', 'Scorpio'],
    'Jupiter': ['Sagittarius', 'Pisces'],
    'Saturn': ['Capricorn', 'Aquarius'],
    'Uranus': ['Aquarius'],
    'Neptune': ['Pisces'],
    'Pluto': ['Scorpio']
  },
  exaltation: {
    'Sun': ['Aries'],
    'Moon': ['Taurus'],
    'Mercury': ['Virgo'], // o Aquarius según tradición
    'Venus': ['Pisces'],
    'Mars': ['Capricorn'],
    'Jupiter': ['Cancer'],
    'Saturn': ['Libra'],
    'Uranus': ['Scorpio'],
    'Neptune': ['Cancer'], // o Leo según tradición
    'Pluto': ['Aries'] // o Leo según tradición
  },
  fall: {
    'Sun': ['Libra'],
    'Moon': ['Scorpio'],
    'Mercury': ['Pisces'],
    'Venus': ['Virgo'],
    'Mars': ['Cancer'],
    'Jupiter': ['Capricorn'],
    'Saturn': ['Aries'],
    'Uranus': ['Taurus'],
    'Neptune': ['Capricorn'], // o Virgo según tradición
    'Pluto': ['Libra'] // o Aquarius según tradición
  },
  detriment: {
    'Sun': ['Aquarius'],
    'Moon': ['Capricorn'],
    'Mercury': ['Sagittarius', 'Pisces'],
    'Venus': ['Aries', 'Scorpio'],
    'Mars': ['Taurus', 'Libra'],
    'Jupiter': ['Gemini', 'Virgo'],
    'Saturn': ['Cancer', 'Leo'],
    'Uranus': ['Leo'],
    'Neptune': ['Virgo'], // o Gemini según tradición
    'Pluto': ['Taurus'] // o Cancer según tradición
  }
} as const;

/**
 * Obtiene la dignidad de un planeta en un signo específico
 */
export function getPlanetDignity(planet: string, sign: string): DignityInfo {
  // Verificar domicilio (+2)
  if (DIGNITIES.domicile[planet as keyof typeof DIGNITIES.domicile]?.includes(sign)) {
    return {
      type: 'domicile',
      strength: 2,
      description: `${planet} está en domicilio en ${sign} (máxima fortaleza)`
    };
  }

  // Verificar exaltación (+1)
  if (DIGNITIES.exaltation[planet as keyof typeof DIGNITIES.exaltation]?.includes(sign)) {
    return {
      type: 'exaltation',
      strength: 1,
      description: `${planet} está exaltado en ${sign} (fortaleza elevada)`
    };
  }

  // Verificar caída (-1)
  if (DIGNITIES.fall[planet as keyof typeof DIGNITIES.fall]?.includes(sign)) {
    return {
      type: 'fall',
      strength: -1,
      description: `${planet} está en caída en ${sign} (debilidad)`
    };
  }

  // Verificar exilio/detrimento (-2)
  if (DIGNITIES.detriment[planet as keyof typeof DIGNITIES.detriment]?.includes(sign)) {
    return {
      type: 'detriment',
      strength: -2,
      description: `${planet} está en detrimento en ${sign} (máxima debilidad)`
    };
  }

  // Neutral (0)
  return {
    type: 'neutral',
    strength: 0,
    description: `${planet} en ${sign} tiene dignidad neutral`
  };
}

/**
 * Calcula el score total de dignidades de una carta
 */
export function calculateChartDignityScore(planets: Array<{ name: string; sign: string }>): number {
  return planets.reduce((total, planet) => {
    const dignity = getPlanetDignity(planet.name, planet.sign);
    return total + dignity.strength;
  }, 0);
}

/**
 * Identifica planetas en dignidad débil (fall o detriment)
 */
export function getWeakDignities(planets: Array<{ name: string; sign: string }>) {
  return planets
    .map(p => ({
      planet: p.name,
      sign: p.sign,
      dignity: getPlanetDignity(p.name, p.sign)
    }))
    .filter(d => d.dignity.type === 'fall' || d.dignity.type === 'detriment');
}

/**
 * Identifica planetas en dignidad fuerte (domicile o exaltation)
 */
export function getStrongDignities(planets: Array<{ name: string; sign: string }>) {
  return planets
    .map(p => ({
      planet: p.name,
      sign: p.sign,
      dignity: getPlanetDignity(p.name, p.sign)
    }))
    .filter(d => d.dignity.type === 'domicile' || d.dignity.type === 'exaltation');
}

/**
 * Ajusta la severidad de una condición basándose en dignidad
 * Ejemplo: Luna en caída + aspecto duro = +1 severidad
 */
export function adjustSeverityByDignity(
  baseSeverity: number,
  planet: string,
  sign: string
): number {
  const dignity = getPlanetDignity(planet, sign);
  
  if (dignity.type === 'detriment') return baseSeverity + 1;
  if (dignity.type === 'fall') return baseSeverity + 0.5;
  if (dignity.type === 'domicile') return Math.max(1, baseSeverity - 0.5);
  if (dignity.type === 'exaltation') return Math.max(1, baseSeverity - 0.25);
  
  return baseSeverity;
}
