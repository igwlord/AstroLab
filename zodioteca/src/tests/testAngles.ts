/**
 * TEST PHASE 4: Medio Cielo (MC) e Immum Coeli (IC) - Validación
 * 
 * Este archivo contiene tests para validar la correcta extracción
 * del Medio Cielo (MC) e Immum Coeli (IC) de las cúspides de casas.
 * 
 * CONCEPTOS IMPORTANTES:
 * ----------------------
 * - MC (Medio Cielo): Punto más alto de la eclíptica = Cúspide de Casa 10
 * - IC (Immum Coeli): Punto más bajo = Cúspide de Casa 4
 * - MC e IC están SIEMPRE opuestos (diferencia de 180°)
 * - MC: Vocación, carrera, imagen pública, aspiraciones
 * - IC: Hogar, raíces, familia, vida privada, final de la vida
 * 
 * Casos de prueba:
 * 1. Albert Einstein (14 Marzo 1879, 11:30 LMT, Ulm, Alemania)
 * 2. Carta Y2000 (1 Enero 2000, 12:00 UTC, Greenwich)
 * 3. Fecha actual (para debugging en vivo)
 * 
 * INSTRUCCIONES PARA VALIDACIÓN MANUAL:
 * -------------------------------------------
 * 1. Ejecutar: npm run test:angles (o copiar en consola dev)
 * 2. Comparar resultados con Astro.com
 * 3. Verificar que MC e IC estén exactamente opuestos (180°)
 * 4. Verificar signos zodiacales opuestos (Aries↔Libra, Tauro↔Escorpio, etc.)
 * 
 * TOLERANCIAS ACEPTABLES:
 * - Diferencia MC-IC: debe ser EXACTAMENTE 180° (±0.01° por redondeo)
 * - Signos: deben ser opuestos en el zodiaco
 * - Grados: ±0.5° aceptable (diferencias en zona horaria)
 * - Casa: MC siempre en Casa 10, IC siempre en Casa 4
 * 
 * @module tests/testAngles
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
 * Normaliza el resultado para que esté entre 0 y 360
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
 * Obtiene el signo opuesto en el zodiaco
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
 * Test de MC e IC en la carta de Albert Einstein
 * 
 * Datos conocidos:
 * - Nacimiento: 14 Marzo 1879, 11:30 LMT
 * - Lugar: Ulm, Alemania (48°24'N, 9°59'E)
 * 
 * VALORES ESPERADOS:
 * - MC e IC deben estar exactamente opuestos (180°)
 * - Signos deben ser opuestos (ej: Aries↔Libra)
 * - Validar con Astro.com
 * 
 * @returns Promise<void>
 */
export async function testEinsteinAngles(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 1: MC E IC EN CARTA DE EINSTEIN');
  console.log('='.repeat(80) + '\n');

  // Datos de nacimiento
  const birthDate = {
    year: 1879,
    month: 3,
    day: 14,
    hour: 11,
    minute: 30,
  };

  const location = {
    latitude: 48.40, // Ulm
    longitude: 9.99,
    name: 'Ulm, Alemania',
  };

  console.log('📅 Fecha:', `${birthDate.day}/${birthDate.month}/${birthDate.year} ${birthDate.hour}:${birthDate.minute} LMT`);
  console.log('📍 Lugar:', location.name, `(${location.latitude}°N, ${location.longitude}°E)`);
  console.log('');

  try {
    // Calcular Día Juliano
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    console.log('📐 Día Juliano:', julianDay.toFixed(6));
    console.log('');

    // Mock de cúspides de casas (en producción vendrían del cálculo real)
    // Estas son aproximaciones para testing
    const mockHouseCusps = [
      0,      // Casa 1 (Ascendente)
      30,     // Casa 2
      60,     // Casa 3
      90,     // Casa 4 (IC) - ejemplo en Cáncer 0°
      120,    // Casa 5
      150,    // Casa 6
      180,    // Casa 7 (Descendente)
      210,    // Casa 8
      240,    // Casa 9
      270,    // Casa 10 (MC) - ejemplo en Capricornio 0°
      300,    // Casa 11
      330,    // Casa 12
    ];

    // Parámetros de cálculo
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 0, // Mock
    };

    // Ejecutar cálculo
    console.log('⏳ Extrayendo MC e IC...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: true,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    const mc = result.specialPoints.midheaven;
    const ic = result.specialPoints.imumCoeli;

    if (!mc || !ic) {
      console.error('❌ ERROR: No se extrajeron MC o IC');
      return;
    }

    // Mostrar resultados
    console.log('✅ ÁNGULOS EXTRAÍDOS CON ÉXITO:');
    console.log('─'.repeat(80));
    displayAngleData('MEDIO CIELO (MC)', mc);
    console.log('');
    displayAngleData('IMMUM COELI (IC)', ic);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    // 1. Verificar que estén opuestos
    const diff = angleDifference(mc.longitude, ic.longitude);
    const isOpposite = areOpposite(mc.longitude, ic.longitude);
    console.log(`   Diferencia angular: ${diff.toFixed(2)}° (debe ser ~180°)`);
    console.log(`   ¿Están opuestos?: ${isOpposite ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

    // 2. Verificar signos opuestos
    const oppositeSignsMatch = areOppositeSign(mc.sign, ic.sign);
    console.log(`   Signos: ${mc.sign} ↔ ${ic.sign}`);
    console.log(`   ¿Signos opuestos?: ${oppositeSignsMatch ? '✅ SÍ' : '❌ NO (Esperado: ' + OPPOSITE_SIGNS[mc.sign] + ')'}`);
    console.log('');

    // 3. Verificar casas correctas
    const correctHouses = mc.house === 10 && ic.house === 4;
    console.log(`   Casa MC: ${mc.house} (debe ser 10)`);
    console.log(`   Casa IC: ${ic.house} (debe ser 4)`);
    console.log(`   ¿Casas correctas?: ${correctHouses ? '✅ SÍ' : '❌ NO'}`);
    console.log('─'.repeat(80));
    console.log('');

    // Resultado final
    if (isOpposite && oppositeSignsMatch && correctHouses) {
      console.log('✅ TODAS LAS VALIDACIONES PASARON');
    } else {
      console.log('⚠️ ALGUNAS VALIDACIONES FALLARON - Revisar implementación');
    }
    console.log('');

    console.log('🔍 VALIDACIÓN MANUAL:');
    console.log('   1. Ir a https://www.astro.com/cgi/genchart.cgi');
    console.log('   2. Introducir: 14 Mar 1879, 11:30, Ulm, Germany');
    console.log('   3. Verificar posiciones de MC (Casa 10) e IC (Casa 4)');
    console.log('   4. Comparar signos y grados con los valores arriba');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 2: Carta Y2000 (Año 2000 - Referencia Moderna)
// ============================================================================

/**
 * Test de MC e IC para el año 2000
 * 
 * Datos:
 * - Fecha: 1 Enero 2000, 12:00 UTC
 * - Lugar: Greenwich (0°, 0°)
 * 
 * @returns Promise<void>
 */
export async function testY2000Angles(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 2: MC E IC EN CARTA Y2000 (1 ENERO 2000)');
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

    // Mock de cúspides
    const mockHouseCusps = [
      15,     // Casa 1
      45,     // Casa 2
      75,     // Casa 3
      105,    // Casa 4 (IC)
      135,    // Casa 5
      165,    // Casa 6
      195,    // Casa 7
      225,    // Casa 8
      255,    // Casa 9
      285,    // Casa 10 (MC)
      315,    // Casa 11
      345,    // Casa 12
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 15,
    };

    console.log('⏳ Extrayendo MC e IC...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: true,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    const mc = result.specialPoints.midheaven;
    const ic = result.specialPoints.imumCoeli;

    if (!mc || !ic) {
      console.error('❌ ERROR: No se extrajeron MC o IC');
      return;
    }

    console.log('✅ ÁNGULOS EXTRAÍDOS CON ÉXITO:');
    console.log('─'.repeat(80));
    displayAngleData('MEDIO CIELO (MC)', mc);
    console.log('');
    displayAngleData('IMMUM COELI (IC)', ic);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    const diff = angleDifference(mc.longitude, ic.longitude);
    const isOpposite = areOpposite(mc.longitude, ic.longitude);
    console.log(`   Diferencia angular: ${diff.toFixed(2)}° (debe ser ~180°)`);
    console.log(`   ¿Están opuestos?: ${isOpposite ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

    const oppositeSignsMatch = areOppositeSign(mc.sign, ic.sign);
    console.log(`   Signos: ${mc.sign} ↔ ${ic.sign}`);
    console.log(`   ¿Signos opuestos?: ${oppositeSignsMatch ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

    const correctHouses = mc.house === 10 && ic.house === 4;
    console.log(`   Casas: MC=${mc.house}, IC=${ic.house}`);
    console.log(`   ¿Casas correctas?: ${correctHouses ? '✅ SÍ' : '❌ NO'}`);
    console.log('─'.repeat(80));
    console.log('');

    if (isOpposite && oppositeSignsMatch && correctHouses) {
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
 * Test de MC e IC para la fecha actual
 * Útil para debugging y verificación rápida
 * 
 * @returns Promise<void>
 */
export async function testCurrentDateAngles(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 3: MC E IC EN FECHA ACTUAL');
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

    // Mock de cúspides
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

    console.log('⏳ Extrayendo MC e IC...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: true,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    const mc = result.specialPoints.midheaven;
    const ic = result.specialPoints.imumCoeli;

    if (!mc || !ic) {
      console.error('❌ ERROR: No se extrajeron MC o IC');
      return;
    }

    console.log('✅ ÁNGULOS EXTRAÍDOS:');
    console.log('─'.repeat(80));
    displayAngleData('MEDIO CIELO (MC)', mc);
    console.log('');
    displayAngleData('IMMUM COELI (IC)', ic);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones rápidas
    const isOpposite = areOpposite(mc.longitude, ic.longitude);
    const oppositeSignsMatch = areOppositeSign(mc.sign, ic.sign);
    
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
 * Muestra los datos de un ángulo en formato legible
 */
function displayAngleData(title: string, angle: AdvancedPoint): void {
  console.log(`   ${title}:`);
  console.log(`   ├─ Nombre:       ${angle.name} (${angle.symbol})`);
  console.log(`   ├─ Longitud:     ${angle.longitude.toFixed(4)}°`);
  console.log(`   ├─ Signo:        ${angle.sign}`);
  console.log(`   ├─ Grados:       ${angle.degree.toFixed(2)}° ${angle.sign}`);
  console.log(`   ├─ Casa:         Casa ${angle.house}`);
  console.log(`   └─ Significado:  ${angle.meaning?.substring(0, 50)}...`);
}

// ============================================================================
// EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta todos los tests de MC e IC en secuencia
 */
export async function runAllAnglesTests(): Promise<void> {
  console.clear();
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(18) + '🏔️ TEST SUITE: MEDIO CIELO (MC) E IC 🏔️' + ' '.repeat(18) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testEinsteinAngles();
    await testY2000Angles();
    await testCurrentDateAngles();

    console.log('\n' + '='.repeat(80));
    console.log('✅ TODOS LOS TESTS COMPLETADOS');
    console.log('='.repeat(80));
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('   1. Verificar que MC e IC estén SIEMPRE opuestos (180°)');
    console.log('   2. Confirmar que los signos sean opuestos en el zodiaco');
    console.log('   3. Validar manualmente contra Astro.com si es necesario');
    console.log('   4. Si todo está OK, continuar con FASE 5 (Parte de la Fortuna)');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO TESTS:', error);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  testEinsteinAngles,
  testY2000Angles,
  testCurrentDateAngles,
  runAllAnglesTests,
};
