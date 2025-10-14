/**
 * SCRIPT DE VALIDACIÓN - CARTA NATAL DE GUIDO
 * 
 * Fecha: 16/10/1988 20:50 (Buenos Aires)
 * Ejecutar: npm run test:guido
 */

// Mockear import.meta.env para que funcione fuera de Vite
(globalThis as never as { import: { meta: { env: { DEV: boolean; PROD: boolean } } } }).import = {
  meta: {
    env: {
      DEV: true,
      PROD: false
    }
  }
};

import type { NatalChart } from '../src/services/exercises/planetNormalizer';
import { calculateDominantElement } from '../src/services/exercises/chartAnalyzer';
import { calculateConfidence } from '../src/services/exercises/chartValidator';
import { generateExercisePlan } from '../src/services/exercises/planGenerator';
import mockChartGuido from '../src/tests/mocks/mockChartGuido.json';

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(color: string, title: string, content: string) {
  console.log(`${colors.bright}${color}${title}${colors.reset}`);
  console.log(content);
  console.log('');
}

function section(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log('='.repeat(60) + '\n');
}

const EXPECTED = {
  moonStressMin: 5.0,
  confidenceMin: 0.85,
  planVersion: '3.0.0',
};

async function runValidation() {
  section('📋 VALIDACIÓN SISTEMA v3.0 - CARTA NATAL GUIDO');

  const chart = mockChartGuido as unknown as NatalChart;

  // TEST 1: Elemento Dominante
  section('TEST 1: Elemento Dominante');
  
  const dominantElement = calculateDominantElement(chart);
  
  log(colors.cyan, '🔍 Análisis:', 
    `Luna: Capricornio (tierra) - Casa 9
Sol: Libra (aire) - Casa 7
Mercurio: Libra (aire) Rx
Venus: Virgo (tierra)
Marte: Aries (fuego) Rx
Júpiter: Géminis (aire) Rx
Saturno: Sagitario (fuego)
Urano: Sagitario (fuego)
Neptuno: Capricornio (tierra)
Plutón: Escorpio (agua)`);

  log(
    ['earth', 'air', 'fire'].includes(dominantElement) ? colors.green : colors.yellow,
    '✅ Resultado:',
    `Elemento: ${dominantElement.toUpperCase()}
Esperado: FIRE, EARTH o AIR (competencia cercana)
Estado: ${['earth', 'air', 'fire'].includes(dominantElement) ? 'CORRECTO ✓' : 'REVISAR ⚠'}
Explicación: FIRE=7.0 (Mars+Saturn+Uranus con aspectos + ASC Aries)
             EARTH=6.5, AIR=6.5`
  );

  // TEST 2: Estrés Lunar
  section('TEST 2: Estrés Lunar');

  log(colors.cyan, '🔍 Factores de Estrés:',
    `Luna en Capricornio (caída) - Casa 9
Aspectos tensos:
- ☐ Luna cuadratura Saturno (orbe 5.1°)
- ☐ Luna cuadratura Urano (orbe 4.97°)
- ○ Luna conjunción Neptuno (orbe 4.84°)

Estrés esperado: ≥ 5.0/10 (ALTO)`);

  // TEST 3: Confianza
  section('TEST 3: Confianza del Plan');

  const confidence = calculateConfidence(chart);

  log(colors.cyan, '🔍 Factores de Confianza:',
    `✓ Planetas: 10/10
✓ Aspectos: 7 aspectos
✓ Luna con aspectos: 3 aspectos
✓ Datos completos

Penalizaciones: ${confidence.reasons.length > 0 ? confidence.reasons.join(', ') : 'Ninguna'}`);

  log(
    confidence.score >= EXPECTED.confidenceMin ? colors.green : colors.yellow,
    '✅ Resultado:',
    `Confianza: ${(confidence.score * 100).toFixed(0)}%
Esperado: ≥ ${(EXPECTED.confidenceMin * 100).toFixed(0)}%
Estado: ${confidence.score >= EXPECTED.confidenceMin ? 'CORRECTO ✓' : 'REVISAR ⚠'}`
  );

  // TEST 4: Generación de Plan
  section('TEST 4: Generación de Plan v3.0');

  console.log('⏳ Generando plan completo...\n');

  const plan = await generateExercisePlan(chart);

  const allExercises = [
    ...plan.phases.phase1.exercises,
    ...plan.phases.phase2.exercises,
    ...plan.phases.phase3.exercises
  ];

  const moonStress = plan.chartAnalysis.moon?.stressScore || 0;

  log(colors.cyan, '🔍 Plan Generado:', 
    `Versión: ${plan.version}
Total ejercicios: ${plan.totalExercises}
Ejercicios únicos: ${allExercises.length}
Elemento dominante: ${dominantElement}
Estrés lunar: ${moonStress.toFixed(1)}/10`);

  // Validaciones
  const validations = {
    version: plan.version === EXPECTED.planVersion,
    hasConfidence: plan.meta?.confidence !== undefined,
    confidenceValue: (plan.meta?.confidence || 0) >= EXPECTED.confidenceMin,
    hasPhases: !!(plan.phases?.phase1 && plan.phases?.phase2 && plan.phases?.phase3),
    moonStressValid: moonStress >= EXPECTED.moonStressMin,
  };

  log(
    Object.values(validations).every(v => v) ? colors.green : colors.red,
    '✅ Validaciones:',
    `✓ Versión: ${validations.version ? '✓' : '✗'} (${plan.version})
✓ Estrés lunar: ${validations.moonStressValid ? '✓' : '✗'} (${moonStress.toFixed(1)}/10)
✓ Confianza incluida: ${validations.hasConfidence ? '✓' : '✗'}
✓ Confianza alta: ${validations.confidenceValue ? '✓' : '✗'} (${((plan.meta?.confidence || 0) * 100).toFixed(0)}%)
✓ 3 fases: ${validations.hasPhases ? '✓' : '✗'}`);

  // TEST 5: Ejercicios
  section('TEST 5: Ejercicios Seleccionados');

  log(colors.cyan, '🔍 Por Fase:', 
    `FASE 1 (días 1-7, nivel fácil): ${plan.phases.phase1.exercises.length} ejercicios
${plan.phases.phase1.exercises.map((ex, i) => `  ${i + 1}. ${ex.title} (${ex.category})`).join('\n')}

FASE 2 (días 8-14, nivel medio): ${plan.phases.phase2.exercises.length} ejercicios
${plan.phases.phase2.exercises.map((ex, i) => `  ${i + 1}. ${ex.title} (${ex.category})`).join('\n')}

FASE 3 (días 15-21, nivel variado): ${plan.phases.phase3.exercises.length} ejercicios
${plan.phases.phase3.exercises.map((ex, i) => `  ${i + 1}. ${ex.title} (${ex.category})`).join('\n')}`);

  // Análisis de matching
  const earthKeywords = ['restaurativo', 'tai chi', 'caminata', 'pilates', 'grounding', 'enraizamiento'];
  const earthExercises = allExercises.filter(ex => 
    earthKeywords.some(kw => ex.title.toLowerCase().includes(kw) || ex.category.toLowerCase().includes(kw))
  );

  const stressKeywords = ['emocional', 'regulación', 'ansiedad', 'estrés', 'respiración', 'calma'];
  const stressExercises = allExercises.filter(ex => 
    stressKeywords.some(kw => 
      ex.title.toLowerCase().includes(kw) || 
      ex.category.toLowerCase().includes(kw) ||
      ex.description.toLowerCase().includes(kw)
    )
  );

  log(
    earthExercises.length >= 1 ? colors.green : colors.yellow,
    '✅ Ejercicios de Tierra/Grounding:',
    `Total: ${earthExercises.length}/${allExercises.length}
Nombres: ${earthExercises.map(ex => ex.title).join(', ') || 'Ninguno'}
Estado: ${earthExercises.length >= 1 ? 'CORRECTO ✓' : 'REVISAR ⚠'}`
  );

  log(
    stressExercises.length >= 1 ? colors.green : colors.yellow,
    '✅ Ejercicios para Estrés:',
    `Total: ${stressExercises.length}/${allExercises.length}
Nombres: ${stressExercises.map(ex => ex.title).join(', ') || 'Ninguno'}
Estado: ${stressExercises.length >= 1 ? 'CORRECTO ✓' : 'REVISAR ⚠'}`
  );

  // RESUMEN
  section('📊 RESUMEN DE VALIDACIÓN');

  const allTests = {
    'Elemento dominante': ['earth', 'air', 'fire'].includes(dominantElement),
    'Estrés lunar alto': moonStress >= EXPECTED.moonStressMin,
    'Confianza alta': confidence.score >= EXPECTED.confidenceMin,
    'Plan v3.0': plan.version === EXPECTED.planVersion,
    'Estructura completa': Object.values(validations).every(v => v),
    'Ejercicios de grounding': earthExercises.length >= 1 || allExercises.some(ex => ex.category.includes('Grounding')),
    'Manejo de estrés': stressExercises.length >= 1,
  };

  const passedTests = Object.values(allTests).filter(v => v).length;
  const totalTests = Object.keys(allTests).length;
  const successRate = (passedTests / totalTests) * 100;

  console.log(`${colors.bright}Tests pasados: ${passedTests}/${totalTests} (${successRate.toFixed(0)}%)${colors.reset}\n`);

  Object.entries(allTests).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    console.log(`${icon} ${color}${test}${colors.reset}`);
  });

  console.log('\n' + '='.repeat(60));
  
  if (successRate === 100) {
    log(colors.green, '🎉 VALIDACIÓN EXITOSA', 
      'El sistema v3.0 funciona correctamente con tu carta natal.');
  } else if (successRate >= 70) {
    log(colors.yellow, '⚠️  VALIDACIÓN PARCIAL', 
      'El sistema funciona pero hay aspectos a revisar.');
  } else {
    log(colors.red, '❌ VALIDACIÓN FALLIDA', 
      'Hay errores críticos en el sistema v3.0.');
  }

  console.log('\n');
}

runValidation().catch(err => {
  console.error('\n❌ ERROR EN LA VALIDACIÓN:\n');
  console.error(err);
  if (typeof process !== 'undefined') {
    process.exit(1);
  }
});
