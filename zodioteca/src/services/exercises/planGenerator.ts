/**
 * GENERADOR DE PLANES DE EJERCICIOS (Versión 2.0)
 * Orquestador principal: análisis → scoring → selección → fases
 * Plan de 21 días: 7 días fácil / 7 días medio / 7 días variado
 */

import type { NatalChart } from '../../store/useCharts';
import { normalizeChart } from './planetNormalizer';
import { validateAndNormalize } from './chartValidator';
import { analyzeChart, type ChartAnalysis } from './chartAnalyzer';
import { evaluateRules } from './rulesEngine';
import { scorePriorities, filterLowConfidence, summarizeTopPriorities, type ScoredPriority } from './scoring';
import { detectConflicts, resolveConflicts, hasBlockingConflicts } from './conflictDetector';
import { getExercisesByIds, EXERCISE_DATABASE, type ExerciseTemplate } from './exerciseDatabase';
import { logger } from '../../utils/logger';

export interface ExercisePlan {
  id: string;
  userId?: string;
  chartId: string;
  createdAt: string;
  version: string; // "2.0.0"
  
  // Análisis
  chartAnalysis: ChartAnalysis;
  priorities: ScoredPriority[];
  topAreas: string[];
  
  // Fases
  phases: {
    phase1: ExercisePhase; // Días 1-7: nivel fácil
    phase2: ExercisePhase; // Días 8-14: nivel medio
    phase3: ExercisePhase; // Días 15-21: nivel variado
  };
  
  // Metadata
  totalExercises: number;
  estimatedDailyMinutes: number;
}

export interface ExercisePhase {
  phaseNumber: number;
  days: number;
  level: 'easy' | 'medium' | 'varied';
  exercises: ExerciseTemplate[];
  dailyRoutine: string;
  instructions: string;
  
  // Nuevos campos v3.0: Geometría Sagrada y Chakras
  sacredGeometry: {
    name: string;
    symbolism: string;
    color: string;
    visualizationGuide: string;
  };
  chakras: {
    primary: string;
    secondary?: string;
    focus: string;
    affirmation: string;
  };
}

/**
 * Genera un plan de ejercicios completo a partir de una carta natal
 */
export async function generateExercisePlan(
  chart: NatalChart,
  options?: {
    userId?: string;
    chartId?: string;
    excludeExerciseIds?: string[];
  }
): Promise<ExercisePlan> {
  logger.log('🚀 INICIANDO GENERACIÓN DE PLAN (v2.0)');

  // FASE 1: NORMALIZACIÓN Y VALIDACIÓN
  logger.log('📋 Fase 1: Validación de carta...');
  const normalized = normalizeChart(chart);
  const validationResult = validateAndNormalize(normalized);
  
  if (!validationResult.validation.valid) {
    const errorMsgs = validationResult.validation.errors || ['Validación falló'];
    throw new Error(`Carta natal inválida: ${errorMsgs.join(', ')}`);
  }

  if (!validationResult.chart) {
    throw new Error('Error al normalizar la carta natal');
  }

  if (validationResult.validation.warnings && validationResult.validation.warnings.length > 0) {
    logger.warn('⚠️  Advertencias de validación:', validationResult.validation.warnings);
  }

  // FASE 2: ANÁLISIS DE CARTA
  logger.log('🔍 Fase 2: Análisis de carta...');
  const analysis = analyzeChart(validationResult.chart);
  logger.log(`   - Luna estrés: ${analysis.moon?.stressScore || 0}/10`);
  logger.log(`   - Tensiones: ${analysis.tensionsCount}, Armonías: ${analysis.harmoniesCount}`);
  logger.log(`   - Dignidades débiles: ${analysis.weakDignities.length}`);

  // FASE 3: EVALUACIÓN DE REGLAS
  logger.log('⚙️  Fase 3: Evaluando reglas...');
  const ruleOutputs = evaluateRules(validationResult.chart, analysis);
  logger.log(`   - Reglas activadas: ${ruleOutputs.length}`);

  // FASE 4: SCORING Y PRIORIZACIÓN
  logger.log('📊 Fase 4: Scoring y priorización...');
  const allPriorities = scorePriorities(ruleOutputs, analysis);
  const priorities = filterLowConfidence(allPriorities);
  const { areas, summary } = summarizeTopPriorities(priorities);
  
  logger.log(`   - Prioridades finales: ${priorities.length}`);
  logger.log(`   - Top áreas: ${areas.join(', ')}`);
  logger.log('   - Top 3:\n' + summary);

  // FASE 5: SELECCIÓN DE EJERCICIOS
  logger.log('🎯 Fase 5: Seleccionando ejercicios...');
  const selectedExercises = selectExercises(priorities, options?.excludeExerciseIds);
  logger.log(`   - Ejercicios candidatos: ${selectedExercises.length}`);

  // FASE 6: DETECCIÓN Y RESOLUCIÓN DE CONFLICTOS
  logger.log('⚔️  Fase 6: Detectando conflictos...');
  const conflicts = detectConflicts(selectedExercises);
  logger.log(`   - Conflictos detectados: ${conflicts.length}`);

  if (hasBlockingConflicts(conflicts)) {
    logger.warn('🛑 Conflictos bloqueantes detectados — resolviendo...');
  }

  const { kept, removed } = resolveConflicts(selectedExercises, conflicts);
  const finalExercises = selectedExercises.filter(e => kept.includes(e.id));
  logger.log(`   - Ejercicios finales: ${finalExercises.length} (removidos: ${removed.length})`);

  // FASE 7: DISTRIBUCIÓN EN FASES (3 fases de 7 días)
  logger.log('📅 Fase 7: Distribuyendo en fases...');
  const phases = distributeIntoPhases(finalExercises, priorities, analysis);

  // FASE 8: ENSAMBLAR PLAN
  const plan: ExercisePlan = {
    id: generatePlanId(),
    userId: options?.userId,
    chartId: options?.chartId || 'unknown',
    createdAt: new Date().toISOString(),
    version: '2.0.0',
    chartAnalysis: analysis,
    priorities,
    topAreas: areas,
    phases: {
      phase1: phases[0],
      phase2: phases[1],
      phase3: phases[2]
    },
    totalExercises: finalExercises.length,
    estimatedDailyMinutes: Math.round(
      finalExercises.reduce((sum, e) => sum + (e.duration || 10), 0) / 21
    )
  };

  logger.log('✅ PLAN GENERADO CON ÉXITO');
  logger.log(`   - Total: ${plan.totalExercises} ejercicios`);
  logger.log(`   - Tiempo diario estimado: ${plan.estimatedDailyMinutes} min`);
  
  return plan;
}

/**
 * Selecciona ejercicios basándose en las prioridades scoredadas
 * GARANTIZA 6 ejercicios únicos con progresión de dificultad
 */
function selectExercises(
  priorities: ScoredPriority[],
  excludeIds?: string[]
): ExerciseTemplate[] {
  const selected: ExerciseTemplate[] = [];
  const usedIds = new Set<string>(excludeIds || []);

  logger.log('   🔍 Iniciando selección de 6 ejercicios...');

  // PASO 1: Recolectar ejercicios de prioridades
  for (const priority of priorities) {
    const exerciseIds = priority.suggestions;
    logger.log(`   📌 Prioridad "${priority.priorityArea}": ${exerciseIds.length} sugerencias`);

    for (const exId of exerciseIds) {
      if (usedIds.has(exId)) continue;

      const exercise = getExercisesByIds([exId])[0];
      if (exercise) {
        selected.push(exercise);
        usedIds.add(exId);
        logger.log(`      ✓ Agregado: ${exercise.title} (intensidad: ${exercise.intensity})`);
      }

      // Solo necesitamos 6 ejercicios
      if (selected.length >= 6) break;
    }

    if (selected.length >= 6) break;
  }

  logger.log(`   📊 Ejercicios de prioridades: ${selected.length}`);

  // PASO 2: Si no llegamos a 6, usar fallback balanceado
  if (selected.length < 6) {
    logger.log('   ⚠️ Insuficientes ejercicios, activando fallback...');
    
    // Categorías esenciales balanceadas
    const essentialCategories = ['Respiración', 'Emocional', 'Físico', 'Estructura', 'Mental', 'Creatividad'];
    
    for (const category of essentialCategories) {
      if (selected.length >= 6) break;
      
      const categoryExercises = EXERCISE_DATABASE
        .filter(e => e.category === category && !usedIds.has(e.id))
        .sort((a, b) => (a.intensity || 1) - (b.intensity || 1)); // Ordenar por dificultad

      if (categoryExercises.length > 0) {
        const ex = categoryExercises[0];
        selected.push(ex);
        usedIds.add(ex.id);
        logger.log(`      ✓ Fallback: ${ex.title} (${category})`);
      }
    }
  }

  // PASO 3: Si aún faltan, rellenar con ejercicios seguros
  if (selected.length < 6) {
    logger.log('   🆘 Completando con ejercicios de bajo riesgo...');
    
    const generalFillers = EXERCISE_DATABASE
      .filter(e => 
        !usedIds.has(e.id) && 
        e.intensity && e.intensity <= 2 &&
        (!e.safetyInfo || e.safetyInfo.riskLevel !== 'high')
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 6 - selected.length);

    selected.push(...generalFillers);
  }

  // PASO 4: Ordenar por intensidad para progresión natural (fácil → difícil)
  const sortedByIntensity = selected
    .slice(0, 6)
    .sort((a, b) => (a.intensity || 1) - (b.intensity || 1));

  logger.log(`   ✅ Total seleccionado: ${sortedByIntensity.length} ejercicios`);
  sortedByIntensity.forEach((ex, i) => {
    logger.log(`      ${i + 1}. ${ex.title} (intensidad: ${ex.intensity}, categoría: ${ex.category})`);
  });

  return sortedByIntensity;
}

/**
 * MAPA DE GEOMETRÍAS SAGRADAS POR SIGNO ZODIACAL
 * Basado en vibración arquetípica, elementos y frecuencias energéticas
 */
const ZODIAC_GEOMETRIES: Record<string, {
  name: string;
  symbolism: string;
  color: string;
  visualizationGuide: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}> = {
  'Aries': {
    name: 'Tetraedro',
    symbolism: 'Fuego primordial, impulso creativo, voluntad pura',
    color: '#FF0000',
    visualizationGuide: 'Visualiza un tetraedro rojo brillante girando sobre tu plexo solar para activar la confianza y la decisión.',
    element: 'fire'
  },
  'Taurus': {
    name: 'Cubo',
    symbolism: 'Estabilidad, materia, arraigo. Equilibrio de los 4 elementos en el plano físico',
    color: '#228B22',
    visualizationGuide: 'Medita sobre un cubo verde esmeralda para conectar con la abundancia, la seguridad y la fuerza interior.',
    element: 'earth'
  },
  'Gemini': {
    name: 'Octaedro',
    symbolism: 'Equilibrio entre polaridades, intercambio, diálogo entre mente y espíritu',
    color: '#C0C0C0',
    visualizationGuide: 'Visualiza un octaedro plateado girando entre tus pulmones para equilibrar pensamiento y emoción.',
    element: 'air'
  },
  'Cancer': {
    name: 'Esfera',
    symbolism: 'Totalidad, matriz, útero cósmico. Amor maternal universal',
    color: '#87CEEB',
    visualizationGuide: 'Imagina una esfera acuosa envolviendo tu corazón para sanar memorias emocionales.',
    element: 'water'
  },
  'Leo': {
    name: 'Sol Dodecaédrico',
    symbolism: 'Conexión con lo divino interior, autoexpresión, el alma que brilla',
    color: '#FFD700',
    visualizationGuide: 'Medita visualizando un dodecaedro dorado irradiando luz desde el plexo solar.',
    element: 'fire'
  },
  'Virgo': {
    name: 'Merkaba',
    symbolism: 'Vehículo de luz, purificación, equilibrio cuerpo-espíritu',
    color: '#8B7355',
    visualizationGuide: 'Activa la Merkaba con respiraciones conscientes para limpiar y armonizar los cuerpos sutiles.',
    element: 'earth'
  },
  'Libra': {
    name: 'Flor de la Vida',
    symbolism: 'Armonía universal, patrones de creación, belleza y proporción',
    color: '#FF69B4',
    visualizationGuide: 'Medita sobre su geometría rosada para armonizar vínculos y restaurar el equilibrio interno.',
    element: 'air'
  },
  'Scorpio': {
    name: 'Icosaedro',
    symbolism: 'Agua en movimiento, transformación, capacidad de mutar y renacer',
    color: '#8B008B',
    visualizationGuide: 'Visualiza un icosaedro violeta flotando sobre el abdomen bajo para transmutar emociones densas.',
    element: 'water'
  },
  'Sagittarius': {
    name: 'Espiral Dorada',
    symbolism: 'Expansión infinita del conocimiento, conexión con la verdad universal',
    color: '#DAA520',
    visualizationGuide: 'Visualiza una espiral dorada que nace en tu corazón y se expande hacia el universo.',
    element: 'fire'
  },
  'Capricorn': {
    name: 'Cuboctaedro',
    symbolism: 'Maestría material, estructura que sostiene la evolución',
    color: '#696969',
    visualizationGuide: 'Medita con un cuboctaedro gris plomo para consolidar proyectos y materializar metas.',
    element: 'earth'
  },
  'Aquarius': {
    name: 'Estrella Icosaédrica',
    symbolism: 'Mente superior, conciencia colectiva, redes energéticas',
    color: '#00BFFF',
    visualizationGuide: 'Visualízala azul eléctrica activando tu campo mental y conexión con la conciencia grupal.',
    element: 'air'
  },
  'Pisces': {
    name: 'Vesica Piscis',
    symbolism: 'Portal entre mundos, útero de la creación, unión espíritu-materia',
    color: '#9370DB',
    visualizationGuide: 'Medita en su forma como un portal de luz blanca que une el alma con lo divino.',
    element: 'water'
  }
};

/**
 * Geometrías alternativas por área de trabajo (para Fase 2 - Profundización)
 */
const PRIORITY_GEOMETRIES: Record<string, { name: string; symbolism: string; color: string; visualizationGuide: string; element: string }> = {
  'Emocional': ZODIAC_GEOMETRIES['Cancer'],       // Esfera - contención emocional
  'Estructura': ZODIAC_GEOMETRIES['Capricorn'],   // Cuboctaedro - maestría
  'Físico': ZODIAC_GEOMETRIES['Taurus'],          // Cubo - arraigo
  'Mental': ZODIAC_GEOMETRIES['Gemini'],          // Octaedro - equilibrio mental
  'Comunicación': ZODIAC_GEOMETRIES['Gemini'],    // Octaedro - intercambio
  'Autoestima': ZODIAC_GEOMETRIES['Leo'],         // Sol Dodecaédrico - brillo interior
  'Relaciones': ZODIAC_GEOMETRIES['Libra'],       // Flor de la Vida - armonía
  'Transformación': ZODIAC_GEOMETRIES['Scorpio'], // Icosaedro - metamorfosis
  'Propósito': ZODIAC_GEOMETRIES['Sagittarius'],  // Espiral Dorada - expansión
  'Espiritualidad': ZODIAC_GEOMETRIES['Pisces']   // Vesica Piscis - portal
};

/**
 * Calcula el signo zodiacal dominante en la carta natal
 * Usa el elemento dominante de la carta para determinar el signo representativo
 */
function calculateDominantZodiacSign(analysis: ChartAnalysis): string {
  // Determinar elemento dominante
  let dominantElement = 'air';
  let maxElementCount = 0;

  Object.entries(analysis.dominances.elements).forEach(([element, count]) => {
    if (count > maxElementCount) {
      maxElementCount = count;
      dominantElement = element;
    }
  });

  // Seleccionar signo basado en características de la carta
  let selectedSign: string;

  // Luna estresada → Signo cardinal del elemento (iniciar acción)
  if (analysis.moon && analysis.moon.stressScore >= 6) {
    if (dominantElement === 'fire') selectedSign = 'Aries';
    else if (dominantElement === 'earth') selectedSign = 'Capricorn';
    else if (dominantElement === 'air') selectedSign = 'Libra';
    else selectedSign = 'Cancer';
  }
  // Muchas dignidades débiles → Signo mutable (adaptación)
  else if (analysis.weakDignities.length >= 3) {
    if (dominantElement === 'fire') selectedSign = 'Sagittarius';
    else if (dominantElement === 'earth') selectedSign = 'Virgo';
    else if (dominantElement === 'air') selectedSign = 'Gemini';
    else selectedSign = 'Pisces';
  }
  // Default → Signo fijo (estabilidad)
  else {
    if (dominantElement === 'fire') selectedSign = 'Leo';
    else if (dominantElement === 'earth') selectedSign = 'Taurus';
    else if (dominantElement === 'air') selectedSign = 'Aquarius';
    else selectedSign = 'Scorpio';
  }

  logger.log(`   🔮 Signo dominante: ${selectedSign} (elemento: ${dominantElement}, dignidades débiles: ${analysis.weakDignities.length}, luna stress: ${analysis.moon?.stressScore || 0})`);
  return selectedSign;
}

/**
 * Calcula geometría sagrada y chakras para cada fase basándose en la carta natal
 */
function calculateSacredGeometryAndChakras(
  phaseNumber: number,
  analysis: ChartAnalysis,
  priorities: ScoredPriority[]
): {
  sacredGeometry: { name: string; symbolism: string; color: string; visualizationGuide: string };
  chakras: { primary: string; secondary?: string; focus: string; affirmation: string };
} {
  
  // Calcular signo dominante
  const dominantSign = calculateDominantZodiacSign(analysis);
  const signGeometry = ZODIAC_GEOMETRIES[dominantSign] || ZODIAC_GEOMETRIES['Aries'];

  const topPriority = priorities[0]?.priorityArea || 'Emocional';

  // LÓGICA DE SELECCIÓN SEGÚN FASE
  let selectedGeometry;
  let selectedChakra;
  let secondaryChakra;
  let focus;
  let affirmation;

  if (phaseNumber === 1) {
    // FASE 1: Adaptación → Geometría del SIGNO DOMINANTE + Chakras de base
    selectedGeometry = signGeometry;
    selectedChakra = 'Root';
    secondaryChakra = 'Sacral';
    focus = 'Enraizamiento y adaptación usando la energía arquetípica de tu carta';
    affirmation = `Anclo la energía de ${dominantSign} en mi cuerpo. Me adapto con confianza y fluidez.`;
    
  } else if (phaseNumber === 2) {
    // FASE 2: Profundización → Geometría según PRIORIDAD + Chakras emocionales
    selectedGeometry = PRIORITY_GEOMETRIES[topPriority] || signGeometry;
    
    // Chakras según necesidad emocional
    if (analysis.moon && analysis.moon.stressScore >= 6) {
      selectedChakra = 'Sacral';
      secondaryChakra = 'Heart';
      focus = 'Procesamiento emocional profundo y sanación lunar';
      affirmation = 'Honro la sabiduría de mis emociones. Me permito sentir y sanar.';
    } else {
      selectedChakra = 'Heart';
      secondaryChakra = topPriority === 'Comunicación' ? 'Throat' : 'Solar Plexus';
      focus = `Trabajo profundo en ${topPriority} con compasión y fuerza interior`;
      affirmation = `Mi ${topPriority.toLowerCase()} florece con cada práctica. Soy capaz y merecedor/a.`;
    }
    
  } else {
    // FASE 3: Integración → FLOR DE LA VIDA (patrón maestro) + Chakras superiores
    selectedGeometry = ZODIAC_GEOMETRIES['Libra']; // Flor de la Vida - armonía universal
    selectedChakra = 'Crown';
    secondaryChakra = 'Third Eye';
    focus = 'Integración total de aprendizajes y expansión de conciencia';
    affirmation = 'Integro todo lo vivido. Soy parte del patrón perfecto del universo.';
  }

  logger.log(`   🔮 Fase ${phaseNumber}: ${selectedGeometry.name} (${dominantSign}) + Chakra ${selectedChakra}`);

  return {
    sacredGeometry: selectedGeometry,
    chakras: {
      primary: selectedChakra,
      secondary: secondaryChakra,
      focus,
      affirmation
    }
  };
}

/**
 * Distribuye 6 ejercicios en 3 fases de 7 días (2 ejercicios por fase)
 * Los ejercicios ya vienen ordenados por intensidad (fácil → difícil)
 * NO SE REPITEN ejercicios entre fases
 * Incluye geometría sagrada y chakras calculados según la carta
 */
function distributeIntoPhases(
  exercises: ExerciseTemplate[],
  priorities: ScoredPriority[],
  analysis: ChartAnalysis
): [ExercisePhase, ExercisePhase, ExercisePhase] {
  logger.log(`   - Distribuyendo ${exercises.length} ejercicios en 3 fases (2 por fase)...`);
  logger.log(`   🔮 Calculando geometrías sagradas y chakras según carta...`);

  // Los ejercicios ya vienen ordenados por intensidad de menor a mayor
  // Fase 1: ejercicios 1-2 (más fáciles)
  // Fase 2: ejercicios 3-4 (medios)
  // Fase 3: ejercicios 5-6 (más desafiantes)
  
  const phase1Exercises = exercises.slice(0, 2);
  const phase2Exercises = exercises.slice(2, 4);
  const phase3Exercises = exercises.slice(4, 6);

  const topPriority = priorities[0]?.priorityArea || 'equilibrio';

  // Calcular geometrías y chakras para cada fase
  const phase1GeometryChakras = calculateSacredGeometryAndChakras(1, analysis, priorities);
  const phase2GeometryChakras = calculateSacredGeometryAndChakras(2, analysis, priorities);
  const phase3GeometryChakras = calculateSacredGeometryAndChakras(3, analysis, priorities);

  const phase1: ExercisePhase = {
    phaseNumber: 1,
    days: 7,
    level: 'easy',
    exercises: phase1Exercises,
    dailyRoutine: generateDailyRoutine(phase1Exercises),
    instructions: `📅 Días 1-7: Adaptación suave. Realiza estos 2 ejercicios diariamente para familiarizarte con las prácticas. Enfócate en ${topPriority}.`,
    sacredGeometry: phase1GeometryChakras.sacredGeometry,
    chakras: phase1GeometryChakras.chakras
  };

  const phase2: ExercisePhase = {
    phaseNumber: 2,
    days: 7,
    level: 'medium',
    exercises: phase2Exercises,
    dailyRoutine: generateDailyRoutine(phase2Exercises),
    instructions: `📅 Días 8-14: Profundización. Estos 2 ejercicios tienen mayor intensidad. Continúa trabajando en ${topPriority} con más compromiso.`,
    sacredGeometry: phase2GeometryChakras.sacredGeometry,
    chakras: phase2GeometryChakras.chakras
  };

  const phase3: ExercisePhase = {
    phaseNumber: 3,
    days: 7,
    level: 'varied',
    exercises: phase3Exercises,
    dailyRoutine: generateDailyRoutine(phase3Exercises),
    instructions: `📅 Días 15-21: Integración y consolidación. Completa el ciclo con estos 2 ejercicios desafiantes que integran todo lo aprendido.`,
    sacredGeometry: phase3GeometryChakras.sacredGeometry,
    chakras: phase3GeometryChakras.chakras
  };

  logger.log(`   ✓ Fase 1 (fácil): ${phase1Exercises.map(e => e.title).join(', ')}`);
  logger.log(`   ✓ Fase 2 (medio): ${phase2Exercises.map(e => e.title).join(', ')}`);
  logger.log(`   ✓ Fase 3 (variado): ${phase3Exercises.map(e => e.title).join(', ')}`);

  return [phase1, phase2, phase3];
}

/**
 * Genera texto de rutina diaria
 */
function generateDailyRoutine(exercises: ExerciseTemplate[]): string {
  const morning = exercises.filter(e => e.timing === 'morning');
  const evening = exercises.filter(e => e.timing === 'evening');
  const anytime = exercises.filter(e => e.timing === 'anytime' || !e.timing);

  let routine = '';
  if (morning.length > 0) {
    routine += `🌅 Mañana: ${morning.map(e => e.id).join(', ')}\n`;
  }
  if (anytime.length > 0) {
    routine += `☀️ Durante el día: ${anytime.map(e => e.id).join(', ')}\n`;
  }
  if (evening.length > 0) {
    routine += `🌙 Noche: ${evening.map(e => e.id).join(', ')}`;
  }

  return routine.trim() || 'Realiza los ejercicios en el orden que prefieras.';
}

/**
 * Genera ID único para el plan
 */
function generatePlanId(): string {
  return `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
