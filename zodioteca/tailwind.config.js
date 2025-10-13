/** @type {import('tailwindcss').Config} */
const designTokens = require('./src/constants/designTokens.ts');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores planetarios astrológicos
        planet: {
          sun: designTokens.PLANET_COLORS.sun,
          moon: designTokens.PLANET_COLORS.moon,
          mercury: designTokens.PLANET_COLORS.mercury,
          venus: designTokens.PLANET_COLORS.venus,
          mars: designTokens.PLANET_COLORS.mars,
          jupiter: designTokens.PLANET_COLORS.jupiter,
          saturn: designTokens.PLANET_COLORS.saturn,
          uranus: designTokens.PLANET_COLORS.uranus,
          neptune: designTokens.PLANET_COLORS.neptune,
          pluto: designTokens.PLANET_COLORS.pluto,
          chiron: designTokens.PLANET_COLORS.chiron,
          lilith: designTokens.PLANET_COLORS.lilith,
          node: designTokens.PLANET_COLORS.node,
        },

        // Colores semánticos
        semantic: designTokens.SEMANTIC_COLORS,

        // Mantener colores legacy para compatibilidad
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },

      fontFamily: {
        'astro': ['Inter', 'sans-serif'],
      },

      fontSize: designTokens.TYPOGRAPHY_SCALE,

      spacing: designTokens.SPACING_SCALE,

      boxShadow: {
        ...designTokens.SHADOWS,
        'astrological': designTokens.SHADOWS.glow.mystical,
      },

      animation: designTokens.ANIMATIONS.planetary,

      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      transitionDuration: designTokens.ANIMATIONS.duration,

      transitionTimingFunction: designTokens.ANIMATIONS.easing,
    },
  },
  plugins: [],
  darkMode: 'class',
}