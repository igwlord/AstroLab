/**
 * EXERCISE RECOMMENDER (v3.0)
 * Sistema de recomendación basado en scoring para cartas natales
 * Integra dominancias astrológicas con ejercicios terapéuticos
 */

import type { ExerciseTemplate } from './exerciseDatabase';
import { EXERCISE_DATABASE } from './exerciseDatabase';
import { logger } from '../../utils/logger';

// ========== TIPOS ==========

export interface ChartDominance {
  planets?: string[]; // ['Mars', 'Sun', 'Venus']
  elements?: { 
    fire?: number; 
    earth?: number; 
    air?: number; 
    water?: number; 
  };
  modalities?: { 
    cardinal?: number; 
    fixed?: number; 
    mutable?: number; 
  };
  hemispheres?: { 
    upper?: number; 
    lower?: number; 
    left?: number; 
    right?: number; 
  };
  houseDominance?: number[]; // casas con peso [4, 8, 12]
  ascendant?: string | null;
  moonSign?: string | null;
}

export interface ClientContext extends ChartDominance {
  currentState?: 'crisis' | 'stable' | 'growth';
  energyLevel?: 'depleted' | 'normal' | 'high';
  medicalConditions?: string[]; // para filtrar contraindicaciones
  therapeuticPreferences?: string[]; // ['Gestalt', 'Jung']
}

export interface ExerciseRecommendation {
  exercise: ExerciseTemplate;
  score: number;
  reasons: string[];
  warnings?: string[];
}

// ========== MAPEOS HEURÍSTICOS ==========

const ELEMENT_MAP: Record<string, string> = {
  fire: 'fireDominant',
  earth: 'earthDominant',
  air: 'airDominant',
  water: 'waterDominant'
};

// Mapeo simplificado de casas a chakras (heurística, no dogma)
const HOUSE_TO_CHAKRA: Record<number, string> = {
  1: 'Root',
  2: 'Sacral',
  3: 'Solar Plexus',
  4: 'Heart',
  5: 'Throat',
  6: 'Third Eye',
  7: 'Crown',
  8: 'Root',
  9: 'Heart',
  10: 'Throat',
  11: 'Third Eye',
  12: 'Crown'
};

// ========== FUNCIÓN PRINCIPAL ==========

/**
 * Recomienda ejercicios basándose en análisis de carta natal
 * 
 * Reglas de scoring:
 * - +3 puntos por match directo de planeta
 * - +2 puntos por match de elemento dominante
 * - +2 puntos por match de chakra/casa
 * - +1 punto por modalidad terapéutica alineada
 * - +2 puntos extra para ejercicios de grounding si fire/mutable alto
 * - -2 puntos si ejercicio tiene intensidad alta y cliente está en crisis
 * - -3 puntos si hay contraindicación médica
 * - -1 punto si ejercicio largo y chart muy fijo
 */
export function recommendExercisesForChart(
  context: ClientContext,
  options?: { limit?: number; excludeIds?: string[] }
): ExerciseRecommendation[] {
  logger.log('🎯 Iniciando recomendación de ejercicios...');
  
  const excludeSet = new Set(options?.excludeIds || []);
  const limit = options?.limit ?? 10;

  const results = EXERCISE_DATABASE
    .filter(ex => !excludeSet.has(ex.id))
    .map(ex => {
      let score = 0;
      const reasons: string[] = [];
      const warnings: string[] = [];

      // ========== SCORING ==========

      // 1. Match de planetas (+3 por planeta)
      if (ex.astroTags?.planets && context.planets) {
        const common = ex.astroTags.planets.filter(p => 
          context.planets!.some(cp => cp.toLowerCase() === p.toLowerCase())
        );
        if (common.length > 0) {
          score += 3 * common.length;
          reasons.push(`Match planetario: ${common.join(', ')}`);
        }
      }

      // 2. Match de elementos (+2 por elemento, multiplicado por peso)
      if (ex.astroTags?.recommendedFor && context.elements) {
        for (const [element, weight] of Object.entries(context.elements)) {
          const dominanceKey = ELEMENT_MAP[element];
          if (weight && weight >= 3 && ex.astroTags.recommendedFor.includes(dominanceKey)) {
            const bonus = Math.min(2, weight - 2); // peso 3 = +1, peso 4+ = +2
            score += 2 + bonus;
            reasons.push(`Elemento ${element} (peso ${weight})`);
          }
        }
      }

      // 3. Match de chakras/casas (+2)
      if (ex.astroTags?.chakras && context.houseDominance && context.houseDominance.length > 0) {
        for (const house of context.houseDominance.slice(0, 3)) {
          const chakra = HOUSE_TO_CHAKRA[Math.abs(house)];
          if (chakra && ex.astroTags.chakras.includes(chakra)) {
            score += 2;
            reasons.push(`Casa ${house} → Chakra ${chakra}`);
          }
        }
      }

      // 4. Match de modalidades terapéuticas (+1)
      if (ex.therapeuticTags?.modalities && context.therapeuticPreferences) {
        const matchedModalities = ex.therapeuticTags.modalities.filter(m =>
          context.therapeuticPreferences!.includes(m)
        );
        if (matchedModalities.length > 0) {
          score += 1;
          reasons.push(`Modalidad terapéutica: ${matchedModalities.join(', ')}`);
        }
      }

      // 5. Grounding para fuego/mutable alto (+2)
      const fireWeight = context.elements?.fire ?? 0;
      const mutableWeight = context.modalities?.mutable ?? 0;
      if ((fireWeight >= 3 || mutableWeight >= 4) && 
          (ex.category === 'Físico' || ex.category === 'Contemplación') &&
          ex.targetArea === 'Físico') {
        score += 2;
        reasons.push('Grounding recomendado para energía dispersa');
      }

      // 6. Penalización por intensidad en crisis (-2)
      if (context.currentState === 'crisis' && ex.intensity && ex.intensity >= 3) {
        score -= 2;
        reasons.push('Intensidad reducida por estado de crisis');
      }

      // 7. Penalización por duración larga en chart fijo (-1)
      const fixedWeight = context.modalities?.fixed ?? 0;
      if (fixedWeight >= 4 && ex.duration && ex.duration >= 30) {
        score -= 1;
        reasons.push('Ejercicio largo (penalizado para energía fija)');
      }

      // 8. Bonus por energía baja si cliente agotado (+2)
      if (context.energyLevel === 'depleted' && ex.energyLevel === 'low') {
        score += 2;
        reasons.push('Bajo requerimiento energético (ideal para agotamiento)');
      }

      // 9. CONTRAINDICACIONES (-3 y warning)
      if (ex.safetyInfo?.contraindications && context.medicalConditions) {
        for (const condition of context.medicalConditions) {
          const hasContraindication = ex.safetyInfo.contraindications.some(c =>
            c.toLowerCase().includes(condition.toLowerCase())
          );
          if (hasContraindication) {
            score -= 3;
            warnings.push(`⚠️ CONTRAINDICACIÓN: ${condition}`);
          }
        }
      }

      // 10. Warning si requiere supervisión
      if (ex.safetyInfo?.requiresSupervision) {
        warnings.push('⚠️ Requiere supervisión profesional');
      }

      return { exercise: ex, score, reasons, warnings };
    });

  // Ordenar por score descendente
  const sorted = results
    .filter(r => r.score > 0) // Solo ejercicios con score positivo
    .sort((a, b) => b.score - a.score);

  const topResults = sorted.slice(0, limit);

  logger.log(`   ✅ ${topResults.length} ejercicios recomendados (de ${EXERCISE_DATABASE.length} totales)`);
  if (topResults.length > 0) {
    logger.log(`   🏆 Top ejercicio: "${topResults[0].exercise.title}" (score: ${topResults[0].score})`);
  }

  return topResults;
}

/**
 * Filtra ejercicios excluyendo contraindicaciones médicas absolutas
 */
export function filterByMedicalSafety(
  exercises: ExerciseTemplate[],
  medicalConditions: string[]
): ExerciseTemplate[] {
  if (medicalConditions.length === 0) return exercises;

  return exercises.filter(ex => {
    if (!ex.safetyInfo?.contraindications) return true;

    const hasDanger = ex.safetyInfo.contraindications.some(c =>
      medicalConditions.some(mc => c.toLowerCase().includes(mc.toLowerCase()))
    );

    return !hasDanger;
  });
}

/**
 * Genera un micro-plan de 3 ejercicios: inicio (grounding), medio (trabajo), cierre (integración)
 */
export function generateMicroRoutine(
  recommendations: ExerciseRecommendation[]
): { grounding: ExerciseTemplate; work: ExerciseTemplate; closure: ExerciseTemplate } | null {
  if (recommendations.length < 3) return null;

  // Buscar ejercicio de grounding (intensidad 1-2, físico/respiración)
  const grounding = recommendations.find(r => 
    (r.exercise.category === 'Físico' || r.exercise.category === 'Respiración') &&
    r.exercise.intensity && r.exercise.intensity <= 2
  );

  // Buscar ejercicio de trabajo (intensidad 2-3, emocional/mental)
  const work = recommendations.find(r =>
    (r.exercise.category === 'Emocional' || r.exercise.category === 'Mental' || r.exercise.category === 'Terapéutico') &&
    r.exercise.intensity && r.exercise.intensity >= 2
  );

  // Buscar ejercicio de cierre (intensidad 1, meditación/contemplación)
  const closure = recommendations.find(r =>
    (r.exercise.category === 'Meditación' || r.exercise.category === 'Contemplación') &&
    r.exercise.intensity === 1
  );

  if (!grounding || !work || !closure) return null;

  return {
    grounding: grounding.exercise,
    work: work.exercise,
    closure: closure.exercise
  };
}

/**
 * Exporta recomendación en formato legible para usuario
 */
export function formatRecommendationForUser(rec: ExerciseRecommendation): string {
  let output = `\n📌 ${rec.exercise.title}\n`;
  output += `   Categoría: ${rec.exercise.category} | Duración: ${rec.exercise.duration} min\n`;
  output += `   Score: ${rec.score} puntos\n`;
  output += `   Razones:\n`;
  rec.reasons.forEach(r => {
    output += `      - ${r}\n`;
  });
  
  if (rec.warnings && rec.warnings.length > 0) {
    output += `   ⚠️ ADVERTENCIAS:\n`;
    rec.warnings.forEach(w => {
      output += `      ${w}\n`;
    });
  }

  if (rec.exercise.safetyInfo?.legalDisclaimer) {
    output += `   📋 ${rec.exercise.safetyInfo.legalDisclaimer}\n`;
  }

  return output;
}
