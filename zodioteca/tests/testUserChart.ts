/**
 * 🎯 TEST VALIDACIÓN: CARTA NATAL DEL USUARIO
 * 
 * Datos de nacimiento:
 * - Fecha: 16 de octubre de 1988
 * - Hora: 17:50 (hora local -03:00)
 * - Lugar: Buenos Aires, Argentina
 * - Coordenadas: 34°36'S (34.6°S), 58°27'W (58.45°W)
 * - Sistema de casas: Placidus
 * - Hora sideral local: 18:38:32
 * 
 * VALORES REALES (de software profesional):
 * ┌──────────────┬──────────┬─────────┬───────┬───────────┐
 * │ Punto        │ Signo    │ Grados  │ Casa  │ Retrógrado│
 * ├──────────────┼──────────┼─────────┼───────┼───────────┤
 * │ Nodo Norte   │ Piscis   │ 11°49'  │ 12    │ R         │
 * │ Quirón       │ Cáncer   │  7°10'  │  3    │ R         │
 * │ Fortuna      │ Géminis  │ 17°10'  │  3    │ -         │
 * │ Vértex       │ Libra    │ 27°02'  │  7    │ -         │
 * └──────────────┴──────────┴─────────┴───────┴───────────┘
 * 
 * Objetivo: Comparar cálculos con valores reales y medir precisión
 */

import { calculateAdvancedChart } from '../src/services/advancedAstroCalculator';
import type { AdvancedCalculationParams, AdvancedCalculationOptions } from '../src/types/advancedChart';
// @ts-expect-error - astronomia no tiene tipos oficiales
import { JulianDay } from 'astronomia';

// ========================================
// DATOS DE REFERENCIA (VALORES REALES)
// ========================================

interface RealValue {
  name: string;
  sign: string;
  degrees: number;
  minutes: number;
  house: number;
  isRetrograde?: boolean;
  // Longitud total calculada (signo * 30 + grados + minutos/60)
  expectedLongitude: number;
}

const REAL_VALUES: RealValue[] = [
  {
    name: 'Nodo Norte',
    sign: 'Piscis',
    degrees: 11,
    minutes: 49,
    house: 12,
    isRetrograde: true,
    expectedLongitude: 11 * 30 + 11 + 49/60, // Piscis = signo 12 (11*30=330)
  },
  {
    name: 'Quirón',
    sign: 'Cáncer',
    degrees: 7,
    minutes: 10,
    house: 3,
    isRetrograde: true,
    expectedLongitude: 3 * 30 + 7 + 10/60, // Cáncer = signo 4 (3*30=90)
  },
  {
    name: 'Parte de la Fortuna',
    sign: 'Géminis',
    degrees: 17,
    minutes: 10,
    house: 3,
    isRetrograde: false,
    expectedLongitude: 2 * 30 + 17 + 10/60, // Géminis = signo 3 (2*30=60)
  },
  {
    name: 'Vértex',
    sign: 'Libra',
    degrees: 27,
    minutes: 2,
    house: 7,
    isRetrograde: false,
    expectedLongitude: 6 * 30 + 27 + 2/60, // Libra = signo 7 (6*30=180)
  },
];

// ========================================
// UTILIDADES
// ========================================

/**
 * Convierte fecha a Día Juliano
 */
function dateToJulianDay(date: Date): number {
  const jd = new JulianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  );
  return jd.toJD();
}

/**
 * Genera cúspides de casas usando sistema Placidus (aproximación)
 * NOTA: Para precisión real se necesitaría integrar cálculo Placidus completo
 */
function generatePlacidusHouseCusps(ascendantLon: number, mcLon: number): number[] {
  const cusps: number[] = [];
  
  // Casa 1 = Ascendente
  cusps[0] = ascendantLon;
  
  // Casa 10 = Medio Cielo
  cusps[9] = mcLon;
  
  // Casas 2, 3, 11, 12 (interpolación aproximada)
  // En Placidus real esto requiere cálculo trigonométrico complejo
  const diff1to10 = ((mcLon - ascendantLon + 360) % 360);
  cusps[1] = (ascendantLon + diff1to10 * 0.33) % 360; // Casa 2
  cusps[2] = (ascendantLon + diff1to10 * 0.66) % 360; // Casa 3
  cusps[10] = (mcLon + 30) % 360; // Casa 11
  cusps[11] = (mcLon + 60) % 360; // Casa 12
  
  // Casas opuestas (4-5-6-7-8-9)
  for (let i = 3; i < 9; i++) {
    cusps[i] = (cusps[i - 3] + 180) % 360;
  }
  
  return cusps;
}

/**
 * Convierte longitud a formato signo + grados + minutos
 */
function formatLongitude(longitude: number): string {
  const signIndex = Math.floor(longitude / 30);
  const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const sign = signs[signIndex];
  const degreeInSign = longitude % 30;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degrees) * 60);
  
  return `${sign} ${degrees}°${minutes.toString().padStart(2, '0')}'`;
}

/**
 * Calcula diferencia en grados entre dos longitudes
 */
function calculateDifference(calculated: number, expected: number): number {
  let diff = Math.abs(calculated - expected);
  // Manejar el caso del círculo (ej: 359° vs 1°)
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// ========================================
// TEST PRINCIPAL
// ========================================

export async function testUserBirthChart() {
  console.log('\n' + '╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(18) + '🎯 VALIDACIÓN: CARTA NATAL DEL USUARIO' + ' '.repeat(19) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  console.log('\n📋 DATOS DE NACIMIENTO:');
  console.log('─'.repeat(80));
  console.log('   • Fecha: 16 de octubre de 1988');
  console.log('   • Hora: 17:50 (local -03:00) = 20:50 UTC');
  console.log('   • Lugar: Buenos Aires, Argentina');
  console.log('   • Coordenadas: 34°36\'S (34.6°S), 58°27\'W (58.45°W)');
  console.log('   • Sistema de casas: Placidus');
  console.log('   • Hora sideral local: 18:38:32');
  
  try {
    // Fecha en UTC (17:50 - 03:00 = 20:50 UTC)
    const birthDate = new Date(Date.UTC(1988, 9, 16, 20, 50, 0)); // Oct = mes 9
    const julianDay = dateToJulianDay(birthDate);
    const latitude = -34.6;  // Sur (negativo)
    const longitude = -58.45; // Oeste (negativo)
    
    console.log('\n🔢 PARÁMETROS CALCULADOS:');
    console.log('─'.repeat(80));
    console.log(`   • Día Juliano: ${julianDay.toFixed(6)}`);
    console.log(`   • Fecha UTC: ${birthDate.toISOString()}`);
    
    // Para el test usamos cúspides aproximadas
    // En producción, se obtendrían del cálculo real de casas Placidus
    // Ascendente aproximado para Buenos Aires a esa hora
    const ascendantLon = 285; // ~15° Capricornio (estimación)
    const mcLon = 210; // ~0° Escorpio (estimación)
    const houseCusps = generatePlacidusHouseCusps(ascendantLon, mcLon);
    
    console.log(`   • Ascendente (est.): ${formatLongitude(ascendantLon)}`);
    console.log(`   • MC (est.): ${formatLongitude(mcLon)}`);
    
    // IMPORTANTE: Para el cálculo de Parte de Fortuna necesitamos Sol y Luna
    // Estos valores son aproximados para el test
    const sunLongitude = 203; // Sol ~23° Libra (16 Oct 1988)
    const moonLongitude = 280; // Luna estimada
    
    // Parámetros de cálculo
    const params: AdvancedCalculationParams = {
      julianDay,
      latitude,
      longitude,
      houseCusps,
      ascendantLongitude: ascendantLon,
      sunLongitude,
      moonLongitude,
    };
    
    // Opciones: calcular todo
    const options: AdvancedCalculationOptions = {
      calculateAsteroids: false, // No tenemos valores de referencia para asteroides
      calculateChiron: true,
      calculateMidheaven: true,
      calculatePartOfFortune: true,
      calculateNodes: true,
      calculateVertex: true,
    };
    
    console.log('\n🚀 EJECUTANDO CÁLCULOS AVANZADOS...\n');
    
    const result = await calculateAdvancedChart(params, options);
    
    // ========================================
    // COMPARACIÓN CON VALORES REALES
    // ========================================
    
    console.log('\n' + '═'.repeat(80));
    console.log('📊 COMPARACIÓN: VALORES CALCULADOS vs VALORES REALES');
    console.log('═'.repeat(80));
    
    const comparisons: Array<{
      name: string;
      expected: string;
      calculated: string;
      diffDegrees: number;
      diffMinutes: number;
      houseExpected: number;
      houseCalculated: number;
      retrogradeExpected: boolean;
      retrogradeCalculated: boolean;
      passed: boolean;
    }> = [];
    
    // 1. NODO NORTE
    const realNorthNode = REAL_VALUES.find(v => v.name === 'Nodo Norte')!;
    const calcNorthNode = result.specialPoints.northNode;
    
    if (calcNorthNode) {
      const diff = calculateDifference(calcNorthNode.longitude, realNorthNode.expectedLongitude);
      const passed = diff < 2.0; // Tolerancia: 2 grados
      
      comparisons.push({
        name: 'Nodo Norte ☊',
        expected: `${realNorthNode.sign} ${realNorthNode.degrees}°${realNorthNode.minutes.toString().padStart(2, '0')}' (Casa ${realNorthNode.house}) ${realNorthNode.isRetrograde ? 'R' : ''}`,
        calculated: `${calcNorthNode.sign} ${calcNorthNode.degree.toFixed(0)}°${Math.floor((calcNorthNode.degree % 1) * 60).toString().padStart(2, '0')}' (Casa ${calcNorthNode.house})`,
        diffDegrees: Math.floor(diff),
        diffMinutes: Math.floor((diff % 1) * 60),
        houseExpected: realNorthNode.house,
        houseCalculated: calcNorthNode.house,
        retrogradeExpected: realNorthNode.isRetrograde || false,
        retrogradeCalculated: false, // Los nodos siempre son retrógrados (movimiento medio)
        passed,
      });
    }
    
    // 2. QUIRÓN
    const realChiron = REAL_VALUES.find(v => v.name === 'Quirón')!;
    const calcChiron = result.chiron;
    
    if (calcChiron) {
      const diff = calculateDifference(calcChiron.longitude, realChiron.expectedLongitude);
      const passed = diff < 2.0;
      
      comparisons.push({
        name: 'Quirón ⚷',
        expected: `${realChiron.sign} ${realChiron.degrees}°${realChiron.minutes.toString().padStart(2, '0')}' (Casa ${realChiron.house}) ${realChiron.isRetrograde ? 'R' : ''}`,
        calculated: `${calcChiron.sign} ${calcChiron.degree.toFixed(0)}°${Math.floor((calcChiron.degree % 1) * 60).toString().padStart(2, '0')}' (Casa ${calcChiron.house}) ${calcChiron.retrograde ? 'R' : ''}`,
        diffDegrees: Math.floor(diff),
        diffMinutes: Math.floor((diff % 1) * 60),
        houseExpected: realChiron.house,
        houseCalculated: calcChiron.house,
        retrogradeExpected: realChiron.isRetrograde || false,
        retrogradeCalculated: calcChiron.retrograde || false,
        passed,
      });
    }
    
    // 3. PARTE DE LA FORTUNA
    const realFortune = REAL_VALUES.find(v => v.name === 'Parte de la Fortuna')!;
    const calcFortune = result.specialPoints.partOfFortune;
    
    if (calcFortune) {
      const diff = calculateDifference(calcFortune.longitude, realFortune.expectedLongitude);
      const passed = diff < 5.0; // Mayor tolerancia (depende de Sol/Luna)
      
      comparisons.push({
        name: 'Parte Fortuna ⊕',
        expected: `${realFortune.sign} ${realFortune.degrees}°${realFortune.minutes.toString().padStart(2, '0')}' (Casa ${realFortune.house})`,
        calculated: `${calcFortune.sign} ${calcFortune.degree.toFixed(0)}°${Math.floor((calcFortune.degree % 1) * 60).toString().padStart(2, '0')}' (Casa ${calcFortune.house})`,
        diffDegrees: Math.floor(diff),
        diffMinutes: Math.floor((diff % 1) * 60),
        houseExpected: realFortune.house,
        houseCalculated: calcFortune.house,
        retrogradeExpected: false,
        retrogradeCalculated: false,
        passed,
      });
    }
    
    // 4. VÉRTEX
    const realVertex = REAL_VALUES.find(v => v.name === 'Vértex')!;
    const calcVertex = result.specialPoints.vertex;
    
    if (calcVertex) {
      const diff = calculateDifference(calcVertex.longitude, realVertex.expectedLongitude);
      const passed = diff < 3.0; // Tolerancia moderada
      
      comparisons.push({
        name: 'Vértex Vx',
        expected: `${realVertex.sign} ${realVertex.degrees}°${realVertex.minutes.toString().padStart(2, '0')}' (Casa ${realVertex.house})`,
        calculated: `${calcVertex.sign} ${calcVertex.degree.toFixed(0)}°${Math.floor((calcVertex.degree % 1) * 60).toString().padStart(2, '0')}' (Casa ${calcVertex.house})`,
        diffDegrees: Math.floor(diff),
        diffMinutes: Math.floor((diff % 1) * 60),
        houseExpected: realVertex.house,
        houseCalculated: calcVertex.house,
        retrogradeExpected: false,
        retrogradeCalculated: false,
        passed,
      });
    }
    
    // ========================================
    // TABLA DE RESULTADOS
    // ========================================
    
    console.log('\n┌────────────────────┬──────────────────────────────┬──────────────────────────────┬─────────────┬────────┐');
    console.log('│ Punto              │ Valor Real                   │ Valor Calculado              │ Diferencia  │ Estado │');
    console.log('├────────────────────┼──────────────────────────────┼──────────────────────────────┼─────────────┼────────┤');
    
    for (const comp of comparisons) {
      const namePadded = comp.name.padEnd(18);
      const expectedPadded = comp.expected.padEnd(28);
      const calculatedPadded = comp.calculated.padEnd(28);
      const diff = `${comp.diffDegrees}°${comp.diffMinutes.toString().padStart(2, '0')}'`.padEnd(11);
      const status = comp.passed ? '✅ OK ' : '⚠️ Rev ';
      
      console.log(`│ ${namePadded} │ ${expectedPadded} │ ${calculatedPadded} │ ${diff} │ ${status} │`);
    }
    
    console.log('└────────────────────┴──────────────────────────────┴──────────────────────────────┴─────────────┴────────┘');
    
    // ========================================
    // ANÁLISIS DETALLADO
    // ========================================
    
    console.log('\n📈 ANÁLISIS DETALLADO:');
    console.log('─'.repeat(80));
    
    for (const comp of comparisons) {
      console.log(`\n🔹 ${comp.name}`);
      console.log(`   • Diferencia: ${comp.diffDegrees}° ${comp.diffMinutes}' (${comp.passed ? '✅ Dentro de tolerancia' : '⚠️ Revisar'})`);
      console.log(`   • Casa: Real=${comp.houseExpected}, Calc=${comp.houseCalculated} ${comp.houseExpected === comp.houseCalculated ? '✅' : '⚠️'}`);
      if (comp.retrogradeExpected !== undefined) {
        const retroMatch = comp.retrogradeExpected === comp.retrogradeCalculated;
        console.log(`   • Retrógrado: Real=${comp.retrogradeExpected ? 'Sí' : 'No'}, Calc=${comp.retrogradeCalculated ? 'Sí' : 'No'} ${retroMatch ? '✅' : '⚠️'}`);
      }
    }
    
    // ========================================
    // RESUMEN FINAL
    // ========================================
    
    const passed = comparisons.filter(c => c.passed).length;
    const total = comparisons.length;
    const percentage = ((passed / total) * 100).toFixed(0);
    
    console.log('\n' + '═'.repeat(80));
    console.log('🎯 RESUMEN FINAL');
    console.log('═'.repeat(80));
    console.log(`   • Tests pasados: ${passed}/${total} (${percentage}%)`);
    console.log(`   • Precisión: ${passed === total ? '✅ EXCELENTE' : passed >= total * 0.75 ? '✅ BUENA' : '⚠️ REQUIERE AJUSTES'}`);
    
    if (passed < total) {
      console.log('\n⚠️ NOTAS:');
      console.log('   • Las diferencias pueden deberse a:');
      console.log('     - Uso de casas aproximadas (necesitamos Placidus real)');
      console.log('     - Valores de Sol/Luna estimados para Parte de Fortuna');
      console.log('     - Diferencias en algoritmos de cálculo (Swiss Ephemeris vs otros)');
      console.log('     - Precisión de coordenadas geográficas');
    }
    
    console.log('\n' + '═'.repeat(80) + '\n');
    
    return passed === total;
    
  } catch (error) {
    console.error('❌ Error en test de carta del usuario:', error);
    return false;
  }
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default testUserBirthChart;
