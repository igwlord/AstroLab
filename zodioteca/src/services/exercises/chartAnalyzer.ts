/**
 * ANALIZADOR DE CARTAS NATALES MEJORADO
 * Incorpora dignidades, aspectos diferenciados y análisis matizado
 * Versión: 2.0.0
 */

import type { NatalChart } from './planetNormalizer';
import { getPlanetDignity, getWeakDignities, getStrongDignities, type DignityInfo } from './dignities';

export interface ChartAnalysis {
  // Dominancias elementales y modales
  dominances: {
    elements: Record<string, number>;
    modalities: Record<string, number>;
  };
  
  // Análisis de Luna (crítico para emocional)
  moon?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
    hardAspects: number;
    softAspects: number;
    stressScore: number; // 0-10
  };
  
  // Análisis de Mercurio (comunicación/mente)
  mercury?: {
    house: number;
    sign: string;
    retrograde: boolean;
    dignity: DignityInfo;
  };
  
  // Dignidades débiles y fuertes
  weakDignities: Array<{
    planet: string;
    sign: string;
    dignity: DignityInfo;
  }>;
  
  strongDignities: Array<{
    planet: string;
    sign: string;
    dignity: DignityInfo;
  }>;
  
  // Conteos y stelliums
  mutableCount: number;
  cardinalCount: number;
  fixedCount: number;
  stelliumHouses: number[]; // Casas con 3+ planetas
  
  // Aspectos tensos totales
  tensionsCount: number;
  harmoniesCount: number;
  
  // Notas adicionales
  notes: string[];
  
  // Meta
  version: string;
  analyzedAt: string;
}

const SIGN_TO_ELEMENT: Record<string, string> = {
  'Aries': 'fire',
  'Leo': 'fire',
  'Sagittarius': 'fire',
  'Taurus': 'earth',
  'Virgo': 'earth',
  'Capricorn': 'earth',
  'Gemini': 'air',
  'Libra': 'air',
  'Aquarius': 'air',
  'Cancer': 'water',
  'Scorpio': 'water',
  'Pisces': 'water'
};

const SIGN_TO_MODALITY: Record<string, string> = {
  'Aries': 'cardinal',
  'Cancer': 'cardinal',
  'Libra': 'cardinal',
  'Capricorn': 'cardinal',
  'Taurus': 'fixed',
  'Leo': 'fixed',
  'Scorpio': 'fixed',
  'Aquarius': 'fixed',
  'Gemini': 'mutable',
  'Virgo': 'mutable',
  'Sagittarius': 'mutable',
  'Pisces': 'mutable'
};

/**
 * Analiza el estrés emocional de la Luna
 * Considera aspectos, casa y dignidad
 */
function analyzeMoonStress(chart: NatalChart): number {
  const moon = chart.planets?.find(p => p.name === 'Moon');
  if (!moon) return 0;

  let stress = 0;

  // Casa 12, 8 o 4 = +1 stress (casas emocionales/inconscientes)
  if ([4, 8, 12].includes(moon.house)) stress += 1;

  // Analizar aspectos
  const moonAspects = chart.aspects?.filter(a => a.a === 'Moon' || a.b === 'Moon') || [];
  
  moonAspects.forEach(aspect => {
    const otherPlanet = aspect.a === 'Moon' ? aspect.b : aspect.a;
    const isMalefic = ['Saturn', 'Mars', 'Pluto'].includes(otherPlanet);
    const isBenefic = ['Venus', 'Jupiter'].includes(otherPlanet);

    // Aspectos duros
    if (['square', 'opposition'].includes(aspect.type) && aspect.orb <= 3) {
      stress += isMalefic ? 2 : 1;
    }

    // Aspectos suaves (compensan)
    if (['trine', 'sextile'].includes(aspect.type) && aspect.orb <= 4) {
      stress -= isBenefic ? 1 : 0.5;
    }
  });

  // Ajuste por dignidad
  const dignity = getPlanetDignity('Moon', moon.sign);
  if (dignity.type === 'fall') stress += 1;
  if (dignity.type === 'detriment') stress += 1.5;
  if (dignity.type === 'domicile') stress = Math.max(0, stress - 1);

  return Math.max(0, Math.min(10, stress)); // Normalizar 0-10
}

/**
 * Analiza una carta natal completa
 */
export function analyzeChart(chart: NatalChart): ChartAnalysis {
  const elements: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities: Record<string, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  const houseCounts: Record<number, number> = {};

  let mutableCount = 0;
  let cardinalCount = 0;
  let fixedCount = 0;

  // Analizar planetas
  for (const p of chart.planets || []) {
    const element = SIGN_TO_ELEMENT[p.sign] || 'air';
    const modality = SIGN_TO_MODALITY[p.sign] || 'mutable';

    elements[element] = (elements[element] || 0) + 1;
    modalities[modality] = (modalities[modality] || 0) + 1;
    houseCounts[p.house] = (houseCounts[p.house] || 0) + 1;

    if (modality === 'mutable') mutableCount++;
    if (modality === 'cardinal') cardinalCount++;
    if (modality === 'fixed') fixedCount++;
  }

  // Detectar stelliums (3+ planetas en misma casa)
  const stelliumHouses = Object.entries(houseCounts)
    .filter(([, count]) => count >= 3)
    .map(([house]) => Number(house));

  // Contar aspectos tensos y armónicos
  let tensionsCount = 0;
  let harmoniesCount = 0;

  for (const a of chart.aspects || []) {
    if (['square', 'opposition'].includes(a.type) && a.orb <= 3) {
      tensionsCount++;
    }
    if (['trine', 'sextile'].includes(a.type) && a.orb <= 4) {
      harmoniesCount++;
    }
  }

  // Analizar Luna
  const moon = chart.planets?.find(p => p.name === 'Moon');
  const moonAnalysis = moon ? {
    house: moon.house,
    sign: moon.sign,
    dignity: getPlanetDignity('Moon', moon.sign),
    hardAspects: chart.aspects?.filter(a => 
      (a.a === 'Moon' || a.b === 'Moon') && 
      ['square', 'opposition'].includes(a.type) && 
      a.orb <= 3
    ).length || 0,
    softAspects: chart.aspects?.filter(a => 
      (a.a === 'Moon' || a.b === 'Moon') && 
      ['trine', 'sextile'].includes(a.type) && 
      a.orb <= 4
    ).length || 0,
    stressScore: analyzeMoonStress(chart)
  } : undefined;

  // Analizar Mercurio
  const mercury = chart.planets?.find(p => p.name === 'Mercury');
  const mercuryAnalysis = mercury ? {
    house: mercury.house,
    sign: mercury.sign,
    retrograde: mercury.retrograde || false,
    dignity: getPlanetDignity('Mercury', mercury.sign)
  } : undefined;

  // Dignidades débiles y fuertes
  const weakDignities = getWeakDignities(chart.planets || []);
  const strongDignities = getStrongDignities(chart.planets || []);

  // Notas de análisis
  const notes: string[] = [];
  if (stelliumHouses.length > 0) {
    notes.push(`Stellium detectado en casa(s): ${stelliumHouses.join(', ')}`);
  }
  if (tensionsCount >= 3) {
    notes.push(`Alta tensión: ${tensionsCount} aspectos duros`);
  }
  if (mutableCount >= 4) {
    notes.push(`Energía dispersa: ${mutableCount} planetas mutables`);
  }
  if (weakDignities.length >= 2) {
    notes.push(`${weakDignities.length} planetas en dignidad débil`);
  }

  return {
    dominances: { elements, modalities },
    moon: moonAnalysis,
    mercury: mercuryAnalysis,
    weakDignities,
    strongDignities,
    mutableCount,
    cardinalCount,
    fixedCount,
    stelliumHouses,
    tensionsCount,
    harmoniesCount,
    notes,
    version: '2.0.0',
    analyzedAt: new Date().toISOString()
  };
}
