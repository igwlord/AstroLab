import type { ModalityStats, ElementStats, PolarityStats, QuadrantStats, ChartStatistics } from '../types/chartStatistics';

// Mapeo de signos a modalidades
const MODALITY_MAP: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
  'Aries': 'cardinal',
  'Tauro': 'fixed',
  'Géminis': 'mutable',
  'Cáncer': 'cardinal',
  'Leo': 'fixed',
  'Virgo': 'mutable',
  'Libra': 'cardinal',
  'Escorpio': 'fixed',
  'Sagitario': 'mutable',
  'Capricornio': 'cardinal',
  'Acuario': 'fixed',
  'Piscis': 'mutable',
};

// Mapeo de signos a elementos
const ELEMENT_MAP: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  'Aries': 'fire',
  'Tauro': 'earth',
  'Géminis': 'air',
  'Cáncer': 'water',
  'Leo': 'fire',
  'Virgo': 'earth',
  'Libra': 'air',
  'Escorpio': 'water',
  'Sagitario': 'fire',
  'Capricornio': 'earth',
  'Acuario': 'air',
  'Piscis': 'water',
};

// Mapeo de signos a polaridades (Masculino/Yang = Fuego+Aire, Femenino/Yin = Tierra+Agua)
const POLARITY_MAP: Record<string, 'masculine' | 'feminine'> = {
  'Aries': 'masculine',      // Fuego
  'Tauro': 'feminine',       // Tierra
  'Géminis': 'masculine',    // Aire
  'Cáncer': 'feminine',      // Agua
  'Leo': 'masculine',        // Fuego
  'Virgo': 'feminine',       // Tierra
  'Libra': 'masculine',      // Aire
  'Escorpio': 'feminine',    // Agua
  'Sagitario': 'masculine',  // Fuego
  'Capricornio': 'feminine', // Tierra
  'Acuario': 'masculine',    // Aire
  'Piscis': 'feminine',      // Agua
};

interface Planet {
  name: string;
  sign: string;
  house: number;
  degree: number;
  retrograde?: boolean;
}

/**
 * Calcula la distribución de planetas por modalidad (Cardinal, Fijo, Mutable)
 */
export function calculateModalities(planets: Planet[]): ModalityStats {
  const stats = {
    cardinal: { count: 0, percentage: 0, signs: [] as string[] },
    fixed: { count: 0, percentage: 0, signs: [] as string[] },
    mutable: { count: 0, percentage: 0, signs: [] as string[] },
  };

  const total = planets.length;

  planets.forEach(planet => {
    const modality = MODALITY_MAP[planet.sign];
    if (modality) {
      stats[modality].count++;
      stats[modality].signs.push(`${planet.name} en ${planet.sign}`);
    }
  });

  // Calcular porcentajes
  stats.cardinal.percentage = total > 0 ? Math.round((stats.cardinal.count / total) * 1000) / 10 : 0;
  stats.fixed.percentage = total > 0 ? Math.round((stats.fixed.count / total) * 1000) / 10 : 0;
  stats.mutable.percentage = total > 0 ? Math.round((stats.mutable.count / total) * 1000) / 10 : 0;

  return stats;
}

/**
 * Calcula la distribución de planetas por elemento (Fuego, Tierra, Aire, Agua)
 */
export function calculateElements(planets: Planet[]): ElementStats {
  const stats = {
    fire: { count: 0, percentage: 0, signs: [] as string[] },
    earth: { count: 0, percentage: 0, signs: [] as string[] },
    air: { count: 0, percentage: 0, signs: [] as string[] },
    water: { count: 0, percentage: 0, signs: [] as string[] },
  };

  const total = planets.length;

  planets.forEach(planet => {
    const element = ELEMENT_MAP[planet.sign];
    if (element) {
      stats[element].count++;
      stats[element].signs.push(`${planet.name} en ${planet.sign}`);
    }
  });

  // Calcular porcentajes
  stats.fire.percentage = total > 0 ? Math.round((stats.fire.count / total) * 1000) / 10 : 0;
  stats.earth.percentage = total > 0 ? Math.round((stats.earth.count / total) * 1000) / 10 : 0;
  stats.air.percentage = total > 0 ? Math.round((stats.air.count / total) * 1000) / 10 : 0;
  stats.water.percentage = total > 0 ? Math.round((stats.water.count / total) * 1000) / 10 : 0;

  return stats;
}

/**
 * Calcula la distribución de planetas por polaridad (Masculino/Yang, Femenino/Yin)
 */
export function calculatePolarities(planets: Planet[]): PolarityStats {
  const stats = {
    masculine: { count: 0, percentage: 0, signs: [] as string[] },
    feminine: { count: 0, percentage: 0, signs: [] as string[] },
  };

  const total = planets.length;

  planets.forEach(planet => {
    const polarity = POLARITY_MAP[planet.sign];
    if (polarity) {
      stats[polarity].count++;
      stats[polarity].signs.push(`${planet.name} en ${planet.sign}`);
    }
  });

  // Calcular porcentajes
  stats.masculine.percentage = total > 0 ? Math.round((stats.masculine.count / total) * 1000) / 10 : 0;
  stats.feminine.percentage = total > 0 ? Math.round((stats.feminine.count / total) * 1000) / 10 : 0;

  return stats;
}

/**
 * Calcula la distribución de planetas por cuadrante
 * Cuadrante I: Casas 1, 2, 3 (ASC a IC) - Yo interior
 * Cuadrante II: Casas 4, 5, 6 (IC a DESC) - Yo exterior
 * Cuadrante III: Casas 7, 8, 9 (DESC a MC) - Tú interior
 * Cuadrante IV: Casas 10, 11, 12 (MC a ASC) - Tú exterior
 */
export function calculateQuadrants(planets: Planet[]): QuadrantStats {
  const stats = {
    first: { count: 0, percentage: 0, houses: [] as number[] },
    second: { count: 0, percentage: 0, houses: [] as number[] },
    third: { count: 0, percentage: 0, houses: [] as number[] },
    fourth: { count: 0, percentage: 0, houses: [] as number[] },
  };

  const total = planets.length;

  planets.forEach(planet => {
    const house = planet.house;
    
    if (house >= 1 && house <= 3) {
      stats.first.count++;
      stats.first.houses.push(house);
    } else if (house >= 4 && house <= 6) {
      stats.second.count++;
      stats.second.houses.push(house);
    } else if (house >= 7 && house <= 9) {
      stats.third.count++;
      stats.third.houses.push(house);
    } else if (house >= 10 && house <= 12) {
      stats.fourth.count++;
      stats.fourth.houses.push(house);
    }
  });

  // Calcular porcentajes
  stats.first.percentage = total > 0 ? Math.round((stats.first.count / total) * 1000) / 10 : 0;
  stats.second.percentage = total > 0 ? Math.round((stats.second.count / total) * 1000) / 10 : 0;
  stats.third.percentage = total > 0 ? Math.round((stats.third.count / total) * 1000) / 10 : 0;
  stats.fourth.percentage = total > 0 ? Math.round((stats.fourth.count / total) * 1000) / 10 : 0;

  return stats;
}

/**
 * Calcula todas las estadísticas de la carta natal
 */
export function calculateChartStatistics(planets: Planet[]): ChartStatistics {
  return {
    modalities: calculateModalities(planets),
    elements: calculateElements(planets),
    polarities: calculatePolarities(planets),
    quadrants: calculateQuadrants(planets),
  };
}
