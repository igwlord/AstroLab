/**
 * Calculador Avanzado de Aspectos Astrológicos
 * 
 * Incluye aspectos mayores y menores con orbes personalizados
 * según el tipo de planeta y aspecto.
 */

import type { PlanetPosition } from './realAstroCalculator';

export interface AspectType {
  name: string;
  angle: number;
  baseOrb: number;
  category: 'mayor' | 'menor';
  nature: 'armonico' | 'tenso' | 'neutral';
  symbol: string;
}

export interface EnhancedAspect {
  planet1: string;
  planet2: string;
  type: string;
  angle: number;
  orb: number;
  applying: boolean;
  exactness: number; // 0-100% qué tan exacto es el aspecto
  category: 'mayor' | 'menor';
  nature: 'armonico' | 'tenso' | 'neutral';
  symbol: string;
}

/**
 * Definición de todos los aspectos astrológicos
 */
const ASPECT_TYPES: AspectType[] = [
  // Aspectos Mayores
  {
    name: 'Conjunción',
    angle: 0,
    baseOrb: 10,
    category: 'mayor',
    nature: 'neutral',
    symbol: '☌'
  },
  {
    name: 'Oposición',
    angle: 180,
    baseOrb: 10,
    category: 'mayor',
    nature: 'tenso',
    symbol: '☍'
  },
  {
    name: 'Trígono',
    angle: 120,
    baseOrb: 8,
    category: 'mayor',
    nature: 'armonico',
    symbol: '△'
  },
  {
    name: 'Cuadratura',
    angle: 90,
    baseOrb: 8,
    category: 'mayor',
    nature: 'tenso',
    symbol: '□'
  },
  {
    name: 'Sextil',
    angle: 60,
    baseOrb: 6,
    category: 'mayor',
    nature: 'armonico',
    symbol: '⚹'
  },
  
  // Aspectos Menores
  {
    name: 'Quincunx',
    angle: 150,
    baseOrb: 3,
    category: 'menor',
    nature: 'neutral',
    symbol: '⚻'
  },
  {
    name: 'Semicuadratura',
    angle: 45,
    baseOrb: 2,
    category: 'menor',
    nature: 'tenso',
    symbol: '∠'
  },
  {
    name: 'Sesquicuadratura',
    angle: 135,
    baseOrb: 2,
    category: 'menor',
    nature: 'tenso',
    symbol: '⚼'
  },
  {
    name: 'Semisextil',
    angle: 30,
    baseOrb: 2,
    category: 'menor',
    nature: 'armonico',
    symbol: '⚺'
  },
  {
    name: 'Quintil',
    angle: 72,
    baseOrb: 2,
    category: 'menor',
    nature: 'armonico',
    symbol: 'Q'
  },
  {
    name: 'Biquintil',
    angle: 144,
    baseOrb: 2,
    category: 'menor',
    nature: 'armonico',
    symbol: 'bQ'
  }
];

/**
 * Multiplicadores de orbe según el tipo de planeta
 * Los luminares (Sol y Luna) y planetas personales tienen orbes más amplios
 */
const PLANET_ORB_MULTIPLIERS: Record<string, number> = {
  'Sol': 1.2,
  'Luna': 1.2,
  'Mercurio': 1.0,
  'Venus': 1.0,
  'Marte': 1.0,
  'Júpiter': 0.9,
  'Saturno': 0.9,
  'Urano': 0.8,
  'Neptuno': 0.8,
  'Plutón': 0.8
};

/**
 * Calcula el orbe efectivo para un aspecto entre dos planetas
 */
function calculateEffectiveOrb(
  planet1: string,
  planet2: string,
  baseOrb: number
): number {
  const mult1 = PLANET_ORB_MULTIPLIERS[planet1] || 0.7;
  const mult2 = PLANET_ORB_MULTIPLIERS[planet2] || 0.7;
  
  // Usar el promedio de los multiplicadores
  const avgMultiplier = (mult1 + mult2) / 2;
  
  return baseOrb * avgMultiplier;
}

/**
 * Calcula la diferencia angular más corta entre dos longitudes
 */
function calculateAngularDifference(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Determina si un aspecto está aplicando o separando
 * Aplicando: los planetas se acercan al aspecto exacto
 * Separando: los planetas se alejan del aspecto exacto
 */
function isAspectApplying(
  p1: PlanetPosition,
  p2: PlanetPosition
): boolean {
  // Simplificación: considerar el orden de las longitudes
  // Para un cálculo exacto necesitaríamos las velocidades diarias
  return p1.longitude < p2.longitude;
}

/**
 * Calcula aspectos entre todos los planetas con orbes personalizados
 */
export function calculateAspectsAdvanced(
  planets: PlanetPosition[],
  options: {
    includeMajor?: boolean;
    includeMinor?: boolean;
    customOrbs?: Record<string, number>;
  } = {}
): EnhancedAspect[] {
  const {
    includeMajor = true,
    includeMinor = true,
    customOrbs = {}
  } = options;
  
  const aspects: EnhancedAspect[] = [];
  
  // Filtrar aspectos según opciones
  const aspectTypesToUse = ASPECT_TYPES.filter(at => {
    if (at.category === 'mayor' && !includeMajor) return false;
    if (at.category === 'menor' && !includeMinor) return false;
    return true;
  });
  
  // Iterar sobre todos los pares de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      
      // Calcular ángulo entre planetas
      const angularDiff = calculateAngularDifference(p1.longitude, p2.longitude);
      
      // Probar cada tipo de aspecto
      for (const aspectType of aspectTypesToUse) {
        // Orbe personalizado o calculado
        const customOrb = customOrbs[aspectType.name];
        const effectiveOrb = customOrb !== undefined
          ? customOrb
          : calculateEffectiveOrb(p1.name, p2.name, aspectType.baseOrb);
        
        // Diferencia entre el ángulo real y el ángulo del aspecto
        const orbDifference = Math.abs(angularDiff - aspectType.angle);
        
        // Si está dentro del orbe, crear el aspecto
        if (orbDifference <= effectiveOrb) {
          // Calcular exactitud (100% = aspecto exacto, 0% = en el límite del orbe)
          const exactness = ((effectiveOrb - orbDifference) / effectiveOrb) * 100;
          
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: aspectType.name,
            angle: angularDiff,
            orb: orbDifference,
            applying: isAspectApplying(p1, p2),
            exactness: Math.round(exactness * 10) / 10, // 1 decimal
            category: aspectType.category,
            nature: aspectType.nature,
            symbol: aspectType.symbol
          });
        }
      }
    }
  }
  
  // Ordenar por exactitud (aspectos más exactos primero)
  aspects.sort((a, b) => b.exactness - a.exactness);
  
  return aspects;
}

/**
 * Calcula solo aspectos mayores (compatibilidad con versión anterior)
 */
export function calculateMajorAspects(
  planets: PlanetPosition[]
): EnhancedAspect[] {
  return calculateAspectsAdvanced(planets, {
    includeMajor: true,
    includeMinor: false
  });
}

/**
 * Calcula solo aspectos menores
 */
export function calculateMinorAspects(
  planets: PlanetPosition[]
): EnhancedAspect[] {
  return calculateAspectsAdvanced(planets, {
    includeMajor: false,
    includeMinor: true
  });
}

/**
 * Filtra aspectos por naturaleza
 */
export function filterAspectsByNature(
  aspects: EnhancedAspect[],
  nature: 'armonico' | 'tenso' | 'neutral'
): EnhancedAspect[] {
  return aspects.filter(a => a.nature === nature);
}

/**
 * Obtiene todos los aspectos de un planeta específico
 */
export function getAspectsForPlanet(
  aspects: EnhancedAspect[],
  planetName: string
): EnhancedAspect[] {
  return aspects.filter(
    a => a.planet1 === planetName || a.planet2 === planetName
  );
}

/**
 * Cuenta aspectos por tipo
 */
export function countAspectsByType(aspects: EnhancedAspect[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (const aspect of aspects) {
    counts[aspect.type] = (counts[aspect.type] || 0) + 1;
  }
  
  return counts;
}

/**
 * Obtiene estadísticas de aspectos
 */
export interface AspectStatistics {
  total: number;
  major: number;
  minor: number;
  harmonic: number;
  tense: number;
  neutral: number;
  byType: Record<string, number>;
  averageExactness: number;
}

export function calculateAspectStatistics(aspects: EnhancedAspect[]): AspectStatistics {
  const stats: AspectStatistics = {
    total: aspects.length,
    major: aspects.filter(a => a.category === 'mayor').length,
    minor: aspects.filter(a => a.category === 'menor').length,
    harmonic: aspects.filter(a => a.nature === 'armonico').length,
    tense: aspects.filter(a => a.nature === 'tenso').length,
    neutral: aspects.filter(a => a.nature === 'neutral').length,
    byType: countAspectsByType(aspects),
    averageExactness: aspects.length > 0
      ? aspects.reduce((sum, a) => sum + a.exactness, 0) / aspects.length
      : 0
  };
  
  return stats;
}
