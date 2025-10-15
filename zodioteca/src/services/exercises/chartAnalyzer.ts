/**
 * ANALIZADOR DE CARTAS NATALES MEJORADO
 * Incorpora dignidades, aspectos diferenciados y análisis matizado
 * Versión: 3.0.0
 */

import type { NatalChart } from './planetNormalizer';
import { PLANET_MAP } from './planetNormalizer';
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
  
  // Análisis de Luna (crítico para emocional) - EXPANDIDO
  moon?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
    hardAspects: number;
    softAspects: number;
    stressScore: number; // 0-10
    aspects?: Array<{ // NUEVO: Aspectos detallados
      planet: string;
      type: string;
      orb: number;
      isHard: boolean;
    }>;
  };
  
  // Análisis de Mercurio (comunicación/mente)
  mercury?: {
    house: number;
    sign: string;
    retrograde: boolean;
    dignity: DignityInfo;
  };
  
  // Venus (relaciones/valores)
  venus?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Marte (acción/deseo)
  mars?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Júpiter (expansión/abundancia)
  jupiter?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Saturno (límites/estructura)
  saturn?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Urano (cambio/innovación)
  uranus?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Neptuno (espiritualidad/ilusión)
  neptune?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // Plutón (transformación/poder)
  pluto?: {
    house: number;
    sign: string;
    dignity: DignityInfo;
  };
  
  // NUEVO: Nodos Lunares (propósito evolutivo)
  nodes?: {
    north: {
      sign: string;
      house: number;
      degree: number;
    };
    south: {
      sign: string;
      house: number;
      degree: number;
    };
  };
  
  // NUEVO: Quirón (herida sanadora)
  chiron?: {
    sign: string;
    house: number;
    degree: number;
    dignity: DignityInfo;
    aspects?: Array<{
      planet: string;
      type: string;
      orb: number;
      isHard: boolean;
    }>;
  };
  
  // NUEVO: Lilith (sombra)
  lilith?: {
    sign: string;
    house: number;
    degree: number;
    aspects?: Array<{
      planet: string;
      type: string;
      orb: number;
      isHard: boolean;
    }>;
  };
  
  // NUEVO: Aspectos detallados (tensos y armónicos)
  aspectsDetailed?: {
    hard: Array<{
      planetA: string;
      planetB: string;
      type: string; // square, opposition, conjunction (if hard)
      orb: number;
      explanation?: string;
    }>;
    soft: Array<{
      planetA: string;
      planetB: string;
      type: string; // trine, sextile, conjunction (if soft)
      orb: number;
      explanation?: string;
    }>;
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
  
  // Conteos y stelliums - EXPANDIDO
  mutableCount: number;
  cardinalCount: number;
  fixedCount: number;
  stelliumHouses: number[]; // Casas con 3+ planetas
  stelliumDetails?: Array<{ // NUEVO: Detalles de cada stellium
    house: number;
    planets: string[];
    sign: string;
    element: string;
  }>;
  
  // Aspectos tensos totales
  tensionsCount: number;
  harmoniesCount: number;
  
  // NUEVO: Ejes arquetípicos (top 6 aspectos clave)
  axes?: AxisAnalysis[];
  
  // Notas adicionales
  notes: string[];
  
  // Meta
  version: string;
  analyzedAt: string;
}

// ============================================================
// SISTEMA DE EJES ARQUETÍPICOS
// ============================================================

export type AspectType = 'conjunction' | 'opposition' | 'square' | 'trine' | 'sextile';
export type AxisCategory = 'core' | 'internal' | 'challenge' | 'expansion';

export interface AxisAnalysis {
  theme: string;                    // "Autoridad", "Sensibilidad", etc.
  planets: [string, string];        // ["Sol", "Saturno"]
  aspectType: AspectType;           // tipo de aspecto
  orb: number;                      // exactitud en grados
  houses: [number, number];         // casas donde están los planetas
  score: number;                    // 0-20 (prioridad)
  category: AxisCategory;           // tipo de eje
}

interface AxisPriority {
  planets: [string, string];
  theme: string;
  category: AxisCategory;
  baseWeight: number;               // multiplicador de importancia
}

// Prioridades de ejes (12 combinaciones más relevantes)
const AXIS_PRIORITIES: AxisPriority[] = [
  // Tier 1: Luminares con externos (peso x1.5)
  { planets: ['Sun', 'Saturn'], theme: 'Autoridad', category: 'core', baseWeight: 1.5 },
  { planets: ['Moon', 'Saturn'], theme: 'Seguridad Emocional', category: 'core', baseWeight: 1.5 },
  { planets: ['Moon', 'Neptune'], theme: 'Sensibilidad', category: 'internal', baseWeight: 1.5 },
  { planets: ['Moon', 'Pluto'], theme: 'Intensidad Emocional', category: 'internal', baseWeight: 1.5 },
  { planets: ['Sun', 'Pluto'], theme: 'Poder Personal', category: 'core', baseWeight: 1.5 },
  
  // Tier 2: Personales con externos (peso x1.3)
  { planets: ['Mars', 'Pluto'], theme: 'Acción y Poder', category: 'challenge', baseWeight: 1.3 },
  { planets: ['Venus', 'Saturn'], theme: 'Amor y Límites', category: 'challenge', baseWeight: 1.3 },
  { planets: ['Mercury', 'Chiron'], theme: 'Comunicación Herida', category: 'internal', baseWeight: 1.3 },
  { planets: ['Mars', 'Saturn'], theme: 'Acción Contenida', category: 'challenge', baseWeight: 1.3 },
  
  // Tier 3: Expansivos (peso x1.0)
  { planets: ['Venus', 'Jupiter'], theme: 'Relaciones y Abundancia', category: 'expansion', baseWeight: 1.0 },
  { planets: ['Sun', 'Jupiter'], theme: 'Confianza', category: 'expansion', baseWeight: 1.0 },
  { planets: ['Mercury', 'Jupiter'], theme: 'Pensamiento Expansivo', category: 'expansion', baseWeight: 1.0 },
];

// ============================================================
// FUNCIONES AUXILIARES PARA EJES
// ============================================================

/**
 * Obtiene el elemento de un signo
 */
function getElement(sign: string): 'fire' | 'earth' | 'air' | 'water' {
  const normalized = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  const elementMap: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire', 'Sagittarius': 'fire',
    'Tauro': 'earth', 'Taurus': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth', 'Capricorn': 'earth',
    'Géminis': 'air', 'Gemini': 'air', 'Geminis': 'air', 'Libra': 'air', 'Acuario': 'air', 'Aquarius': 'air',
    'Cáncer': 'water', 'Cancer': 'water', 'Escorpio': 'water', 'Scorpio': 'water', 'Piscis': 'water', 'Pisces': 'water'
  };
  return elementMap[normalized] || 'fire';
}

/**
 * Verifica si dos elementos se oponen (Fuego-Agua, Aire-Tierra)
 */
function elementsOppose(e1: string, e2: string): boolean {
  return (e1 === 'fire' && e2 === 'water') || (e1 === 'water' && e2 === 'fire') ||
         (e1 === 'air' && e2 === 'earth') || (e1 === 'earth' && e2 === 'air');
}

/**
 * Calcula tensión elemental para un eje (0-2 puntos)
 */
function calculateElementalTension(
  axis: { planets: [string, string]; houses: [number, number] },
  chart: NatalChart,
  ascendantSign?: string
): number {
  const p1 = chart.planets?.find(p => p.name === axis.planets[0]);
  const p2 = chart.planets?.find(p => p.name === axis.planets[1]);
  
  if (!p1 || !p2) return 0;
  
  // Usar ascendente si está disponible, sino default Aries
  const ascSign = ascendantSign || 'Aries';
  const ascElement = getElement(ascSign);
  const p1Element = getElement(p1.sign);
  const p2Element = getElement(p2.sign);
  
  let tension = 0;
  
  // +1 si algún planeta opone al Ascendente elementalmente
  if (elementsOppose(p1Element, ascElement) || elementsOppose(p2Element, ascElement)) {
    tension += 1;
  }
  
  // +1 si los dos planetas están en elementos opuestos entre sí
  if (elementsOppose(p1Element, p2Element)) {
    tension += 1;
  }
  
  return tension;
}

/**
 * Calcula score de un eje (0-20 puntos)
 */
function scoreAxis(
  axis: Omit<AxisAnalysis, 'score'>,
  chart: NatalChart,
  ascendantSign?: string
): number {
  let score = 0;
  
  // 1. Planetas clave (0-5 puntos)
  const luminaries = ['Sun', 'Moon'];
  const personal = ['Mercury', 'Venus', 'Mars'];
  
  const hasLuminaries = axis.planets.some(p => luminaries.includes(p));
  const hasPersonal = axis.planets.some(p => personal.includes(p));
  
  if (hasLuminaries) {
    score += 5;
  } else if (hasPersonal) {
    score += 3;
  }
  
  // 2. Exactitud del orbe (0-3 puntos)
  score += Math.max(0, 3 - Math.abs(axis.orb));
  
  // 3. Casas (0-4 puntos)
  const angular = [1, 4, 7, 10];
  const sensitive = [8, 12];
  
  if (axis.houses.some(h => angular.includes(h))) {
    score += 3;
  } else if (axis.houses.some(h => sensitive.includes(h))) {
    score += 2;
  }
  
  // 4. Aspecto tenso (0-3 puntos)
  if (axis.aspectType === 'opposition') {
    score += 3;
  } else if (axis.aspectType === 'square') {
    score += 2;
  } else if (axis.aspectType === 'conjunction') {
    score += 1;
  }
  
  // 5. Tensión elemental (0-2 puntos)
  score += calculateElementalTension(axis, chart, ascendantSign);
  
  return Math.min(20, Math.round(score * 10) / 10);
}

/**
 * Obtiene símbolo del aspecto (exportada para uso en UI)
 */
export function getAspectSymbol(type: AspectType): string {
  const symbols: Record<AspectType, string> = {
    conjunction: '☌',
    opposition: '☍',
    square: '□',
    trine: '△',
    sextile: '✶'
  };
  return symbols[type] || '—';
}

/**
 * Busca un aspecto entre dos planetas en la carta
 */
function findAspectBetween(
  chart: NatalChart,
  planet1: string,
  planet2: string
): { type: AspectType; orb: number } | null {
  if (!chart.aspects) return null;
  
  // Normalizar nombres de planetas (soportar ES/EN)
  const normalize = (name: string) => PLANET_MAP[name] || name;
  const p1Normalized = normalize(planet1);
  const p2Normalized = normalize(planet2);
  
  // Buscar aspecto usando los nombres correctos de propiedades
  const aspect = chart.aspects.find(a => {
    const p1Raw = 'planet1' in a ? a.planet1 : 'a' in a ? (a as unknown as { a: string; b: string }).a : '';
    const p2Raw = 'planet2' in a ? a.planet2 : 'b' in a ? (a as unknown as { a: string; b: string }).b : '';
    
    // Normalizar nombres del aspecto también
    const p1Norm = normalize(String(p1Raw));
    const p2Norm = normalize(String(p2Raw));
    
    return (p1Norm === p1Normalized && p2Norm === p2Normalized) || 
           (p1Norm === p2Normalized && p2Norm === p1Normalized);
  });
  
  if (!aspect) return null;
  
  // Mapear tipo de aspecto (case-insensitive + bilingual)
  const typeMap: Record<string, AspectType> = {
    'conjunction': 'conjunction',
    'conjunción': 'conjunction',
    'opposition': 'opposition',
    'oposición': 'opposition',
    'square': 'square',
    'cuadratura': 'square',
    'trine': 'trine',
    'trígono': 'trine',
    'sextile': 'sextile',
    'sextil': 'sextile'
  };
  
  const aspectType = typeMap[aspect.type.toLowerCase()] || 'conjunction';
  
  return {
    type: aspectType,
    orb: aspect.orb || 0
  };
}

/**
 * Identifica los ejes clave de una carta (top 6)
 */
function identifyKeyAxes(chart: NatalChart, ascendantSign?: string): AxisAnalysis[] {
  console.log('⚖️ [identifyKeyAxes] Iniciando análisis de ejes');
  console.log('⚖️ [identifyKeyAxes] Ascendente:', ascendantSign);
  console.log('⚖️ [identifyKeyAxes] Total aspectos en carta:', chart.aspects?.length || 0);
  
  const foundAxes: AxisAnalysis[] = [];
  
  // Buscar todos los ejes que existen en la carta
  for (const priority of AXIS_PRIORITIES) {
    const aspect = findAspectBetween(chart, priority.planets[0], priority.planets[1]);
    
    if (!aspect) {
      console.log(`⚖️ [identifyKeyAxes] ❌ No se encontró aspecto para ${priority.planets[0]}-${priority.planets[1]}`);
      continue;
    }
    
    const p1 = chart.planets?.find(p => p.name === priority.planets[0]);
    const p2 = chart.planets?.find(p => p.name === priority.planets[1]);
    
    if (!p1 || !p2) {
      console.log(`⚖️ [identifyKeyAxes] ❌ Planetas no encontrados: ${priority.planets[0]}=${!!p1}, ${priority.planets[1]}=${!!p2}`);
      continue;
    }
    
    const axisBase: Omit<AxisAnalysis, 'score'> = {
      theme: priority.theme,
      planets: priority.planets,
      aspectType: aspect.type,
      orb: aspect.orb,
      houses: [p1.house, p2.house],
      category: priority.category
    };
    
    // Calcular score y aplicar peso
    const axisScore = scoreAxis(axisBase, chart, ascendantSign);
    const finalScore = axisScore * priority.baseWeight;
    
    console.log(`⚖️ [identifyKeyAxes] ✅ ${priority.theme}: ${priority.planets[0]}-${priority.planets[1]} ${aspect.type} (orb: ${aspect.orb}°) → score: ${axisScore} × ${priority.baseWeight} = ${finalScore.toFixed(1)}`);
    
    foundAxes.push({
      ...axisBase,
      score: Math.round(finalScore * 10) / 10
    });
  }
  
  console.log(`⚖️ [identifyKeyAxes] Total ejes encontrados: ${foundAxes.length}`);
  
  // Retornar top 6 ordenados por score
  const topAxes = foundAxes
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  
  console.log('⚖️ [identifyKeyAxes] Top 6 ejes seleccionados:');
  topAxes.forEach((axis, i) => {
    console.log(`  ${i + 1}. ${axis.theme} (${axis.planets[0]}-${axis.planets[1]}) - Score: ${axis.score}`);
  });
  
  return topAxes;
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
 * NUEVO: Analiza los Nodos Lunares (propósito evolutivo)
 */
function analyzeNodes(chart: NatalChart) {
  // Cast to access lunarNodes property (new structure from realAstroCalculator)
  const extendedChart = chart as NatalChart & { 
    lunarNodes?: Array<{ type: string; name: string; sign: string; house: number; degree: number }>;
    sensitivePoints?: Array<{ type: string; name: string; sign: string; house: number; degree: number }>;
  };
  console.log('🔍 [analyzeNodes] Buscando en chart.lunarNodes:', extendedChart.lunarNodes);
  
  // NUEVO: Buscar en chart.lunarNodes (estructura correcta)
  if (extendedChart.lunarNodes && Array.isArray(extendedChart.lunarNodes) && extendedChart.lunarNodes.length >= 2) {
    const northNode = extendedChart.lunarNodes.find(n => n.type === 'north' || n.name === 'Nodo Norte');
    const southNode = extendedChart.lunarNodes.find(n => n.type === 'south' || n.name === 'Nodo Sur');
    
    if (northNode && southNode) {
      console.log('✅ [analyzeNodes] Nodos encontrados en chart.lunarNodes:', { northNode, southNode });
      return {
        north: {
          sign: northNode.sign,
          house: northNode.house,
          degree: northNode.degree
        },
        south: {
          sign: southNode.sign,
          house: southNode.house,
          degree: southNode.degree
        }
      };
    }
  }
  
  // FALLBACK: Buscar en chart.planets (por compatibilidad)
  const northNode = chart.planets?.find(p => p.name === 'Node' || p.name === 'North Node' || p.name === 'Nodo Norte');
  
  if (!northNode) {
    console.log('⚠️ [analyzeNodes] Nodo Norte NO encontrado en ningún lugar');
    return undefined;
  }
  
  console.log('✅ [analyzeNodes] Nodo Norte encontrado en chart.planets:', northNode);
  
  // Calcular el Nodo Sur (siempre opuesto al Norte)
  const southNodeSign = getSouthNodeSign(northNode.sign);
  const southNodeHouse = northNode.house <= 6 ? northNode.house + 6 : northNode.house - 6;
  
  return {
    north: {
      sign: northNode.sign,
      house: northNode.house,
      degree: northNode.deg // Use 'deg' from planetNormalizer structure
    },
    south: {
      sign: southNodeSign,
      house: southNodeHouse,
      degree: northNode.deg // Mismo grado pero signo opuesto
    }
  };
}

/**
 * Helper: Obtiene el signo opuesto (para Nodo Sur)
 */
function getSouthNodeSign(northSign: string): string {
  const opposites: Record<string, string> = {
    'Aries': 'Libra', 'Libra': 'Aries',
    'Taurus': 'Scorpio', 'Scorpio': 'Taurus',
    'Gemini': 'Sagittarius', 'Sagittarius': 'Gemini',
    'Cancer': 'Capricorn', 'Capricorn': 'Cancer',
    'Leo': 'Aquarius', 'Aquarius': 'Leo',
    'Virgo': 'Pisces', 'Pisces': 'Virgo'
  };
  return opposites[northSign] || 'Libra';
}

/**
 * NUEVO: Analiza Quirón (herida sanadora)
 */
function analyzeChiron(chart: NatalChart) {
  // Cast to access sensitivePoints property
  const extendedChart = chart as NatalChart & { 
    sensitivePoints?: Array<{ type: string; name: string; sign: string; house: number; degree: number }>;
  };
  
  console.log('🔍 [analyzeChiron] Buscando en chart.sensitivePoints:', extendedChart.sensitivePoints);
  console.log('🔍 [analyzeChiron] Buscando en chart.planets:', chart.planets?.map(p => p.name).join(', '));
  
  // NUEVO: Buscar en chart.sensitivePoints primero
  let chiron = extendedChart.sensitivePoints?.find(p => 
    p.type === 'chiron' || p.name === 'Chiron' || p.name === 'Quirón'
  );
  
  // FALLBACK: Buscar en chart.planets
  if (!chiron) {
    const planetChiron = chart.planets?.find(p => p.name === 'Chiron' || p.name === 'Quirón');
    if (planetChiron) {
      chiron = { ...planetChiron, type: 'chiron', degree: planetChiron.deg };
    }
  }
  
  if (!chiron) {
    console.log('⚠️ [analyzeChiron] Quirón NO encontrado');
    return undefined;
  }
  console.log('✅ [analyzeChiron] Quirón encontrado:', chiron);
  
  const dignity = getPlanetDignity('Chiron', chiron.sign);
  
  // Aspectos de Quirón
  const chironAspects = chart.aspects?.filter(a =>
    a.a === 'Chiron' || a.b === 'Chiron' || a.a === 'Quirón' || a.b === 'Quirón'
  ).map(a => {
    const otherPlanet = (a.a === 'Chiron' || a.a === 'Quirón') ? a.b : a.a;
    const typeLower = a.type.toLowerCase();
    const isHard = ['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower);
    
    return {
      planet: otherPlanet,
      type: a.type,
      orb: a.orb,
      isHard
    };
  }) || [];
  
  return {
    sign: chiron.sign,
    house: chiron.house,
    degree: (chiron as { degree?: number; deg?: number }).degree || (chiron as { degree?: number; deg?: number }).deg || 0,
    dignity,
    aspects: chironAspects
  };
}

/**
 * NUEVO: Analiza Lilith (sombra)
 */
function analyzeLilith(chart: NatalChart) {
  // Cast to access sensitivePoints property
  const extendedChart = chart as NatalChart & { 
    sensitivePoints?: Array<{ type: string; name: string; sign: string; house: number; degree: number }>;
  };
  
  console.log('🔍 [analyzeLilith] Buscando en chart.sensitivePoints:', extendedChart.sensitivePoints);
  console.log('🔍 [analyzeLilith] Tipos de sensitivePoints:', extendedChart.sensitivePoints?.map(p => `${p.name} (type: ${p.type})`).join(', '));
  console.log('🔍 [analyzeLilith] Buscando en chart.planets:', chart.planets?.map(p => p.name).join(', '));
  
  // NUEVO: Buscar en chart.sensitivePoints primero
  let lilith = extendedChart.sensitivePoints?.find(p => 
    // Buscar por type (con guiones o guiones bajos)
    p.type === 'lilith' || 
    p.type === 'lilith-mean' || 
    p.type === 'lilith_mean' ||
    p.type === 'black_moon_lilith' || 
    p.type === 'black-moon-lilith' ||
    p.type === 'mean_lilith' ||
    // Buscar por name (cualquier variante que contenga "Lilith")
    (p.name && p.name.includes('Lilith'))
  );
  
  console.log('🔍 [analyzeLilith] Búsqueda por type/name:', lilith);
  
  // FALLBACK: Buscar en chart.planets
  if (!lilith) {
    const planetLilith = chart.planets?.find(p => 
      p.name === 'Lilith' || p.name === 'Black Moon Lilith' || p.name === 'Mean Lilith'
    );
    if (planetLilith) {
      lilith = { ...planetLilith, type: 'lilith', degree: planetLilith.deg };
    }
  }
  
  if (!lilith) {
    console.log('⚠️ [analyzeLilith] Lilith NO encontrada');
    return undefined;
  }
  console.log('✅ [analyzeLilith] Lilith encontrada:', lilith);
  
  // Aspectos de Lilith
  const lilithAspects = chart.aspects?.filter(a =>
    a.a === 'Lilith' || a.b === 'Lilith' || 
    a.a === 'Black Moon Lilith' || a.b === 'Black Moon Lilith'
  ).map(a => {
    const otherPlanet = (a.a === 'Lilith' || a.a === 'Black Moon Lilith') ? a.b : a.a;
    const typeLower = a.type.toLowerCase();
    const isHard = ['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower);
    
    return {
      planet: otherPlanet,
      type: a.type,
      orb: a.orb,
      isHard
    };
  }) || [];
  
  return {
    sign: lilith.sign,
    house: lilith.house,
    degree: (lilith as { degree?: number; deg?: number }).degree || (lilith as { degree?: number; deg?: number }).deg || 0,
    aspects: lilithAspects
  };
}

/**
 * NUEVO: Analiza aspectos detallados (todos, con explicaciones)
 */
function analyzeDetailedAspects(chart: NatalChart) {
  const hard: Array<{
    planetA: string;
    planetB: string;
    type: string;
    orb: number;
    explanation?: string;
  }> = [];
  
  const soft: Array<{
    planetA: string;
    planetB: string;
    type: string;
    orb: number;
    explanation?: string;
  }> = [];
  
  for (const aspect of chart.aspects || []) {
    const typeLower = aspect.type.toLowerCase();
    
    if (['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower) && aspect.orb <= 8) {
      hard.push({
        planetA: aspect.a,
        planetB: aspect.b,
        type: aspect.type,
        orb: aspect.orb
      });
    }
    
    if (['trine', 'sextile', 'trígono', 'sextil'].includes(typeLower) && aspect.orb <= 8) {
      soft.push({
        planetA: aspect.a,
        planetB: aspect.b,
        type: aspect.type,
        orb: aspect.orb
      });
    }
  }
  
  return { hard, soft };
}

/**
 * NUEVO: Analiza detalles de stelliums
 */
function analyzeStelliumDetails(chart: NatalChart, stelliumHouses: number[]) {
  return stelliumHouses.map(house => {
    const planetsInHouse = chart.planets?.filter(p => p.house === house) || [];
    const signs = planetsInHouse.map(p => p.sign);
    const dominantSign = signs.reduce((a, b, _, arr) =>
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
    const element = SIGN_TO_ELEMENT[dominantSign] || 'air';
    
    return {
      house,
      planets: planetsInHouse.map(p => p.name),
      sign: dominantSign,
      element
    };
  });
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

  // Logging: Ver qué planetas tenemos disponibles
  console.log('🌍 [ChartAnalyzer] TODOS LOS PLANETAS DISPONIBLES:', chart.planets?.map(p => p.name).join(', '));
  console.log('🔍 [ChartAnalyzer] PROPIEDADES DE LA CARTA:', Object.keys(chart));
  const extChart = chart as unknown as { lunarNodes?: unknown; sensitivePoints?: unknown };
  console.log('🔍 [ChartAnalyzer] chart.lunarNodes existe?', 'lunarNodes' in chart, extChart.lunarNodes);
  console.log('🔍 [ChartAnalyzer] chart.sensitivePoints existe?', 'sensitivePoints' in chart, extChart.sensitivePoints);
  
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

  // Analizar Venus
  const venus = chart.planets?.find(p => p.name === 'Venus');
  const venusAnalysis = venus ? {
    house: venus.house,
    sign: venus.sign,
    dignity: getPlanetDignity('Venus', venus.sign)
  } : undefined;

  // Analizar Marte
  const mars = chart.planets?.find(p => p.name === 'Mars');
  const marsAnalysis = mars ? {
    house: mars.house,
    sign: mars.sign,
    dignity: getPlanetDignity('Mars', mars.sign)
  } : undefined;

  // Analizar Júpiter
  const jupiter = chart.planets?.find(p => p.name === 'Jupiter');
  const jupiterAnalysis = jupiter ? {
    house: jupiter.house,
    sign: jupiter.sign,
    dignity: getPlanetDignity('Jupiter', jupiter.sign)
  } : undefined;

  // Analizar Saturno
  const saturn = chart.planets?.find(p => p.name === 'Saturn');
  const saturnAnalysis = saturn ? {
    house: saturn.house,
    sign: saturn.sign,
    dignity: getPlanetDignity('Saturn', saturn.sign)
  } : undefined;

  // Analizar Urano
  const uranus = chart.planets?.find(p => p.name === 'Uranus');
  const uranusAnalysis = uranus ? {
    house: uranus.house,
    sign: uranus.sign,
    dignity: getPlanetDignity('Uranus', uranus.sign)
  } : undefined;

  // Analizar Neptuno
  const neptune = chart.planets?.find(p => p.name === 'Neptune');
  const neptuneAnalysis = neptune ? {
    house: neptune.house,
    sign: neptune.sign,
    dignity: getPlanetDignity('Neptune', neptune.sign)
  } : undefined;

  // Analizar Plutón
  const pluto = chart.planets?.find(p => p.name === 'Pluto');
  const plutoAnalysis = pluto ? {
    house: pluto.house,
    sign: pluto.sign,
    dignity: getPlanetDignity('Pluto', pluto.sign)
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
  
  // NUEVO: Analizar Nodos, Quirón y Lilith
  const nodes = analyzeNodes(chart);
  const chiron = analyzeChiron(chart);
  const lilith = analyzeLilith(chart);
  
  // NUEVO: Aspectos detallados
  const aspectsDetailed = analyzeDetailedAspects(chart);
  
  // NUEVO: Detalles de stelliums
  const stelliumDetails = analyzeStelliumDetails(chart, stelliumHouses);
  
  // MEJORA: Agregar aspectos detallados a la Luna
  const moonWithAspects = moonAnalysis ? {
    ...moonAnalysis,
    aspects: chart.aspects?.filter(a =>
      a.a === 'Moon' || a.b === 'Moon' || a.a === 'Luna' || a.b === 'Luna'
    ).map(a => {
      const otherPlanet = (a.a === 'Moon' || a.a === 'Luna') ? a.b : a.a;
      const typeLower = a.type.toLowerCase();
      const isHard = ['square', 'opposition', 'cuadratura', 'oposición'].includes(typeLower);
      return {
        planet: otherPlanet,
        type: a.type,
        orb: a.orb,
        isHard
      };
    })
  } : undefined;

  // NUEVO: Identificar ejes arquetípicos (top 6)
  console.log('🎯 [analyzeChart] Preparando análisis de ejes arquetípicos...');
  const extChartForAsc = chart as unknown as { ascendant?: { sign: string } };
  const ascendantSign = extChartForAsc.ascendant?.sign;
  console.log('🎯 [analyzeChart] Ascendente detectado:', ascendantSign);
  console.log('🎯 [analyzeChart] Llamando a identifyKeyAxes...');
  const axes = identifyKeyAxes(chart, ascendantSign);
  console.log('🎯 [analyzeChart] Ejes identificados:', axes.length);

  return {
    confidence,
    dominances: { elements, modalities },
    dominantElement,
    secondaryElement,
    dominantModality,
    moon: moonWithAspects,
    mercury: mercuryAnalysis,
    venus: venusAnalysis,
    mars: marsAnalysis,
    jupiter: jupiterAnalysis,
    saturn: saturnAnalysis,
    uranus: uranusAnalysis,
    neptune: neptuneAnalysis,
    pluto: plutoAnalysis,
    nodes,
    chiron,
    lilith,
    aspectsDetailed,
    weakDignities,
    strongDignities,
    mutableCount,
    cardinalCount,
    fixedCount,
    stelliumHouses,
    stelliumDetails,
    tensionsCount,
    harmoniesCount,
    axes,
    notes,
    version: '3.0.0', // Nueva versión con análisis profundo
    analyzedAt: new Date().toISOString()
  };
}
