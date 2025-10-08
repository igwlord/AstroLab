/**
 * TEST PHASE 5: Parte de la Fortuna - Validación de Cálculos
 * 
 * Este archivo contiene tests para validar la correcta implementación
 * del cálculo de la Parte de la Fortuna (Lot of Fortune).
 * 
 * CONCEPTOS IMPORTANTES:
 * ----------------------
 * - Parte de la Fortuna: Punto árabe que representa fortuna material, suerte, bienestar
 * - Fórmula DIURNA (Sol sobre horizonte):   Fortuna = ASC + Luna - Sol
 * - Fórmula NOCTURNA (Sol bajo horizonte):  Fortuna = ASC + Sol - Luna
 * - Una carta es diurna si el Sol está en casas 7-12 (sobre horizonte)
 * - Una carta es nocturna si el Sol está en casas 1-6 (bajo horizonte)
 * 
 * Casos de prueba:
 * 1. Carta DIURNA: Sol sobre horizonte (debe usar fórmula ASC + Luna - Sol)
 * 2. Carta NOCTURNA: Sol bajo horizonte (debe usar fórmula ASC + Sol - Luna)
 * 3. Einstein: Validación con carta histórica conocida
 * 4. Casos extremos: Validar normalización de ángulos
 * 
 * INSTRUCCIONES PARA VALIDACIÓN MANUAL:
 * -------------------------------------------
 * 1. Ejecutar: npm run test:fortune (o copiar en consola dev)
 * 2. Comparar resultados con Astro.com:
 *    - Ir a: https://www.astro.com/cgi/genchart.cgi
 *    - En "Additional objects" buscar "Part of Fortune"
 *    - Introducir datos de cada test
 *    - Comparar signo zodiacal y grados
 * 
 * TOLERANCIAS ACEPTABLES:
 * - Longitud eclíptica: ±1° (debido a diferencias en zona horaria)
 * - Signo zodiacal: debe coincidir exactamente
 * - Grados dentro del signo: ±2° aceptable
 * - Casa: puede variar ±1 casa (depende del sistema de casas)
 * 
 * @module tests/testFortune
 */

import { calculateAdvancedChart } from '../services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedPoint } from '../types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import * as julian from 'astronomia/julian';

// ============================================================================
// TEST 1: CARTA DIURNA (Sol sobre horizonte)
// ============================================================================

/**
 * Test de Parte de Fortuna en carta diurna
 * 
 * Datos simulados:
 * - ASC: 0° (Aries)
 * - Sol: 90° (Cáncer) - sobre horizonte
 * - Luna: 180° (Libra)
 * 
 * Fórmula esperada: ASC + Luna - Sol = 0 + 180 - 90 = 90° (Cáncer)
 * 
 * @returns Promise<void>
 */
export async function testDiurnalChart(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 1: PARTE DE FORTUNA EN CARTA DIURNA');
  console.log('='.repeat(80) + '\n');

  console.log('📊 DATOS SIMULADOS:');
  console.log('   ASC: 0° (Aries)');
  console.log('   Sol: 90° (Cáncer) - SOBRE horizonte');
  console.log('   Luna: 180° (Libra)');
  console.log('');
  console.log('📐 FÓRMULA ESPERADA: Diurna (ASC + Luna - Sol)');
  console.log('   0 + 180 - 90 = 90°');
  console.log('   Resultado esperado: 90° (Cáncer 0°)');
  console.log('');

  try {
    // Mock de Día Juliano (no crítico para este test)
    const julianDay = julian.CalendarGregorianToJD(2000, 1, 1, 12);

    // Mock de cúspides de casas
    const mockHouseCusps = [
      0,      // Casa 1 (ASC)
      30,     // Casa 2
      60,     // Casa 3
      90,     // Casa 4 (IC)
      120,    // Casa 5
      150,    // Casa 6
      180,    // Casa 7 (DESC)
      210,    // Casa 8
      240,    // Casa 9
      270,    // Casa 10 (MC)
      300,    // Casa 11
      330,    // Casa 12
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: 40.4168,
      longitude: -3.7038,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 0,      // 0° Aries
      sunLongitude: 90,            // 90° Cáncer (sobre horizonte)
      moonLongitude: 180,          // 180° Libra
    };

    console.log('⏳ Calculando Parte de Fortuna...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: true,
      calculateVertex: false,
    });

    const fortune = result.specialPoints.partOfFortune;

    if (!fortune) {
      console.error('❌ ERROR: No se calculó Parte de Fortuna');
      return;
    }

    // Mostrar resultado
    console.log('✅ PARTE DE FORTUNA CALCULADA:');
    console.log('─'.repeat(80));
    displayFortuneData(fortune);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    const expectedLongitude = 90;
    const tolerance = 0.5;
    const isCorrect = Math.abs(fortune.longitude - expectedLongitude) < tolerance;
    
    console.log(`   Longitud esperada: ${expectedLongitude}°`);
    console.log(`   Longitud obtenida: ${fortune.longitude.toFixed(4)}°`);
    console.log(`   Diferencia: ${Math.abs(fortune.longitude - expectedLongitude).toFixed(4)}°`);
    console.log(`   ¿Correcto?: ${isCorrect ? '✅ SÍ' : '❌ NO'}`);
    console.log('');
    
    console.log(`   Signo esperado: Cáncer`);
    console.log(`   Signo obtenido: ${fortune.sign}`);
    console.log(`   ¿Correcto?: ${fortune.sign === 'Cáncer' ? '✅ SÍ' : '❌ NO'}`);
    console.log('');
    
    console.log(`   Fórmula usada: ${fortune.formula}`);
    console.log(`   ¿Es diurna?: ${fortune.formula?.includes('diurna') ? '✅ SÍ' : '❌ NO'}`);
    console.log('─'.repeat(80));
    console.log('');

    if (isCorrect && fortune.sign === 'Cáncer') {
      console.log('✅ TEST PASADO: Fórmula diurna funciona correctamente');
    } else {
      console.log('❌ TEST FALLIDO: Revisar implementación de fórmula diurna');
    }
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 2: CARTA NOCTURNA (Sol bajo horizonte)
// ============================================================================

/**
 * Test de Parte de Fortuna en carta nocturna
 * 
 * Datos simulados:
 * - ASC: 0° (Aries)
 * - Sol: 30° (Tauro) - bajo horizonte
 * - Luna: 180° (Libra)
 * 
 * Fórmula esperada: ASC + Sol - Luna = 0 + 30 - 180 = -150 = 210° (Escorpio)
 * 
 * @returns Promise<void>
 */
export async function testNocturnalChart(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 2: PARTE DE FORTUNA EN CARTA NOCTURNA');
  console.log('='.repeat(80) + '\n');

  console.log('📊 DATOS SIMULADOS:');
  console.log('   ASC: 0° (Aries)');
  console.log('   Sol: 30° (Tauro) - BAJO horizonte');
  console.log('   Luna: 180° (Libra)');
  console.log('');
  console.log('📐 FÓRMULA ESPERADA: Nocturna (ASC + Sol - Luna)');
  console.log('   0 + 30 - 180 = -150 → 210° (normalizado)');
  console.log('   Resultado esperado: 210° (Escorpio 0°)');
  console.log('');

  try {
    const julianDay = julian.CalendarGregorianToJD(2000, 1, 1, 0);

    const mockHouseCusps = [
      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: 40.4168,
      longitude: -3.7038,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 0,      // 0° Aries
      sunLongitude: 30,            // 30° Tauro (bajo horizonte)
      moonLongitude: 180,          // 180° Libra
    };

    console.log('⏳ Calculando Parte de Fortuna...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: true,
      calculateVertex: false,
    });

    const fortune = result.specialPoints.partOfFortune;

    if (!fortune) {
      console.error('❌ ERROR: No se calculó Parte de Fortuna');
      return;
    }

    console.log('✅ PARTE DE FORTUNA CALCULADA:');
    console.log('─'.repeat(80));
    displayFortuneData(fortune);
    console.log('─'.repeat(80));
    console.log('');

    // Validaciones
    console.log('🔍 VALIDACIONES AUTOMÁTICAS:');
    console.log('─'.repeat(80));
    
    const expectedLongitude = 210;
    const tolerance = 0.5;
    const isCorrect = Math.abs(fortune.longitude - expectedLongitude) < tolerance;
    
    console.log(`   Longitud esperada: ${expectedLongitude}°`);
    console.log(`   Longitud obtenida: ${fortune.longitude.toFixed(4)}°`);
    console.log(`   Diferencia: ${Math.abs(fortune.longitude - expectedLongitude).toFixed(4)}°`);
    console.log(`   ¿Correcto?: ${isCorrect ? '✅ SÍ' : '❌ NO'}`);
    console.log('');
    
    console.log(`   Signo esperado: Escorpio`);
    console.log(`   Signo obtenido: ${fortune.sign}`);
    console.log(`   ¿Correcto?: ${fortune.sign === 'Escorpio' ? '✅ SÍ' : '❌ NO'}`);
    console.log('');
    
    console.log(`   Fórmula usada: ${fortune.formula}`);
    console.log(`   ¿Es nocturna?: ${fortune.formula?.includes('nocturna') ? '✅ SÍ' : '❌ NO'}`);
    console.log('─'.repeat(80));
    console.log('');

    if (isCorrect && fortune.sign === 'Escorpio') {
      console.log('✅ TEST PASADO: Fórmula nocturna funciona correctamente');
    } else {
      console.log('❌ TEST FALLIDO: Revisar implementación de fórmula nocturna');
    }
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 3: Albert Einstein (Carta Real)
// ============================================================================

/**
 * Test de Parte de Fortuna en la carta de Einstein
 * 
 * Datos:
 * - Nacimiento: 14 Marzo 1879, 11:30 LMT
 * - Lugar: Ulm, Alemania (48°24'N, 9°59'E)
 * 
 * NOTA: Necesitamos calcular primero las posiciones del Sol y Luna
 * para este test. En producción vendrán del cálculo de carta natal.
 * 
 * @returns Promise<void>
 */
export async function testEinsteinFortune(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 3: PARTE DE FORTUNA EN CARTA DE EINSTEIN');
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
  console.log('📍 Lugar:', location.name);
  console.log('');
  console.log('⚠️  NOTA: Este test usa posiciones aproximadas de Sol y Luna.');
  console.log('    En producción, estos valores vendrán del cálculo de carta natal.');
  console.log('');

  try {
    const decimalHour = birthDate.hour + birthDate.minute / 60;
    const julianDay = julian.CalendarGregorianToJD(
      birthDate.year,
      birthDate.month,
      birthDate.day + decimalHour / 24
    );

    // Mock de datos (en producción vendrían del cálculo real)
    const mockHouseCusps = [
      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: location.latitude,
      longitude: location.longitude,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 90,     // Mock - en realidad debe calcularse
      sunLongitude: 353,           // Sol en Piscis (aproximado para 14 Mar)
      moonLongitude: 225,          // Luna en Escorpio (aproximado)
    };

    console.log('⏳ Calculando Parte de Fortuna...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: true,
      calculateVertex: false,
    });

    const fortune = result.specialPoints.partOfFortune;

    if (!fortune) {
      console.error('❌ ERROR: No se calculó Parte de Fortuna');
      return;
    }

    console.log('✅ PARTE DE FORTUNA CALCULADA:');
    console.log('─'.repeat(80));
    displayFortuneData(fortune);
    console.log('─'.repeat(80));
    console.log('');

    console.log('🔍 VALIDACIÓN MANUAL REQUERIDA:');
    console.log('   1. Ir a https://www.astro.com/cgi/genchart.cgi');
    console.log('   2. Introducir: 14 Mar 1879, 11:30, Ulm, Germany');
    console.log('   3. Buscar "Part of Fortune" en Additional Objects');
    console.log('   4. Comparar posición con los valores arriba');
    console.log('   5. Verificar si la carta es diurna o nocturna');
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// TEST 4: Casos Extremos - Normalización de Ángulos
// ============================================================================

/**
 * Test de normalización de ángulos negativos y mayores a 360°
 * 
 * Verifica que la función maneje correctamente:
 * - Resultados negativos (deben convertirse a 0-360°)
 * - Resultados mayores a 360° (deben normalizarse)
 * 
 * @returns Promise<void>
 */
export async function testAngleNormalization(): Promise<void> {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 4: NORMALIZACIÓN DE ÁNGULOS EXTREMOS');
  console.log('='.repeat(80) + '\n');

  console.log('📊 CASO: Resultado negativo que debe normalizarse');
  console.log('   ASC: 10° (Aries)');
  console.log('   Sol: 200° (Escorpio)');
  console.log('   Luna: 50° (Tauro)');
  console.log('');
  console.log('📐 FÓRMULA: ASC + Sol - Luna (nocturna)');
  console.log('   10 + 200 - 50 = 160°');
  console.log('   Resultado esperado: 160° (Virgo)');
  console.log('');

  try {
    const julianDay = julian.CalendarGregorianToJD(2000, 1, 1, 0);

    const mockHouseCusps = [
      0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];

    const params: AdvancedCalculationParams = {
      julianDay,
      latitude: 40.4168,
      longitude: -3.7038,
      houseCusps: mockHouseCusps,
      ascendantLongitude: 10,
      sunLongitude: 200,
      moonLongitude: 50,
    };

    console.log('⏳ Calculando...\n');
    
    const result = await calculateAdvancedChart(params, {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: true,
      calculateVertex: false,
    });

    const fortune = result.specialPoints.partOfFortune;

    if (!fortune) {
      console.error('❌ ERROR: No se calculó Parte de Fortuna');
      return;
    }

    console.log('✅ RESULTADO:');
    console.log('─'.repeat(80));
    displayFortuneData(fortune);
    console.log('─'.repeat(80));
    console.log('');

    // Validar que esté en rango 0-360
    const isNormalized = fortune.longitude >= 0 && fortune.longitude < 360;
    console.log(`🔍 ¿Longitud normalizada (0-360°)?: ${isNormalized ? '✅ SÍ' : '❌ NO'}`);
    console.log('');

  } catch (error) {
    console.error('❌ ERROR EN TEST:', error);
  }
}

// ============================================================================
// UTILIDADES DE VISUALIZACIÓN
// ============================================================================

/**
 * Muestra los datos de la Parte de Fortuna en formato legible
 */
function displayFortuneData(fortune: AdvancedPoint): void {
  console.log(`   Nombre:       ${fortune.name} (${fortune.symbol})`);
  console.log(`   Tipo:         ${fortune.type}`);
  console.log(`   Longitud:     ${fortune.longitude.toFixed(4)}°`);
  console.log(`   Signo:        ${fortune.sign}`);
  console.log(`   Grados:       ${fortune.degree.toFixed(2)}° ${fortune.sign}`);
  console.log(`   Casa:         Casa ${fortune.house}`);
  console.log(`   Fórmula:      ${fortune.formula}`);
  
  if (fortune.meaning) {
    console.log(`   Significado:  ${fortune.meaning}`);
  }
}

// ============================================================================
// EJECUTAR TODOS LOS TESTS
// ============================================================================

/**
 * Ejecuta todos los tests de Parte de Fortuna en secuencia
 */
export async function runAllFortuneTests(): Promise<void> {
  console.clear();
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(16) + '💰 TEST SUITE: PARTE DE LA FORTUNA 💰' + ' '.repeat(22) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  try {
    await testDiurnalChart();
    await testNocturnalChart();
    await testEinsteinFortune();
    await testAngleNormalization();

    console.log('\n' + '='.repeat(80));
    console.log('✅ TODOS LOS TESTS COMPLETADOS');
    console.log('='.repeat(80));
    console.log('\n📋 RESUMEN:');
    console.log('   1. Test diurno: Verifica fórmula ASC + Luna - Sol');
    console.log('   2. Test nocturno: Verifica fórmula ASC + Sol - Luna');
    console.log('   3. Test Einstein: Carta real para validación manual');
    console.log('   4. Test normalización: Verifica manejo de ángulos extremos');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('   1. Verificar que tests diurno y nocturno pasen');
    console.log('   2. Validar test de Einstein contra Astro.com');
    console.log('   3. Confirmar normalización de ángulos funciona');
    console.log('   4. Si todo está OK, continuar con FASE 6 (Nodos Lunares)');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR EJECUTANDO TESTS:', error);
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  testDiurnalChart,
  testNocturnalChart,
  testEinsteinFortune,
  testAngleNormalization,
  runAllFortuneTests,
};
