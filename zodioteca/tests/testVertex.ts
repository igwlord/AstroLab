/**
 * TEST SUITE: VÉRTEX Y ANTI-VÉRTEX
 * 
 * Validaciones:
 * - Vértex y Anti-Vértex están opuestos (180° exactos)
 * - Longitudes en rango válido (0-360°)
 * - Signos zodiacales opuestos (Aries ↔ Libra, etc.)
 * - Diferencia de casas (~6 casas esperado)
 * - Cálculo coherente con latitud geográfica
 * 
 * Casos de prueba:
 * 1. Einstein (latitud norte: 48.4°)
 * 2. Y2000 (latitud norte: 51.5°)
 * 3. Fecha actual (latitud variable)
 */

import { calculateAdvancedChart } from '../src/services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedCalculationOptions } from '../src/types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import { JulianDay } from 'astronomia';

// ========================================
// UTILIDADES
// ========================================

/**
 * Convierte fecha a Día Juliano
 */
function dateToJulianDay(date: Date): number {
  const jd = new JulianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1, // 1-12
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  );
  return jd.toJD();
}

/**
 * Genera cúspides de casas de ejemplo usando sistema de casas iguales
 */
function generateHouseCusps(ascendantLon: number): number[] {
  const cusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    cusps.push((ascendantLon + i * 30) % 360);
  }
  return cusps;
}

/**
 * Calcula signos opuestos
 */
const oppositeSignMap: { [key: string]: string } = {
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

// ========================================
// TEST 1: EINSTEIN (14 Mar 1879)
// ========================================

export async function testEinsteinVertex() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 1: VÉRTEX - ALBERT EINSTEIN');
  console.log('📅 Fecha: 14 de marzo de 1879, 11:30 AM LMT');
  console.log('📍 Lugar: Ulm, Alemania (48.4°N, 9.99°E)');
  console.log('='.repeat(80) + '\n');

  try {
    // Datos de Einstein
    const birthDate = new Date(Date.UTC(1879, 2, 14, 10, 30, 0)); // Aproximación UTC
    const julianDay = dateToJulianDay(birthDate);
    const latitude = 48.4;  // Ulm, Alemania (Norte)
    const longitude = 9.99;
    
    // Generar cúspides de casas (ascendente aproximado de Einstein: ~10° Cáncer)
    const ascendantLon = 100; // ~10° Cáncer
    const houseCusps = generateHouseCusps(ascendantLon);
    
    console.log('📊 Parámetros de entrada:');
    console.log(`   • Día Juliano: ${julianDay.toFixed(6)}`);
    console.log(`   • Latitud: ${latitude.toFixed(2)}° N`);
    console.log(`   • Longitud: ${longitude.toFixed(2)}° E`);
    console.log(`   • Ascendente: ${ascendantLon.toFixed(2)}° (${Math.floor(ascendantLon / 30) === 3 ? 'Cáncer' : ''})`);
    console.log(`   • Cúspides casas: [${houseCusps.slice(0, 3).map(c => c.toFixed(1)).join(', ')}, ...]`);
    
    // Parámetros de cálculo
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude,
      longitude,
      houseCusps,
      ascendantLongitude: ascendantLon,
    };
    
    // Opciones: solo Vértex
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: false,
      calculateVertex: true,
    };
    
    console.log('\n🚀 Calculando Vértex...\n');
    
    const result = await calculateAdvancedChart(params, options);
    
    // Validaciones
    const { vertex, antiVertex } = result.specialPoints;
    
    if (!vertex || !antiVertex) {
      console.error('❌ ERROR: Vértex o Anti-Vértex no calculados');
      return false;
    }
    
    console.log('📍 RESULTADOS:');
    console.log('─'.repeat(80));
    
    // Vértex
    console.log(`\n🌀 VÉRTEX (Vx):`);
    console.log(`   • Longitud: ${vertex.longitude.toFixed(4)}°`);
    console.log(`   • Signo: ${vertex.sign} ${vertex.degree.toFixed(2)}°`);
    console.log(`   • Casa: ${vertex.house}`);
    console.log(`   • Significado: ${vertex.meaning}`);
    
    // Anti-Vértex
    console.log(`\n🌀 ANTI-VÉRTEX (AVx):`);
    console.log(`   • Longitud: ${antiVertex.longitude.toFixed(4)}°`);
    console.log(`   • Signo: ${antiVertex.sign} ${antiVertex.degree.toFixed(2)}°`);
    console.log(`   • Casa: ${antiVertex.house}`);
    console.log(`   • Significado: ${antiVertex.meaning}`);
    
    // VALIDACIÓN 1: Oposición 180°
    console.log('\n📊 VALIDACIONES:');
    console.log('─'.repeat(80));
    
    const diff = Math.abs(vertex.longitude - antiVertex.longitude);
    const opposition = Math.abs(diff - 180);
    const isOpposite = opposition < 0.5; // Tolerancia 0.5°
    
    console.log(`\n✓ Oposición 180°:`);
    console.log(`   • Diferencia angular: ${diff.toFixed(4)}°`);
    console.log(`   • Desviación de 180°: ${opposition.toFixed(4)}°`);
    console.log(`   • ¿Opuestos? ${isOpposite ? '✅ SÍ' : '❌ NO'}`);
    
    // VALIDACIÓN 2: Signos opuestos
    const expectedOppositeSign = oppositeSignMap[vertex.sign];
    const signsAreOpposite = antiVertex.sign === expectedOppositeSign;
    
    console.log(`\n✓ Signos Opuestos:`);
    console.log(`   • Vértex: ${vertex.sign}`);
    console.log(`   • Anti-Vértex: ${antiVertex.sign}`);
    console.log(`   • Esperado: ${expectedOppositeSign}`);
    console.log(`   • ¿Opuestos? ${signsAreOpposite ? '✅ SÍ' : '❌ NO'}`);
    
    // VALIDACIÓN 3: Diferencia de casas
    const houseDiff = Math.abs(vertex.house - antiVertex.house);
    const expectedHouseDiff = houseDiff === 6 || houseDiff === 7; // ~6 casas (puede variar)
    
    console.log(`\n✓ Diferencia de Casas:`);
    console.log(`   • Vértex: Casa ${vertex.house}`);
    console.log(`   • Anti-Vértex: Casa ${antiVertex.house}`);
    console.log(`   • Diferencia: ${houseDiff} casas`);
    console.log(`   • ¿Coherente? ${expectedHouseDiff ? '✅ SÍ (~6 casas)' : '⚠️ Revisar'}`);
    
    // VALIDACIÓN 4: Rangos válidos
    const validVertexLon = vertex.longitude >= 0 && vertex.longitude < 360;
    const validAntiVertexLon = antiVertex.longitude >= 0 && antiVertex.longitude < 360;
    
    console.log(`\n✓ Rangos Válidos (0-360°):`);
    console.log(`   • Vértex: ${validVertexLon ? '✅ Válido' : '❌ Inválido'} (${vertex.longitude.toFixed(2)}°)`);
    console.log(`   • Anti-Vértex: ${validAntiVertexLon ? '✅ Válido' : '❌ Inválido'} (${antiVertex.longitude.toFixed(2)}°)`);
    
    // Resumen
    const allPassed = isOpposite && signsAreOpposite && validVertexLon && validAntiVertexLon;
    
    console.log('\n' + '='.repeat(80));
    console.log(allPassed ? '✅ TEST EINSTEIN: PASADO' : '❌ TEST EINSTEIN: FALLÓ');
    console.log('='.repeat(80) + '\n');
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Error en test Einstein:', error);
    return false;
  }
}

// ========================================
// TEST 2: Y2000 (1 Ene 2000)
// ========================================

export async function testY2000Vertex() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 2: VÉRTEX - AÑO 2000 (REFERENCIA)');
  console.log('📅 Fecha: 1 de enero de 2000, 12:00 PM UTC');
  console.log('📍 Lugar: Londres, UK (51.5°N, 0.1°W)');
  console.log('='.repeat(80) + '\n');

  try {
    const birthDate = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const julianDay = dateToJulianDay(birthDate);
    const latitude = 51.5;   // Londres (Norte)
    const longitude = -0.1;  // Greenwich
    
    const ascendantLon = 75; // ~15° Géminis
    const houseCusps = generateHouseCusps(ascendantLon);
    
    console.log('📊 Parámetros de entrada:');
    console.log(`   • Día Juliano: ${julianDay.toFixed(6)}`);
    console.log(`   • Latitud: ${latitude.toFixed(2)}° N`);
    console.log(`   • Longitud: ${longitude.toFixed(2)}° W`);
    console.log(`   • Ascendente: ${ascendantLon.toFixed(2)}°`);
    
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude,
      longitude,
      houseCusps,
      ascendantLongitude: ascendantLon,
    };
    
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: false,
      calculateVertex: true,
    };
    
    console.log('\n🚀 Calculando Vértex...\n');
    
    const result = await calculateAdvancedChart(params, options);
    const { vertex, antiVertex } = result.specialPoints;
    
    if (!vertex || !antiVertex) {
      console.error('❌ ERROR: Vértex o Anti-Vértex no calculados');
      return false;
    }
    
    console.log('📍 RESULTADOS:');
    console.log('─'.repeat(80));
    console.log(`\n🌀 VÉRTEX: ${vertex.sign} ${vertex.degree.toFixed(2)}° (Casa ${vertex.house})`);
    console.log(`   Longitud: ${vertex.longitude.toFixed(4)}°`);
    console.log(`\n🌀 ANTI-VÉRTEX: ${antiVertex.sign} ${antiVertex.degree.toFixed(2)}° (Casa ${antiVertex.house})`);
    console.log(`   Longitud: ${antiVertex.longitude.toFixed(4)}°`);
    
    // Validaciones
    const diff = Math.abs(vertex.longitude - antiVertex.longitude);
    const opposition = Math.abs(diff - 180);
    const isOpposite = opposition < 0.5;
    
    const expectedOppositeSign = oppositeSignMap[vertex.sign];
    const signsAreOpposite = antiVertex.sign === expectedOppositeSign;
    
    console.log('\n📊 VALIDACIONES:');
    console.log(`   • Oposición: ${isOpposite ? '✅' : '❌'} (${opposition.toFixed(4)}° de 180°)`);
    console.log(`   • Signos opuestos: ${signsAreOpposite ? '✅' : '❌'} (${vertex.sign} ↔ ${antiVertex.sign})`);
    
    const allPassed = isOpposite && signsAreOpposite;
    
    console.log('\n' + '='.repeat(80));
    console.log(allPassed ? '✅ TEST Y2000: PASADO' : '❌ TEST Y2000: FALLÓ');
    console.log('='.repeat(80) + '\n');
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Error en test Y2000:', error);
    return false;
  }
}

// ========================================
// TEST 3: FECHA ACTUAL (DEBUG)
// ========================================

export async function testCurrentDateVertex() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 3: VÉRTEX - FECHA ACTUAL (DEBUG)');
  const now = new Date();
  console.log(`📅 Fecha: ${now.toISOString()}`);
  console.log('📍 Lugar: Madrid, España (40.4°N, 3.7°W)');
  console.log('='.repeat(80) + '\n');

  try {
    const julianDay = dateToJulianDay(now);
    const latitude = 40.4;   // Madrid (Norte)
    const longitude = -3.7;
    
    const ascendantLon = 120; // ~0° Leo
    const houseCusps = generateHouseCusps(ascendantLon);
    
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude,
      longitude,
      houseCusps,
      ascendantLongitude: ascendantLon,
    };
    
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: false,
      calculateVertex: true,
    };
    
    console.log('🚀 Calculando Vértex...\n');
    
    const result = await calculateAdvancedChart(params, options);
    const { vertex, antiVertex } = result.specialPoints;
    
    if (!vertex || !antiVertex) {
      console.error('❌ ERROR: Vértex o Anti-Vértex no calculados');
      return false;
    }
    
    console.log('📍 RESULTADOS:');
    console.log(`   • Vértex: ${vertex.sign} ${vertex.degree.toFixed(2)}° (${vertex.longitude.toFixed(2)}°) - Casa ${vertex.house}`);
    console.log(`   • Anti-Vértex: ${antiVertex.sign} ${antiVertex.degree.toFixed(2)}° (${antiVertex.longitude.toFixed(2)}°) - Casa ${antiVertex.house}`);
    
    const diff = Math.abs(vertex.longitude - antiVertex.longitude);
    const opposition = Math.abs(diff - 180);
    const isOpposite = opposition < 0.5;
    
    console.log(`\n📊 Oposición: ${isOpposite ? '✅' : '❌'} (${opposition.toFixed(4)}° de desviación)`);
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    return isOpposite;
    
  } catch (error) {
    console.error('❌ Error en test fecha actual:', error);
    return false;
  }
}

// ========================================
// TEST 4: HEMISFERIO SUR
// ========================================

export async function testSouthernHemisphereVertex() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TEST 4: VÉRTEX - HEMISFERIO SUR');
  console.log('📅 Fecha: 1 de julio de 2020, 12:00 PM UTC');
  console.log('📍 Lugar: Buenos Aires, Argentina (34.6°S, 58.4°W)');
  console.log('='.repeat(80) + '\n');

  try {
    const birthDate = new Date(Date.UTC(2020, 6, 1, 12, 0, 0));
    const julianDay = dateToJulianDay(birthDate);
    const latitude = -34.6;  // Buenos Aires (SUR - negativo)
    const longitude = -58.4;
    
    const ascendantLon = 180; // ~0° Libra
    const houseCusps = generateHouseCusps(ascendantLon);
    
    console.log('📊 Parámetros de entrada:');
    console.log(`   • Latitud: ${latitude.toFixed(2)}° S`);
    console.log(`   • Longitud: ${longitude.toFixed(2)}° W`);
    console.log(`   • Día Juliano: ${julianDay.toFixed(6)}`);
    
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude,
      longitude,
      houseCusps,
      ascendantLongitude: ascendantLon,
    };
    
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: false,
      calculateChiron: false,
      calculateMidheaven: false,
      calculatePartOfFortune: false,
      calculateNodes: false,
      calculateVertex: true,
    };
    
    console.log('\n🚀 Calculando Vértex (hemisferio sur)...\n');
    
    const result = await calculateAdvancedChart(params, options);
    const { vertex, antiVertex } = result.specialPoints;
    
    if (!vertex || !antiVertex) {
      console.error('❌ ERROR: Vértex o Anti-Vértex no calculados');
      return false;
    }
    
    console.log('📍 RESULTADOS:');
    console.log(`   • Vértex: ${vertex.sign} ${vertex.degree.toFixed(2)}° (${vertex.longitude.toFixed(2)}°)`);
    console.log(`   • Anti-Vértex: ${antiVertex.sign} ${antiVertex.degree.toFixed(2)}° (${antiVertex.longitude.toFixed(2)}°)`);
    
    const diff = Math.abs(vertex.longitude - antiVertex.longitude);
    const opposition = Math.abs(diff - 180);
    const isOpposite = opposition < 0.5;
    
    console.log(`\n📊 Validación oposición: ${isOpposite ? '✅ PASADO' : '❌ FALLÓ'}`);
    console.log(`   Desviación: ${opposition.toFixed(4)}°`);
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    return isOpposite;
    
  } catch (error) {
    console.error('❌ Error en test hemisferio sur:', error);
    return false;
  }
}

// ========================================
// EJECUTAR TODOS LOS TESTS
// ========================================

export async function runAllVertexTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + '🌀 TEST SUITE: VÉRTEX Y ANTI-VÉRTEX' + ' '.repeat(23) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  const results = {
    einstein: false,
    y2000: false,
    current: false,
    southern: false,
  };
  
  // Test 1: Einstein
  results.einstein = await testEinsteinVertex();
  
  // Test 2: Y2000
  results.y2000 = await testY2000Vertex();
  
  // Test 3: Fecha actual
  results.current = await testCurrentDateVertex();
  
  // Test 4: Hemisferio sur
  results.southern = await testSouthernHemisphereVertex();
  
  // Resumen final
  console.log('\n' + '═'.repeat(80));
  console.log('📊 RESUMEN FINAL');
  console.log('═'.repeat(80));
  console.log(`   1. Test Einstein:        ${results.einstein ? '✅ PASADO' : '❌ FALLÓ'}`);
  console.log(`   2. Test Y2000:           ${results.y2000 ? '✅ PASADO' : '❌ FALLÓ'}`);
  console.log(`   3. Test Fecha Actual:    ${results.current ? '✅ PASADO' : '❌ FALLÓ'}`);
  console.log(`   4. Test Hemisferio Sur:  ${results.southern ? '✅ PASADO' : '❌ FALLÓ'}`);
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log('\n' + '─'.repeat(80));
  console.log(`   TOTAL: ${passed}/${total} tests pasados (${((passed/total)*100).toFixed(0)}%)`);
  console.log('═'.repeat(80) + '\n');
  
  return passed === total;
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default runAllVertexTests;
