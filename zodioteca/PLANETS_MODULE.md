# Módulo de Planetas Astrológicos

## 📝 Descripción

Este módulo implementa una interfaz visual impactante para explorar los 10 planetas astrológicos con información holística completa, incluyendo chakras, frecuencias vibratorias y ejercicios de integración.

## 🎯 Características

### Información por Planeta

Cada planeta incluye:

- **Descripción extensa**: Esencia arquetípica, dones y desafíos
- **Manifestación cotidiana**: Cómo se expresa en la vida diaria
- **Características astrológicas**:
  - Ritmo (personal/social/transpersonal)
  - Regencia (signos que rige)
  - Exaltación
  - Casa natural

- **Dimensión holística**:
  - Color asociado
  - Chakra correspondiente
  - Frecuencia vibratoria (Hz)
  - Reproducción de audio de la frecuencia
  - Ejercicio holístico de integración

### Interfaz Visual

1. **Grid de Planetas**: Muestra los 10 planetas en tarjetas interactivas con:
   - Símbolo del planeta (emoji)
   - Nombre
   - Ritmo (personal/social/transpersonal)
   - Gradiente de color según categoría
   - Efectos hover animados
   - **Filtros por categoría**: Todos, Personales, Sociales, Transpersonales

2. **Modal Detallado**: Al hacer clic en un planeta se abre un modal con:
   - Header con gradiente de la categoría
   - Badges de características
   - Secciones organizadas con información completa
   - Botón para reproducir la frecuencia vibratoria
   - Diseño responsive y accesible

3. **Leyenda de Categorías**: Panel informativo con las 3 categorías planetarias

## 🎨 Categorías y Colores

Cada categoría tiene su propio esquema visual:

- **⭐ Personales** (Sol, Luna, Mercurio, Venus, Marte): Ámbar → Naranja → Rojo
- **🌍 Sociales** (Júpiter, Saturno): Azul → Índigo → Púrpura
- **✨ Transpersonales** (Urano, Neptuno, Plutón): Púrpura → Violeta → Fucsia

## 🪐 Los 10 Planetas

### Planetas Personales (5)
1. ☉ **Sol** - Identidad y propósito (528 Hz)
2. ☽ **Luna** - Emoción y seguridad (639 Hz)
3. ☿ **Mercurio** - Mente y comunicación (741 Hz)
4. ♀ **Venus** - Amor y belleza (528/639 Hz)
5. ♂ **Marte** - Acción y deseo (396 Hz)

### Planetas Sociales (2)
6. ♃ **Júpiter** - Expansión y sabiduría (852 Hz)
7. ♄ **Saturno** - Disciplina y estructura (396 Hz)

### Planetas Transpersonales (3)
8. ♅ **Urano** - Innovación y cambio (741/963 Hz)
9. ♆ **Neptuno** - Espiritualidad y sueños (963 Hz)
10. ♇ **Plutón** - Transformación profunda (417 Hz)

## 🔊 Frecuencias Vibratorias

Los archivos de audio se encuentran en `/public/media/`:

- 396 Hz: Marte, Saturno (liberación y estructura)
- 417 Hz: Plutón (facilitación del cambio)
- 528 Hz: Sol, Venus (transformación y amor)
- 639 Hz: Luna, Venus (relaciones y emoción)
- 741 Hz: Mercurio, Urano (expresión y claridad)
- 852 Hz: Júpiter (intuición espiritual)
- 963 Hz: Urano, Neptuno (conexión divina)

## 📁 Estructura de Archivos

```
src/
├── types/
│   └── planet.ts              # Definición de tipos y datos de planetas
├── components/
│   ├── PlanetsGrid.tsx        # Grid principal de planetas
│   └── PlanetModal.tsx        # Modal con información detallada
└── pages/
    └── GlossaryPage.tsx       # Integración con glosario
```

## 🎯 Uso

1. Navega a la página del Glosario
2. Selecciona la categoría "🪐 Planetas"
3. El grid de planetas reemplaza automáticamente las entradas del glosario
4. Usa los filtros para ver solo Personales, Sociales o Transpersonales
5. Haz clic en cualquier planeta para ver su información completa
6. Usa el botón "▶️ Escuchar" para reproducir la frecuencia vibratoria

## 🎨 Filtros Disponibles

- **🪐 Todos** (10 planetas)
- **⭐ Personales** (5 planetas)
- **🌍 Sociales** (2 planetas)
- **✨ Transpersonales** (3 planetas)

## ⌨️ Atajos de Teclado

- `ESC`: Cerrar modal
- Clic fuera del modal: Cerrar modal

## 🎨 Animaciones

- **fadeIn**: Aparición suave del fondo del modal
- **scaleIn**: Zoom suave del contenido del modal
- **hover**: Efectos de escala y sombra en las tarjetas
- **pulse**: Animación del símbolo en el header

## 🔧 Personalización

Para agregar o modificar planetas, edita el array `PLANETS` en `src/types/planet.ts`.

## 📱 Responsive

El diseño se adapta a diferentes tamaños de pantalla:

- **Mobile**: Grid de 2 columnas
- **Tablet**: Grid de 3-4 columnas
- **Desktop**: Grid de 5 columnas
- **Modal**: Altura máxima del 90% del viewport con scroll interno

## 🌙 Modo Oscuro

Todos los componentes soportan modo oscuro automático con:
- Fondos semitransparentes
- Textos contrastantes
- Gradientes ajustados

## 🔗 Integración con Signos

Este módulo sigue la misma arquitectura que el módulo de Signos Zodiacales:
- Misma estructura de componentes (Grid + Modal)
- Mismo sistema de reproducción de frecuencias
- Misma integración con GlossaryPage
- Diseño visual consistente

## ✨ Mejoras Futuras

- [ ] Búsqueda de planetas por nombre
- [ ] Información de aspectos entre planetas
- [ ] Tránsitos planetarios en tiempo real
- [ ] Relación de planetas con la carta natal del usuario
- [ ] Animaciones de órbitas planetarias
- [ ] Comparación entre dos planetas
- [ ] Exportar información en PDF

---

**Desarrollado para Zodioteca Astrology App** 🪐⭐
