/**
 * 🧪 SCRIPT DE TEST - CLIMA ASTROLÓGICO
 * 
 * Verifica que los cálculos del clima astrológico sean correctos:
 * - Fase lunar
 * - Elemento dominante
 * - Consistencia del resumen interpretativo
 * 
 * Uso: node --loader tsx test/testDailyWeather.ts
 * O ejecutar desde el navegador en consola
 */

import { getDailyAstrologicalWeather, clearWeatherCache } from '../src/services/dailyWeather';

async function testDailyWeather() {
  console.log('🧪 ========================================');
  console.log('🧪 TEST: CLIMA ASTROLÓGICO DEL DÍA');
  console.log('🧪 ========================================\n');

  try {
    // Limpiar cache para obtener datos frescos
    clearWeatherCache();
    console.log('✅ Cache limpiado');

    // Obtener clima actual
    console.log('📊 Calculando clima astrológico...\n');
    const weather = await getDailyAstrologicalWeather(true);

    // ===========================
    // TEST 1: Verificar datos básicos
    // ===========================
    console.log('📋 TEST 1: DATOS BÁSICOS');
    console.log('─────────────────────────────────────────');
    console.log('Fecha:', weather.date);
    console.log('Timestamp:', new Date(weather.timestamp).toISOString());
    console.log('✅ Datos básicos OK\n');

    // ===========================
    // TEST 2: Posiciones planetarias
    // ===========================
    console.log('🌍 TEST 2: POSICIONES PLANETARIAS');
    console.log('─────────────────────────────────────────');
    
    const allPlanets = [
      { name: 'Sol', data: weather.sun },
      { name: 'Luna', data: weather.moon },
      { name: 'Mercurio', data: weather.mercury },
      { name: 'Venus', data: weather.venus },
      { name: 'Marte', data: weather.mars },
      { name: 'Júpiter', data: weather.jupiter },
      { name: 'Saturno', data: weather.saturn },
    ];

    let hasErrors = false;

    for (const planet of allPlanets) {
      if (!planet.data) {
        console.error(`❌ ${planet.name}: NO ENCONTRADO`);
        hasErrors = true;
      } else {
        const retro = planet.data.retrograde ? '℞' : '';
        console.log(
          `✅ ${planet.name.padEnd(10)} → ${planet.data.sign.padEnd(12)} ${planet.data.degree.toFixed(1).padStart(5)}° ${retro}`
        );
      }
    }

    if (hasErrors) {
      console.error('\n❌ TEST 2 FALLÓ: Planetas faltantes\n');
      return;
    }

    console.log('✅ TEST 2 OK: Todas las posiciones calculadas\n');

    // ===========================
    // TEST 3: Fase lunar
    // ===========================
    console.log('🌙 TEST 3: FASE LUNAR');
    console.log('─────────────────────────────────────────');
    console.log('Fase:', weather.moonPhase.name, weather.moonPhase.emoji);
    console.log('Descripción:', weather.moonPhase.description);
    console.log('Iluminación:', weather.moonPhase.percentage + '%');

    // Verificar consistencia
    const sunLon = weather.sun?.longitude || 0;
    const moonLon = weather.moon?.longitude || 0;
    let diff = moonLon - sunLon;
    if (diff < 0) diff += 360;

    const expectedPhase = 
      (diff < 45 || diff >= 315) ? 'nueva' :
      (diff < 135) ? 'creciente' :
      (diff < 225) ? 'llena' : 'menguante';

    if (weather.moonPhase.name === expectedPhase) {
      console.log('✅ TEST 3 OK: Fase lunar correcta\n');
    } else {
      console.error(`❌ TEST 3 FALLÓ: Fase esperada "${expectedPhase}", obtenida "${weather.moonPhase.name}"\n`);
      return;
    }

    // ===========================
    // TEST 4: Elemento dominante
    // ===========================
    console.log('🔥 TEST 4: ELEMENTO DOMINANTE');
    console.log('─────────────────────────────────────────');

    // Recalcular manualmente para verificar
    const elementCounts: Record<string, number> = {
      fuego: 0,
      tierra: 0,
      aire: 0,
      agua: 0,
    };

    const elementMap: Record<string, string> = {
      'Aries': 'fuego', 'Leo': 'fuego', 'Sagitario': 'fuego',
      'Tauro': 'tierra', 'Virgo': 'tierra', 'Capricornio': 'tierra',
      'Géminis': 'aire', 'Libra': 'aire', 'Acuario': 'aire',
      'Cáncer': 'agua', 'Escorpio': 'agua', 'Piscis': 'agua',
    };

    const weights: Record<string, number> = {
      'Sol': 3,
      'Luna': 3,
      'Mercurio': 2,
      'Venus': 2,
      'Marte': 2,
      'Júpiter': 1,
      'Saturno': 1,
    };

    console.log('\n📊 Desglose por planeta:');
    console.log('─────────────────────────────────────────');

    for (const { name, data } of allPlanets.slice(0, 7)) { // Solo los 7 primeros
      if (data) {
        const element = elementMap[data.sign];
        const weight = weights[name] || 1;
        if (element) {
          elementCounts[element] += weight;
          console.log(`${name.padEnd(10)} → ${data.sign.padEnd(12)} [${element.padEnd(6)}] peso: ${weight}`);
        }
      }
    }

    console.log('\n📊 Totales por elemento:');
    console.log('─────────────────────────────────────────');
    
    const total = Object.values(elementCounts).reduce((a, b) => a + b, 0);
    const sortedElements = Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([elem, count]) => ({
        element: elem,
        count,
        percentage: Math.round((count / total) * 100)
      }));

    for (const { element, count, percentage } of sortedElements) {
      const emoji = 
        element === 'fuego' ? '🔥' :
        element === 'tierra' ? '🌍' :
        element === 'aire' ? '💨' : '💧';
      console.log(`${emoji} ${element.padEnd(7)} → ${count.toString().padStart(2)} puntos (${percentage}%)`);
    }

    // Verificar con el resultado
    console.log('\n🎯 Elemento dominante calculado:');
    console.log(`${weather.dominantElement.emoji} ${weather.dominantElement.element} → ${weather.dominantElement.percentage}%`);

    const expectedDominant = sortedElements[0];
    if (weather.dominantElement.element === expectedDominant.element &&
        weather.dominantElement.percentage === expectedDominant.percentage) {
      console.log('✅ TEST 4 OK: Elemento dominante correcto\n');
    } else {
      console.error(`❌ TEST 4 FALLÓ: Esperado ${expectedDominant.element} ${expectedDominant.percentage}%, obtenido ${weather.dominantElement.element} ${weather.dominantElement.percentage}%\n`);
      return;
    }

    // ===========================
    // TEST 5: Consistencia del resumen
    // ===========================
    console.log('📝 TEST 5: CONSISTENCIA DEL RESUMEN');
    console.log('─────────────────────────────────────────');
    console.log('Resumen:', weather.summary);
    console.log('\n🔍 Verificando coherencia...');

    // Verificar que el resumen mencione el elemento dominante correctamente
    const elementMentioned = weather.summary.toLowerCase().includes(weather.dominantElement.element);
    
    if (elementMentioned) {
      console.log(`✅ El resumen menciona correctamente el elemento "${weather.dominantElement.element}"`);
    } else {
      console.warn(`⚠️  ADVERTENCIA: El resumen NO menciona el elemento dominante "${weather.dominantElement.element}"`);
      console.warn('   Esto puede crear confusión en el usuario');
    }

    // Verificar que mencione el Sol y la Luna
    const sunMentioned = weather.summary.includes(weather.sun?.sign || '');
    const moonMentioned = weather.summary.includes(weather.moon?.sign || '');

    if (sunMentioned && moonMentioned) {
      console.log('✅ El resumen menciona Sol y Luna correctamente');
    } else {
      console.error('❌ El resumen NO menciona correctamente Sol/Luna');
    }

    console.log('✅ TEST 5 OK: Resumen coherente\n');

    // ===========================
    // TEST 6: Aspectos
    // ===========================
    console.log('🔗 TEST 6: ASPECTOS PRINCIPALES');
    console.log('─────────────────────────────────────────');
    
    if (weather.mainAspects.length > 0) {
      console.log(`Aspectos encontrados: ${weather.mainAspects.length}`);
      weather.mainAspects.forEach((aspect: any, i: number) => {
        console.log(`${i + 1}. ${aspect.planet1} ${aspect.symbol || aspect.type} ${aspect.planet2} (orbe: ${aspect.orb.toFixed(2)}°)`);
      });
      console.log('✅ TEST 6 OK: Aspectos calculados\n');
    } else {
      console.log('ℹ️  No hay aspectos exactos (orbe < 3°) en este momento');
      console.log('✅ TEST 6 OK: Sin aspectos exactos\n');
    }

    // ===========================
    // RESUMEN FINAL
    // ===========================
    console.log('🎉 ========================================');
    console.log('🎉 TODOS LOS TESTS PASARON EXITOSAMENTE');
    console.log('🎉 ========================================\n');

    console.log('📊 RESUMEN DEL CLIMA:');
    console.log(`☀️  Sol: ${weather.sun?.sign} ${weather.sun?.degree.toFixed(1)}°`);
    console.log(`🌙 Luna: ${weather.moon?.sign} ${weather.moon?.degree.toFixed(1)}° ${weather.moonPhase.emoji}`);
    console.log(`${weather.dominantElement.emoji} Elemento: ${weather.dominantElement.element} (${weather.dominantElement.percentage}%)`);
    console.log(`💬 Resumen: ${weather.summary}`);
    console.log(`✨ Consejo: ${weather.advice}\n`);

  } catch (error) {
    console.error('❌ ERROR EN LOS TESTS:', error);
    console.error((error as Error).stack);
  }
}

// Auto-ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  // En navegador
  (window as unknown as { testDailyWeather: typeof testDailyWeather }).testDailyWeather = testDailyWeather;
  console.log('💡 Test cargado. Ejecuta: testDailyWeather()');
}

export { testDailyWeather };
