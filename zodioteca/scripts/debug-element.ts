import { calculateDominantElement } from '../src/services/exercises/chartAnalyzer';
import mockChartGuido from '../src/tests/mocks/mockChartGuido.json';
import type { NatalChart } from '../src/services/exercises/planetNormalizer';

const chart = mockChartGuido as unknown as NatalChart;

console.log('🔍 DEBUG: Calculando elemento dominante...\n');

// Simular el cálculo interno
const weights: Record<string, number> = {
  fire: 0,
  earth: 0,
  air: 0,
  water: 0
};

const personal = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']);
const social = new Set(['Jupiter', 'Saturn']);

console.log('Planetas:');
for (const p of chart.planets || []) {
  const elem = ['Aries', 'Leo', 'Sagittarius'].includes(p.sign) ? 'fire' :
                ['Taurus', 'Virgo', 'Capricorn'].includes(p.sign) ? 'earth' :
                ['Gemini', 'Libra', 'Aquarius'].includes(p.sign) ? 'air' : 'water';
  
  let w = personal.has(p.name) ? 2 : social.has(p.name) ? 1.5 : 1;
  const angular = [1, 4, 7, 10].includes(p.house);
  
  if (angular) w += 0.5;
  
  weights[elem] += w;
  
  console.log(`  ${p.name} en ${p.sign} (${elem}) casa ${p.house}: peso ${w}${angular ? ' (angular)' : ''}`);
}

const chartWithAngles = chart as typeof chart & { angles?: { asc?: { sign: string }; mc?: { sign: string } } };
if (chartWithAngles.angles?.asc) {
  const ascElem = ['Aries', 'Leo', 'Sagittarius'].includes(chartWithAngles.angles.asc.sign) ? 'fire' :
                   ['Taurus', 'Virgo', 'Capricorn'].includes(chartWithAngles.angles.asc.sign) ? 'earth' :
                   ['Gemini', 'Libra', 'Aquarius'].includes(chartWithAngles.angles.asc.sign) ? 'air' : 'water';
  weights[ascElem] += 1.0;
  console.log(`  ASC en ${chartWithAngles.angles.asc.sign} (${ascElem}): peso 1.0`);
}

if (chartWithAngles.angles?.mc) {
  const mcElem = ['Aries', 'Leo', 'Sagittarius'].includes(chartWithAngles.angles.mc.sign) ? 'fire' :
                  ['Taurus', 'Virgo', 'Capricorn'].includes(chartWithAngles.angles.mc.sign) ? 'earth' :
                  ['Gemini', 'Libra', 'Aquarius'].includes(chartWithAngles.angles.mc.sign) ? 'air' : 'water';
  weights[mcElem] += 1.0;
  console.log(`  MC en ${chartWithAngles.angles.mc.sign} (${mcElem}): peso 1.0`);
}

console.log('\nPesos totales:');
Object.entries(weights).sort(([, a], [, b]) => b - a).forEach(([elem, weight]) => {
  console.log(`  ${elem}: ${weight}`);
});

const result = calculateDominantElement(chart);
console.log(`\n✅ Resultado: ${result.toUpperCase()}`);
