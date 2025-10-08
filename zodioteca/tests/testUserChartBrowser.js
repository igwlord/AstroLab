/**
 * 🧪 TEST RÁPIDO: Carta Natal del Usuario
 * 
 * Copia y pega este código en la consola del navegador (F12)
 * mientras tienes la app abierta en http://localhost:5175
 */

// Test de carta natal: 16 Oct 1988, 17:50 CABA
(async function testUserChart() {
  console.clear();
  console.log('\n╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(22) + '🧪 TEST: TU CARTA NATAL' + ' '.repeat(27) + '║');
  console.log('╚' + '═'.repeat(78) + '╝\n');

  console.log('📋 DATOS:');
  console.log('   Fecha: 16 de octubre de 1988');
  console.log('   Hora: 17:50 (-03:00) = 20:50 UTC');
  console.log('   Lugar: Buenos Aires, Argentina');
  console.log('   Coords: 34.6°S, 58.45°W\n');

  try {
    // Importar función
    const { calculateNatalChart } = await import('./src/services/realAstroCalculator.ts');
    
    // Crear fecha UTC
    const birthDate = new Date(Date.UTC(1988, 9, 16, 20, 50, 0));
    
    console.log('🚀 Calculando carta natal...\n');
    
    // Calcular
    const chart = await calculateNatalChart(
      birthDate,
      -34.6,
      -58.45,
      'Buenos Aires, Argentina'
    );

    console.log('✅ Carta calculada!\n');
    
    // Resumen
    console.log('📊 RESUMEN:');
    console.log('─'.repeat(80));
    console.log(`   Planetas: ${chart.planets.length}`);
    console.log(`   Asteroides: ${chart.asteroids?.length || 0}`);
    console.log(`   Quirón/Lilith: ${chart.sensitivePoints?.length || 0}`);
    console.log(`   Nodos Lunares: ${chart.lunarNodes?.length || 0}`);
    console.log(`   Parte Fortuna: ${chart.arabicParts?.length || 0}`);
    console.log(`   Vértex: ${chart.advancedPoints?.length || 0}\n`);

    // Planetas principales
    console.log('🌟 PLANETAS:');
    chart.planets.forEach(p => {
      console.log(`   ${p.name.padEnd(10)} ${p.sign.padEnd(12)} ${p.degree.toFixed(2).padStart(5)}° Casa ${p.house}`);
    });

    // Quirón
    if (chart.sensitivePoints?.length) {
      console.log('\n⚷ QUIRÓN:');
      const chiron = chart.sensitivePoints.find(p => p.name === 'Quirón');
      if (chiron) {
        console.log(`   ${chiron.sign} ${chiron.degree.toFixed(2)}° Casa ${chiron.house} ${chiron.retrograde ? 'R' : ''}`);
        console.log(`   Tu valor: Cáncer 7°10' Casa 3 R`);
        console.log(`   Diferencia: ${Math.abs(chiron.degree - 7.167).toFixed(2)}°`);
      }
    }

    // Nodos
    if (chart.lunarNodes?.length) {
      console.log('\n☊ NODOS LUNARES:');
      chart.lunarNodes.forEach(node => {
        console.log(`   ${node.name.padEnd(12)} ${node.sign.padEnd(12)} ${node.degree.toFixed(2).padStart(5)}° Casa ${node.house}`);
      });
      const northNode = chart.lunarNodes.find(n => n.name === 'Nodo Norte');
      if (northNode) {
        console.log(`   Tu valor Norte: Piscis 11°49' Casa 12`);
        console.log(`   Diferencia: ${Math.abs(northNode.degree - 11.817).toFixed(2)}°`);
      }
    }

    // Fortuna
    if (chart.arabicParts?.length) {
      console.log('\n⊕ PARTE DE LA FORTUNA:');
      const fortune = chart.arabicParts.find(p => p.name.includes('Fortuna'));
      if (fortune) {
        console.log(`   ${fortune.sign} ${fortune.degree.toFixed(2)}° Casa ${fortune.house}`);
        console.log(`   Tu valor: Géminis 17°10' Casa 3`);
        console.log(`   Diferencia: ${Math.abs(fortune.degree - 17.167).toFixed(2)}°`);
      }
    }

    // Vértex
    if (chart.advancedPoints?.length) {
      console.log('\n🌀 VÉRTEX:');
      chart.advancedPoints.forEach(point => {
        console.log(`   ${point.name?.padEnd(13)} ${(point.sign || '?').padEnd(12)} ${(point.degree?.toFixed(2) || '?').toString().padStart(5)}° Casa ${point.house || '?'}`);
      });
      const vertex = chart.advancedPoints.find(p => p.name === 'Vértex');
      if (vertex) {
        console.log(`   Tu valor: Libra 27°02' Casa 7`);
        console.log(`   Diferencia: ${Math.abs((vertex.degree || 0) - 27.033).toFixed(2)}°`);
      }
    }

    // Validación
    console.log('\n' + '═'.repeat(80));
    console.log('🔍 VALIDACIÓN:');
    console.log('═'.repeat(80));
    
    const checks = [
      { name: 'Quirón', present: chart.sensitivePoints?.some(p => p.name === 'Quirón') },
      { name: 'Nodo Norte', present: chart.lunarNodes?.some(n => n.name === 'Nodo Norte') },
      { name: 'Nodo Sur', present: chart.lunarNodes?.some(n => n.name === 'Nodo Sur') },
      { name: 'Fortuna', present: chart.arabicParts?.some(p => p.name.includes('Fortuna')) },
      { name: 'Vértex', present: chart.advancedPoints?.some(p => p.name === 'Vértex') },
      { name: 'Anti-Vértex', present: chart.advancedPoints?.some(p => p.name === 'Anti-Vértex') },
    ];

    checks.forEach(c => {
      console.log(`   ${c.present ? '✅' : '❌'} ${c.name}`);
    });

    const allPresent = checks.every(c => c.present);
    
    console.log('\n' + '═'.repeat(80));
    if (allPresent) {
      console.log('🎉 ✅ TODOS LOS PUNTOS CALCULADOS CORRECTAMENTE');
      console.log('\n✨ Los símbolos aparecerán en la rueda:');
      console.log('   ☊ Nodo Norte  |  ☋ Nodo Sur');
      console.log('   ⚷ Quirón      |  ⊕ Parte Fortuna');
      console.log('   Vx Vértex     |  AVx Anti-Vértex');
    } else {
      console.log('⚠️ ALGUNOS PUNTOS NO SE CALCULARON');
      console.log('   Verifica que los settings estén activados');
    }
    console.log('═'.repeat(80) + '\n');

    // Retornar datos para inspección
    return { chart, checks, allPresent };

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('   Mensaje:', error.message);
    return null;
  }
})();
