/**
 * Configuración de Supabase
 * Las credenciales están en el archivo .env (no se suben a git)
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️ Faltan credenciales de Supabase. Verifica que el archivo .env exista con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  );
}

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};
