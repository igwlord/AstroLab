# 🔴 ERRORES ENCONTRADOS EN LOS CÁLCULOS

## Carta Natal de Prueba:
- **Fecha**: 16 Octubre 1988, 17:50 (hora local -03:00)
- **UTC**: 16 Octubre 1988, 20:50
- **Lugar**: Buenos Aires, Argentina
- **Coordenadas**: 34°36'S, 58°27'W
- **LST**: 18:38:32
- **Sistema**: Placidus

---

## ❌ ERROR #1: CÁLCULO DE CASAS PLACIDUS (CRÍTICO)

### Problema:
El código actual usa **interpolación lineal simplificada** en lugar del **verdadero sistema Placidus**.

**Código actual** (línea 174-190 de `realAstroCalculator.ts`):
```typescript
// Interpolar casas intermedias (simplificado - no es Placidus exacto)
for (let i = 0; i < 3; i++) {
  // Casas 2, 3 entre ASC y IC
  const cusp2_3 = (asc + ((ic - asc + 360) % 360) * (i + 1) / 3) % 360;
  // ... más interpolaciones lineales
}
```

### Impacto:
- ❌ **Cúspides incorrectas** en casas 2, 3, 5, 6, 8, 9, 11, 12
- ❌ **Asignación incorrecta** de planetas a casas
- ❌ **Aspectos a cúspides** incorrectos

### Comparación de Resultados:

#### Astro.com (CORRECTO):
```
Casa 1 (ASC):  Aries 8°04'
Casa 2:        Tauro 5°37'
Casa 3:        Géminis 6°17'
Casa 4 (IC):   Cáncer 8°51'
Casa 5:        Leo 11°19'
Casa 6:        Virgo 11°33'
Casa 7 (DESC): Libra 8°04'
Casa 8:        Escorpio 5°37'
Casa 9:        Sagitario 6°17'
Casa 10 (MC):  Capricornio 8°51'
Casa 11:       Acuario 11°19'
Casa 12:       Piscis 11°33'
```

#### Tu App (INCORRECTO - probablemente):
```
Casa 1: Aries 8°04'         ✅ Correcto (angular)
Casa 2: ¿?                  ❌ Probablemente incorrecto
Casa 3: ¿?                  ❌ Probablemente incorrecto
Casa 4: Cáncer 8°51'        ✅ Correcto (angular)
...
```

### Solución:
Implementar el **verdadero algoritmo de Placidus** que usa:
- Ascensión oblicua
- Arcos semi-diurnos
- Fórmulas trigonométricas complejas

**Referencia**: Jean Meeus, "Astronomical Algorithms", Capítulo 37

---

## ❌ ERROR #2: CÁLCULO DE RETROGRADACIÓN (VERIFICAR)

### Problema Potencial:
El método actual compara posiciones con diferencia de 1 día completo.

**Código actual** (líneas 99-107):
```typescript
function calculateRetrograde(body: Astronomy.Body, date: Date): boolean {
  const currentPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false));
  const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000); // +1 día
  const nextPos = Astronomy.Ecliptic(Astronomy.GeoVector(body, nextDay, false));
  
  return nextPos.elon < currentPos.elon;
}
```

### Impacto:
- ⚠️ Puede ser impreciso en **estaciones** (cuando el planeta cambia de dirección)
- ⚠️ Diferencia de 1 día es demasiado grande para detección precisa

### Verificación Necesaria:

Según Astro.com, en esta carta:
- ✅ **Mercurio**: Retrógrado (R)
- ✅ **Marte**: Retrógrado (R)
- ✅ **Júpiter**: Retrógrado (R)
- ✅ **Chiron**: Retrógrado (R)
- ❌ **Node**: Retrógrado (SIEMPRE retrógrado el nodo lunar)

### Solución:
1. Usar intervalo más pequeño (6-12 horas en vez de 24)
2. O mejor: Calcular la **velocidad geocéntrica** directamente
3. Para nodos lunares: SIEMPRE marcar como retrógrados

---

## ❌ ERROR #3: PARTE DE LA FORTUNA - FÓRMULA DÍA/NOCHE

### Verificación:
Astro.com muestra: **Fortuna en Géminis 17°10'** (Casa 3)

**Datos para verificar**:
- Sol: Libra 23°42' = 203.71°
- Luna: Capricornio 2°48' = 272.80°
- ASC: Aries 8°04' = 8.08°

**Hora del nacimiento**: 20:50 UTC
**Hora local**: 17:50 (tarde)

### Fórmula según la hora:

**Carta Diurna** (Sol sobre horizonte):
```
Fortuna = ASC + Luna - Sol
```

**Carta Nocturna** (Sol bajo horizonte):
```
Fortuna = ASC + Sol - Luna
```

### ¿Cómo determinar si es carta Diurna o Nocturna?

El Sol está en **Casa 7** según Astro.com, lo cual significa que está **sobre el horizonte** → **CARTA DIURNA**

**Cálculo esperado**:
```
Fortuna = 8.08° + 272.80° - 203.71° = 77.17° = Géminis 17°10' ✅
```

### Problema:
Tu código puede estar:
1. ❌ Detectando incorrectamente si es carta diurna/nocturna
2. ❌ Aplicando la fórmula invertida

### Solución:
Verificar la función `isChartDiurnal()` en `arabicPartsCalculator.ts`

---

## ❌ ERROR #4: LILITH - TIPO (MEAN VS TRUE)

### Astro.com muestra:
```
Lilith: Libra 12°24' (192°24'50")
```

### Tu app:
- ¿Qué tipo de Lilith está calculando por defecto?
- ¿Mean Lilith o True Lilith?

### Verificación:
```typescript
// En sensitivePointsCalculator.ts
calculateLilith(birthDate, lilithType);
```

**Nota**: Astro.com por defecto usa **True Lilith** (osculating apogee).

### Solución:
Asegurarse de que el toggle en configuración esté sincronizado correctamente.

---

## ❌ ERROR #5: NODO LUNAR - TIPO Y DIRECCIÓN

### Astro.com muestra:
```
Node (T): Piscis 13°15' (343°15'29") - Retrógrado
```

**(T) = True Node**

### Verificación:
1. ¿Tu app está usando True Node o Mean Node?
2. ¿El nodo lunar está marcado como retrógrado?

**IMPORTANTE**: El Nodo Lunar Norte **SIEMPRE** es retrógrado en su movimiento real.

### Solución:
En `lunarNodesCalculator.ts`, asegurarse de que:
- Se calcule el tipo correcto (Mean/True según configuración)
- Se marque siempre como retrógrado

---

## ❌ ERROR #6: CHIRON - CÁLCULO Y RETROGRADACIÓN

### Astro.com muestra:
```
Chiron: Cáncer 7°10' (97°10'12") - Retrógrado
```

### Tu app debería mostrar:
- Posición: Cáncer 7°10' ✅ (probablemente correcto)
- Retrógrado: R ✅ (verificar)

### Problema potencial:
El cálculo de retrogradación de Chiron puede fallar si no está implementado en `sensitivePointsCalculator.ts`.

### Solución:
Agregar detección de retrogradación para Chiron en el calculador de puntos sensibles.

---

## ❌ ERROR #7: VELOCIDAD DE PLANETAS (SPEED)

Astro.com muestra la columna **"Speed"** que indica cuántos grados se mueve el planeta por día.

**Ejemplos**:
```
Sol:     0°59'33"  (casi 1° por día)
Luna:    13°14'43" (muy rápido)
Mercurio: -0°36'55" (negativo = retrógrado)
```

### Tu app:
- ❌ **NO** calcula ni muestra velocidades planetarias
- ❌ Esto es importante para:
  - Confirmar retrogradación
  - Análisis de combustión
  - Luna Void of Course

### Solución:
Agregar cálculo de velocidad diaria en `realAstroCalculator.ts`:
```typescript
const speed = (nextPos.elon - currentPos.elon) / 1.0; // grados por día
```

---

## 📊 RESUMEN DE ERRORES

| # | Error | Severidad | Impacto | Estado |
|---|-------|-----------|---------|--------|
| 1 | **Casas Placidus simplificadas** | 🔴 CRÍTICO | Todas las casas incorrectas excepto angulares | ❌ No resuelto |
| 2 | **Retrogradación imprecisa** | 🟡 MEDIO | Posibles falsos positivos en estaciones | ⚠️ Verificar |
| 3 | **Parte Fortuna fórmula** | 🟡 MEDIO | Cálculo incorrecto día/noche | ⚠️ Verificar |
| 4 | **Tipo de Lilith** | 🟢 BAJO | Mean vs True diferencia ~10° | ⚠️ Verificar |
| 5 | **Nodo Lunar tipo/dirección** | 🟢 BAJO | Mean vs True + falta marca R | ⚠️ Verificar |
| 6 | **Chiron retrogradación** | 🟢 BAJO | Falta detectar retrogradación | ⚠️ Verificar |
| 7 | **Velocidad planetaria** | 🔵 MEJORA | Feature faltante | ℹ️ No crítico |

---

## 🔧 PRIORIDAD DE CORRECCIONES

### 🔴 URGENTE (Errores críticos):
1. **Implementar Placidus real** → Afecta TODO el sistema de casas

### 🟡 IMPORTANTE (Errores medios):
2. **Mejorar detección de retrogradación** → Afecta interpretación
3. **Verificar Parte de Fortuna** → Cálculo aritmético incorrecto

### 🟢 BAJA PRIORIDAD (Verificaciones):
4. **Confirmar tipo de Lilith** → Diferencia esperada Mean/True
5. **Confirmar tipo de Nodo** → Diferencia esperada Mean/True
6. **Agregar retrogradación a Chiron** → Feature faltante

### 🔵 MEJORAS FUTURAS:
7. **Agregar velocidades planetarias** → Análisis avanzado

---

## 🧪 CÓMO VERIFICAR CADA ERROR

### Test para Error #1 (Casas):
```javascript
// Generar carta de Buenos Aires 16/10/1988 17:50
// Comparar TODAS las cúspides con Astro.com
// Diferencia aceptable: ±0.5° para casas angulares, ±2° para intermedias
```

### Test para Error #2 (Retrogradación):
```javascript
// Ver consola del navegador
// Buscar planetas marcados como (R)
// Comparar con lista de Astro.com:
// - Mercurio R ✅
// - Marte R ✅
// - Júpiter R ✅
// - Chiron R ✅
```

### Test para Error #3 (Fortuna):
```javascript
// Buscar en consola: "Parte de la Fortuna"
// Debe mostrar: Géminis 17°10' (Casa 3)
// Si difiere >2°, hay error en fórmula día/noche
```

---

## 📚 REFERENCIAS TÉCNICAS

### Placidus:
- Jean Meeus, "Astronomical Algorithms", Chapter 37
- Swiss Ephemeris documentation
- AstroWiki: http://www.astro.com/swisseph/swisseph.htm

### Retrogradación:
- JPL Horizons: https://ssd.jpl.nasa.gov/horizons.cgi
- astronomy-engine docs: velocidad geocéntrica

### Partes Árabes:
- Robert Hand, "Essays on Astrology"
- Traditional formula day/night charts

---

## ✅ SIGUIENTE PASO

**RECOMENDACIÓN**: 
1. Primero corregir **Error #1 (Placidus)** - es el más crítico
2. Luego verificar **Error #3 (Fortuna)** - es fácil de confirmar
3. Finalmente revisar configuraciones de Lilith/Nodos

¿Quieres que implemente la corrección del sistema Placidus primero?
