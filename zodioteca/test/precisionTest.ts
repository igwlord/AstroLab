/**
 * 🎯 TEST AUTOMÁTICO DE PRECISIÓN ASTRONÓMICA
 * Verifica que los cálculos coincidan con Astro.com (Swiss Ephemeris)
 * 
 * Caso de prueba: Buenos Aires, 16 Oct 1988, 17:50 (GMT-3)
 * Fuente: Astro.com
 */

import { calculatePlacidusHouses, calculateLilithMeanPrecise, dateToJulian } from '../src/services/swissEphemerisCalculator';

// Wrap everything in async function
(async () => {

// ============================================================================
// DATOS DE REFERENCIA DE ASTRO.COM
// ============================================================================

const TEST_CASE = {
  name: 'Buenos Aires 16/10/1988 17:50',
  date: new Date('1988-10-16T20:50:00.000Z'), // 17:50 GMT-3 = 20:50 UTC
  location: {
    lat: -34.6037,
    lon: -58.3816,
    name: 'Buenos Aires'
  }
};

// Valores de referencia de Astro.com
const REFERENCE = {
  // Planetas (ya verificados - PERFECTOS)
  planets: {
    sun: { sign: 'Libra', degree: 23.71 },
    moon: { sign: 'Capricornio', degree: 2.80 }
  },
  
  // Puntos angulares
  angles: {
    asc: { sign: 'Aries', degree: 8.08, longitude: 8.08 },
    mc: { sign: 'Capricornio', degree: 8.85, longitude: 278.85 }
  },
  
  // Sistema Placidus (valores exactos de Astro.com)
  houses: {
    1: { sign: 'Aries', degree: 8.08, longitude: 8.08 },
    2: { sign: 'Tauro', degree: 5.62, longitude: 35.62 },
    3: { sign: 'Géminis', degree: 6.28, longitude: 66.28 },
    4: { sign: 'Cáncer', degree: 8.85, longitude: 98.85 },
    5: { sign: 'Leo', degree: 11.32, longitude: 131.32 },
    6: { sign: 'Virgo', degree: 11.55, longitude: 161.55 },
    7: { sign: 'Libra', degree: 8.08, longitude: 188.08 },
    8: { sign: 'Escorpio', degree: 5.62, longitude: 215.62 },
    9: { sign: 'Sagitario', degree: 6.28, longitude: 246.28 },
    10: { sign: 'Capricornio', degree: 8.85, longitude: 278.85 },
    11: { sign: 'Acuario', degree: 11.32, longitude: 311.32 },
    12: { sign: 'Piscis', degree: 11.55, longitude: 341.55 }
  },
  
  // Lilith Mean
  lilith: {
    sign: 'Libra',
    degree: 12.40,
    longitude: 192.40
  }
};

// ============================================================================
// FUNCIONES DE VERIFICACIÓN
// ============================================================================

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

function calculateError(calculated: number, reference: number): number {
  let diff = calculated - reference;
  // Ajustar para diferencias circulares
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return Math.abs(diff);
}

function signFromLongitude(lon: number): string {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  const normalized = normalizeAngle(lon);
  const index = Math.floor(normalized / 30);
  return signs[index];
}

function degreeInSign(lon: number): number {
  const normalized = normalizeAngle(lon);
  return normalized % 30;
}

// ============================================================================
// TESTS
// ============================================================================

console.log('🔬 INICIANDO TESTS DE PRECISIÓN ASTRONÓMICA');
console.log('=' .repeat(80));
console.log(`📍 Caso: ${TEST_CASE.name}`);
console.log(`📅 Fecha: ${TEST_CASE.date.toISOString()}`);
console.log(`🌍 Ubicación: ${TEST_CASE.location.name} (${TEST_CASE.location.lat}°, ${TEST_CASE.location.lon}°)`);
console.log('=' .repeat(80));

const jd = dateToJulian(TEST_CASE.date);
console.log(`\n🌙 Día Juliano: ${jd.toFixed(6)}`);

// ============================================================================
// TEST 1: LILITH MEAN
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('🌑 TEST 1: LILITH MEAN');
console.log('='.repeat(80));

const lilithCalc = await calculateLilithMeanPrecise(jd);
const lilithError = calculateError(lilithCalc.longitude, REFERENCE.lilith.longitude);

console.log(`\n📊 Resultados:`);
console.log(`   Calculado: ${lilithCalc.sign} ${lilithCalc.degree.toFixed(2)}° (${lilithCalc.longitude.toFixed(2)}°)`);
console.log(`   Referencia: ${REFERENCE.lilith.sign} ${REFERENCE.lilith.degree.toFixed(2)}° (${REFERENCE.lilith.longitude.toFixed(2)}°)`);
console.log(`   Error: ${lilithError.toFixed(2)}°`);

if (lilithError < 1.0) {
  console.log(`   ✅ PERFECTO (error < 1°)`);
} else if (lilithError < 5.0) {
  console.log(`   ⚠️  ACEPTABLE (error < 5°)`);
} else {
  console.log(`   ❌ NECESITA CORRECCIÓN (error > 5°)`);
}

// ============================================================================
// TEST 2: SISTEMA PLACIDUS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('🏠 TEST 2: SISTEMA PLACIDUS');
console.log('='.repeat(80));

const housesCalc = await calculatePlacidusHouses(jd, TEST_CASE.location.lat, TEST_CASE.location.lon);

console.log(`\n📊 Ascendente:`);
console.log(`   Calculado: ${housesCalc.ascendant.sign} ${housesCalc.ascendant.degree.toFixed(2)}° (${housesCalc.ascendant.longitude.toFixed(2)}°)`);
console.log(`   Referencia: ${REFERENCE.angles.asc.sign} ${REFERENCE.angles.asc.degree.toFixed(2)}° (${REFERENCE.angles.asc.longitude.toFixed(2)}°)`);
const ascError = calculateError(housesCalc.ascendant.longitude, REFERENCE.angles.asc.longitude);
console.log(`   Error: ${ascError.toFixed(2)}° ${ascError < 1.0 ? '✅' : '❌'}`);

console.log(`\n📊 Medio Cielo:`);
console.log(`   Calculado: ${housesCalc.midheaven.sign} ${housesCalc.midheaven.degree.toFixed(2)}° (${housesCalc.midheaven.longitude.toFixed(2)}°)`);
console.log(`   Referencia: ${REFERENCE.angles.mc.sign} ${REFERENCE.angles.mc.degree.toFixed(2)}° (${REFERENCE.angles.mc.longitude.toFixed(2)}°)`);
const mcError = calculateError(housesCalc.midheaven.longitude, REFERENCE.angles.mc.longitude);
console.log(`   Error: ${mcError.toFixed(2)}° ${mcError < 1.0 ? '✅' : '❌'}`);

console.log(`\n📊 Casas (Placidus):`);
console.log(`   ${'Casa'.padEnd(6)} ${'Calculado'.padEnd(25)} ${'Referencia'.padEnd(25)} ${'Error'.padEnd(12)} Status`);
console.log(`   ${'-'.repeat(85)}`);

let totalError = 0;
let maxError = 0;
let errorsAbove5 = 0;

for (let i = 0; i < 12; i++) {
  const house = housesCalc.houses[i];
  const houseNum = house.number;
  const ref = REFERENCE.houses[houseNum];
  
  const error = calculateError(house.longitude, ref.longitude);
  totalError += error;
  if (error > maxError) maxError = error;
  if (error > 5) errorsAbove5++;
  
  const status = error < 1.0 ? '✅ PERFECTO' : 
                 error < 3.0 ? '✅ EXCELENTE' :
                 error < 5.0 ? '⚠️  BUENO' : 
                 error < 10.0 ? '⚠️  ACEPTABLE' : '❌ MALO';
  
  const calcStr = `${house.sign} ${house.degree.toFixed(2)}°`.padEnd(25);
  const refStr = `${ref.sign} ${ref.degree.toFixed(2)}°`.padEnd(25);
  const errorStr = `${error.toFixed(2)}°`.padEnd(12);
  
  console.log(`   ${String(houseNum).padEnd(6)} ${calcStr} ${refStr} ${errorStr} ${status}`);
}

const avgError = totalError / 12;

console.log(`\n📈 Estadísticas:`);
console.log(`   Error promedio: ${avgError.toFixed(2)}°`);
console.log(`   Error máximo: ${maxError.toFixed(2)}°`);
console.log(`   Casas con error > 5°: ${errorsAbove5}/12`);

// ============================================================================
// RESUMEN FINAL
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('📋 RESUMEN FINAL');
console.log('='.repeat(80));

const lilithPass = lilithError < 1.0;
const ascPass = ascError < 1.0;
const mcPass = mcError < 1.0;
const housesPass = maxError < 3.0 && avgError < 1.5;

console.log(`\n✓ Lilith Mean: ${lilithPass ? '✅ PASS' : '❌ FAIL'} (error: ${lilithError.toFixed(2)}°)`);
console.log(`✓ Ascendente: ${ascPass ? '✅ PASS' : '❌ FAIL'} (error: ${ascError.toFixed(2)}°)`);
console.log(`✓ Medio Cielo: ${mcPass ? '✅ PASS' : '❌ FAIL'} (error: ${mcError.toFixed(2)}°)`);
console.log(`✓ Casas Placidus: ${housesPass ? '✅ PASS' : '❌ FAIL'} (promedio: ${avgError.toFixed(2)}°, máx: ${maxError.toFixed(2)}°)`);

const allPass = lilithPass && ascPass && mcPass && housesPass;

console.log('\n' + '='.repeat(80));
if (allPass) {
  console.log('🎉 ¡TODOS LOS TESTS PASARON! PRECISIÓN QUIRÚRGICA ALCANZADA');
} else {
  console.log('⚠️  ALGUNOS TESTS FALLARON - SE REQUIEREN AJUSTES');
}
console.log('='.repeat(80));

// Retornar resultados para análisis
return {
  lilith: { error: lilithError, pass: lilithPass },
  asc: { error: ascError, pass: ascPass },
  mc: { error: mcError, pass: mcPass },
  houses: { avgError, maxError, pass: housesPass },
  overall: allPass
};

})().then(results => {
  if (!results.overall) {
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ ERROR FATAL EN TEST:', error);
  process.exit(1);
});
