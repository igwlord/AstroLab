-- ============================================
-- SEED DATA: Favorites Testing
-- Created: October 11, 2025
-- Description: Datos de prueba para desarrollo local
-- ============================================

-- ⚠️ SOLO PARA DESARROLLO/TESTING
-- No ejecutar en producción

-- ============================================
-- TEST USERS
-- ============================================

-- Insertar usuarios de prueba (normalmente Supabase Auth lo hace)
-- Estos IDs deben coincidir con usuarios reales en auth.users

-- Usuario de prueba 1
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '11111111-1111-1111-1111-111111111111') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
      '11111111-1111-1111-1111-111111111111',
      'test1@zodioteca.local',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;

-- Usuario de prueba 2
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '22222222-2222-2222-2222-222222222222') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
      '22222222-2222-2222-2222-222222222222',
      'test2@zodioteca.local',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;

-- ============================================
-- SEED FAVORITES - Usuario 1
-- ============================================

-- Favorito: Signo Aries
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  is_pinned,
  usage_count,
  last_accessed_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '{
    "title": "Aries",
    "icon": "♈",
    "type": "glossary-sign",
    "scope": "global",
    "tags": ["Signos", "fuego", "cardinal"],
    "preview": {
      "summary": "Aries es el primer signo del zodíaco, el pionero. Representa el nacimiento, el impulso vital.",
      "tips": ["Elemento: fuego", "Modalidad: cardinal", "Regente: Marte"],
      "metadata": {"element": "fuego", "modality": "cardinal", "ruler": "Marte"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?sign=aries"
    }
  }'::JSONB,
  'glossary-sign',
  'global',
  TRUE,
  15,
  NOW() - INTERVAL '2 days'
) ON CONFLICT DO NOTHING;

-- Favorito: Planeta Sol
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  usage_count,
  last_accessed_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '{
    "title": "Sol",
    "icon": "☉",
    "type": "glossary-planet",
    "scope": "global",
    "tags": ["Planetas", "personal"],
    "preview": {
      "summary": "El Sol representa la identidad, la esencia, la vitalidad y el propósito central.",
      "tips": ["Ritmo: personal", "Regencia: Leo", "Casa natural: Casa V"],
      "metadata": {"category": "personal", "rulership": "Leo", "frequency": "528 Hz"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?planet=sol"
    }
  }'::JSONB,
  'glossary-planet',
  'global',
  8,
  NOW() - INTERVAL '1 day'
) ON CONFLICT DO NOTHING;

-- Favorito: Casa 1
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  usage_count,
  last_accessed_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '{
    "title": "Casa 1: Identidad y Apariencia",
    "icon": "1",
    "type": "glossary-house",
    "scope": "global",
    "tags": ["Casas", "angular"],
    "preview": {
      "summary": "La Casa I es la puerta de entrada de la carta natal. Representa la identidad externa.",
      "tips": ["Categoría: angular", "Signo natural: Aries", "Regente natural: Marte"],
      "metadata": {"category": "angular", "naturalSign": "Aries", "naturalRuler": "Marte"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?house=casa-1"
    }
  }'::JSONB,
  'glossary-house',
  'global',
  12,
  NOW() - INTERVAL '3 hours'
) ON CONFLICT DO NOTHING;

-- Favorito: Luna en Aries
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  is_pinned,
  usage_count,
  last_accessed_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '{
    "title": "Luna en Aries",
    "icon": "🌙",
    "type": "glossary-moon-sign",
    "scope": "global",
    "tags": ["Luna", "Fuego", "Aries"],
    "preview": {
      "summary": "La Luna en Aries es impulsiva, directa y apasionada.",
      "tips": ["Elemento: Fuego", "Manifestación: Reacciona rápido", "Sombras: Impaciencia"],
      "metadata": {"element": "fuego", "color": "Rojo", "frequency": "396 Hz"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?moon=aries"
    }
  }'::JSONB,
  'glossary-moon-sign',
  'global',
  TRUE,
  20,
  NOW() - INTERVAL '6 hours'
) ON CONFLICT DO NOTHING;

-- Favorito: Ejercicio de Frecuencia
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  usage_count,
  last_accessed_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '{
    "title": "Meditación 528 Hz - Transformación",
    "icon": "🎵",
    "type": "frequency-meditation",
    "scope": "global",
    "tags": ["Frecuencias", "Meditación", "528Hz"],
    "preview": {
      "summary": "Frecuencia de transformación y reparación del ADN. Conecta con el amor universal.",
      "tips": ["Duración: 15 min", "Chakra: Corazón", "Mejor momento: Amanecer"],
      "metadata": {"frequency": "528 Hz", "chakra": "Anahata", "duration": "15min"}
    },
    "source": {
      "section": "Frecuencias",
      "ref": "/frequencies?id=528hz-meditation"
    }
  }'::JSONB,
  'frequency-meditation',
  'global',
  5,
  NOW() - INTERVAL '12 hours'
) ON CONFLICT DO NOTHING;

-- ============================================
-- SEED FAVORITES - Usuario 2
-- ============================================

-- Favorito: Signo Leo
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  is_pinned,
  usage_count,
  last_accessed_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '{
    "title": "Leo",
    "icon": "♌",
    "type": "glossary-sign",
    "scope": "global",
    "tags": ["Signos", "fuego", "fijo"],
    "preview": {
      "summary": "Leo representa la expresión del yo, la creatividad y el brillo personal.",
      "tips": ["Elemento: fuego", "Modalidad: fijo", "Regente: Sol"],
      "metadata": {"element": "fuego", "modality": "fijo", "ruler": "Sol"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?sign=leo"
    }
  }'::JSONB,
  'glossary-sign',
  'global',
  TRUE,
  25,
  NOW() - INTERVAL '1 hour'
) ON CONFLICT DO NOTHING;

-- Favorito: Ascendente en Libra
INSERT INTO public.favorites (
  user_id,
  favorite_data,
  favorite_type,
  favorite_scope,
  usage_count,
  last_accessed_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '{
    "title": "ASC en Libra",
    "icon": "♎",
    "type": "glossary-ascendant",
    "scope": "global",
    "tags": ["Ascendente", "Libra"],
    "preview": {
      "summary": "Personas diplomáticas, elegantes y con sentido de la justicia.",
      "tips": ["Regente: Venus", "Chakra: Corazón", "Color: Rosa"],
      "metadata": {"ruler": "Venus", "chakra": "Anahata", "frequency": "639 Hz"}
    },
    "source": {
      "section": "Glosario",
      "ref": "/glossary?ascendant=libra"
    }
  }'::JSONB,
  'glossary-ascendant',
  'global',
  10,
  NOW() - INTERVAL '5 hours'
) ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Mostrar estadísticas de seed
DO $$
DECLARE
  v_user1_count INTEGER;
  v_user2_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_user1_count 
  FROM public.favorites 
  WHERE user_id = '11111111-1111-1111-1111-111111111111';
  
  SELECT COUNT(*) INTO v_user2_count 
  FROM public.favorites 
  WHERE user_id = '22222222-2222-2222-2222-222222222222';
  
  RAISE NOTICE '✓ Seed data inserted successfully';
  RAISE NOTICE '  - User 1: % favorites', v_user1_count;
  RAISE NOTICE '  - User 2: % favorites', v_user2_count;
  RAISE NOTICE '  - Total: % favorites', v_user1_count + v_user2_count;
END $$;

-- Mostrar favoritos más relevantes (User 1)
SELECT 
  favorite_data->>'title' as title,
  favorite_type,
  is_pinned,
  usage_count,
  last_accessed_at
FROM public.favorites
WHERE user_id = '11111111-1111-1111-1111-111111111111'
ORDER BY 
  CASE WHEN is_pinned THEN 0 ELSE 1 END,
  usage_count DESC;
