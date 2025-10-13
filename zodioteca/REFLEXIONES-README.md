# 💭 Sistema de Reflexiones Astrológicas

## Descripción
Sistema completo de journal/reflexiones para AstroLab Zodioteca. Permite a los usuarios documentar sus descubrimientos, insights y pensamientos sobre su carta natal y práctica astrológica.

## 🎯 Características

### ✅ Implementado
- **CRUD Completo**: Crear, leer, actualizar y eliminar reflexiones
- **Búsqueda Full-text**: Buscar en títulos y contenido
- **Sistema de Tags**: Crear y filtrar por etiquetas personalizadas
- **Estadísticas**: Total de reflexiones, mes actual y semana actual
- **UI Cósmica**: Diseño consistente con gradientes morados/azules y animaciones Framer Motion
- **Responsive**: Grid adaptable (1/2/3 columnas según dispositivo)
- **Seguridad**: Row Level Security (RLS) en Supabase - cada usuario solo ve sus reflexiones
- **Navegación**: Accesible desde Navbar y botón en página de Ejercicios
- **Estados Visuales**: Loading, empty states, confirmación de eliminación

### 🔄 Próximamente
- Vincular reflexión con carta natal específica
- Export a PDF/texto
- Contador de palabras y tiempo de lectura
- Ordenamiento personalizado

## 📁 Estructura de Archivos

```
zodioteca/
├── src/
│   ├── pages/
│   │   └── ReflexPage.tsx              # Página principal
│   ├── components/
│   │   ├── ReflectionCard.tsx          # Tarjeta individual
│   │   ├── ReflectionModal.tsx         # Modal crear/editar
│   │   └── ReflectionDeleteConfirm.tsx # Confirmación eliminación
│   ├── services/
│   │   └── reflectionsService.ts       # CRUD con Supabase
│   ├── hooks/
│   │   └── useReflections.ts           # Hook personalizado
│   ├── types/
│   │   └── reflection.ts               # TypeScript types
│   └── constants/
│       └── reflections.ts              # Mensajes y configuración
└── supabase/
    └── migrations/
        └── 20251013000000_create_user_reflections.sql
```

## 🗄️ Base de Datos

### Tabla: `user_reflections`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- chart_id: TEXT (Nullable - vinculación opcional)
- title: TEXT (NOT NULL)
- content: TEXT (NOT NULL)
- tags: TEXT[] (Array de strings)
- created_at: TIMESTAMPTZ (auto)
- updated_at: TIMESTAMPTZ (auto con trigger)
```

### Índices
- `idx_user_reflections_user_id` - Optimiza queries por usuario
- `idx_user_reflections_created_at` - Ordenamiento por fecha
- `idx_user_reflections_chart_id` - Filtrado por carta (parcial index)

### Row Level Security (RLS)
✅ Políticas activas:
- **SELECT**: Usuario solo ve sus reflexiones
- **INSERT**: Usuario solo crea en su nombre
- **UPDATE**: Usuario solo modifica sus reflexiones
- **DELETE**: Usuario solo elimina sus reflexiones

## 🚀 Uso

### Acceder a Reflexiones
1. **Navbar**: Click en "💭 Reflexiones"
2. **Ejercicios**: Botón "Mis Reflexiones" debajo de "Cambiar Carta"

### Crear Reflexión
1. Click en "Nueva Reflexión" (botón morado/azul)
2. Escribir título y contenido
3. (Opcional) Agregar tags
4. Click en "Guardar"

### Editar Reflexión
1. Hover sobre tarjeta → aparece botón "Editar" (azul)
2. Modificar campos
3. Click en "Actualizar"

### Eliminar Reflexión
1. Hover sobre tarjeta → aparece botón "Eliminar" (rojo)
2. Confirmar en modal
3. Reflexión eliminada permanentemente

### Filtrar y Buscar
- **Búsqueda**: Barra superior - busca en títulos y contenido
- **Tags**: Click en tag para filtrar, click de nuevo para quitar filtro
- **Limpiar**: Botón "Limpiar filtros" para reset

## 🎨 Diseño

### Paleta de Colores
- **Primario**: Gradientes purple-900 → indigo-900 → blue-900
- **Acentos**: purple-500, blue-500, pink-500
- **Estados**: 
  - Crear/Editar: blue-500
  - Eliminar: red-500/600
  - Activo: purple-500

### Animaciones
- **Framer Motion**: Fade in, scale, slide
- **Hover**: Scale 1.05, shadow glow
- **Modal**: Slide from center con backdrop blur

### Responsive Breakpoints
- **Mobile** (<768px): 1 columna
- **Tablet** (768-1024px): 2 columnas
- **Desktop** (>1024px): 3 columnas

## 🔧 API del Servicio

```typescript
// CRUD básico
getReflections(filters?: ReflectionFilters): Promise<Reflection[]>
getReflection(id: string): Promise<Reflection | null>
createReflection(input: ReflectionInput): Promise<Reflection>
updateReflection(id: string, update: ReflectionUpdate): Promise<Reflection>
deleteReflection(id: string): Promise<void>

// Queries especiales
getReflectionStats(): Promise<ReflectionStats>
getReflectionsByChart(chartId: string): Promise<Reflection[]>
```

## 🪝 Hook Personalizado

```typescript
const {
  reflections,        // Array de reflexiones
  stats,              // Estadísticas
  loading,            // Estado de carga
  error,              // Mensajes de error
  createNewReflection,
  updateExistingReflection,
  removeReflection,
  refreshReflections,
  refreshStats,
} = useReflections();
```

## 🧪 Testing Manual

### Checklist Básico
- [ ] Crear reflexión vacía → debe mostrar error de validación
- [ ] Crear reflexión válida → aparece en lista
- [ ] Editar reflexión → cambios se guardan
- [ ] Eliminar reflexión → modal de confirmación
- [ ] Cancelar eliminación → reflexión permanece
- [ ] Buscar "Luna" → muestra solo resultados relevantes
- [ ] Crear tag nuevo → aparece en lista de filtros
- [ ] Filtrar por tag → muestra solo reflexiones con ese tag
- [ ] Refrescar página → reflexiones persisten
- [ ] Logout/Login → ver solo mis reflexiones

### Test de Seguridad RLS
1. Login con Usuario A → crear 3 reflexiones
2. Logout
3. Login con Usuario B → no debe ver reflexiones de Usuario A
4. Usuario B crea 2 reflexiones
5. Verificar que cada usuario solo ve las suyas

## 📊 Performance

### Optimizaciones Implementadas
- **Lazy Loading**: ReflexPage cargado bajo demanda
- **Índices DB**: Queries optimizadas con índices compuestos
- **Filters Client-Side**: No recarga desde DB en cada filtro
- **Memoización**: useCallback en operaciones costosas

### Métricas Objetivo
- Primera carga: <2s
- Crear reflexión: <500ms
- Filtrar/buscar: <100ms (client-side)
- Animaciones: 60fps

## 🐛 Troubleshooting

### "Cannot find module ReflectionCard"
- **Solución**: Reinicia el servidor de desarrollo (Ctrl+C → `npm run dev`)

### "Error al cargar reflexiones"
- **Verificar**: Conexión a Supabase en `.env`
- **Verificar**: Migración ejecutada en Supabase Dashboard
- **Verificar**: RLS policies activas

### Reflexiones no aparecen
- **Verificar**: Usuario autenticado (check auth.uid())
- **Verificar**: user_id en reflexiones coincide con auth.users.id
- **Abrir**: Developer Tools → Console para ver errores

### Lag al filtrar muchas reflexiones
- **Solución**: Implementar paginación (próxima fase)
- **Workaround**: Limitar visualización a últimas 50

## 📝 Notas del Desarrollador

### Decisiones de Diseño
1. **Tags como array**: PostgreSQL array nativo en lugar de tabla join
2. **chart_id TEXT**: Flexible para diferentes formatos de ID
3. **Soft delete NO**: Eliminación permanente (simplicidad)
4. **Client-side filtering**: Mejor UX, menos llamadas a DB

### Futuras Mejoras
- [ ] Rich text editor (Tiptap o similar)
- [ ] Markdown support en contenido
- [ ] Imágenes en reflexiones
- [ ] Compartir reflexión pública (URL único)
- [ ] Backup automático mensual
- [ ] Sugerencias de IA basadas en carta natal

## 🤝 Contribuir

Para agregar features:
1. Actualizar `REFLEXIONES-TODO.md`
2. Crear branch: `feature/reflexiones-[nombre]`
3. Implementar + tests
4. PR con descripción detallada

---

**Creado**: 2025-10-13  
**Última actualización**: 2025-10-13  
**Estado**: ✅ Core Features Completados  
**Versión**: 1.0.0
