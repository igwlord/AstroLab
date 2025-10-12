/**
 * NORMALIZADOR DE PLANETAS Y SIGNOS (ES ↔ EN)
 * Evita bugs por diferencias de idioma entre frontend y motor de análisis
 * 
 * Uso: normalizeChart(chart) antes de cualquier análisis
 */

export const PLANET_MAP: Record<string, string> = {
  // Español → Inglés normalizado
  'Sol': 'Sun',
  'Luna': 'Moon',
  'Mercurio': 'Mercury',
  'Venus': 'Venus',
  'Marte': 'Mars',
  'Júpiter': 'Jupiter',
  'Saturno': 'Saturn',
  'Urano': 'Uranus',
  'Neptuno': 'Neptune',
  'Plutón': 'Pluto',
  'Quirón': 'Chiron',
  'Chiron': 'Chiron',
  
  // Inglés → Inglés (passthrough)
  'Sun': 'Sun',
  'Moon': 'Moon',
  'Mercury': 'Mercury',
  'Mars': 'Mars',
  'Jupiter': 'Jupiter',
  'Saturn': 'Saturn',
  'Uranus': 'Uranus',
  'Neptune': 'Neptune',
  'Pluto': 'Pluto'
};

export const SIGN_MAP: Record<string, string> = {
  // Español → Inglés
  'Aries': 'Aries',
  'Tauro': 'Taurus',
  'Géminis': 'Gemini',
  'Cáncer': 'Cancer',
  'Leo': 'Leo',
  'Virgo': 'Virgo',
  'Libra': 'Libra',
  'Escorpio': 'Scorpio',
  'Sagitario': 'Sagittarius',
  'Capricornio': 'Capricorn',
  'Acuario': 'Aquarius',
  'Piscis': 'Pisces',
  
  // Inglés → Inglés (passthrough)
  'Taurus': 'Taurus',
  'Gemini': 'Gemini',
  'Cancer': 'Cancer',
  'Scorpio': 'Scorpio',
  'Sagittarius': 'Sagittarius',
  'Capricorn': 'Capricorn',
  'Aquarius': 'Aquarius',
  'Pisces': 'Pisces'
};

export const ASPECT_MAP: Record<string, string> = {
  // Español → Inglés
  'conjunción': 'conjunction',
  'oposición': 'opposition',
  'trígono': 'trine',
  'cuadratura': 'square',
  'sextil': 'sextile',
  'quincuncio': 'quincunx',
  
  // Inglés → Inglés
  'conjunction': 'conjunction',
  'opposition': 'opposition',
  'trine': 'trine',
  'square': 'square',
  'sextile': 'sextile',
  'quincunx': 'quincunx'
};

export interface NatalChart {
  id?: string;
  birth_datetime?: string;
  location?: string;
  planets?: Array<{
    name: string;
    sign: string;
    deg: number;
    house: number;
    retrograde?: boolean;
  }>;
  aspects?: Array<{
    a: string;
    b: string;
    type: string;
    orb: number;
  }>;
}

/**
 * Normaliza una carta natal a formato inglés estándar
 */
export function normalizeChart(chart: NatalChart): NatalChart {
  return {
    ...chart,
    planets: chart.planets?.map(p => ({
      ...p,
      name: PLANET_MAP[p.name] || p.name,
      sign: SIGN_MAP[p.sign] || p.sign
    })) || [],
    aspects: chart.aspects?.map(a => ({
      ...a,
      a: PLANET_MAP[a.a] || a.a,
      b: PLANET_MAP[a.b] || a.b,
      type: ASPECT_MAP[a.type] || a.type
    })) || []
  };
}

/**
 * Verifica si un planeta está normalizado
 */
export function isPlanetNormalized(planetName: string): boolean {
  return Object.values(PLANET_MAP).includes(planetName);
}

/**
 * Verifica si un signo está normalizado
 */
export function isSignNormalized(signName: string): boolean {
  return Object.values(SIGN_MAP).includes(signName);
}
