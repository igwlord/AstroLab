# 🌟 AstroLab - Plataforma Integral de Astrología

**Versión:** 2.0.0  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS  
**Deployment:** Netlify  

---

## 📖 Descripción

AstroLab es una aplicación web moderna de astrología que ofrece análisis profundos de cartas natales, ejercicios holísticos personalizados, gestión de favoritos y contenido educativo sobre astrología.

### ✨ Características Principales

- 🎯 **Carta Natal Completa**: Cálculo preciso con Swiss Ephemeris
  - Planetas, casas, aspectos y puntos especiales
  - Múltiples sistemas de casas (Placidus, Koch, Equal, etc.)
  - Dignidades esenciales y accidentales
  - Formas de carta (Bundle, Bucket, Locomotive, etc.)
  
- 🧘 **Plan de Ejercicios Personalizado**: Sistema inteligente de 21 días
  - Generación basada en análisis astrológico profundo
  - 3 fases progresivas (fácil → medio → variado)
  - Tracking de progreso y rachas diarias
  - Onboarding para nuevos usuarios
  
- ⭐ **Sistema de Favoritos**: Guarda y organiza contenido
  - Filtros por categoría (signos, planetas, aspectos, etc.)
  - Export/Import en JSON
  - Navegación directa al contenido original
  
- 🎨 **Glosario Interactivo**: Más de 200 entradas
  - Signos zodiacales con descripciones detalladas
  - Casas astrológicas y su significado
  - Planetas y cuerpos celestes
  - Aspectos y configuraciones
  
- 🌓 **Modo Oscuro**: Tema adaptable con persistencia
- 📱 **PWA**: Instalable y funciona offline
- 🌐 **i18n Ready**: Infraestructura para múltiples idiomas

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
