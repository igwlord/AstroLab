import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../context/AuthContext';
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
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🌙</span>
            <h1 className="text-xl font-bold text-purple-900">ASTROLAB</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-purple-100 text-purple-900 font-medium'
                    : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Tools */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSelector />
            
            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">{user?.avatar}</span>
              <span className="text-purple-800 font-medium text-sm">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
            >
              {t('auth.logout')}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-purple-900 hover:bg-purple-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden border-t border-purple-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-purple-100 text-purple-900 font-medium'
                      : 'text-purple-700 hover:bg-purple-50 hover:text-purple-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Tools */}
              <div className="border-t border-purple-200 pt-4 mt-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <LanguageSelector />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{user?.avatar}</span>
                    <span className="text-purple-800 font-medium text-sm">{user?.name}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
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