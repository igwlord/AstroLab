/**
 * TEST FINAL - VALIDACIÓN DE 4 FIXES CRÍTICOS
 * 1. ✅ Deduplicación de ejercicios en fases
 * 2. ✅ meta.confidence sincronizada con chartAnalysis
 * 3. ✅ estimatedDailyMinutes mínimo 10 min
 * 4. ✅ Ejercicios de grounding para balance earth
 */

import { generateExercisePlan } from './src/services/exercises/planGenerator';
import type { NatalChart } from './src/services/exercises/planetNormalizer';
import mockChartGuido from './src/tests/mocks/mockChartGuido.json' assert { type: 'json' };

console.log('🧪 TEST FINAL - VALIDACIÓN DE FIXES CRÍTICOS v3.0\n');
console.log('=' .repeat(70));

async function runTests() {
  const chart = mockChartGuido as NatalChart;
  
  console.log('\n📋 DATOS DE LA CARTA:');
  console.log(`   Fecha: Oct 16, 1988, 20:50, Buenos Aires`);
  console.log(`   Planetas: ${chart.planets?.length || 0}`);
  console.log(`   Aspectos: ${chart.aspects?.length || 0}`);

  console.log('\n🚀 Generando plan de ejercicios...\n');
  
  const plan = await generateExercisePlan(chart, {
    chartId: 'test-guido-critical-fixes',
    userId: 'test-user'
  });

  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTADOS DEL PLAN GENERADO');
  console.log('='.repeat(70));

  // ========================================
  // TEST 1: DEDUPLICACIÓN
  // ========================================
  console.log('\n1️⃣ TEST: DEDUPLICACIÓN DE EJERCICIOS');
  console.log('-'.repeat(70));
  
  const allExercises = [
    ...plan.phases.phase1.exercises,
    ...plan.phases.phase2.exercises,
    ...plan.phases.phase3.exercises
  ];
  
  const exerciseIds = allExercises.map(e => e.id);
  const uniqueIds = new Set(exerciseIds);
  const hasDuplicates = exerciseIds.length !== uniqueIds.size;
  
  console.log(`   Total de ejercicios: ${exerciseIds.length}`);
  console.log(`   Ejercicios únicos: ${uniqueIds.size}`);
  console.log(`   Fase 1: ${plan.phases.phase1.exercises.map(e => e.id).join(', ')}`);
  console.log(`   Fase 2: ${plan.phases.phase2.exercises.map(e => e.id).join(', ')}`);
  console.log(`   Fase 3: ${plan.phases.phase3.exercises.map(e => e.id).join(', ')}`);
  
  if (hasDuplicates) {
    console.log(`   ❌ FALLO: Se encontraron duplicados`);
    const duplicates = exerciseIds.filter((id, index) => exerciseIds.indexOf(id) !== index);
    console.log(`   Duplicados: ${[...new Set(duplicates)].join(', ')}`);
  } else {
    console.log(`   ✅ ÉXITO: Sin duplicados`);
  }

  // ========================================
  // TEST 2: CONFIDENCE SINCRONIZADA
  // ========================================
  console.log('\n2️⃣ TEST: CONFIDENCE SINCRONIZADA');
  console.log('-'.repeat(70));
  
  const analysisConfidence = plan.chartAnalysis.confidence.score;
  const metaConfidence = plan.meta?.confidence || 0;
  const metaLowConfidence = plan.meta?.lowConfidence || false;
  
  console.log(`   chartAnalysis.confidence.score: ${analysisConfidence.toFixed(2)}`);
  console.log(`   meta.confidence: ${metaConfidence.toFixed(2)}`);
  console.log(`   meta.lowConfidence: ${metaLowConfidence}`);
  console.log(`   Razones: ${plan.chartAnalysis.confidence.reasons.join(', ')}`);
  
  const confidencesMatch = Math.abs(analysisConfidence - metaConfidence) < 0.01;
  const lowConfidenceCorrect = (analysisConfidence < 0.6) === metaLowConfidence;
  
  if (confidencesMatch && lowConfidenceCorrect) {
    console.log(`   ✅ ÉXITO: Confidence consistente (${analysisConfidence >= 0.85 ? 'ALTA' : analysisConfidence >= 0.6 ? 'MEDIA' : 'BAJA'})`);
  } else {
    console.log(`   ❌ FALLO: Inconsistencia en confidence`);
    if (!confidencesMatch) console.log(`      - Scores no coinciden: ${analysisConfidence} vs ${metaConfidence}`);
    if (!lowConfidenceCorrect) console.log(`      - lowConfidence flag incorrecto`);
  }

  // ========================================
  // TEST 3: ESTIMATED DAILY MINUTES >= 10
  // ========================================
  console.log('\n3️⃣ TEST: ESTIMATED DAILY MINUTES MÍNIMO');
  console.log('-'.repeat(70));
  
  const dailyMinutes = plan.estimatedDailyMinutes;
  const totalExercises = plan.totalExercises;
  const avgDuration = allExercises.reduce((sum, e) => sum + (e.duration || 10), 0) / allExercises.length;
  
  console.log(`   estimatedDailyMinutes: ${dailyMinutes} min`);
  console.log(`   Total ejercicios: ${totalExercises}`);
  console.log(`   Duración promedio por ejercicio: ${avgDuration.toFixed(1)} min`);
  console.log(`   Duración total: ${allExercises.reduce((sum, e) => sum + (e.duration || 10), 0)} min`);
  
  if (dailyMinutes >= 10) {
    console.log(`   ✅ ÉXITO: Tiempo diario pragmático (${dailyMinutes} min ≥ 10 min)`);
  } else {
    console.log(`   ❌ FALLO: Tiempo diario insuficiente (${dailyMinutes} min < 10 min)`);
  }

  // ========================================
  // TEST 4: GROUNDING EXERCISES
  // ========================================
  console.log('\n4️⃣ TEST: EJERCICIOS DE GROUNDING PARA BALANCE EARTH');
  console.log('-'.repeat(70));
  
  const dominantElement = plan.chartAnalysis.dominantElement;
  const secondaryElement = plan.chartAnalysis.secondaryElement;
  const moonStress = plan.chartAnalysis.moon?.stressScore || 0;
  
  console.log(`   Elemento dominante: ${dominantElement}`);
  console.log(`   Elemento secundario: ${secondaryElement}`);
  console.log(`   Moon stress: ${moonStress.toFixed(1)}/10`);
  
  const groundingKeywords = ['walk', 'earthing', 'tai chi', 'postural', 'físico', 'grounding', 'body'];
  const groundingExercises = allExercises.filter(e => {
    const title = e.title.toLowerCase();
    const cat = e.category.toLowerCase();
    return groundingKeywords.some(kw => title.includes(kw) || cat.includes(kw));
  });
  
  console.log(`   Ejercicios con keywords grounding: ${groundingExercises.length}`);
  if (groundingExercises.length > 0) {
    groundingExercises.forEach(e => {
      console.log(`      - ${e.title} (${e.category})`);
    });
  }
  
  const needsGrounding = secondaryElement === 'earth' && moonStress >= 6;
  
  if (needsGrounding) {
    if (groundingExercises.length > 0) {
      console.log(`   ✅ ÉXITO: Grounding presente (secondary=earth + moon stress alto)`);
    } else {
      console.log(`   ⚠️ ADVERTENCIA: Secondary=earth + moon stress=${moonStress} pero sin grounding explícito`);
    }
  } else {
    console.log(`   ℹ️ INFO: Grounding no requerido (secondary=${secondaryElement}, stress=${moonStress.toFixed(1)})`);
  }

  // ========================================
  // RESUMEN FINAL
  // ========================================
  console.log('\n' + '='.repeat(70));
  console.log('📈 RESUMEN DE TESTS');
  console.log('='.repeat(70));
  
  const tests = [
    { name: 'Deduplicación', passed: !hasDuplicates },
    { name: 'Confidence sincronizada', passed: confidencesMatch && lowConfidenceCorrect },
    { name: 'Daily minutes >= 10', passed: dailyMinutes >= 10 },
    { name: 'Grounding (si aplica)', passed: !needsGrounding || groundingExercises.length > 0 }
  ];
  
  const passedCount = tests.filter(t => t.passed).length;
  const totalTests = tests.length;
  
  tests.forEach(test => {
    console.log(`   ${test.passed ? '✅' : '❌'} ${test.name}`);
  });
  
  console.log(`\n   RESULTADO: ${passedCount}/${totalTests} tests pasados (${((passedCount/totalTests)*100).toFixed(0)}%)`);
  
  if (passedCount === totalTests) {
    console.log('\n   🎉 TODOS LOS FIXES CRÍTICOS VALIDADOS');
  } else {
    console.log('\n   ⚠️ ALGUNOS TESTS FALLARON - REVISAR IMPLEMENTACIÓN');
  }

  // ========================================
  // ANÁLISIS DETALLADO DEL PLAN
  // ========================================
  console.log('\n' + '='.repeat(70));
  console.log('📋 ANÁLISIS DETALLADO DEL PLAN');
  console.log('='.repeat(70));
  
  console.log('\n🔮 GEOMETRÍAS SAGRADAS:');
  console.log(`   Fase 1: ${plan.phases.phase1.sacredGeometry.name} (${plan.phases.phase1.sacredGeometry.color})`);
  console.log(`   Fase 2: ${plan.phases.phase2.sacredGeometry.name} (${plan.phases.phase2.sacredGeometry.color})`);
  console.log(`   Fase 3: ${plan.phases.phase3.sacredGeometry.name} (${plan.phases.phase3.sacredGeometry.color})`);
  
  console.log('\n💎 CHAKRAS:');
  console.log(`   Fase 1: ${plan.phases.phase1.chakras.primary} + ${plan.phases.phase1.chakras.secondary || 'N/A'}`);
  console.log(`   Fase 2: ${plan.phases.phase2.chakras.primary} + ${plan.phases.phase2.chakras.secondary || 'N/A'}`);
  console.log(`   Fase 3: ${plan.phases.phase3.chakras.primary} + ${plan.phases.phase3.chakras.secondary || 'N/A'}`);
  
  console.log('\n📊 DISTRIBUCIÓN DE INTENSIDADES:');
  const intensities = allExercises.map(e => e.intensity || 0);
  const avgIntensity = intensities.reduce((a,b) => a+b, 0) / intensities.length;
  console.log(`   Promedio: ${avgIntensity.toFixed(1)}/3`);
  console.log(`   Fase 1: ${plan.phases.phase1.exercises.map(e => e.intensity || 0).join(', ')}`);
  console.log(`   Fase 2: ${plan.phases.phase2.exercises.map(e => e.intensity || 0).join(', ')}`);
  console.log(`   Fase 3: ${plan.phases.phase3.exercises.map(e => e.intensity || 0).join(', ')}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ TEST FINAL COMPLETADO');
  console.log('='.repeat(70) + '\n');
}

// Ejecutar tests
runTests().catch(err => {
  console.error('\n❌ ERROR EN TESTS:', err);
  throw err;
});
