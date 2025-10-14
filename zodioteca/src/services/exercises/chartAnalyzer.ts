/**
 * ANALIZADOR DE CARTAS NATALES MEJORADO
 * Incorpora dignidades, aspectos diferenciados y análisis matizado
 * Versión: 2.0.0
 */

import type { NatalChart } from './planetNormalizer';
import { getPlanetDignity, getWeakDignities, getStrongDignities, type DignityInfo } from './dignities';
import { calculateConfidence } from './chartValidator';

export interface ChartAnalysis {
  // Confidence del análisis
  confidence: {
    score: number;
    reasons: string[];
  };
  
  // Dominancias elementales y modales
  dominances: {
    elements: Record<string, number>;
    modalities: Record<string, number>;
  };
  
  // MEJORA 6: Elemento y modalidad dominante calculados
  dominantElement?: 'fire' | 'earth' | 'air' | 'water';
  secondaryElement?: 'fire' | 'earth' | 'air' | 'water';
  dominantModality?: 'cardinal' | 'fixed' | 'mutable';
  
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
 * Mapea signo a elemento
 */
function signToElement(sign: string): 'fire' | 'earth' | 'air' | 'water' {
  return (SIGN_TO_ELEMENT[sign] || 'fire') as 'fire' | 'earth' | 'air' | 'water';
}

/**
 * Calcula pesos de elementos (interno)
 */
function calculateElementWeights(chart: NatalChart): Record<'fire' | 'earth' | 'air' | 'water', number> {
  const weights: Record<'fire' | 'earth' | 'air' | 'water', number> = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0
  };

  const personal = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']);
  const social = new Set(['Jupiter', 'Saturn']);
  const trans = new Set(['Uranus', 'Neptune', 'Pluto']);

  // Analizar planetas
  for (const p of chart.planets || []) {
    const elem = signToElement(p.sign);
    let w = personal.has(p.name) ? 2 : social.has(p.name) ? 1.5 : trans.has(p.name) ? 1 : 1;
    
    // Bonus por casa angular
    if ([1, 4, 7, 10].includes(p.house)) {
      w += 0.5;
    }
    
    // Bonus por aspectos tensos con Luna/Sol
    const tenseToLuminaries = chart.aspects?.some(
      a => ((a.a === p.name && (a.b === 'Moon' || a.b === 'Sun')) ||
            (a.b === p.name && (a.a === 'Moon' || a.a === 'Sun'))) &&
           ['square', 'opposition', 'conjunction'].includes(a.type.toLowerCase())
    );
    
    if (tenseToLuminaries) {
      w += 0.5;
    }
    
    weights[elem] += w;
  }

  // ASC y MC (si existen en el chart)
  const chartWithAngles = chart as NatalChart & { angles?: { asc?: { sign: string }; mc?: { sign: string } } };
  if (chartWithAngles.angles?.asc) {
    const ascElement = signToElement(chartWithAngles.angles.asc.sign);
    weights[ascElement] += 1.0;
  }
  if (chartWithAngles.angles?.mc) {
    const mcElement = signToElement(chartWithAngles.angles.mc.sign);
    weights[mcElement] += 1.0;
  }

  return weights;
}

/**
 * Calcula el elemento dominante de la carta natal
 * Usa ponderaciones por tipo de planeta, casas angulares, aspectos, ASC y MC
 */
export function calculateDominantElement(chart: NatalChart): 'fire' | 'earth' | 'air' | 'water' {
  const weights = calculateElementWeights(chart);
  const entries = Object.entries(weights).sort(([, a], [, b]) => b - a) as ['fire' | 'earth' | 'air' | 'water', number][];
  return entries[0]?.[0] || 'fire';
}

/**
 * MEJORA 2: Calcula elemento secundario (para balance energético)
 */
export function calculateSecondaryElement(chart: NatalChart): 'fire' | 'earth' | 'air' | 'water' {
  const weights = calculateElementWeights(chart);
  const dominant = calculateDominantElement(chart);
  
  console.log('📊 [SecondaryElement] Weights completos:', weights);
  console.log('📊 [SecondaryElement] Dominante calculado:', dominant);
  
  // Filtrar el dominante y encontrar el segundo con mayor peso
  const entries = Object.entries(weights)
    .filter(([k]) => k !== dominant)
    .sort(([, a], [, b]) => b - a) as ['fire' | 'earth' | 'air' | 'water', number][];
  
  console.log('📊 [SecondaryElement] Candidatos (filtrados + ordenados):', entries);
  const secondary = entries[0]?.[0] || 'earth';
  console.log('📊 [SecondaryElement] Secundario elegido:', secondary);
  
  return secondary;
}

/**
 * MEJORA 1: Calcula modalidad dominante (cardinal/fixed/mutable)
 */
export function calculateDominantModality(chart: NatalChart): 'cardinal' | 'fixed' | 'mutable' {
  const weights: Record<'cardinal' | 'fixed' | 'mutable', number> = {
    cardinal: 0,
    fixed: 0,
    mutable: 0
  };

  const personal = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']);
  const social = new Set(['Jupiter', 'Saturn']);

  for (const p of chart.planets || []) {
    const modality = (SIGN_TO_MODALITY[p.sign] || 'mutable') as 'cardinal' | 'fixed' | 'mutable';
    const w = personal.has(p.name) ? 2 : social.has(p.name) ? 1.5 : 1;
    weights[modality] += w;
  }

  // ASC siempre cardinal si existe
  const chartWithAngles = chart as NatalChart & { angles?: { asc?: { sign: string } } };
  if (chartWithAngles.angles?.asc) {
    const ascModality = (SIGN_TO_MODALITY[chartWithAngles.angles.asc.sign] || 'cardinal') as 'cardinal' | 'fixed' | 'mutable';
    weights[ascModality] += 1.5;
  }

  const entries = Object.entries(weights) as ['cardinal' | 'fixed' | 'mutable', number][];
  return entries.reduce((max, [k, v]) => v > weights[max] ? k : max, 'cardinal' as 'cardinal' | 'fixed' | 'mutable');
}

/**
 * Analiza el estrés emocional de la Luna
 * Considera aspectos, casa y dignidad
 * CORREGIDO: Ahora siempre devuelve valor > 0 cuando hay datos válidos
 */
function analyzeMoonStress(chart: NatalChart): number {
  const moon = chart.planets?.find(p => p.name === 'Moon');
  if (!moon) {
    console.log('🌙 [MoonStress] No se encontró la Luna en la carta');
    return 0;
  }

  console.log('🌙 [MoonStress] Analizando Luna:', {
    sign: moon.sign,
    house: moon.house,
    aspectsCount: chart.aspects?.length || 0
  });

  // Stress base: 2.0 (neutro, siempre > 0)
  let stress = 2.0;
  const stressLog: string[] = ['Base neutral: 2.0'];

  // Casa 12, 8 o 4 = +2 stress (casas emocionales/inconscientes)
  if ([4, 8, 12].includes(moon.house)) {
    stress += 2;
    stressLog.push(`Casa ${moon.house} (emocional/inconsciente): +2`);
  }

  // Casa 1, 7, 10 = +0.5 stress (casas públicas/expuestas)
  if ([1, 7, 10].includes(moon.house)) {
    stress += 0.5;
    stressLog.push(`Casa ${moon.house} (pública/angular): +0.5`);
  }

  // Analizar aspectos
  console.log('🌙 [MoonStress] Total aspectos en carta:', chart.aspects?.length || 0);
  console.log('🌙 [MoonStress] Muestra de aspectos:', chart.aspects?.slice(0, 3));
  console.log('🌙 [MoonStress] Tipos únicos en carta:', [...new Set(chart.aspects?.map(a => a.type))]);
  
  const moonAspects = chart.aspects?.filter(a => 
    a.a === 'Moon' || a.b === 'Moon' ||
    a.a === 'Luna' || a.b === 'Luna' // ⚠️ SOPORTE ESPAÑOL
  ) || [];
  console.log('🌙 [MoonStress] Aspectos de la Luna encontrados:', moonAspects.length);
  console.log('🌙 [MoonStress] Detalle:', moonAspects);
  console.log('🌙 [MoonStress] Tipos únicos de Luna:', [...new Set(moonAspects.map(a => a.type))]);
  
  let tenseCount = 0;
  let harmoniousCount = 0;

  moonAspects.forEach(aspect => {
    const moonName = aspect.a === 'Moon' || aspect.a === 'Luna' ? aspect.a : aspect.b;
    const otherPlanet = moonName === aspect.a ? aspect.b : aspect.a;
    
    // Normalizar nombres (español → inglés)
    const planetMap: Record<string, string> = {
      'Saturno': 'Saturn', 'Marte': 'Mars', 'Plutón': 'Pluto',
      'Venus': 'Venus', 'Júpiter': 'Jupiter'
    };
    const normalizedPlanet = planetMap[otherPlanet] || otherPlanet;
    
    const isMalefic = ['Saturn', 'Mars', 'Pluto'].includes(normalizedPlanet);
    const isBenefic = ['Venus', 'Jupiter'].includes(normalizedPlanet);

    const typeLower = aspect.type.toLowerCase(); // ⚠️ CRITICAL FIX: Case-insensitive

    // Aspectos duros (orbe más amplio para mejor detección)
    if (['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower) && aspect.orb <= 8) {
      const add = isMalefic ? 2.5 : 1.5;
      stress += add;
      tenseCount++;
      stressLog.push(`${aspect.type} con ${otherPlanet} (orb ${aspect.orb.toFixed(1)}°): +${add}`);
    }

    // Conjunción con maléfico
    if (['conjunction', 'conjunción'].includes(typeLower) && aspect.orb <= 6 && isMalefic) {
      stress += 2;
      tenseCount++;
      stressLog.push(`Conjunción con ${otherPlanet} (orb ${aspect.orb.toFixed(1)}°): +2`);
    }

    // Aspectos suaves (compensan ligeramente)
    if (['trine', 'sextile', 'trígono', 'sextil'].includes(typeLower) && aspect.orb <= 8) {
      const subtract = isBenefic ? 0.8 : 0.5;
      stress -= subtract;
      harmoniousCount++;
      stressLog.push(`${aspect.type} con ${otherPlanet} (orb ${aspect.orb.toFixed(1)}°): -${subtract}`);
    }
  });

  // Ajuste por dignidad
  const dignity = getPlanetDignity('Moon', moon.sign);
  console.log('🌙 [MoonStress] Dignidad:', dignity);
  
  if (dignity.type === 'fall') {
    stress += 1.5;
    stressLog.push(`Luna en caída (${moon.sign}): +1.5`);
  }
  if (dignity.type === 'detriment') {
    stress += 2;
    stressLog.push(`Luna en detrimento (${moon.sign}): +2`);
  }
  if (dignity.type === 'domicile') {
    stress = Math.max(1, stress - 1.5);
    stressLog.push(`Luna en domicilio (${moon.sign}): -1.5`);
  }
  if (dignity.type === 'exaltation') {
    stress = Math.max(1, stress - 2);
    stressLog.push(`Luna en exaltación (${moon.sign}): -2`);
  }

  // Luna sin aspectos (void of course - stress medio-alto)
  if (moonAspects.length === 0) {
    stress += 2;
    stressLog.push('Luna sin aspectos (void of course): +2');
  }

  // Normalizar 0-10 con precisión de 1 decimal
  const finalStress = Math.max(0, Math.min(10, stress));
  const rounded = Math.round(finalStress * 10) / 10;
  
  console.log('🌙 [MoonStress] Resultado:', {
    rawStress: stress.toFixed(2),
    finalStress: rounded,
    tenseAspects: tenseCount,
    harmoniousAspects: harmoniousCount,
    dignity: dignity.type,
    log: stressLog
  });

  return rounded;
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

  // Contar aspectos tensos y armónicos (CASE-INSENSITIVE + BILINGUAL)
  let tensionsCount = 0;
  let harmoniesCount = 0;

  for (const a of chart.aspects || []) {
    const typeLower = a.type.toLowerCase();
    if (['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower) && a.orb <= 8) {
      tensionsCount++;
    }
    if (['trine', 'sextile', 'trígono', 'sextil'].includes(typeLower) && a.orb <= 8) {
      harmoniesCount++;
    }
  }

  // Analizar Luna
  const moon = chart.planets?.find(p => p.name === 'Moon');
  console.log('📊 [ChartAnalyzer] Planetas encontrados:', chart.planets?.map(p => p.name).join(', '));
  console.log('📊 [ChartAnalyzer] Total de aspectos en la carta:', chart.aspects?.length || 0);
  
  // Filtrar aspectos hard con logging (CASE-INSENSITIVE)
  const hardAspects = chart.aspects?.filter(a => {
    const isMoonAspect = a.a === 'Moon' || a.b === 'Moon' || a.a === 'Luna' || a.b === 'Luna';
    const typeLower = a.type.toLowerCase(); // ⚠️ CRITICAL FIX: Case-insensitive
    const isHardType = ['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower);
    const isInOrb = a.orb <= 8;
    
    if (isMoonAspect) {
      console.log(`🌙 [AspectCheck] ${a.a} ${a.type} ${a.b} (orb ${a.orb}°) → hard=${isHardType}, inOrb=${isInOrb}`);
    }
    
    return isMoonAspect && isHardType && isInOrb;
  }) || [];

  // Filtrar aspectos soft con logging (CASE-INSENSITIVE)
  const softAspects = chart.aspects?.filter(a => {
    const isMoonAspect = a.a === 'Moon' || a.b === 'Moon' || a.a === 'Luna' || a.b === 'Luna';
    const typeLower = a.type.toLowerCase(); // ⚠️ CRITICAL FIX: Case-insensitive
    const isSoftType = ['trine', 'sextile', 'trígono', 'sextil'].includes(typeLower);
    const isInOrb = a.orb <= 8;
    return isMoonAspect && isSoftType && isInOrb;
  }) || [];

  console.log(`🌙 [AspectCount] Hard: ${hardAspects.length}, Soft: ${softAspects.length}`);

  const moonAnalysis = moon ? {
    house: moon.house,
    sign: moon.sign,
    dignity: getPlanetDignity('Moon', moon.sign),
    hardAspects: hardAspects.length,
    softAspects: softAspects.length,
    stressScore: analyzeMoonStress(chart)
  } : undefined;

  console.log('📊 [ChartAnalyzer] Análisis de Luna completado:', moonAnalysis);

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

  // MEJORA 7: Calcular y agregar elemento/modalidad dominantes
  const dominantElement = calculateDominantElement(chart);
  const secondaryElement = calculateSecondaryElement(chart);
  const dominantModality = calculateDominantModality(chart);

  // MEJORA 8: Calcular confidence una sola vez
  const confidence = calculateConfidence(chart);

  return {
    confidence,
    dominances: { elements, modalities },
    dominantElement,
    secondaryElement,
    dominantModality,
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
