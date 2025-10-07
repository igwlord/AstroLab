/**
 * Utilidades angulares para el sistema de coordenadas del Chart Wheel
 * Sistema: Zodíaco FIJO con 0° Aries anclado a la IZQUIERDA (9h), antihorario
 * Basado en rudea astro modelo.md §1
 */

/**
 * Normaliza un ángulo al rango [0, 360)
 * @param d Ángulo en grados (puede ser negativo o > 360)
 * @returns Ángulo normalizado en [0, 360)
 * @example normalize(370) // 10
 * @example normalize(-10) // 350
 */
export function normalize(d: number): number {
  return ((d % 360) + 360) % 360;
}

/**
 * Calcula la diferencia angular entre dos posiciones (siempre positiva, antihoraria)
 * @param a Posición inicial en grados absolutos
 * @param b Posición final en grados absolutos
 * @returns Diferencia angular en [0, 360) siguiendo dirección antihoraria
 * @example deltaPos(10, 50) // 40
 * @example deltaPos(350, 10) // 20 (cruza 0°)
 * @example deltaPos(180, 90) // 270 (va por el camino largo antihorario)
 */
export function deltaPos(a: number, b: number): number {
  return normalize(b - a);
}

/**
 * Convierte longitud eclíptica absoluta a radianes para SVG/Canvas
 * Sistema: 0° Aries = 180° matemáticos (izquierda), antihorario
 * @param absDeg Longitud absoluta en grados (0° Aries = 0, 1° Aries = 1, etc.)
 * @returns Ángulo en radianes para coordenadas SVG (0 = derecha, aumenta antihorario)
 * @example absToRad(0) // π (Aries a la izquierda)
 * @example absToRad(90) // π/2 (Cáncer arriba)
 * @example absToRad(180) // 0 (Libra a la derecha)
 */
export function absToRad(absDeg: number): number {
  return ((180 - normalize(absDeg)) * Math.PI) / 180;
}

/**
 * Calcula el punto medio angular entre dos posiciones
 * Usa deltaPos para manejar correctamente el wrap en 0°/360°
 * @param a Primera posición en grados absolutos
 * @param b Segunda posición en grados absolutos
 * @returns Punto medio en [0, 360) siguiendo el camino antihorario más corto
 * @example mid(10, 50) // 30
 * @example mid(350, 10) // 0 (cruza 0°)
 * @example mid(10, 350) // 180 (camino largo)
 */
export function mid(a: number, b: number): number {
  return normalize(a + deltaPos(a, b) / 2);
}

/**
 * Convierte coordenadas polares (ángulo en radianes, radio) a cartesianas SVG
 * @param cx Centro X del círculo
 * @param cy Centro Y del círculo
 * @param r Radio (fracción o píxeles)
 * @param rad Ángulo en radianes (0 = derecha, π/2 = arriba, π = izquierda)
 * @returns Tupla [x, y] en coordenadas SVG
 */
export function polar(cx: number, cy: number, r: number, rad: number): [number, number] {
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
}

/**
 * Convierte longitud absoluta directamente a coordenadas cartesianas SVG
 * Combina absToRad + polar en una sola función
 * @param cx Centro X del círculo
 * @param cy Centro Y del círculo
 * @param r Radio (fracción o píxeles)
 * @param absDeg Longitud eclíptica absoluta en grados
 * @returns Tupla [x, y] en coordenadas SVG
 */
export function absToCoords(cx: number, cy: number, r: number, absDeg: number): [number, number] {
  return polar(cx, cy, r, absToRad(absDeg));
}

/**
 * Calcula grados y minutos dentro de un signo zodiacal (0-29° 0-59')
 * Aplica carry cuando los minutos llegan a 60 (pasan al siguiente grado)
 * @param longitude Longitud eclíptica absoluta (0-360)
 * @returns Objeto con deg (0-29), min (0-59), carry (si hubo ajuste)
 * @example degMin(24.5) // { deg: 24, min: 30, carry: false }
 * @example degMin(29.9833) // { deg: 0, min: 0, carry: true } (se pasó a 30°)
 */
export function degMin(longitude: number): { deg: number; min: number; carry: boolean } {
  const degInSign = normalize(longitude) % 30;
  let deg = Math.floor(degInSign);
  let min = Math.round((degInSign - deg) * 60);
  let carry = false;

  if (min === 60) {
    deg = (deg + 1) % 30;
    min = 0;
    carry = true;
  }

  return { deg, min, carry };
}

/**
 * Obtiene el índice del signo (0-11) para una longitud dada
 * @param longitude Longitud eclíptica absoluta (0-360)
 * @returns Índice del signo (0=Aries, 1=Tauro, ..., 11=Piscis)
 */
export function getSignIndex(longitude: number): number {
  return Math.floor(normalize(longitude) / 30);
}

/**
 * Obtiene el símbolo Unicode del signo zodiacal
 * @param signIndex Índice del signo (0-11)
 * @returns Símbolo Unicode
 */
export function getSignSymbol(signIndex: number): string {
  const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  return symbols[signIndex % 12];
}

/**
 * Obtiene el nombre del signo zodiacal
 * @param signIndex Índice del signo (0-11)
 * @returns Nombre del signo
 */
export function getSignName(signIndex: number): string {
  const names = [
    'Aries',
    'Tauro',
    'Géminis',
    'Cáncer',
    'Leo',
    'Virgo',
    'Libra',
    'Escorpio',
    'Sagitario',
    'Capricornio',
    'Acuario',
    'Piscis',
  ];
  return names[signIndex % 12];
}

// ========================================
// Tests inline (ejecutar en desarrollo)
// ========================================

if (import.meta.env?.DEV) {
  // Test normalize
  console.assert(normalize(0) === 0, 'normalize(0) failed');
  console.assert(normalize(360) === 0, 'normalize(360) failed');
  console.assert(normalize(370) === 10, 'normalize(370) failed');
  console.assert(normalize(-10) === 350, 'normalize(-10) failed');

  // Test deltaPos
  console.assert(deltaPos(10, 50) === 40, 'deltaPos(10, 50) failed');
  console.assert(deltaPos(350, 10) === 20, 'deltaPos(350, 10) failed');
  console.assert(deltaPos(180, 90) === 270, 'deltaPos(180, 90) failed');

  // Test mid
  console.assert(mid(10, 50) === 30, 'mid(10, 50) failed');
  console.assert(mid(350, 10) === 0, 'mid(350, 10) failed');

  // Test degMin
  const dm1 = degMin(24.5);
  console.assert(dm1.deg === 24 && dm1.min === 30, 'degMin(24.5) failed');
  
  const dm2 = degMin(29.9833);
  console.assert(dm2.deg === 0 && dm2.min === 0 && dm2.carry, 'degMin(29.9833) failed');

  // Test getSignIndex
  console.assert(getSignIndex(0) === 0, 'getSignIndex(0) failed'); // Aries
  console.assert(getSignIndex(30) === 1, 'getSignIndex(30) failed'); // Tauro
  console.assert(getSignIndex(359) === 11, 'getSignIndex(359) failed'); // Piscis
}
