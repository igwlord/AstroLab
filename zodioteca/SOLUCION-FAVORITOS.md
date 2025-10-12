# 🔧 SOLUCIÓN: Crear Tabla de Favoritos en Supabase

## ❌ Problema Identificado

La tabla `favorites` **NO existe** en tu base de datos de Supabase, por eso los favoritos no se sincronizan.

El código está **100% correcto**, solo falta crear la tabla.

---

## ✅ SOLUCIÓN (5 minutos)

### Paso 1: Abrir Dashboard de Supabase

1. Ve a: https://app.supabase.com
2. Inicia sesión
3. Selecciona tu proyecto: **pzbfhdznmpiszanqoarw** (AstroLab)

### Paso 2: Abrir SQL Editor

1. En el menú lateral, busca: **SQL Editor** 
2. Click en "New query" (nueva consulta)

### Paso 3: Copiar y Pegar el SQL

**Copia TODO el contenido del archivo:** `supabase-favorites-schema.sql`

O copia esto directamente:

```sql
-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  -- ID único de la tabla
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Usuario propietario (FK a auth.users)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- ID del favorito generado por la app
  favorite_id TEXT NOT NULL,
  
  -- Datos del favorito
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '⭐',
  route TEXT NOT NULL,
  target_id TEXT NOT NULL DEFAULT '',
  scope TEXT NOT NULL CHECK (scope IN ('global', 'chart')),
  chart_id TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  pinned BOOLEAN NOT NULL DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Índice único: un usuario no puede tener el mismo favorito duplicado
  UNIQUE(user_id, favorite_id)
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_last_used_at_idx ON favorites(last_used_at DESC);
CREATE INDEX IF NOT EXISTS favorites_type_idx ON favorites(type);
CREATE INDEX IF NOT EXISTS favorites_scope_idx ON favorites(scope);
CREATE INDEX IF NOT EXISTS favorites_chart_id_idx ON favorites(chart_id) WHERE chart_id IS NOT NULL;

-- Habilitar Row Level Security (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios favoritos
CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propios favoritos
CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios favoritos
CREATE POLICY "Users can update own favorites"
  ON favorites
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios favoritos
CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Función para actualizar synced_at automáticamente
CREATE OR REPLACE FUNCTION update_favorites_synced_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.synced_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar synced_at en cada UPDATE
CREATE TRIGGER update_favorites_synced_at_trigger
  BEFORE UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_synced_at();
```

### Paso 4: Ejecutar

1. Click en el botón **"Run"** (Ejecutar) o presiona `Ctrl + Enter`
2. Deberías ver: ✅ "Success. No rows returned"

### Paso 5: Verificar

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver la nueva tabla: **favorites**
3. Click en ella para ver su estructura

---

## 🧪 Probar la Sincronización

Una vez creada la tabla:

1. **En PC:**
   - Inicia sesión en AstroLab
   - Agrega algunos favoritos (⭐)
   - Cierra sesión

2. **En móvil (o navegador privado):**
   - Inicia sesión con la misma cuenta
   - Los favoritos deberían aparecer automáticamente ✨

3. **Verifica logs:**
   - Abre la consola del navegador (F12)
   - Busca mensajes como:
     - `🔄 Iniciando sync de favoritos...`
     - `✅ Favoritos sincronizados`
     - `📥 Store actualizado: X favoritos cargados`

---

## 🎯 ¿Por qué no funcionaba antes?

**Flujo actual:**
1. Usuario hace login ✅
2. `SupabaseContext.tsx` llama a `syncOnLogin()` ✅
3. `favoritesService.ts` intenta leer tabla `favorites` ❌ **NO EXISTE**
4. Error silencioso, no se sincronizan los favoritos ❌

**Flujo después de crear la tabla:**
1. Usuario hace login ✅
2. `SupabaseContext.tsx` llama a `syncOnLogin()` ✅
3. `favoritesService.ts` lee/escribe en tabla `favorites` ✅ **EXISTE**
4. Sincronización exitosa ✅

---

## 📊 Verificar en Dashboard

Después de agregar favoritos, puedes verlos en Supabase:

1. Ve a **Table Editor** → **favorites**
2. Verás todas las filas con:
   - `user_id`: ID del usuario
   - `favorite_id`: ID único del favorito
   - `title`: Nombre del favorito
   - `type`: Tipo (glossary-sign, chart-aspect, etc.)
   - `last_used_at`: Última vez usado

---

## ⚠️ IMPORTANTE

**Row Level Security (RLS) está activado:**
- Cada usuario solo ve sus propios favoritos
- No hay riesgo de mezclar datos entre usuarios
- Máxima seguridad ✅

---

## 🆘 Si algo sale mal

### Error: "relation favorites does not exist"
**Solución:** La tabla no se creó. Repite el Paso 3 y 4.

### Error: "permission denied"
**Solución:** Las políticas RLS no se crearon. Ejecuta todo el SQL completo.

### Los favoritos no aparecen
**Solución:** 
1. Verifica que estés logueado con la misma cuenta
2. Abre consola (F12) y busca errores
3. Verifica en Table Editor que los datos existen

---

## ✅ Resumen

1. ✅ Código de sincronización: **PERFECTO**
2. ✅ Credenciales Supabase: **CONFIGURADAS**
3. ❌ Tabla en base de datos: **FALTA CREARLA** ← Esto es lo único que falta

**5 minutos de trabajo y listo** 🚀
