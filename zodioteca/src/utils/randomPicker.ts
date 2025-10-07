/**
 * 🎲 UTILIDAD PARA SELECCIÓN ALEATORIA
 * 
 * Función auxiliar para elegir un elemento aleatorio de un array.
 * Usada para variar las plantillas textuales en cada generación de reporte.
 */

/**
 * Selecciona un elemento aleatorio de un array
 * @param array - Array de elementos
 * @returns Elemento aleatorio del array
 */
export function getRandom<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Selecciona N elementos aleatorios únicos de un array
 * @param array - Array de elementos
 * @param count - Cantidad de elementos a seleccionar
 * @returns Array con elementos aleatorios únicos
 */
export function getRandomMultiple<T>(array: T[], count: number): T[] {
  if (count > array.length) {
    throw new Error('Cannot select more elements than array length');
  }
  
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
