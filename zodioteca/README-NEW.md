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

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/igwlord/AstroLab.git
cd AstroLab/zodioteca

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con HMR
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

---

## 🏗️ Arquitectura

### Estructura de Carpetas

```
zodioteca/
├── public/          # Assets estáticos
│   ├── fonts/       # Fuentes personalizadas
│   └── media/       # Imágenes y recursos
├── src/
│   ├── components/  # Componentes React reutilizables
│   ├── pages/       # Páginas principales
│   ├── services/    # Lógica de negocio y APIs
│   │   └── exercises/  # Sistema de generación de ejercicios
│   ├── store/       # Estado global (Zustand)
│   ├── utils/       # Utilidades y helpers
│   ├── types/       # Definiciones TypeScript
│   ├── styles/      # Estilos globales
│   ├── i18n/        # Internacionalización
│   └── config/      # Configuración de la app
├── scripts/         # Scripts de utilidad
└── netlify.toml     # Configuración de deployment
```

### Tecnologías Clave

- **React 18**: UI library con Hooks
- **TypeScript**: Type safety
- **Vite**: Build tool ultrarrápido
- **Tailwind CSS**: Utility-first styling
- **Zustand**: State management ligero
- **React Router**: Client-side routing
- **Swiss Ephemeris**: Cálculos astronómicos precisos
- **Supabase**: Backend y autenticación (opcional)

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase (opcional - solo si usas favoritos con sync)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima

# Configuración de la app
VITE_APP_VERSION=2.0.0
```

**Nota:** El proyecto funciona completamente sin backend, usando localStorage local.

---

## 🎨 Personalización

### Temas

Los colores principales se definen en `tailwind.config.js`. El modo oscuro es automático según preferencias del sistema.

### Sistemas de Casas

Configurables en `src/config/houseSystemsConfig.ts`. Actualmente soporta:
- Placidus (default)
- Koch
- Equal House
- Whole Sign
- Campanus
- Regiomontanus
- Porphyry
- Alcabitius

---

## 📱 PWA y Offline

La aplicación es instalable como PWA y funciona offline gracias a:
- Service Worker (Vite PWA Plugin)
- Manifest.json configurado
- Caching estratégico de assets

Para generar iconos PWA:
```bash
npm run generate-icons
```

---

## 🧪 Testing

```bash
npm run test          # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Coverage report
```

---

## 🚀 Deployment

### Netlify (Recomendado)

El proyecto está configurado para deployment automático en Netlify:

1. Conecta tu repositorio en Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Las variables de entorno se configuran en Netlify UI

El archivo `netlify.toml` incluye:
- Redirects para SPA routing
- Headers de seguridad
- Cache optimization

---

## 📊 Performance

### Optimizaciones Implementadas

- ✅ Code splitting por rutas
- ✅ Lazy loading de componentes pesados
- ✅ Skeleton loaders para mejor UX
- ✅ Image optimization
- ✅ Tree shaking automático (Vite)
- ✅ CSS purging (Tailwind)

### Métricas Objetivo

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## 🐛 Debugging

### Logger Utility

El proyecto usa un logger centralizado en `src/utils/logger.ts`:

```typescript
import { logger } from './utils/logger';

logger.log('Info message');    // Solo en dev
logger.error('Error message'); // Siempre visible
logger.warn('Warning');        // Solo en dev
```

Los logs se filtran automáticamente en producción.

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 👥 Contribución

Para contribuir al proyecto:
1. Crea un branch desde `main`
2. Realiza tus cambios con commits descriptivos
3. Asegúrate de que pasen los tests y lint
4. Crea un Pull Request

### Convenciones de Commits

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Formato, punto y coma faltantes, etc.
refactor: Refactorización de código
perf: Mejoras de performance
test: Agregar tests
chore: Cambios en build, dependencias, etc.
```

---

## 📞 Soporte

Para reportar bugs o sugerencias, crea un issue en GitHub.

---

## 🗺️ Roadmap

### v2.1 (Próximo)
- [ ] Integración completa con Supabase
- [ ] Sistema de usuarios y perfiles
- [ ] Compartir cartas natales públicamente
- [ ] Tránsitos en tiempo real
- [ ] Comparación de cartas (Sinastría)

### v3.0 (Futuro)
- [ ] Progresiones secundarias
- [ ] Revoluciones solares
- [ ] Astrocartografía
- [ ] App móvil nativa

---

**Hecho con ❤️ y ✨ por el equipo de AstroLab**
