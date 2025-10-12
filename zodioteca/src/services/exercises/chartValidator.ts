/**
 * VALIDADOR DE CARTAS NATALES
 * Valida estructura y datos antes de análisis
 * Previene crashes por datos malformados
 */

import type { NatalChart } from './planetNormalizer';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const VALID_PLANETS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'
];

const VALID_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const VALID_ASPECTS = [
  'conjunction', 'opposition', 'trine', 'square', 'sextile', 'quincunx'
];

/**
 * Valida una carta natal completa
 */
export function validateChart(chart: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Validación básica de estructura
  if (!chart) {
    errors.push('Chart is null or undefined');
    return { valid: false, errors, warnings };
  }

  if (typeof chart !== 'object') {
    errors.push('Chart must be an object');
    return { valid: false, errors, warnings };
  }

  // 2. Validar array de planetas
  if (!Array.isArray(chart.planets)) {
    errors.push('Chart must have a "planets" array');
  } else if (chart.planets.length === 0) {
    errors.push('Chart must have at least 1 planet');
  } else {
    // Validar cada planeta
    chart.planets.forEach((p: any, index: number) => {
      if (!p.name) {
        errors.push(`Planet ${index} missing "name" field`);
      } else if (!VALID_PLANETS.includes(p.name)) {
        warnings.push(`Planet "${p.name}" at index ${index} is not in standard list (may need normalization)`);
      }

      if (!p.sign) {
        errors.push(`Planet ${p.name || index} missing "sign" field`);
      } else if (!VALID_SIGNS.includes(p.sign)) {
        warnings.push(`Sign "${p.sign}" for ${p.name} is not normalized`);
      }

      if (typeof p.house !== 'number') {
        errors.push(`Planet ${p.name || index} missing or invalid "house" field`);
      } else if (p.house < 1 || p.house > 12) {
        errors.push(`Planet ${p.name || index} has invalid house ${p.house} (must be 1-12)`);
      }

      if (typeof p.deg !== 'number') {
        warnings.push(`Planet ${p.name || index} missing "deg" field`);
      } else if (p.deg < 0 || p.deg >= 360) {
        errors.push(`Planet ${p.name || index} has invalid degree ${p.deg} (must be 0-359.99)`);
      }
    });
  }

  // 3. Validar array de aspectos (soporta "a"/"b" y "planet1"/"planet2")
  if (!Array.isArray(chart.aspects)) {
    errors.push('Chart must have an "aspects" array (can be empty)');
  } else {
    chart.aspects.forEach((a: any, index: number) => {
      // Soportar ambas estructuras: {a, b} o {planet1, planet2}
      const hasOldFormat = a.a && a.b;
      const hasNewFormat = a.planet1 && a.planet2;
      
      if (!hasOldFormat && !hasNewFormat) {
        errors.push(`Aspect ${index} missing planet references (needs "a"/"b" or "planet1"/"planet2")`);
      }

      if (!a.type) {
        errors.push(`Aspect ${index} missing "type" field`);
      } else if (!VALID_ASPECTS.includes(a.type)) {
        warnings.push(`Aspect type "${a.type}" at index ${index} is not normalized`);
      }

      if (typeof a.orb !== 'number') {
        warnings.push(`Aspect ${index} missing "orb" field`);
      } else if (a.orb < 0 || a.orb > 15) {
        warnings.push(`Aspect ${index} has unusual orb ${a.orb}° (typically 0-10°)`);
      }
    });
  }

  // 4. Validaciones de integridad
  if (chart.planets && Array.isArray(chart.planets)) {
    // Verificar que hay planetas básicos
    const hasSun = chart.planets.some((p: any) => p.name === 'Sun');
    const hasMoon = chart.planets.some((p: any) => p.name === 'Moon');
    
    if (!hasSun) warnings.push('Chart missing Sun - analysis may be incomplete');
    if (!hasMoon) warnings.push('Chart missing Moon - emotional analysis may be limited');

    // Verificar duplicados
    const planetNames = chart.planets.map((p: any) => p.name);
    const duplicates = planetNames.filter((name: string, index: number) => 
      planetNames.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      errors.push(`Duplicate planets found: ${duplicates.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Sanitiza una carta natal (intenta corregir errores menores)
 */
export function sanitizeChart(chart: NatalChart): NatalChart {
  return {
    ...chart,
    planets: chart.planets
      ? chart.planets
          .filter(p => p.name && p.sign) // Remover planetas sin nombre o signo
          .map(p => ({
            ...p,
            house: Math.max(1, Math.min(12, Math.round(p.house || 1))), // Forzar house 1-12
            deg: ((p.deg % 360) + 360) % 360, // Normalizar grados a 0-359.99
            retrograde: !!p.retrograde // Forzar booleano
          }))
      : [],
    aspects: chart.aspects
      ? chart.aspects
          .filter((a: any) => {
            // Soportar ambos formatos: {a, b} o {planet1, planet2}
            const hasOldFormat = a.a && a.b;
            const hasNewFormat = a.planet1 && a.planet2;
            return (hasOldFormat || hasNewFormat) && a.type;
          })
          .map((a: any) => ({
            // Normalizar a formato {a, b} si viene como {planet1, planet2}
            a: a.a || a.planet1,
            b: a.b || a.planet2,
            type: a.type,
            orb: Math.abs(a.orb || 0), // Forzar orb positivo
            isApplying: a.isApplying
          }))
      : []
  };
}

/**
 * Valida y normaliza una carta (proceso completo)
 */
export function validateAndNormalize(chart: any): {
  chart: NatalChart | null;
  validation: ValidationResult;
} {
  const validation = validateChart(chart);
  
  if (!validation.valid) {
    return { chart: null, validation };
  }

  const sanitized = sanitizeChart(chart as NatalChart);
  
  return { chart: sanitized, validation };
}
