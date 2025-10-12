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
import { getExercisesByIds, getExercisesByCategoryAndLevel, type ExerciseTemplate } from './exerciseDatabase';

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
  console.log('🚀 INICIANDO GENERACIÓN DE PLAN (v2.0)');

  // FASE 1: NORMALIZACIÓN Y VALIDACIÓN
  console.log('📋 Fase 1: Validación de carta...');
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
    console.warn('⚠️  Advertencias de validación:', validationResult.validation.warnings);
  }

  // FASE 2: ANÁLISIS DE CARTA
  console.log('🔍 Fase 2: Análisis de carta...');
  const analysis = analyzeChart(validationResult.chart);
  console.log(`   - Luna estrés: ${analysis.moon?.stressScore || 0}/10`);
  console.log(`   - Tensiones: ${analysis.tensionsCount}, Armonías: ${analysis.harmoniesCount}`);
  console.log(`   - Dignidades débiles: ${analysis.weakDignities.length}`);

  // FASE 3: EVALUACIÓN DE REGLAS
  console.log('⚙️  Fase 3: Evaluando reglas...');
  const ruleOutputs = evaluateRules(validationResult.chart, analysis);
  console.log(`   - Reglas activadas: ${ruleOutputs.length}`);

  // FASE 4: SCORING Y PRIORIZACIÓN
  console.log('📊 Fase 4: Scoring y priorización...');
  const allPriorities = scorePriorities(ruleOutputs, analysis);
  const priorities = filterLowConfidence(allPriorities);
  const { areas, summary } = summarizeTopPriorities(priorities);
  
  console.log(`   - Prioridades finales: ${priorities.length}`);
  console.log(`   - Top áreas: ${areas.join(', ')}`);
  console.log('   - Top 3:\n' + summary);

  // FASE 5: SELECCIÓN DE EJERCICIOS
  console.log('🎯 Fase 5: Seleccionando ejercicios...');
  const selectedExercises = selectExercises(priorities, options?.excludeExerciseIds);
  console.log(`   - Ejercicios candidatos: ${selectedExercises.length}`);

  // FASE 6: DETECCIÓN Y RESOLUCIÓN DE CONFLICTOS
  console.log('⚔️  Fase 6: Detectando conflictos...');
  const conflicts = detectConflicts(selectedExercises);
  console.log(`   - Conflictos detectados: ${conflicts.length}`);

  if (hasBlockingConflicts(conflicts)) {
    console.warn('🛑 Conflictos bloqueantes detectados — resolviendo...');
  }

  const { kept, removed } = resolveConflicts(selectedExercises, conflicts);
  const finalExercises = selectedExercises.filter(e => kept.includes(e.id));
  console.log(`   - Ejercicios finales: ${finalExercises.length} (removidos: ${removed.length})`);

  // FASE 7: DISTRIBUCIÓN EN FASES (3 fases de 7 días)
  console.log('📅 Fase 7: Distribuyendo en fases...');
  const phases = distributeIntoPhases(finalExercises, priorities);

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

  console.log('✅ PLAN GENERADO CON ÉXITO');
  console.log(`   - Total: ${plan.totalExercises} ejercicios`);
  console.log(`   - Tiempo diario estimado: ${plan.estimatedDailyMinutes} min`);
  
  return plan;
}

/**
 * Selecciona ejercicios basándose en las prioridades scoredadas
 */
function selectExercises(
  priorities: ScoredPriority[],
  excludeIds?: string[]
): ExerciseTemplate[] {
  const selected: ExerciseTemplate[] = [];
  const usedIds = new Set<string>(excludeIds || []);

  // Iterar por prioridades (ya están ordenadas por score)
  for (const priority of priorities) {
    // Extraer ejercicios sugeridos
    const exerciseIds = priority.suggestions;

    for (const exId of exerciseIds) {
      if (usedIds.has(exId)) continue;

      const exercise = getExercisesByIds([exId])[0];
      if (exercise) {
        selected.push(exercise);
        usedIds.add(exId);
      }

      // Límite: no más de 18 ejercicios (6 por fase)
      if (selected.length >= 18) break;
    }

    if (selected.length >= 18) break;
  }

  // Si no alcanzamos 18, rellenar con ejercicios de mantenimiento
  if (selected.length < 18) {
    const topArea = priorities[0]?.priorityArea || 'Emocional';
    const fillers = getExercisesByCategoryAndLevel(topArea, 'easy')
      .filter((e: ExerciseTemplate) => !usedIds.has(e.id))
      .slice(0, 18 - selected.length);

    selected.push(...fillers);
  }

  return selected;
}

/**
 * Distribuye ejercicios en 3 fases de 7 días
 * Fase 1: nivel fácil, Fase 2: nivel medio, Fase 3: nivel variado
 */
function distributeIntoPhases(
  exercises: ExerciseTemplate[],
  priorities: ScoredPriority[]
): [ExercisePhase, ExercisePhase, ExercisePhase] {
  // Ordenar ejercicios por intensidad
  const sorted = [...exercises].sort((a, b) => (a.intensity || 1) - (b.intensity || 1));

  // Dividir en 3 grupos
  const third = Math.ceil(sorted.length / 3);
  const easy = sorted.slice(0, third);
  const medium = sorted.slice(third, third * 2);
  const varied = sorted.slice(third * 2);

  const phase1: ExercisePhase = {
    phaseNumber: 1,
    days: 7,
    level: 'easy',
    exercises: easy,
    dailyRoutine: generateDailyRoutine(easy),
    instructions: `Semana de adaptación: ejercicios suaves para familiarizarte con las prácticas. Enfócate en ${priorities[0]?.priorityArea || 'equilibrio'}.`
  };

  const phase2: ExercisePhase = {
    phaseNumber: 2,
    days: 7,
    level: 'medium',
    exercises: medium,
    dailyRoutine: generateDailyRoutine(medium),
    instructions: `Semana de profundización: aumentamos intensidad. Continúa trabajando en ${priorities[0]?.priorityArea || 'equilibrio'}.`
  };

  const phase3: ExercisePhase = {
    phaseNumber: 3,
    days: 7,
    level: 'varied',
    exercises: varied,
    dailyRoutine: generateDailyRoutine(varied),
    instructions: `Semana de integración: ejercicios variados para consolidar hábitos. Explora todas las áreas trabajadas.`
  };

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
