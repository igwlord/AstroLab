import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const { login, loading } = useAuth();

  const handleDemoLogin = async () => {
    await login('demo@zodioteca.com', 'demo123');
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
          {/* Demo login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-4 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Ingresando...
              </div>
            ) : (
              '🌟 Probar con cuenta demo'
            )}
          </button>

          {/* Info demo */}
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <p className="text-yellow-100 text-sm text-center">
              <span className="font-semibold">Demo:</span> Prueba todas las funciones sin registrarte
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-purple-300 text-sm">
            ¿Nuevo en AstroLab?{' '}
            <button 
              onClick={() => setShowDemo(!showDemo)}
              className="text-yellow-300 hover:text-yellow-200 font-semibold underline"
            >
              Descubre qué puedes hacer
            </button>
          </p>
          
          {showDemo && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <ul className="text-purple-200 text-sm space-y-2 text-left">
                <li>🎯 Calcula tu carta natal completa</li>
                <li>📚 Explora el glosario astrológico</li>
                <li>🎵 Medita con frecuencias holísticas</li>
                <li>💾 Guarda y comparte tus cartas</li>
                <li>🌙 Funciona sin conexión</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;