// Tipos para el glosario
export interface GlossaryEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  dates?: string; // Para signos zodiacales
  element?: string;
  modality?: string;
  ruler?: string;
  symbol?: string;
  keyEnergy?: string;
  characteristics?: {
    strengths?: string[];
    challenges?: string[];
  };
  compatibility?: {
    harmonizes?: string[];
    learns?: string[];
    integrates?: string[];
  };
  practice?: {
    description?: string;
    chakra?: string;
    frequency?: string;
    duration?: string;
  };
  searchTerms: string[];
}

export interface GlossaryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    id: 'signs',
    name: 'Signos',
    icon: '♈',
    description: 'Los 12 signos del zodíaco',
    color: 'orange'
  },
  {
    id: 'planets',
    name: 'Planetas',
    icon: '🪐',
    description: 'Planetas personales, sociales y transpersonales',
    color: 'green'
  },
  {
    id: 'asteroids',
    name: 'Asteroides',
    icon: '☄️',
    description: 'Asteroides y cuerpos menores',
    color: 'pink'
  },
  {
    id: 'houses',
    name: 'Casas',
    icon: '🏠',
    description: 'Las 12 casas astrológicas',
    color: 'indigo'
  },
  {
    id: 'aspects',
    name: 'Aspectos',
    icon: '📐',
    description: 'Ángulos entre planetas',
    color: 'yellow'
  },
  {
    id: 'celestial',
    name: 'Otros Cuerpos',
    icon: '🌌',
    description: 'Quirón, centauros, transneptunianos',
    color: 'violet'
  },
  {
    id: 'advanced',
    name: 'Dimensiones Astrológicas',
    icon: '🌠',
    description: 'Técnicas avanzadas y dimensiones del alma',
    color: 'purple'
  },
  {
    id: 'configurations',
    name: 'Configuraciones',
    icon: '⚡',
    description: 'Configuraciones planetarias',
    color: 'amber'
  },
  {
    id: 'dignities',
    name: 'Dignidades',
    icon: '👑',
    description: 'Dignidades y condiciones planetarias',
    color: 'gold'
  },
  {
    id: 'lunar',
    name: 'Lunas',
    icon: '🌙',
    description: 'Luna en cada signo del zodiaco',
    color: 'slate'
  },
  {
    id: 'ascendants',
    name: 'Ascendentes',
    icon: '🌅',
    description: 'Ascendente en cada signo del zodiaco',
    color: 'orange'
  },
  {
    id: 'relational',
    name: 'Relacional',
    icon: '💞',
    description: 'Astrología relacional',
    color: 'rose'
  },
  {
    id: 'polarizations',
    name: 'Polarizaciones',
    icon: '⚖️',
    description: 'Desequilibrios energéticos planetarios',
    color: 'indigo'
  }
];

// Función para categorizar automáticamente las entradas
export const categorizeEntry = (title: string, content: string): string => {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  // 1. FUNDAMENTOS BÁSICOS
  const basics = ['carta natal', 'eclíptica', 'elementos', 'modalidades', 'ascendente', 'medio cielo', 'asc', 'mc'];
  if (basics.some(term => titleLower.includes(term))) {
    return 'basics';
  }

  // 2. SIGNOS ZODIACALES
  const signs = ['aries', 'tauro', 'géminis', 'cáncer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'];
  const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  if (signs.some(sign => titleLower === sign) || signSymbols.some(symbol => title.includes(symbol))) {
    return 'signs';
  }

  // 3. PLANETAS
  const planetNames = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'júpiter', 'saturno', 'urano', 'neptuno', 'plutón'];
  const planetSymbols = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'];
  if (planetNames.includes(titleLower) || planetSymbols.some(symbol => title.includes(symbol))) {
    return 'planets';
  }

  // 4. PUNTOS MATEMÁTICOS
  const points = ['nodo norte', 'nodo sur', 'lilith', 'luna negra', 'parte de la fortuna', 'vertex'];
  if (points.some(point => titleLower.includes(point))) {
    return 'points';
  }

  // 5. ASTEROIDES
  const asteroids = ['ceres', 'pallas', 'juno', 'vesta', 'hygiea', 'eros', 'psyche'];
  if (asteroids.some(asteroid => titleLower.includes(asteroid))) {
    return 'asteroids';
  }

  // 6. CASAS
  if (titleLower.includes('casa') && !titleLower.includes('natal')) {
    return 'houses';
  }

  // 7. ASPECTOS
  const aspects = ['trígono', 'cuadratura', 'oposición', 'sextil', 'conjunción', 'quincuncio', 'quintil', 'biquintil', 'semisextil', 'semicuadratura'];
  if (aspects.some(aspect => titleLower.includes(aspect))) {
    return 'aspects';
  }

  // 8. TÉCNICAS DE EVOLUCIÓN Y PREDICCIÓN
  const techniques = ['tránsito', 'progresión', 'revolución', 'retorno', 'dirección'];
  if (techniques.some(tech => titleLower.includes(tech))) {
    return 'techniques';
  }

  // 9. OTROS CUERPOS CELESTES
  const celestial = ['quirón', 'centauro', 'pholus', 'nessus', 'eris', 'sedna', 'haumea', 'cometa'];
  if (celestial.some(body => titleLower.includes(body))) {
    return 'celestial';
  }

  // 10. POLARIZACIONES
  const polarizations = ['polarización', 'polarizado', 'desequilibrio'];
  if (polarizations.some(term => titleLower.includes(term))) {
    return 'polarizations';
  }

  // 11. TERMINOLOGÍA AVANZADA
  const advancedTerms = ['dracónica', 'horaria', 'electiva', 'astrocartografía', 'sinastría', 'compuesta', 'davison'];
  if (advancedTerms.some(term => titleLower.includes(term))) {
    return 'advanced';
  }

  // 12. CONFIGURACIONES PLANETARIAS
  const configurations = ['stellium', 'gran trígono', 't-cuadrada', 'cruz cósmica', 'yod', 'cometa', 'kite'];
  if (configurations.some(config => titleLower.includes(config))) {
    return 'configurations';
  }

  // 13. DIGNIDADES Y CONDICIONES PLANETARIAS
  const dignities = ['domicilio', 'exaltación', 'exilio', 'caída', 'recepción mutua', 'triplicidad', 'decanato', 'término', 'face'];
  if (dignities.some(dig => titleLower.includes(dig))) {
    return 'dignities';
  }

  // 14. TÉCNICAS DE INTERPRETACIÓN
  const interpretation = ['orbe', 'aplicativo', 'separativo', 'secta', 'almuten', 'regente', 'partes arábigas', 'atacir'];
  if (interpretation.some(tech => titleLower.includes(tech))) {
    return 'interpretation';
  }

  // 15. FENÓMENOS LUNARES Y CÍCLICOS
  const lunar = ['luna nueva', 'luna llena', 'eclipse', 'lunar return', 'luna progresada', 'creciente', 'menguante'];
  if (lunar.some(phenomenon => titleLower.includes(phenomenon) || contentLower.includes(phenomenon))) {
    return 'lunar';
  }

  // 16. ASTROLOGÍA RELACIONAL
  if (contentLower.includes('relación') || contentLower.includes('pareja') || contentLower.includes('compatibilidad')) {
    return 'relational';
  }

  // 17. ASTROLOGÍA PREDICTIVA
  if (contentLower.includes('predicción') || contentLower.includes('futuro') || contentLower.includes('ciclo planetario')) {
    return 'predictive';
  }

  // 18. CONCEPTOS DE LECTURA PRÁCTICA
  const practical = ['retrógrado', 'interceptado', 'casa vacía', 'angular', 'cadente', 'sucedente'];
  if (practical.some(concept => titleLower.includes(concept))) {
    return 'practical';
  }

  // Por defecto, avanzado
  return 'advanced';
};

export default {
  GLOSSARY_CATEGORIES,
  categorizeEntry
};