# 📋 BACKLOG - AstroLab

## Pendientes Técnicos (TODOs encontrados)

### 🔴 CRÍTICOS (Afectan funcionalidad)

#### 1. Sistema de Timezone Real
**Archivo:** `src/services/locationService.ts`
- **Línea 20:** TODO: Reemplazar con servicio real
- **Línea 159:** TODO: Usar servicio real como timezonedb.com o similar
- **Descripción:** Actualmente usa valores hardcodeados. Necesita integración con API real.
- **Impacto:** Cálculos de carta natal pueden ser inexactos
- **Prioridad:** 🔴 ALTA
- **Tiempo estimado:** 4-6 horas
- **Solución propuesta:**
  - Integrar con [TimeZone API](https://timezonedb.com/) o similar
  - Usar Google Maps Timezone API como alternativa
  - Implementar cache local para ciudades frecuentes

#### 2. Sistema de Casas Múltiples
**Archivo:** `src/services/realAstroCalculator.ts`
- **Línea 227:** TODO: Implementar diferentes sistemas de casas
- **Descripción:** Solo soporta Placidus actualmente
- **Impacto:** Falta de flexibilidad para usuarios avanzados
- **Prioridad:** 🟡 MEDIA
- **Tiempo estimado:** 8-12 horas
- **Sistemas a implementar:**
  - Placidus (actual) ✅
  - Koch
  - Porphyry
  - Whole Sign
  - Equal House
  - Campanus

#### 3. Timezone en Cálculo de Aspectos
**Archivo:** `src/services/realAstroCalculator.ts`
- **Línea 492:** TODO: usar timezone real
- **Descripción:** Aspectos se calculan en UTC en lugar de timezone local
- **Impacto:** Puede afectar precisión de aspectos transitorios
- **Prioridad:** 🟡 MEDIA
- **Tiempo estimado:** 2-3 horas

---

### 🟢 MEJORAS UI/UX

#### 4. Reorganización de Casas en UI
**Archivo:** `src/pages/NatalChartPage.tsx`
- **Línea 639:** TODO: Mover sección de Casas aquí
- **Descripción:** Sección de Casas debería estar en otra ubicación del layout
- **Impacto:** Mejora de organización visual
- **Prioridad:** 🟢 BAJA
- **Tiempo estimado:** 1-2 horas

---

## 📊 Resumen

| Prioridad | Cantidad | Tiempo Total Estimado |
|-----------|----------|----------------------|
| 🔴 ALTA   | 1        | 4-6 horas            |
| 🟡 MEDIA  | 2        | 10-15 horas          |
| 🟢 BAJA   | 1        | 1-2 horas            |
| **TOTAL** | **4**    | **15-23 horas**      |

---

## 🎯 Plan de Implementación Recomendado

### Fase 1: Funcionalidad Crítica (1 semana)
- [ ] **Task 1.1:** Integrar TimeZone API real
- [ ] **Task 1.2:** Implementar cache de timezones
- [ ] **Task 1.3:** Agregar fallback a timezone del navegador
- [ ] **Task 1.4:** Testing con diferentes ubicaciones

### Fase 2: Funcionalidad Avanzada (1-2 semanas)
- [ ] **Task 2.1:** Implementar sistema de casas Koch
- [ ] **Task 2.2:** Implementar sistema de casas Whole Sign
- [ ] **Task 2.3:** Agregar selector de sistema en configuración
- [ ] **Task 2.4:** Usar timezone real en cálculo de aspectos
- [ ] **Task 2.5:** Testing de precisión de cálculos

### Fase 3: UI/UX Refinements (3-5 días)
- [ ] **Task 3.1:** Reorganizar layout de Casas
- [ ] **Task 3.2:** A/B testing con usuarios
- [ ] **Task 3.3:** Ajustes finales de diseño

---

## 📝 Notas de Desarrollo

### APIs Recomendadas

**Timezone Detection:**
```bash
# TimeZone DB (12,000 requests/month gratis)
https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_KEY&format=json&by=position&lat=40.689247&lng=-74.044502

# Google Maps Time Zone API
https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=YOUR_API_KEY
```

**Sistemas de Casas:**
- Swiss Ephemeris soporta los 6 sistemas principales
- Implementar con `swisseph.calc_houses()`
- Documentación: https://www.astro.com/swisseph/

---

## 🔄 Changelog de Limpiezas (Fase 1 - Completado)

### ✅ Completado en Fase 1 de Limpieza

1. **Console.log Eliminados** (25 instancias)
   - Reemplazados por sistema `logger` configurado
   - Solo debug logs en desarrollo
   - Errors siempre visibles para diagnóstico

2. **Archivos Legacy Eliminados**
   - ❌ GoogleDriveContext_OLD.tsx (ya eliminado)
   - ❌ NatalChartForm.tsx (1137 líneas, reemplazado por NatalChartFormSimple)
   - **Ahorro:** ~1,500 líneas de código

3. **Dependencias Sin Uso Eliminadas** (9 paquetes)
   ```
   - @dataconnect/generated
   - @react-oauth/google
   - date-fns-tz
   - i18next
   - react-i18next
   - react-markdown
   - @testing-library/jest-dom
   - @testing-library/react
   - @testing-library/user-event
   ```
   - **Ahorro:** 178 paquetes npm
   - **Reducción:** ~50 MB en node_modules

4. **Logger Optimizado**
   - ✅ Sistema ya estaba correctamente configurado
   - Usa `import.meta.env.DEV` para detectar entorno
   - Debug/log/info solo en desarrollo
   - Errors siempre activos

---

## 🚀 Próximos Pasos

Después de completar el BACKLOG actual:

1. **Testing Suite** (Prioridad: 🔴 CRÍTICA)
   - Crear tests unitarios para calculadores
   - Tests de integración para formularios
   - E2E tests para flujos principales
   - Target: 60%+ coverage

2. **Performance Optimization**
   - Lazy loading de jsPDF (401 KB)
   - Code splitting de grids del glosario
   - Optimización de Swiss Ephemeris (12 MB)

3. **Accessibility**
   - Agregar aria-labels faltantes
   - Mejorar contraste de colores
   - Keyboard navigation completa

---

**Última actualización:** Fase 1 de Limpieza completada
**Creado por:** Auditoría Exhaustiva 2025
**Estado del proyecto:** 🟢 Saludable (después de limpieza)
