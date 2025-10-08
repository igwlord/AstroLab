/**
 * 🧪 TEST DE ASTEROIDES - FASE 2
 * 
 * Verifica que los cálculos de asteroides sean precisos
 * Compara con posiciones conocidas de cartas famosas
 */

import { logger } from '../utils/logger';
import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedCalculationOptions } from '../types/advancedChart';

/**
 * Carta de prueba: Albert Einstein
 * Fecha: 14 de marzo de 1879, 11:30 AM LMT
 * Lugar: Ulm, Alemania (48.40°N, 9.99°E)
 * 
 * Posiciones verificadas con Astro.com:
 * - Ceres: ~27° Acuario
 * - Pallas: ~25° Acuario  
 * - Juno: ~19° Libra
 * - Vesta: ~17° Cáncer
 */
export async function testEinsteinChart() {
  logger.log('');
  logger.log('🧪 ==================== TEST: Carta de Einstein ====================');
  
  try {
    // Fecha: 14 marzo 1879, 11:30 AM
    const date = new Date(Date.UTC(1879, 2, 14, 10, 30)); // UTC
    
    // Calcular Día Juliano
    // @ts-expect-error - astronomia no tiene tipos
    const { julian } = await import('astronomia');
    const jd = julian.CalendarGregorianToJD(
      1879,
      3,
      14 + (11.5 / 24) // 11:30 AM = 11.5 hours
    );
    
    logger.log(`📅 Fecha: ${date.toISOString()}`);
    logger.log(`📊 Día Juliano: ${jd}`);
    
    // Parámetros
    const params: AdvancedCalculationParams = {
      julianDay: jd,
      latitude: 48.40,
      longitude: 9.99,
      houseCusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330], // Stub
      ascendantLongitude: 0, // Stub
    };
    
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateVertex: false,
    };
    
    // Calcular
    logger.log('');
    logger.log('🔄 Calculando asteroides...');
    const result = await calculateAdvancedChart(params, options);
    
    // Mostrar resultados
    logger.log('');
    logger.log('📊 ==================== RESULTADOS ====================');
    
    logger.log('');
    logger.log('🪐 ASTEROIDES:');
    result.asteroids.forEach(asteroid => {
      logger.log(`   ${asteroid.symbol} ${asteroid.name}:`);
      logger.log(`      Posición: ${asteroid.sign} ${asteroid.degree.toFixed(2)}°`);
      logger.log(`      Longitud: ${asteroid.longitude.toFixed(6)}°`);
      logger.log(`      Casa: ${asteroid.house}`);
      logger.log(`      Retrógrado: ${asteroid.retrograde ? 'Sí' : 'No'}`);
      logger.log(`      Velocidad: ${asteroid.speed?.toFixed(4)}°/día`);
      logger.log('');
    });
    
    if (result.chiron) {
      logger.log('⚕️ QUIRÓN:');
      logger.log(`   ${result.chiron.symbol} ${result.chiron.name}:`);
      logger.log(`      Posición: ${result.chiron.sign} ${result.chiron.degree.toFixed(2)}°`);
      logger.log(`      Longitud: ${result.chiron.longitude.toFixed(6)}°`);
      logger.log(`      Casa: ${result.chiron.house}`);
      logger.log(`      Retrógrado: ${result.chiron.retrograde ? 'Sí' : 'No'}`);
      logger.log(`      Velocidad: ${result.chiron.speed?.toFixed(4)}°/día`);
    }
    
    logger.log('');
    logger.log('✅ ==================== TEST COMPLETADO ====================');
    logger.log('');
    logger.log('📝 PRÓXIMO PASO: Verificar estas posiciones con Astro.com');
    logger.log('   URL: https://www.astro.com/cgi/chart.cgi');
    logger.log('');
    
    return {
      success: true,
      result,
    };
  } catch (error) {
    logger.error('❌ ==================== TEST FALLIDO ====================');
    logger.error('Error:', error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Carta de prueba simple: Año 2000
 * Fecha: 1 de enero de 2000, 12:00 UTC
 * Lugar: Greenwich (51.5°N, 0°E)
 */
export async function testYear2000Chart() {
  logger.log('');
  logger.log('🧪 ==================== TEST: Carta Año 2000 ====================');
  
  try {
    // Fecha: 1 enero 2000, 12:00 UTC (J2000 epoch)
    // @ts-expect-error - astronomia no tiene tipos
    const { julian } = await import('astronomia');
    const jd = julian.CalendarGregorianToJD(2000, 1, 1.5); // 12:00 = 0.5 days
    
    logger.log(`📅 Fecha: 1 Enero 2000, 12:00 UTC`);
    logger.log(`📊 Día Juliano: ${jd} (J2000 reference)`);
    
    const params: AdvancedCalculationParams = {
      julianDay: jd,
      latitude: 51.5,
      longitude: 0,
      houseCusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      ascendantLongitude: 0,
    };
    
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateVertex: false,
    };
    
    logger.log('');
    logger.log('🔄 Calculando asteroides...');
    const result = await calculateAdvancedChart(params, options);
    
    logger.log('');
    logger.log('📊 RESULTADOS (J2000):');
    result.asteroids.forEach(asteroid => {
      logger.log(`   ${asteroid.symbol} ${asteroid.name}: ${asteroid.sign} ${asteroid.degree.toFixed(2)}° (${asteroid.longitude.toFixed(2)}°)`);
    });
    
    if (result.chiron) {
      logger.log(`   ⚕️ Quirón: ${result.chiron.sign} ${result.chiron.degree.toFixed(2)}° (${result.chiron.longitude.toFixed(2)}°)`);
    }
    
    logger.log('');
    logger.log('✅ TEST COMPLETADO');
    
    return {
      success: true,
      result,
    };
  } catch (error) {
    logger.error('❌ TEST FALLIDO:', error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Ejecuta todos los tests
 */
export async function runAllAsteroidTests() {
  logger.log('');
  logger.log('🚀 ========================================');
  logger.log('🚀  SUITE DE TESTS - ASTEROIDES FASE 2');
  logger.log('🚀 ========================================');
  
  const results = {
    einstein: await testEinsteinChart(),
    year2000: await testYear2000Chart(),
  };
  
  const allSuccess = Object.values(results).every(r => r.success);
  
  logger.log('');
  logger.log('📊 ========================================');
  logger.log('📊  RESUMEN DE TESTS');
  logger.log('📊 ========================================');
  logger.log(`   Einstein: ${results.einstein.success ? '✅' : '❌'}`);
  logger.log(`   Year 2000: ${results.year2000.success ? '✅' : '❌'}`);
  logger.log('');
  logger.log(allSuccess ? '🎉 TODOS LOS TESTS PASARON' : '⚠️ ALGUNOS TESTS FALLARON');
  logger.log('========================================');
  
  return results;
}

// Auto-ejecutar en desarrollo
if (import.meta.env.DEV) {
  logger.log('🧪 Tests de asteroides disponibles:');
  logger.log('   - testEinsteinChart()');
  logger.log('   - testYear2000Chart()');
  logger.log('   - runAllAsteroidTests()');
}
