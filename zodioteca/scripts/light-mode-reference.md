# 🎨 Referencia Rápida - Clases Tailwind para Modo Claro

## Patrones Comunes

### Fondos
\\\	sx
// Fondo principal
dark:bg-gray-900 bg-[#FFF8F5]

// Cards
dark:bg-gray-800 bg-white/95

// Inputs
dark:bg-white/10 bg-[#FFE5D9]/80

// Gradientes
dark:from-purple-900 from-[#FFE5D9] dark:to-blue-900 to-[#D4F1F4]
\\\

### Textos
\\\	sx
// Títulos
dark:text-white text-gray-800

// Subtítulos
dark:text-purple-100 text-purple-800

// Cuerpo
dark:text-gray-300 text-gray-700

// Muted
dark:text-gray-400 text-gray-500
\\\

### Bordes
\\\	sx
dark:border-purple-700 border-[#FDD4C1]
dark:border-white/20 border-gray-200
\\\

### Hover States
\\\	sx
dark:hover:bg-purple-900/20 hover:bg-[#FFE5D9]/50
dark:hover:text-white hover:text-purple-800
\\\

## SVG Gradients

### Rueda Natal - Modo Oscuro
\\\	sx
<radialGradient id="bg-gradient-dark">
  <stop offset="0%" stopColor="#1a1a2e" />
  <stop offset="100%" stopColor="#0a0a18" />
</radialGradient>
\\\

### Rueda Natal - Modo Claro
\\\	sx
<radialGradient id="bg-gradient-light">
  <stop offset="0%" stopColor="#FFF8F5" />
  <stop offset="30%" stopColor="#FFE5D9" />
  <stop offset="70%" stopColor="#D4F1F4" />
  <stop offset="100%" stopColor="#F8E6F1" />
</radialGradient>
\\\

## Testing

Después de cada cambio:
1. Toggle dark/light mode
2. Verificar legibilidad de textos
3. Probar hover/focus states
4. Validar en móvil
5. Generar PDF de prueba
