/**
 * Chart Shape Analyzer
 * Detects Marc Edmund Jones horoscope patterns with advanced sub-types
 * Based on planetary distribution analysis
 */

import type {
  ShapePattern,
  PlanetPosition,
  HemisphereStats,
  ElementDistribution,
  ModalityDistribution,
  ShapeDetectionConfig,
  BowlSubType as BowlSubTypeValue,
  BucketSubType as BucketSubTypeValue,
  LocomotiveSubType as LocomotiveSubTypeValue,
} from '../types/chartShape';
import { ShapeType, BowlSubType, BucketSubType, LocomotiveSubType, SHAPE_INTERPRETATIONS } from '../types/chartShape';

// Configuración por defecto
const DEFAULT_CONFIG: ShapeDetectionConfig = {
  bundleMaxSpan: 120,
  bowlMaxSpan: 180,
  bucketMinGap: 120,
  locomotiveMinGaps: 3,
  seesawMinGap: 60,
  splayMinGaps: 2,
};

/**
 * Normaliza un ángulo a 0-360
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Calcula la diferencia angular más corta entre dos ángulos
 */
function angleDifference(angle1: number, angle2: number): number {
  const diff = Math.abs(angle1 - angle2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Verifica si un ángulo está contenido dentro de un arco (con wrap 360°)
 */
function arcContains(angle: number, start: number, end: number): boolean {
  const a = normalizeAngle(angle);
  const s = normalizeAngle(start);
  const e = normalizeAngle(end);
  
  if (s <= e) {
    return a >= s && a <= e;
  }
  return a >= s || a <= e; // wrap around 360°
}

/**
 * Calcula el arco vacío más grande a partir de gaps
 */
function emptyArcFromGaps(sorted: number[], gaps: number[]): { start: number; end: number; span: number; index: number } {
  const maxGap = Math.max(...gaps);
  const i = gaps.indexOf(maxGap);
  const start = sorted[(i + 1) % sorted.length];
  const end = normalizeAngle(start + maxGap);
  return { start, end, span: maxGap, index: i };
}

/**
 * Calcula el arco ocupado por los planetas
 */
function occupiedArc(sorted: number[], gaps: number[]): { start: number; end: number; span: number; gapIndex: number } {
  const maxGap = Math.max(...gaps);
  const i = gaps.indexOf(maxGap);
  const start = sorted[(i + 1) % sorted.length]; // empieza después del vacío
  const span = 360 - maxGap;
  const end = normalizeAngle(start + span);
  return { start, end, span, gapIndex: i };
}

/**
 * Agrupa planetas en clusters cortando por gaps grandes
 */
function buildClusters(sorted: number[], gaps: number[], splitDeg: number): Array<{ start: number; end: number; count: number; planets: number[] }> {
  const clusters: Array<{ start: number; end: number; count: number; planets: number[] }> = [];
  let currentCluster: number[] = [sorted[0]];
  
  for (let i = 0; i < gaps.length; i++) {
    const gap = gaps[i];
    const nextIndex = (i + 1) % sorted.length;
    
    if (gap >= splitDeg) {
      // Cerrar cluster actual
      clusters.push({
        start: currentCluster[0],
        end: currentCluster[currentCluster.length - 1],
        count: currentCluster.length,
        planets: [...currentCluster]
      });
      currentCluster = [sorted[nextIndex]];
    } else {
      currentCluster.push(sorted[nextIndex]);
    }
  }
  
  // Si no hay clusters (todos los gaps < splitDeg), todo es un cluster
  if (clusters.length === 0) {
    clusters.push({
      start: sorted[0],
      end: sorted[sorted.length - 1],
      count: sorted.length,
      planets: [...sorted]
    });
  }
  
  return clusters;
}

/**
 * Calcula los gaps (espacios vacíos) entre planetas consecutivos
 */
function calculateGaps(positions: number[]): number[] {
  const sorted = [...positions].sort((a, b) => a - b);
  const gaps: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[(i + 1) % sorted.length];
    const gap = next >= current ? next - current : (360 - current) + next;
    gaps.push(gap);
  }

  return gaps;
}

/**
 * Calcula el span (amplitud) total de distribución planetaria
 */
function calculateSpan(gaps: number[]): number {
  const maxGap = Math.max(...gaps);
  return 360 - maxGap;
}

/**
 * Calcula estadísticas hemisféricas
 */
function calculateHemispheres(positions: PlanetPosition[]): HemisphereStats {
  const north = positions.filter(p => p.longitude >= 0 && p.longitude < 180).length;
  const south = positions.length - north;
  const east = positions.filter(p => (p.longitude >= 0 && p.longitude < 90) || (p.longitude >= 270 && p.longitude < 360)).length;
  const west = positions.length - east;

  const total = positions.length;
  return {
    north: (north / total) * 100,
    south: (south / total) * 100,
    east: (east / total) * 100,
    west: (west / total) * 100,
  };
}

/**
 * Mapea longitud a signo zodiacal
 */
function getZodiacSign(longitude: number): string {
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const index = Math.floor(longitude / 30);
  return signs[index];
}

/**
 * Calcula distribución por elementos
 */
function calculateElements(positions: PlanetPosition[]): ElementDistribution {
  const elementMap: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    'Aries': 'fire', 'Leo': 'fire', 'Sagitario': 'fire',
    'Tauro': 'earth', 'Virgo': 'earth', 'Capricornio': 'earth',
    'Géminis': 'air', 'Libra': 'air', 'Acuario': 'air',
    'Cáncer': 'water', 'Escorpio': 'water', 'Piscis': 'water',
  };

  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  
  positions.forEach(p => {
    const sign = getZodiacSign(p.longitude);
    const element = elementMap[sign];
    if (element) counts[element]++;
  });

  const total = positions.length;
  return {
    fire: (counts.fire / total) * 100,
    earth: (counts.earth / total) * 100,
    air: (counts.air / total) * 100,
    water: (counts.water / total) * 100,
  };
}

/**
 * Calcula distribución por modalidades
 */
function calculateModalities(positions: PlanetPosition[]): ModalityDistribution {
  const modalityMap: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
    'Aries': 'cardinal', 'Cáncer': 'cardinal', 'Libra': 'cardinal', 'Capricornio': 'cardinal',
    'Tauro': 'fixed', 'Leo': 'fixed', 'Escorpio': 'fixed', 'Acuario': 'fixed',
    'Géminis': 'mutable', 'Virgo': 'mutable', 'Sagitario': 'mutable', 'Piscis': 'mutable',
  };

  const counts = { cardinal: 0, fixed: 0, mutable: 0 };
  
  positions.forEach(p => {
    const sign = getZodiacSign(p.longitude);
    const modality = modalityMap[sign];
    if (modality) counts[modality]++;
  });

  const total = positions.length;
  return {
    cardinal: (counts.cardinal / total) * 100,
    fixed: (counts.fixed / total) * 100,
    mutable: (counts.mutable / total) * 100,
  };
}

/**
 * Detecta patrón Bundle (120° o menos)
 */
function detectBundle(span: number, positions: number[], planets: PlanetPosition[], config: ShapeDetectionConfig): ShapePattern | null {
  if (span > config.bundleMaxSpan) return null;

  const sorted = [...positions].sort((a, b) => a - b);
  const leadingPlanet = planets.find(p => p.longitude === sorted[0])?.name || '';
  const trailingPlanet = planets.find(p => p.longitude === sorted[sorted.length - 1])?.name || '';

  return {
    type: ShapeType.BUNDLE,
    name: 'Racimo (Bundle)',
    description: SHAPE_INTERPRETATIONS['Racimo'].description,
    span,
    maxGap: 360 - span,
    gaps: calculateGaps(sorted),
    leadingPlanet,
    trailingPlanet,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Racimo'].keywords,
    confidence: 1.0,
  };
}

/**
 * Detecta patrón Bowl con sub-tipos
 */
function detectBowl(span: number, maxGap: number, positions: number[], planets: PlanetPosition[], gaps: number[], config: ShapeDetectionConfig): ShapePattern | null {
  if (span > config.bowlMaxSpan || span <= config.bundleMaxSpan) return null;

  const sorted = [...positions].sort((a, b) => a - b);
  const leadingPlanet = planets.find(p => p.longitude === sorted[0])?.name || '';
  const trailingPlanet = planets.find(p => p.longitude === sorted[sorted.length - 1])?.name || '';

  // Calcular el arco vacío
  const { start, span: emptySpan } = emptyArcFromGaps(sorted, gaps);
  
  // Determinar sub-tipo basado en dónde cae el VACÍO
  const midEmpty = normalizeAngle(start + emptySpan / 2);
  let subType: BowlSubTypeValue | undefined;

  // Leading Bowl: vacío en hemisferio Norte (0-180°) → ocupación en Sur
  if (midEmpty >= 0 && midEmpty < 180) {
    subType = BowlSubType.LEADING;
  }
  // Trailing Bowl: vacío en hemisferio Sur (180-360°) → ocupación en Norte
  else {
    subType = BowlSubType.TRAILING;
  }

  // Sobrescribir si hay dominancia Este/Oeste muy marcada
  const hem = calculateHemispheres(planets);
  if (hem.east > 65) {
    subType = BowlSubType.EASTERN;
  } else if (hem.west > 65) {
    subType = BowlSubType.WESTERN;
  }

  return {
    type: ShapeType.BOWL,
    subType,
    name: subType || 'Cuenco (Bowl)',
    description: SHAPE_INTERPRETATIONS['Cuenco'].description,
    span,
    maxGap,
    gaps,
    leadingPlanet,
    trailingPlanet,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Cuenco'].keywords,
    confidence: 0.95,
  };
}

/**
 * Detecta patrón Bucket (Bowl + planeta handle aislado)
 */
function detectBucket(span: number, maxGap: number, positions: number[], planets: PlanetPosition[], gaps: number[], config: ShapeDetectionConfig): ShapePattern | null {
  const sorted = [...positions].sort((a, b) => a - b);
  
  // Calcular el arco vacío (donde debería estar el handle)
  const { start, end, span: emptySpan } = emptyArcFromGaps(sorted, gaps);
  
  if (emptySpan < config.bucketMinGap) return null;

  // Buscar planetas DENTRO del arco vacío
  const inEmpty = sorted.filter(pos => arcContains(pos, start, end));
  
  // El handle debe tener 1-2 planetas, no más
  if (inEmpty.length === 0 || inEmpty.length > 2) return null;

  const handleLongitudes = inEmpty;
  const handlePlanet = planets.find(p => p.longitude === handleLongitudes[0])?.name || '';
  const subType: BucketSubTypeValue = inEmpty.length === 1 ? BucketSubType.SINGLETON : BucketSubType.DOUBLE;

  return {
    type: ShapeType.BUCKET,
    subType,
    name: subType || 'Cubo (Bucket)',
    description: SHAPE_INTERPRETATIONS['Cubo'].description,
    span,
    maxGap,
    gaps,
    handlePlanet,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Cubo'].keywords,
    confidence: 0.9,
  };
}

/**
 * Detecta patrón Locomotive (2/3 del horóscopo ocupado)
 */
function detectLocomotive(span: number, maxGap: number, positions: number[], planets: PlanetPosition[], gaps: number[]): ShapePattern | null {
  // Locomotive: 210-270° ocupado, 90-135° vacío
  if (span < 210 || span > 270 || maxGap < 90 || maxGap > 135) return null;

  const sorted = [...positions].sort((a, b) => a - b);
  
  // Calcular arco ocupado para determinar leading/trailing
  const occ = occupiedArc(sorted, gaps);
  const leadingLong = occ.end;   // borde delantero del arco ocupado
  const trailingLong = occ.start; // borde trasero del arco ocupado

  // Determinar dirección basándose en dónde cae el centro del vacío
  const empty = emptyArcFromGaps(sorted, gaps);
  const midEmpty = normalizeAngle(empty.start + empty.span / 2);
  const isEast = (midEmpty < 90) || (midEmpty >= 270);
  const subType: LocomotiveSubTypeValue = isEast 
    ? LocomotiveSubType.CLOCKWISE 
    : LocomotiveSubType.COUNTERCLOCKWISE;

  return {
    type: ShapeType.LOCOMOTIVE,
    subType,
    name: subType || 'Locomotora (Locomotive)',
    description: SHAPE_INTERPRETATIONS['Locomotora'].description,
    span,
    maxGap,
    gaps,
    leadingPlanet: planets.find(p => p.longitude === leadingLong)?.name || '',
    trailingPlanet: planets.find(p => p.longitude === trailingLong)?.name || '',
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Locomotora'].keywords,
    confidence: 0.85,
  };
}

/**
 * Detecta patrón Seesaw (dos grupos opuestos)
 */
function detectSeesaw(planets: PlanetPosition[], gaps: number[], config: ShapeDetectionConfig): ShapePattern | null {
  const positions = planets.map(p => p.longitude).sort((a, b) => a - b);
  
  // Construir clusters cortando por gaps >= seesawMinGap
  const clusters = buildClusters(positions, gaps, config.seesawMinGap);
  
  // Debe haber exactamente 2 clusters
  if (clusters.length !== 2) return null;

  // Calcular centros de cada cluster
  const centers = clusters.map(c => {
    const midAngle = angleDifference(c.start, c.end) / 2;
    return normalizeAngle(c.start + midAngle);
  });

  // Verificar que los clusters estén aproximadamente opuestos (150-210° de separación)
  const sep = angleDifference(centers[0], centers[1]);
  if (sep < 150 || sep > 210) return null;

  const span = calculateSpan(gaps);

  return {
    type: ShapeType.SEESAW,
    name: 'Balancín (Seesaw)',
    description: SHAPE_INTERPRETATIONS['Balancín'].description,
    span,
    maxGap: Math.max(...gaps),
    gaps,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Balancín'].keywords,
    confidence: 0.8,
  };
}

/**
 * Detecta patrón Splash (distribución uniforme)
 */
function detectSplash(gaps: number[], planets: PlanetPosition[]): ShapePattern | null {
  // Splash: gaps relativamente uniformes, ninguno muy grande
  const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avgGap, 2), 0) / gaps.length;
  const stdDev = Math.sqrt(variance);

  // Si la desviación estándar es baja, es Splash
  if (stdDev > avgGap * 0.6) return null; // Demasiada variación

  const span = calculateSpan(gaps);

  return {
    type: ShapeType.SPLASH,
    name: 'Disperso (Splash)',
    description: SHAPE_INTERPRETATIONS['Disperso'].description,
    span,
    maxGap: Math.max(...gaps),
    gaps,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Disperso'].keywords,
    confidence: 0.75,
  };
}

/**
 * Detecta patrón Splay (distribución irregular, patrón por defecto)
 */
function detectSplay(span: number, gaps: number[], planets: PlanetPosition[]): ShapePattern {
  return {
    type: ShapeType.SPLAY,
    name: 'Irregular (Splay)',
    description: SHAPE_INTERPRETATIONS['Irregular'].description,
    span,
    maxGap: Math.max(...gaps),
    gaps,
    hemispheres: calculateHemispheres(planets),
    elements: calculateElements(planets),
    modalities: calculateModalities(planets),
    keywords: SHAPE_INTERPRETATIONS['Irregular'].keywords,
    confidence: 0.6,
  };
}

/**
 * Función principal: detecta el patrón de forma del horóscopo
 */
export function detectChartShape(
  planets: PlanetPosition[],
  config: ShapeDetectionConfig = DEFAULT_CONFIG
): ShapePattern {
  // Filtrar planetas válidos
  const validPlanets = planets.filter(p => p.longitude !== undefined && p.longitude >= 0 && p.longitude < 360);
  
  if (validPlanets.length < 3) {
    throw new Error('Se requieren al menos 3 planetas para detectar patrón');
  }

  // Extraer posiciones y ordenar
  const positions = validPlanets.map(p => p.longitude);
  const gaps = calculateGaps(positions);
  const maxGap = Math.max(...gaps);
  const span = calculateSpan(gaps);

  // Intentar detectar patrones en orden de especificidad (más específico primero)
  
  // 1. Bundle (más específico)
  const bundle = detectBundle(span, positions, validPlanets, config);
  if (bundle) return bundle;

  // 2. Bucket (requiere gap grande + handle)
  const bucket = detectBucket(span, maxGap, positions, validPlanets, gaps, config);
  if (bucket) return bucket;

  // 3. Bowl (medio horóscopo)
  const bowl = detectBowl(span, maxGap, positions, validPlanets, gaps, config);
  if (bowl) return bowl;

  // 4. Locomotive (2/3 del horóscopo)
  const locomotive = detectLocomotive(span, maxGap, positions, validPlanets, gaps);
  if (locomotive) return locomotive;

  // 5. Seesaw (dos grupos opuestos)
  const seesaw = detectSeesaw(validPlanets, gaps, config);
  if (seesaw) return seesaw;

  // 6. Splash (distribución uniforme)
  const splash = detectSplash(gaps, validPlanets);
  if (splash) return splash;

  // 7. Splay (por defecto, patrón irregular)
  return detectSplay(span, gaps, validPlanets);
}

/**
 * Exportar también las funciones de cálculo para uso individual
 */
export {
  calculateGaps,
  calculateSpan,
  calculateHemispheres,
  calculateElements,
  calculateModalities,
  normalizeAngle,
  angleDifference,
};
