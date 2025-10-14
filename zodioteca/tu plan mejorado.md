# Prompt para la IA de VS (usa esto pegado tal cual en tu asistente de VS/CoPilot/GitHub Copilot Chat)

**Contexto breve (pegar al comienzo):**
Proyecto: **AstroLab / **. Módulo: Planes de Ejercicios Holísticos (21 días). Ya hay un generador (services/exercises/planGenerator.ts) que usa `chartAnalyzer.ts` para medir `moon.stressScore`. Se refactorizó UI de modales a páginas (`/ejercicios/tu-carta`, `/ejercicios/guia`, `/saved-plans`) pero persisten bugs funcionales y de UX: *stress lunar = 0*, contenido repetido, problemas de scroll/header, padding tapado por navbar, y comportamientos inesperados en Reflexiones. Debes implementar mejoras técnicas + UX + tests + mensajes de log, y dejar todo listo para PR.

---

## Objetivo general

1. Corregir bug que hace que `analysis.moon.stressScore` devuelva siempre `0`.
2. Asegurar que el plan sea verdaderamente personalizado (explicación detallada *por qué* se eligió cada ejercicio).
3. Mejorar/armonizar la UI: eliminar duplicados, arreglar scroll, padding y header, asegurar accesibilidad y responsive.
4. Refactorizar/limpiar código relacionado (logs claros, validaciones y tests unitarios).
5. Entregar PR listo, con instrucciones para QA y verificación manual.

---

## Entregables esperados

* Código corregido en: `src/services/exercises/chartAnalyzer.ts`, `src/services/exercises/planGenerator.ts`, `src/store/useExercisePlanStore.ts`, `src/pages/ExercisePlanPage.tsx`, `src/pages/ExerciseChartPage.tsx`, `src/pages/ExerciseGuidePage.tsx`, `src/pages/ReflexPage.tsx`, y cualquier componente que quede referido (`ExercisePlanInsightsModal.tsx` si aún existe).
* Tests unitarios para `analyzeChart()` y `generateExercisePlan()` (ej. Jest).
* Mensajes de log claros y trazables (uso de `logger.log/warn/error`).
* PR description + checklist de QA + pasos para reproducir.
* Un pequeño README/NOTES con endpoints/rutas y cómo verificar localmente.

---

## Reglas y restricciones

* No cambiar la API pública del store (signature de `generatePlan(chart)` y store actions).
* Mantener backward compatibility del formato `ExercisePlan`.
* No eliminar funcionalidades esotéricas (geometrías, chakras) — sólo asegurarse que se calculen correctamente.
* Todas las modificaciones deben incluir tests unitarios o, si no es posible, *integration tests* simulando flow de generación.

---

## Tareas técnicas (detalladas — ejecuta en este orden)

### 1) Debug & Fix — `chartAnalyzer.ts`

* Revisa la función que calcula `moon.stressScore`.
* Añade validaciones: si no hay aspectos, no asumir 0; en su lugar, computar a partir de:

  * número y peso de aspectos tensos vs armónicos (por ejemplo, aspectAngle <= 10° con órbita y tipo de aspecto)
  * dignidad lunar (domicilio/exilio/detrimento/face)
  * casa de la Luna (casas relacionadas con emociones aumentan peso)
* Implementa cálculo con pasos intermedios y return de estructura:

  ```ts
  interface MoonAnalysis {
    stressScore: number; // 0..10, float con 1 decimal
    aspectsCount: { tense: number; harmonious: number };
    dignity: string; // 'domicile'|'detriment'|'exalted'|'fall'|'neutral'
    debug?: { reasons: string[]; rawValues: Record<string, number> };
  }
  ```
* Añade logging detallado: `logger.log('moon stress calc', { ... })`.
* Escribe tests que:

  * Caso A: Luna sin aspectos -> el stressScore se base en dignidad y casa.
  * Caso B: Luna con 3 aspectos tensos -> stressScore >= 6.
  * Caso C: Luna con 4 aspectos armónicos -> stressScore <= 3.

### 2) Validación y fallback — `validateAndNormalize()` y `planGenerator.ts`

* En `validateAndNormalize()` asegurar que cuando faltan campos imprescindibles se devuelva `validation.warnings` no error, y permitir generar plan parcial con `confidence` marcado.
* En `planGenerator.ts`:

  * Usa el nuevo `analysis.moon` objeto (no `analysis.moon?.stressScore || 0` sin debug).
  * Añade logs antes de decidir geometría: `logger.log('dominant sign calc inputs', {...})`.
  * Si `analysis` tiene baja confianza (pocas posiciones/aspects), activar `filterLowConfidence` con una estrategia: incluir más fallback exercises y marcar plan como `lowConfidence: true`.
  * Asegurar `estimatedDailyMinutes` redondeado y consistente.

### 3) Matching ejercicios — `selectExercises()` y DB de ejercicios

* Mejora el algoritmo de `selectExercises()`:

  * Implementa `matchScore(exercise, priorities, analysis)` que combine: prioridad match, categoría balance, intensidad y seguridad.
  * Asegura diversidad: no más de 1 ejercicio de la misma sub-categoria por fase salvo si no hay alternativas.
* Añade tests que simulen prioridades vacías -> fallback se active y devuelva 6 ejercicios balanceados.

### 4) Distribución y rutina diaria — `distributeIntoPhases()` y `generateDailyRoutine()`

* `distributeIntoPhases()` debe manejar casos con menos de 6 ejercicios (distribuir equitativamente y marcar `phase.exercises` vacío si no hay).
* `generateDailyRoutine()` debe devolver IDs *y* títulos legibles para UI; ejemplo:

  ```text
  🌅 Mañana: (ex1) Respiración 4-7-8 — 5 min
  ☀️ Durante el día: (ex3) Caminata consciente — 15 min
  🌙 Noche: (ex2) Meditación lunar — 10 min
  ```
* Test de integración: con un set de 4 ejercicios asegurar que fase 1-3 reciben items de manera sensata.

### 5) UI / UX — pages & components

* `ExercisePlanPage.tsx`:

  * Asegurar que el load flow maneje `plan.lowConfidence` y muestre aviso: “Plan generado con baja confianza — revisá datos de la carta”.
  * Asegurar que el `select` móvil resetea correctamente.
* `ExerciseChartPage.tsx` (antes Insights):

  * Mostrar **sección detallada**: valores calculados (moon stress, razones en debug, aspectos listados con grados), distribución elemental y modal/explicación “Por qué estos ejercicios”.
  * Evitar duplicados textuales; condensar Fases 1/2/3 en una sola explicación por fase.
  * Asegurar padding superior para no ser tapado por navbar (CSS: `padding-top` o `safe-area-inset`).
  * Bloquear scroll del fondo si algún modal ligero aparece (pero preferir páginas para el contenido).
* `ReflexPage.tsx`:

  * Quitar botón `+` duplicado.
  * Agregar botón `Volver`.
  * Agregar contador de reflexiones en el resumen.

### 6) Tests y QA

* Añadir tests unitarios (Jest) para:

  * `analyzeChart()` con 3 casos (sin aspectos / con aspectos tensos / con aspectos armónicos).
  * `generateExercisePlan()` corrige flujo (returns plan with phases, totalExercises consistent).
* Añadir un integration test que corra `generateExercisePlan()` con un `mockChart` y asegure:

  * `plan.chartAnalysis.moon.debug` existe.
  * `plan.phases` tiene 3 objetos con `days === 7`.
  * `plan.totalExercises === sum(exercises)`.
* Añadir un script `npm run test:exercises` que ejecute estos tests.

### 7) Logs y telemetría

* En puntos críticos añade:

  * `logger.log('START generateExercisePlan', { chartId, chartName })`
  * `logger.log('ANALYSIS', analysis)` (sin exponer datos sensibles en prod — mask si necesario)
  * `logger.warn('LOW_CONFIDENCE_PLAN', { reasons })`
  * `logger.error` en errores.
* Asegurar que logs sean legibles y que no rompan CI.

### 8) PR y documentación

* Crear PR con título: `fix(exercises): moon stress calc + personalized plan improvements (v2→v3)`
* PR description: incluir resumen, archivos cambiados, cómo probar manualmente y checklist (ver abajo).
* Commits atomizados:

  * `fix(chartAnalyzer): calculate moon stress with aspects & dignity`
  * `feat(planGenerator): lowConfidence handling & better logging`
  * `refactor(selectExercises): match scoring & diversity`
  * `fix(ui): padding/header/scroll/ReflexPage fixes`
  * `test(exercises): add unit & integration tests`

---

## Criterios de aceptación (QA)

1. Al generar plan con una carta de test (adjunta sample `mockChartA.json`), `analysis.moon.stressScore` devuelve número >0 en casos con aspectos tensos.
2. `ExercisePlan` incluye `chartAnalysis.moon.debug` con razones legibles.
3. La página `/ejercicios/tu-carta` muestra: distribución elemental, moon stress con barra, lista de aspectos y "Por qué" linkado a cada ejercicio.
4. No hay header fijo que tape contenido; el navbar no tapa el título (ver en mobile y desktop).
5. Reflexiones tiene un solo botón `+` y un botón `Volver`.
6. Tests pasan en CI (todos los nuevos tests).
7. PR incluye capturas o gif cortos demostrando flow, y checklist completado.

---

## Comandos útiles para QA (pedir al dev que ejecute en el PR)

* Instalar / test:

  ```bash
  npm ci
  npm run test
  npm run test:exercises
  npm run dev
  # Navegar a http://localhost:3000/ejercicios and /ejercicios/tu-carta
  ```
* Simular generación:

  ```ts
  // node script
  const { generateExercisePlan } = require('./src/services/exercises/planGenerator');
  const chart = require('./tests/mocks/mockChartA.json');
  generateExercisePlan(chart).then(plan => console.log(JSON.stringify(plan.chartAnalysis.moon, null, 2)));
  ```

---

## Ejemplo de mensaje de PR (usar en la descripción)

```
Fix & Improvements: Exercises plan personalization & moon stress calculation

- Fix: calculate moon.stressScore properly using aspects, dignities and houses.
- Feature: lowConfidence plan handling and user notice.
- Improvement: match algorithm for exercise selection (diversity + safety).
- UX: moved insights to page, fixed scroll/header/padding issues, ReflexPage fixes.
- Tests: added unit & integration tests for analyzeChart and generateExercisePlan.

QA checklist:
- [ ] Moon stress >0 for charts with tense aspects
- [ ] Chart page shows debug reasons and "Por qué" for exercises
- [ ] No UI overlap with navbar on mobile
- [ ] ReflexPage has single + and Back button
- [ ] New tests pass: npm run test:exercises
```

---

## Paquete de artefactos a incluir en el PR

* `tests/mocks/mockChartA.json` (carta con aspectos tensos)
* Tests en `src/services/exercises/__tests__/chartAnalyzer.test.ts` y `planGenerator.test.ts`
* Capturas GIF/PNG (3) mostrando: generación plan → página "Tu Carta" (moon stress bar) → ReflexPage fixes

---

## Notas finales (tips para la IA de VS)

* Prioriza **corrección del cálculo** antes de refactor visual.
* Usa tipos TypeScript estrictos para las nuevas estructuras.
* Si debés alterar shape de `ExercisePlan`, documentalo y agrega backward compatibility wrapper.
* Comenta con `// TODO` donde quieras que otro humano revise la lógica esotérica (ej.: pesos arcanos, valores mágicos).

---

Perfecto ⚙️ Aquí tienes el **prompt adaptado en formato de *Issue Checklist completo*** para pegar directamente en **GitHub** (en una issue o como descripción de un PR épico).
Está optimizado para trabajar con **Copilot / VS AI / Dev Team**, con tareas secuenciadas, etiquetas, prioridades y estimaciones.

---

# 🧩 Issue: Refactor & Mejora — Plan de Ejercicios Astrológicos v3.0

**Proyecto:** AstroLab / Zodioteca
**Módulo:** Plan de Ejercicios Holísticos (21 días personalizados)
**Responsables:** Equipo IA + Desarrollo Front/Back
**Estado:** 🟡 En curso
**Objetivo:** Mejorar la precisión del análisis astrológico, la personalización real del plan, y la armonía visual/UX del módulo de ejercicios.

---

## 🎯 **Contexto Actual**

El sistema genera planes de ejercicios holísticos basados en la carta natal, pero actualmente:

* `moon.stressScore` devuelve **0 siempre**.
* El contenido del plan parece **genérico**.
* Hay **problemas de UI/UX** en headers, scroll y repetición de textos.
* Falta justificación clara del *por qué* de los ejercicios.
* Faltan tests unitarios y logs trazables.

Queremos lanzar **v3.0** del sistema, con cálculo real de estrés lunar, matching energético real y UI armónica.

---

## 🚀 **Objetivos Principales**

1. Calcular correctamente el **estrés lunar y planetario** desde `chartAnalyzer.ts`.
2. Generar planes 100% **personalizados y justificados**.
3. Mejorar la **UX/UI general** de todas las páginas (`/ejercicios/...`).
4. Integrar **telemetría, validaciones y logs** claros.
5. Añadir **tests unitarios e integración** para asegurar estabilidad.
6. Preparar documentación y PR listos para QA.

---

## 🔧 **Tareas Detalladas**

### 🧠 1. Fix Cálculo de Estrés Lunar (`chartAnalyzer.ts`)

**Estimado:** ⏱ 4h | **Prioridad:** 🔥 Alta

* [ ] Revisar la función `analyzeMoonStress()` y reescribirla para usar:

  * Aspectos tensos (cuadraturas, oposiciones, conjunciones con planetas lentos).
  * Dignidad lunar (domicilio, exilio, detrimento, exaltación).
  * Casa lunar (IV, VIII, XII = más estrés emocional).
* [ ] Devolver estructura:

  ```ts
  { stressScore, aspectsCount, dignity, debug: { reasons: string[], rawValues } }
  ```
* [ ] Incluir logs `logger.log('🌙 Moon stress analysis', debugData)`
* [ ] Tests unitarios: casos sin aspectos, con 3 tensos, con 4 armónicos.

---

### ⚙️ 2. Validaciones & Scoring (`planGenerator.ts` + `chartValidator.ts`)

**Estimado:** ⏱ 3h | **Prioridad:** 🔥 Alta

* [ ] Mejorar `validateAndNormalize()` para no bloquear si faltan datos: generar `warnings` y `confidenceScore`.
* [ ] Incorporar `confidence` en `ExercisePlan`: si < 0.6 → marcar plan como *baja confianza*.
* [ ] En `planGenerator.ts`, loggear inputs antes de scoring: `logger.log('inputs for scoring', {...})`.
* [ ] Actualizar `summarizeTopPriorities()` para devolver top áreas sin repetir categorías.

---

### 🧘‍♀️ 3. Matching Energético (`selectExercises()` + DB de ejercicios)

**Estimado:** ⏱ 5h | **Prioridad:** 🔥 Alta

* [ ] Implementar función `matchScore(exercise, priorities, analysis)`:

  * Coincidencia de categoría, intensidad y vibración elemental.
  * Ponderar ejercicios según `analysis.moon.element` o `dominantElement`.
* [ ] Evitar duplicados: máximo 1 ejercicio por subcategoría por fase.
* [ ] Si faltan, activar fallback balanceado.
* [ ] Tests unitarios para matchScore y fallback.

---

### 🔮 4. Distribución & Rutina (`distributeIntoPhases()`)

**Estimado:** ⏱ 2h | **Prioridad:** 🟢 Media

* [ ] Permitir menos de 6 ejercicios sin romper fases (llenar vacíos).
* [ ] Mejorar `generateDailyRoutine()`:

  * Mostrar títulos + duraciones legibles (no IDs).
  * Ejemplo:

    ```
    🌅 Mañana: Respiración 4-7-8 — 5 min  
    🌙 Noche: Meditación lunar — 10 min
    ```
* [ ] Añadir tests integrados con `mockChartA.json`.

---

### 🎨 5. UI / UX Mejoras (Páginas de Ejercicios y Reflexiones)

**Estimado:** ⏱ 6h | **Prioridad:** 🟣 Alta
**Archivos:**
`ExercisePlanPage.tsx`, `ExerciseChartPage.tsx`, `ExerciseGuidePage.tsx`, `ReflexPage.tsx`

* [ ] Quitar headers fijos que bloquean scroll.
* [ ] Añadir `padding-top` para evitar solapamiento con navbar.
* [ ] Compactar textos y eliminar secciones duplicadas (“Fases 1-2-3”).
* [ ] Mostrar `lowConfidence` warning si plan tiene validación débil.
* [ ] `ReflexPage`:

  * [ ] Agregar botón “← Volver”.
  * [ ] Eliminar segundo ícono “+”.
  * [ ] Mostrar contador total de reflexiones.

---

### 🧾 6. Logs & Telemetría (`logger.ts`)

**Estimado:** ⏱ 2h | **Prioridad:** 🟢 Media

* [ ] Añadir trazas:

  * `START generateExercisePlan`
  * `ANALYSIS summary`
  * `LOW_CONFIDENCE_PLAN`
  * `MOON_STRESS_CALC`
* [ ] Asegurar que los logs no rompan CI.
* [ ] Agregar flag `DEBUG_MODE` para silenciar en producción.

---

### 🧪 7. Testing & QA

**Estimado:** ⏱ 5h | **Prioridad:** 🟢 Media

* [ ] Unit Tests: `chartAnalyzer.test.ts`, `planGenerator.test.ts`
* [ ] Integration Tests: `generateExercisePlan(mockChartA.json)`
* [ ] QA Manual:

  * Generar plan → ver stress lunar ≠ 0.
  * `/ejercicios/tu-carta` muestra análisis + “por qué”.
  * `/reflexiones` UI consistente y accesible.
* [ ] Crear script `npm run test:exercises`.

---

### 📦 8. Documentación & PR

**Estimado:** ⏱ 2h | **Prioridad:** 🟢 Media

* [ ] Actualizar `README.md` (flujo actualizado + nuevas rutas).
* [ ] Crear `tests/mocks/mockChartA.json` con aspectos tensos.
* [ ] PR Name:
  `fix(exercises): moon stress calc + plan personalization v3.0`
* [ ] Incluir capturas o GIF corto con flujo:

  * Cálculo lunar → Tu Carta → Reflexiones.
* [ ] Checklist QA:

  * [ ] Moon stress correcto
  * [ ] Plan justificado
  * [ ] UI limpia
  * [ ] Tests OK

---

## 🧭 **Referencias de Código**

| Archivo                                   | Propósito                                         |
| ----------------------------------------- | ------------------------------------------------- |
| `src/services/exercises/chartAnalyzer.ts` | Análisis astrológico (Luna, aspectos, dignidades) |
| `src/services/exercises/planGenerator.ts` | Orquestador de generación de planes               |
| `src/store/useExercisePlanStore.ts`       | Estado global del plan                            |
| `src/pages/ExercisePlanPage.tsx`          | UI principal del plan                             |
| `src/pages/ExerciseChartPage.tsx`         | Página “Tu Carta” (antes Insights)                |
| `src/pages/ExerciseGuidePage.tsx`         | Guía de uso                                       |
| `src/pages/ReflexPage.tsx`                | Reflexiones y seguimiento diario                  |

---

## 🧭 **Definición de Hecho (DoD)**

✅ `moon.stressScore` calculado correctamente (0–10 con decimales)
✅ Justificación clara “por qué estos ejercicios” visible en UI
✅ Sin contenido duplicado ni headers fijos
✅ Tests unitarios e integración aprobados
✅ Logs visibles y útiles
✅ PR con documentación y QA checklist completo

---


