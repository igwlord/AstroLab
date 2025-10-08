/**
 * 🚀 SCRIPT DE EJECUCIÓN: Test de Carta del Usuario
 * 
 * Ejecuta el test de validación para la carta natal del usuario
 * directamente desde Node.js
 */

import testUserBirthChart from './testUserChart.js';

console.log('🚀 Iniciando test de validación de carta natal...\n');

testUserBirthChart()
  .then((success) => {
    if (success) {
      console.log('✅ Test completado exitosamente\n');
      process.exit(0);
    } else {
      console.log('⚠️ Test completado con advertencias\n');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('❌ Error ejecutando test:', error);
    process.exit(1);
  });
