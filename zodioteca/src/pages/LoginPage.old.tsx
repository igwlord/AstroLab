export {};
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { loginWithGoogle, loginAnonymous, loading } = useAuth();

  const handleGoogleLogin = async () => {
    console.log('🔵 [LoginPage] Botón clickeado - FORZANDO REDIRECT', { isProcessing, loading });
    
    // CRÍTICO: Evitar doble click
    if (isProcessing || loading) {
      console.log('⚠️ [LoginPage] Ya hay un proceso en curso, ignorando click');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      console.log('🔵 [LoginPage] Llamando loginWithGoogle con REDIRECT...');
      // FORZAR REDIRECT en lugar de popup
      const result = await loginWithGoogle(true); // true = usar redirect
      console.log('🔵 [LoginPage] Resultado:', result);
      
      // Con redirect, la página se recarga, así que esto no se ejecutará
      if (!result.success && !result.pending) {
        const errorMsg = result.error || 'Error al iniciar sesión con Google';
        setError(errorMsg);
        
        // Limpiar error después de 5 segundos si fue cerrada por usuario
        if (errorMsg.includes('cerrada')) {
          setTimeout(() => setError(''), 5000);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    const result = await loginAnonymous();
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión en modo prueba');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-6xl">🌙</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            ASTROLAB
          </h1>
          <p className="text-purple-200 text-lg">
            Tu laboratorio astrológico personal
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-white text-xl font-semibold mb-6 text-center">
            Inicia sesión para continuar
          </h2>

          {/* Error/Info message */}
          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${
              error.includes('cerrada') || error.includes('cancelada') 
                ? 'bg-yellow-500/20 border-yellow-400/50' 
                : 'bg-red-500/20 border-red-400/50'
            }`}>
              <p className={`text-sm text-center flex items-center justify-center gap-2 ${
                error.includes('cerrada') || error.includes('cancelada')
                  ? 'text-yellow-200'
                  : 'text-red-200'
              }`}>
                <span>{error.includes('cerrada') || error.includes('cancelada') ? '⚠️' : '❌'}</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || isProcessing}
            className="w-full bg-white text-gray-700 py-4 px-4 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-4 flex items-center justify-center gap-3"
          >
            {(loading || isProcessing) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-700 border-t-transparent"></div>
                <span className="ml-2">Redirigiendo a Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 text-purple-200">o</span>
            </div>
          </div>

          {/* Anonymous login */}
          <button
            onClick={handleAnonymousLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Ingresando...
              </div>
            ) : (
              '🌟 Probar en modo anónimo'
            )}
          </button>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-100 text-xs text-center">
                <span className="font-semibold">⚡ Nota:</span> Serás redirigido a Google para autenticarte de forma segura. La página se recargará automáticamente.
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
              <p className="text-blue-100 text-xs text-center">
                <span className="font-semibold">Con Google:</span> Guarda tus cartas y configuración en la nube ☁️
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
              <p className="text-purple-100 text-xs text-center">
                <span className="font-semibold">Modo Anónimo:</span> Prueba sin registrarte (datos solo en este dispositivo) 📱
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <ul className="text-purple-200 text-sm space-y-2 text-left">
              <li>🎯 Calcula tu carta natal completa</li>
              <li>📚 Explora el glosario astrológico</li>
              <li>🎵 Medita con frecuencias holísticas</li>
              <li>💾 Guarda y comparte tus cartas</li>
              <li>🌙 Funciona sin conexión</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;