/**
 * Chart Shape Analysis Types
 * Based on Marc Edmund Jones patterns with advanced sub-types
 */

export const ShapeType = {
  BUNDLE: 'Racimo',
  BOWL: 'Cuenco',
  BUCKET: 'Cubo',
  LOCOMOTIVE: 'Locomotora',
  SEESAW: 'Balancín',
  SPLASH: 'Disperso',
  SPLAY: 'Irregular',
} as const;

export type ShapeType = typeof ShapeType[keyof typeof ShapeType];

export const BowlSubType = {
  LEADING: 'Cuenco Ascendente (Leading Bowl)',
  TRAILING: 'Cuenco Descendente (Trailing Bowl)',
  EASTERN: 'Cuenco Oriental (Eastern Bowl)',
  WESTERN: 'Cuenco Occidental (Western Bowl)',
} as const;

export type BowlSubType = typeof BowlSubType[keyof typeof BowlSubType];

export const BucketSubType = {
  SINGLETON: 'Cubo Individual (Singleton Bucket)',
  DOUBLE: 'Cubo Dual (Double Bucket)',
} as const;

export type BucketSubType = typeof BucketSubType[keyof typeof BucketSubType];

export const LocomotiveSubType = {
  CLOCKWISE: 'Motor en Sentido Horario (Clockwise Locomotive)',
  COUNTERCLOCKWISE: 'Motor en Sentido Antihorario (Counterclockwise Locomotive)',
} as const;

export type LocomotiveSubType = typeof LocomotiveSubType[keyof typeof LocomotiveSubType];

export interface PlanetPosition {
  name: string;
  longitude: number; // 0-360 grados
  latitude?: number;
  speed?: number;
}

export interface HemisphereStats {
  north: number; // Porcentaje 0-100
  south: number;
  east: number;
  west: number;
}

export interface ElementDistribution {
  fire: number; // Porcentaje 0-100
  earth: number;
  air: number;
  water: number;
}

export interface ModalityDistribution {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface ShapePattern {
  // Tipo principal
  type: ShapeType;
  
  // Sub-tipo específico (si aplica)
  subType?: BowlSubType | BucketSubType | LocomotiveSubType | string;
  
  // Nombre completo para display
  name: string;
  
  // Descripción interpretativa
  description: string;
  
  // Características geométricas
  span: number; // Amplitud angular ocupada (0-360)
  maxGap: number; // Mayor espacio vacío
  gaps: number[]; // Todos los espacios entre planetas
  
  // Planetas involucrados
  leadingPlanet?: string; // Planeta que inicia la secuencia
  trailingPlanet?: string; // Planeta que cierra la secuencia
  handlePlanet?: string; // Planeta "asa" en Bucket
  
  // Distribución espacial
  hemispheres: HemisphereStats;
  elements: ElementDistribution;
  modalities: ModalityDistribution;
  
  // Palabras clave interpretativas
  keywords: string[];
  
  // Nivel de confianza en la detección (0-1)
  confidence: number;
}

export interface ChartShapeAnalysis {
  pattern: ShapePattern;
  planets: PlanetPosition[];
  timestamp: Date;
}

// Configuración de thresholds para detección
export interface ShapeDetectionConfig {
  bundleMaxSpan: number; // Default: 120°
  bowlMaxSpan: number; // Default: 180°
  bucketMinGap: number; // Default: 120°
  locomotiveMinGaps: number; // Default: 3 gaps de 60°+
  seesawMinGap: number; // Default: 60°
  splayMinGaps: number; // Default: 2+ gaps de 60°+
}

// Constantes para interpretación
export const SHAPE_INTERPRETATIONS: Record<ShapeType, {
  keywords: string[];
  description: string;
  psychologicalTheme: string;
}> = {
  'Racimo': {
    keywords: ['Concentración', 'Especialización', 'Intensidad', 'Enfoque único'],
    description: 'Todos los planetas en 120° o menos. Energía altamente concentrada en un área específica del zodíaco.',
    psychologicalTheme: 'Personalidad de especialista. Gran maestría en un área específica pero puede carecer de perspectiva amplia. Enfoque intenso y profundo.',
  },
  'Cuenco': {
    keywords: ['Contención', 'Autosuficiencia', 'Misión', 'Propósito definido'],
    description: 'Planetas ocupando medio horóscopo (180° o menos). Equilibrio entre lo interno y lo externo.',
    psychologicalTheme: 'Fuerte sensación de misión o propósito vital. El hemisferio vacío representa el área de proyección, aspiración o lo que se busca desarrollar.',
  },
  'Cubo': {
    keywords: ['Dirección', 'Canalización', 'Foco único', 'Propósito dirigido'],
    description: 'Cuenco con un planeta aislado como "asa" o mango. Toda la energía se canaliza a través del planeta handle.',
    psychologicalTheme: 'El planeta "asa" es la salida o canal principal de expresión. Toda la energía del cuenco se dirige hacia esa área de vida. Propósito muy específico.',
  },
  'Locomotora': {
    keywords: ['Impulso', 'Progreso', 'Determinación', 'Motor interno'],
    description: 'Planetas ocupan 2/3 del horóscopo con un tercio completamente vacío. Patrón de movimiento constante y logro.',
    psychologicalTheme: 'Personalidad impulsada por logros y progreso constante. El tercio vacío representa la meta o aspiración que impulsa todo el movimiento. Gran determinación y perseverancia.',
  },
  'Balancín': {
    keywords: ['Balance', 'Polaridad', 'Decisión', 'Dos caminos'],
    description: 'Dos grupos de planetas en lados opuestos del horóscopo. Necesidad constante de equilibrar extremos.',
    psychologicalTheme: 'Vida dividida entre dos áreas, perspectivas o caminos. Constante búsqueda de balance e integración de opuestos. Capacidad de ver ambos lados de toda situación.',
  },
  'Disperso': {
    keywords: ['Versatilidad', 'Diversidad', 'Universalidad', 'Multi-talento'],
    description: 'Planetas distribuidos uniformemente por todo el zodíaco. Intereses amplios y variados en todas las áreas.',
    psychologicalTheme: 'Personalidad tipo "Renaissance" con múltiples talentos. Curiosidad universal pero puede tender a la dispersión. Dificultad para especializarse en una sola área.',
  },
  'Irregular': {
    keywords: ['Individualismo', 'No convencional', 'Único', 'Independiente'],
    description: 'Distribución irregular que no sigue ningún patrón estándar. Múltiples agrupaciones sin estructura definida.',
    psychologicalTheme: 'Altamente individualista y único. No sigue patrones tradicionales ni convencionales. Camino de vida poco común. Puede ser genio creativo o simplemente excéntrico.',
  },
};
