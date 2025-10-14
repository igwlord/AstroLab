# To-Do List: Sistema de Reflexiones en Ejercicios

## Objetivo
Implementar un sistema de reflexiones/pensamientos en la sección de Ejercicios de Zodioteca, donde los usuarios pueden escribir y guardar sus reflexiones personales vinculadas a sus cartas astrales.

---

## Fase 1: Limpieza de Cosmonario ✅
- [x] Eliminar carpeta completa `src/cosmonario/` (components, hooks, pages, types, utils)
- [x] Remover ruta `/cosmonario` de `App.tsx`
- [x] Limpiar imports de Cosmonario en `App.tsx`
- [x] Evaluar si desinstalar `@dnd-kit/core` (si no se usa en otro lugar)
- [x] Eliminar o archivar `Cosmojuego.md` (nunca se creó)
- [ ] Commit de limpieza: "Remove Cosmonario module" (pendiente por solicitud del usuario)

---

## Fase 2: Base de Datos (Supabase) ✅
- [x] Crear migración SQL para tabla `user_reflections`:
  ```sql
  CREATE TABLE user_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    chart_id UUID NULL REFERENCES user_natal_charts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Crear índices para optimización:
  ```sql
  CREATE INDEX idx_user_reflections_user_id ON user_reflections(user_id);
  CREATE INDEX idx_user_reflections_created_at ON user_reflections(created_at DESC);
  CREATE INDEX idx_user_reflections_chart_id ON user_reflections(chart_id);
  ```
- [ ] Configurar Row Level Security (RLS):
  ```sql
  ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Users can view own reflections"
    ON user_reflections FOR SELECT
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert own reflections"
    ON user_reflections FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update own reflections"
    ON user_reflections FOR UPDATE
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete own reflections"
    ON user_reflections FOR DELETE
    USING (auth.uid() = user_id);
  ```
- [ ] Ejecutar migración en Supabase Dashboard o CLI
- [ ] Verificar políticas RLS funcionando correctamente

---

## Fase 3: Tipos TypeScript ✅
- [x] Crear archivo `src/types/reflection.ts`:
  ```typescript
  export interface Reflection {
    id: string;
    user_id: string;
    chart_id?: string | null;
    title: string;
    content: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
  }

  export interface ReflectionInput {
    title: string;
    content: string;
    chart_id?: string | null;
    tags?: string[];
  }
  ```
- [ ] Exportar tipos en `src/types/index.ts` (si existe)

---

## Fase 4: Servicio de Reflexiones ✅
- [x] Crear archivo `src/services/reflectionsService.ts` con funciones:
  ```typescript
  // CRUD básico
  - createReflection(data: ReflectionInput): Promise<Reflection>
  - getReflections(userId: string, limit?: number): Promise<Reflection[]>
  - getReflectionById(id: string): Promise<Reflection | null>
  - updateReflection(id: string, data: Partial<ReflectionInput>): Promise<Reflection>
  - deleteReflection(id: string): Promise<void>
  
  // Queries especiales
  - getReflectionsByChart(chartId: string): Promise<Reflection[]>
  - searchReflections(userId: string, query: string): Promise<Reflection[]>
  ```
- [ ] Implementar manejo de errores con try-catch
- [ ] Agregar logs para debugging
- [ ] Testear cada función manualmente en consola

---

## Fase 5: Componentes UI - Página Principal ✅
- [x] Crear `src/pages/ReflexPage.tsx` con:
  - Header con título "Mis Reflexiones" y botón "Nueva Reflexión"
  - Lista de reflexiones (grid o lista)
  - Empty state cuando no hay reflexiones (mensaje motivador)
  - Filtros: buscar por texto, filtrar por carta, ordenar por fecha
  - Loading state (skeleton o spinner)
  - Error boundary
- [ ] Usar TailwindCSS para estilos consistentes con Zodioteca
- [ ] Implementar responsive design (móvil, tablet, desktop)

---

## Fase 6: Componentes UI - Tarjetas y Modal ✅
- [x] Crear `src/components/ReflectionCard.tsx`:
  - Mostrar título, preview de contenido (primeras 150 caracteres)
  - Fecha de creación (formato relativo: "hace 2 días")
  - Tags si existen
  - Botones: Ver completa, Editar, Eliminar
  - Hover effects y animaciones sutiles (Framer Motion)
- [x] Crear `src/components/ReflectionModal.tsx`:
  - Modo crear/editar (mismo componente)
  - Campo título (input)
  - Campo contenido (textarea grande, auto-resize)
  - Selector de carta asociada (dropdown opcional)
  - Input de tags (con chips removibles)
  - Contador de palabras/caracteres
  - Botones: Guardar, Cancelar
  - Validación: título y contenido obligatorios
- [x] Crear `src/components/ReflectionDeleteConfirm.tsx`:
  - Modal de confirmación antes de eliminar
  - Mostrar título de la reflexión a eliminar
  - Botones: Confirmar (rojo), Cancelar

---

## Fase 7: Integración en ExercisePlanPage ✅
- [x] Abrir `src/pages/ExercisePlanPage.tsx`
- [x] Localizar el botón "Cambiar Carta" (arriba a la derecha)
- [x] Agregar botón "💭 Mis Reflexiones" debajo de "Cambiar Carta"
- [x] Estilo del botón: consistente con diseño existente
- [x] Agregar navegación: `navigate('/reflexiones')` al hacer click
- [ ] Opcional: Badge con contador de reflexiones totales

---

## Fase 8: Routing ✅
- [x] Abrir `src/App.tsx`
- [x] Agregar import lazy: `const ReflexPage = lazy(() => import('./pages/ReflexPage'));`
- [x] Agregar ruta protegida:
  ```tsx
  <Route path="/reflexiones" element={
    <ProtectedRoute>
      <Layout>
        <ReflexPage />
      </Layout>
    </ProtectedRoute>
  } />
  ```
- [ ] Verificar que la ruta funciona correctamente

---

## Fase 9: Features Adicionales ✅
- [x] Agregar enlace en Navbar
- [x] Sistema de tags/etiquetas:
  - Crear tags on-the-fly
  - Filtrar por tag
- [x] Búsqueda full-text en títulos y contenido
- [x] Estadísticas (total, mes, semana)
- [x] Constantes para mensajes y configuración
- [ ] Vincular reflexión con carta actual al crearla desde ExercisePlanPage
- [ ] Ordenamiento: más recientes, más antiguas, alfabético
- [ ] Export individual a PDF o texto plano
- [ ] Export masivo de todas las reflexiones
- [ ] Contador de palabras y tiempo estimado de lectura

---

## Fase 10: UI/UX Polish ✅
- [x] Diseño consistente con theme cósmico de Zodioteca
- [x] Animaciones con Framer Motion:
  - Fade in al cargar reflexiones
  - Slide in al abrir modal
  - Scale en hover de tarjetas
- [x] Responsive design completo:
  - Mobile: lista vertical
  - Tablet: grid 2 columnas
  - Desktop: grid 3 columnas
- [x] Estados visuales claros:
  - Loading spinner mientras carga
  - Error handling en servicio
  - Empty state atractivo con diferentes mensajes
  - Confirmación de eliminación

---

## Fase 11: Custom Hook ✅
- [x] Crear `useReflections` hook personalizado
- [x] Encapsular lógica de estado y operaciones CRUD
- [ ] Testing y Debugging 🧪
- [ ] Probar CRUD completo:
  - Crear reflexión desde página de reflexiones
  - Crear reflexión vinculada a carta desde ejercicios
  - Editar reflexión existente
  - Eliminar reflexión con confirmación
  - Cancelar eliminación
- [ ] Verificar RLS en Supabase:
  - Usuario no puede ver reflexiones de otros
  - Usuario puede CRUD solo sus propias reflexiones
- [ ] Probar en diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Probar en móvil real (iOS y Android)
- [ ] Verificar performance con muchas reflexiones (100+)
- [ ] Revisar console para warnings/errors
- [ ] Testear con conexión lenta (throttling)

---

## Fase 12: Optimizaciones 🚀
- [ ] Implementar paginación o infinite scroll (si hay muchas reflexiones)
- [ ] Lazy loading de reflexiones
- [ ] Cache con React Query o SWR
- [ ] Debounce en búsqueda (300ms)
- [ ] Optimistic UI updates (actualizar UI antes de confirmar en DB)
- [ ] Comprimir contenido largo antes de guardar
- [ ] Agregar índice full-text en Postgres para búsquedas rápidas

---

## Fase 13: Documentación 📚
- [ ] Agregar comentarios en código complejo
- [ ] Crear README para el módulo de reflexiones (opcional)
- [ ] Documentar esquema DB y relaciones
- [ ] Actualizar changelog del proyecto
- [ ] Screenshots para documentación de usuario (opcional)

---

## Fase 14: Deploy y Monitoreo 🚢
- [ ] Commit final: "Add reflections system to Exercises section"
- [ ] Push a repositorio
- [ ] Verificar build en producción sin errores
- [ ] Probar en staging antes de production
- [ ] Deploy a producción
- [ ] Monitorear logs por 24h
- [ ] Recopilar feedback inicial de usuarios

---

## Notas Adicionales
- **Prioridad Alta**: Fases 1-8 (funcionalidad básica)
- **Prioridad Media**: Fases 9-11 (features y testing)
- **Prioridad Baja**: Fases 12-14 (optimización y deploy)

## Estimación de Tiempo
- Fases 1-8: ~2-3 días
- Fases 9-11: ~1-2 días
- Fases 12-14: ~1 día
- **Total**: 4-6 días de desarrollo

---

## Dependencias Existentes ✅
- React + TypeScript ✅
- TailwindCSS ✅
- Framer Motion ✅ (ya instalado)
- Supabase Client ✅
- React Router ✅
- Zustand ✅ (opcional para estado local)

## Nuevas Dependencias
- Ninguna requerida (todo ya está disponible)
