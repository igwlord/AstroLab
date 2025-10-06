# 📋 PLAN DE REORGANIZACIÓN - Carta Natal

## 🎯 Objetivo
Reorganizar las secciones de NatalChartPage.tsx en el orden óptimo y agregar funcionalidades avanzadas.

---

## 📊 ORDEN ACTUAL (detectado)
1. **Planetas** (línea 359) 🪐
2. **Asteroides** (línea 588) ☄️
3. **Nodos Lunares** (línea 964) ☯️
4. **Puntos Sensibles** (línea ~750) 🔮
5. **Partes Árabes** (línea ~1119) 🌟
6. **Análisis de Hemisferios** (línea 1371) 🧭
7. **Casas** (línea 1623) 🏠
8. **Aspectos** (línea 1800) ⚡
9. **Modalidades** (línea 1947) ⚡
10. **Elementos** (línea 1982) 🌍
11. **Polaridades** (línea 2026) ☯️
12. **Cuadrantes** (línea 2052) 🧭

---

## ✅ NUEVO ORDEN PROPUESTO

### 1️⃣ CASAS (12) 🏠
- **Ubicación**: Primera sección
- **Incluye**: ASC y MC dentro de la misma sección
- **Razón**: Dan el mapa de áreas de vida primero

### 2️⃣ PLANETAS (10) 🪐
- **Ubicación**: Segunda sección
- **Razón**: "Quiénes actúan" en esas áreas

### 3️⃣ ASPECTOS (21+) ⚡
- **Ubicación**: Tercera sección
- **Razón**: Cómo interactúan los planetas entre sí
- **Mejora**: Alertas de orbes exactos (<1°)

### 4️⃣ NODOS LUNARES (2) ☯️
- **Ubicación**: Cuarta sección
- **Razón**: Eje evolutivo kármico

### 5️⃣ PUNTOS SENSIBLES (2-3) 🔮
- **Ubicación**: Quinta sección
- **Incluye**: Chiron, Lilith Media, Lilith Verdadera, Fortuna, Vértice
- **Razón**: Focos finos y específicos

### 6️⃣ ASTEROIDES (4) ☄️
- **Ubicación**: Sexta sección
- **Incluye**: Ceres, Pallas, Juno, Vesta
- **Razón**: Complementos opcionales

### 7️⃣ PARTES ÁRABES (7) 🌟
- **Ubicación**: Séptima sección
- **Incluye**: Los 7 lotes principales
- **Razón**: Lotes derivados matemáticamente

### 8️⃣ SÍNTESIS (1 acordeón agrupado) 📊
- **Ubicación**: Última sección
- **Contenido agrupado**:
  - Elementos (4) 🌍
  - Modalidades (3) ⚡
  - Polaridades (2) ☯️
  - Cuadrantes (4) 🧭
  - Análisis de Hemisferios (4) 🧭
- **Razón**: Vista holística al final

---

## 🔧 FASES DE IMPLEMENTACIÓN

### FASE A: Reorganización del orden
- A.1: Mover Casas al principio (incluir ASC/MC)
- A.2: Mantener Planetas en posición 2
- A.3: Mover Aspectos a posición 3
- A.4: Mover Nodos Lunares a posición 4
- A.5: Mover Puntos Sensibles a posición 5
- A.6: Mantener Asteroides en posición 6
- A.7: Mantener Partes Árabes en posición 7
- A.8: Agrupar síntesis al final

### FASE B: Sistema de Pins
- B.1: Crear estado para secciones ancladas (max 3)
- B.2: Agregar botón de pin en cada AccordionSection
- B.3: Renderizar secciones ancladas al inicio
- B.4: Guardar en localStorage
- B.5: Indicador visual de secciones ancladas

### FASE C: Badges y Estado Persistente
- C.1: Badges con alertas de orbes exactos en Aspectos
- C.2: localStorage para recordar acordeones abiertos
- C.3: Contador mejorado en cada sección
- C.4: Animaciones de entrada suaves

---

## 📝 NOTAS TÉCNICAS

### Secciones que incluyen datos del Sol, Luna, Ascendente:
- Actualmente están en un div antes de Planetas
- Se mantendrán en esa posición (después del formulario, antes de las secciones)

### Estructura del acordeón de Síntesis:
```tsx
<AccordionSection title="Síntesis de la Carta" icon="📊" count={5}>
  {/* Sub-acordeones internos */}
  <AccordionSection title="Elementos" ... />
  <AccordionSection title="Modalidades" ... />
  <AccordionSection title="Polaridades" ... />
  <AccordionSection title="Cuadrantes" ... />
  <AccordionSection title="Hemisferios" ... />
</AccordionSection>
```

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Todas las secciones en nuevo orden
- [ ] ASC/MC dentro de Casas
- [ ] Síntesis agrupada funcionando
- [ ] Build sin errores
- [ ] Responsive en móvil/tablet/desktop
- [ ] No se perdió ninguna funcionalidad
- [ ] Commit independiente por fase
