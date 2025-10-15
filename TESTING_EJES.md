# 🧪 PLAN DE TESTING - Sistema de Ejes Arquetípicos

## Carta de Prueba
- **Fecha**: 16 de julio de 1992
- **Hora**: 10:20 AM
- **Lugar**: Buenos Aires, Argentina

## ✅ Checklist de Validaciones

### 1. Backend - identifyKeyAxes()
- [ ] La función detecta aspectos entre planetas correctamente
- [ ] El scoring calcula valores 0-20 puntos
- [ ] El baseWeight multiplica correctamente (×1.0, ×1.3, ×1.5)
- [ ] Se retornan exactamente 6 ejes (top 6)
- [ ] Los ejes están ordenados por score descendente
- [ ] Los logs muestran la información completa

### 2. UI - Tab de Ejes
- [ ] El tab "Ejes" aparece con ícono ⚖️
- [ ] El contador muestra el número correcto (6 ejes)
- [ ] Al hacer click en "Ejes" se muestran solo las cards de ejes
- [ ] Las cards de ejes tienen diseño correcto

### 3. UI - Cards de Ejes (AxisAnalysisCard)
- [ ] Cada card muestra:
  - [ ] Emoji de categoría (👑 🌊 ⚡ ✨)
  - [ ] Símbolos de planetas (☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇)
  - [ ] Símbolo de aspecto (☌ ☍ □ △ ✶)
  - [ ] Título del eje (ej: "Autoridad")
  - [ ] Badge de urgencia (Crítico/Trabajar/Observar)
  - [ ] Descripción breve
  - [ ] Orbe en grados
  - [ ] Casas involucradas
  - [ ] Score /20
- [ ] Hover effect funciona (card se eleva)
- [ ] Click abre el modal correspondiente

### 4. UI - Modal de Ejes (AxisAnalysisModal)
- [ ] Modal se abre correctamente al hacer click
- [ ] Header muestra toda la información
- [ ] Sección "¿Por qué importa?" tiene 4 puntos
- [ ] Sección "Ejercicios prácticos" tiene 3+ ejercicios
- [ ] Sección "Urgencia" muestra nivel correcto
- [ ] Sección "Detalles técnicos" muestra grid 2×2
- [ ] Botón X cierra el modal
- [ ] Click fuera del modal lo cierra

### 5. Búsqueda
- [ ] Buscar "autoridad" filtra ejes correctamente
- [ ] Buscar "sol" muestra ejes con Sol
- [ ] Buscar "saturno" muestra ejes con Saturno
- [ ] Buscar "poder" muestra ejes relacionados
- [ ] La búsqueda funciona con tabs combinados

### 6. Filtros y Contadores
- [ ] Tab "Todos" muestra planetas + ejes (12 + 6 = 18)
- [ ] Tab "Planetas" muestra solo planetas (12)
- [ ] Tab "Puntos" muestra solo puntos (0 en este caso)
- [ ] Tab "Ejes" muestra solo ejes (6)
- [ ] Contador inferior es correcto
- [ ] Empty state funciona correctamente

### 7. Ejes Esperados para la Carta de Euge

Basándonos en la configuración natal (16/7/1992, Buenos Aires):
- Sol en Cáncer Casa 11
- Luna en Acuario Casa 6
- Saturno en Acuario Casa 6 Rx
- Neptuno en Capricornio Casa 5 Rx
- Plutón en Escorpio Casa 2 Rx

**Ejes probables de alto score**:
1. **Luna-Saturno** (Seguridad Emocional) - Ambos en Acuario Casa 6 → Conjunción muy cercana → Score alto
2. **Luna-Neptuno** (Sensibilidad) - Trígono Acuario-Capricornio → Score medio-alto
3. **Sol-Saturno** (Autoridad) - Cáncer-Acuario → Aspectos tensos posibles
4. **Sol-Plutón** (Poder Personal) - Cáncer-Escorpio → Trígono agua
5. **Luna-Plutón** (Intensidad Emocional) - Acuario-Escorpio → Cuadratura
6. Otros según aspectos exactos

## 📊 Logs a Verificar

En la consola del navegador deberías ver:

```
⚖️ [identifyKeyAxes] Iniciando análisis de ejes
⚖️ [identifyKeyAxes] Ascendente: Virgo
⚖️ [identifyKeyAxes] Total aspectos en carta: X
⚖️ [identifyKeyAxes] ✅ Autoridad: Sun-Saturn opposition (orb: X°) → score: X × 1.5 = X
⚖️ [identifyKeyAxes] ✅ Sensibilidad: Moon-Neptune trine (orb: X°) → score: X × 1.5 = X
...
⚖️ [identifyKeyAxes] Total ejes encontrados: X
⚖️ [identifyKeyAxes] Top 6 ejes seleccionados:
  1. [Tema] (Planeta1-Planeta2) - Score: X
  2. ...
```

## 🎯 Criterios de Éxito

✅ **ÉXITO TOTAL** si:
- Se detectan 6 ejes correctamente
- Los scores tienen sentido (más aspectos tensos = mayor score)
- La UI muestra toda la información correctamente
- El modal tiene contenido completo
- La búsqueda funciona
- No hay errores en consola

⚠️ **ÉXITO PARCIAL** si:
- Se detectan ejes pero menos de 6
- Algunos scores son 0 o muy bajos
- Hay warnings menores en consola

❌ **FALLO** si:
- No se detectan ejes (axes = [])
- Errores TypeScript en consola
- La UI no renderiza
- El modal no abre

## 🚀 Pasos de Testing

1. Ir a http://localhost:5174
2. Calcular carta para Euge (16/7/1992, 10:20, Buenos Aires)
3. Ir a "Análisis" → "Tu Carta"
4. Verificar que aparece el tab "Ejes" ⚖️
5. Abrir la consola del navegador (F12)
6. Buscar los logs de `[identifyKeyAxes]`
7. Click en tab "Ejes"
8. Verificar que aparecen 6 cards
9. Click en una card → verificar modal
10. Probar búsqueda
11. Probar navegación entre tabs
12. Documentar resultados

## 📝 Notas

- Si no aparecen ejes, revisar que `chart.aspects` tenga datos
- Si los scores son todos bajos, verificar el cálculo de `scoreAxis()`
- Si falta el Ascendente, el cálculo de tensión elemental no funcionará pero el resto sí

---

**Fecha de Testing**: ${new Date().toLocaleDateString('es-ES')}
**Versión**: Sistema de Ejes v1.0.0
**Tester**: Automatizado
