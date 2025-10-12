-- ============================================
-- SCRIPT COMPLETO PARA CREAR TABLA FAVORITES
-- Ejecutar TODO este código en Supabase SQL Editor
-- ============================================

-- PASO 1: Eliminar objetos si existen (para empezar limpio)
-- Primero la función y trigger, luego la tabla
DROP FUNCTION IF EXISTS update_favorites_synced_at() CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;

-- PASO 2: Crear la tabla de favoritos
CREATE TABLE favorites (
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
  CONSTRAINT favorites_user_favorite_unique UNIQUE(user_id, favorite_id)
);

-- PASO 3: Crear índices para mejorar performance
CREATE INDEX favorites_user_id_idx ON favorites(user_id);
CREATE INDEX favorites_last_used_at_idx ON favorites(last_used_at DESC);
CREATE INDEX favorites_type_idx ON favorites(type);
CREATE INDEX favorites_scope_idx ON favorites(scope);
CREATE INDEX favorites_chart_id_idx ON favorites(chart_id) WHERE chart_id IS NOT NULL;

-- PASO 4: Habilitar Row Level Security (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- PASO 5: Crear políticas de seguridad

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

-- PASO 6: Función para actualizar synced_at automáticamente
CREATE FUNCTION update_favorites_synced_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.synced_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Trigger para actualizar synced_at en cada UPDATE
CREATE TRIGGER update_favorites_synced_at_trigger
  BEFORE UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_synced_at();

-- PASO 8: Agregar comentarios para documentación
COMMENT ON TABLE favorites IS 'Tabla de favoritos/bookmarks de usuarios para AstroLab';
COMMENT ON COLUMN favorites.favorite_id IS 'ID generado por la app (tipo_titulo normalizado)';
COMMENT ON COLUMN favorites.type IS 'Tipo de favorito: glossary-sign, glossary-planet, glossary-house, chart-aspect, chart-shape, frequency-exercise';
COMMENT ON COLUMN favorites.target_id IS 'ID del elemento favoriteado (aries, mars, house-1, etc.)';
COMMENT ON COLUMN favorites.scope IS 'Scope: global (glosario) o chart (carta específica)';
COMMENT ON COLUMN favorites.last_used_at IS 'Última vez que se accedió desde favoritos';
COMMENT ON COLUMN favorites.synced_at IS 'Última sincronización con el cliente';

-- ============================================
-- FIN DEL SCRIPT
-- Si ves "Success" sin errores, ¡todo está listo!
-- ============================================
