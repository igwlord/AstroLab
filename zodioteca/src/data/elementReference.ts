/**
 * 🌟 REFERENCIA DE ELEMENTOS ASTROLÓGICOS
 * 
 * Información completa sobre los 4 elementos y su expresión en los signos zodiacales.
 * Útil para interpretaciones, textos generados y validación de cálculos.
 */

export interface ElementInfo {
  element: 'fuego' | 'tierra' | 'aire' | 'agua';
  emoji: string;
  title: string;
  description: string;
  keywords: string[];
  shadow: string[];
  signs: SignDetail[];
}

export interface SignDetail {
  name: string;
  modality: 'cardinal' | 'fijo' | 'mutable';
  symbol: string;
  action: string;
}

export const ELEMENT_REFERENCE: Record<string, ElementInfo> = {
  fuego: {
    element: 'fuego',
    emoji: '🔥',
    title: 'FUEGO — Acción, impulso, inspiración',
    description: 'El fuego representa la energía vital, el entusiasmo y la capacidad de iniciar. Es el elemento de la voluntad, la creatividad y la expresión del yo.',
    keywords: ['entusiasmo', 'energía vital', 'coraje', 'espontaneidad', 'acción', 'creatividad', 'pasión'],
    shadow: ['impulsividad', 'egocentrismo', 'dramatismo', 'impaciencia'],
    signs: [
      {
        name: 'Aries',
        modality: 'cardinal',
        symbol: '♈',
        action: 'inicia, se lanza, prende la chispa'
      },
      {
        name: 'Leo',
        modality: 'fijo',
        symbol: '♌',
        action: 'sostiene el fuego, da luz y crea'
      },
      {
        name: 'Sagitario',
        modality: 'mutable',
        symbol: '♐',
        action: 'expande el fuego, lo vuelve visión y propósito'
      }
    ]
  },

  aire: {
    element: 'aire',
    emoji: '💨',
    title: 'AIRE — Ideas, comunicación, movimiento',
    description: 'El aire representa el pensamiento, la conexión social y el intercambio de ideas. Es el elemento del intelecto, la comunicación y la perspectiva.',
    keywords: ['intelecto', 'conexión', 'sociabilidad', 'análisis', 'comunicación', 'ideas', 'relaciones'],
    shadow: ['dispersión', 'frialdad', 'exceso mental', 'superficialidad'],
    signs: [
      {
        name: 'Géminis',
        modality: 'mutable',
        symbol: '♊',
        action: 'conecta, aprende, comunica'
      },
      {
        name: 'Libra',
        modality: 'cardinal',
        symbol: '♎',
        action: 'busca equilibrio, relación, diplomacia'
      },
      {
        name: 'Acuario',
        modality: 'fijo',
        symbol: '♒',
        action: 'piensa en sistemas, innovación, ideales colectivos'
      }
    ]
  },

  agua: {
    element: 'agua',
    emoji: '💧',
    title: 'AGUA — Emoción, intuición, empatía',
    description: 'El agua representa el mundo emocional, la intuición y la conexión profunda. Es el elemento de la sensibilidad, la empatía y la transformación interior.',
    keywords: ['sensibilidad', 'empatía', 'imaginación', 'conexión emocional', 'intuición', 'profundidad'],
    shadow: ['apego', 'confusión', 'exceso de emocionalidad', 'melodrama'],
    signs: [
      {
        name: 'Cáncer',
        modality: 'cardinal',
        symbol: '♋',
        action: 'protege, nutre, crea hogar'
      },
      {
        name: 'Escorpio',
        modality: 'fijo',
        symbol: '♏',
        action: 'transforma, profundiza, sana'
      },
      {
        name: 'Piscis',
        modality: 'mutable',
        symbol: '♓',
        action: 'disuelve, comprende, conecta espiritualmente'
      }
    ]
  },

  tierra: {
    element: 'tierra',
    emoji: '🌍',
    title: 'TIERRA — Realización, estabilidad, concreción',
    description: 'La tierra representa la manifestación material, la estabilidad y el sentido práctico. Es el elemento de la estructura, la disciplina y la concreción.',
    keywords: ['estructura', 'disciplina', 'sentido práctico', 'perseverancia', 'manifestación', 'estabilidad'],
    shadow: ['rigidez', 'materialismo', 'exceso de control', 'lentitud'],
    signs: [
      {
        name: 'Tauro',
        modality: 'fijo',
        symbol: '♉',
        action: 'materializa, disfruta, sostiene'
      },
      {
        name: 'Virgo',
        modality: 'mutable',
        symbol: '♍',
        action: 'analiza, organiza, mejora'
      },
      {
        name: 'Capricornio',
        modality: 'cardinal',
        symbol: '♑',
        action: 'construye, lidera, logra metas'
      }
    ]
  }
};

/**
 * Mapeo signo → elemento (para validación y cálculos)
 */
export const SIGN_TO_ELEMENT: Record<string, 'fuego' | 'tierra' | 'aire' | 'agua'> = {
  // Fuego
  'Aries': 'fuego',
  'Leo': 'fuego',
  'Sagitario': 'fuego',
  
  // Tierra
  'Tauro': 'tierra',
  'Virgo': 'tierra',
  'Capricornio': 'tierra',
  
  // Aire
  'Géminis': 'aire',
  'Libra': 'aire',
  'Acuario': 'aire',
  
  // Agua
  'Cáncer': 'agua',
  'Escorpio': 'agua',
  'Piscis': 'agua',
};

/**
 * Obtener información completa de un elemento
 */
export function getElementInfo(element: 'fuego' | 'tierra' | 'aire' | 'agua'): ElementInfo {
  return ELEMENT_REFERENCE[element];
}

/**
 * Obtener elemento de un signo
 */
export function getElementFromSign(sign: string): 'fuego' | 'tierra' | 'aire' | 'agua' | null {
  return SIGN_TO_ELEMENT[sign] || null;
}

/**
 * Validar si un signo pertenece a un elemento
 */
export function signBelongsToElement(sign: string, element: 'fuego' | 'tierra' | 'aire' | 'agua'): boolean {
  return SIGN_TO_ELEMENT[sign] === element;
}

/**
 * Obtener todos los signos de un elemento
 */
export function getSignsByElement(element: 'fuego' | 'tierra' | 'aire' | 'agua'): string[] {
  return ELEMENT_REFERENCE[element].signs.map(s => s.name);
}

/**
 * Obtener descripción interpretativa de combinación de elementos dominantes
 */
export function getElementCombinationText(
  dominant: 'fuego' | 'tierra' | 'aire' | 'agua',
  secondary?: 'fuego' | 'tierra' | 'aire' | 'agua'
): string {
  const combinations: Record<string, string> = {
    // Fuego dominante
    'fuego-aire': 'La energía fuego y aire activan el movimiento y la acción, invitando a equilibrar el impulso con conciencia',
    'fuego-tierra': 'El fuego se ancla en la tierra, combinando visión con realización práctica',
    'fuego-agua': 'La pasión del fuego se encuentra con la profundidad emocional del agua',
    'fuego': 'La energía del fuego domina el cielo, llamando a la acción y la creatividad',
    
    // Aire dominante
    'aire-fuego': 'El aire aviva el fuego, creando un clima de ideas inspiradas y acción comunicativa',
    'aire-tierra': 'El pensamiento aéreo se materializa con la estructura de la tierra',
    'aire-agua': 'Las ideas se tiñen de sensibilidad, conectando mente y corazón',
    'aire': 'La energía del aire prevalece, favoreciendo el diálogo y el intercambio de perspectivas',
    
    // Tierra dominante
    'tierra-fuego': 'La tierra canaliza el fuego creativo hacia resultados concretos',
    'tierra-aire': 'La estructura terrestre organiza las ideas del aire',
    'tierra-agua': 'La tierra contiene el agua emocional, nutriendo con estabilidad',
    'tierra': 'La energía de la tierra domina, invitando a construir y manifestar',
    
    // Agua dominante
    'agua-fuego': 'El agua templa el fuego, integrando emoción con voluntad',
    'agua-aire': 'La sensibilidad acuática fluye con las ideas del aire',
    'agua-tierra': 'El agua nutre la tierra, creando condiciones para el crecimiento profundo',
    'agua': 'La energía agua domina el cielo, llamando a la introspección y la empatía'
  };
  
  const key = secondary ? `${dominant}-${secondary}` : dominant;
  return combinations[key] || combinations[dominant] || '';
}
