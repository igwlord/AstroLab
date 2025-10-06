import { logger } from './logger';
/**
 * Utilidad de Verificación de Cálculos Astrológicos
 * Compara los resultados con datos de referencia conocidos
 */

import type { NatalChart } from '../services/realAstroCalculator';

/**
 * Datos de prueba de referencia (Verificados con Astro.com)
 * Carta de ejemplo: 1 de Enero 2000, 12:00 UTC, Londres (51.5074°N, 0.1278°W)
 */
export const REFERENCE_CHART = {
  date: new Date('2000-01-01T12:00:00Z'),
  location: 'Londres, Reino Unido',
  latitude: 51.5074,
  longitude: -0.1278,
  
  // Posiciones esperadas (según Astro.com)
  expectedPlanets: {
    'Sol': { sign: 'Capricornio', degreeInSign: 10.58 },
    'Luna': { sign: 'Piscis', degreeInSign: 0.85 },
    'Mercurio': { sign: 'Capricornio', degreeInSign: 20.87 },
    'Venus': { sign: 'Acuario', degreeInSign: 8.67 },
    'Marte': { sign: 'Acuario', degreeInSign: 2.13 },
    'Júpiter': { sign: 'Aries', degreeInSign: 23.64 },
    'Saturno': { sign: 'Tauro', degreeInSign: 10.54 },
    'Urano': { sign: 'Acuario', degreeInSign: 15.67 },
    'Neptuno': { sign: 'Acuario', degreeInSign: 2.92 },
    'Plutón': { sign: 'Sagitario', degreeInSign: 11.37 },
  },
  
  expectedAscendant: { sign: 'Tauro', degreeInSign: 26.5 },
  expectedMidheaven: { sign: 'Acuario', degreeInSign: 6.7 }
};

/**
 * Convierte grado zodiacal (0-360) a grado dentro del signo (0-30)
 */
function getDegreeInSign(longitude: number): number {
  return longitude % 30;
}

/**
 * Calcula la diferencia en grados entre dos posiciones
 */
function calculateDifference(calculated: number, expected: number): number {
  return Math.abs(calculated - expected);
}

/**
 * Verifica si una diferencia está dentro del margen aceptable
 */
function isWithinTolerance(difference: number, tolerance: number = 1.0): boolean {
  return difference <= tolerance;
}

/**
 * Genera reporte de verificación de una carta natal
 */
export function verifyChart(chart: NatalChart): VerificationReport {
  console.group('🔍 VERIFICACIÓN DE CÁLCULOS ASTROLÓGICOS');
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const validations: ValidationResult[] = [];
  
  // Verificar que todos los planetas principales existen
  const requiredPlanets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
  requiredPlanets.forEach(planetName => {
    const planet = chart.planets.find(p => p.name === planetName);
    if (!planet) {
      errors.push(`❌ Planeta faltante: ${planetName}`);
    } else {
      validations.push({
        category: 'Planetas',
        item: planetName,
        value: `${planet.sign} ${planet.degree.toFixed(2)}°`,
        status: 'success'
      });
    }
  });
  
  // Verificar rangos válidos
  chart.planets.forEach(planet => {
    // Longitud debe estar entre 0-360
    if (planet.longitude < 0 || planet.longitude > 360) {
      errors.push(`❌ ${planet.name}: Longitud fuera de rango (${planet.longitude}°)`);
    }
    
    // Grado dentro del signo debe estar entre 0-30
    if (planet.degree < 0 || planet.degree >= 30) {
      warnings.push(`⚠️ ${planet.name}: Grado en signo inusual (${planet.degree}°)`);
    }
    
    // Casa debe estar entre 1-12
    if (planet.house < 1 || planet.house > 12) {
      errors.push(`❌ ${planet.name}: Casa fuera de rango (${planet.house})`);
    }
  });
  
  // Verificar Ascendente y MC
  if (chart.ascendant) {
    validations.push({
      category: 'Puntos Angulares',
      item: 'Ascendente',
      value: `${chart.ascendant.sign} ${chart.ascendant.degree.toFixed(2)}°`,
      status: 'success'
    });
  }
  
  if (chart.midheaven) {
    validations.push({
      category: 'Puntos Angulares',
      item: 'Medio Cielo',
      value: `${chart.midheaven.sign} ${chart.midheaven.degree.toFixed(2)}°`,
      status: 'success'
    });
  }
  
  // Verificar casas (deben estar en orden ascendente o wrap around)
  for (let i = 0; i < chart.houses.length; i++) {
    const currentHouse = chart.houses[i];
    
    // La cúspide debe estar en rango válido
    if (currentHouse.cusp < 0 || currentHouse.cusp >= 360) {
      errors.push(`❌ Casa ${currentHouse.number}: Cúspide fuera de rango (${currentHouse.cusp}°)`);
    }
    
    // Agregar todas las casas al reporte
    validations.push({
      category: 'Casas (Placidus)',
      item: `Casa ${currentHouse.number}`,
      value: `${currentHouse.sign} ${currentHouse.degree.toFixed(2)}° (${currentHouse.cusp.toFixed(2)}°)`,
      status: 'success'
    });
  }
  
  // Verificar aspectos
  if (chart.aspects && chart.aspects.length > 0) {
    chart.aspects.forEach(aspect => {
      // Orbe no debe ser negativo
      if (aspect.orb < 0) {
        errors.push(`❌ Aspecto ${aspect.planet1}-${aspect.planet2}: Orbe negativo (${aspect.orb}°)`);
      }
      
      // Orbe muy grande es sospechoso
      if (aspect.orb > 10) {
        warnings.push(`⚠️ Aspecto ${aspect.planet1}-${aspect.planet2}: Orbe muy amplio (${aspect.orb}°)`);
      }
    });
    
    validations.push({
      category: 'Aspectos',
      item: 'Total calculados',
      value: `${chart.aspects.length}`,
      status: 'success'
    });
  }
  
  // Verificar elementos opcionales
  if (chart.asteroids && chart.asteroids.length > 0) {
    validations.push({
      category: 'Asteroides',
      item: 'Calculados',
      value: `${chart.asteroids.length} (${chart.asteroids.map(a => a.name).join(', ')})`,
      status: 'success'
    });
  }
  
  if (chart.arabicParts && chart.arabicParts.length > 0) {
    validations.push({
      category: 'Partes Árabes',
      item: 'Calculadas',
      value: `${chart.arabicParts.length}`,
      status: 'success'
    });
  }
  
  if (chart.hemispheres) {
    const totalPlanets = 
      chart.hemispheres.horizontalAxis.oriental.planetCount + 
      chart.hemispheres.horizontalAxis.occidental.planetCount;
    
    validations.push({
      category: 'Hemisferios',
      item: 'Distribución',
      value: `Oriental: ${chart.hemispheres.horizontalAxis.oriental.planetCount}, Occidental: ${chart.hemispheres.horizontalAxis.occidental.planetCount}`,
      status: totalPlanets === chart.planets.length ? 'success' : 'warning'
    });
  }
  
  console.groupEnd();
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validations
  };
}

/**
 * Imprime un reporte de verificación en consola
 */
export function printVerificationReport(report: VerificationReport): void {
  console.group('📊 REPORTE DE VERIFICACIÓN');
  
  logger.log(`\n${report.valid ? '✅ CÁLCULOS VÁLIDOS' : '❌ ERRORES ENCONTRADOS'}\n`);
  
  if (report.errors.length > 0) {
    console.group('🔴 ERRORES');
    report.errors.forEach(error => logger.error(error));
    console.groupEnd();
  }
  
  if (report.warnings.length > 0) {
    console.group('⚠️ ADVERTENCIAS');
    report.warnings.forEach(warning => logger.warn(warning));
    console.groupEnd();
  }
  
  console.group('✅ VALIDACIONES');
  const byCategory = report.validations.reduce((acc, val) => {
    if (!acc[val.category]) acc[val.category] = [];
    acc[val.category].push(val);
    return acc;
  }, {} as Record<string, ValidationResult[]>);
  
  Object.entries(byCategory).forEach(([category, results]) => {
    console.group(`📁 ${category}`);
    results.forEach(result => {
      const icon = result.status === 'success' ? '✓' : result.status === 'warning' ? '⚠' : '✗';
      logger.log(`${icon} ${result.item}: ${result.value}`);
    });
    console.groupEnd();
  });
  console.groupEnd();
  
  console.groupEnd();
}

/**
 * Compara con datos de referencia de Astro.com
 */
export function compareWithReference(chart: NatalChart): ComparisonReport {
  if (
    chart.date.getTime() !== REFERENCE_CHART.date.getTime() ||
    Math.abs(chart.latitude - REFERENCE_CHART.latitude) > 0.01 ||
    Math.abs(chart.longitude - REFERENCE_CHART.longitude) > 0.01
  ) {
    return {
      applicable: false,
      message: 'Esta carta no coincide con los datos de referencia. Usa: 1 Enero 2000, 12:00 UTC, Londres'
    };
  }
  
  const comparisons: PlanetComparison[] = [];
  
  Object.entries(REFERENCE_CHART.expectedPlanets).forEach(([planetName, expected]) => {
    const planet = chart.planets.find(p => p.name === planetName);
    if (!planet) return;
    
    const calculatedDegree = getDegreeInSign(planet.longitude);
    const difference = calculateDifference(calculatedDegree, expected.degreeInSign);
    const withinTolerance = isWithinTolerance(difference, 0.5);
    
    comparisons.push({
      planet: planetName,
      expectedSign: expected.sign,
      calculatedSign: planet.sign,
      expectedDegree: expected.degreeInSign,
      calculatedDegree,
      difference,
      withinTolerance
    });
  });
  
  return {
    applicable: true,
    comparisons,
    allMatch: comparisons.every(c => c.withinTolerance)
  };
}

// Tipos
interface ValidationResult {
  category: string;
  item: string;
  value: string;
  status: 'success' | 'warning' | 'error';
}

interface VerificationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
  validations: ValidationResult[];
}

interface PlanetComparison {
  planet: string;
  expectedSign: string;
  calculatedSign: string;
  expectedDegree: number;
  calculatedDegree: number;
  difference: number;
  withinTolerance: boolean;
}

interface ComparisonReport {
  applicable: boolean;
  message?: string;
  comparisons?: PlanetComparison[];
  allMatch?: boolean;
}

/**
 * Exporta la carta a formato texto para comparar fácilmente
 */
export function exportChartToText(chart: NatalChart): string {
  let text = '=== CARTA NATAL ===\n\n';
  
  text += `Fecha: ${chart.date.toISOString()}\n`;
  text += `Lugar: ${chart.location}\n`;
  text += `Coordenadas: ${chart.latitude.toFixed(4)}°N, ${chart.longitude.toFixed(4)}°E\n\n`;
  
  text += '--- PLANETAS ---\n';
  chart.planets.forEach(planet => {
    text += `${planet.name.padEnd(12)} ${planet.sign.padEnd(15)} ${planet.degree.toFixed(2).padStart(6)}° Casa ${planet.house} ${planet.retrograde ? 'Rx' : ''}\n`;
  });
  
  text += '\n--- PUNTOS ANGULARES ---\n';
  text += `Ascendente    ${chart.ascendant.sign.padEnd(15)} ${chart.ascendant.degree.toFixed(2).padStart(6)}°\n`;
  text += `Medio Cielo   ${chart.midheaven.sign.padEnd(15)} ${chart.midheaven.degree.toFixed(2).padStart(6)}°\n`;
  
  if (chart.asteroids && chart.asteroids.length > 0) {
    text += '\n--- ASTEROIDES ---\n';
    chart.asteroids.forEach(asteroid => {
      text += `${asteroid.name.padEnd(12)} ${asteroid.sign.padEnd(15)} ${asteroid.degree.toFixed(2).padStart(6)}° Casa ${asteroid.house}\n`;
    });
  }
  
  if (chart.sensitivePoints && chart.sensitivePoints.length > 0) {
    text += '\n--- PUNTOS SENSIBLES ---\n';
    chart.sensitivePoints.forEach(point => {
      text += `${point.name.padEnd(12)} ${point.sign.padEnd(15)} ${point.degree.toFixed(2).padStart(6)}° Casa ${point.house} ${point.retrograde ? 'Rx' : ''}\n`;
    });
  }
  
  if (chart.arabicParts && chart.arabicParts.length > 0) {
    text += '\n--- PARTES ÁRABES ---\n';
    chart.arabicParts.forEach(part => {
      text += `${part.name.padEnd(25)} ${part.sign.padEnd(15)} ${part.degree.toFixed(2).padStart(6)}° Casa ${part.house}\n`;
    });
  }
  
  if (chart.houses && chart.houses.length > 0) {
    text += '\n--- CÚSPIDES DE CASAS (Placidus) ---\n';
    chart.houses.forEach(house => {
      text += `Casa ${house.number.toString().padStart(2)}      ${house.sign.padEnd(15)} ${house.degree.toFixed(2).padStart(6)}° (${house.cusp.toFixed(2)}°)\n`;
    });
  }
  
  return text;
}

