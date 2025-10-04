import React from 'react';
import { useI18n } from '../i18n';
import { useThemeStore } from '../store/useTheme';

const ThemeToggle: React.FC = () => {
  const { t } = useI18n();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-200 text-purple-900 hover:bg-white transition-all duration-200"
      title={isDark ? t('settings.appearance.light') : t('settings.appearance.dark')}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;