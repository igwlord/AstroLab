/**
 * 🔄 ADAPTADOR DE DATOS AVANZADOS
 * 
 * Funciones para adaptar y combinar datos de cálculos avanzados
 * con la estructura de carta natal existente
 * 
 * @module advancedChartAdapter
 */

import { logger } from '../utils/logger';
import type { NatalChart } from '../services/realAstroCalculator';
import type { 
  AdvancedChartData, 
  AsteroidData, 
  AdvancedPoint 
} from '../types/advancedChart';

/**
 * Carta natal extendida con datos avanzados
 */
export interface ExtendedNatalChart extends NatalChart {
  /** Datos avanzados opcionales */
  advancedData?: AdvancedChartData;
}

/**
 * Adapta datos de un asteroide al formato visual
 * 
 * @param asteroid - Datos del asteroide
 * @returns Objeto adaptado para visualización
 */
export function adaptAsteroidForDisplay(asteroid: AsteroidData) {
  return {
    name: asteroid.name,
    symbol: asteroid.symbol,
    position: `${asteroid.sign} ${asteroid.degree.toFixed(2)}°`,
    house: `Casa ${asteroid.house}`,
    retrograde: asteroid.retrograde,
    meaning: asteroid.meaning,
    // Datos completos para modal
    fullData: asteroid,
  };
}

/**
 * Adapta datos de un punto especial al formato visual
 * 
 * @param point - Datos del punto especial
 * @returns Objeto adaptado para visualización
 */
export function adaptSpecialPointForDisplay(point: AdvancedPoint) {
  return {
    name: point.name,
    symbol: point.symbol,
    position: `${point.sign} ${point.degree.toFixed(2)}°`,
    house: `Casa ${point.house}`,
    type: point.type,
    meaning: point.meaning,
    // Datos completos para modal
    fullData: point,
  };
}

/**
 * Convierte array de asteroides a formato grid
 * 
 * @param asteroids - Array de asteroides
 * @returns Array adaptado para componente AsteroidsGrid
 */
export function adaptAsteroidsForGrid(asteroids: AsteroidData[]) {
  logger.log(`📊 Adaptando ${asteroids.length} asteroides para visualización...`);
  
  return asteroids.map(adaptAsteroidForDisplay);
}

/**
 * Convierte puntos especiales a formato grid
 * 
 * @param specialPoints - Objeto con puntos especiales
 * @returns Array adaptado para componente SpecialPointsGrid
 */
export function adaptSpecialPointsForGrid(
  specialPoints: AdvancedChartData['specialPoints']
) {
  logger.log('📊 Adaptando puntos especiales para visualización...');
  
  const points: ReturnType<typeof adaptSpecialPointForDisplay>[] = [];
  
  if (specialPoints.midheaven) {
    points.push(adaptSpecialPointForDisplay(specialPoints.midheaven));
  }
  
  if (specialPoints.imumCoeli) {
    points.push(adaptSpecialPointForDisplay(specialPoints.imumCoeli));
  }
  
  if (specialPoints.partOfFortune) {
    points.push(adaptSpecialPointForDisplay(specialPoints.partOfFortune));
  }
  
  if (specialPoints.vertex) {
    points.push(adaptSpecialPointForDisplay(specialPoints.vertex));
  }
  
  if (specialPoints.antiVertex) {
    points.push(adaptSpecialPointForDisplay(specialPoints.antiVertex));
  }
  
  return points;
}

/**
 * Combina carta natal básica con datos avanzados
 * 
 * Esta función NO modifica la carta original, solo añade datos adicionales
 * 
 * @param basicChart - Carta natal básica calculada
 * @param advancedData - Datos avanzados calculados
 * @returns Carta natal extendida
 */
export function mergeWithMainChart(
  basicChart: NatalChart,
  advancedData: AdvancedChartData | null
): ExtendedNatalChart {
  logger.log('🔗 Combinando carta básica con datos avanzados...');
  
  // Si no hay datos avanzados, retornar solo la carta básica
  if (!advancedData) {
    logger.log('⚠️ No hay datos avanzados para combinar');
    return basicChart;
  }
  
  // Crear nueva carta extendida (sin modificar la original)
  const extendedChart: ExtendedNatalChart = {
    ...basicChart,
    advancedData,
  };
  
  logger.log('✅ Carta extendida creada exitosamente');
  logger.log(`📊 Asteroides: ${advancedData.asteroids.length}`);
  logger.log(`📊 Quirón: ${advancedData.chiron ? 'Sí' : 'No'}`);
  logger.log(`📊 Puntos especiales: ${Object.keys(advancedData.specialPoints).length}`);
  
  return extendedChart;
}

/**
 * Verifica si una carta tiene datos avanzados
 * 
 * @param chart - Carta natal (puede ser básica o extendida)
 * @returns true si tiene datos avanzados
 */
export function hasAdvancedData(
  chart: NatalChart | ExtendedNatalChart
): chart is ExtendedNatalChart {
  return 'advancedData' in chart && chart.advancedData !== undefined;
}

/**
 * Extrae solo los datos avanzados de una carta extendida
 * 
 * @param chart - Carta natal extendida
 * @returns Datos avanzados o null
 */
export function extractAdvancedData(
  chart: ExtendedNatalChart
): AdvancedChartData | null {
  return chart.advancedData || null;
}

/**
 * Cuenta total de elementos avanzados calculados
 * 
 * @param advancedData - Datos avanzados
 * @returns Objeto con conteo de cada tipo
 */
export function countAdvancedElements(advancedData: AdvancedChartData) {
  return {
    asteroids: advancedData.asteroids.length,
    chiron: advancedData.chiron ? 1 : 0,
    specialPoints: Object.values(advancedData.specialPoints).filter(Boolean).length,
    total: 
      advancedData.asteroids.length + 
      (advancedData.chiron ? 1 : 0) + 
      Object.values(advancedData.specialPoints).filter(Boolean).length,
  };
}

/**
 * Valida que los datos avanzados tengan la estructura correcta
 * 
 * @param data - Datos a validar
 * @returns true si la estructura es válida
 */
export function validateAdvancedData(data: any): data is AdvancedChartData {
  if (!data || typeof data !== 'object') {
    logger.error('❌ Datos avanzados inválidos: no es un objeto');
    return false;
  }
  
  if (!Array.isArray(data.asteroids)) {
    logger.error('❌ Datos avanzados inválidos: asteroids no es array');
    return false;
  }
  
  if (!data.specialPoints || typeof data.specialPoints !== 'object') {
    logger.error('❌ Datos avanzados inválidos: specialPoints no es objeto');
    return false;
  }
  
  if (!data.calculatedAt || !data.version) {
    logger.error('❌ Datos avanzados inválidos: faltan campos calculatedAt o version');
    return false;
  }
  
  logger.log('✅ Datos avanzados validados correctamente');
  return true;
}

/**
 * Prepara datos para exportación (JSON/PDF)
 * 
 * @param advancedData - Datos avanzados
 * @returns Objeto preparado para exportación
 */
export function prepareForExport(advancedData: AdvancedChartData) {
  logger.log('📦 Preparando datos avanzados para exportación...');
  
  return {
    version: advancedData.version,
    calculatedAt: advancedData.calculatedAt,
    elements: {
      asteroids: advancedData.asteroids.map(a => ({
        name: a.name,
        symbol: a.symbol,
        position: `${a.sign} ${a.degree.toFixed(2)}°`,
        house: a.house,
        retrograde: a.retrograde,
        meaning: a.meaning,
      })),
      chiron: advancedData.chiron ? {
        name: advancedData.chiron.name,
        symbol: advancedData.chiron.symbol,
        position: `${advancedData.chiron.sign} ${advancedData.chiron.degree.toFixed(2)}°`,
        house: advancedData.chiron.house,
        retrograde: advancedData.chiron.retrograde,
        meaning: advancedData.chiron.meaning,
      } : null,
      specialPoints: Object.entries(advancedData.specialPoints)
        .filter(([_, point]) => point !== undefined)
        .map(([key, point]) => ({
          key,
          name: point!.name,
          symbol: point!.symbol,
          position: `${point!.sign} ${point!.degree.toFixed(2)}°`,
          house: point!.house,
          type: point!.type,
          meaning: point!.meaning,
        })),
    },
  };
}

/**
 * Restaura datos desde formato de exportación
 * 
 * @param exportedData - Datos exportados
 * @returns Datos avanzados reconstruidos
 */
export function restoreFromExport(exportedData: any): AdvancedChartData | null {
  logger.log('📥 Restaurando datos avanzados desde exportación...');
  
  try {
    // TODO: Implementar lógica de restauración completa
    // Por ahora retornamos null
    logger.log('⏳ Restauración desde exportación: pendiente de implementación');
    return null;
  } catch (error) {
    logger.error('❌ Error restaurando datos:', error);
    return null;
  }
}
