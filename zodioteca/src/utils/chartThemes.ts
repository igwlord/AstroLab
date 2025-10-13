/**
 * Temas de colores para NatalChartWheel
 * Basado en design tokens astrológicos unificados
 */

import type { Theme } from '../types/chartWheel';
import { PLANET_COLORS, SEMANTIC_COLORS } from '../constants/designTokens';

/**
 * Tema clásico (inspirado en Astro-Seek tema claro)
 * Fondo claro, líneas oscuras, colores saturados por elemento
 */
export const themeClassic: Theme = {
  background: SEMANTIC_COLORS.background.light,

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
    opposition: PLANET_COLORS.mars.primary,   // Rojo marciano
    square: PLANET_COLORS.mars.secondary,     // Rojo coral
    trine: PLANET_COLORS.jupiter.primary,     // Azul jupiteriano
    sextil: PLANET_COLORS.jupiter.secondary,  // Azul cielo
  },

  planetsColor: '#2a2a2a',
  axesColor: PLANET_COLORS.sun.primary,      // Dorado solar
  debugColor: '#FF00FF',
};

/**
 * Tema violeta moderno (dark mode con gradientes violeta)
 * Fondo oscuro radial, líneas violeta, estética moderna
 */
export const themeViolet: Theme = {
  background: SEMANTIC_COLORS.background.gradient,

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
    opposition: PLANET_COLORS.mars.primary,   // Rojo marciano
    square: PLANET_COLORS.mars.secondary,     // Rojo coral
    trine: PLANET_COLORS.jupiter.primary,     // Azul jupiteriano
    sextil: PLANET_COLORS.jupiter.secondary,  // Azul cielo
  },

  planetsColor: PLANET_COLORS.sun.primary,   // Dorado solar
  axesColor: PLANET_COLORS.sun.secondary,    // Naranja solar
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
  Sol: PLANET_COLORS.sun.primary,
  Luna: PLANET_COLORS.moon.primary,
  Mercurio: PLANET_COLORS.mercury.primary,
  Venus: PLANET_COLORS.venus.primary,
  Marte: PLANET_COLORS.mars.primary,
  Júpiter: PLANET_COLORS.jupiter.primary,
  Saturno: PLANET_COLORS.saturn.primary,
  Urano: PLANET_COLORS.uranus.primary,
  Neptuno: PLANET_COLORS.neptune.primary,
  Plutón: PLANET_COLORS.pluto.primary,
};

/**
 * Colores por planeta (tema clásico)
 */
export const PLANET_COLORS_CLASSIC: Record<string, string> = {
  Sol: PLANET_COLORS.sun.primary,
  Luna: PLANET_COLORS.moon.primary,
  Mercurio: PLANET_COLORS.mercury.primary,
  Venus: PLANET_COLORS.venus.primary,
  Marte: PLANET_COLORS.mars.primary,
  Júpiter: PLANET_COLORS.jupiter.primary,
  Saturno: PLANET_COLORS.saturn.primary,
  Urano: PLANET_COLORS.uranus.primary,
  Neptuno: PLANET_COLORS.neptune.primary,
  Plutón: PLANET_COLORS.pluto.primary,
};

/**
 * Obtiene el color de un planeta según el tema
 */
export function getPlanetColor(planetName: string, theme: 'classic' | 'violet'): string {
  const colors = theme === 'classic' ? PLANET_COLORS_CLASSIC : PLANET_COLORS_VIOLET;
  return colors[planetName] || (theme === 'classic' ? '#2a2a2a' : '#ffd45e');
}
