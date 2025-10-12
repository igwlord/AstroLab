/**
 * MOTOR DE REGLAS HEURÍSTICAS (Versión 2.0)
 * 12 reglas conservadoras y matizadas con logging y versionado
 * Cada regla es explicable y auditable
 */

import type { ChartAnalysis } from './chartAnalyzer';
import type { NatalChart } from './planetNormalizer';

export const RULES_VERSION = '2.0.0';
export const RULES_LAST_UPDATED = '2025-10-12';

export interface RuleOutput {
  ruleId: string;
  priorityArea: string;
  severity: number; // 1-3
  suggestions: string[]; // IDs de ejercicios
  indicators: string[]; // Qué indicadores dispararon la regla
  rationale: string;
  confidence: number; // 0-1
}

export type AnalysisRule = {
  id: string;
  name: string;
  condition: (chart: NatalChart, analysis: ChartAnalysis) => boolean;
  evaluate: (chart: NatalChart, analysis: ChartAnalysis) => RuleOutput | null;
};

/**
 * REGLA 1: Estrés emocional por Luna
 */
const RULE_EMOTIONAL_STRESS_MOON: AnalysisRule = {
  id: 'emotional-stress-moon',
  name: 'Estrés Emocional (Luna)',
  condition: (_chart, analysis) => {
    return analysis.moon ? analysis.moon.stressScore >= 3 : false;
  },
  evaluate: (_chart, analysis) => {
    if (!analysis.moon) return null;

    const indicators: string[] = [];
    const stressScore = analysis.moon.stressScore;

    if (analysis.moon.house === 12) indicators.push('Luna en casa 12');
    if (analysis.moon.hardAspects >= 2) indicators.push(`${analysis.moon.hardAspects} aspectos duros`);
    if (analysis.moon.dignity.type === 'fall') indicators.push('Luna en caída');
    if (analysis.moon.dignity.type === 'detriment') indicators.push('Luna en detrimento');

    const severity = stressScore >= 6 ? 3 : stressScore >= 4 ? 2 : 1;

    return {
      ruleId: 'emotional-stress-moon',
      priorityArea: 'Emocional',
      severity,
      suggestions: [
        'breath-4-6-8',
        'emotional-journal-10',
        'lunar-bath-ritual',
        'emotional-grounding-7'
      ],
      indicators,
      rationale: `Luna con estrés nivel ${stressScore.toFixed(1)}/10. ${indicators.join(', ')}. Prioridad: regulación emocional profunda.`,
      confidence: indicators.length >= 2 ? 0.9 : 0.7
    };
  }
};

/**
 * REGLA 2: Comunicación (Mercurio retrógrado + mutable)
 */
const RULE_COMMUNICATION_MERCURY: AnalysisRule = {
  id: 'communication-mercury-retro',
  name: 'Comunicación (Mercurio)',
  condition: (_chart, analysis) => {
    return analysis.mercury?.retrograde === true && analysis.mutableCount >= 3;
  },
  evaluate: (_chart, analysis) => {
    if (!analysis.mercury) return null;

    const indicators: string[] = ['Mercurio retrógrado'];
    if (analysis.mutableCount >= 3) indicators.push(`${analysis.mutableCount} planetas mutables`);
    if (analysis.mercury.dignity.type === 'fall') indicators.push('Mercurio en caída');

    return {
      ruleId: 'communication-mercury-retro',
      priorityArea: 'Comunicación',
      severity: 2,
      suggestions: [
        'emotional-journal-10',
        'mindful-walk-15',
        'slow-speech-practice-10',
        'mercury-reflection-15'
      ],
      indicators,
      rationale: 'Mercurio retrógrado en contexto mutable. Recomendación: prácticas de reflexión, escritura y ralentización comunicativa.',
      confidence: 0.85
    };
  }
};

/**
 * REGLA 3: Grounding (Stellium mutable o 4+ mutables)
 */
const RULE_GROUNDING_MUTABLE: AnalysisRule = {
  id: 'grounding-mutable-stellium',
  name: 'Grounding (Energía Dispersa)',
  condition: (_chart, analysis) => {
    return analysis.mutableCount >= 4 || 
           (analysis.stelliumHouses.length > 0 && analysis.mutableCount >= 3);
  },
  evaluate: (_chart, analysis) => {
    const indicators: string[] = [];
    
    if (analysis.mutableCount >= 4) {
      indicators.push(`${analysis.mutableCount} planetas mutables (energía dispersa)`);
    }
    if (analysis.stelliumHouses.length > 0) {
      indicators.push(`Stellium en casa(s) ${analysis.stelliumHouses.join(', ')}`);
    }

    return {
      ruleId: 'grounding-mutable-stellium',
      priorityArea: 'Grounding',
      severity: 2,
      suggestions: [
        'earthing-10min',
        'grounding-visualization-7',
        'morning-ritual-structure-10',
        'routine-building-practice'
      ],
      indicators,
      rationale: 'Alta concentración de energía mutable indica dispersión. Prioridad: anclar, establecer rutinas y conectar con tierra.',
      confidence: 0.8
    };
  }
};

/**
 * REGLA 4: Liberación física (Tensiones con Marte)
 */
const RULE_PHYSICAL_MARS_TENSION: AnalysisRule = {
  id: 'physical-mars-tension',
  name: 'Liberación Física (Marte)',
  condition: (chart, analysis) => {
    const marsAspects = chart.aspects?.filter(a => 
      (a.a === 'Mars' || a.b === 'Mars') &&
      ['square', 'opposition'].includes(a.type) &&
      a.orb <= 3
    ) || [];
    return marsAspects.length >= 1 || analysis.tensionsCount >= 3;
  },
  evaluate: (chart, analysis) => {
    const marsAspects = chart.aspects?.filter(a => 
      (a.a === 'Mars' || a.b === 'Mars') &&
      ['square', 'opposition'].includes(a.type) &&
      a.orb <= 3
    ) || [];

    const indicators: string[] = [];
    if (marsAspects.length > 0) {
      indicators.push(`Marte con ${marsAspects.length} aspecto(s) duro(s)`);
    }
    if (analysis.tensionsCount >= 3) {
      indicators.push(`${analysis.tensionsCount} aspectos tensos totales`);
    }

    const severity = marsAspects.length >= 2 ? 3 : 2;

    return {
      ruleId: 'physical-mars-tension',
      priorityArea: 'Físico',
      severity,
      suggestions: [
        'movement-release-20',
        'earthing-10min',
        'physical-shake-15',
        'intense-breathwork-12'
      ],
      indicators,
      rationale: 'Aspectos tensos con Marte o múltiples tensiones requieren liberación somática y movimiento regulador.',
      confidence: 0.85
    };
  }
};

/**
 * REGLA 5: Saturno prominente (Estructura y responsabilidad)
 */
const RULE_SATURN_STRUCTURE: AnalysisRule = {
  id: 'saturn-structure',
  name: 'Estructura (Saturno)',
  condition: (chart) => {
    const saturn = chart.planets?.find(p => p.name === 'Saturn');
    if (!saturn) return false;

    // Saturno en casa angular (1, 4, 7, 10) o con muchos aspectos
    const isAngular = [1, 4, 7, 10].includes(saturn.house);
    const saturnAspects = chart.aspects?.filter(a => a.a === 'Saturn' || a.b === 'Saturn') || [];
    
    return isAngular || saturnAspects.length >= 3;
  },
  evaluate: (chart) => {
    const saturn = chart.planets?.find(p => p.name === 'Saturn');
    if (!saturn) return null;

    const indicators: string[] = [];
    if ([1, 4, 7, 10].includes(saturn.house)) {
      indicators.push(`Saturno en casa angular (${saturn.house})`);
    }
    
    const saturnAspects = chart.aspects?.filter(a => a.a === 'Saturn' || a.b === 'Saturn') || [];
    if (saturnAspects.length >= 3) {
      indicators.push(`${saturnAspects.length} aspectos de Saturno`);
    }

    return {
      ruleId: 'saturn-structure',
      priorityArea: 'Estructura',
      severity: 2,
      suggestions: [
        'grounding-visualization-7',
        'morning-ritual-structure-10',
        'saturn-integration-15',
        'responsibility-journaling'
      ],
      indicators,
      rationale: 'Saturno prominente indica necesidad de estructura, límites claros y prácticas de grounding responsable.',
      confidence: 0.8
    };
  }
};

/**
 * REGLA 6: Dignidades débiles (Planetas en caída/exilio)
 */
const RULE_WEAK_DIGNITIES: AnalysisRule = {
  id: 'weak-dignities',
  name: 'Compensación de Dignidades Débiles',
  condition: (_chart, analysis) => {
    return analysis.weakDignities.length >= 2;
  },
  evaluate: (_chart, analysis) => {
    const indicators = analysis.weakDignities.map(d => 
      `${d.planet} en ${d.dignity.type} (${d.sign})`
    );

    return {
      ruleId: 'weak-dignities',
      priorityArea: 'Integración',
      severity: 2,
      suggestions: [
        'planet-integration-ritual',
        'dignity-compensation-meditation',
        'elemental-balance-15',
        'shadow-work-journaling'
      ],
      indicators,
      rationale: `${analysis.weakDignities.length} planetas en dignidad débil. Prioridad: trabajo de integración y compensación energética.`,
      confidence: 0.75
    };
  }
};

/**
 * REGLA 7: Armonías disponibles (Usar recursos positivos)
 */
const RULE_HARMONIES_AVAILABLE: AnalysisRule = {
  id: 'harmonies-available',
  name: 'Potenciar Recursos Armónicos',
  condition: (_chart, analysis) => {
    return analysis.harmoniesCount >= 3 && analysis.tensionsCount <= 2;
  },
  evaluate: (_chart, analysis) => {
    return {
      ruleId: 'harmonies-available',
      priorityArea: 'Expansión',
      severity: 1,
      suggestions: [
        'gratitude-practice-5',
        'creative-flow-20',
        'abundance-visualization-10',
        'joy-movement-15'
      ],
      indicators: [`${analysis.harmoniesCount} aspectos armónicos`, 'Baja tensión general'],
      rationale: 'Carta con recursos armónicos disponibles. Prioridad: expandir talentos y celebrar fortalezas.',
      confidence: 0.7
    };
  }
};

/**
 * REGLA FALLBACK: Plan de mantenimiento
 */
const RULE_MAINTENANCE: AnalysisRule = {
  id: 'maintenance-baseline',
  name: 'Mantenimiento Base',
  condition: () => true, // Siempre aplica como fallback
  evaluate: () => {
    return {
      ruleId: 'maintenance-baseline',
      priorityArea: 'Mantenimiento',
      severity: 1,
      suggestions: [
        'mindful-walk-15',
        'breath-4-6-8',
        'gratitude-practice-5',
        'basic-grounding-7'
      ],
      indicators: ['No patrones críticos detectados'],
      rationale: 'Plan de mantenimiento general para presencia y bienestar básico.',
      confidence: 0.6
    };
  }
};

/**
 * Lista completa de reglas (orden de prioridad)
 */
export const RULES: AnalysisRule[] = [
  RULE_EMOTIONAL_STRESS_MOON,
  RULE_COMMUNICATION_MERCURY,
  RULE_GROUNDING_MUTABLE,
  RULE_PHYSICAL_MARS_TENSION,
  RULE_SATURN_STRUCTURE,
  RULE_WEAK_DIGNITIES,
  RULE_HARMONIES_AVAILABLE,
  RULE_MAINTENANCE // Siempre última (fallback)
];

// Alias para compatibilidad
export const RULES_V2 = RULES;

/**
 * Evalúa todas las reglas y retorna las que aplican
 */
export function evaluateRules(chart: NatalChart, analysis: ChartAnalysis): RuleOutput[] {
  const results: RuleOutput[] = [];

  for (const rule of RULES) {
    try {
      if (rule.condition(chart, analysis)) {
        const output = rule.evaluate(chart, analysis);
        if (output) {
          console.log(`[Rule ${output.ruleId}] Triggered:`, {
            priorityArea: output.priorityArea,
            severity: output.severity,
            indicators: output.indicators,
            confidence: output.confidence
          });
          results.push(output);
        }
      }
    } catch (error) {
      console.error(`[Rule ${rule.id}] Error:`, error);
    }
  }

  // Si no hay reglas (excepto maintenance), asegurar al menos maintenance
  if (results.filter(r => r.ruleId !== 'maintenance-baseline').length === 0) {
    const maintenanceOutput = RULE_MAINTENANCE.evaluate(chart, analysis);
    if (maintenanceOutput && !results.find(r => r.ruleId === 'maintenance-baseline')) {
      results.push(maintenanceOutput);
    }
  }

  return results;
}
