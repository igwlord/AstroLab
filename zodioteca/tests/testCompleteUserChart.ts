/**
 * 🧪 TEST COMPLETO: Carta Natal del Usuario
 * 
 * Simula el flujo completo desde calculateNatalChart hasta la visualización
 * Fecha: 16 Oct 1988, 17:50 (-03:00)
 * Lugar: Buenos Aires, Argentina (34.6°S, 58.45°W)
 */

import { calculateNatalChart } from '../src/services/realAstroCalculator';
import { adaptChartData } from '../src/utils/chartAdapter';

async function testCompleteUserChart() {
  console.log('\n╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(22) + '🧪 TEST: CARTA NATAL COMPLETA' + ' '.repeat(23) + '║');
  console.log('╚' + '═'.repeat(78) + '╝\n');

  console.log('📋 DATOS DE NACIMIENTO:');
  console.log('─'.repeat(80));
  console.log('   • Fecha: 16 de octubre de 1988');
  console.log('   • Hora: 17:50 (local -03:00) = 20:50 UTC');
  console.log('   • Lugar: Buenos Aires, Argentina');
  console.log('   • Coordenadas: 34°36\'S, 58°27\'W\n');

  try {
    // Crear fecha UTC (17:50 - 03:00 = 20:50 UTC)
    const birthDate = new Date(Date.UTC(1988, 9, 16, 20, 50, 0)); // Oct = mes 9
    const latitude = -34.6;
    const longitude = -58.45;
    const location = 'Buenos Aires, Argentina';

    console.log('🚀 Paso 1: Calculando carta natal con calculateNatalChart()...\n');
    
    // Calcular carta natal (esto incluye todos los puntos avanzados)
    const chart = await calculateNatalChart(birthDate, latitude, longitude, location);

    console.log('✅ Carta natal calculada correctamente\n');
    
    // Mostrar resumen de datos calculados
    console.log('📊 RESUMEN DE DATOS CALCULADOS:');
    console.log('─'.repeat(80));
    console.log(`   • Planetas: ${chart.planets.length}`);
    console.log(`   • Casas: ${chart.houses.length}`);
    console.log(`   • Aspectos: ${chart.aspects.length}`);
    console.log(`   • Asteroides: ${chart.asteroids?.length || 0}`);
    console.log(`   • Puntos sensibles (Quirón/Lilith): ${chart.sensitivePoints?.length || 0}`);
    console.log(`   • Nodos Lunares: ${chart.lunarNodes?.length || 0}`);
    console.log(`   • Partes Árabes (Fortuna): ${chart.arabicParts?.length || 0}`);
    console.log(`   • Puntos avanzados (Vértex): ${chart.advancedPoints?.length || 0}\n`);

    // Mostrar detalles de cada grupo
    console.log('🌟 PLANETAS PRINCIPALES:');
    console.log('─'.repeat(80));
    chart.planets.forEach(p => {
      console.log(`   ${p.name.padEnd(12)} → ${p.sign.padEnd(12)} ${p.degree.toFixed(2).padStart(5)}° (Casa ${p.house})`);
    });

    if (chart.asteroids && chart.asteroids.length > 0) {
      console.log('\n☄️ ASTEROIDES:');
      console.log('─'.repeat(80));
      chart.asteroids.forEach(a => {
        console.log(`   ${a.name.padEnd(12)} → ${a.sign.padEnd(12)} ${a.degree.toFixed(2).padStart(5)}° (Casa ${a.house}) ${a.retrograde ? 'R' : ''}`);
      });
    }

    if (chart.sensitivePoints && chart.sensitivePoints.length > 0) {
      console.log('\n⚷ PUNTOS SENSIBLES (Quirón/Lilith):');
      console.log('─'.repeat(80));
      chart.sensitivePoints.forEach(p => {
        console.log(`   ${p.name.padEnd(12)} → ${p.sign.padEnd(12)} ${p.degree.toFixed(2).padStart(5)}° (Casa ${p.house}) ${p.retrograde ? 'R' : ''}`);
      });
    }

    if (chart.lunarNodes && chart.lunarNodes.length > 0) {
      console.log('\n☊ NODOS LUNARES:');
      console.log('─'.repeat(80));
      chart.lunarNodes.forEach(n => {
        console.log(`   ${n.name.padEnd(12)} → ${n.sign.padEnd(12)} ${n.degree.toFixed(2).padStart(5)}° (Casa ${n.house}) ${n.retrograde ? 'R' : ''}`);
      });
    }

    if (chart.arabicParts && chart.arabicParts.length > 0) {
      console.log('\n⊕ PARTES ÁRABES (Fortuna):');
      console.log('─'.repeat(80));
      chart.arabicParts.forEach(p => {
        console.log(`   ${p.name.padEnd(12)} → ${p.sign.padEnd(12)} ${p.degree.toFixed(2).padStart(5)}° (Casa ${p.house})`);
      });
    }

    if (chart.advancedPoints && chart.advancedPoints.length > 0) {
      console.log('\n🌀 PUNTOS AVANZADOS (Vértex):');
      console.log('─'.repeat(80));
      chart.advancedPoints.forEach(p => {
        console.log(`   ${p.name?.padEnd(12)} → ${(p.sign || '?').padEnd(12)} ${(p.degree?.toFixed(2) || '?').toString().padStart(5)}° (Casa ${p.house || '?'})`);
      });
    }

    console.log('\n🔄 Paso 2: Adaptando datos para la rueda con adaptChartData()...\n');

    // Crear estructura compatible con ChartWithStatus
    const chartWithStatus = {
      id: 'test-user-chart',
      data: {
        id: 'test-user-chart',
        personName: 'Usuario Test',
        birthData: {
          date: birthDate.toISOString(),
          time: '17:50',
          location: location,
          latitude: latitude,
          longitude: longitude,
          timezone: 'UTC-3',
        },
        planets: chart.planets,
        houses: chart.houses,
        aspects: chart.aspects,
        asteroids: chart.asteroids,
        sensitivePoints: chart.sensitivePoints,
        lunarNodes: chart.lunarNodes,
        arabicParts: chart.arabicParts,
        advancedPoints: chart.advancedPoints,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        syncedAt: null,
        source: 'local' as const,
      },
      syncStatus: 'local-only' as const,
    };

    // Adaptar datos para la rueda
    const wheelData = adaptChartData(chartWithStatus);

    console.log('✅ Datos adaptados para la rueda\n');

    console.log('🎨 DATOS PARA LA RUEDA (NatalChartWheelPro):');
    console.log('─'.repeat(80));
    console.log(`   • Total de "planetas" en la rueda: ${wheelData.planets.length}`);
    console.log(`   • Casas: ${wheelData.houses.length}`);
    console.log(`   • Aspectos: ${wheelData.aspects?.length || 0}\n`);

    console.log('📍 TODOS LOS PUNTOS QUE APARECERÁN EN LA RUEDA:');
    console.log('─'.repeat(80));
    
    // Agrupar por tipo
    const mainPlanets = wheelData.planets.filter(p => 
      ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(p.name)
    );
    
    const asteroids = wheelData.planets.filter(p => 
      ['Ceres', 'Pallas', 'Juno', 'Vesta'].includes(p.name)
    );
    
    const sensitivePoints = wheelData.planets.filter(p => 
      ['Quirón', 'Lilith'].includes(p.name)
    );
    
    const nodes = wheelData.planets.filter(p => 
      ['Nodo Norte', 'Nodo Sur'].includes(p.name)
    );
    
    const arabicParts = wheelData.planets.filter(p => 
      p.name.includes('Fortuna')
    );
    
    const vertexPoints = wheelData.planets.filter(p => 
      ['Vértex', 'Anti-Vértex'].includes(p.name)
    );

    console.log('\n🌟 Planetas Principales:');
    mainPlanets.forEach(p => {
      console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°)`);
    });

    if (asteroids.length > 0) {
      console.log('\n☄️ Asteroides:');
      asteroids.forEach(p => {
        console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°) ${p.retrograde ? 'R' : ''}`);
      });
    }

    if (sensitivePoints.length > 0) {
      console.log('\n⚷ Puntos Sensibles:');
      sensitivePoints.forEach(p => {
        console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°) ${p.retrograde ? 'R' : ''}`);
      });
    }

    if (nodes.length > 0) {
      console.log('\n☊ Nodos Lunares:');
      nodes.forEach(p => {
        console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°) ${p.retrograde ? 'R' : ''}`);
      });
    }

    if (arabicParts.length > 0) {
      console.log('\n⊕ Parte de la Fortuna:');
      arabicParts.forEach(p => {
        console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°)`);
      });
    }

    if (vertexPoints.length > 0) {
      console.log('\n🌀 Vértex:');
      vertexPoints.forEach(p => {
        console.log(`   ✓ ${p.name.padEnd(12)} (${p.longitude.toFixed(2)}°)`);
      });
    }

    console.log('\n' + '═'.repeat(80));
    console.log('🎉 RESUMEN FINAL');
    console.log('═'.repeat(80));
    console.log(`   • Total de elementos en la rueda: ${wheelData.planets.length}`);
    console.log(`   • Planetas principales: ${mainPlanets.length}`);
    console.log(`   • Asteroides: ${asteroids.length}`);
    console.log(`   • Puntos sensibles: ${sensitivePoints.length}`);
    console.log(`   • Nodos Lunares: ${nodes.length}`);
    console.log(`   • Parte de la Fortuna: ${arabicParts.length}`);
    console.log(`   • Vértex: ${vertexPoints.length}`);
    console.log('═'.repeat(80));

    // Validar que tenemos los puntos esperados
    console.log('\n🔍 VALIDACIÓN:');
    console.log('─'.repeat(80));
    
    const validations = [
      { name: 'Quirón', expected: 1, actual: sensitivePoints.filter(p => p.name === 'Quirón').length },
      { name: 'Nodo Norte', expected: 1, actual: nodes.filter(p => p.name === 'Nodo Norte').length },
      { name: 'Nodo Sur', expected: 1, actual: nodes.filter(p => p.name === 'Nodo Sur').length },
      { name: 'Parte Fortuna', expected: 1, actual: arabicParts.length },
      { name: 'Vértex', expected: 1, actual: vertexPoints.filter(p => p.name === 'Vértex').length },
      { name: 'Anti-Vértex', expected: 1, actual: vertexPoints.filter(p => p.name === 'Anti-Vértex').length },
    ];

    let allValid = true;
    validations.forEach(v => {
      const status = v.actual === v.expected ? '✅' : '❌';
      console.log(`   ${status} ${v.name.padEnd(15)} → Esperado: ${v.expected}, Encontrado: ${v.actual}`);
      if (v.actual !== v.expected) allValid = false;
    });

    console.log('\n' + '═'.repeat(80));
    if (allValid) {
      console.log('🎉 ✅ TODOS LOS PUNTOS AVANZADOS ESTÁN PRESENTES');
      console.log('═'.repeat(80));
      console.log('\n✨ La rueda mostrará todos los símbolos correctamente:\n');
      console.log('   ☊ Nodo Norte');
      console.log('   ☋ Nodo Sur');
      console.log('   ⚷ Quirón');
      console.log('   ⊕ Parte de la Fortuna');
      console.log('   Vx Vértex');
      console.log('   AVx Anti-Vértex\n');
    } else {
      console.log('⚠️ ALGUNOS PUNTOS FALTAN - REVISAR CONFIGURACIÓN');
      console.log('═'.repeat(80));
    }

    return true;

  } catch (error) {
    console.error('\n❌ ERROR EN EL TEST:', error);
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message);
      console.error('   Stack:', error.stack);
    }
    return false;
  }
}

// Ejecutar test
console.log('🚀 Iniciando test completo de carta natal...\n');
testCompleteUserChart()
  .then((success) => {
    if (success) {
      console.log('\n✅ Test completado exitosamente\n');
      process.exit(0);
    } else {
      console.log('\n❌ Test falló\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
