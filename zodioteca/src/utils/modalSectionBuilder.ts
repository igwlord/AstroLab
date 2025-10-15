/**
 * BUILDER DE SECCIONES DE MODAL
 * Convierte datos astrológicos al formato del ChartItemModal
 */

import type { ModalSection, StepItem, CardItem } from '../components/ChartItemModal';
import {
  getLilithRepressionSigns,
  getChironHealingPath,
  getLilithIntegrationWork,
  getNodeSouthPatterns
} from './interpretationHelpers';

// ============================================
// LILITH
// ============================================

export function buildLilithSections(
  sign: string,
  house: number,
  repression: string,
  power: string
): ModalSection[] {
  const signs = getLilithRepressionSigns();
  const integration = getLilithIntegrationWork(sign, house);

  // Extraer señales sin números y con iconos específicos
  const signIcons = ['😤', '💔', '🙈', '🚧', '😒', '💣', '⚖️', '🎭'];
  const cleanedSigns: CardItem[] = signs.map((s, i) => ({
    text: s.replace(/^\d+\.\s*/, ''),
    icon: signIcons[i]
  }));

  // Parsear pasos de integración
  const integrationSteps: StepItem[] = [];
  const sections = integration.split('**').filter(Boolean);
  
  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].split(':')[0].trim();
    const content = sections[i].split(':').slice(1).join(':').trim();
    
    const stepIcons = ['👁️', '💢', '✨', '🛡️', '🎉'];
    const stepColors = ['blue', 'orange', 'purple', 'green', 'yellow'];
    const stepIndex = Math.floor((i - 1) / 2);
    
    if (stepIndex < 5) {
      integrationSteps.push({
        title,
        content,
        icon: stepIcons[stepIndex],
        color: stepColors[stepIndex]
      });
    }
  }

  return [
    {
      id: 'represion',
      title: `El Poder Reprimido (Lilith en ${sign})`,
      icon: '🌑',
      content: {
        type: 'dual-cards',
        cards: [
          {
            title: 'La Represión',
            content: repression,
            icon: '⛓️',
            color: 'gray'
          },
          {
            title: 'El Poder Reclamado',
            content: power,
            icon: '👑',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'senales',
      title: 'Señales de Represión',
      icon: '🚨',
      content: {
        type: 'card-grid',
        items: cleanedSigns
      }
    },
    {
      id: 'liberacion',
      title: 'Camino de Liberación',
      icon: '🔥',
      content: {
        type: 'steps',
        steps: integrationSteps
      }
    }
  ];
}

// ============================================
// QUIRÓN
// ============================================

export function buildChironSections(
  sign: string,
  house: number,
  wound: string,
  gift: string
): ModalSection[] {
  const healing = getChironHealingPath(sign, house);
  
  // Parsear los 5 pasos de sanación
  const healingSteps: StepItem[] = [];
  const stepMatches = healing.match(/\d+\.\s\*\*(.*?)\*\*:\s*(.*?)(?=\n\n|\n\d+\.|\nEl proceso|$)/gs);
  
  if (stepMatches) {
    const stepIcons = ['👁️', '⛔', '🤝', '💫', '🌟'];
    const stepColors = ['blue', 'orange', 'green', 'purple', 'yellow'];
    
    stepMatches.forEach((match, i) => {
      const titleMatch = match.match(/\*\*(.*?)\*\*/);
      const contentMatch = match.match(/\*\*:[\s]*(.*)/s);
      
      if (titleMatch && contentMatch && i < 5) {
        healingSteps.push({
          title: `${i + 1}. ${titleMatch[1]}`,
          content: contentMatch[1].trim(),
          icon: stepIcons[i],
          color: stepColors[i]
        });
      }
    });
  }

  return [
    {
      id: 'herida',
      title: `La Herida (Quirón en ${sign})`,
      icon: '🩹',
      content: {
        type: 'text',
        text: wound,
        emoji: '💔'
      }
    },
    {
      id: 'don',
      title: 'El Don del Sanador',
      icon: '✨',
      content: {
        type: 'text',
        text: gift,
        emoji: '🎁'
      }
    },
    {
      id: 'sanacion',
      title: 'Camino de Sanación',
      icon: '🌱',
      content: {
        type: 'steps',
        steps: healingSteps
      }
    }
  ];
}

// ============================================
// NODOS LUNARES
// ============================================

export function buildNodesSections(
  northSign: string,
  southSign: string,
  _northHouse: number,
  _southHouse: number,
  northExplanation: string,
  southTrap: string,
  integration: string
): ModalSection[] {
  const southPatterns = getNodeSouthPatterns(southSign);
  
  // Convertir patrones a cards
  const patternCards: CardItem[] = southPatterns.map(p => ({
    text: p,
    icon: undefined // Se asignarán automáticamente
  }));

  return [
    {
      id: 'proposito',
      title: `Propósito de Vida (Nodo Norte en ${northSign})`,
      icon: '🎯',
      content: {
        type: 'text',
        text: northExplanation,
        emoji: '✨'
      }
    },
    {
      id: 'nodo-sur',
      title: `Patrón Kármico (Nodo Sur en ${southSign})`,
      icon: '🔄',
      content: {
        type: 'dual-cards',
        cards: [
          {
            title: 'La Trampa del Pasado',
            content: southTrap,
            icon: '⚠️',
            color: 'orange'
          },
          {
            title: 'Patrones a Integrar',
            content: '', // Los patrones se mostrarán en grid aparte
            icon: '🔁',
            color: 'amber'
          }
        ]
      }
    },
    {
      id: 'patrones',
      title: 'Patrones a Integrar',
      icon: '⚠️',
      content: {
        type: 'card-grid',
        items: patternCards
      }
    },
    {
      id: 'integracion',
      title: 'Camino de Integración',
      icon: '⚖️',
      content: {
        type: 'text',
        text: integration,
        emoji: '🌉'
      }
    }
  ];
}

// ============================================
// LUNA
// ============================================

export function buildMoonSections(
  sign: string,
  house: number,
  stressScore: number,
  stressExplanation: string,
  stressFactors: string[],
  hardAspects: number,
  softAspects: number,
  dignity?: string
): ModalSection[] {
  // Convertir factores de estrés a cards
  const factorCards: CardItem[] = stressFactors.map(f => ({
    text: f,
    icon: undefined // Se asignarán automáticamente
  }));

  return [
    {
      id: 'config',
      title: 'Configuración Lunar',
      icon: '🌙',
      content: {
        type: 'text',
        text: `Tu Luna está en ${sign} en la Casa ${house}. ${dignity || ''}`,
        emoji: '🌜'
      }
    },
    {
      id: 'necesidades',
      title: 'Necesidades Emocionales',
      icon: '💝',
      content: {
        type: 'text',
        text: `Con Luna en ${sign}, buscas seguridad y estabilidad emocional. Para sentirte en paz, necesitas ambientes predecibles y relaciones de confianza.`,
        emoji: '🫂'
      }
    },
    {
      id: 'estres',
      title: `Nivel de Estrés: ${stressScore}/10`,
      icon: '⚠️',
      content: {
        type: 'dual-cards',
        cards: [
          {
            title: 'Evaluación',
            content: stressExplanation,
            icon: stressScore >= 7 ? '😰' : stressScore >= 4 ? '😟' : '😌',
            color: stressScore >= 7 ? 'red' : stressScore >= 4 ? 'yellow' : 'green'
          },
          {
            title: 'Factores',
            content: `${stressFactors.length} factores identificados`,
            icon: '🔍',
            color: 'orange'
          }
        ]
      }
    },
    ...(stressFactors.length > 0 ? [{
      id: 'factores',
      title: 'Factores de Estrés',
      icon: '🔍',
      content: {
        type: 'card-grid',
        items: factorCards
      } as const
    }] : []),
    {
      id: 'aspectos',
      title: 'Aspectos Lunares',
      icon: '🔗',
      content: {
        type: 'stats',
        stats: [
          { label: 'Aspectos difíciles', value: hardAspects, color: 'red' },
          { label: 'Aspectos armónicos', value: softAspects, color: 'green' }
        ]
      }
    }
  ];
}

// ============================================
// MERCURIO
// ============================================

export function buildMercurySections(
  _sign: string,
  _house: number,
  communication: string,
  learning: string,
  mentalProcesses: string,
  retrograde: boolean,
  retroText?: string
): ModalSection[] {
  const sections: ModalSection[] = [
    {
      id: 'comunicacion',
      title: 'Estilo de Comunicación',
      icon: '💬',
      content: {
        type: 'text',
        text: communication,
        emoji: '🗣️'
      }
    },
    {
      id: 'aprendizaje',
      title: 'Estilo de Aprendizaje',
      icon: '📚',
      content: {
        type: 'text',
        text: learning,
        emoji: '📖'
      }
    },
    {
      id: 'mental',
      title: 'Procesos Mentales',
      icon: '🧠',
      content: {
        type: 'text',
        text: mentalProcesses,
        emoji: '💭'
      }
    }
  ];

  if (retrograde && retroText) {
    sections.push({
      id: 'retrogrado',
      title: 'Mercurio Retrógrado',
      icon: '⏪',
      content: {
        type: 'text',
        text: retroText,
        emoji: '🔄'
      }
    });
  }

  return sections;
}
