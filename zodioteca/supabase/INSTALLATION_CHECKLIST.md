# ✅ Installation Checklist - Favorites Database

Use esta checklist para validar que el sistema de Favoritos está correctamente configurado.

---

## 📋 Pre-Setup

- [ ] **Supabase Project creado**
  - URL del proyecto: `https://____________.supabase.co`
  - Anon Key configurado en `.env`
  
- [ ] **Variables de entorno configuradas**
  ```bash
  # Verificar en zodioteca/.env
  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```

---

## 🗄️ Database Setup

### Migración Principal

- [ ] **Tabla `favorites` creada**
  ```sql
  -- Ejecutar en SQL Editor
  SELECT COUNT(*) FROM public.favorites;
  -- Debe retornar 0 (sin error)
  ```

- [ ] **11 columnas en la tabla**
  ```sql
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'favorites';
  -- Debe retornar: id, user_id, favorite_data, favorite_type, 
  --                 favorite_scope, chart_id, is_pinned, 
  --                 usage_count, last_accessed_at, created_at, updated_at
  ```

### Índices

- [ ] **8 índices creados**
  ```sql
  SELECT indexname 
  FROM pg_indexes 
  WHERE tablename = 'favorites';
  -- Debe listar: idx_favorites_user_id, idx_favorites_type, etc.
  ```

### Row Level Security

- [ ] **RLS habilitado**
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE tablename = 'favorites';
  -- rowsecurity debe ser: t (true)
  ```

- [ ] **4 políticas RLS creadas**
  ```sql
  SELECT policyname, cmd 
  FROM pg_policies 
  WHERE tablename = 'favorites';
  -- Debe retornar 4 rows: SELECT, INSERT, UPDATE, DELETE
  ```

### Funciones

- [ ] **`update_favorites_updated_at()` existe**
  ```sql
  SELECT routine_name 
  FROM information_schema.routines 
  WHERE routine_name = 'update_favorites_updated_at';
  ```

- [ ] **`touch_favorite()` existe**
  ```sql
  SELECT routine_name 
  FROM information_schema.routines 
  WHERE routine_name = 'touch_favorite';
  ```

- [ ] **`get_relevant_favorites()` existe**
  ```sql
  SELECT routine_name 
  FROM information_schema.routines 
  WHERE routine_name = 'get_relevant_favorites';
  ```

- [ ] **`upsert_favorites()` existe**
  ```sql
  SELECT routine_name 
  FROM information_schema.routines 
  WHERE routine_name = 'upsert_favorites';
  ```

### Triggers

- [ ] **Trigger `trigger_update_favorites_updated_at` creado**
  ```sql
  SELECT trigger_name, event_manipulation 
  FROM information_schema.triggers 
  WHERE trigger_name = 'trigger_update_favorites_updated_at';
  -- Debe retornar: UPDATE
  ```

---

## 🧪 Functional Tests

### Test 1: Insertar favorito manual

- [ ] **Insertar registro de prueba**
  ```sql
  INSERT INTO public.favorites (
    user_id,
    favorite_data,
    favorite_type,
    favorite_scope
  ) VALUES (
    auth.uid(),  -- Debes estar autenticado
    '{"title": "Test Favorito", "icon": "⭐"}'::JSONB,
    'glossary-sign',
    'global'
  );
  ```

- [ ] **Verificar que se insertó**
  ```sql
  SELECT * FROM public.favorites 
  WHERE favorite_data->>'title' = 'Test Favorito';
  ```

- [ ] **Verificar timestamps automáticos**
  ```sql
  SELECT created_at, updated_at 
  FROM public.favorites 
  WHERE favorite_data->>'title' = 'Test Favorito';
  -- Ambos deben tener valores recientes
  ```

### Test 2: RLS funcionando

- [ ] **Intentar ver favoritos sin autenticación (debe fallar)**
  ```sql
  -- En modo anónimo, esto debe retornar 0 rows
  SELECT * FROM public.favorites;
  ```

- [ ] **Ver solo favoritos propios (debe funcionar)**
  ```sql
  -- Autenticado, debe retornar solo tus favoritos
  SELECT COUNT(*) FROM public.favorites WHERE user_id = auth.uid();
  ```

### Test 3: Funciones

- [ ] **`touch_favorite()` funciona**
  ```sql
  -- Obtener un ID de favorito existente
  SELECT id FROM public.favorites LIMIT 1;
  
  -- Touch el favorito
  SELECT public.touch_favorite('tu-favorite-id-aquí');
  
  -- Verificar que usage_count incrementó
  SELECT usage_count, last_accessed_at 
  FROM public.favorites 
  WHERE id = 'tu-favorite-id-aquí';
  ```

- [ ] **`get_relevant_favorites()` funciona**
  ```sql
  SELECT * FROM public.get_relevant_favorites(auth.uid(), 5);
  -- Debe retornar favoritos ordenados por relevance_score
  ```

### Test 4: Trigger de updated_at

- [ ] **Actualizar un favorito**
  ```sql
  UPDATE public.favorites 
  SET is_pinned = TRUE 
  WHERE id = (SELECT id FROM public.favorites LIMIT 1);
  ```

- [ ] **Verificar que updated_at cambió**
  ```sql
  SELECT created_at, updated_at 
  FROM public.favorites 
  WHERE id = (SELECT id FROM public.favorites LIMIT 1);
  -- updated_at debe ser más reciente que created_at
  ```

---

## 🎨 Frontend Integration

### App Configuration

- [ ] **Supabase client inicializado**
  - Archivo: `src/config/supabase.ts`
  - Export: `SUPABASE_CONFIG`

- [ ] **Tipos TypeScript creados**
  - Archivo: `src/types/favorites.ts`
  - Exports: `FavoriteItem`, `FavoriteType`, `FavoriteScope`

- [ ] **Store Zustand creado**
  - Archivo: `src/store/useFavorites.ts`
  - Hook: `useFavorites()`

### UI Components

- [ ] **FavoriteToggleButton renderiza**
  - Ubicación: `src/components/FavoriteToggleButton.tsx`
  - Integrado en: ZodiacSignsGrid, PlanetsGrid, etc.

- [ ] **FavoritesPage accesible**
  - Ruta: `/favorites`
  - Link en Navbar visible

---

## 🔄 End-to-End Test

### Flujo completo: Agregar → Ver → Eliminar

1. - [ ] **Login en la aplicación**
   - Usuario autenticado con Supabase Auth

2. - [ ] **Agregar un favorito desde Glosario**
   - Ir a Glosario → Signos
   - Click en estrella ⭐ de "Aries"
   - Verifica animación de feedback

3. - [ ] **Ver favorito en /favorites**
   - Navega a "Favoritos" en navbar
   - Verifica que "Aries" aparece en la lista
   - Click en el card para abrir modal

4. - [ ] **Verificar en Supabase**
   ```sql
   SELECT 
     favorite_data->>'title' as title,
     favorite_type,
     created_at
   FROM public.favorites
   WHERE user_id = auth.uid()
   ORDER BY created_at DESC;
   -- Debe mostrar "Aries"
   ```

5. - [ ] **Eliminar favorito**
   - Click en estrella ⭐ nuevamente
   - Verifica que desaparece de /favorites

6. - [ ] **Verificar eliminación en DB**
   ```sql
   SELECT COUNT(*) FROM public.favorites 
   WHERE user_id = auth.uid() 
   AND favorite_data->>'title' = 'Aries';
   -- Debe retornar 0
   ```

---

## 📊 Performance Check

- [ ] **Query de usuario < 100ms**
  ```sql
  EXPLAIN ANALYZE 
  SELECT * FROM public.favorites 
  WHERE user_id = auth.uid();
  -- Verificar que usa índice idx_favorites_user_id
  ```

- [ ] **Relevance scoring < 200ms**
  ```sql
  EXPLAIN ANALYZE 
  SELECT * FROM public.get_relevant_favorites(auth.uid(), 10);
  ```

- [ ] **Bulk upsert < 500ms** (para 10 items)
  ```sql
  -- Test con seed data
  \timing on
  SELECT * FROM public.upsert_favorites('[...]'::JSONB);
  ```

---

## 🔒 Security Audit

- [ ] **RLS no se puede desactivar desde cliente**
  - Intentar: `ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;`
  - Debe fallar con: "permission denied"

- [ ] **No se puede acceder a favoritos de otros usuarios**
  ```sql
  -- Como User A, intentar ver favoritos de User B
  SELECT * FROM public.favorites WHERE user_id != auth.uid();
  -- Debe retornar 0 rows (bloqueado por RLS)
  ```

- [ ] **Sanitización funciona en frontend**
  - Intentar agregar favorito con HTML: `<script>alert('xss')</script>`
  - Verificar que se sanitiza antes de guardar

---

## 📝 Documentation Review

- [ ] **README.md leído**
  - Entiendo la arquitectura
  - Conozco las funciones disponibles

- [ ] **QUICK_SETUP.md seguido**
  - Todos los pasos completados sin errores

- [ ] **SQL comments presentes en DB**
  ```sql
  SELECT obj_description('public.favorites'::regclass);
  -- Debe retornar descripción de la tabla
  ```

---

## ✨ Final Validation

### Todos los checks anteriores pasaron

- [ ] **Database:** ✅ Tabla, índices, RLS, funciones, triggers
- [ ] **Functional:** ✅ CRUD, RLS, funciones, triggers
- [ ] **Frontend:** ✅ Config, tipos, store, components
- [ ] **E2E:** ✅ Flujo completo funciona
- [ ] **Performance:** ✅ Queries optimizados
- [ ] **Security:** ✅ RLS protegiendo datos

### Sistema listo para producción

- [ ] **Seed data removido** (solo en dev/staging)
- [ ] **Variables de entorno seguras** (no en git)
- [ ] **Backups configurados** (Supabase auto-backup)
- [ ] **Monitoreo activo** (Dashboard de Supabase)

---

## 🎉 Congratulations!

Si todos los checks están ✅, el sistema de Favoritos está completamente funcional y listo para usar.

**Próximos pasos:**
1. Implementar FASE 4.1 (Supabase service con sync)
2. Implementar FASE 4.2 (Sync UI)
3. Agregar más integraciones (Fase 3.2, 3.3)

---

**Fecha de validación:** __________  
**Validado por:** __________  
**Resultado:** ✅ PASS / ❌ FAIL
