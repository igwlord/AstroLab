/**
 * Temas de colores para NatalChartWheel
 * Basado en rudea astro modelo.md §11
 */

import type { Theme } from '../types/chartWheel';

/**
 * Tema clásico (inspirado en Astro-Seek tema claro)
 * Fondo claro, líneas oscuras, colores saturados por elemento
 */
export const themeClassic: Theme = {
  background: '#FAFAFA',
  
  ticksColor: '#1a1a1a',
  ticksOpacity: [0.30, 0.45, 0.60], // 1°, 5°, 10°
  
  signsColor: '#2a2a2a',
  
  houseLinesColor: {
    angular: '#1a1a1a',    // Casas 1,4,7,10 (muy oscuro)
    succedent: '#4a4a4a',  // Casas 2,5,8,11 (gris medio)
    cadent: '#8a8a8a',     // Casas 3,6,9,12 (gris claro)
  },
  
  houseLinesWidth: {
    angular: 2.2,
    succedent: 1.4,
    cadent: 1.0,
  },
  
  aspectsColor: {
    conjunction: '#B6B6C9',  // Gris
    opposition: '#FF6363',   // Rojo
    square: '#FF6B6B',       // Rojo (cuadratura)
    trine: '#4E82FF',        // Azul (trígono)
    sextil: '#6DB6FF',       // Azul claro (sextil)
  },
  
  planetsColor: '#2a2a2a',
  axesColor: '#D4AF37',      // Dorado para ASC/MC/DSC/IC
  debugColor: '#FF00FF',
};

/**
 * Tema violeta moderno (dark mode con gradientes violeta)
 * Fondo oscuro radial, líneas violeta, estética moderna
 */
export const themeViolet: Theme = {
  background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a18 100%)',
  
  ticksColor: '#bda9ff',
  ticksOpacity: [0.30, 0.45, 0.60], // 1°, 5°, 10°
  
  signsColor: '#d0c1ff',
  
  houseLinesColor: {
    angular: '#c4b5ff',    // Casas angulares (violeta claro)
    succedent: '#9a7bff',  // Casas sucedentes (violeta medio)
    cadent: '#7a5bdf',     // Casas cadentes (violeta oscuro)
  },
  
  houseLinesWidth: {
    angular: 2.2,
    succedent: 1.4,
    cadent: 1.0,
  },
  
  aspectsColor: {
    conjunction: '#b6b6c9',  // Gris
    opposition: '#ff6b6b',   // Rojo
    square: '#ff6363',       // Rojo (cuadratura)
    trine: '#6db6ff',        // Azul (trígono)
    sextil: '#4E82FF',       // Azul medio (sextil)
  },
  
  planetsColor: '#ffd45e',   // Dorado suave para planetas
  axesColor: '#ffd700',      // Dorado brillante para ejes
  debugColor: '#FF00FF',
};

/**
 * Obtiene el tema por nombre
 */
export function getTheme(themeName: 'classic' | 'violet'): Theme {
  return themeName === 'classic' ? themeClassic : themeViolet;
}

/**
 * Símbolos de planetas (Unicode)
 */
export const PLANET_SYMBOLS: Record<string, string> = {
  Sol: '☉',
  Luna: '☽',
  Mercurio: '☿',
  Venus: '♀',
  Marte: '♂',
  Júpiter: '♃',
  Saturno: '♄',
  Urano: '♅',
  Neptuno: '♆',
  Plutón: '♇',
};

/**
 * Símbolos de puntos especiales (Unicode)
 */
export const SPECIAL_POINT_SYMBOLS: Record<string, string> = {
  Node: '☊',        // Nodo Norte
  Lilith: '⚸',      // Lilith (Luna Negra)
  Fortune: '⊙',     // Parte de la Fortuna
  Chiron: '⚷',      // Quirón
  Vertex: 'Vx',     // Vertex (texto)
};

/**
 * Colores por planeta (tema violeta)
 */
export const PLANET_COLORS_VIOLET: Record<string, string> = {
  Sol: '#ffd45e',
  Luna: '#cfd5e6',
  Mercurio: '#a8d8ff',
  Venus: '#ffb3d9',
  Marte: '#ff6b6b',
  Júpiter: '#ffa94d',
  Saturno: '#9a7bff',
  Urano: '#6db6ff',
  Neptuno: '#4e82ff',
  Plutón: '#c084fc',
};

/**
 * Colores por planeta (tema clásico)
 */
export const PLANET_COLORS_CLASSIC: Record<string, string> = {
  Sol: '#FF9500',
  Luna: '#8E8E93',
  Mercurio: '#FFD700',
  Venus: '#FF69B4',
  Marte: '#DC143C',
  Júpiter: '#FF8C00',
  Saturno: '#4B0082',
  Urano: '#00CED1',
  Neptuno: '#0000FF',
  Plutón: '#8B0000',
};

/**
 * Obtiene el color de un planeta según el tema
 */
export function getPlanetColor(planetName: string, theme: 'classic' | 'violet'): string {
  const colors = theme === 'classic' ? PLANET_COLORS_CLASSIC : PLANET_COLORS_VIOLET;
  return colors[planetName] || (theme === 'classic' ? '#2a2a2a' : '#ffd45e');
}
