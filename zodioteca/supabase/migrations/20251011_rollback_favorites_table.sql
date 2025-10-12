-- ============================================
-- ROLLBACK: Drop Favorites Table
-- Created: October 11, 2025
-- Description: Revierte migración 20251011_create_favorites_table.sql
-- ============================================

-- ⚠️ WARNING: Este script elimina TODOS los datos de favoritos
-- Solo ejecutar si es absolutamente necesario

-- ============================================
-- DROP TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS trigger_update_favorites_updated_at ON public.favorites;

-- ============================================
-- DROP FUNCTIONS
-- ============================================

DROP FUNCTION IF EXISTS public.upsert_favorites(JSONB);
DROP FUNCTION IF EXISTS public.get_relevant_favorites(UUID, INTEGER);
DROP FUNCTION IF EXISTS public.touch_favorite(UUID);
DROP FUNCTION IF EXISTS public.update_favorites_updated_at();

-- ============================================
-- DROP POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;

-- ============================================
-- DROP INDEXES
-- ============================================

DROP INDEX IF EXISTS public.idx_favorites_data_gin;
DROP INDEX IF EXISTS public.idx_favorites_user_scope;
DROP INDEX IF EXISTS public.idx_favorites_last_accessed;
DROP INDEX IF EXISTS public.idx_favorites_pinned;
DROP INDEX IF EXISTS public.idx_favorites_chart_id;
DROP INDEX IF EXISTS public.idx_favorites_scope;
DROP INDEX IF EXISTS public.idx_favorites_type;
DROP INDEX IF EXISTS public.idx_favorites_user_id;

-- ============================================
-- DROP TABLE
-- ============================================

DROP TABLE IF EXISTS public.favorites CASCADE;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verificar que la tabla fue eliminada
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'favorites'
  ) THEN
    RAISE EXCEPTION 'Table favorites still exists!';
  ELSE
    RAISE NOTICE '✓ Table favorites successfully dropped';
  END IF;
END $$;
