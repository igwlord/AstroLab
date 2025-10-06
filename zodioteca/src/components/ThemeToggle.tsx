import React from 'react';
import { useI18n } from '../i18n';
import { useThemeStore } from '../store/useTheme';

const ThemeToggle: React.FC = () => {
  const { t } = useI18n();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-1.5 sm:p-2 rounded-lg backdrop-blur-sm border transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-br from-purple-900/80 to-blue-900/80 border-yellow-500/50 text-yellow-300 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20' 
          : 'bg-white/80 border-purple-200 text-purple-900 hover:bg-white'
        }
      `}
      title={isDark ? t('settings.appearance.light') : t('settings.appearance.dark')}
    >
      <span className="text-base sm:text-lg md:text-xl">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;