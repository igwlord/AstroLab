import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../services/supabaseService';
import { logger } from '../utils/logger';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSupabase();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Verificar si hay un token de recuperación en la URL
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    logger.log('🔐 ResetPassword - URL params:', { accessToken: !!accessToken, type });
    
    if (type === 'recovery' && accessToken) {
      setTokenValid(true);
      logger.log('✅ Token de recuperación válido detectado');
    } else if (user) {
      // Si ya hay sesión activa (después de hacer clic en el link)
      setTokenValid(true);
      logger.log('✅ Usuario autenticado, puede cambiar contraseña');
    } else {
      setError('Link de recuperación inválido o expirado');
      logger.warn('⚠️ No hay token ni usuario autenticado');
    }
  }, [searchParams, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validaciones
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      logger.log('🔄 Actualizando contraseña...');
      
      // Actualizar contraseña usando Supabase Auth
      const { error: updateError } = await supabase.updatePassword(newPassword);

      if (updateError) {
        throw new Error(updateError);
      }

      logger.log('✅ Contraseña actualizada exitosamente');
      setSuccess(true);

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      logger.error('❌ Error al actualizar contraseña:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-900 to-purple-900 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-purple-100 dark:border-purple-700">
          {/* Logo/Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              🔐 Restablecer Contraseña
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {/* Mensajes */}
          {!tokenValid && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400 text-center">
                ❌ {error || 'Link de recuperación inválido o expirado'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Volver al Login
              </button>
            </div>
          )}

          {tokenValid && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Repite tu nueva contraseña"
                  required
                  minLength={6}
                />
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Actualizando...
                  </span>
                ) : (
                  '🔓 Actualizar Contraseña'
                )}
              </button>
            </form>
          )}

          {/* Success message */}
          {success && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
                  ¡Contraseña actualizada!
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Redirigiendo al login...
                </p>
              </div>
            </div>
          )}

          {/* Link volver */}
          {!success && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                ← Volver al login
              </button>
            </div>
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-4 text-center">
          <p className="text-xs text-purple-200 dark:text-purple-400">
            🔒 Tu contraseña está encriptada y segura
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
