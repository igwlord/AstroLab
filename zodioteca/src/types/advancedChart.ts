/**
 * 🌟 TIPOS PARA CÁLCULOS AVANZADOS
 * Asteroides y puntos especiales de la carta natal
 * 
 * IMPORTANTE: Este archivo NO modifica los tipos existentes
 * Se usa para datos adicionales de configuración avanzada
 */

/**
 * Datos de un asteroide calculado
 */
export interface AsteroidData {
  /** Nombre del asteroide */
  name: string;
  
  /** Símbolo astrológico */
  symbol: string;
  
  /** ID de Swiss Ephemeris */
  swissephId: number;
  
  /** Longitud eclíptica (0-360°) */
  longitude: number;
  
  /** Signo zodiacal */
  sign: string;
  
  /** Grados dentro del signo (0-30°) */
  degree: number;
  
  /** Casa astrológica (1-12) */
  house: number;
  
  /** ¿Está retrógrado? */
  retrograde: boolean;
  
  /** Velocidad diaria en grados */
  speed?: number;
  
  /** Significado breve */
  meaning?: string;
  
  /** Categoría del asteroide */
  category: 'main-asteroid' | 'centaur' | 'other';
}

/**
 * Datos de un punto especial calculado
 */
export interface AdvancedPoint {
  /** Nombre del punto */
  name: string;
  
  /** Símbolo astrológico */
  symbol: string;
  
  /** Tipo de punto */
  type: 'angle' | 'arabic-part' | 'calculated-point';
  
  /** Longitud eclíptica (0-360°) */
  longitude: number;
  
  /** Signo zodiacal */
  sign: string;
  
  /** Grados dentro del signo (0-30°) */
  degree: number;
  
  /** Casa astrológica (1-12) */
  house: number;
  
  /** Significado breve */
  meaning?: string;
  
  /** Fórmula de cálculo (para puntos árabes) */
  formula?: string;
}

/**
 * Datos completos de cálculos avanzados
 */
export interface AdvancedChartData {
  /** Asteroides principales: Ceres, Pallas, Juno, Vesta */
  asteroids: AsteroidData[];
  
  /** Quirón (centauro) */
  chiron?: AsteroidData;
  
  /** Puntos especiales calculados */
  specialPoints: {
    /** Medio Cielo (MC) */
    midheaven?: AdvancedPoint;
    
    /** Immum Coeli (IC) - fondo del cielo */
    imumCoeli?: AdvancedPoint;
    
    /** Parte de la Fortuna */
    partOfFortune?: AdvancedPoint;
    
    /** Nodo Norte (☊) */
    northNode?: AdvancedPoint;
    
    /** Nodo Sur (☋) */
    southNode?: AdvancedPoint;
    
    /** Vértex */
    vertex?: AdvancedPoint;
    
    /** Anti-Vértex */
    antiVertex?: AdvancedPoint;
  };
  
  /** Timestamp del cálculo */
  calculatedAt: string;
  
  /** Versión del algoritmo de cálculo */
  version: string;
}

/**
 * Parámetros para calcular datos avanzados
 */
export interface AdvancedCalculationParams {
  /** Día juliano */
  julianDay: number;
  
  /** Latitud geográfica */
  latitude: number;
  
  /** Longitud geográfica */
  longitude: number;
  
  /** Hora sidérea local */
  siderealTime?: number;
  
  /** Sistema de casas usado */
  houseSystem?: string;
  
  /** Cúspides de las casas */
  houseCusps?: number[];
  
  /** Longitud del Ascendente */
  ascendantLongitude?: number;
  
  /** Longitud del Sol */
  sunLongitude?: number;
  
  /** Longitud de la Luna */
  moonLongitude?: number;
}

/**
 * Configuración de qué elementos calcular
 */
export interface AdvancedCalculationOptions {
  /** ¿Calcular asteroides principales? */
  calculateAsteroids: boolean;
  
  /** ¿Calcular Quirón? */
  calculateChiron: boolean;
  
  /** ¿Calcular Medio Cielo? */
  calculateMidheaven: boolean;
  
  /** ¿Calcular Parte de la Fortuna? */
  calculatePartOfFortune: boolean;
  
  /** ¿Calcular Nodos Lunares? */
  calculateNodes: boolean;
  
  /** ¿Calcular Vértex? */
  calculateVertex: boolean;
}

/**
 * Códigos de Swiss Ephemeris para cuerpos celestes
 */
export const SWISSEPH_CODES = {
  // Asteroides principales
  CERES: 1,
  PALLAS: 2,
  JUNO: 3,
  VESTA: 4,
  
  // Nodos Lunares
  MEAN_NODE: 10,      // Nodo Lunar Medio
  TRUE_NODE: 11,      // Nodo Lunar Verdadero (más preciso)
  
  // Centauros
  CHIRON: 15,
  
  // Otros
  LILITH_MEAN: 12,
  LILITH_TRUE: 13,
} as const;

/**
 * Nombres y símbolos de asteroides
 */
export const ASTEROID_INFO = {
  CERES: {
    name: 'Ceres',
    symbol: '⚳',
    meaning: 'Nutrición, maternidad, agricultura, ciclos de vida',
  },
  PALLAS: {
    name: 'Pallas',
    symbol: '⚴',
    meaning: 'Sabiduría, estrategia, justicia, patrones mentales',
  },
  JUNO: {
    name: 'Juno',
    symbol: '⚵',
    meaning: 'Compromiso, matrimonio, asociaciones, lealtad',
  },
  VESTA: {
    name: 'Vesta',
    symbol: '⚶',
    meaning: 'Devoción, sexualidad sagrada, hogar interior, foco',
  },
  CHIRON: {
    name: 'Quirón',
    symbol: '⚷',
    meaning: 'Herida primordial, sanación, maestro herido',
  },
} as const;

/**
 * Nombres y símbolos de puntos especiales
 */
export const SPECIAL_POINTS_INFO = {
  MIDHEAVEN: {
    name: 'Medio Cielo',
    symbol: 'MC',
    meaning: 'Vocación, imagen pública, aspiraciones, cúspide de Casa 10',
  },
  IMUM_COELI: {
    name: 'Immum Coeli',
    symbol: 'IC',
    meaning: 'Raíces, hogar, familia, final de la vida, cúspide de Casa 4',
  },
  PART_OF_FORTUNE: {
    name: 'Parte de la Fortuna',
    symbol: '⊕',
    meaning: 'Fortuna material, suerte, dones naturales, bienestar',
  },
  NORTH_NODE: {
    name: 'Nodo Norte',
    symbol: '☊',
    meaning: 'Destino del alma, propósito de vida, hacia dónde debemos crecer',
  },
  SOUTH_NODE: {
    name: 'Nodo Sur',
    symbol: '☋',
    meaning: 'Karma pasado, zona de confort, experiencias previas del alma',
  },
  VERTEX: {
    name: 'Vértex',
    symbol: 'Vx',
    meaning: 'Encuentros fated, destino, punto de inflexión kármico',
  },
  ANTI_VERTEX: {
    name: 'Anti-Vértex',
    symbol: 'AVx',
    meaning: 'Punto opuesto al Vértex, manifestación del destino',
  },
} as const;

/**
 * Resultado de cálculo de un elemento individual
 */
export interface CalculationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Estado de cálculo de datos avanzados
 */
export interface AdvancedCalculationState {
  loading: boolean;
  error: string | null;
  data: AdvancedChartData | null;
}
