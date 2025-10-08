/**
 * TEST PHASE 6: Nodos Lunares (Norte y Sur) - Validación
 * 
 * Este archivo contiene tests para validar la correcta implementación
 * del cálculo de los Nodos Lunares usando Swiss Ephemeris.
 * 
 * CONCEPTOS IMPORTANTES:
 * ----------------------
 * - NODO NORTE (☊): Punto donde la Luna cruza la eclíptica ascendiendo
 * - NODO SUR (☋): Punto opuesto al Nodo Norte (180°)
 * - Representan: karma, destino, propósito del alma
 * - Nodo Norte: hacia dónde debemos crecer
 * - Nodo Sur: experiencias pasadas, zona de confort
 * - Los Nodos se mueven RETRÓGRADOS (hacia atrás en el zodiaco)
 * - Nodo Verdadero (TRUE_NODE) vs Nodo Medio (MEAN_NODE)
 * 
 * Casos de prueba:
 * 1. Einstein: Carta histórica conocida
 * 2. Y2000: Carta de referencia moderna
 * 3. Fecha actual: Para debugging en vivo
 * 
 * INSTRUCCIONES PARA VALIDACIÓN MANUAL:
 * -------------------------------------------
 * 1. Ejecutar: npm run test:nodes (o copiar en consola dev)
 * 2. Comparar resultados con Astro.com:
 *    - Ir a: https://www.astro.com/cgi/genchart.cgi
 *    - Los Nodos aparecen automáticamente en las cartas
 *    - Comparar posición de Nodo Norte
 *    - Verificar que Nodo Sur esté opuesto (180°)
 * 
 * VALIDACIONES AUTOMÁTICAS:
 * -------------------------
 * 1. Oposición exacta: Norte y Sur deben estar a 180° (±0.5°)
 * 2. Signos opuestos: Aries↔Libra, Tauro↔Escorpio, etc.
 * 3. Casas opuestas: Diferencia de ~6 casas (puede variar según sistema)
 * 
 * @module tests/testNodes
 */

import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedPoint } from '../types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import * as julian from 'astronomia/julian';

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Calcula la diferencia angular entre dos longitudes
 */
function angleDifference(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Verifica si dos puntos están opuestos (180° ±0.5°)
 */
function areOpposite(lon1: number, lon2: number): boolean {
  const diff = angleDifference(lon1, lon2);
  return Math.abs(diff - 180) < 0.5;
}

/**
 * Signos opuestos en el zodiaco
 */
const OPPOSITE_SIGNS: Record<string, string> = {
  'Aries': 'Libra',
  'Tauro': 'Escorpio',
  'Géminis': 'Sagitario',
  'Cáncer': 'Capricornio',
  'Leo': 'Acuario',
  'Virgo': 'Piscis',
  'Libra': 'Aries',
  'Escorpio': 'Tauro',
  'Sagitario': 'Géminis',
  'Capricornio': 'Cáncer',
  'Acuario': 'Leo',
  'Piscis': 'Virgo',
};

/**
 * Verifica si dos signos son opuestos
 */
function areOppositeSign(sign1: string, sign2: string): boolean {
  return OPPOSITE_SIGNS[sign1] === sign2;
}

// ============================================================================
// TEST 1: Albert Einstein (Carta Natal Histórica)
// ============================================================================

/**
 * Test de Nodos Lunares en la carta de Einstein
 * 
 * Datos conocidos:
 * - Nacimiento: 14 Marzo 1879, 11:30 LMT
 * - Lugar: Ulm, Alemania (48°24'N, 9°59'E)
 * 
 * Los Nodos Lunares tienen un ciclo de aproximadamente 18.6 años.
 * Para 1879, verificaremos que Norte y Sur estén opuestos.
 * 
 * @returns Promise<void>
 */
export async function testEinsteinNodes(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 1: NODOS LUNARES EN CARTA DE EINSTEIN');
  console.log('='.repeat(80) + '\n');

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

    console.log('📐 Día Juliano:', julianDay.toFixed(6));
    console.log('');

    // Mock de cúspides de casas
    const mockHouseCusps = [
      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 0,
    };

    console.log('⏳ Calculando Nodos Lunares con Swiss Ephemeris...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: true,
      calculateVertex: false,
    });

    const northNode = result.specialPoints.northNode;
    const southNode = result.specialPoints.southNode;

    if (!northNode || !southNode) {
      console.error('❌ ERROR: No se calcularon los Nodos Lunares');
      return;
    }

    // Mostrar resultados
    console.log('✅ NODOS LUNARES CALCULADOS:');
    console.log('─'.repeat(80));
    displayNodeData('NODO NORTE ☊', northNode);
    console.log('');
    displayNodeData('NODO SUR ☋', southNode);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones automáticas
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    // 1. Verificar oposición 180°
    const diff = angleDifference(northNode.longitude, southNode.longitude);
    const isOpposite = areOpposite(northNode.longitude, southNode.longitude);
    console.log(`   Diferencia angular: ${diff.toFixed(2)}° (debe ser ~180°)`);
    console.log(`   ¿Están opuestos?: ${isOpposite ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

    // 2. Verificar signos opuestos
    const oppositeSignsMatch = areOppositeSign(northNode.sign, southNode.sign);
    console.log(`   Signos: ${northNode.sign} ↔ ${southNode.sign}`);
    console.log(`   ¿Signos opuestos?: ${oppositeSignsMatch ? '✅ SÍ' : '❌ NO (Esperado: ' + OPPOSITE_SIGNS[northNode.sign] + ')'}`);
    console.log('');

    // 3. Diferencia de casas
    const houseDiff = Math.abs(northNode.house - southNode.house);
    console.log(`   Casa Nodo Norte: ${northNode.house}`);
    console.log(`   Casa Nodo Sur: ${southNode.house}`);
    console.log(`   Diferencia de casas: ${houseDiff} (típicamente ~6)`);
    console.log('─'.repeat(80));
    console.log('');

    // Resultado final
    if (isOpposite && oppositeSignsMatch) {
      console.log('✅ TODAS LAS VALIDACIONES PASARON');
    } else {
      console.log('⚠️ ALGUNAS VALIDACIONES FALLARON - Revisar implementación');
    }
    console.log('');

    console.log('🔍 VALIDACIÓN MANUAL:');
    console.log('   1. Ir a https://www.astro.com/cgi/genchart.cgi');
    console.log('   2. Introducir: 14 Mar 1879, 11:30, Ulm, Germany');
    console.log('   3. Los Nodos aparecen automáticamente en la carta');
    console.log('   4. Comparar posición del Nodo Norte (☊)');
    console.log('   5. Verificar que Nodo Sur esté opuesto');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 2: Carta Y2000 (Año 2000 - Referencia Moderna)
// ============================================================================

/**
 * Test de Nodos Lunares para el año 2000
 * 
 * Datos:
 * - Fecha: 1 Enero 2000, 12:00 UTC
 * - Lugar: Greenwich (0°, 0°)
 * 
 * @returns Promise<void>
 */
export async function testY2000Nodes(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 2: NODOS LUNARES EN CARTA Y2000 (1 ENERO 2000)');
  console.log('='.repeat(80) + '\n');

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

    console.log('📐 Día Juliano:', julianDay.toFixed(6));
    console.log('');

    const mockHouseCusps = [
      15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 15,
    };

    console.log('⏳ Calculando Nodos Lunares...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: true,
      calculateVertex: false,
    });

    const northNode = result.specialPoints.northNode;
    const southNode = result.specialPoints.southNode;

    if (!northNode || !southNode) {
      console.error('❌ ERROR: No se calcularon los Nodos Lunares');
      return;
    }

    console.log('✅ NODOS LUNARES CALCULADOS:');
    console.log('─'.repeat(80));
    displayNodeData('NODO NORTE ☊', northNode);
    console.log('');
    displayNodeData('NODO SUR ☋', southNode);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    const diff = angleDifference(northNode.longitude, southNode.longitude);
    const isOpposite = areOpposite(northNode.longitude, southNode.longitude);
    console.log(`   Diferencia angular: ${diff.toFixed(2)}° (debe ser ~180°)`);
    console.log(`   ¿Están opuestos?: ${isOpposite ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

    const oppositeSignsMatch = areOppositeSign(northNode.sign, southNode.sign);
    console.log(`   Signos: ${northNode.sign} ↔ ${southNode.sign}`);
    console.log(`   ¿Signos opuestos?: ${oppositeSignsMatch ? '✅ SÍ' : '❌ NO'}`);
    console.log('─'.repeat(80));
    console.log('');

    if (isOpposite && oppositeSignsMatch) {
      console.log('✅ TODAS LAS VALIDACIONES PASARON');
    } else {
      console.log('⚠️ ALGUNAS VALIDACIONES FALLARON');
    }
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 3: Fecha Actual (Debug en Vivo)
// ============================================================================

/**
 * Test de Nodos Lunares para la fecha actual
 * Útil para debugging y verificación rápida
 * 
 * @returns Promise<void>
 */
export async function testCurrentDateNodes(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 3: NODOS LUNARES EN FECHA ACTUAL');
  console.log('='.repeat(80) + '\n');

  const now = new Date();
  const birthDate = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };

  const location = {
    latitude: 40.4168, // Madrid
    longitude: -3.7038,
    name: 'Madrid, España',
  };

  console.log('📅 Fecha:', now.toLocaleString('es-ES'));
  console.log('📍 Lugar:', location.name);
  console.log('');

  try {
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    console.log('📐 Día Juliano:', julianDay.toFixed(6));
    console.log('');

    const mockHouseCusps = [
      45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345, 15
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 45,
    };

    console.log('⏳ Calculando Nodos Lunares...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: true,
      calculateVertex: false,
    });

    const northNode = result.specialPoints.northNode;
    const southNode = result.specialPoints.southNode;

    if (!northNode || !southNode) {
      console.error('❌ ERROR: No se calcularon los Nodos Lunares');
      return;
    }

    console.log('✅ NODOS LUNARES CALCULADOS:');
    console.log('─'.repeat(80));
    displayNodeData('NODO NORTE ☊', northNode);
    console.log('');
    displayNodeData('NODO SUR ☋', southNode);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones rápidas
    const isOpposite = areOpposite(northNode.longitude, southNode.longitude);
    const oppositeSignsMatch = areOppositeSign(northNode.sign, southNode.sign);
    
    console.log(`🔍 Validación: ${isOpposite && oppositeSignsMatch ? '✅ OK' : '⚠️ Revisar'}`);
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// UTILIDADES DE VISUALIZACIÓN
// ============================================================================

/**
 * Muestra los datos de un Nodo en formato legible
 */
function displayNodeData(title: string, node: AdvancedPoint): void {
  console.log(`   ${title}:`);
  console.log(`   ├─ Nombre:       ${node.name} (${node.symbol})`);
  console.log(`   ├─ Longitud:     ${node.longitude.toFixed(4)}°`);
  console.log(`   ├─ Signo:        ${node.sign}`);
  console.log(`   ├─ Grados:       ${node.degree.toFixed(2)}° ${node.sign}`);
  console.log(`   ├─ Casa:         Casa ${node.house}`);
  console.log(`   └─ Significado:  ${node.meaning?.substring(0, 50)}...`);
}

// ============================================================================
// EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta todos los tests de Nodos Lunares en secuencia
 */
export async function runAllNodesTests(): Promise<void> {
  console.clear();
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + '🌙 TEST SUITE: NODOS LUNARES 🌙' + ' '.repeat(24) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testEinsteinNodes();
    await testY2000Nodes();
    await testCurrentDateNodes();

    console.log('\n' + '='.repeat(80));
    console.log('✅ TODOS LOS TESTS COMPLETADOS');
    console.log('='.repeat(80));
    console.log('\n📋 RESUMEN:');
    console.log('   1. Nodos calculados con Swiss Ephemeris (TRUE_NODE)');
    console.log('   2. Nodo Norte y Sur SIEMPRE opuestos (180°)');
    console.log('   3. Signos zodiacales opuestos verificados');
    console.log('   4. Los Nodos se mueven retrógrados (hacia atrás)');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   1. Verificar que todos los tests pasen');
    console.log('   2. Validar manualmente contra Astro.com si es necesario');
    console.log('   3. Confirmar oposición exacta de 180°');
    console.log('   4. Crear script integrado para probar TODA la config avanzada');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO TESTS:', error);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  testEinsteinNodes,
  testY2000Nodes,
  testCurrentDateNodes,
  runAllNodesTests,
};
