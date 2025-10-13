/**
 * Design Tokens para AstroLab
 * Sistema unificado de colores, tipografía y espaciado astrológico
 */

// ========== COLORES PLANETARIOS ASTROLÓGICOS ==========
// Basado en correspondencias tradicionales astrológicas

export const PLANET_COLORS = {
  // Planetas clásicos
  sun: {
    primary: '#FFD700',      // Dorado solar brillante
    secondary: '#FFA500',    // Naranja solar
    light: '#FFF8DC',        // Crema solar
    dark: '#B8860B',         // Dorado oscuro
  },
  moon: {
    primary: '#E8E8E8',      // Plateado lunar
    secondary: '#C0C0C0',    // Gris plateado
    light: '#F5F5F5',        // Blanco lunar
    dark: '#A9A9A9',         // Gris oscuro
  },
  mercury: {
    primary: '#F4E04D',      // Amarillo mercurial
    secondary: '#FFD700',    // Dorado mercurio
    light: '#FFFACD',        // Amarillo claro
    dark: '#DAA520',         // Dorado oscuro
  },
  venus: {
    primary: '#FF69B4',      // Rosa venusiano
    secondary: '#FFB6C1',    // Rosa claro
    light: '#FFF0F5',        // Lavanda
    dark: '#DC143C',         // Carmesí
  },
  mars: {
    primary: '#FF4444',      // Rojo marciano
    secondary: '#FF6347',    // Rojo coral
    light: '#FFA07A',        // Salmón claro
    dark: '#B22222',         // Rojo fuego
  },
  jupiter: {
    primary: '#4A90E2',      // Azul jupiteriano
    secondary: '#87CEEB',    // Azul cielo
    light: '#E0F6FF',        // Azul muy claro
    dark: '#1E90FF',         // Azul dodger
  },
  saturn: {
    primary: '#8B7355',      // Marrón saturnino
    secondary: '#A0522D',    // Sienna
    light: '#DEB887',        // Burlywood
    dark: '#654321',         // Marrón oscuro
  },

  // Planetas modernos
  uranus: {
    primary: '#40E0D0',      // Turquesa uraniano
    secondary: '#00CED1',    // Turquesa oscuro
    light: '#E0FFFF',        // Azul claro
    dark: '#20B2AA',         // Light sea green
  },
  neptune: {
    primary: '#9370DB',      // Azul violeta neptuniano
    secondary: '#8A2BE2',    // Azul violeta
    light: '#E6E6FA',        // Lavanda
    dark: '#4B0082',         // Índigo
  },
  pluto: {
    primary: '#8B0000',      // Carmesí plutoniano
    secondary: '#B22222',    // Rojo fuego
    light: '#DC143C',        // Carmesí
    dark: '#800000',         // Rojo oscuro
  },

  // Puntos especiales
  chiron: {
    primary: '#98FB98',      // Verde chironiano
    secondary: '#90EE90',    // Verde claro
    light: '#F0FFF0',        // Honeydew
    dark: '#32CD32',         // Verde lima
  },
  lilith: {
    primary: '#2F4F4F',      // Gris oscuro lilith
    secondary: '#696969',    // Gris dim
    light: '#D3D3D3',        // Gris claro
    dark: '#000000',         // Negro
  },
  node: {
    primary: '#708090',      // Gris pizarra
    secondary: '#778899',    // Gris claro
    light: '#F5F5F5',        // Blanco humo
    dark: '#2F4F4F',         // Gris oscuro
  }
} as const;

// ========== COLORES SEMÁNTICOS ==========
// Colores con significado astrológico

export const SEMANTIC_COLORS = {
  // Estados de éxito/error basados en planetas
  success: PLANET_COLORS.jupiter.primary,    // Júpiter = expansión, éxito
  error: PLANET_COLORS.mars.primary,         // Marte = conflicto, error
  warning: PLANET_COLORS.saturn.primary,     // Saturno = limitación, precaución
  info: PLANET_COLORS.mercury.primary,       // Mercurio = comunicación, información

  // Estados de UI
  primary: PLANET_COLORS.sun.primary,        // Sol = centro, principal
  secondary: PLANET_COLORS.moon.primary,     // Luna = complementario
  accent: PLANET_COLORS.venus.primary,       // Venus = belleza, acento

  // Fondos y superficies
  background: {
    light: '#FFFFFF',
    dark: '#0A0A0A',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)'
  },

  surface: {
    light: '#F8F9FA',
    dark: '#1A1A1A',
    card: {
      light: '#FFFFFF',
      dark: '#2A2A2A'
    }
  },

  // Bordes y divisores
  border: {
    light: '#E5E7EB',
    dark: '#374151',
    accent: PLANET_COLORS.venus.light
  }
} as const;

// ========== ESCALA TIPOGRÁFICA ASTROLÓGICA ==========
// Basada en proporciones sagradas (proporción áurea ≈ 1.618)

export const TYPOGRAPHY_SCALE = {
  // Tamaños base
  xs: '0.75rem',      // 12px - Mercurio (comunicación detallada)
  sm: '0.875rem',     // 14px - Luna (intuición)
  base: '1rem',       // 16px - Sol (centro)
  lg: '1.125rem',     // 18px - Venus (armonía)
  xl: '1.25rem',      // 20px - Marte (acción)
  '2xl': '1.5rem',    // 24px - Júpiter (expansión)
  '3xl': '1.875rem',  // 30px - Saturno (estructura)
  '4xl': '2.25rem',   // 36px - Urano (innovación)
  '5xl': '3rem',      // 48px - Neptuno (inspiración)
  '6xl': '3.75rem',   // 60px - Plutón (transformación)

  // Pesos tipográficos
  weights: {
    thin: 100,        // Luna - sutil
    light: 300,       // Mercurio - ligero
    normal: 400,      // Sol - equilibrado
    medium: 500,      // Venus - armonioso
    semibold: 600,    // Marte - fuerte
    bold: 700,        // Júpiter - expansivo
    extrabold: 800,   // Saturno - sólido
    black: 900        // Plutón - intenso
  },

  // Alturas de línea astrológicas
  lineHeights: {
    tight: 1.25,      // Mercurio - compacto
    normal: 1.5,      // Sol - equilibrado
    relaxed: 1.625,   // Luna - fluido
    loose: 2          // Júpiter - espacioso
  }
} as const;

// ========== ESPACIADO ASTROLÓGICO ==========
// Basado en secuencia de Fibonacci

export const SPACING_SCALE = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
} as const;

// ========== SOMBRAS ASTROLÓGICAS ==========

export const SHADOWS = {
  // Sombras planetarias
  sun: '0 0 20px rgba(255, 215, 0, 0.3)',        // Dorado solar
  moon: '0 0 15px rgba(232, 232, 232, 0.2)',     // Plateado lunar
  mercury: '0 0 10px rgba(244, 224, 77, 0.25)',  // Amarillo mercurial
  venus: '0 0 15px rgba(255, 105, 180, 0.25)',   // Rosa venusiano
  mars: '0 0 15px rgba(255, 68, 68, 0.3)',       // Rojo marciano
  jupiter: '0 0 20px rgba(74, 144, 226, 0.25)',  // Azul jupiteriano
  saturn: '0 0 10px rgba(139, 115, 85, 0.2)',    // Marrón saturnino

  // Sombras UI
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Sombras astrológicas especiales
  glow: {
    sun: '0 0 30px rgba(255, 215, 0, 0.5)',
    moon: '0 0 25px rgba(232, 232, 232, 0.4)',
    mystical: '0 0 40px rgba(138, 43, 226, 0.3)'  // Púrpura místico
  }
} as const;

// ========== ANIMACIONES ASTROLÓGICAS ==========

export const ANIMATIONS = {
  // Duraciones
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms'
  },

  // Funciones de easing
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Animaciones específicas
  planetary: {
    orbit: 'orbit 20s linear infinite',           // Órbita planetaria
    pulse: 'pulse 2s ease-in-out infinite',       // Pulso lunar
    twinkle: 'twinkle 1.5s ease-in-out infinite', // Brillo estelar
    rotate: 'rotate 10s linear infinite'          // Rotación
  }
} as const;

// ========== BREAKPOINTS RESPONSIVE ==========

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ========== UTILIDADES ==========

/**
 * Obtiene el color principal de un planeta
 */
export function getPlanetColor(planet: keyof typeof PLANET_COLORS): string {
  return PLANET_COLORS[planet].primary;
}

/**
 * Obtiene todos los colores de un planeta
 */
export function getPlanetColorPalette(planet: keyof typeof PLANET_COLORS) {
  return PLANET_COLORS[planet];
}

/**
 * Obtiene color semántico por tipo
 */
export function getSemanticColor(type: keyof typeof SEMANTIC_COLORS): string {
  const color = SEMANTIC_COLORS[type];
  return typeof color === 'string' ? color : color.light; // Default to light variant
}

/**
 * Genera gradiente astrológico basado en planetas
 */
export function generateAstrologicalGradient(planets: (keyof typeof PLANET_COLORS)[]): string {
  if (planets.length === 0) return 'linear-gradient(45deg, #FFD700, #FF69B4)';

  const colors = planets.map(planet => PLANET_COLORS[planet].primary);
  return `linear-gradient(45deg, ${colors.join(', ')})`;
}