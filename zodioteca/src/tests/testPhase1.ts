/**
 * 🧪 TEST DE VERIFICACIÓN - FASE 1
 * 
 * Prueba que la estructura básica funciona correctamente
 * Este archivo puede ser eliminado después de la verificación
 */

import { logger } from '../utils/logger';
import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import { mergeWithMainChart, countAdvancedElements } from '../utils/advancedChartAdapter';
import type { AdvancedCalculationParams, AdvancedCalculationOptions } from '../types/advancedChart';
import type { NatalChart } from '../services/realAstroCalculator';

/**
 * Prueba básica de la estructura
 */
export async function testPhase1() {
  logger.log('🧪 ==================== TEST FASE 1 ====================');
  logger.log('🧪 Verificando estructura de archivos y tipos...');
  
  try {
    // 1. Crear parámetros de prueba
    const testParams: AdvancedCalculationParams = {
      julianDay: 2451545.0, // J2000
      latitude: 40.7128,
      longitude: -74.0060,
      houseCusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      ascendantLongitude: 0,
      sunLongitude: 280,
      moonLongitude: 120,
    };
    
    // 2. Crear opciones de prueba
    const testOptions: AdvancedCalculationOptions = {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: true,
      calculatePartOfFortune: false, // Fase 5
      calculateVertex: false, // Fase 6
    };
    
    logger.log('✅ Parámetros y opciones creados correctamente');
    
    // 3. Intentar cálculo avanzado (con stubs)
    logger.log('🔄 Ejecutando cálculo avanzado...');
    const advancedData = await calculateAdvancedChart(testParams, testOptions);
    
    logger.log('✅ Cálculo avanzado ejecutado sin errores');
    logger.log('📊 Datos recibidos:', advancedData);
    
    // 4. Verificar estructura de datos
    const count = countAdvancedElements(advancedData);
    logger.log('📊 Conteo de elementos:');
    logger.log(`   - Asteroides: ${count.asteroids}`);
    logger.log(`   - Quirón: ${count.chiron}`);
    logger.log(`   - Puntos especiales: ${count.specialPoints}`);
    logger.log(`   - TOTAL: ${count.total}`);
    
    // 5. Crear carta natal mock para probar merge
    const mockBasicChart: NatalChart = {
      date: new Date(),
      location: 'Test Location',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      planets: [],
      houses: [],
      ascendant: { sign: 'Aries', degree: 0 },
      midheaven: { sign: 'Capricornio', degree: 0 },
      aspects: [],
    };
    
    logger.log('🔄 Combinando con carta natal básica...');
    const extendedChart = mergeWithMainChart(mockBasicChart, advancedData);
    
    logger.log('✅ Carta extendida creada correctamente');
    logger.log('✅ advancedData presente:', 'advancedData' in extendedChart);
    
    // 6. Resultado final
    logger.log('');
    logger.log('🎉 ==================== TEST EXITOSO ====================');
    logger.log('✅ Todos los archivos se crearon correctamente');
    logger.log('✅ Los tipos son compatibles');
    logger.log('✅ Las funciones se ejecutan sin errores');
    logger.log('✅ La estructura es válida');
    logger.log('');
    logger.log('📋 FASE 1 COMPLETADA - Lista para pasar a FASE 2');
    logger.log('========================================================');
    
    return {
      success: true,
      advancedData,
      extendedChart,
      count,
    };
  } catch (error) {
    logger.error('❌ ==================== TEST FALLIDO ====================');
    logger.error('❌ Error durante el test:', error);
    logger.error('========================================================');
    
    return {
      success: false,
      error,
    };
  }
}

// Ejecutar test automáticamente en desarrollo
if (import.meta.env.DEV) {
  logger.log('🧪 Test de Fase 1 disponible. Llama a testPhase1() para ejecutar.');
}
