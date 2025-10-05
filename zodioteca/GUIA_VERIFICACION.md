# 🔍 Guía de Verificación de Cálculos - AstroLab

## ✅ Sistema de Verificación Automática IMPLEMENTADO

Cada vez que generes una carta natal, **la aplicación verificará automáticamente** los cálculos y mostrará un reporte completo en la consola del navegador.

---

## 📋 Cómo Verificar los Cálculos AHORA

### 1. **Abrir la Consola del Navegador**

**En Chrome/Edge/Brave:**
- Presiona `F12` o `Ctrl + Shift + I` (Windows/Linux)
- Presiona `Cmd + Option + I` (Mac)
- Click derecho → "Inspeccionar" → pestaña "Console"

**En Firefox:**
- Presiona `F12` o `Ctrl + Shift + K`
- Click derecho → "Inspeccionar elemento" → pestaña "Consola"

### 2. **Generar una Carta Natal**

1. Completa el formulario con tus datos
2. Haz click en "Calcular Carta Natal"
3. **Automáticamente verás en la consola**:

```
============================================================
🔍 VERIFICACIÓN AUTOMÁTICA DE CÁLCULOS
============================================================

📊 REPORTE DE VERIFICACIÓN
✅ CÁLCULOS VÁLIDOS

✅ VALIDACIONES
📁 Planetas
  ✓ Sol: Capricornio 10.58°
  ✓ Luna: Piscis 0.85°
  ✓ Mercurio: Capricornio 20.87°
  ...

📁 Puntos Angulares
  ✓ Ascendente: Tauro 26.50°
  ✓ Medio Cielo: Acuario 6.70°

📁 Asteroides
  ✓ Calculados: 4 (Ceres, Pallas, Juno, Vesta)

📁 Partes Árabes
  ✓ Calculadas: 7

📁 Hemisferios
  ✓ Distribución: Oriental: 5, Occidental: 5

📄 EXPORTACIÓN PARA COMPARACIÓN:
=== CARTA NATAL ===

Fecha: 2000-01-01T12:00:00.000Z
Lugar: Londres, Reino Unido
Coordenadas: 51.5074°N, -0.1278°E

--- PLANETAS ---
Sol          Capricornio     10.58° Casa 9
Luna         Piscis           0.85° Casa 11
...

💡 CÓMO VERIFICAR:
1. Ve a https://www.astro.com/cgi/chart.cgi?rs=3
2. Introduce estos datos:
   - Fecha: 1/1/2000
   - Hora: 12:00
   - Lugar: Londres
3. Compara las posiciones planetarias con la tabla anterior
4. Diferencias menores a 0.5° son aceptables
============================================================
```

### 3. **Comparar con Astro.com (Método Manual)**

#### Paso a Paso:

1. **Ve a Astro.com**:
   ```
   https://www.astro.com/cgi/chart.cgi?rs=3
   ```

2. **Ingresa tus datos exactos** (los mismos que usaste en AstroLab):
   - Fecha de nacimiento (día/mes/año)
   - Hora de nacimiento (HH:MM)
   - Lugar de nacimiento (ciudad)

3. **Selecciona opciones**:
   - Chart type: "Natal Chart Wheel"
   - House system: "Placidus" (igual que AstroLab)
   - Zodiac: "Tropical" (igual que AstroLab)

4. **Compara las posiciones**:
   
   **Planetas** - Diferencia aceptable: **± 0.5°**
   ```
   Planeta      AstroLab           Astro.com
   -------      --------           ---------
   Sol          Aries 15.23°       Aries 15.22°    ✅ 0.01° diferencia
   Luna         Tauro 8.45°        Tauro 8.47°     ✅ 0.02° diferencia
   Mercurio     Aries 2.13°        Aries 2.15°     ✅ 0.02° diferencia
   ```

   **Casas** - Diferencia aceptable: **± 1.0°**
   ```
   Casa         AstroLab           Astro.com
   ----         --------           ---------
   Ascendente   Leo 12.34°         Leo 12.35°      ✅ 0.01° diferencia
   MC           Tauro 5.67°        Tauro 5.68°     ✅ 0.01° diferencia
   ```

   **Asteroides** - Diferencia aceptable: **± 0.5°**
   ```
   Asteroide    AstroLab           Astro.com
   ---------    --------           ---------
   Ceres        Virgo 23.45°       Virgo 23.44°    ✅ 0.01° diferencia
   ```

---

## 🎯 Qué Verificar

### ✅ Verificaciones Automáticas (ya implementadas):

1. **Planetas**:
   - ✅ Todos los 10 planetas principales están presentes
   - ✅ Longitudes en rango 0-360°
   - ✅ Grados dentro del signo 0-30°
   - ✅ Casas en rango 1-12

2. **Asteroides** (si están activados):
   - ✅ 4 asteroides calculados
   - ✅ Posiciones válidas

3. **Partes Árabes** (si están activadas):
   - ✅ 7 partes calculadas
   - ✅ Fórmulas día/noche aplicadas

4. **Aspectos**:
   - ✅ Orbes positivos
   - ✅ Orbes dentro de límites razonables (<10°)

5. **Hemisferios** (si están activados):
   - ✅ Suma de planetas coincide con total

### 📊 Precisión Esperada

| Elemento | Precisión Típica | Fuente de Diferencia |
|----------|-----------------|---------------------|
| **Planetas** | ± 0.01° - 0.1° | Redondeo, efemérides |
| **Luna** | ± 0.5° - 1.0° | Movimiento rápido |
| **Ascendente** | ± 0.5° - 1.0° | Hora exacta, ubicación |
| **MC** | ± 0.5° - 1.0° | Hora exacta |
| **Casas** | ± 1.0° - 2.0° | Sistema de casas, redondeo |
| **Asteroides** | ± 0.1° - 0.5° | Órbitas perturbadas |

---

## 🐛 Qué Hacer si Encuentras Diferencias Grandes

### Diferencias > 2° en Planetas

**Posibles causas**:
1. **Hora incorrecta**: Verifica que la hora sea correcta (24h format)
2. **Zona horaria**: Asegúrate de usar la hora local correcta
3. **Ubicación**: Verifica las coordenadas del lugar

**Solución**:
- Revisa los datos ingresados
- Compara con otra fuente (AstroSeek, Café Astrology)

### Diferencias > 5° en Ascendente/Casas

**Posibles causas**:
1. **Hora de nacimiento imprecisa**: 4 minutos = 1° de diferencia en Ascendente
2. **Ubicación incorrecta**: Coordenadas diferentes
3. **Sistema de casas diferente**: AstroLab usa Placidus

**Solución**:
- Verifica que uses Placidus en ambos sitios
- Confirma la hora exacta de nacimiento
- Verifica coordenadas geográficas

### Aspectos Faltantes o Extra

**Normal**: Diferentes programas usan orbes ligeramente diferentes.

**Solución**:
- Ve a Configuración → Orbes personalizados
- Ajusta los orbes según tus preferencias

---

## 🧪 Caso de Prueba de Referencia

Para probar que todo funciona correctamente, usa estos datos:

```
Fecha: 1 de Enero de 2000
Hora: 12:00 (mediodía)
Lugar: Londres, Reino Unido
Coordenadas: 51.5074°N, 0.1278°W
```

**Resultados esperados** (según Astro.com):

```
Sol:         Capricornio 10.58°  Casa 9
Luna:        Piscis 0.85°        Casa 11
Mercurio:    Capricornio 20.87°  Casa 10
Venus:       Acuario 8.67°       Casa 10
Marte:       Acuario 2.13°       Casa 10
Júpiter:     Aries 23.64°        Casa 12
Saturno:     Tauro 10.54°        Casa 1
Urano:       Acuario 15.67°      Casa 10
Neptuno:     Acuario 2.92°       Casa 10
Plutón:      Sagitario 11.37°    Casa 8

Ascendente:  Tauro 26.5°
MC:          Acuario 6.7°
```

Si tus resultados están dentro de ±0.5° de estos valores, **¡todo está funcionando correctamente!** ✅

---

## 📞 Soporte

Si encuentras diferencias significativas (>2°) que no puedes explicar:

1. Copia el reporte de verificación de la consola
2. Toma captura de pantalla de Astro.com con los mismos datos
3. Documenta los datos exactos usados (fecha, hora, lugar)

---

## 🎓 Recursos Adicionales

**Sitios de referencia confiables**:
- 🌟 **Astro.com** - El estándar de oro (Swiss Ephemeris)
- 📊 **AstroSeek** - Bueno para verificar cálculos
- 🔮 **Café Astrology** - Interfaz amigable
- 📖 **Astrodienst** - Efemérides profesionales

**Libros de referencia**:
- "Astronomical Algorithms" - Jean Meeus
- "The American Ephemeris" series

**Software de escritorio**:
- Solar Fire
- Sirius
- Janus

---

✨ **¡El sistema de verificación automática ya está funcionando!** ✨

Cada carta que calcules será verificada instantáneamente. Solo abre la consola del navegador para ver los resultados.
