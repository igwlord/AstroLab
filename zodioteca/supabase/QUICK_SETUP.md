# 🚀 Quick Setup Guide - Favorites Database

Guía paso a paso para configurar el sistema de Favoritos en Supabase.

## ⏱️ Tiempo estimado: 5 minutos

---

## 📋 Prerrequisitos

- [ ] Cuenta en [Supabase](https://app.supabase.com)
- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas en `.env`:
  ```env
  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
  VITE_SUPABASE_ANON_KEY=tu-anon-key
  ```

---

## 🔧 Paso 1: Aplicar Migración Principal

### Opción A: Desde Supabase Dashboard (Más fácil)

1. Ve a tu proyecto en [app.supabase.com](https://app.supabase.com)
2. Navega a **SQL Editor** (icono de código `</>` en el menú lateral)
3. Click en **New Query**
4. Copia todo el contenido de:
   ```
   supabase/migrations/20251011_create_favorites_table.sql
   ```
5. Pega en el editor SQL
6. Click en **RUN** (▶️ botón verde)
7. Verifica que aparezca: ✅ **"Success. No rows returned"**

### Opción B: Desde Terminal (Supabase CLI)

```bash
# 1. Instalar CLI (si no lo tienes)
npm install -g supabase

# 2. Login
supabase login

# 3. Link a tu proyecto
supabase link --project-ref tu-project-ref

# 4. Aplicar migración
supabase db execute --file zodioteca/supabase/migrations/20251011_create_favorites_table.sql

# 5. Verificar
supabase db pull
```

---

## ✅ Paso 2: Verificar Instalación

En el **SQL Editor** de Supabase, ejecuta:

```sql
-- Verificar que la tabla existe
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'favorites';

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'favorites';

-- Debe retornar: rowsecurity = true
```

**Resultado esperado:**
```
table_name | table_type
-----------+-----------
favorites  | BASE TABLE

tablename | rowsecurity
----------+------------
favorites | t
```

---

## 🧪 Paso 3: Testing con Seed Data (Opcional)

Solo para entornos de desarrollo/staging:

```sql
-- Ejecutar seed data
-- Copia y pega el contenido de:
-- supabase/migrations/20251011_seed_favorites_test_data.sql
```

Esto creará:
- ✅ 2 usuarios de prueba
- ✅ 5 favoritos para Usuario 1
- ✅ 2 favoritos para Usuario 2

---

## 🔐 Paso 4: Verificar Row Level Security

Ejecuta estos tests en el SQL Editor:

```sql
-- Test 1: Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename = 'favorites';

-- Debe retornar 4 políticas:
-- 1. Users can view their own favorites (SELECT)
-- 2. Users can insert their own favorites (INSERT)
-- 3. Users can update their own favorites (UPDATE)
-- 4. Users can delete their own favorites (DELETE)
```

```sql
-- Test 2: Verificar funciones
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%favorite%';

-- Debe retornar:
-- 1. touch_favorite (FUNCTION)
-- 2. get_relevant_favorites (FUNCTION)
-- 3. upsert_favorites (FUNCTION)
-- 4. update_favorites_updated_at (FUNCTION)
```

---

## 🎯 Paso 5: Test End-to-End

### 5.1 Crear un favorito de prueba

En tu aplicación (zodioteca), inicia sesión y:

1. Ve a **Glosario → Signos**
2. Click en la estrella ⭐ de cualquier signo
3. Ve a **Favoritos** (en el navbar)
4. Verifica que el signo aparece en tu lista

### 5.2 Verificar en Supabase

En el **SQL Editor**:

```sql
-- Ver todos los favoritos (como admin)
SELECT 
  id,
  user_id,
  favorite_data->>'title' as title,
  favorite_type,
  favorite_scope,
  is_pinned,
  usage_count,
  created_at
FROM public.favorites
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📊 Paso 6: Monitoreo (Opcional)

### Dashboard personalizado en Supabase

1. Ve a **Dashboard** → **Custom Reports**
2. Crea una nueva query:

```sql
-- Estadísticas de favoritos por usuario
SELECT 
  u.email,
  COUNT(f.id) as total_favorites,
  COUNT(*) FILTER (WHERE f.is_pinned) as pinned,
  MAX(f.last_accessed_at) as last_activity
FROM public.favorites f
JOIN auth.users u ON f.user_id = u.id
GROUP BY u.email
ORDER BY total_favorites DESC;
```

3. Guarda como **"Favorites Stats"**

---

## 🐛 Troubleshooting

### Error: "permission denied for table favorites"

**Causa:** RLS no está habilitado o el usuario no está autenticado.

**Solución:**
```sql
-- Verificar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Verificar autenticación
SELECT auth.uid();  -- Debe retornar tu user_id, no NULL
```

### Error: "relation 'favorites' does not exist"

**Causa:** La migración no se aplicó correctamente.

**Solución:**
1. Ve a **Database** → **Tables** en Supabase Dashboard
2. Verifica si existe la tabla `favorites`
3. Si no existe, vuelve a ejecutar el Paso 1

### Error: "duplicate key value violates unique constraint"

**Causa:** Intentaste agregar el mismo favorito dos veces.

**Solución:**
```sql
-- Eliminar duplicados
DELETE FROM public.favorites
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, favorite_type, (favorite_data->>'title')) id
  FROM public.favorites
);
```

---

## 🔄 Rollback (Si algo sale mal)

Para revertir todos los cambios:

```bash
# Ejecutar script de rollback
supabase db execute --file zodioteca/supabase/migrations/20251011_rollback_favorites_table.sql
```

O desde el SQL Editor:
```sql
-- Copiar y ejecutar contenido de:
-- supabase/migrations/20251011_rollback_favorites_table.sql
```

⚠️ **ADVERTENCIA:** Esto eliminará TODOS los datos de favoritos.

---

## ✨ Next Steps

Una vez que el setup esté completo:

1. ✅ La app puede crear/leer/actualizar/eliminar favoritos
2. ✅ RLS protege los datos de cada usuario
3. ✅ Las funciones de sync están listas para usar
4. 🔜 Implementar **FASE 4.1** (Supabase service con sync)
5. 🔜 Implementar **FASE 4.2** (Sync UI en FavoritesPage)

---

## 📞 Support

- **Documentación completa:** `supabase/README.md`
- **Schema SQL:** `supabase/migrations/20251011_create_favorites_table.sql`
- **Issues:** Crear issue en el repo de GitHub

---

**Última actualización:** Octubre 11, 2025  
**Versión:** 1.0
