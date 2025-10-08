/**
 * 🌟 CALCULADOR ASTRONÓMICO AVANZADO
 * 
 * Calcula asteroides y puntos especiales usando Swiss Ephemeris
 * 
 * IMPORTANTE: Este archivo NO modifica realAstroCalculator.ts
 * Se usa exclusivamente para cálculos de configuración avanzada
 * 
 * @module advancedAstroCalculator
 */

import { logger } from '../utils/logger';
import type {
  AsteroidData,
  AdvancedPoint,
  AdvancedChartData,
  AdvancedCalculationParams,
  AdvancedCalculationOptions,
  CalculationResult,
} from '../types/advancedChart';
import { 
  SWISSEPH_CODES, 
  ASTEROID_INFO, 
  SPECIAL_POINTS_INFO 
} from '../types/advancedChart';

/**
 * Versión del calculador avanzado
 */
const CALCULATOR_VERSION = '1.0.0';

/**
 * Calcula la posición de un asteroide usando Swiss Ephemeris
 * 
 * @param julianDay - Día juliano
 * @param asteroidId - ID de Swiss Ephemeris del asteroide
 * @param asteroidName - Nombre del asteroide
 * @param houseCusps - Cúspides de las casas para determinar la casa
 * @param ascendantLon - Longitud del ascendente
 * @returns Datos del asteroide calculado o null si hay error
 */
async function calculateAsteroid(
  julianDay: number,
  asteroidId: number,
  asteroidName: keyof typeof ASTEROID_INFO,
  houseCusps: number[],
  ascendantLon: number
): Promise<CalculationResult<AsteroidData>> {
  try {
    logger.log(`🪐 Calculando ${asteroidName} (ID: ${asteroidId})...`);
    
    // Importar Swiss Ephemeris de forma dinámica
    const SwissEph = (await import('swisseph-wasm')).default;
    const swe = new SwissEph();
    await swe.initSwissEph();
    const sweModule = (swe as any).SweModule;
    
    // Crear buffer para resultados (4 doubles: lon, lat, dist, speed)
    const buffer = sweModule._malloc(4 * Float64Array.BYTES_PER_ELEMENT);
    
    try {
      // Flags para Swiss Ephemeris:
      // SEFLG_SWIEPH = 2 (usar Swiss Ephemeris)
      // SEFLG_SPEED = 256 (calcular velocidad para detectar retrógrado)
      const flags = 2 | 256; // 2 + 256 = 258
      
      // Calcular posición del asteroide
      const retcode = sweModule.ccall(
        'swe_calc_ut',
        'number',
        ['number', 'number', 'number', 'pointer'],
        [julianDay, asteroidId, flags, buffer]
      );
      
      if (retcode < 0) {
        throw new Error(`Swiss Ephemeris falló con código ${retcode}`);
      }
      
      // Leer resultados del buffer
      const result = new Float64Array(sweModule.HEAPF64.buffer, buffer, 4);
      const longitude = result[0];  // Longitud eclíptica
      const latitude = result[1];   // Latitud eclíptica
      const distance = result[2];   // Distancia en AU
      const speed = result[3];      // Velocidad en longitud (°/día)
      
      // Determinar si está retrógrado (velocidad negativa)
      const retrograde = speed < 0;
      
      // Convertir longitud a signo y grados
      const sign = getZodiacSign(longitude);
      const degree = longitude % 30;
      
      // Determinar casa
      const house = determineHouse(longitude, houseCusps, ascendantLon);
      
      const asteroidData: AsteroidData = {
        name: ASTEROID_INFO[asteroidName].name,
        symbol: ASTEROID_INFO[asteroidName].symbol,
        swissephId: asteroidId,
        longitude,
        sign,
        degree,
        house,
        retrograde,
        speed: Math.abs(speed),
        meaning: ASTEROID_INFO[asteroidName].meaning,
        category: asteroidName === 'CHIRON' ? 'centaur' : 'main-asteroid',
      };
      
      logger.log(
        `✅ ${asteroidName}: ${sign} ${degree.toFixed(2)}° en Casa ${house}` +
        `${retrograde ? ' (R)' : ''} | Speed: ${speed.toFixed(4)}°/día`
      );
      
      return {
        success: true,
        data: asteroidData,
      };
    } finally {
      // Liberar buffer
      sweModule._free(buffer);
    }
  } catch (error) {
    logger.error(`❌ Error calculando ${asteroidName}:`, error);
    return {
      success: false,
      error: `Error calculando ${asteroidName}: ${error}`,
    };
  }
}

/**
 * Calcula todos los asteroides principales (Ceres, Pallas, Juno, Vesta)
 * 
 * @param params - Parámetros de cálculo
 * @returns Array de asteroides calculados
 */
async function calculateMainAsteroids(
  params: AdvancedCalculationParams
): Promise<AsteroidData[]> {
  logger.log('🌟 Calculando asteroides principales...');
  
  const asteroids: AsteroidData[] = [];
  const { julianDay, houseCusps = [], ascendantLongitude = 0 } = params;
  
  // Calcular cada asteroide
  const asteroidsToCalculate: Array<{ id: number; name: keyof typeof ASTEROID_INFO }> = [
    { id: SWISSEPH_CODES.CERES, name: 'CERES' },
    { id: SWISSEPH_CODES.PALLAS, name: 'PALLAS' },
    { id: SWISSEPH_CODES.JUNO, name: 'JUNO' },
    { id: SWISSEPH_CODES.VESTA, name: 'VESTA' },
  ];
  
  for (const asteroid of asteroidsToCalculate) {
    const result = await calculateAsteroid(
      julianDay,
      asteroid.id,
      asteroid.name,
      houseCusps,
      ascendantLongitude
    );
    
    if (result.success && result.data) {
      asteroids.push(result.data);
    }
  }
  
  logger.log(`✅ ${asteroids.length}/4 asteroides calculados exitosamente`);
  return asteroids;
}

/**
 * Calcula Quirón (Chiron)
 * 
 * @param params - Parámetros de cálculo
 * @returns Datos de Quirón o undefined si hay error
 */
async function calculateChironPosition(
  params: AdvancedCalculationParams
): Promise<AsteroidData | undefined> {
  logger.log('⚕️ Calculando Quirón...');
  
  const { julianDay, houseCusps = [], ascendantLongitude = 0 } = params;
  
  const result = await calculateAsteroid(
    julianDay,
    SWISSEPH_CODES.CHIRON,
    'CHIRON',
    houseCusps,
    ascendantLongitude
  );
  
  if (result.success && result.data) {
    logger.log('✅ Quirón calculado exitosamente');
    return result.data;
  }
  
  logger.error('❌ Error calculando Quirón');
  return undefined;
}

/**
 * Extrae el Medio Cielo (MC) e Immum Coeli (IC) de las casas calculadas
 * 
 * @param params - Parámetros de cálculo
 * @returns Objetos MC e IC
 */
function extractAngles(params: AdvancedCalculationParams): {
  midheaven?: AdvancedPoint;
  imumCoeli?: AdvancedPoint;
} {
  logger.log('🏔️ Extrayendo ángulos (MC, IC)...');
  
  const { houseCusps = [] } = params;
  
  if (houseCusps.length < 12) {
    logger.error('❌ No hay suficientes cúspides de casas para extraer ángulos');
    return {};
  }
  
  // MC = Cúspide de Casa 10 (índice 9)
  const mcLongitude = houseCusps[9];
  const mcSign = getZodiacSign(mcLongitude);
  const mcDegree = mcLongitude % 30;
  
  // IC = Cúspide de Casa 4 (índice 3)
  const icLongitude = houseCusps[3];
  const icSign = getZodiacSign(icLongitude);
  const icDegree = icLongitude % 30;
  
  const midheaven: AdvancedPoint = {
    name: SPECIAL_POINTS_INFO.MIDHEAVEN.name,
    symbol: SPECIAL_POINTS_INFO.MIDHEAVEN.symbol,
    type: 'angle',
    longitude: mcLongitude,
    sign: mcSign,
    degree: mcDegree,
    house: 10,
    meaning: SPECIAL_POINTS_INFO.MIDHEAVEN.meaning,
  };
  
  const imumCoeli: AdvancedPoint = {
    name: SPECIAL_POINTS_INFO.IMUM_COELI.name,
    symbol: SPECIAL_POINTS_INFO.IMUM_COELI.symbol,
    type: 'angle',
    longitude: icLongitude,
    sign: icSign,
    degree: icDegree,
    house: 4,
    meaning: SPECIAL_POINTS_INFO.IMUM_COELI.meaning,
  };
  
  logger.log(`✅ MC: ${mcSign} ${mcDegree.toFixed(2)}°`);
  logger.log(`✅ IC: ${icSign} ${icDegree.toFixed(2)}°`);
  
  return { midheaven, imumCoeli };
}

/**
 * Calcula la Parte de la Fortuna (Lot of Fortune)
 * 
 * La Parte de la Fortuna es un punto árabe que representa fortuna material,
 * suerte, dones naturales y áreas de facilidad en la vida.
 * 
 * FÓRMULAS:
 * - Carta DIURNA (Sol sobre horizonte):   Fortuna = ASC + Luna - Sol
 * - Carta NOCTURNA (Sol bajo horizonte):  Fortuna = ASC + Sol - Luna
 * 
 * Una carta es diurna si el Sol está sobre el horizonte (casas 7-12)
 * y nocturna si está bajo el horizonte (casas 1-6).
 * 
 * @param params - Parámetros de cálculo
 * @returns Parte de la Fortuna o undefined si faltan datos
 */
function calculatePartOfFortune(
  params: AdvancedCalculationParams
): AdvancedPoint | undefined {
  logger.log('💰 Calculando Parte de la Fortuna...');
  
  const { 
    ascendantLongitude, 
    sunLongitude, 
    moonLongitude,
    houseCusps = []
  } = params;
  
  // Verificar que tenemos todos los datos necesarios
  if (
    ascendantLongitude === undefined || 
    sunLongitude === undefined || 
    moonLongitude === undefined
  ) {
    logger.error('❌ Faltan datos para calcular Parte de Fortuna (ASC, Sol, Luna)');
    return undefined;
  }
  
  logger.log(`📊 Datos base: ASC=${ascendantLongitude.toFixed(2)}°, Sol=${sunLongitude.toFixed(2)}°, Luna=${moonLongitude.toFixed(2)}°`);
  
  // Determinar si la carta es diurna o nocturna
  // El Sol está sobre el horizonte si está en casas 7-12
  // Normalizar la longitud del Sol respecto al Ascendente para comparar
  const normalizedSun = (sunLongitude - ascendantLongitude + 360) % 360;
  
  // Si el Sol está entre 0° y 180° del ASC, está sobre el horizonte (diurna)
  // Si está entre 180° y 360° del ASC, está bajo el horizonte (nocturna)
  const isDiurnal = normalizedSun >= 0 && normalizedSun <= 180;
  
  logger.log(`🌞 Carta ${isDiurnal ? 'DIURNA' : 'NOCTURNA'} (Sol ${isDiurnal ? 'sobre' : 'bajo'} horizonte)`);
  
  // Calcular Parte de Fortuna según fórmula
  let fortuneLongitude: number;
  
  if (isDiurnal) {
    // Fórmula diurna: Fortuna = ASC + Luna - Sol
    fortuneLongitude = ascendantLongitude + moonLongitude - sunLongitude;
    logger.log('📐 Fórmula diurna: ASC + Luna - Sol');
  } else {
    // Fórmula nocturna: Fortuna = ASC + Sol - Luna
    fortuneLongitude = ascendantLongitude + sunLongitude - moonLongitude;
    logger.log('📐 Fórmula nocturna: ASC + Sol - Luna');
  }
  
  // Normalizar el resultado al rango 0-360°
  fortuneLongitude = ((fortuneLongitude % 360) + 360) % 360;
  
  logger.log(`🎯 Longitud calculada: ${fortuneLongitude.toFixed(4)}°`);
  
  // Convertir a signo zodiacal
  const fortuneSign = getZodiacSign(fortuneLongitude);
  const fortuneDegree = fortuneLongitude % 30;
  
  // Determinar casa
  const fortuneHouse = determineHouse(fortuneLongitude, houseCusps, ascendantLongitude);
  
  // Crear objeto de resultado
  const partOfFortune: AdvancedPoint = {
    name: SPECIAL_POINTS_INFO.PART_OF_FORTUNE.name,
    symbol: SPECIAL_POINTS_INFO.PART_OF_FORTUNE.symbol,
    type: 'arabic-part',
    longitude: fortuneLongitude,
    sign: fortuneSign,
    degree: fortuneDegree,
    house: fortuneHouse,
    meaning: SPECIAL_POINTS_INFO.PART_OF_FORTUNE.meaning,
    formula: isDiurnal 
      ? 'ASC + Luna - Sol (carta diurna)'
      : 'ASC + Sol - Luna (carta nocturna)',
  };
  
  logger.log(`✅ Parte de Fortuna: ${fortuneSign} ${fortuneDegree.toFixed(2)}° (Casa ${fortuneHouse})`);
  
  return partOfFortune;
}

/**
 * Calcula los Nodos Lunares (Norte y Sur) usando Swiss Ephemeris
 * 
 * Los Nodos Lunares representan el karma y destino del alma:
 * - NODO NORTE (☊): Hacia dónde debemos crecer, propósito de vida
 * - NODO SUR (☋): Experiencias pasadas, zona de confort, karma
 * 
 * El Nodo Sur SIEMPRE está opuesto al Nodo Norte (180°).
 * 
 * Swiss Ephemeris calcula el Nodo Norte directamente.
 * Usamos TRUE_NODE (ID: 11) que es más preciso que MEAN_NODE (ID: 10).
 * 
 * @param params - Parámetros de cálculo
 * @returns Objetos con Nodo Norte y Nodo Sur
 */
async function calculateNodes(
  params: AdvancedCalculationParams
): Promise<{ northNode?: AdvancedPoint; southNode?: AdvancedPoint }> {
  logger.log('🌙 Calculando Nodos Lunares...');
  
  const { julianDay, houseCusps = [], ascendantLongitude = 0 } = params;
  
  try {
    // Importar Swiss Ephemeris
    const SwissEph = (await import('swisseph-wasm')).default;
    const swe = new SwissEph();
    await swe.initSwissEph();
    const sweModule = (swe as any).SweModule;
    
    // Preparar buffer para resultados
    const buffer = sweModule._malloc(4 * Float64Array.BYTES_PER_ELEMENT);
    
    // Flags: SEFLG_SWIEPH (2) + SEFLG_SPEED (256)
    const flags = 2 | 256;
    
    // Calcular Nodo Norte Verdadero (ID: 11)
    const nodeId = SWISSEPH_CODES.TRUE_NODE;
    logger.log(`📐 Calculando Nodo Norte (ID: ${nodeId})...`);
    
    sweModule.ccall(
      'swe_calc_ut',
      'number',
      ['number', 'number', 'number', 'pointer'],
      [julianDay, nodeId, flags, buffer]
    );
    
    // Leer resultados
    const result = new Float64Array(sweModule.HEAPF64.buffer, buffer, 4);
    const northNodeLongitude = result[0];
    const speed = result[3];
    
    logger.log(`✅ Nodo Norte: ${northNodeLongitude.toFixed(4)}°, velocidad: ${speed.toFixed(4)}°/día`);
    
    // Liberar memoria
    sweModule._free(buffer);
    
    // Convertir Nodo Norte a signo y casa
    const northNodeSign = getZodiacSign(northNodeLongitude);
    const northNodeDegree = northNodeLongitude % 30;
    const northNodeHouse = determineHouse(northNodeLongitude, houseCusps, ascendantLongitude);
    
    // Calcular Nodo Sur (opuesto al Norte)
    const southNodeLongitude = (northNodeLongitude + 180) % 360;
    const southNodeSign = getZodiacSign(southNodeLongitude);
    const southNodeDegree = southNodeLongitude % 30;
    const southNodeHouse = determineHouse(southNodeLongitude, houseCusps, ascendantLongitude);
    
    // Los Nodos Lunares se mueven retrógrados (hacia atrás en el zodiaco)
    const isRetrograde = speed < 0;
    
    // Crear objetos de resultado
    const northNode: AdvancedPoint = {
      name: SPECIAL_POINTS_INFO.NORTH_NODE.name,
      symbol: SPECIAL_POINTS_INFO.NORTH_NODE.symbol,
      type: 'calculated-point',
      longitude: northNodeLongitude,
      sign: northNodeSign,
      degree: northNodeDegree,
      house: northNodeHouse,
      meaning: SPECIAL_POINTS_INFO.NORTH_NODE.meaning,
    };
    
    const southNode: AdvancedPoint = {
      name: SPECIAL_POINTS_INFO.SOUTH_NODE.name,
      symbol: SPECIAL_POINTS_INFO.SOUTH_NODE.symbol,
      type: 'calculated-point',
      longitude: southNodeLongitude,
      sign: southNodeSign,
      degree: southNodeDegree,
      house: southNodeHouse,
      meaning: SPECIAL_POINTS_INFO.SOUTH_NODE.meaning,
    };
    
    logger.log(`✅ Nodo Norte: ${northNodeSign} ${northNodeDegree.toFixed(2)}° (Casa ${northNodeHouse}) ${isRetrograde ? 'R' : ''}`);
    logger.log(`✅ Nodo Sur: ${southNodeSign} ${southNodeDegree.toFixed(2)}° (Casa ${southNodeHouse})`);
    
    return { northNode, southNode };
    
  } catch (error) {
    logger.error('❌ Error calculando Nodos Lunares:', error);
    return {};
  }
}

/**
 * Calcula el Vértex y Anti-Vértex
 * 
 * FASE 7: Implementación completa
 * 
 * El Vértex es un punto sensible calculado mediante trigonometría esférica.
 * Representa encuentros fatales y eventos kármicos en la carta natal.
 * 
 * Fórmula (hemisferio oeste):
 * Vertex = RAMC + arctan(tan(coLatitud) / cos(oblicuidad))
 * 
 * @param params - Parámetros de cálculo
 * @returns Vértex y Anti-Vértex
 */
async function calculateVertex(
  params: AdvancedCalculationParams
): Promise<{ vertex?: AdvancedPoint; antiVertex?: AdvancedPoint }> {
  logger.log('🌀 Calculando Vértex...');
  
  try {
    const { julianDay, latitude, longitude, houseCusps, ascendantLongitude } = params;
    
    // Validar que tenemos latitud y longitud
    if (latitude === undefined || longitude === undefined) {
      logger.warn('⚠️ No se proporcionó latitud/longitud, no se puede calcular Vértex');
      return {};
    }
    
    // 🎯 USAR SWISS EPHEMERIS DIRECTAMENTE
    // El Vértex está en ascmc[3] del resultado de swe_houses
    // Es mucho más preciso que cualquier cálculo manual
    const { calculateVertexPrecise } = await import('./swissEphemerisCalculator');
    
    const { vertex: vertexData, antiVertex: antiVertexData } = await calculateVertexPrecise(
      julianDay,
      latitude,
      longitude
    );
    
    // Convertir a signos zodiacales y determinar casas
    const vertexSign = vertexData.sign;
    const vertexDegree = vertexData.degree;
    const vertexLongitude = vertexData.longitude;
    
    const antiVertexSign = antiVertexData.sign;
    const antiVertexDegree = antiVertexData.degree;
    const antiVertexLongitude = antiVertexData.longitude;
    
    // Determinar casas
    const vertexHouse = determineHouse(vertexLongitude, houseCusps || [], ascendantLongitude || 0);
    const antiVertexHouse = determineHouse(antiVertexLongitude, houseCusps || [], ascendantLongitude || 0);
    
    // Crear objetos AdvancedPoint
    const vertex: AdvancedPoint = {
      name: SPECIAL_POINTS_INFO.VERTEX.name,
      symbol: SPECIAL_POINTS_INFO.VERTEX.symbol,
      type: 'calculated-point',
      longitude: vertexLongitude,
      sign: vertexSign,
      degree: vertexDegree,
      house: vertexHouse,
      meaning: SPECIAL_POINTS_INFO.VERTEX.meaning,
    };
    
    const antiVertex: AdvancedPoint = {
      name: SPECIAL_POINTS_INFO.ANTI_VERTEX.name,
      symbol: SPECIAL_POINTS_INFO.ANTI_VERTEX.symbol,
      type: 'calculated-point',
      longitude: antiVertexLongitude,
      sign: antiVertexSign,
      degree: antiVertexDegree,
      house: antiVertexHouse,
      meaning: SPECIAL_POINTS_INFO.ANTI_VERTEX.meaning,
    };
    
    return { vertex, antiVertex };
    
  } catch (error) {
    logger.error('❌ Error calculando Vértex:', error);
    return {};
  }
}

/**
 * Función principal: calcula todos los datos avanzados
 * 
 * @param params - Parámetros de cálculo
 * @param options - Opciones de qué calcular
 * @returns Datos avanzados completos
 */
export async function calculateAdvancedChart(
  params: AdvancedCalculationParams,
  options: AdvancedCalculationOptions
): Promise<AdvancedChartData> {
  logger.log('🚀 Iniciando cálculos avanzados...');
  logger.log('📊 Opciones:', options);
  
  const startTime = Date.now();
  
  // Inicializar resultado
  const result: AdvancedChartData = {
    asteroids: [],
    specialPoints: {},
    calculatedAt: new Date().toISOString(),
    version: CALCULATOR_VERSION,
  };
  
  try {
    // Calcular asteroides principales
    if (options.calculateAsteroids) {
      result.asteroids = await calculateMainAsteroids(params);
    }
    
    // Calcular Quirón
    if (options.calculateChiron) {
      result.chiron = await calculateChironPosition(params);
    }
    
    // Extraer Medio Cielo e IC
    if (options.calculateMidheaven) {
      const angles = extractAngles(params);
      result.specialPoints.midheaven = angles.midheaven;
      result.specialPoints.imumCoeli = angles.imumCoeli;
    }
    
    // Calcular Parte de la Fortuna
    if (options.calculatePartOfFortune) {
      result.specialPoints.partOfFortune = calculatePartOfFortune(params);
    }
    
    // Calcular Nodos Lunares
    if (options.calculateNodes) {
      const nodes = await calculateNodes(params);
      result.specialPoints.northNode = nodes.northNode;
      result.specialPoints.southNode = nodes.southNode;
    }
    
    // Calcular Vértex
    if (options.calculateVertex) {
      const vertexPoints = await calculateVertex(params);
      result.specialPoints.vertex = vertexPoints.vertex;
      result.specialPoints.antiVertex = vertexPoints.antiVertex;
    }
    
    const elapsedTime = Date.now() - startTime;
    logger.log(`✅ Cálculos avanzados completados en ${elapsedTime}ms`);
    
    return result;
  } catch (error) {
    logger.error('❌ Error en cálculos avanzados:', error);
    throw error;
  }
}

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Convierte longitud eclíptica a signo zodiacal
 */
function getZodiacSign(longitude: number): string {
  const SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  return SIGNS[signIndex];
}

/**
 * Determina en qué casa está un punto según su longitud
 */
function determineHouse(
  longitude: number,
  houseCusps: number[],
  ascendantLon: number
): number {
  if (houseCusps.length < 12) {
    // Fallback: usar ascendente como referencia
    const normalizedLon = ((longitude - ascendantLon + 360) % 360);
    return Math.floor(normalizedLon / 30) + 1;
  }
  
  const normalizedLon = ((longitude % 360) + 360) % 360;
  
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];
    
    if (nextCusp > currentCusp) {
      if (normalizedLon >= currentCusp && normalizedLon < nextCusp) {
        return i + 1;
      }
    } else {
      // Caso especial: cruce de 0°
      if (normalizedLon >= currentCusp || normalizedLon < nextCusp) {
        return i + 1;
      }
    }
  }
  
  return 1; // Fallback
}

/**
 * Normaliza un ángulo al rango 0-360
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
