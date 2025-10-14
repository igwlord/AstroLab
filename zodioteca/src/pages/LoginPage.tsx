import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import StarryBackground from '../components/StarryBackground';
import AuthModal from '../components/AuthModal';
import EphemerisLoadingScreen from '../components/EphemerisLoadingScreen';
import { useAuth } from '../context/useAuth';
import { useAuthFlow } from '../hooks/useAuthFlow';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAnonymous } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hideLoginPage, setHideLoginPage] = useState(false); // Nuevo estado
  const authFlow = useAuthFlow();

  // OPCIÓN 1: Acceder al Laboratorio (sin credenciales)
  const handleGuestMode = async () => {
    try {
      authFlow.startAuth('guest');
      toast.loading('Iniciando modo invitado...', { id: 'guest-auth' });
      
      await loginAnonymous();
      
      toast.success('¡Bienvenido al Laboratorio! 🎉', { id: 'guest-auth', duration: 2000 });
      authFlow.authSuccess('Acceso concedido', '/dashboard');
      
      // Iniciar loading inmediatamente después del éxito
      setTimeout(() => {
        authFlow.startLoading('/dashboard');
      }, 500);
    } catch (error) {
      toast.error('Error al iniciar sesión como invitado', { id: 'guest-auth' });
      authFlow.error('Error de autenticación');
      console.error('Error en guest mode:', error);
    }
  };

  // OPCIÓN 2: Login al Laboratorio (con credenciales Supabase)
  const handleLoginMode = () => {
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (destination: string) => {
    // Ocultar LoginPage INMEDIATAMENTE para que no reaparezca
    setHideLoginPage(true);
    
    // Cerrar el modal (fade out 500ms según AuthModal)
    setShowAuthModal(false);
    
    // Esperar que el modal termine su fade out antes de mostrar loading
    setTimeout(() => {
      authFlow.startLoading(destination);
    }, 500);
  };

  // Mostrar pantalla de carga (sin mostrar LoginPage debajo)
  if (authFlow.isLoading) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.5 // Delay de 500ms para que el modal se cierre primero
          }}
          style={{ position: 'fixed', inset: 0, zIndex: 10000 }}
        >
          <EphemerisLoadingScreen
            onComplete={() => {
              const destination = authFlow.state.phase === 'loading' 
                ? authFlow.state.destination 
                : '/dashboard';
              authFlow.completeLoading(destination);
              
              // Navegar inmediatamente después del fade out
              setTimeout(() => {
                navigate(destination, { replace: true });
              }, 100);
            }}
            durationMs={5000}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {/* Auth Modal con transiciones suaves */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Login Page - NO renderizar si hideLoginPage está activo */}
      {!authFlow.isLoading && !hideLoginPage && (
        <motion.div
          key="login-page"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.5,
            ease: 'easeInOut'
          }}
          className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-6 md:p-8"
        >
        {/* Fondo de estrellas reutilizable */}
        <StarryBackground />

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <div className="text-center space-y-6 sm:space-y-8">
          {/* Logo con el mismo símbolo del navbar */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="relative group">
              <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                🌙
              </span>
              <span className="absolute -top-2 -right-2 text-xl sm:text-2xl animate-pulse">✨</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
              ASTROLAB
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-purple-200/90 font-light tracking-wide px-4 leading-relaxed">
              Donde la ciencia se encuentra con las estrellas.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 sm:pt-6 space-y-4">
            {/* Botón 1: Modo de prueba (invitado) */}
            <button
              onClick={handleGuestMode}
              className="group relative w-full max-w-sm mx-auto bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-purple-950 font-bold text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-6 px-6 sm:px-8 rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-amber-400/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🔬</span>
                <span className="tracking-wide">Acceder al Laboratorio</span>
                <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform duration-300">✨</span>
              </span>
              
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <p className="text-xs sm:text-sm text-purple-200/60 text-center font-light italic px-4">
              (modo de prueba)
            </p>

            {/* Botón 2: Login con Supabase */}
            <button
              onClick={handleLoginMode}
              className="group relative w-full max-w-sm mx-auto bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-400/50 overflow-hidden"
            >
              <span className="relative z-10 flex flex-col items-center gap-1">
                <span className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">☁️</span>
                  <span className="tracking-wide">Login al Laboratorio</span>
                </span>
                <span className="text-xs sm:text-sm font-normal opacity-90">
                  (tus datos en una nube astrológica)
                </span>
              </span>
              
              {/* Efecto de brillo animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPage;
