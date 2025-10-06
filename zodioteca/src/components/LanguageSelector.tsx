import React from 'react';
import { useI18n } from '../i18n';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useI18n();

  const languageLabels: { [key: string]: string } = {
    es: '🇪🇸 Español',
    en: '🇺🇸 English',
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-purple-900 dark:text-purple-100 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang] || lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;