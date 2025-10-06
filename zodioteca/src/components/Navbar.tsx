import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../context/useAuth';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
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
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-xl sm:text-2xl">🌙</span>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100">ASTROLAB</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1.5 lg:space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 font-medium'
                    : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-purple-100'
                }`}
              >
                <span className="text-base lg:text-lg">{item.icon}</span>
                <span className="text-xs lg:text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Tools */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <ThemeToggle />
            <LanguageSelector />
            
            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-lg lg:text-xl">{user?.avatar}</span>
              <span className="text-purple-800 dark:text-purple-200 font-medium text-xs lg:text-sm">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="bg-purple-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-xs lg:text-sm"
            >
              {t('auth.logout')}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-purple-900 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-200 dark:border-purple-800 py-2 sm:py-4">
            <div className="space-y-1 sm:space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 font-medium'
                      : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-purple-100'
                  }`}
                >
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Tools */}
              <div className="border-t border-purple-200 dark:border-purple-800 pt-2 sm:pt-4 mt-2 sm:mt-4">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
                  
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="text-lg sm:text-xl">{user?.avatar}</span>
                    <span className="text-purple-800 dark:text-purple-200 font-medium text-xs sm:text-sm">{user?.name}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 bg-purple-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  {t('auth.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;