# Supabase Setup - Sistema de Favoritos

Este directorio contiene las migraciones SQL para el sistema de Favoritos de AstroLab/Zodioteca.

## 📁 Estructura

```
supabase/
├── migrations/
│   └── 20251011_create_favorites_table.sql  # Tabla, índices, RLS, funciones
└── README.md                                 # Este archivo
```

## 🚀 Aplicar Migraciones

### Opción 1: Supabase Dashboard (Recomendado para desarrollo)

1. Ve a tu proyecto en [app.supabase.com](https://app.supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `migrations/20251011_create_favorites_table.sql`
4. Ejecuta el script (RUN)

### Opción 2: Supabase CLI (Recomendado para producción)

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Inicializar proyecto local (solo primera vez)
supabase init

# Link a tu proyecto remoto
supabase link --project-ref tu-project-ref

# Aplicar migraciones
supabase db push

# O aplicar manualmente
supabase db execute --file supabase/migrations/20251011_create_favorites_table.sql
```

### Opción 3: Script directo (psql)

```bash
psql postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres \
  -f supabase/migrations/20251011_create_favorites_table.sql
```

## 📊 Schema Overview

### Tabla: `favorites`

| Columna             | Tipo        | Descripción                                    |
|---------------------|-------------|------------------------------------------------|
| `id`                | UUID        | Primary key                                    |
| `user_id`           | UUID        | FK a auth.users (owner)                        |
| `favorite_data`     | JSONB       | Datos completos del FavoriteItem               |
| `favorite_type`     | TEXT        | Tipo (glossary-sign, chart-aspect, etc.)       |
| `favorite_scope`    | TEXT        | Ámbito (global, chart)                         |
| `chart_id`          | UUID        | ID de carta (NULL para global)                 |
| `is_pinned`         | BOOLEAN     | Favorito fijado                                |
| `usage_count`       | INTEGER     | Contador de accesos                            |
| `last_accessed_at`  | TIMESTAMPTZ | Último acceso                                  |
| `created_at`        | TIMESTAMPTZ | Fecha de creación                              |
| `updated_at`        | TIMESTAMPTZ | Última actualización (auto-trigger)            |

### Índices Creados

- `idx_favorites_user_id` - Query principal por usuario
- `idx_favorites_type` - Filtrado por tipo
- `idx_favorites_scope` - Filtrado por ámbito
- `idx_favorites_chart_id` - Favoritos de carta específica
- `idx_favorites_pinned` - Favoritos fijados
- `idx_favorites_last_accessed` - Ordenamiento por recencia
- `idx_favorites_user_scope` - Composite para filtros combinados
- `idx_favorites_data_gin` - Búsqueda en JSONB

### Row Level Security (RLS)

✅ **Habilitado** - Los usuarios solo pueden acceder a sus propios favoritos

**Políticas:**
- `SELECT` - Solo favoritos propios
- `INSERT` - Solo con user_id propio
- `UPDATE` - Solo favoritos propios
- `DELETE` - Solo favoritos propios

## 🔧 Funciones Disponibles

### `touch_favorite(favorite_id UUID)`

Registra un acceso al favorito:
- Incrementa `usage_count` en +1
- Actualiza `last_accessed_at` a NOW()
- Actualiza `updated_at` a NOW()

```sql
-- Ejemplo de uso
SELECT public.touch_favorite('550e8400-e29b-41d4-a716-446655440000');
```

### `get_relevant_favorites(p_user_id UUID, p_limit INTEGER)`

Retorna favoritos ordenados por relevance score:

**Formula de scoring:**
```
score = (usageCount × 10) + (isPinned × 50) - (daysSinceLastAccess × 2)
```

```sql
-- Ejemplo: Top 10 favoritos más relevantes
SELECT * FROM public.get_relevant_favorites(auth.uid(), 10);
```

### `upsert_favorites(p_favorites JSONB)`

Sincronización bulk con merge strategy:
- **INSERT** si no existe
- **UPDATE** si existe y remote.updated_at > local.updated_at
- Retorna estadísticas de la operación

```sql
-- Ejemplo: Sincronizar múltiples favoritos
SELECT * FROM public.upsert_favorites('[
  {
    "favorite_type": "glossary-sign",
    "favorite_scope": "global",
    "favorite_data": {"title": "Aries", "icon": "♈"},
    "usage_count": 5,
    "is_pinned": true
  }
]'::JSONB);

-- Retorna: success, inserted_count, updated_count, error_message
```

## 🧪 Testing Local

### 1. Crear usuario de prueba

```sql
-- Insertar en auth.users (normalmente Supabase Auth lo hace)
INSERT INTO auth.users (id, email) 
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com');
```

### 2. Crear favoritos de prueba

```sql
-- Insertar favorito de prueba
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{"title": "Aries", "icon": "♈", "preview": {"summary": "Signo de fuego cardinal"}}'::JSONB,
  'glossary-sign',
  'global'
);
```

### 3. Verificar RLS

```sql
-- Como usuario autenticado
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

-- Debería retornar solo favoritos del usuario
SELECT * FROM public.favorites;

-- Como otro usuario (debería retornar vacío)
SET request.jwt.claim.sub = '00000000-0000-0000-0000-000000000002';
SELECT * FROM public.favorites;
```

## 📈 Monitoreo

### Ver estadísticas de uso

```sql
-- Total de favoritos por usuario
SELECT 
  user_id,
  COUNT(*) as total_favorites,
  COUNT(*) FILTER (WHERE is_pinned) as pinned_count,
  AVG(usage_count) as avg_usage,
  MAX(last_accessed_at) as last_activity
FROM public.favorites
GROUP BY user_id;
```

### Favoritos más populares

```sql
-- Top 10 favoritos más accedidos (global)
SELECT 
  favorite_type,
  favorite_data->>'title' as title,
  SUM(usage_count) as total_usage,
  COUNT(DISTINCT user_id) as unique_users
FROM public.favorites
GROUP BY favorite_type, favorite_data->>'title'
ORDER BY total_usage DESC
LIMIT 10;
```

## 🔐 Seguridad

### Checklist de seguridad

- ✅ RLS habilitado en tabla `favorites`
- ✅ Políticas RLS para CRUD completo
- ✅ Funciones con `SECURITY DEFINER` (ejecutan con permisos de owner)
- ✅ Validación de `user_id` en todas las operaciones
- ✅ Constraint UNIQUE para prevenir duplicados
- ✅ CHECK constraints en `favorite_type` y `favorite_scope`
- ✅ ON DELETE CASCADE para limpieza automática

### Buenas prácticas

1. **Nunca** exponer el API key público en el frontend
2. Usar `auth.uid()` para obtener user_id autenticado
3. Sanitizar datos antes de insertar en `favorite_data` (ver `src/utils/sanitize.ts`)
4. Limitar tamaño de `favorite_data` (máximo 5KB por item)
5. Implementar rate limiting en el cliente

## 🔄 Migraciones Futuras

Para agregar nuevas features:

```bash
# Crear nueva migración
supabase migration new add_feature_name

# Editar archivo generado
# supabase/migrations/[TIMESTAMP]_add_feature_name.sql

# Aplicar migración
supabase db push
```

## 📚 Referencias

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase CLI](https://supabase.com/docs/reference/cli/introduction)

## 🆘 Troubleshooting

### Error: "relation does not exist"

```bash
# Verificar que la migración se aplicó
supabase db dump --schema public

# Re-aplicar migración
supabase db execute --file supabase/migrations/20251011_create_favorites_table.sql
```

### Error: "permission denied for table favorites"

```bash
# Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'favorites';

# Si rowsecurity = false, ejecutar:
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
```

### Error: "new row violates row-level security policy"

Asegúrate de que `auth.uid()` retorna el user_id correcto:

```sql
SELECT auth.uid();  -- Debe retornar el UUID del usuario autenticado
```

---

**Versión:** 1.0  
**Fecha:** Octubre 11, 2025  
**Mantenedor:** AstroLab Team
