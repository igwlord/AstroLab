# 🎯 PLAN DE IMPLEMENTACIÓN: GRÁFICO DE CARTA NATAL

**Objetivo:** Crear visualización gráfica de cartas natales sin modificar los cálculos existentes que funcionan perfectamente.

**Diseño Base:** Usar la estética de `DailyChartWheel.tsx` pero adaptado para cartas natales completas.

---

## 📊 ESTADO ACTUAL

✅ **Lo que YA tenemos:**
- Cálculos Swiss Ephemeris precisos (NO TOCAR)
- `DailyChartWheel.tsx` - Rueda visual para clima del día
- Sistema de guardado de cartas (`ChartStorage`)
- Modal `ChartModal.tsx` mostrando datos en texto
- Tipos completos: `Planet`, `House`, `Aspect`

---

## 🎨 ANÁLISIS DE DISEÑO EXISTENTE

**DailyChartWheel.tsx usa:**
- Canvas HTML5 para dibujo
- Círculos concéntricos (signos, casas, planetas)
- Símbolos Unicode para planetas y signos
- Colores por elemento (fuego, tierra, aire, agua)
- Responsive con `useEffect` para resize
- Leyenda interactiva

**Diferencias con Carta Natal:**
- Dashboard: 1 carta (hoy)
- Natal: Múltiples cartas guardadas
- Natal: Más datos (aspectos, nodos, Lilith, Quirón)
- Natal: Cúspides de casas personalizadas
- Natal: Posibles aspectos entre planetas

---

## 🚀 PLAN POR FASES

### **FASE 1: PREPARACIÓN Y ESTRUCTURA** 📋
**Objetivo:** Crear componente base sin romper nada existente

**Checklist:**
- [ ] 1.1 Crear `NatalChartWheel.tsx` (copia de DailyChartWheel)
- [ ] 1.2 Crear tipo `NatalChartWheelProps` con datos de carta
- [ ] 1.3 Configurar canvas con mismas dimensiones base (600x600)
- [ ] 1.4 Implementar círculos concéntricos básicos (4 niveles)
- [ ] 1.5 Agregar resize handler y responsive
- [ ] 1.6 Testing: Renderiza sin errores con datos mock

**Archivos a crear:**
```
zodioteca/src/components/NatalChartWheel.tsx
zodioteca/src/types/natalChartWheel.ts (opcional, tipos específicos)
```

**Archivos a modificar:**
- NINGUNO (fase de creación aislada)

**Tiempo estimado:** 1-2 horas

---

### **FASE 2: SIGNOS ZODIACALES** ♈♉♊
**Objetivo:** Dibujar rueda zodiacal de fondo (estática)

**Checklist:**
- [ ] 2.1 Dibujar círculo exterior con 12 divisiones (30° cada una)
- [ ] 2.2 Agregar símbolos de signos en posiciones correctas
- [ ] 2.3 Aplicar colores por elemento (fuego/rojo, tierra/verde, aire/amarillo, agua/azul)
- [ ] 2.4 Agregar etiquetas de grados (0°, 30°, 60°...)
- [ ] 2.5 Implementar gradientes suaves entre signos
- [ ] 2.6 Testing: Rueda zodiacal visible y estética

**Datos necesarios:**
```typescript
const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', element: 'fuego', startDegree: 0 },
  { name: 'Tauro', symbol: '♉', element: 'tierra', startDegree: 30 },
  // ... etc
];
```

**Tiempo estimado:** 2-3 horas

---

### **FASE 3: CASAS ASTROLÓGICAS** 🏠
**Objetivo:** Dibujar las 12 casas con cúspides personalizadas

**Checklist:**
- [ ] 3.1 Leer datos de `chart.data.houses` del prop
- [ ] 3.2 Dibujar líneas de cúspides desde centro hacia exterior
- [ ] 3.3 Resaltar Ascendente (Casa 1) con línea más gruesa
- [ ] 3.4 Resaltar Medio Cielo (Casa 10) con línea más gruesa
- [ ] 3.5 Agregar números de casas (1-12) en posiciones intermedias
- [ ] 3.6 Implementar colores distintos para casas angulares/sucedentes/cadentes
- [ ] 3.7 Testing: Casas alineadas con cúspides correctas

**Datos del sistema actual:**
```typescript
interface House {
  number: number;
  sign: string;
  degree: number;
  cuspDegree: number; // Grado absoluto 0-360
}
```

**Tiempo estimado:** 3-4 horas

---

### **FASE 4: PLANETAS** 🪐
**Objetivo:** Posicionar planetas en sus grados exactos

**Checklist:**
- [ ] 4.1 Leer `chart.data.planets` del prop
- [ ] 4.2 Calcular posición (x, y) según `longitude` (0-360°)
- [ ] 4.3 Dibujar símbolos de planetas en círculo intermedio
- [ ] 4.4 Agregar colores por categoría (personal/social/transpersonal)
- [ ] 4.5 Implementar anti-colisión si planetas están muy cerca
- [ ] 4.6 Mostrar grados de cada planeta (ej: "☉ 15°♎")
- [ ] 4.7 Agregar tooltips hover con info completa
- [ ] 4.8 Testing: Todos los planetas visibles en posiciones correctas

**Datos del sistema actual:**
```typescript
interface Planet {
  name: string;
  sign: string;
  degree: number;
  longitude: number; // 0-360
  retrograde: boolean;
}
```

**Planetas a incluir:**
- ☉ Sol, ☽ Luna
- ☿ Mercurio, ♀ Venus, ♂ Marte
- ♃ Júpiter, ♄ Saturno
- ♅ Urano, ♆ Neptuno, ♇ Plutón

**Tiempo estimado:** 4-5 horas

---

### **FASE 5: ASPECTOS** 🔗
**Objetivo:** Dibujar líneas de aspectos entre planetas

**Checklist:**
- [ ] 5.1 Leer `chart.data.aspects` del prop
- [ ] 5.2 Calcular líneas entre planetas (desde centro o bordeando)
- [ ] 5.3 Aplicar colores por tipo de aspecto:
  - Conjunción: rojo intenso
  - Oposición: rojo
  - Trígono: azul
  - Cuadratura: naranja
  - Sextil: verde
- [ ] 5.4 Ajustar opacidad según fuerza del aspecto (orbe)
- [ ] 5.5 Agregar toggle para mostrar/ocultar aspectos
- [ ] 5.6 Filtros: mayores/menores/todos
- [ ] 5.7 Testing: Aspectos visibles sin saturar la rueda

**Datos del sistema actual:**
```typescript
interface Aspect {
  planet1: string;
  planet2: string;
  type: string; // 'conjunction', 'opposition', etc.
  angle: number;
  orb: number;
}
```

**Tiempo estimado:** 5-6 horas

---

### **FASE 6: PUNTOS ADICIONALES** ⭐
**Objetivo:** Agregar Nodos Lunares, Lilith, Quirón, Vertex

**Checklist:**
- [ ] 6.1 Detectar si existen datos de puntos adicionales
- [ ] 6.2 Agregar símbolos especiales:
  - ☊ Nodo Norte
  - ☋ Nodo Sur
  - ⚸ Lilith (Luna Negra)
  - ⚷ Quirón
  - Vx Vertex
- [ ] 6.3 Posicionar en círculo de planetas (mismo radio)
- [ ] 6.4 Usar colores distintivos (morado para Lilith, etc.)
- [ ] 6.5 Agregar a leyenda
- [ ] 6.6 Testing: Puntos adicionales visibles si existen

**Tiempo estimado:** 2-3 horas

---

### **FASE 7: LEYENDA INTERACTIVA** 📖
**Objetivo:** Panel lateral con info y controles

**Checklist:**
- [ ] 7.1 Crear panel colapsable al lado de la rueda
- [ ] 7.2 Listar todos los planetas con posición (♂ Marte 10°♈)
- [ ] 7.3 Listar casas con cúspides
- [ ] 7.4 Agregar controles:
  - Toggle aspectos (on/off)
  - Filtro aspectos (mayores/menores/todos)
  - Toggle puntos adicionales
  - Zoom (opcional)
- [ ] 7.5 Highlight: al hover planeta en leyenda, resaltar en rueda
- [ ] 7.6 Responsive: leyenda abajo en móvil, al lado en desktop
- [ ] 7.7 Testing: Interacciones funcionan, UX fluida

**Tiempo estimado:** 3-4 horas

---

### **FASE 8: INTEGRACIÓN CON CHARTMODAL** 🔌
**Objetivo:** Mostrar rueda en el modal de cartas

**Checklist:**
- [ ] 8.1 Importar `NatalChartWheel` en `ChartModal.tsx`
- [ ] 8.2 Agregar tab "Gráfico" junto a datos textuales
- [ ] 8.3 Pasar datos de `chart` como props
- [ ] 8.4 Ajustar layout: gráfico arriba, datos abajo
- [ ] 8.5 Agregar botón "Descargar Imagen" (opcional)
- [ ] 8.6 Testing: Modal muestra gráfico + datos sin errores

**Archivos a modificar:**
```
zodioteca/src/components/ChartModal.tsx
```

**Tiempo estimado:** 2 horas

---

### **FASE 9: OPTIMIZACIÓN Y RENDIMIENTO** ⚡
**Objetivo:** Asegurar fluidez y carga rápida

**Checklist:**
- [ ] 9.1 Implementar `useMemo` para cálculos de posiciones
- [ ] 9.2 Evitar re-renders innecesarios con `React.memo`
- [ ] 9.3 Lazy loading del componente `NatalChartWheel`
- [ ] 9.4 Agregar skeleton loader mientras carga
- [ ] 9.5 Optimizar canvas: `requestAnimationFrame` si hay animaciones
- [ ] 9.6 Testing: Profiler React, medir FPS

**Tiempo estimado:** 2-3 horas

---

### **FASE 10: MEJORAS VISUALES Y PULIDO** ✨
**Objetivo:** Refinar estética y experiencia de usuario

**Checklist:**
- [ ] 10.1 Ajustar colores para dark mode
- [ ] 10.2 Agregar animación de entrada (fade in + scale)
- [ ] 10.3 Mejorar tipografía (tamaños, pesos, legibilidad)
- [ ] 10.4 Agregar sombras y efectos sutiles
- [ ] 10.5 Implementar tooltips informativos (ChakraUI o custom)
- [ ] 10.6 Revisar accesibilidad (ARIA labels, contraste)
- [ ] 10.7 Testing: Revisión visual completa en 3 dispositivos

**Tiempo estimado:** 3-4 horas

---

### **FASE 11: EXPORTACIÓN Y COMPARTIR** 📤
**Objetivo:** Permitir guardar imagen de la carta

**Checklist:**
- [ ] 11.1 Implementar `canvas.toDataURL()` para PNG
- [ ] 11.2 Botón "Descargar Carta" en modal
- [ ] 11.3 Agregar metadata en imagen (nombre, fecha, lugar)
- [ ] 11.4 Opción: compartir en redes (Web Share API)
- [ ] 11.5 Watermark "AstroLab" en esquina (opcional)
- [ ] 11.6 Testing: Descarga funciona en todos los navegadores

**Tiempo estimado:** 2-3 horas

---

### **FASE 12: TESTING FINAL Y DOCUMENTACIÓN** ✅
**Objetivo:** Asegurar calidad y facilitar mantenimiento

**Checklist:**
- [ ] 12.1 Testing manual: crear 5 cartas diferentes
- [ ] 12.2 Verificar cálculos visuales vs datos textuales
- [ ] 12.3 Testing responsive: móvil, tablet, desktop
- [ ] 12.4 Testing navegadores: Chrome, Firefox, Safari, Edge
- [ ] 12.5 Documentar componente `NatalChartWheel` (JSDoc)
- [ ] 12.6 Crear archivo `CHART_WHEEL_USAGE.md` con ejemplos
- [ ] 12.7 Actualizar README con screenshots
- [ ] 12.8 Performance: lighthouse score > 90

**Tiempo estimado:** 3-4 horas

---

## 📦 ENTREGABLES POR FASE

| Fase | Entregable Principal | Archivos Nuevos | Archivos Modificados |
|------|---------------------|-----------------|---------------------|
| 1 | Componente base | `NatalChartWheel.tsx` | - |
| 2 | Rueda zodiacal | - | `NatalChartWheel.tsx` |
| 3 | Casas con cúspides | - | `NatalChartWheel.tsx` |
| 4 | Planetas posicionados | - | `NatalChartWheel.tsx` |
| 5 | Líneas de aspectos | - | `NatalChartWheel.tsx` |
| 6 | Puntos adicionales | - | `NatalChartWheel.tsx` |
| 7 | Leyenda interactiva | - | `NatalChartWheel.tsx` |
| 8 | Integración modal | - | `ChartModal.tsx` |
| 9 | Optimización | - | `NatalChartWheel.tsx` |
| 10 | Pulido visual | - | `NatalChartWheel.tsx` |
| 11 | Export imagen | utils | `ChartModal.tsx` |
| 12 | Docs + testing | `CHART_WHEEL_USAGE.md` | `README.md` |

---

## ⚠️ REGLAS CRÍTICAS

1. **NO TOCAR CÁLCULOS:**
   - `astroService.ts` → 🔒 INTACTO
   - `swisseph.wasm` → 🔒 INTACTO
   - Tipos de datos → 🔒 INTACTOS

2. **COMMITS PEQUEÑOS:**
   - 1 fase = 1-3 commits máximo
   - Mensaje claro: `feat(chart-wheel): fase X - descripción`

3. **TESTING ENTRE FASES:**
   - Nunca pasar a siguiente fase sin verificar la anterior
   - Si algo se rompe, revertir inmediatamente

4. **MANTENER DISEÑO EXISTENTE:**
   - No cambiar colores globales de la app
   - Respetar sistema de diseño actual
   - Dark mode compatible desde el inicio

---

## 🎯 PRIORIDADES

**Alta (MVP):**
- Fases 1-4: Estructura + Signos + Casas + Planetas

**Media:**
- Fases 5-8: Aspectos + Puntos + Leyenda + Integración

**Baja (nice-to-have):**
- Fases 9-12: Optimización + Pulido + Export + Docs

---

## 📊 PROGRESO GENERAL

- [ ] Fase 1: Preparación y Estructura
- [ ] Fase 2: Signos Zodiacales
- [ ] Fase 3: Casas Astrológicas
- [ ] Fase 4: Planetas
- [ ] Fase 5: Aspectos
- [ ] Fase 6: Puntos Adicionales
- [ ] Fase 7: Leyenda Interactiva
- [ ] Fase 8: Integración con ChartModal
- [ ] Fase 9: Optimización y Rendimiento
- [ ] Fase 10: Mejoras Visuales y Pulido
- [ ] Fase 11: Exportación y Compartir
- [ ] Fase 12: Testing Final y Documentación

**Progreso:** 0/12 fases completadas (0%)

---

## 📝 NOTAS TÉCNICAS

**Canvas vs SVG:**
- Usamos Canvas (como DailyChartWheel) por mejor performance
- SVG sería mejor para interactividad, pero más pesado

**Responsive:**
```typescript
// Tamaños recomendados
const SIZES = {
  mobile: 300,
  tablet: 500,
  desktop: 600
};
```

**Colores de Aspectos:**
```typescript
const ASPECT_COLORS = {
  conjunction: '#FF0000',    // Rojo
  opposition: '#FF6B6B',     // Rojo claro
  trine: '#4ECDC4',          // Azul verdoso
  square: '#FF9F1C',         // Naranja
  sextile: '#95E1D3',        // Verde agua
};
```

**Símbolos Unicode:**
```typescript
const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇'
};
```

---

## 🚀 SIGUIENTE PASO

**Acción inmediata:** Iniciar Fase 1 - Crear `NatalChartWheel.tsx` base

**Comando:**
```bash
# Crear componente base
touch zodioteca/src/components/NatalChartWheel.tsx
```

---

**Creado:** 7 de octubre de 2025  
**Última actualización:** 7 de octubre de 2025  
**Estado:** 📋 PENDIENTE - Listo para iniciar
