# RUEDA ASTRO MODELO (AUDITORÍA ULTRA-DETALLADA)

Este documento especifica con precisión la geometría, jerarquía visual, escalas, radios y orden de dibujo de una rueda natal al estilo Astro‑Seek (zodíaco fijo, lectura clásica). Está pensado para que cualquier motor (SVG, Canvas, WebGL, PDF o generador IA) pueda duplicarla fielmente.

Las medidas se dan en función del tamaño total del lienzo: `size` (en píxeles). Se usa un sistema polar con centro en `(cx, cy) = (size/2, size/2)` y radio máximo `R = size/2`.

---

## 1) Sistema angular (obligatorio)

- Zodíaco FIJO: 0° Aries está ANCLADO a la IZQUIERDA (posición de las 9 en un reloj).
- Dirección angular: aumenta ANTIHORARIO (convención astronómica clásica en ruedas de Astro‑Seek).
- Conversión de longitud eclíptica absoluta (0..360° desde 0° Aries) a radianes para SVG/Canvas:
  - `normalize(d) = ((d % 360) + 360) % 360`
  - `absToRad(absDeg) = ((180 - normalize(absDeg)) * PI / 180)`
  - 0° Aries → 180° matemáticos → eje horizontal a la izquierda.
- Signos: 12 sectores de 30°, centrados a 15° de su inicio.
- Casas: 12 cúspides (Placidus u otro sistema) en longitudes ABSOLUTAS; las casas resultan como arcos entre cúspides consecutivas. El ancho de cada casa es `span = deltaPos(cusp[i], cusp[i+1])` con `deltaPos(a,b) = normalize(b - a)`.

---

## 2) Estructura radial (anillos y radios normalizados)

Se definen radios (fracciones de `R`) para cada banda concéntrica. La estructura replica la estética de la imagen adjunta de Astro‑Seek (tema claro), pero los valores son independientes del tema.

- Fondo/contorno exterior: `R_out = 1.00 R` (opcional)
- Corona de ticks (anillo externo):
  - `R_ticks_inner = 0.93 R`
  - `R_ticks_outer = 1.00 R`
- Anillo de signos (entre ticks y casas):
  - `R_signs_inner = 0.84 R`
  - `R_signs_outer = 0.92 R`
- Anillo de líneas de casas (llegan hasta el borde del anillo de signos):
  - Extremo de líneas de casas: `R_house_line_end = R_signs_inner` (≈ 0.84 R)
- Anillo de números de casas (midpoints):
  - `R_house_numbers = 0.72 R` (entre planetas y signos)
- Anillo de planetas (símbolos):
  - `R_planets = 0.60 R` (planetas quedan claramente dentro de la corona de casas)
  - Opcional anti‑colisión radial: escalones `R_planets + k * (0.03 R)` para separar planetas a menos de ~10°.
- Anillo de aspectos (cables internos):
  - `R_aspects = 0.52 R` (las líneas no tocan los planetas; dejan respiración)
- Disco central (vacío/rotulación):
  - `R_inner = 0.32 R` (la malla de aspectos queda visible entre `R_inner` y `R_aspects`).

Notas:
- En el gráfico adjunto de Astro‑Seek los planetas están “notablemente” más cerca del centro que los números de casa y los signos; por eso `R_planets` ≈ 0.60 R y `R_house_numbers` ≈ 0.72 R.
- La corona de ticks ocupa el borde exterior y no invade el anillo de signos.

---

## 3) Corona de ticks (graduación profesional 360°)

Jerarquía exacta (como Astro‑Seek):
- 360 ticks: uno por CADA grado absoluto.
- Tres longitudes (desde `R_ticks_inner` hacia fuera):
  - Tick 1° (corto): `len1 = max(2px, 0.012 R)`
  - Tick 5° (medio): `len5 = max(3px, 0.020 R)` para grados donde `deg % 5 === 0` y `deg % 10 !== 0`
  - Tick 10° (largo): `len10 = max(4px, 0.030 R)` para grados donde `deg % 10 === 0`
- Anchos y opacidades sugeridas:
  - 1°: `strokeWidth = 0.5..0.7 px`, `opacity ≈ 0.30`
  - 5°: `strokeWidth = 0.7..0.9 px`, `opacity ≈ 0.45`
  - 10°: `strokeWidth = 0.9..1.2 px`, `opacity ≈ 0.60`
- Etiquetas de grados:
  - Se imprimen números `0°, 10°, 20°` POR SIGNO (reinician dentro de cada bloque de 30°).
  - Posición del texto: radio `R_deg_labels = R_ticks_inner + len10 + (0.012 R)`
  - Tamaño tipográfico: `labelSize = clamp(8px, 0.022 * size, 12px)`
  - Alineación: horizontal, `text-anchor: middle`, `dominant-baseline: middle`.
  - Color (tema claro): gris muy oscuro/negro; (tema violeta): violeta claro `#d0c1ff` con `opacity 0.7`.

Fórmula de punto para cada tick en ángulo `θ = absToRad(deg)`:
- Punto interior: `(x1, y1) = (cx + R_ticks_inner * cosθ, cy - R_ticks_inner * sinθ)`
- Punto exterior: `(x2, y2) = (cx + (R_ticks_inner + len) * cosθ, cy - (R_ticks_inner + len) * sinθ)`

---

## 4) Signos (anillo de 12 sectores)

- Doce divisiones a cada 30°; líneas divisorias desde `R_signs_inner` a `R_signs_outer`.
- Símbolo del signo centrado angularmente a `start + 15°`, radialmente en el medio del anillo: `R_sign_symbol = (R_signs_inner + R_signs_outer)/2`.
- Margen anti‑solapamiento con los números de grados: mantener una separación radial mínima de `≥ 0.012 R` respecto a `R_deg_labels`.
- Tamaño símbolo de signo: `signSize = clamp(14px, 0.030 * size, 24px)`.
- Color (tema claro Astro‑Seek): paleta por elemento (Fuego naranja, Tierra verde oliva, Aire azul, Agua azul verdoso). Para tema violeta: gradación `#d0c1ff → #4c3dff`.

---

## 5) Casas (cúspides, grosor y números)

- Cada cúspide `cusp[i]` es una línea radial desde el CENTRO `(cx,cy)` hasta `R_house_line_end` (≈ borde interno del anillo de signos). En la imagen de Astro‑Seek las casas llegan “hasta” el aro de signos y no atraviesan la corona de ticks.
- Jerarquía de grosores (tema claro):
  - Angulares: casas 1,4,7,10 → `strokeWidth 2.0..2.6 px`, color negro o gris muy oscuro.
  - Sucedentes: 2,5,8,11 → `strokeWidth 1.2..1.6 px`, gris medio.
  - Cadentes: 3,6,9,12 → `strokeWidth 0.8..1.2 px`, gris claro.
- Ejes (ASC/DSC/MC/IC):
  - Misma línea de cúspide pero destacar con mayor grosor o overlay.
  - Etiquetas:
    - ASC y DSC (casa 1 y 7) en el borde externo (`R_ticks_outer + 8..12 px`), texto pequeño, mayúsculas.
    - MC (casa 10) e IC (casa 4) también en el borde externo. MC SIEMPRE desde cúspide 10 (no `ASC+90`).
- Números de casa:
  - Se ubican en el PUNTO MEDIO angular de la casa: `span = deltaPos(cusp[i], cusp[i+1]); mid = normalize(cusp[i] + span/2)`.
  - Radio del número: `R_house_numbers ≈ 0.72 R`.
  - Fondo: pequeño rectángulo o texto directo (Astro‑Seek usa un rectángulo blanco fino tema claro).
  - Tamaño: `houseNumberSize = clamp(9px, 0.018 * size, 12px)`.

---

## 6) Planetas (símbolo y rotulación)

- Posición de cada planeta por su longitud absoluta en `R_planets`.
- Símbolo de planeta centrado en `(px,py)` con `planetSize = clamp(12px, 0.026 * size, 22px)`.
- Rotulación (dos estilos típicos en Astro‑Seek):
  1. Estilo A (frecuente en tema claro clásico): SOLO glifos en la rueda; las cifras de grados se listan aparte (tabla inferior).  
  2. Estilo B (alternativo): glifo + `deg° min′ signo` junto al glifo.  

  En la imagen adjunta predomina el Estilo A (solo glifos). Si se usa Estilo B:
  - Cálculo de grados/minutos dentro del signo:
    - `degInSign = normalize(long) % 30`
    - `deg = floor(degInSign)`
    - `min = round((degInSign - deg) * 60)` con carry `if (min === 60) { deg=(deg+1)%30; min=0 }`
  - Rotulación: `"☉ 24° ♌ 30′"` o `"24°30′ ♌"` a `py + 0.9 * planetSize`.
  - `℞` (retrógrado) en `tspan` pequeño a `dx=+0.1em, dy=-0.4em`.
- Anti‑colisión (opcional pero recomendado): si |Δλ| < 10° entre dos planetas, desplazar radialmente por niveles: `R_planets + k * (0.03 R)` alternando `k ∈ {0,1,2}` para que no se superpongan.

---

## 7) Aspectos (malla interna)

- Dibujo ANTES de glifos planetarios (para que queden por debajo): entre `(cx + R_aspects*cosθ, cy - R_aspects*sinθ)` de cada par.
- Colores (tema claro Astro‑Seek):
  - Armónicos: trígono y sextil → azul medio `#4E82FF ~ #6DB6FF`.
  - Tensos: cuadratura y oposición → rojo `#FF6363 ~ #FF6B6B`.
  - Conjunción: gris `#B6B6C9`.
- Grosor y opacidad:
  - `strokeWidth`: 0.7..1.0 px (oposición y cuadratura apenas más gruesas).
  - Opacidad según orbe (|orb|): `opacity = clamp(0.15, 1 - |orb|/maxOrb, 0.6)` con `maxOrb ≈ 10°`.
- Líneas continuas (no punteadas) en el estilo de la imagen; punteados opcionales para aspectos menores.

---

## 8) Orden de dibujo (z‑index lógico)

1. Fondo y anillos guía.
2. Corona de ticks (1°, 5°, 10°) y números `0/10/20` por signo.
3. División de signos y símbolos de signos.
4. Líneas de casas (incluyendo ejes reforzados).
5. Números de casa (midpoints) con rectángulo de fondo.
6. Aspectos (malla interna).
7. Glifos planetarios (y, si aplica, sus etiquetas `deg° min′ signo`).
8. Etiquetas de ejes ASC/DSC/MC/IC en el borde extremo.

---

## 9) Tipografías y proporciones

- Todas las fuentes deben escalar con `size`:
  - Símbolos de signos: `0.030 * size` (14..24 px).
  - Números de grados (0/10/20): `0.022 * size` (8..12 px).
  - Números de casa: `0.018 * size` (9..12 px).
  - Glifos planetas: `0.026 * size` (12..22 px).
  - Etiquetas planetarias (si se usan): `0.018 * size` (7..12 px).
  - Etiquetas de ejes (ASC/MC/DSC/IC): `0.017 * size` (8..12 px).
- Alineación de textos: sin rotación (horizontal), `text-anchor: middle`, `dominant-baseline: middle` para mantener legibilidad.

---

## 10) Espaciados y respiración visual

- Separar radialmente: `R_signs_outer + 0.01R ≤ R_ticks_inner` para evitar que símbolos de signos choquen con la corona de números.
- Mantener `≥ 0.012 R` entre las etiquetas de grados (0/10/20) y los símbolos de signos.
- Las líneas de casas deben detenerse en `R_signs_inner` para no entrar en la corona de ticks.
- La red de aspectos debe tener un margen claro respecto al disco central: `R_inner ≤ 0.32 R`.

---

## 11) Colores sugeridos

- Tema claro (imagen adjunta de Astro‑Seek):
  - Fondo: blanco/gris muy claro.
  - Ticks y líneas: negro/grises escalonados (10° más oscuros).
  - Signos: paleta por elemento (fuego naranja, tierra verde oliva, aire azul, agua turquesa), saturación moderada.
  - Casas: líneas negras (ejes más gruesos), grises para las demás.
  - Aspectos: azul (armónicos), rojo (tensos), gris (conjunción).
  - Glifos planetas: color por planeta, saturación moderada.
- Tema violeta (alternativo moderno):
  - Fondo radial: `#1a1a2e → #0a0a18`.
  - Ticks: `#bda9ff` opacidad 0.3–0.6.
  - Signos: `#d0c1ff`.
  - Casas: `#9a7bff` (angulares `#c4b5ff`).
  - Aspectos: azul `#6db6ff`, rojo `#ff6b6b`, conjunción `#b6b6c9`.
  - Planetas: `#ffd45e` (Sol), `#cfd5e6` (Luna), resto en violetas/cian sutiles.

---

## 12) Pseudocódigo clave

```ts
const normalize = (d:number)=>((d%360)+360)%360;
const deltaPos = (a:number,b:number)=>normalize(b-a);
const absToRad = (abs:number)=> ( (180 - normalize(abs)) * Math.PI / 180 );

// Midpoint de una casa i
const midHouse = (cusp_i:number, cusp_next:number)=> normalize(cusp_i + deltaPos(cusp_i, cusp_next)/2);

// Ticks 0..359
for (let deg=0; deg<360; deg++) {
  const r0 = R_ticks_inner;
  const is10 = deg%10===0, is5 = deg%5===0 && !is10;
  const len = is10? len10 : is5? len5 : len1;
  line(polar(cx,cy,r0,deg), polar(cx,cy,r0+len,deg));
}

// Etiquetas 0/10/20 por signo
for (let s=0; s<12; s++) for (const d of [0,10,20]) {
  const abs = s*30 + d;
  text(polar(cx,cy,R_deg_labels,abs), `${d}°`);
}

// Casas
for (let i=1; i<=12; i++) {
  const c = cusp[i], n = cusp[i%12+1];
  line(center, polar(cx,cy,R_house_line_end,c));
  const mid = midHouse(c,n);
  text(polar(cx,cy,R_house_numbers,mid), `${i}`);
}

// Planetas
for (p of planets){
  glyph(polar(cx,cy,R_planets,p.long), symbol[p.name]);
}

// Aspectos (dibujar antes de glifos)
for (a of aspects){
  const p1 = find(a.planet1), p2 = find(a.planet2);
  line(polar(cx,cy,R_aspects,p1.long), polar(cx,cy,R_aspects,p2.long), colorByAspect(a));
}
```

---

## 13) Checklist de verificación (pixel‑perfect)

- [ ] 0° Aries a la IZQUIERDA; signos crecen ANTIHORARIO.
- [ ] Corona de 360 ticks con jerarquía 1°/5°/10°.
- [ ] Números `0/10/20` por cada signo (36 etiquetas), sin pisar símbolos.
- [ ] Signos centrados en el tramo de 30° y dentro de su banda (sin solapar números de grado).
- [ ] Líneas de casas desde el centro hasta `R_signs_inner` con grosores jerárquicos; ejes resaltados.
- [ ] Números de casa en midpoint entre cúspides, a `R_house_numbers`.
- [ ] Planetas dentro del anillo interior, sin superposición visible (anti‑colisión si es necesario).
- [ ] Aspectos en malla interna, colores según tipo y opacidad por orbe.
- [ ] Etiquetas ASC/DSC/MC/IC en el borde más externo.
- [ ] Escalado correcto: al variar `size`, todo mantiene proporciones y legibilidad.

---

## 14) Consideraciones adicionales de la imagen adjunta

- La variante concreta del gráfico de Astro‑Seek mostrado utiliza tema claro, ejes acentuados (barras más gruesas) y **no muestra** el `deg° min′ signo` junto al glifo en la rueda (los valores detallados aparecen en tabla inferior). Es una configuración válida y muy común.  
- En otras variantes de Astro‑Seek, los grados/minutos pueden acompañar al glifo; esta especificación soporta ambas modalidades (Estilo A: solo glifos; Estilo B: glifo + texto).  
- El borde externo incluye además pequeñas marcas auxiliares en la banda de casas (ticks internos en el aro de casas); son opcionales y se pueden emular con un segundo set de micro‑ticks en `R_house_numbers ± (0.02 R)`.

---

## 15) Resumen de constantes recomendadas (valores por defecto)

- Radios (en fracciones de R):
  - `R_inner=0.32`, `R_aspects=0.52`, `R_planets=0.60`, `R_house_numbers=0.72`, `R_signs_inner=0.84`, `R_signs_outer=0.92`, `R_ticks_inner=0.93`, `R_ticks_outer=1.00`.
- Ticks: `len1=0.012R`, `len5=0.020R`, `len10=0.030R`.
- Tipos de línea: `strokeWidth`: casas cadentes 0.9 px, sucedentes 1.3 px, angulares 2.1 px; ejes 2.4..2.6 px.
- Tamaños de texto: signos 0.030·size, números 0/10/20 → 0.022·size, números de casa 0.018·size, glifos 0.026·size.

---

## 16) Glosario (símbolos sugeridos)

- Signos: `['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']`
- Planetas: `☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇`
- Puntos opcionales: Nodo ☊/☋, Lilith ⚸, Fortuna ⊙, Quirón ⚷, Vertex Vx (tipografía simple).

---

## 17) Licencia de uso del modelo

Este documento describe una **geometría funcional** basada en convenciones astronómicas estándar observadas en visualizaciones como las de Astro‑Seek. No incluye assets gráficos propietarios; los colores y glifos indicados son de uso común o derivados de fuentes libres.

---

Con esta especificación, cualquier motor puede reconstruir una rueda natal con la **misma disposición geométrica** del ejemplo de Astro‑Seek y ajustarla a distintos temas de color.
