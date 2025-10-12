/**
 * SQL para crear la tabla de favoritos en Supabase
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu dashboard de Supabase: https://app.supabase.com
 * 2. Selecciona tu proyecto AstroLab
 * 3. Ve a "SQL Editor"
 * 4. Crea una nueva query
 * 5. Copia y pega este código
 * 6. Ejecuta (Run)
 */

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

-- Comentarios para documentación
COMMENT ON TABLE favorites IS 'Tabla de favoritos/bookmarks de usuarios para AstroLab';
COMMENT ON COLUMN favorites.favorite_id IS 'ID generado por la app (tipo_titulo normalizado)';
COMMENT ON COLUMN favorites.type IS 'Tipo de favorito: zodiac-sign, planet, house, aspect, etc.';
COMMENT ON COLUMN favorites.target_id IS 'ID del elemento favoriteado (aries, mars, house-1, etc.)';
COMMENT ON COLUMN favorites.scope IS 'Scope: global (glosario) o chart (carta específica)';
COMMENT ON COLUMN favorites.last_used_at IS 'Última vez que se accedió desde favoritos';
COMMENT ON COLUMN favorites.synced_at IS 'Última sincronización con el cliente';
