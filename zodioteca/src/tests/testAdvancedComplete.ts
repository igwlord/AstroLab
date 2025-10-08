/**
 * 🚀 TEST SUITE COMPLETO - CONFIGURACIÓN AVANZADA
 * 
 * Este archivo ejecuta TODOS los tests de configuración avanzada en un solo comando.
 * 
 * ELEMENTOS PROBADOS:
 * ===================
 * ✅ FASE 2: Asteroides (Ceres, Pallas, Juno, Vesta)
 * ✅ FASE 3: Quirón (centauro sanador)
 * ✅ FASE 4: Medio Cielo (MC) e Immum Coeli (IC)
 * ✅ FASE 5: Parte de la Fortuna (punto árabe)
 * ✅ FASE 6: Nodos Lunares (Norte ☊ y Sur ☋)
 * 
 * INSTRUCCIONES:
 * ==============
 * 
 * OPCIÓN 1 - Consola del navegador:
 * 1. Abrir http://localhost:5174
 * 2. Abrir DevTools (F12) → Console
 * 3. Copiar y pegar:
 *    ```javascript
 *    const tests = await import('./tests/testAdvancedComplete.ts');
 *    await tests.runAllAdvancedTests();
 *    ```
 * 
 * OPCIÓN 2 - Tests individuales:
 * ```javascript
 * const tests = await import('./tests/testAdvancedComplete.ts');
 * await tests.testEinsteinComplete();      // Carta completa de Einstein
 * await tests.testY2000Complete();         // Carta Y2000 completa
 * await tests.testQuickValidation();       // Validación rápida
 * ```
 * 
 * QUÉ VERÁS:
 * ==========
 * - Resumen de TODOS los cálculos avanzados
 * - 4 asteroides principales
 * - Quirón
 * - MC e IC (opuestos 180°)
 * - Parte de Fortuna (diurna/nocturna)
 * - Nodos Lunares (opuestos 180°)
 * - Validaciones automáticas
 * - Tiempo de ejecución
 * 
 * @module tests/testAdvancedComplete
 */

import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedChartData } from '../types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import * as julian from 'astronomia/julian';

// ============================================================================
// TEST 1: CARTA COMPLETA DE EINSTEIN
// ============================================================================

/**
 * Test completo con TODOS los elementos avanzados en la carta de Einstein
 * 
 * @returns Promise<void>
 */
export async function testEinsteinComplete(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('🧪 TEST COMPLETO: CONFIGURACIÓN AVANZADA - EINSTEIN');
  console.log('═'.repeat(80) + '\n');

  const birthDate = {
    year: 1879,
    month: 3,
    day: 14,
    hour: 11,
    minute: 30,
  };

  const location = {
    latitude: 48.40,
    longitude: 9.99,
    name: 'Ulm, Alemania',
  };

  console.log('📅 Fecha:', `${birthDate.day}/${birthDate.month}/${birthDate.year} ${birthDate.hour}:${birthDate.minute} LMT`);
  console.log('📍 Lugar:', location.name, `(${location.latitude}°N, ${location.longitude}°E)`);
  console.log('');

  try {
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    // Mock de cúspides y posiciones (en producción vienen del cálculo real)
    const mockHouseCusps = [
      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 90,
      sunLongitude: 353,    // Sol en Piscis (aprox 14 Mar)
      moonLongitude: 225,   // Luna en Escorpio (aprox)
    };

    console.log('⏳ Calculando TODA la configuración avanzada...\n');
    console.log('🔧 Elementos a calcular:');
    console.log('   • Asteroides principales (Ceres, Pallas, Juno, Vesta)');
    console.log('   • Quirón');
    console.log('   • Medio Cielo (MC) e Immum Coeli (IC)');
    console.log('   • Parte de la Fortuna');
    console.log('   • Nodos Lunares (Norte y Sur)');
    console.log('');

    const startTime = Date.now();
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: true,
      calculatePartOfFortune: true,
      calculateNodes: true,
      calculateVertex: false,
    });

    const elapsedTime = Date.now() - startTime;

    // Mostrar resultados completos
    displayCompleteResults(result, elapsedTime);

    // Validaciones automáticas
    validateResults(result);

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 2: CARTA COMPLETA Y2000
// ============================================================================

/**
 * Test completo para el año 2000
 * 
 * @returns Promise<void>
 */
export async function testY2000Complete(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('🧪 TEST COMPLETO: CONFIGURACIÓN AVANZADA - Y2000');
  console.log('═'.repeat(80) + '\n');

  const birthDate = {
    year: 2000,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  };

  const location = {
    latitude: 0.0,
    longitude: 0.0,
    name: 'Greenwich, UK',
  };

  console.log('📅 Fecha:', `${birthDate.day}/${birthDate.month}/${birthDate.year} ${birthDate.hour}:${birthDate.minute} UTC`);
  console.log('📍 Lugar:', location.name, '(0°, 0°)');
  console.log('');

  try {
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    const mockHouseCusps = [
      15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 15,
      sunLongitude: 280,    // Sol en Capricornio (1 Ene)
      moonLongitude: 120,   // Luna en Leo (aprox)
    };

    console.log('⏳ Calculando configuración avanzada completa...\n');

    const startTime = Date.now();
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: true,
      calculatePartOfFortune: true,
      calculateNodes: true,
      calculateVertex: false,
    });

    const elapsedTime = Date.now() - startTime;

    displayCompleteResults(result, elapsedTime);
    validateResults(result);

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 3: VALIDACIÓN RÁPIDA
// ============================================================================

/**
 * Test rápido que valida solo integridad de datos
 * 
 * @returns Promise<void>
 */
export async function testQuickValidation(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('⚡ VALIDACIÓN RÁPIDA - INTEGRIDAD DE DATOS');
  console.log('═'.repeat(80) + '\n');

  try {
    const julianDay = julian.CalendarGregorianToJD(2000, 1, 1, 12);

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: 40.0,
      longitude: -3.0,
      houseCusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
      ascendantLongitude: 0,
      sunLongitude: 280,
      moonLongitude: 120,
    };

    console.log('⏳ Ejecutando cálculos...\n');

    const startTime = Date.now();
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: true,
      calculateChiron: true,
      calculateMidheaven: true,
      calculatePartOfFortune: true,
      calculateNodes: true,
      calculateVertex: false,
    });

    const elapsedTime = Date.now() - startTime;

    console.log('✅ VALIDACIÓN DE INTEGRIDAD:');
    console.log('─'.repeat(80));
    console.log(`   ✓ Asteroides: ${result.asteroids.length}/4`);
    console.log(`   ✓ Quirón: ${result.chiron ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ MC: ${result.specialPoints.midheaven ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ IC: ${result.specialPoints.imumCoeli ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ Fortuna: ${result.specialPoints.partOfFortune ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ Nodo Norte: ${result.specialPoints.northNode ? 'OK' : 'FALTA'}`);
    console.log(`   ✓ Nodo Sur: ${result.specialPoints.southNode ? 'OK' : 'FALTA'}`);
    console.log(`   ⏱️  Tiempo: ${elapsedTime}ms`);
    console.log('─'.repeat(80));
    console.log('');

    const allOK = 
      result.asteroids.length === 4 &&
      result.chiron &&
      result.specialPoints.midheaven &&
      result.specialPoints.imumCoeli &&
      result.specialPoints.partOfFortune &&
      result.specialPoints.northNode &&
      result.specialPoints.southNode;

    if (allOK) {
      console.log('✅ TODOS LOS ELEMENTOS CALCULADOS CORRECTAMENTE\n');
    } else {
      console.log('⚠️ ALGUNOS ELEMENTOS FALTAN - REVISAR IMPLEMENTACIÓN\n');
    }

  } catch (error) {
    console.error('❌ ERROR EN VALIDACIÓN:', error);
  }
}

// ============================================================================
// UTILIDADES DE VISUALIZACIÓN
// ============================================================================

/**
 * Muestra todos los resultados de forma organizada
 */
function displayCompleteResults(result: AdvancedChartData, elapsedTime: number): void {
  console.log('\n' + '═'.repeat(80));
  console.log('📊 RESULTADOS COMPLETOS DE CONFIGURACIÓN AVANZADA');
  console.log('═'.repeat(80) + '\n');

  // Asteroides
  console.log('🌟 ASTEROIDES PRINCIPALES:');
  console.log('─'.repeat(80));
  if (result.asteroids.length > 0) {
    result.asteroids.forEach(asteroid => {
      console.log(`   ${asteroid.symbol} ${asteroid.name}: ${asteroid.sign} ${asteroid.degree.toFixed(2)}° (Casa ${asteroid.house}) ${asteroid.retrograde ? 'R' : ''}`);
    });
  } else {
    console.log('   (No calculados)');
  }
  console.log('');

  // Quirón
  console.log('⚷ QUIRÓN:');
  console.log('─'.repeat(80));
  if (result.chiron) {
    console.log(`   ${result.chiron.symbol} ${result.chiron.name}: ${result.chiron.sign} ${result.chiron.degree.toFixed(2)}° (Casa ${result.chiron.house}) ${result.chiron.retrograde ? 'R' : ''}`);
  } else {
    console.log('   (No calculado)');
  }
  console.log('');

  // Medio Cielo e IC
  console.log('🏔️ ÁNGULOS:');
  console.log('─'.repeat(80));
  if (result.specialPoints.midheaven) {
    console.log(`   MC ${result.specialPoints.midheaven.symbol}: ${result.specialPoints.midheaven.sign} ${result.specialPoints.midheaven.degree.toFixed(2)}° (Casa ${result.specialPoints.midheaven.house})`);
  }
  if (result.specialPoints.imumCoeli) {
    console.log(`   IC ${result.specialPoints.imumCoeli.symbol}: ${result.specialPoints.imumCoeli.sign} ${result.specialPoints.imumCoeli.degree.toFixed(2)}° (Casa ${result.specialPoints.imumCoeli.house})`);
  }
  console.log('');

  // Parte de Fortuna
  console.log('💰 PARTE DE LA FORTUNA:');
  console.log('─'.repeat(80));
  if (result.specialPoints.partOfFortune) {
    const fortune = result.specialPoints.partOfFortune;
    console.log(`   ${fortune.symbol} ${fortune.name}: ${fortune.sign} ${fortune.degree.toFixed(2)}° (Casa ${fortune.house})`);
    console.log(`   Fórmula: ${fortune.formula}`);
  } else {
    console.log('   (No calculado)');
  }
  console.log('');

  // Nodos Lunares
  console.log('🌙 NODOS LUNARES:');
  console.log('─'.repeat(80));
  if (result.specialPoints.northNode) {
    console.log(`   ☊ Nodo Norte: ${result.specialPoints.northNode.sign} ${result.specialPoints.northNode.degree.toFixed(2)}° (Casa ${result.specialPoints.northNode.house})`);
  }
  if (result.specialPoints.southNode) {
    console.log(`   ☋ Nodo Sur: ${result.specialPoints.southNode.sign} ${result.specialPoints.southNode.degree.toFixed(2)}° (Casa ${result.specialPoints.southNode.house})`);
  }
  console.log('');

  // Metadata
  console.log('📋 METADATA:');
  console.log('─'.repeat(80));
  console.log(`   Calculado: ${new Date(result.calculatedAt).toLocaleString('es-ES')}`);
  console.log(`   Versión: ${result.version}`);
  console.log(`   Tiempo de cálculo: ${elapsedTime}ms`);
  console.log('═'.repeat(80) + '\n');
}

/**
 * Valida la integridad y coherencia de los resultados
 */
function validateResults(result: AdvancedChartData): void {
  console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
  console.log('─'.repeat(80));

  let errors = 0;

  // Validar asteroides
  if (result.asteroids.length !== 4) {
    console.log(`   ❌ Asteroides: ${result.asteroids.length}/4 (deberían ser 4)`);
    errors++;
  } else {
    console.log(`   ✅ Asteroides: 4/4 calculados`);
  }

  // Validar Quirón
  if (!result.chiron) {
    console.log(`   ❌ Quirón: No calculado`);
    errors++;
  } else {
    console.log(`   ✅ Quirón: Calculado`);
  }

  // Validar MC e IC opuestos
  if (result.specialPoints.midheaven && result.specialPoints.imumCoeli) {
    const mcLon = result.specialPoints.midheaven.longitude;
    const icLon = result.specialPoints.imumCoeli.longitude;
    const diff = Math.abs(mcLon - icLon);
    const isOpposite = Math.abs(diff - 180) < 0.5;
    
    if (isOpposite) {
      console.log(`   ✅ MC/IC: Opuestos (${diff.toFixed(2)}°)`);
    } else {
      console.log(`   ❌ MC/IC: NO opuestos (${diff.toFixed(2)}° en vez de 180°)`);
      errors++;
    }
  } else {
    console.log(`   ❌ MC/IC: No calculados`);
    errors++;
  }

  // Validar Parte de Fortuna
  if (!result.specialPoints.partOfFortune) {
    console.log(`   ❌ Parte de Fortuna: No calculada`);
    errors++;
  } else {
    console.log(`   ✅ Parte de Fortuna: Calculada`);
  }

  // Validar Nodos opuestos
  if (result.specialPoints.northNode && result.specialPoints.southNode) {
    const northLon = result.specialPoints.northNode.longitude;
    const southLon = result.specialPoints.southNode.longitude;
    const diff = Math.abs(northLon - southLon);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    const isOpposite = Math.abs(normalizedDiff - 180) < 0.5;
    
    if (isOpposite) {
      console.log(`   ✅ Nodos: Opuestos (${normalizedDiff.toFixed(2)}°)`);
    } else {
      console.log(`   ❌ Nodos: NO opuestos (${normalizedDiff.toFixed(2)}° en vez de 180°)`);
      errors++;
    }
  } else {
    console.log(`   ❌ Nodos: No calculados`);
    errors++;
  }

  console.log('─'.repeat(80));
  console.log('');

  if (errors === 0) {
    console.log('✅ TODAS LAS VALIDACIONES PASARON\n');
  } else {
    console.log(`⚠️ ${errors} ERROR(ES) ENCONTRADO(S) - REVISAR IMPLEMENTACIÓN\n`);
  }
}

// ============================================================================
// EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta TODOS los tests de configuración avanzada
 */
export async function runAllAdvancedTests(): Promise<void> {
  console.clear();
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(12) + '🚀 TEST SUITE COMPLETO: CONFIGURACIÓN AVANZADA 🚀' + ' '.repeat(12) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testQuickValidation();
    await testEinsteinComplete();
    await testY2000Complete();

    console.log('\n' + '═'.repeat(80));
    console.log('🎉 TODOS LOS TESTS COMPLETADOS');
    console.log('═'.repeat(80));
    console.log('\n📋 ELEMENTOS PROBADOS:');
    console.log('   ✅ Asteroides (Ceres, Pallas, Juno, Vesta)');
    console.log('   ✅ Quirón');
    console.log('   ✅ Medio Cielo (MC) e Immum Coeli (IC)');
    console.log('   ✅ Parte de la Fortuna');
    console.log('   ✅ Nodos Lunares (Norte y Sur)');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   1. Validar manualmente contra Astro.com si es necesario');
    console.log('   2. Integrar con interfaz de usuario (Fase 8)');
    console.log('   3. Añadir traducciones i18n (Fase 10)');
    console.log('   4. Implementar almacenamiento (Fase 11)');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO TESTS:', error);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  testEinsteinComplete,
  testY2000Complete,
  testQuickValidation,
  runAllAdvancedTests,
};
