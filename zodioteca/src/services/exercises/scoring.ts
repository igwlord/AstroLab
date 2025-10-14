/**
 * SISTEMA DE SCORING MEJORADO (Versión 3.0)
 * Scoring basado en convergencia de indicadores + confianza + matching energético
 * No depende de cantidad de sugerencias, sino de calidad de evidencia
 */

import type { RuleOutput } from './rulesEngine';
import type { ChartAnalysis } from './chartAnalyzer';

/**
 * Matriz de matching energético: Elemento → Ejercicios prioritarios
 */
export const ELEMENT_MATCHING: Record<'fire' | 'earth' | 'air' | 'water', string[]> = {
  fire: [
    'cardio',
    'salutation',
    'pranayama',
    'hiit',
    'danza',
    'vinyasa',
    'energética',
    'movimiento'
  ],
  earth: [
    'restaurativo',
    'tai chi',
    'caminata',
    'postural',
    'pilates',
    'estiramientos',
    'grounding',
    'enraizamiento',
    'rutina',
    'estructura'
  ],
  air: [
    'breathwork',
    'meditación',
    'respiración',
    'danza',
    'concentración',
    'mindfulness',
    'mental',
    'diario',
    'journaling'
  ],
  water: [
    'yin',
    'baño',
    'emocional',
    'flujo',
    'nidra',
    'visualización',
    'ritual',
    'sensibilidad',
    'relajación'
  ]
};

export interface ScoredPriority {
  priorityArea: string;
  severity: number;
  score: number; // 0-100
  suggestions: string[];
  indicators: string[];
  rationale: string;
  confidence: number; // 0-1
  ruleId: string;
}

/**
 * Calcula score de prioridad basado en múltiples factores
 */
function calculatePriorityScore(
  output: RuleOutput,
  analysis: ChartAnalysis
): number {
  let score = 0;

  // 1. Severity base (0-60 puntos) - peso principal
  score += output.severity * 20;

  // 2. Convergencia de indicadores (0-20 puntos)
  // Más indicadores = más evidencia
  const indicatorBonus = Math.min(20, output.indicators.length * 4);
  score += indicatorBonus;

  // 3. Bonus por confianza (0-10 puntos)
  const confidenceBonus = output.confidence * 10;
  score += confidenceBonus;

  // 4. Bonus por contexto (0-10 puntos)
  // Si hay múltiples problemas en la carta, aumenta urgencia
  if (analysis.tensionsCount >= 3) score += 5;
  if (analysis.weakDignities.length >= 2) score += 3;
  if (analysis.moon && analysis.moon.stressScore >= 5) score += 2;

  // Normalizar a 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Calcula confianza basada en disponibilidad de datos
 */
function calculateConfidence(
  output: RuleOutput,
  analysis: ChartAnalysis
): number {
  let confidence = output.confidence; // Base de la regla

  // Ajustar por completitud de datos
  const hasLunaData = !!analysis.moon;
  const hasMercuryData = !!analysis.mercury;
  const hasAspectsData = analysis.tensionsCount > 0 || analysis.harmoniesCount > 0;

  let dataCompletion = 0;
  if (hasLunaData) dataCompletion += 0.33;
  if (hasMercuryData) dataCompletion += 0.33;
  if (hasAspectsData) dataCompletion += 0.34;

  // Penalizar confianza si faltan datos críticos para esta regla
  if (output.priorityArea === 'Emocional' && !hasLunaData) {
    confidence *= 0.7;
  }
  if (output.priorityArea === 'Comunicación' && !hasMercuryData) {
    confidence *= 0.7;
  }

  // Bonus por alta completitud de datos
  if (dataCompletion >= 0.9) {
    confidence = Math.min(1, confidence * 1.1);
  }

  return Math.max(0, Math.min(1, confidence));
}

/**
 * Detecta si múltiples reglas apuntan a la misma área (convergencia)
 */
function detectConvergence(outputs: RuleOutput[]): Map<string, number> {
  const convergenceMap = new Map<string, number>();

  for (const output of outputs) {
    const current = convergenceMap.get(output.priorityArea) || 0;
    convergenceMap.set(output.priorityArea, current + 1);
  }

  return convergenceMap;
}

/**
 * Scorea y prioriza todas las reglas activadas
 */
export function scorePriorities(
  outputs: RuleOutput[],
  analysis: ChartAnalysis
): ScoredPriority[] {
  const convergenceMap = detectConvergence(outputs);

  const scored = outputs.map(output => {
    let score = calculatePriorityScore(output, analysis);
    const confidence = calculateConfidence(output, analysis);

    // Bonus por convergencia (múltiples reglas apuntan a misma área)
    const convergence = convergenceMap.get(output.priorityArea) || 1;
    if (convergence >= 2) {
      score += 5 * (convergence - 1); // +5 por cada regla adicional convergente
    }

    return {
      priorityArea: output.priorityArea,
      severity: output.severity,
      score: Math.min(100, score),
      suggestions: output.suggestions,
      indicators: output.indicators,
      rationale: output.rationale,
      confidence,
      ruleId: output.ruleId
    };
  });

  // Ordenar por score (descendente), luego por confianza
  return scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.confidence - a.confidence;
  });
}

/**
 * Filtra prioridades de baja confianza (< 0.5)
 */
export function filterLowConfidence(priorities: ScoredPriority[]): ScoredPriority[] {
  return priorities.filter(p => p.confidence >= 0.5);
}

/**
 * Agrupa prioridades por área para análisis
 */
export function groupByArea(priorities: ScoredPriority[]): Map<string, ScoredPriority[]> {
  const grouped = new Map<string, ScoredPriority[]>();

  for (const priority of priorities) {
    const current = grouped.get(priority.priorityArea) || [];
    current.push(priority);
    grouped.set(priority.priorityArea, current);
  }

  return grouped;
}

/**
 * Resume las top 3 prioridades para mostrar al usuario
 */
export function summarizeTopPriorities(priorities: ScoredPriority[]): {
  areas: string[];
  summary: string;
} {
  const top3 = priorities.slice(0, 3);
  const areas = [...new Set(top3.map(p => p.priorityArea))];

  const summary = top3
    .map((p, i) => `${i + 1}. ${p.priorityArea} (score: ${p.score.toFixed(0)}, confianza: ${(p.confidence * 100).toFixed(0)}%)`)
    .join('\n');

  return { areas, summary };
}
