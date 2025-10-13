/**
 * ÍNDICE DEL SISTEMA DE EJERCICIOS HOLÍSTICOS v2.0
 * Exporta todas las funciones y tipos necesarios
 */

// Normalización y validación
export { normalizeChart, isPlanetNormalized, isSignNormalized } from './planetNormalizer';
export { validateChart, sanitizeChart, validateAndNormalize } from './chartValidator';
export type { ValidationResult } from './chartValidator';

// Dignidades
export { getPlanetDignity, adjustSeverityByDignity, getWeakDignities } from './dignities';
export type { DignityInfo, DignityType } from './dignities';

// Análisis de carta
export { analyzeChart } from './chartAnalyzer';
export type { ChartAnalysis } from './chartAnalyzer';

// Motor de reglas
export { evaluateRules, RULES_V2 } from './rulesEngine';
export type { AnalysisRule, RuleOutput } from './rulesEngine';

// Sistema de scoring
export {
  scorePriorities,
  filterLowConfidence,
  groupByArea,
  summarizeTopPriorities
} from './scoring';
export type { ScoredPriority } from './scoring';

// Detector de conflictos
export { detectConflicts, resolveConflicts, hasBlockingConflicts } from './conflictDetector';
export type { ExerciseConflict, ExerciseMetadata, ConflictType } from './conflictDetector';

// Base de datos de ejercicios (v3.0 - con tipos mejorados)
export {
  EXERCISE_DATABASE,
  getExercisesByIds,
  getExercisesByCategoryAndLevel,
  getRandomExercises,
  searchExercises
} from './exerciseDatabase';
export type { 
  ExerciseTemplate, 
  TherapeuticTags, 
  TherapeuticModality,
  AstroTags,
  EssentialOil,
  SafetyInfo
} from './exerciseDatabase';

// Sistema de recomendación (v3.0 - NUEVO)
export {
  recommendExercisesForChart,
  filterByMedicalSafety,
  generateMicroRoutine,
  formatRecommendationForUser
} from './exerciseRecommender';
export type {
  ChartDominance,
  ClientContext,
  ExerciseRecommendation
} from './exerciseRecommender';

// Generador de planes
export { generateExercisePlan } from './planGenerator';
export type { ExercisePlan, ExercisePhase } from './planGenerator';
