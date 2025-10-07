# 🎯 Plan de Implementación: Chart Wheel Visual

## 📋 Objetivo General
Implementar visualización de carta natal estilo astro.com/carta-natal.es con gráfico circular completo mostrando:
- Círculo zodiacal con 12 signos
- Posiciones planetarias exactas
- Líneas de aspectos coloreadas
- Cúspides de casas
- Grados marcados
- Interactividad y tooltips

## 🎪 FASE 1: Cielo de Hoy (Dashboard)
**Prioridad:** ALTA  
**Tiempo estimado:** 4-6 horas  
**Estado:** ⬜ Pendiente

### Tareas:
- [ ] **1.1** Crear componente `DailyChartWheel.tsx`
  - Estructura SVG circular base (viewBox, responsive)
  - Círculo exterior con degradado
  - 12 segmentos zodiacales con símbolos
  - Marcas de grados cada 5°

- [ ] **1.2** Integrar cálculos de `dailyWeather.ts`
  - Extraer posiciones planetarias (sol, luna, personales)
  - Calcular posición angular de cada planeta (0-360°)
  - Convertir grados zodiacales a posición absoluta

- [ ] **1.3** Renderizar planetas en el círculo
  - Símbolos astrológicos Unicode (☉☽☿♀♂♃♄)
  - Posicionamiento exacto según grados
  - Iconos coloreados por tipo de planeta
  - Badge de retrógrado (℞) si aplica

- [ ] **1.4** Dibujar líneas de aspectos
  - Extraer `mainAspects` del weather data
  - Calcular coordenadas inicio/fin de cada línea
  - Colorear según tipo:
    - 🔴 Conjunción (rojo)
    - 🔵 Trígono (azul)
    - 🟢 Sextil (verde)
    - 🟠 Cuadratura (naranja)
    - 🟣 Oposición (púrpura)
  - Grosor de línea según orbe (más exacto = más grueso)

- [ ] **1.5** Añadir cúspides de casas (opcional para "hoy")
  - Líneas radiales desde centro
  - Números de casa (I-XII)
  - Colores diferentes para casas angulares

- [ ] **1.6** Interactividad
  - Hover sobre planeta → Tooltip con info
  - Hover sobre aspecto → Destacar línea
  - Click en planeta → Modal con detalles
  - Responsive: adaptar tamaño a mobile/desktop

- [ ] **1.7** Integrar en `AstrologicalWeatherCard`
  - Agregar como sección expandible en acordeón
  - Toggle "Ver gráfico circular" 
  - Posicionar debajo del resumen textual
  - Animación de entrada suave

### Resultado Esperado:
✅ Card "Cielo de Hoy" con gráfico circular mostrando posiciones planetarias del día actual y aspectos principales.

---

## 🌟 FASE 2: Carta Natal Completa (NatalChartPage)
**Prioridad:** MEDIA  
**Tiempo estimado:** 6-8 horas  
**Estado:** ⬜ Pendiente

### Tareas:
- [ ] **2.1** Crear componente `NatalChartWheel.tsx`
  - Reutilizar lógica de `DailyChartWheel`
  - Aceptar props: `NatalChart` completo
  - Soporte para todas las opciones de cálculo

- [ ] **2.2** Renderizar círculo completo
  - Anillo exterior: Signos zodiacales (360°)
  - Anillo medio: Cúspides de casas (12 divisiones desiguales)
  - Anillo interior: Planetas + puntos árabes + nodos
  - Centro: Datos de nacimiento resumidos

- [ ] **2.3** Mostrar TODOS los elementos
  - 10 planetas clásicos + Quirón
  - Nodos lunares (Norte y Sur)
  - Parte de la Fortuna + otros lotes árabes
  - Lilith (si está calculada)
  - Asteroides (si están incluidos)

- [ ] **2.4** Sistema de casas visualizado
  - Líneas de cúspide desde centro a circunferencia
  - Números romanos I-XII
  - Destacar casas angulares (1, 4, 7, 10)
  - Mostrar sistema usado (Placidus, Koch, etc.)

- [ ] **2.5** Aspectos completos
  - Todos los aspectos calculados (no solo mayores)
  - Diferenciar aspectos aplicativos vs separativos
  - Grosor proporcional a exactitud (orbe)
  - Opción de filtrar por tipo de aspecto

- [ ] **2.6** Leyenda y controles
  - Selector de qué mostrar/ocultar:
    - ☑️ Planetas personales
    - ☑️ Planetas sociales
    - ☑️ Planetas generacionales
    - ☑️ Puntos árabes
    - ☑️ Aspectos mayores
    - ☑️ Aspectos menores
  - Leyenda de colores de aspectos
  - Botón de descarga como imagen PNG/SVG

- [ ] **2.7** Tooltips avanzados
  - Hover planeta → Nombre, signo, grado, casa, dignidad
  - Hover aspecto → Tipo, orbe exacto, planetas involucrados
  - Hover casa → Cúspide exacta, regente, planetas contenidos

- [ ] **2.8** Integración en NatalChartPage
  - Nueva sección "Gráfico Circular" al inicio
  - Opción de vista: Gráfico vs Tablas
  - Sincronizar con modal de planetas (click → abrir modal)
  - Botón "Compartir gráfico" (genera imagen)

### Resultado Esperado:
✅ Carta natal completa con visualización circular profesional, mostrando todos los elementos calculados con interactividad completa.

---

## 🔧 FASE 3: Optimizaciones y Refinamientos
**Prioridad:** BAJA  
**Tiempo estimado:** 3-4 horas  
**Estado:** ⬜ Pendiente

### Tareas:
- [ ] **3.1** Performance
  - Memoizar cálculos de posiciones SVG
  - Lazy loading del SVG pesado
  - Optimizar re-renders con React.memo

- [ ] **3.2** Accesibilidad
  - ARIA labels para todos los elementos
  - Navegación por teclado (Tab + Enter)
  - Modo alto contraste

- [ ] **3.3** Exportación
  - Descargar como PNG de alta resolución
  - Descargar como SVG editable
  - Copiar imagen al portapapeles
  - Compartir en redes sociales

- [ ] **3.4** Animaciones
  - Entrada suave de planetas (stagger)
  - Pulsación de aspectos exactos
  - Rotación del wheel (opcional)

- [ ] **3.5** Temas visuales
  - Tema claro/oscuro (ya implementado)
  - Variante "minimalista" (sin colores)
  - Variante "clásica" (blanco y negro)

### Resultado Esperado:
✅ Componentes optimizados, accesibles y con múltiples opciones de personalización y exportación.

---

## 📦 Componentes a Crear

### Nuevos Archivos:
```
src/components/
├── DailyChartWheel.tsx          # Gráfico para "Cielo de Hoy"
├── NatalChartWheel.tsx          # Gráfico para carta natal completa
├── ChartWheelBase.tsx           # Lógica compartida entre ambos
└── ChartWheelLegend.tsx         # Leyenda de símbolos y aspectos

src/utils/
├── chartGeometry.ts             # Cálculos de coordenadas SVG
└── astroSymbols.ts              # Mapeo de símbolos Unicode
```

### Dependencias Adicionales:
- ❌ **NO SE REQUIEREN** nuevas dependencias NPM
- ✅ Usar solo SVG nativo + React
- ✅ Aprovechar cálculos existentes de astronomy-engine

---

## 🎨 Diseño Visual

### Paleta de Colores (Aspectos):
| Aspecto | Color | Significado |
|---------|-------|-------------|
| Conjunción (0°) | `#EF4444` (rojo) | Fusión de energías |
| Oposición (180°) | `#8B5CF6` (púrpura) | Tensión polarizada |
| Trígono (120°) | `#3B82F6` (azul) | Armonía natural |
| Cuadratura (90°) | `#F97316` (naranja) | Desafío constructivo |
| Sextil (60°) | `#10B981` (verde) | Oportunidad suave |

### Estructura del SVG:
```
┌─────────────────────────────────────┐
│  Anillo Exterior: Signos Zodiacales │ (R = 100%)
├─────────────────────────────────────┤
│  Anillo Medio: Números de Casas     │ (R = 85%)
├─────────────────────────────────────┤
│  Anillo Planetas: Símbolos          │ (R = 70%)
├─────────────────────────────────────┤
│  Centro: Aspectos (líneas)          │ (R = 0-60%)
└─────────────────────────────────────┘
```

---

## 📊 Métricas de Éxito

### Fase 1 (Cielo de Hoy):
- ✅ Gráfico se renderiza en <500ms
- ✅ Responsive en mobile (320px+)
- ✅ Muestra correctamente Sol, Luna y 3 personales
- ✅ Al menos 5 aspectos principales visibles
- ✅ Tooltips funcionan en hover

### Fase 2 (Carta Natal):
- ✅ Soporta cartas con 20+ elementos
- ✅ Aspectos no se solapan visualmente
- ✅ Leyenda completa y funcional
- ✅ Exportación PNG funciona
- ✅ Performance: 60fps en interacciones

### Fase 3 (Optimizaciones):
- ✅ Puntuación Lighthouse Accessibility >90
- ✅ Tamaño SVG exportado <500KB
- ✅ Carga inicial <200ms

---

## 🚀 Roadmap de Implementación

### Semana 1:
- **Día 1-2:** FASE 1.1 - 1.4 (Componente base + planetas)
- **Día 3:** FASE 1.5 - 1.7 (Aspectos + integración)

### Semana 2:
- **Día 1-2:** FASE 2.1 - 2.4 (Carta natal base)
- **Día 3-4:** FASE 2.5 - 2.8 (Aspectos completos + integración)

### Semana 3:
- **Día 1-2:** FASE 3 (Optimizaciones)
- **Día 3:** Testing + documentación

---

## 📝 Notas Técnicas

### Coordenadas Zodiacales → SVG:
```typescript
// Convertir posición zodiacal a ángulo absoluto
function zodiacToAngle(sign: string, degree: number): number {
  const signIndex = SIGNS.indexOf(sign); // 0-11
  const absoluteDegree = (signIndex * 30) + degree; // 0-360
  
  // Ajustar para que Aries empiece a la izquierda (9:00)
  const svgAngle = 180 - absoluteDegree; // SVG usa 0° = derecha
  
  return svgAngle;
}

// Convertir ángulo a coordenadas x, y
function angleToCoords(angle: number, radius: number): [number, number] {
  const radian = (angle * Math.PI) / 180;
  const x = 50 + radius * Math.cos(radian); // Centro en 50%
  const y = 50 - radius * Math.sin(radian);
  
  return [x, y];
}
```

### Símbolos Unicode Astrológicos:
```typescript
export const PLANET_SYMBOLS = {
  'Sol': '☉',
  'Luna': '☽',
  'Mercurio': '☿',
  'Venus': '♀',
  'Marte': '♂',
  'Júpiter': '♃',
  'Saturno': '♄',
  'Urano': '♅',
  'Neptuno': '♆',
  'Plutón': '♇',
  'Quirón': '⚷',
  'Nodo Norte': '☊',
  'Nodo Sur': '☋',
};

export const SIGN_SYMBOLS = {
  'Aries': '♈',
  'Tauro': '♉',
  'Géminis': '♊',
  'Cáncer': '♋',
  'Leo': '♌',
  'Virgo': '♍',
  'Libra': '♎',
  'Escorpio': '♏',
  'Sagitario': '♐',
  'Capricornio': '♑',
  'Acuario': '♒',
  'Piscis': '♓',
};
```

---

## ✅ Checklist de Preparación

Antes de comenzar la implementación:
- [x] Plan aprobado y revisado
- [ ] Repositorio limpio (sin cambios pendientes)
- [ ] Commit del plan en git
- [ ] Branch nueva: `feature/chart-wheel-visualization`
- [ ] Pruebas de cálculos existentes funcionando
- [ ] Revisar datos disponibles en `dailyWeather.ts`

---

## 🎯 Siguiente Paso

Una vez este plan esté en git:
1. Crear branch `feature/chart-wheel-visualization`
2. Comenzar con **FASE 1.1**: Estructura base del componente `DailyChartWheel`
3. Iteración rápida con feedback visual constante

---

**Fecha de creación:** 7 de octubre de 2025  
**Última actualización:** 7 de octubre de 2025  
**Autor:** GitHub Copilot + igwlord  
**Estado del proyecto:** 🟡 Planificación completa - Listo para implementar
