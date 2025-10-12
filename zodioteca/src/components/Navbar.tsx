import React, { useState, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import ThemeToggle from './ThemeToggle';
import BiographyModal from './BiographyModal';

// ⚡ FASE 3: Lazy load FloatingMiniPlayer (16.94 KB)
const FloatingMiniPlayer = lazy(() => import('./FloatingMiniPlayer'));

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBiographyOpen, setIsBiographyOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard'), icon: '🏠' },
    { path: '/natal-chart', label: t('navigation.natalChart'), icon: '🎯' },
    { path: '/glossary', label: t('navigation.glossary'), icon: '📚' },
    { path: '/frequencies', label: t('navigation.frequencies'), icon: '🎵' },
    { path: '/favorites', label: 'Favoritos', icon: '⭐' },
    { path: '/saved-charts', label: t('navigation.savedCharts'), icon: '💾' },
    { path: '/settings', label: t('navigation.settings'), icon: '⚙️' },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-purple-900/95 via-violet-900/95 to-purple-900/95 dark:from-gray-900/95 dark:via-purple-950/95 dark:to-gray-900/95 backdrop-blur-md shadow-2xl border-b-2 border-purple-500/30 dark:border-purple-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo Mejorado - Clickeable para abrir biografía */}
          <button
            onClick={() => setIsBiographyOpen(true)}
            className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded-lg p-1 sm:p-2"
            title="Conoce más sobre Astro Lab"
          >
            <div className="relative">
              <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(251,191,36,1)] group-hover:animate-glow-pulse transition-all duration-300">
                🌙
              </span>
              <span className="absolute -top-1 -right-1 text-xs sm:text-sm animate-pulse group-hover:animate-spin-slow transition-all duration-300">✨</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)] transition-all duration-300">
                ASTROLAB
              </h1>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-purple-300/80 dark:text-purple-400/60 tracking-[0.2em] font-semibold -mt-1 group-hover:text-amber-300/90 transition-colors duration-300">
                LABORATORIO ASTROLÓGICO
              </span>
            </div>
          </button>

          {/* Desktop Navigation - Diseño Mejorado */}
          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 bg-purple-950/40 dark:bg-gray-950/40 backdrop-blur-sm rounded-full px-1.5 lg:px-2 py-1.5 shadow-inner border border-purple-400/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-1.5 px-2 lg:px-3 py-1.5 lg:py-2 rounded-full transition-all duration-300 ${
                  isActiveRoute(item.path)
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 shadow-lg shadow-amber-500/50 scale-105'
                    : 'text-purple-100 hover:bg-purple-800/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
                }`}
              >
                <span className={`text-base lg:text-lg transition-transform duration-300 ${
                  isActiveRoute(item.path) ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] lg:text-xs font-semibold tracking-tight ${
                  isActiveRoute(item.path) ? 'drop-shadow-sm' : ''
                }`}>
                  {item.label}
                </span>
                {isActiveRoute(item.path) && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-950 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Tools - Solo Theme Toggle */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 sm:p-2.5 rounded-full text-purple-100 hover:bg-purple-800/50 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu - Overlay Profesional */}
        {isMenuOpen && (
          <>
            {/* Backdrop oscuro */}
            <div 
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu desplegable desde arriba */}
            <div className="md:hidden fixed top-[4.5rem] left-0 right-0 z-50 bg-gradient-to-b from-purple-950/98 via-purple-900/98 to-purple-950/98 backdrop-blur-xl shadow-2xl border-b-2 border-purple-500/30 animate-slideDown max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActiveRoute(item.path)
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-bold shadow-lg shadow-amber-500/40'
                        : 'text-purple-100 hover:bg-purple-800/60 active:bg-purple-700/80'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-base font-semibold">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mini Player Mobile - Integrado en el menú */}
                <Suspense fallback={null}>
                  <FloatingMiniPlayer isMobile={true} />
                </Suspense>
                
                {/* Mobile Tools - Theme Toggle */}
                <div className="border-t border-purple-500/30 pt-4 mt-4">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Biografía */}
      <BiographyModal 
        isOpen={isBiographyOpen} 
        onClose={() => setIsBiographyOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;