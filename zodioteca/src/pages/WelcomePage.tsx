/**
 * Página de Bienvenida
 * Se muestra después del registro exitoso
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Cloud, Zap } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleGetStarted = () => {
    navigate('/natal-chart');
  };

  const handleViewSavedCharts = () => {
    navigate('/saved-charts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      <div
        className={`max-w-4xl w-full transition-all duration-1000 transform ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Tarjeta principal */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Header con animación de estrellas */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ✨ ¡Bienvenido a AstroLab!
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Tu cuenta ha sido creada exitosamente. Estás listo para explorar el universo astrológico.
            </p>
          </div>

          {/* Características */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Cartas Natales Precisas
              </h3>
              <p className="text-sm text-white/70">
                Cálculos astronómicos avanzados con Swiss Ephemeris para máxima precisión.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sincronización en la Nube
              </h3>
              <p className="text-sm text-white/70">
                Tus cartas se guardan automáticamente y están disponibles en todos tus dispositivos.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Análisis Instantáneo
              </h3>
              <p className="text-sm text-white/70">
                Aspectos, dignidades, dominancias y más de 40 puntos astrológicos calculados al instante.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Calcular mi Primera Carta
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={handleViewSavedCharts}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              Ver Mis Cartas Guardadas
            </button>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/60">
              💡 <strong>Consejo:</strong> Guarda tus cartas favoritas para acceder rápidamente desde cualquier dispositivo
            </p>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
