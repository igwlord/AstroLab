# 📚 Supabase Favorites - Ejemplos de Uso

Ejemplos prácticos de queries SQL para trabajar con el sistema de Favoritos.

---

## 🔍 Queries Básicos

### Listar todos mis favoritos

```sql
SELECT 
  id,
  favorite_data->>'title' as title,
  favorite_data->>'icon' as icon,
  favorite_type,
  favorite_scope,
  is_pinned,
  usage_count,
  last_accessed_at,
  created_at
FROM public.favorites
WHERE user_id = auth.uid()
ORDER BY 
  CASE WHEN is_pinned THEN 0 ELSE 1 END,
  last_accessed_at DESC;
```

### Contar favoritos por tipo

```sql
SELECT 
  favorite_type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_pinned) as pinned_count
FROM public.favorites
WHERE user_id = auth.uid()
GROUP BY favorite_type
ORDER BY count DESC;
```

### Favoritos más usados

```sql
SELECT 
  favorite_data->>'title' as title,
  favorite_type,
  usage_count,
  last_accessed_at
FROM public.favorites
WHERE user_id = auth.uid()
ORDER BY usage_count DESC
LIMIT 10;
```

---

## 📊 Queries Avanzados

### Buscar favoritos por texto

```sql
-- Buscar en título o tags
SELECT 
  favorite_data->>'title' as title,
  favorite_data->'tags' as tags,
  favorite_type
FROM public.favorites
WHERE user_id = auth.uid()
  AND (
    favorite_data->>'title' ILIKE '%aries%'
    OR favorite_data->'tags' ? 'aries'
  );
```

### Favoritos recientes (últimos 7 días)

```sql
SELECT 
  favorite_data->>'title' as title,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 as hours_ago
FROM public.favorites
WHERE user_id = auth.uid()
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Favoritos abandonados (no accedidos en 30 días)

```sql
SELECT 
  favorite_data->>'title' as title,
  last_accessed_at,
  EXTRACT(DAY FROM (NOW() - last_accessed_at)) as days_inactive
FROM public.favorites
WHERE user_id = auth.uid()
  AND last_accessed_at < NOW() - INTERVAL '30 days'
ORDER BY last_accessed_at ASC;
```

---

## 🎯 Queries de Relevancia

### Top 10 favoritos más relevantes

```sql
SELECT * FROM public.get_relevant_favorites(auth.uid(), 10);
```

### Cálculo manual de relevance score

```sql
SELECT 
  favorite_data->>'title' as title,
  usage_count,
  is_pinned,
  last_accessed_at,
  -- Formula: (usageCount * 10) + (pinned * 50) - (daysSinceLastAccess * 2)
  (
    (usage_count * 10) +
    (CASE WHEN is_pinned THEN 50 ELSE 0 END) -
    (EXTRACT(EPOCH FROM (NOW() - last_accessed_at)) / 86400 * 2)
  )::NUMERIC as relevance_score
FROM public.favorites
WHERE user_id = auth.uid()
ORDER BY relevance_score DESC;
```

---

## 🔧 Queries de Mantenimiento

### Limpiar duplicados (por título)

```sql
-- Ver duplicados
SELECT 
  favorite_data->>'title' as title,
  COUNT(*) as duplicate_count
FROM public.favorites
WHERE user_id = auth.uid()
GROUP BY favorite_data->>'title'
HAVING COUNT(*) > 1;

-- Eliminar duplicados (mantener el más reciente)
DELETE FROM public.favorites
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, favorite_data->>'title' 
        ORDER BY created_at DESC
      ) as rn
    FROM public.favorites
    WHERE user_id = auth.uid()
  ) sub
  WHERE rn > 1
);
```

### Resetear contadores de uso

```sql
-- Resetear usage_count para todos los favoritos
UPDATE public.favorites
SET 
  usage_count = 0,
  last_accessed_at = NOW()
WHERE user_id = auth.uid();
```

### Limpiar favoritos antiguos

```sql
-- Eliminar favoritos no accedidos en 90 días (y no pinneados)
DELETE FROM public.favorites
WHERE user_id = auth.uid()
  AND is_pinned = FALSE
  AND last_accessed_at < NOW() - INTERVAL '90 days';
```

---

## 📈 Queries Analíticos

### Distribución por scope

```sql
SELECT 
  favorite_scope,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.favorites
WHERE user_id = auth.uid()
GROUP BY favorite_scope;
```

### Timeline de creación

```sql
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as favorites_created
FROM public.favorites
WHERE user_id = auth.uid()
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

### Tags más populares

```sql
SELECT 
  tag,
  COUNT(*) as count
FROM public.favorites,
  LATERAL jsonb_array_elements_text(favorite_data->'tags') as tag
WHERE user_id = auth.uid()
GROUP BY tag
ORDER BY count DESC
LIMIT 20;
```

---

## 🔄 Queries de Sincronización

### Favoritos modificados recientemente

```sql
-- Últimas actualizaciones (para sync incremental)
SELECT 
  id,
  favorite_data,
  favorite_type,
  favorite_scope,
  chart_id,
  is_pinned,
  usage_count,
  last_accessed_at,
  updated_at
FROM public.favorites
WHERE user_id = auth.uid()
  AND updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;
```

### Bulk upsert (sincronización)

```sql
-- Ejemplo de sincronización de múltiples favoritos
SELECT * FROM public.upsert_favorites('[
  {
    "favorite_type": "glossary-sign",
    "favorite_scope": "global",
    "favorite_data": {
      "title": "Leo",
      "icon": "♌",
      "type": "glossary-sign",
      "scope": "global",
      "tags": ["Signos", "fuego"],
      "preview": {"summary": "Signo de fuego fijo"}
    },
    "is_pinned": true,
    "usage_count": 10,
    "last_accessed_at": "2025-10-11T10:00:00Z",
    "created_at": "2025-10-10T08:00:00Z",
    "updated_at": "2025-10-11T10:00:00Z"
  },
  {
    "favorite_type": "glossary-planet",
    "favorite_scope": "global",
    "favorite_data": {
      "title": "Luna",
      "icon": "☽",
      "type": "glossary-planet",
      "scope": "global",
      "tags": ["Planetas", "personal"],
      "preview": {"summary": "Planeta de las emociones"}
    },
    "usage_count": 5,
    "last_accessed_at": "2025-10-11T09:00:00Z",
    "created_at": "2025-10-10T07:00:00Z",
    "updated_at": "2025-10-11T09:00:00Z"
  }
]'::JSONB);
```

---

## 🎨 Queries para UI

### Datos para filtros

```sql
-- Obtener todos los tipos únicos con contadores
SELECT 
  favorite_type,
  COUNT(*) as count
FROM public.favorites
WHERE user_id = auth.uid()
GROUP BY favorite_type
ORDER BY count DESC;

-- Obtener todos los tags únicos
SELECT DISTINCT
  jsonb_array_elements_text(favorite_data->'tags') as tag
FROM public.favorites
WHERE user_id = auth.uid()
ORDER BY tag;
```

### Estadísticas para dashboard

```sql
SELECT 
  COUNT(*) as total_favorites,
  COUNT(*) FILTER (WHERE is_pinned) as pinned_count,
  COUNT(*) FILTER (WHERE favorite_scope = 'global') as global_count,
  COUNT(*) FILTER (WHERE favorite_scope = 'chart') as chart_count,
  SUM(usage_count) as total_usage,
  AVG(usage_count)::NUMERIC(10,2) as avg_usage,
  MAX(last_accessed_at) as last_activity,
  COUNT(DISTINCT favorite_type) as unique_types
FROM public.favorites
WHERE user_id = auth.uid();
```

### Favoritos agrupados por tipo (para renderizar)

```sql
SELECT 
  favorite_type,
  jsonb_agg(
    jsonb_build_object(
      'id', id,
      'data', favorite_data,
      'isPinned', is_pinned,
      'usageCount', usage_count,
      'lastAccessed', last_accessed_at
    ) ORDER BY 
      CASE WHEN is_pinned THEN 0 ELSE 1 END,
      last_accessed_at DESC
  ) as favorites
FROM public.favorites
WHERE user_id = auth.uid()
GROUP BY favorite_type;
```

---

## 🔐 Queries de Seguridad

### Verificar ownership

```sql
-- Verificar que un favorito pertenece al usuario actual
SELECT EXISTS (
  SELECT 1 FROM public.favorites
  WHERE id = 'favorite-uuid-aqui'
    AND user_id = auth.uid()
) as is_owner;
```

### Auditoría de accesos

```sql
-- Favoritos con más de 100 accesos (posible bot)
SELECT 
  id,
  favorite_data->>'title' as title,
  usage_count,
  created_at,
  EXTRACT(DAY FROM (NOW() - created_at)) as days_old,
  usage_count / NULLIF(EXTRACT(DAY FROM (NOW() - created_at)), 0) as accesses_per_day
FROM public.favorites
WHERE user_id = auth.uid()
  AND usage_count > 100
ORDER BY usage_count DESC;
```

---

## 💾 Export/Import

### Exportar todos los favoritos (JSON)

```sql
SELECT jsonb_agg(
  jsonb_build_object(
    'id', id,
    'favoriteData', favorite_data,
    'favoriteType', favorite_type,
    'favoriteScope', favorite_scope,
    'chartId', chart_id,
    'isPinned', is_pinned,
    'usageCount', usage_count,
    'lastAccessedAt', last_accessed_at,
    'createdAt', created_at,
    'updatedAt', updated_at
  )
) as favorites_export
FROM public.favorites
WHERE user_id = auth.uid();
```

### Importar favoritos (desde JSON exportado)

```sql
-- Usar la función upsert_favorites
SELECT * FROM public.upsert_favorites(
  '[...]'::JSONB  -- Pegar aquí el JSON exportado
);
```

---

## 🧪 Testing Queries

### Crear favorito de prueba

```sql
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope
) VALUES (
  auth.uid(),
  jsonb_build_object(
    'title', 'Test Favorito ' || NOW(),
    'icon', '🧪',
    'type', 'glossary-sign',
    'scope', 'global',
    'tags', jsonb_build_array('Test'),
    'preview', jsonb_build_object(
      'summary', 'Este es un favorito de prueba'
    )
  ),
  'glossary-sign',
  'global'
) RETURNING *;
```

### Simular accesos múltiples

```sql
-- Touch un favorito 10 veces
DO $$
DECLARE
  v_favorite_id UUID;
BEGIN
  -- Obtener un favorito
  SELECT id INTO v_favorite_id 
  FROM public.favorites 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  -- Touch 10 veces
  FOR i IN 1..10 LOOP
    PERFORM public.touch_favorite(v_favorite_id);
    PERFORM pg_sleep(0.1);  -- 100ms delay
  END LOOP;
  
  RAISE NOTICE 'Touched favorite % times', 10;
END $$;
```

### Verificar performance

```sql
-- Benchmark: Query de usuario
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM public.favorites 
WHERE user_id = auth.uid();

-- Debe usar: Index Scan using idx_favorites_user_id
```

---

## 📚 Recursos Adicionales

- **Documentación completa:** `supabase/README.md`
- **Setup rápido:** `supabase/QUICK_SETUP.md`
- **Checklist:** `supabase/INSTALLATION_CHECKLIST.md`
- **Schema SQL:** `supabase/migrations/20251011_create_favorites_table.sql`

---

**Tip:** Guarda tus queries frecuentes en el **SQL Editor** de Supabase para acceso rápido.

**Última actualización:** Octubre 11, 2025
