/**
 * DETECTOR DE CONFLICTOS (Versión 2.0)
 * Previene asignar ejercicios incompatibles en el mismo plan
 * - Timing: ejercicios activos vs pasivos en misma fase
 * - Energía: demasiados ejercicios intensos seguidos
 * - Contraindicaciones: ejercicios médicamente incompatibles
 */

export type ConflictType = 'timing' | 'energy' | 'contraindication' | 'redundancy';

export interface ExerciseConflict {
  type: ConflictType;
  exerciseIds: string[];
  severity: number; // 1-3
  reason: string;
}

export interface ExerciseMetadata {
  id: string;
  category: string;
  timing?: 'morning' | 'evening' | 'anytime';
  energyLevel?: 'low' | 'medium' | 'high';
  intensity?: number; // 1-5
  contraindications?: string[];
  targetArea?: string;
  duration?: number; // minutos
}

/**
 * Detecta conflictos de timing (mañana vs noche)
 */
function detectTimingConflicts(exercises: ExerciseMetadata[]): ExerciseConflict[] {
  const conflicts: ExerciseConflict[] = [];

  const morning = exercises.filter(e => e.timing === 'morning');
  const evening = exercises.filter(e => e.timing === 'evening');

  // Si hay muchos ejercicios de mañana Y noche, puede ser sobrecarga
  if (morning.length >= 3 && evening.length >= 3) {
    conflicts.push({
      type: 'timing',
      exerciseIds: [...morning.map(e => e.id), ...evening.map(e => e.id)],
      severity: 2,
      reason: `Demasiados ejercicios con timing específico (${morning.length} mañana, ${evening.length} noche) — puede sobrecargar rutina`
    });
  }

  return conflicts;
}

/**
 * Detecta sobrecarga de energía (muchos ejercicios intensos)
 */
function detectEnergyConflicts(exercises: ExerciseMetadata[]): ExerciseConflict[] {
  const conflicts: ExerciseConflict[] = [];

  const highEnergy = exercises.filter(e => e.energyLevel === 'high' || (e.intensity && e.intensity >= 4));

  // Si hay más de 4 ejercicios intensos, puede ser agotador
  if (highEnergy.length > 4) {
    conflicts.push({
      type: 'energy',
      exerciseIds: highEnergy.map(e => e.id),
      severity: 3,
      reason: `${highEnergy.length} ejercicios de alta intensidad — riesgo de agotamiento o abandono`
    });
  }

  // Calcular intensidad promedio
  const avgIntensity = exercises
    .filter(e => e.intensity)
    .reduce((sum, e) => sum + (e.intensity || 0), 0) / exercises.length;

  if (avgIntensity > 3.5) {
    conflicts.push({
      type: 'energy',
      exerciseIds: exercises.map(e => e.id),
      severity: 2,
      reason: `Intensidad promedio muy alta (${avgIntensity.toFixed(1)}/5) — considerar balancear con ejercicios más suaves`
    });
  }

  return conflicts;
}

/**
 * Detecta contraindicaciones médicas
 */
function detectContraindicationConflicts(exercises: ExerciseMetadata[]): ExerciseConflict[] {
  const conflicts: ExerciseConflict[] = [];

  // Ejemplo: si hay ejercicio de respiración intensa + ejercicio cardiovascular intenso
  const breathwork = exercises.filter(e => e.category === 'Respiración');
  const cardio = exercises.filter(e => e.category === 'Físico' && (e.intensity || 0) >= 4);

  if (breathwork.length >= 2 && cardio.length >= 2) {
    conflicts.push({
      type: 'contraindication',
      exerciseIds: [...breathwork.map(e => e.id), ...cardio.map(e => e.id)],
      severity: 2,
      reason: 'Combinar múltiples ejercicios de respiración intensa con cardio intenso puede provocar hiperventilación'
    });
  }

  // Verificar contraindicaciones explícitas
  for (let i = 0; i < exercises.length; i++) {
    const ex1 = exercises[i];
    if (!ex1.contraindications) continue;

    for (let j = i + 1; j < exercises.length; j++) {
      const ex2 = exercises[j];
      
      // Si ex2 está en las contraindicaciones de ex1
      if (ex1.contraindications.some(c => ex2.category.toLowerCase().includes(c.toLowerCase()))) {
        conflicts.push({
          type: 'contraindication',
          exerciseIds: [ex1.id, ex2.id],
          severity: 3,
          reason: `${ex1.id} tiene contraindicación con ${ex2.id}`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Detecta redundancia (muchos ejercicios del mismo tipo)
 */
function detectRedundancy(exercises: ExerciseMetadata[]): ExerciseConflict[] {
  const conflicts: ExerciseConflict[] = [];

  // Agrupar por categoría
  const byCategory = new Map<string, ExerciseMetadata[]>();
  for (const ex of exercises) {
    const current = byCategory.get(ex.category) || [];
    current.push(ex);
    byCategory.set(ex.category, current);
  }

  // Si una categoría tiene más de 5 ejercicios, es redundante
  for (const [category, exs] of byCategory.entries()) {
    if (exs.length > 5) {
      conflicts.push({
        type: 'redundancy',
        exerciseIds: exs.map(e => e.id),
        severity: 2,
        reason: `${exs.length} ejercicios de categoría "${category}" — considerar diversificar`
      });
    }
  }

  // Agrupar por área objetivo
  const byTarget = new Map<string, ExerciseMetadata[]>();
  for (const ex of exercises) {
    if (!ex.targetArea) continue;
    const current = byTarget.get(ex.targetArea) || [];
    current.push(ex);
    byTarget.set(ex.targetArea, current);
  }

  for (const [target, exs] of byTarget.entries()) {
    if (exs.length > 4) {
      conflicts.push({
        type: 'redundancy',
        exerciseIds: exs.map(e => e.id),
        severity: 1,
        reason: `${exs.length} ejercicios enfocados en "${target}" — puede ser repetitivo`
      });
    }
  }

  return conflicts;
}

/**
 * Detecta todos los conflictos en un conjunto de ejercicios
 */
export function detectConflicts(exercises: ExerciseMetadata[]): ExerciseConflict[] {
  return [
    ...detectTimingConflicts(exercises),
    ...detectEnergyConflicts(exercises),
    ...detectContraindicationConflicts(exercises),
    ...detectRedundancy(exercises)
  ];
}

/**
 * Filtra ejercicios para resolver conflictos
 * Prioriza ejercicios de alta severidad y alta confianza
 */
export function resolveConflicts(
  exercises: ExerciseMetadata[],
  conflicts: ExerciseConflict[]
): {
  kept: string[];
  removed: string[];
  resolvedConflicts: ConflictType[];
} {
  const removed = new Set<string>();
  const resolvedConflicts: ConflictType[] = [];

  // Resolver conflictos de mayor a menor severidad
  const sorted = conflicts.sort((a, b) => b.severity - a.severity);

  for (const conflict of sorted) {
    if (conflict.severity < 2) continue; // Solo resolver conflictos serios

    // Estrategia: remover el ejercicio menos específico del conflicto
    if (conflict.type === 'redundancy') {
      // Remover los ejercicios excedentes (dejar máx 4 por categoría)
      const ids = conflict.exerciseIds.filter(id => !removed.has(id));
      const toRemove = ids.slice(4); // Dejar solo los primeros 4
      toRemove.forEach(id => removed.add(id));
      resolvedConflicts.push(conflict.type);
    }

    if (conflict.type === 'energy') {
      // Remover ejercicios de alta intensidad hasta bajar carga
      const highIntensity = exercises
        .filter(e => conflict.exerciseIds.includes(e.id) && (e.intensity || 0) >= 4)
        .sort((a, b) => (b.intensity || 0) - (a.intensity || 0));

      // Remover el más intenso
      if (highIntensity.length > 0) {
        removed.add(highIntensity[0].id);
        resolvedConflicts.push(conflict.type);
      }
    }

    if (conflict.type === 'contraindication') {
      // Remover el primer ejercicio del conflicto (arbitrario pero consistente)
      removed.add(conflict.exerciseIds[0]);
      resolvedConflicts.push(conflict.type);
    }
  }

  const kept = exercises.filter(e => !removed.has(e.id)).map(e => e.id);

  return {
    kept,
    removed: Array.from(removed),
    resolvedConflicts
  };
}

/**
 * Valida que un plan no tenga conflictos críticos (severity >= 3)
 */
export function hasBlockingConflicts(conflicts: ExerciseConflict[]): boolean {
  return conflicts.some(c => c.severity >= 3);
}
