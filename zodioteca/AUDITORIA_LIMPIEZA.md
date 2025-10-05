# 🧹 Auditoría de Limpieza del Proyecto AstroLab

**Fecha**: 5 de Octubre 2025  
**Estado**: Producción Activa (Netlify)

---

## 📊 Resumen Ejecutivo

### Archivos Totales Analizados: 220
### Categorías de Limpieza Identificadas:

1. **🗑️ CRÍTICO - Archivos Obsoletos**: 3 archivos
2. **⚠️ ALTO - Páginas de Test en Producción**: 12 páginas
3. **🔄 MEDIO - Código Duplicado**: 2 servicios
4. **📦 MEDIO - Dependencias Sin Usar**: 1 dependencia
5. **💡 BAJO - Mejoras de Organización**: Varias

---

## 🗑️ CRÍTICO - Archivos Obsoletos (Eliminar YA)

### 1. `src/pages/NatalChartPage.OLD.tsx` (814 líneas)
**Estado**: ❌ OBSOLETO - Versión antigua de NatalChartPage  
**Impacto**: 814 líneas de código muerto  
**Acción**: ELIMINAR

```typescript
// Usa el servicio antiguo (astroCalculator.ts)
import { calculateNatalChart } from '../services/astroCalculator';
```

**Motivo**: Ya existe `NatalChartPage.tsx` actualizado que usa `realAstroCalculator.ts` con Swiss Ephemeris.

---

### 2. `src/pages/NewNatalChartPage.tsx` (266 líneas)
**Estado**: ❌ OBSOLETO - Página experimental  
**Impacto**: No está en las rutas de App.tsx  
**Acción**: ELIMINAR

```typescript
// También usa el servicio antiguo
import { calculateNatalChart } from '../services/astroCalculator';
```

**Motivo**: No está registrada en `App.tsx`, nunca se usa.

---

### 3. `src/services/astroCalculator.ts` (133 líneas)
**Estado**: ❌ OBSOLETO - Servicio antiguo con datos hardcodeados  
**Impacto**: Cálculos falsos, solo funciona con datos de ejemplo  
**Acción**: ELIMINAR

```typescript
// Código hardcodeado para una carta específica
const isTestData = 
  birthDate.getUTCFullYear() === 1988 &&
  birthDate.getUTCMonth() === 9 &&
  birthDate.getUTCDate() === 16;

if (isTestData) {
  // Retorna datos fijos...
}

throw new Error('El cálculo astronómico está en desarrollo.');
```

**Motivo**: Ya existe `realAstroCalculator.ts` con Swiss Ephemeris WASM (precisión quirúrgica).

---

## ⚠️ ALTO - Páginas de Test en Producción (12 páginas)

### Problema
Las páginas de prueba del glosario están **activas en producción** y accesibles públicamente:

```
https://astrolab-web.netlify.app/test/signs
https://astrolab-web.netlify.app/test/planets
https://astrolab-web.netlify.app/test/houses
... (9 más)
```

### Lista Completa de Páginas Test:
1. `TestSignsPage.tsx` - Test de signos zodiacales
2. `TestPlanetsPage.tsx` - Test de planetas
3. `TestHousesPage.tsx` - Test de casas
4. `TestAspectsPage.tsx` - Test de aspectos
5. `TestMoonsPage.tsx` - Test de signos lunares
6. `TestAscendantsPage.tsx` - Test de ascendentes
7. `TestAsteroidsPage.tsx` - Test de asteroides
8. `TestCelestialPage.tsx` - Test de cuerpos celestes
9. `TestConfigurationsPage.tsx` - Test de configuraciones
10. `TestRelationalPage.tsx` - Test de elementos relacionales
11. `TestDignitiesPage.tsx` - Test de dignidades
12. `TestPolarizationsPage.tsx` - Test de polarizaciones

### Registradas en App.tsx:
```typescript
// Lines 12-23
import TestSignsPage from './pages/TestSignsPage';
import TestPlanetsPage from './pages/TestPlanetsPage';
// ... todas registradas

// Lines 109-188
<Route path="/test/signs" element={<ProtectedRoute><TestSignsPage /></ProtectedRoute>} />
<Route path="/test/planets" element={<ProtectedRoute><TestPlanetsPage /></ProtectedRoute>} />
// ... todas con rutas activas
```

### Opciones:

#### Opción A: ELIMINAR TODO (Recomendado para producción)
**Impacto**: ~1,200 líneas eliminadas  
**Beneficio**: 
- Build más ligero
- Menos rutas en producción
- Código más limpio

#### Opción B: MOVER A AMBIENTE DE DESARROLLO
Usar variable de entorno para ocultar en producción:

```typescript
// App.tsx
const isDev = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_PAGES === 'true';

{isDev && (
  <>
    <Route path="/test/signs" element={<TestSignsPage />} />
    {/* ... otras rutas test */}
  </>
)}
```

#### Opción C: FEATURE FLAG
Activar solo para usuarios admin o con query param `?debug=true`.

### Recomendación
**OPCIÓN A** - Eliminar todo. El glosario ya está integrado en `/glossary` de forma profesional.

---

## 🔄 MEDIO - Código Duplicado

### 1. `chartCalculator.ts` vs `realAstroCalculator.ts`
**Problema**: Funciones de ubicación duplicadas.

```typescript
// chartCalculator.ts exporta:
export { getCountries, getProvinces, getCities, getNeighborhoods, findLocation }

// Pero realAstroCalculator.ts tiene su propia lógica
```

**Acción**: Centralizar ubicaciones en `locationService.ts` (ya existe).

---

### 2. Tipos de NatalChart duplicados

**Archivo 1**: `src/services/astroCalculator.ts`
```typescript
export interface NatalChart {
  date: Date;
  location: string;
  // ...
}
```

**Archivo 2**: `src/services/realAstroCalculator.ts`
```typescript
export interface NatalChart {
  // Versión más completa
  statistics: ChartStatistics;
  swissEphemerisData: { /* ... */ };
  // ...
}
```

**Acción**: Eliminar `astroCalculator.ts` resuelve esto.

---

## 📦 MEDIO - Dependencias Sin Usar

### `astronomia` (4.2.0)
**Usado en**: Solo `swissEphemerisCalculator.ts` para cálculo de Día Juliano.

```typescript
// swissEphemerisCalculator.ts, línea 10
import { julian } from 'astronomia';

// Único uso:
const jd = julian.CalendarGregorianToJD(year, month, day) + dayFraction;
```

**Problema**: Librería pesada (incluye todo el catálogo de estrellas) para un solo cálculo.

**Alternativa**: Implementar cálculo de Día Juliano manualmente (15 líneas):

```typescript
function calculateJulianDay(year: number, month: number, day: number, hour: number = 12): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  const JD = Math.floor(365.25 * (year + 4716)) +
             Math.floor(30.6001 * (month + 1)) +
             day + B - 1524.5 +
             (hour / 24);
  
  return JD;
}
```

**Impacto**: ~500KB menos en el bundle.

---

## 💡 BAJO - Mejoras de Organización

### 1. Archivos de configuración duplicados

```
public/_headers    ← Copiado a dist/
public/_redirects  ← Copiado a dist/
netlify.toml       ← Configuración principal
```

**OK**: Esta duplicación es necesaria para Netlify.

---

### 2. TODOs pendientes

**locationService.ts**:
```typescript
// Line 20
// TODO: Reemplazar con servicio real

// Line 159
// TODO: Usar servicio real como timezonedb.com o similar
```

**realAstroCalculator.ts**:
```typescript
// Line 225
// TODO: Implementar diferentes sistemas de casas

// Line 373
timezone: 'UTC', // TODO: usar timezone real
```

**Acción**: Crear issues en GitHub para seguimiento.

---

### 3. Archivos de build generados

```
dev-dist/
  workbox-a959eb95.js
  sw.js
  registerSW.js
```

**OK**: Estos son generados por Vite PWA, deben estar en `.gitignore`.

**Verificar**: ¿Están en `.gitignore`?

---

## 📋 Plan de Acción Recomendado

### Fase 1: Crítica (Ejecutar HOY) ⚡

```bash
# 1. Eliminar archivos obsoletos
git rm src/pages/NatalChartPage.OLD.tsx
git rm src/pages/NewNatalChartPage.tsx
git rm src/services/astroCalculator.ts

# 2. Actualizar imports rotos (si hay)
# Verificar en store/useSavedCharts.ts
```

**Impacto**: -1,213 líneas de código muerto  
**Riesgo**: Bajo (archivos no usados)

---

### Fase 2: Alta Prioridad (Esta semana) 📅

```bash
# Eliminar páginas de test
git rm src/pages/Test*.tsx  # 12 archivos

# Actualizar App.tsx
# Eliminar imports y rutas de TestPages (líneas 12-23, 109-188)
```

**Impacto**: -1,200 líneas adicionales  
**Riesgo**: Bajo (solo test, no afecta producción)

---

### Fase 3: Optimización (Próxima iteración) 🔧

1. **Eliminar `astronomia` y usar cálculo manual**
   - Reemplazar en `swissEphemerisCalculator.ts`
   - Bundle: -500KB

2. **Centralizar servicios de ubicación**
   - Unificar en `locationService.ts`
   - Eliminar duplicados

3. **Agregar `.gitignore` para `dev-dist/`**
   ```gitignore
   # Service Worker build artifacts
   dev-dist/
   ```

---

## 📊 Impacto Total Estimado

| Categoría | Archivos | Líneas | Bundle | Rutas |
|-----------|----------|--------|--------|-------|
| **Obsoletos** | 3 | -1,213 | -50KB | 0 |
| **Test Pages** | 12 | -1,200 | -80KB | -12 |
| **Dependencias** | 1 | 0 | -500KB | 0 |
| **TOTAL** | **16** | **-2,413** | **-630KB** | **-12** |

---

## 🎯 Prioridades por Impacto

### 🔴 Crítico (HOY)
- [ ] Eliminar `NatalChartPage.OLD.tsx`
- [ ] Eliminar `NewNatalChartPage.tsx`
- [ ] Eliminar `astroCalculator.ts`

### 🟡 Alto (Esta Semana)
- [ ] Eliminar 12 páginas Test
- [ ] Limpiar rutas en `App.tsx`

### 🟢 Medio (Próxima Iteración)
- [ ] Reemplazar `astronomia` con función propia
- [ ] Centralizar servicios de ubicación
- [ ] Agregar `dev-dist/` a `.gitignore`

### 🔵 Bajo (Backlog)
- [ ] Resolver TODOs pendientes
- [ ] Documentar decisiones de arquitectura

---

## ⚠️ Advertencias

### NO ELIMINAR:
- ❌ `src/services/realAstroCalculator.ts` - En uso activo
- ❌ `src/services/swissEphemerisCalculator.ts` - Motor principal
- ❌ `netlify.toml` - Configuración de producción
- ❌ `vite.config.ts` - Fix crítico para WASM

### PRECAUCIÓN:
- ⚠️ Verificar que `useSavedCharts.ts` no importe de `astroCalculator.ts`
- ⚠️ Buscar referencias a páginas Test en otros lugares
- ⚠️ Hacer commit antes de eliminar archivos

---

## 🔍 Comandos de Verificación

```bash
# Verificar imports de archivos a eliminar
grep -r "astroCalculator" src/
grep -r "NatalChartPage.OLD" src/
grep -r "NewNatalChartPage" src/

# Verificar uso de astronomia
grep -r "from 'astronomia'" src/

# Listar páginas Test
ls src/pages/Test*.tsx

# Contar líneas totales
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

---

## 📝 Próximos Pasos

1. ✅ **Revisar este documento** con el equipo
2. ⏳ **Aprobar Fase 1** (eliminación de obsoletos)
3. ⏳ **Ejecutar limpieza** siguiendo el plan
4. ⏳ **Testing en Netlify** después de cada fase
5. ⏳ **Actualizar documentación** (README, etc.)

---

**Creado por**: GitHub Copilot  
**Revisado por**: _Pendiente_  
**Aprobado por**: _Pendiente_
