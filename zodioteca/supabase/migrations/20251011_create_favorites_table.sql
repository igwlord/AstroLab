-- ============================================
-- MIGRATION: Create Favorites Table
-- Created: October 11, 2025
-- Description: Sistema de Favoritos con RLS
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: favorites
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User relationship (FK to auth.users)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core favorite data (stored as JSONB for flexibility)
  favorite_data JSONB NOT NULL,
  
  -- Metadata fields for querying and indexing
  favorite_type TEXT NOT NULL CHECK (favorite_type IN (
    'glossary-sign',
    'glossary-house',
    'glossary-planet',
    'glossary-moon-sign',
    'glossary-ascendant',
    'glossary-asteroid',
    'chart-aspect',
    'chart-configuration',
    'chart-shape',
    'saved-chart',
    'frequency-exercise',
    'frequency-ritual',
    'frequency-meditation',
    'dignity',
    'coordinate-system',
    'house-system'
  )),
  
  favorite_scope TEXT NOT NULL DEFAULT 'global' CHECK (favorite_scope IN ('global', 'chart')),
  
  -- Chart relationship (NULL for global favorites)
  chart_id UUID DEFAULT NULL,
  
  -- User interaction tracking
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for user queries (most common operation)
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

-- Index for type filtering
CREATE INDEX idx_favorites_type ON public.favorites(favorite_type);

-- Index for scope filtering
CREATE INDEX idx_favorites_scope ON public.favorites(favorite_scope);

-- Index for chart-specific favorites
CREATE INDEX idx_favorites_chart_id ON public.favorites(chart_id) WHERE chart_id IS NOT NULL;

-- Index for pinned favorites
CREATE INDEX idx_favorites_pinned ON public.favorites(is_pinned) WHERE is_pinned = TRUE;

-- Index for recent access (relevance scoring)
CREATE INDEX idx_favorites_last_accessed ON public.favorites(last_accessed_at DESC);

-- Composite index for user + scope queries
CREATE INDEX idx_favorites_user_scope ON public.favorites(user_id, favorite_scope);

-- GIN index for JSONB data (allows searching within favorite_data)
CREATE INDEX idx_favorites_data_gin ON public.favorites USING GIN (favorite_data);

-- Unique index: one favorite per user+type+title (prevents duplicates)
CREATE UNIQUE INDEX idx_favorites_unique_user_type_title 
  ON public.favorites (user_id, favorite_type, (favorite_data->>'title'));

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on the table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own favorites
CREATE POLICY "Users can update their own favorites"
  ON public.favorites
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Touch favorite (update last_accessed_at and increment usage_count)
CREATE OR REPLACE FUNCTION public.touch_favorite(favorite_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.favorites
  SET 
    last_accessed_at = NOW(),
    usage_count = usage_count + 1,
    updated_at = NOW()
  WHERE id = favorite_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get relevant favorites with scoring
CREATE OR REPLACE FUNCTION public.get_relevant_favorites(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  favorite_data JSONB,
  favorite_type TEXT,
  favorite_scope TEXT,
  is_pinned BOOLEAN,
  usage_count INTEGER,
  last_accessed_at TIMESTAMPTZ,
  relevance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.favorite_data,
    f.favorite_type,
    f.favorite_scope,
    f.is_pinned,
    f.usage_count,
    f.last_accessed_at,
    -- Relevance scoring formula:
    -- score = (usageCount * 10) + (pinned * 50) - (daysSinceLastAccess * 2)
    (
      (f.usage_count * 10) +
      (CASE WHEN f.is_pinned THEN 50 ELSE 0 END) -
      (EXTRACT(EPOCH FROM (NOW() - f.last_accessed_at)) / 86400 * 2)
    )::NUMERIC AS relevance_score
  FROM public.favorites f
  WHERE f.user_id = p_user_id
  ORDER BY relevance_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Bulk upsert favorites (for sync)
CREATE OR REPLACE FUNCTION public.upsert_favorites(
  p_favorites JSONB
)
RETURNS TABLE (
  success BOOLEAN,
  inserted_count INTEGER,
  updated_count INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_inserted INTEGER := 0;
  v_updated INTEGER := 0;
  v_favorite JSONB;
BEGIN
  -- Loop through each favorite in the array
  FOR v_favorite IN SELECT * FROM jsonb_array_elements(p_favorites)
  LOOP
    -- Upsert operation
    INSERT INTO public.favorites (
      user_id,
      favorite_data,
      favorite_type,
      favorite_scope,
      chart_id,
      is_pinned,
      usage_count,
      last_accessed_at,
      created_at,
      updated_at
    )
    VALUES (
      auth.uid(),
      v_favorite->'favorite_data',
      v_favorite->>'favorite_type',
      COALESCE(v_favorite->>'favorite_scope', 'global'),
      (v_favorite->>'chart_id')::UUID,
      COALESCE((v_favorite->>'is_pinned')::BOOLEAN, FALSE),
      COALESCE((v_favorite->>'usage_count')::INTEGER, 0),
      COALESCE((v_favorite->>'last_accessed_at')::TIMESTAMPTZ, NOW()),
      COALESCE((v_favorite->>'created_at')::TIMESTAMPTZ, NOW()),
      NOW()
    )
    ON CONFLICT ON CONSTRAINT idx_favorites_unique_user_type_title
    DO UPDATE SET
      favorite_data = EXCLUDED.favorite_data,
      favorite_scope = EXCLUDED.favorite_scope,
      chart_id = EXCLUDED.chart_id,
      is_pinned = EXCLUDED.is_pinned,
      usage_count = GREATEST(public.favorites.usage_count, EXCLUDED.usage_count),
      last_accessed_at = GREATEST(public.favorites.last_accessed_at, EXCLUDED.last_accessed_at),
      updated_at = NOW()
    WHERE EXCLUDED.updated_at > public.favorites.updated_at;
    
    -- Track operation
    IF FOUND THEN
      IF (SELECT updated_at FROM public.favorites WHERE user_id = auth.uid() AND favorite_type = v_favorite->>'favorite_type' AND favorite_data->>'title' = v_favorite->'favorite_data'->>'title') = NOW() THEN
        v_updated := v_updated + 1;
      END IF;
    ELSE
      v_inserted := v_inserted + 1;
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT TRUE, v_inserted, v_updated, NULL::TEXT;
  
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT FALSE, 0, 0, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Auto-update updated_at on row modification
CREATE TRIGGER trigger_update_favorites_updated_at
  BEFORE UPDATE ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_favorites_updated_at();

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE public.favorites IS 
  'Sistema de Favoritos v1.0 - Almacena items favoritos de usuarios con dual-scope (global/chart)';

COMMENT ON COLUMN public.favorites.id IS 
  'UUID único del favorito';

COMMENT ON COLUMN public.favorites.user_id IS 
  'FK a auth.users - Usuario propietario del favorito';

COMMENT ON COLUMN public.favorites.favorite_data IS 
  'JSONB con datos completos del FavoriteItem (flexible schema)';

COMMENT ON COLUMN public.favorites.favorite_type IS 
  'Tipo de favorito (glossary-sign, chart-aspect, etc.)';

COMMENT ON COLUMN public.favorites.favorite_scope IS 
  'Ámbito: global (siempre visible) o chart (contextual)';

COMMENT ON COLUMN public.favorites.chart_id IS 
  'ID de carta natal (NULL para global favorites)';

COMMENT ON COLUMN public.favorites.is_pinned IS 
  'Favorito fijado (prioridad alta en relevance scoring)';

COMMENT ON COLUMN public.favorites.usage_count IS 
  'Contador de accesos (para relevance scoring)';

COMMENT ON COLUMN public.favorites.last_accessed_at IS 
  'Último acceso (para decay scoring temporal)';

COMMENT ON FUNCTION public.touch_favorite IS 
  'Registra acceso a un favorito (incrementa usage_count, actualiza last_accessed_at)';

COMMENT ON FUNCTION public.get_relevant_favorites IS 
  'Retorna favoritos ordenados por relevance score con decay temporal';

COMMENT ON FUNCTION public.upsert_favorites IS 
  'Sincronización bulk: inserta o actualiza múltiples favoritos (merge strategy)';
