# 📋 Resumen de Auditoría de Limpieza

**Fecha**: 5 de Octubre 2025  
**Proyecto**: AstroLab Zodioteca  
**Estado actual**: 15,832 líneas de código TypeScript/TSX

---

## 🎯 Hallazgos Principales

### ❌ Archivos Obsoletos (3)
- `NatalChartPage.OLD.tsx` (814 líneas) - Versión antigua
- `NewNatalChartPage.tsx` (266 líneas) - Página experimental sin usar
- `astroCalculator.ts` (133 líneas) - Servicio obsoleto con datos hardcodeados

### ⚠️ Páginas de Test en Producción (12)
Todas accesibles públicamente en `/test/*`:
- TestSignsPage, TestPlanetsPage, TestHousesPage, TestAspectsPage
- TestMoonsPage, TestAscendantsPage, TestAsteroidsPage, TestCelestialPage
- TestConfigurationsPage, TestRelationalPage, TestDignitiesPage, TestPolarizationsPage

### 📦 Dependencia Pesada
- `astronomia` (4.2.0) - Solo usada para 1 función (cálculo Día Juliano)
- Impacto: ~500KB en bundle
- Alternativa: Implementar cálculo manual (15 líneas)

---

## 💡 Impacto Total

| Categoría | Archivos | Líneas | Bundle | Rutas |
|-----------|----------|--------|--------|-------|
| Obsoletos | 3 | -1,213 | -50KB | 0 |
| Test Pages | 12 | -1,200 | -80KB | -12 |
| Dependencias | 1 | 0 | -500KB | 0 |
| **TOTAL** | **16** | **-2,413** | **-630KB** | **-12** |

**Reducción**: ~15% del código actual (de 15,832 a 13,419 líneas)

---

## 🚀 Ejecución

### Opción A: Scripts Automatizados (Recomendado)

```powershell
# FASE 1: Eliminar archivos obsoletos (CRÍTICO)
.\scripts\cleanup-phase1.ps1

# FASE 2: Eliminar páginas de test (ALTA PRIORIDAD)
.\scripts\cleanup-phase2.ps1
```

### Opción B: Manual

```bash
# Eliminar obsoletos
git rm src/pages/NatalChartPage.OLD.tsx
git rm src/pages/NewNatalChartPage.tsx
git rm src/services/astroCalculator.ts

# Eliminar test pages
git rm src/pages/Test*.tsx

# Actualizar App.tsx manualmente
# (Eliminar imports y rutas de Test pages)
```

---

## ⚠️ Precauciones

**ANTES de ejecutar**:
1. ✅ Commit actual del proyecto
2. ✅ Backup de `src/App.tsx`
3. ✅ Verificar que `useSavedCharts.ts` use `realAstroCalculator`

**DESPUÉS de ejecutar**:
1. ✅ `npm run build` - Verificar compilación
2. ✅ `npm run dev` - Probar en local
3. ✅ Verificar rutas principales funcionan
4. ✅ Confirmar que `/test/*` da 404 (esperado)

---

## 📊 Archivos Afectados

### Se Eliminarán:
```
src/pages/NatalChartPage.OLD.tsx
src/pages/NewNatalChartPage.tsx
src/pages/Test*.tsx (12 archivos)
src/services/astroCalculator.ts
```

### Se Modificarán:
```
src/App.tsx (eliminar imports y rutas de Test pages)
```

### Posible Corrección Necesaria:
```typescript
// src/store/useSavedCharts.ts (línea 3)
// CAMBIAR:
import type { NatalChart } from '../services/astroCalculator';
// POR:
import type { NatalChart } from '../services/realAstroCalculator';
```

---

## 📝 Documentos Relacionados

- [Auditoría Completa](AUDITORIA_LIMPIEZA.md) - Análisis detallado
- [Script Fase 1](scripts/cleanup-phase1.ps1) - Eliminación de obsoletos
- [Script Fase 2](scripts/cleanup-phase2.ps1) - Eliminación de test pages

---

## ✅ Checklist de Ejecución

### Fase 1 (Crítica)
- [ ] Hacer commit actual
- [ ] Ejecutar `cleanup-phase1.ps1`
- [ ] Corregir import en `useSavedCharts.ts` si es necesario
- [ ] `npm run build` - Verificar
- [ ] Commit: `🧹 chore: Eliminar archivos obsoletos (Fase 1)`

### Fase 2 (Alta Prioridad)
- [ ] Ejecutar `cleanup-phase2.ps1`
- [ ] Revisar cambios en `App.tsx`
- [ ] `npm run build` - Verificar
- [ ] `npm run dev` - Probar local
- [ ] Verificar rutas principales
- [ ] Commit: `🧹 chore: Eliminar páginas de test (Fase 2)`
- [ ] `git push origin main` - Deploy a Netlify

### Fase 3 (Opcional - Próxima iteración)
- [ ] Reemplazar `astronomia` con función propia
- [ ] Agregar `dev-dist/` a `.gitignore`
- [ ] Centralizar servicios de ubicación

---

**Estado**: ⏳ Pendiente de ejecución  
**Aprobado por**: _Pendiente_
