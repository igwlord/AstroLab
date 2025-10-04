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
        className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg px-3 py-2 text-sm text-purple-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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