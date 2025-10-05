# PLAN DE IMPLEMENTACIÓN: CÁLCULOS ASTRONÓMICOS AVANZADOS

## 📋 RESUMEN EJECUTIVO

Implementar cálculos astrológicos avanzados en la aplicación Zodioteca, ampliando las capacidades actuales (Sol, Luna, Planetas, Casas, Aspectos básicos) con asteroides, puntos ficticios, nodos, aspectos menores y técnicas árabes.

---

## 🎯 OBJETIVOS

### Nuevos Cálculos a Implementar:

1. **Asteroides** (4):
   - Ceres
   - Pallas
   - Juno
   - Vesta

2. **Puntos Sensibles** (2):
   - Chiron
   - Lilith (Mean y True)

3. **Nodos Lunares** (2 tipos):
   - Mean (Promedio)
   - True (Verdaderos)

4. **Aspectos Ampliados**:
   - Aspectos menores: Quincunx (150°)
   - Orbe personalizado: 6° (ajustable)

5. **Técnicas Avanzadas**:
   - Partes Árabes (Fortuna, Espíritu, etc.)
   - Declinaciones Paralelas
   - Polarizaciones

---

## 📊 FASES DE IMPLEMENTACIÓN

### **FASE 1: ASTEROIDES (Ceres, Pallas, Juno, Vesta)**
**Duración estimada:** 3-4 horas  
**Prioridad:** Alta  
**Dependencias:** astronomy-engine

#### Tareas:
1. ✅ **Investigación técnica**
   - Verificar soporte de astronomy-engine para asteroides
   - Alternativa: usar Swiss Ephemeris via API o WASM
   - Números de asteroides: Ceres (1), Pallas (2), Juno (3), Vesta (4)

2. **Cálculo de posiciones**
   - Crear función `calculateAsteroids(date, lat, lon)`
   - Calcular longitud eclíptica
   - Determinar signo zodiacal
   - Calcular casa astrológica
   - Detectar retrógrado

3. **Integración UI**
   - Agregar sección "Asteroides" al NatalChartPage
   - Diseño: Grid de 4 tarjetas similar a Planetas
   - Iconos: ⚪ Ceres, 🛡️ Pallas, 💍 Juno, 🔥 Vesta

4. **Glosario**
   - Crear modales explicativos para cada asteroide
   - Significados en español

**Entregables:**
- `src/services/asteroidsCalculator.ts`
- `src/types/asteroids.ts`
- UI integrada en NatalChartPage
- 4 modales de glosario

---

### **FASE 2: CHIRON Y LILITH**
**Duración estimada:** 2-3 horas  
**Prioridad:** Alta  
**Dependencias:** FASE 1

#### Tareas:
1. **Chiron (Planetoide)**
   - Calcular posición de Chiron
   - Signo, casa, grado
   - Icono: ⚕️ o 🔑

2. **Lilith (2 tipos)**
   - **Mean Lilith** (Luna Negra promedio): Punto calculado matemáticamente
   - **True Lilith** (Luna Negra verdadera): Posición oscilante real
   - Toggle para elegir cuál mostrar
   - Iconos: 🌑 Mean, 🖤 True

3. **Integración UI**
   - Sección "Puntos Sensibles"
   - Tarjetas para Chiron + Lilith
   - Settings: toggle Mean/True Lilith

**Entregables:**
- Funciones de cálculo para Chiron y Lilith
- Toggle en Settings para tipo de Lilith
- UI integrada

---

### **FASE 3: NODOS LUNARES (Mean y True)**
**Duración estimada:** 2 horas  
**Prioridad:** Media  
**Dependencias:** FASE 2

#### Tareas:
1. **Nodo Norte y Sur**
   - Mean Nodes (promedio matemático)
   - True Nodes (posición real oscilante)
   - Cálculo: Nodo Sur = Nodo Norte + 180°

2. **Integración UI**
   - Sección "Nodos Lunares"
   - 2 tarjetas: ☊ Nodo Norte, ☋ Nodo Sur
   - Settings: toggle Mean/True Nodes
   - Mostrar ambos tipos simultáneamente para comparación

**Entregables:**
- Funciones de cálculo de nodos
- Toggle en Settings
- UI con 2 tarjetas

---

### **FASE 4: ASPECTOS AMPLIADOS (Quincunx + Orbe Personalizado)**
**Duración estimada:** 3 horas  
**Prioridad:** Media-Alta  
**Dependencias:** FASE 1 (para incluir asteroides en aspectos)

#### Tareas:
1. **Aspecto Quincunx (150°)**
   - Agregar a la función `calculateAspects`
   - Símbolo: ⚻ o 150°
   - Color: verde oliva o gris

2. **Sistema de orbes personalizado**
   - Orbe base: 6° (configurable)
   - Diferentes orbes por aspecto:
     - Conjunción: 8°
     - Oposición: 8°
     - Trígono: 8°
     - Cuadratura: 7°
     - Sextil: 6°
     - Quincunx: 3°

3. **Aspectos con asteroides**
   - Calcular aspectos entre:
     - Planetas ↔ Asteroides
     - Asteroides ↔ Asteroides
     - Planetas/Asteroides ↔ Chiron/Lilith/Nodos

4. **Configuración UI**
   - Settings: slider para orbe global (3°-10°)
   - Checkbox: "Incluir asteroides en aspectos"
   - Filtros: mostrar/ocultar aspectos menores

**Entregables:**
- Aspectos ampliados con Quincunx
- Sistema de orbes configurable
- Settings para filtrar aspectos

---

### **FASE 5: PARTES ÁRABES**
**Duración estimada:** 4-5 horas  
**Prioridad:** Media  
**Dependencias:** Todas las anteriores

#### Tareas:
1. **Partes principales**
   - **Parte de la Fortuna**: ASC + Luna - Sol (diurna) | ASC + Sol - Luna (nocturna)
   - **Parte del Espíritu**: ASC + Sol - Luna (diurna) | ASC + Luna - Sol (nocturna)
   - **Parte del Amor**: ASC + Venus - Sol
   - **Parte del Matrimonio**: ASC + Desc - Venus
   - **Parte de la Profesión**: ASC + MC - Sol

2. **Cálculo**
   - Fórmulas ajustadas por carta diurna/nocturna
   - Determinar signo y casa
   - No tienen retrógrado

3. **Integración UI**
   - Sección "Partes Árabes"
   - Grid de 5+ tarjetas
   - Iconos: 💰 Fortuna, ✨ Espíritu, 💖 Amor, 💍 Matrimonio, 🎯 Profesión

**Entregables:**
- `src/services/arabicPartsCalculator.ts`
- UI con grid de partes
- Glosario explicativo

---

### **FASE 6: DECLINACIONES PARALELAS**
**Duración estimada:** 3-4 horas  
**Prioridad:** Baja-Media  
**Dependencias:** FASE 1-2

#### Tareas:
1. **Cálculo de declinaciones**
   - Convertir longitud eclíptica a declinación
   - Rango: -23.5° a +23.5° (oblicuidad de la eclíptica)

2. **Aspectos de declinación**
   - **Paralelo**: misma declinación (±1°)
   - **Contraparalelo**: declinaciones opuestas (±1°)

3. **Integración UI**
   - Nueva sección: "Declinaciones Paralelas"
   - Tabla con declinaciones de todos los cuerpos
   - Lista de paralelos y contraparalelos encontrados

**Entregables:**
- Funciones de cálculo de declinación
- Detección de paralelos
- UI con tabla y lista

---

### **FASE 7: POLARIZACIONES (Análisis Hemisférico)**
**Duración estimada:** 2-3 horas  
**Prioridad:** Baja  
**Dependencias:** FASE 1-3

#### Tareas:
1. **Análisis por hemisferios**
   - **Norte vs Sur** (casas 7-12 vs 1-6)
   - **Este vs Oeste** (casas 10-3 vs 4-9)
   - Contar planetas en cada hemisferio

2. **Polarizaciones de elementos**
   - Ya implementado en Fase 3 inicial (Polaridades)
   - Revisar si necesita ampliación

3. **Integración UI**
   - Sección "Hemisferios"
   - 2 StatCards: Norte/Sur, Este/Oeste
   - Interpretación básica

**Entregables:**
- Funciones de análisis hemisférico
- UI con StatCards
- Interpretaciones

---

## 🛠️ STACK TÉCNICO

### Bibliotecas necesarias:

1. **astronomy-engine** (actual):
   - ✅ Sol, Luna, Planetas clásicos
   - ❌ NO soporta asteroides nativamente
   - ❌ NO soporta Chiron, Lilith

2. **Swiss Ephemeris** (recomendado para fases avanzadas):
   - ✅ Soporta TODO (asteroides, Chiron, Lilith, nodos)
   - Opciones:
     - **swisseph.js** (WASM/JS wrapper)
     - **API externa** (ejemplo: astro-api.org)
   - Instalación: `npm install swisseph` o `npm install @astrodienst/swisseph`

3. **Alternativa: API externa**:
   - astro.com API
   - astro-seek.com API
   - Crear nuestra propia API con Python + pyswisseph

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── services/
│   ├── realAstroCalculator.ts          # ✅ Existente (Sol, Luna, Planetas, Casas)
│   ├── asteroidsCalculator.ts          # 🆕 FASE 1
│   ├── sensitivePointsCalculator.ts    # 🆕 FASE 2 (Chiron, Lilith)
│   ├── nodesCalculator.ts              # 🆕 FASE 3
│   ├── aspectsAdvancedCalculator.ts    # 🆕 FASE 4 (Quincunx, orbes)
│   ├── arabicPartsCalculator.ts        # 🆕 FASE 5
│   ├── declinationsCalculator.ts       # 🆕 FASE 6
│   └── hemisphereAnalyzer.ts           # 🆕 FASE 7
│
├── types/
│   ├── natalChart.ts                   # ✅ Existente
│   ├── asteroids.ts                    # 🆕 FASE 1
│   ├── sensitivePoints.ts              # 🆕 FASE 2
│   ├── nodes.ts                        # 🆕 FASE 3
│   ├── aspectsAdvanced.ts              # 🆕 FASE 4
│   ├── arabicParts.ts                  # 🆕 FASE 5
│   └── declinations.ts                 # 🆕 FASE 6
│
├── components/
│   ├── AsteroidCard.tsx                # 🆕 FASE 1
│   ├── SensitivePointCard.tsx          # 🆕 FASE 2
│   ├── NodesSection.tsx                # 🆕 FASE 3
│   ├── ArabicPartCard.tsx              # 🆕 FASE 5
│   └── DeclinationTable.tsx            # 🆕 FASE 6
│
└── pages/
    └── NatalChartPage.tsx              # 🔄 Actualizar en cada fase
```

---

## ⚙️ CONFIGURACIÓN (Settings)

Agregar opciones en `SettingsPage.tsx`:

```typescript
interface AstroSettings {
  // Existente
  houseSystem: 'placidus' | 'koch' | 'equal';
  
  // NUEVAS CONFIGURACIONES
  asteroids: {
    enabled: boolean;           // Mostrar/ocultar asteroides
    includeInAspects: boolean;  // Calcular aspectos con asteroides
  };
  
  lilith: {
    type: 'mean' | 'true';      // Tipo de Lilith a mostrar
  };
  
  nodes: {
    type: 'mean' | 'true';      // Tipo de nodos a mostrar
  };
  
  aspects: {
    orb: number;                // Orbe global (3-10°)
    showMinorAspects: boolean;  // Mostrar Quincunx
    includeAsteroids: boolean;  // Aspectos con asteroides
  };
  
  arabicParts: {
    enabled: boolean;           // Mostrar partes árabes
  };
  
  declinations: {
    enabled: boolean;           // Mostrar declinaciones
    parallelOrb: number;        // Orbe para paralelos (1°)
  };
}
```

---

## 🧪 TESTING

### Para cada fase:

1. **Casos de prueba**:
   - Fecha: 15 Marzo 1990, 14:30 UTC
   - Lugar: Buenos Aires (-34.6, -58.4)
   - Validar con: astro.com, astro-seek.com

2. **Validación de cálculos**:
   - Comparar con software profesional
   - Margen de error aceptable: ±1° para posiciones

3. **Testing de UI**:
   - Responsive (360px - 1920px)
   - Dark/Light mode
   - Performance (tiempo de cálculo < 2s)

---

## 📊 PRIORIZACIÓN RECOMENDADA

### 🔴 Prioridad Alta (Implementar primero):
1. **FASE 1**: Asteroides (impacto visual + demanda alta)
2. **FASE 2**: Chiron y Lilith (muy solicitados)
3. **FASE 4**: Aspectos ampliados (mejora cálculos existentes)

### 🟡 Prioridad Media (Implementar después):
4. **FASE 3**: Nodos Lunares
5. **FASE 5**: Partes Árabes

### 🟢 Prioridad Baja (Implementar al final):
6. **FASE 6**: Declinaciones Paralelas (técnica avanzada)
7. **FASE 7**: Polarizaciones (análisis complementario)

---

## 💰 ESTIMACIÓN TOTAL

- **Tiempo total**: 19-24 horas de desarrollo
- **Fases críticas**: 1, 2, 4 (11-14 horas)
- **Fases opcionales**: 5, 6, 7 (9-12 horas)

---

## 🚀 PRÓXIMOS PASOS

1. ✅ **Decisión**: ¿Empezamos con FASE 1 (Asteroides)?
2. 🔍 **Investigación**: Verificar soporte de astronomy-engine para asteroides
3. 📦 **Instalación**: Si es necesario, instalar Swiss Ephemeris
4. 💻 **Desarrollo**: Implementar según el plan

---

## 📝 NOTAS TÉCNICAS

### Limitaciones de astronomy-engine:
- Solo incluye: Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón
- NO incluye: Asteroides, Chiron, Lilith, Nodos exactos

### Soluciones propuestas:
1. **Opción A**: Instalar Swiss Ephemeris (más preciso)
2. **Opción B**: Usar API externa (más simple pero requiere internet)
3. **Opción C**: Aproximaciones matemáticas (menos preciso)

**Recomendación**: Swiss Ephemeris para máxima precisión y funcionalidad offline.

---

## 🎯 RESULTADO ESPERADO

Al completar todas las fases, la aplicación tendrá:

✅ 10 planetas clásicos  
✅ 4 asteroides (Ceres, Pallas, Juno, Vesta)  
✅ Chiron  
✅ Lilith (Mean y True)  
✅ Nodos Lunares (Mean y True)  
✅ 6 aspectos mayores + Quincunx  
✅ Partes Árabes  
✅ Declinaciones Paralelas  
✅ Análisis de Hemisferios  

**Total**: ~20 cuerpos celestes + técnicas avanzadas = Aplicación astrológica profesional 🌟

---

¿Empezamos con la **FASE 1: Asteroides**? 🚀
