/**
 * TEST PHASE 3: Quirón (Chiron) - Validación de Cálculos
 * 
 * Este archivo contiene tests para validar la correcta implementación
 * del cálculo de Quirón usando Swiss Ephemeris WASM.
 * 
 * Casos de prueba:
 * 1. Albert Einstein (14 Marzo 1879, 11:30 LMT, Ulm, Alemania)
 * 2. Carta Y2000 (1 Enero 2000, 12:00 UTC, Greenwich)
 * 3. Fecha actual (para debugging en vivo)
 * 
 * INSTRUCCIONES PARA VALIDACIÓN MANUAL:
 * -------------------------------------------
 * 1. Ejecutar: npm run test:chiron (o copiar este código en consola dev)
 * 2. Comparar resultados con Astro.com:
 *    - Ir a: https://www.astro.com/cgi/genchart.cgi
 *    - Seleccionar "Chart Drawing, Ascendant"
 *    - En "Additional objects" marcar "Chiron"
 *    - Introducir datos de cada test
 *    - Comparar signo zodiacal y grados
 * 
 * TOLERANCIAS ACEPTABLES:
 * - Longitud eclíptica: ±0.5° (debido a diferencias en efemérides y zona horaria)
 * - Signo zodiacal: debe coincidir exactamente
 * - Grados dentro del signo: ±1° aceptable
 * - Casa: puede variar ±1 casa (depende del sistema de casas)
 * 
 * @module tests/testChiron
 */

import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AsteroidData } from '../types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import * as julian from 'astronomia/julian';

// ============================================================================
// TEST 1: Albert Einstein (Carta Natal Histórica)
// ============================================================================

/**
 * Test de Quirón en la carta de Albert Einstein
 * 
 * Datos conocidos:
 * - Nacimiento: 14 Marzo 1879, 11:30 LMT
 * - Lugar: Ulm, Alemania (48°24'N, 9°59'E)
 * 
 * VALORES ESPERADOS (aproximados, validar con Astro.com):
 * - Quirón en Tauro o Aries (época 1879)
 * - Grados: verificar con cálculo real
 * 
 * @returns Promise<void>
 */
export async function testEinsteinChiron(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 1: QUIRÓN EN CARTA DE EINSTEIN');
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
    // Calcular Día Juliano (LMT = Local Mean Time)
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    console.log('📐 Día Juliano:', julianDay.toFixed(6));
    console.log('');

    // Parámetros de cálculo
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: [
        0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
      ], // Mock cusps para determinar casa
      ascendantLongitude: 0, // Mock, no crítico para este test
    };

    // Ejecutar cálculo
    console.log('⏳ Calculando Quirón...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: true,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    // Verificar resultado
    const chiron = result.chiron;

    if (!chiron) {
      console.error('❌ ERROR: No se calculó Quirón');
      return;
    }

    // Mostrar resultados
    console.log('✅ QUIRÓN CALCULADO CON ÉXITO:');
    console.log('─'.repeat(80));
    displayChironData(chiron);
    console.log('─'.repeat(80));
    console.log('');
    console.log('🔍 VALIDACIÓN MANUAL:');
    console.log('   1. Ir a https://www.astro.com/cgi/genchart.cgi');
    console.log('   2. Introducir: 14 Mar 1879, 11:30, Ulm, Germany');
    console.log('   3. Marcar "Chiron" en Additional Objects');
    console.log('   4. Comparar posición con los valores arriba');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 2: Carta Y2000 (Año 2000 - Referencia Moderna)
// ============================================================================

/**
 * Test de Quirón para el año 2000
 * 
 * Datos:
 * - Fecha: 1 Enero 2000, 12:00 UTC
 * - Lugar: Greenwich (0°, 0°)
 * 
 * VALORES ESPERADOS:
 * - Quirón en Sagitario (época 2000)
 * - Verificar con efemérides de la época
 * 
 * @returns Promise<void>
 */
export async function testY2000Chiron(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 2: QUIRÓN EN CARTA Y2000 (1 ENERO 2000)');
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

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: [
        0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
      ],
      ascendantLongitude: 90,
    };

    console.log('⏳ Calculando Quirón...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: true,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    const chiron = result.chiron;

    if (!chiron) {
      console.error('❌ ERROR: No se calculó Quirón');
      return;
    }

    console.log('✅ QUIRÓN CALCULADO CON ÉXITO:');
    console.log('─'.repeat(80));
    displayChironData(chiron);
    console.log('─'.repeat(80));
    console.log('');
    console.log('🔍 VALIDACIÓN MANUAL:');
    console.log('   1. Ir a https://www.astro.com/cgi/genchart.cgi');
    console.log('   2. Introducir: 1 Jan 2000, 12:00, Greenwich, UK');
    console.log('   3. Marcar "Chiron" en Additional Objects');
    console.log('   4. Comparar posición con los valores arriba');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 3: Fecha Actual (Debug en Vivo)
// ============================================================================

/**
 * Test de Quirón para la fecha actual
 * Útil para debugging y verificación rápida
 * 
 * @returns Promise<void>
 */
export async function testCurrentDateChiron(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 3: QUIRÓN EN FECHA ACTUAL');
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

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: [
        0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360
      ],
      ascendantLongitude: 0,
    };

    console.log('⏳ Calculando Quirón...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: true,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateVertex: false,
    });

    const chiron = result.chiron;

    if (!chiron) {
      console.error('❌ ERROR: No se calculó Quirón');
      return;
    }

    console.log('✅ QUIRÓN CALCULADO CON ÉXITO:');
    console.log('─'.repeat(80));
    displayChironData(chiron);
    console.log('─'.repeat(80));
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// UTILIDADES DE VISUALIZACIÓN
// ============================================================================

/**
 * Muestra los datos de Quirón en formato legible
 */
function displayChironData(chiron: AsteroidData): void {
  console.log(`   Nombre:       ${chiron.name} ${chiron.symbol}`);
  console.log(`   Longitud:     ${chiron.longitude.toFixed(4)}°`);
  console.log(`   Signo:        ${chiron.sign}`);
  console.log(`   Grados:       ${chiron.degree.toFixed(2)}° ${chiron.sign}`);
  console.log(`   Casa:         Casa ${chiron.house}`);
  console.log(`   Retrógrado:   ${chiron.retrograde ? '♈ Sí (R)' : '→ No'}`);
  
  if (chiron.speed !== undefined) {
    console.log(`   Velocidad:    ${chiron.speed.toFixed(4)}°/día`);
  }
  
  if (chiron.meaning) {
    console.log(`   Significado:  ${chiron.meaning.substring(0, 60)}...`);
  }
}

// ============================================================================
// EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta todos los tests de Quirón en secuencia
 */
export async function runAllChironTests(): Promise<void> {
  console.clear();
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + '🌟 TEST SUITE: QUIRÓN (CHIRON) 🌟' + ' '.repeat(24) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testEinsteinChiron();
    await testY2000Chiron();
    await testCurrentDateChiron();

    console.log('\n' + '='.repeat(80));
    console.log('✅ TODOS LOS TESTS COMPLETADOS');
    console.log('='.repeat(80));
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('   1. Validar manualmente contra Astro.com');
    console.log('   2. Verificar que el signo zodiacal coincida');
    console.log('   3. Confirmar que los grados estén dentro de ±1°');
    console.log('   4. Si hay discrepancias mayores, revisar zona horaria y efemérides');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO TESTS:', error);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  testEinsteinChiron,
  testY2000Chiron,
  testCurrentDateChiron,
  runAllChironTests,
};
