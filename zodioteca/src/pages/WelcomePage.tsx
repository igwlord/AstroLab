/**
 * 🌟 Página de Bienvenida ÉPICA
 * La primera impresión que nunca olvidarán
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Cloud, Zap } from '../utils/icons';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animación de entrada suave
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleGetStarted = () => {
    navigate('/natal-chart');
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1433 0%, #2d1b69 20%, #4a148c 40%, #6a1b9a 60%, #8e24aa 80%, #9c27b0 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite, fadeIn 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(167, 139, 250, 0.5); }
          50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(167, 139, 250, 0.8); }
        }
        
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>

      {/* Partículas flotantes de fondo */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 3 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      <div className="max-w-5xl w-full relative z-10">
        {/* Header ÉPICO con animación */}
        <div 
          className="text-center mb-8 sm:mb-12"
          style={{
            animation: showContent ? 'scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            opacity: showContent ? 1 : 0
          }}
        >
          {/* Icono central con efecto glow */}
          <div className="relative inline-block mb-6">
            <div 
              className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-60"
              style={{ 
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), rgba(251, 191, 36, 0.4))',
                animation: 'glow 3s ease-in-out infinite' 
              }}
            />
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-purple-600 via-violet-500 to-amber-400 rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 text-amber-100 animate-pulse" />
            </div>
          </div>
          
          {/* Título principal con gradiente dorado-violeta */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight px-2"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 20%, #d8b4fe 40%, #c084fc 60%, #a855f7 80%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 60px rgba(251, 191, 36, 0.3)',
              filter: 'drop-shadow(0 2px 8px rgba(139, 92, 246, 0.3))'
            }}
          >
            ¡Bienvenido a AstroLab!
          </h1>
          
          {/* Subtítulo elegante */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Tu cuenta ha sido creada exitosamente. 
            <span className="block mt-1 sm:mt-2 font-semibold text-white text-sm sm:text-base">
              ✨ Estás listo para explorar el universo astrológico ✨
            </span>
          </p>
        </div>

        {/* Características ÉPICAS con animaciones escalonadas */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-4">
          {[
            {
              icon: TrendingUp,
              title: 'Cartas Natales Precisas',
              description: 'Cálculos astronómicos avanzados con un toque de glamour y estrellas.',
              gradient: 'from-purple-600 via-violet-600 to-purple-700',
              delay: '0.2s'
            },
            {
              icon: Cloud,
              title: 'Sincronización en la Nube',
              description: 'Tus cartas se guardan automáticamente en una galaxia y están disponibles en todos tus dispositivos.',
              gradient: 'from-indigo-600 via-violet-600 to-indigo-700',
              delay: '0.4s'
            },
            {
              icon: Zap,
              title: 'Prueba los Ejercicios',
              description: 'Ascendentes, lunas, astros y planetas son calculados para darte ejercicios que te potenciarán con magia.',
              gradient: 'from-violet-600 via-purple-600 to-violet-700',
              delay: '0.6s'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: showContent ? `slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${feature.delay} forwards` : 'none',
                opacity: showContent ? 1 : 0
              }}
            >
              {/* Glow effect en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-amber-500/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Tarjeta principal */}
              <div className="relative bg-violet-900/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-violet-500/20 shadow-xl hover:bg-violet-800/30 hover:border-amber-400/40 hover:shadow-amber-500/50 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500">
                {/* Icono con gradiente */}
                <div className={`relative mb-4 sm:mb-5 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl blur-sm sm:blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Título */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-all duration-500">
                  {feature.title}
                </h3>
                
                {/* Descripción */}
                <p className="text-sm sm:text-base text-white/80 leading-relaxed group-hover:text-white transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs ÉPICOS con animaciones */}
        <div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center mb-8 sm:mb-10 px-4"
          style={{
            animation: showContent ? 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s forwards' : 'none',
            opacity: showContent ? 1 : 0
          }}
        >
          {/* Botón principal con efecto partículas */}
          <button
            onClick={handleGetStarted}
            className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 via-violet-500 to-amber-500 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg text-white shadow-xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-500 overflow-hidden w-full sm:w-auto"
          >
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Contenido del botón */}
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
              <span className="tracking-wide">Calcular mi Primera Carta</span>
            </span>
            
            {/* Glow pulsante */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl bg-amber-500/50 opacity-0 group-hover:opacity-100 animate-pulse" style={{ zIndex: -1 }} />
          </button>

          {/* Botón secundario elegante */}
          <button
            onClick={() => navigate('/glossary')}
            className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-violet-900/30 backdrop-blur-xl rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-amber-100 border-2 border-violet-500/40 shadow-lg hover:bg-violet-800/40 hover:border-amber-400/60 hover:scale-105 transition-all duration-500 w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Visita el Glosario
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>

        {/* Footer con diseño mejorado */}
        <div 
          className="text-center px-4"
          style={{
            animation: showContent ? 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards' : 'none',
            opacity: showContent ? 1 : 0
          }}
        >
          <div className="inline-block bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 border border-white/10 shadow-lg max-w-2xl">
            <p className="text-xs sm:text-sm md:text-base text-white/80">
              <span className="text-xl sm:text-2xl mr-1 sm:mr-2">💡</span>
              <strong className="text-white">Consejo:</strong> Guarda tus cartas favoritas para acceder rápidamente desde cualquier dispositivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
