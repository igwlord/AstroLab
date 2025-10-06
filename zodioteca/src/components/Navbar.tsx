import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: t('navigation.dashboard'), icon: '🏠' },
    { path: '/natal-chart', label: t('navigation.natalChart'), icon: '🎯' },
    { path: '/glossary', label: t('navigation.glossary'), icon: '📚' },
    { path: '/frequencies', label: t('navigation.frequencies'), icon: '🎵' },
    { path: '/saved-charts', label: t('navigation.savedCharts'), icon: '💾' },
    { path: '/settings', label: t('navigation.settings'), icon: '⚙️' },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-purple-900/95 via-violet-900/95 to-purple-900/95 dark:from-gray-900/95 dark:via-purple-950/95 dark:to-gray-900/95 backdrop-blur-md shadow-2xl border-b-2 border-purple-500/30 dark:border-purple-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo Mejorado */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 sm:space-x-3 group transition-transform hover:scale-105 duration-300"
          >
            <div className="relative">
              <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all duration-300">
                🌙
              </span>
              <span className="absolute -top-1 -right-1 text-xs sm:text-sm animate-pulse">✨</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                ASTROLAB
              </h1>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-purple-300/80 dark:text-purple-400/60 tracking-[0.2em] font-semibold -mt-1">
                LABORATORIO ASTROLÓGICO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Diseño Mejorado */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-purple-950/40 dark:bg-gray-950/40 backdrop-blur-sm rounded-full px-2 lg:px-3 py-2 shadow-inner border border-purple-400/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full transition-all duration-300 ${
                  isActiveRoute(item.path)
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 shadow-lg shadow-amber-500/50 scale-105'
                    : 'text-purple-100 hover:bg-purple-800/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30'
                }`}
              >
                <span className={`text-lg lg:text-xl transition-transform duration-300 ${
                  isActiveRoute(item.path) ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <span className={`text-xs lg:text-sm font-semibold tracking-wide ${
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-500/30 py-3 sm:py-4 bg-purple-950/40 backdrop-blur-sm">
            <div className="space-y-1.5 sm:space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-semibold shadow-lg shadow-amber-500/30 scale-[1.02]'
                      : 'text-purple-100 hover:bg-purple-800/50 hover:scale-[1.02] hover:shadow-md'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{item.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Tools - Solo Theme Toggle */}
              <div className="border-t border-purple-500/30 pt-3 sm:pt-4 mt-3 sm:mt-4 px-3 sm:px-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;