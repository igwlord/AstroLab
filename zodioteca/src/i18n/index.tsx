import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

// Importamos las traducciones
import es from './es.json';
import en from './en.json';

// Tipos de traducciones
type TranslationValue = string | { [key: string]: TranslationValue };
type Translations = { [key: string]: TranslationValue };

const translations: { [key: string]: Translations } = {
  es,
  en,
};

// Función para obtener valor anidado de un objeto usando notación de puntos
const getNestedValue = (obj: Translations, path: string): string => {
  return path.split('.').reduce((current: any, key: string) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj) as string;
};

// Función para reemplazar interpolaciones como {{name}}
const interpolate = (template: string, values: { [key: string]: string } = {}): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] || match;
  });
};

export const useI18n = () => {
  // Por ahora usamos localStorage directamente, luego integraremos con el store de settings
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('astrolab-language');
    if (saved && translations[saved]) {
      return saved;
    }
    
    // SIEMPRE usar español - ignorar idioma del navegador
    return 'es';
  });
  
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations[language]);

  // Actualizar traducciones cuando cambie el idioma
  useEffect(() => {
    setCurrentTranslations(translations[language] || translations.es);
  }, [language]);

  // Función para traducir una clave
  const t = useCallback((key: string, interpolations?: { [key: string]: string }): string => {
    const value = getNestedValue(currentTranslations, key);
    return interpolations ? interpolate(value, interpolations) : value;
  }, [currentTranslations]);

  // Función para cambiar idioma
  const changeLanguage = useCallback((newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
      localStorage.setItem('astrolab-language', newLanguage);
    }
  }, []);

  // Obtener idiomas disponibles
  const availableLanguages = Object.keys(translations);

  // Obtener idioma actual
  const currentLanguage = language;

  return {
    t,
    changeLanguage,
    currentLanguage,
    availableLanguages,
  };
};

// Hook para obtener el idioma preferido del navegador
export const useDetectLanguage = () => {
  const getPreferredLanguage = useCallback((): string => {
    // Primero verificar localStorage
    const saved = localStorage.getItem('astrolab-language');
    if (saved && translations[saved]) {
      return saved;
    }

    // SIEMPRE usar español por defecto
    return 'es';
  }, []);

  return { getPreferredLanguage };
};

// Contexto para las traducciones
interface I18nContextType {
  t: (key: string, interpolations?: { [key: string]: string }) => string;
  changeLanguage: (language: string) => void;
  currentLanguage: string;
  availableLanguages: string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const i18n = useI18n();
  
  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
};

// Componente helper para formatear fechas según el idioma
export const useDateFormat = () => {
  const { currentLanguage } = useI18n();

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const locale = currentLanguage === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(date);
  }, [currentLanguage]);

  const formatTime = useCallback((date: Date): string => {
    const locale = currentLanguage === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: currentLanguage === 'en',
    }).format(date);
  }, [currentLanguage]);

  return { formatDate, formatTime };
};