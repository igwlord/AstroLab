import React from 'react';
import { useI18n } from '../i18n';
import { useThemeStore } from '../store/useTheme';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const SettingsPage: React.FC = () => {
  const { t } = useI18n();
  const { isDark } = useThemeStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">
          {t('settings.title')}
        </h1>
        <p className="text-purple-700">
          Personaliza tu experiencia en AstroLab
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Apariencia */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            {t('settings.appearance.title')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-purple-800 font-medium">
                  {t('settings.appearance.theme')}
                </label>
                <p className="text-sm text-purple-600">
                  Tema actual: {isDark ? t('settings.appearance.dark') : t('settings.appearance.light')}
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-purple-800 font-medium">
                  {t('settings.appearance.language')}
                </label>
                <p className="text-sm text-purple-600">
                  Cambia el idioma de la interfaz
                </p>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Configuración Astrológica */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            {t('settings.astrology.title')}
          </h2>
          
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">⚙️</span>
            <p className="text-purple-700">
              Configuraciones astrológicas avanzadas (Asteroides, Chiron, Lilith, 
              Nodos Lunares, Aspectos Menores y Partes Árabes) están disponibles.
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg mt-4">
              <span className="mr-2">✅</span>
              FASES 1-5 Completadas
            </div>
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg mt-2">
              <span className="mr-2">🔄</span>
              FASE 6: Análisis de Hemisferios - En desarrollo
            </div>
          </div>
        </div>

        {/* General */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            {t('settings.general.title')}
          </h2>
          
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🔧</span>
            <p className="text-purple-700">
              Opciones generales como guardado automático, notificaciones y 
              backup estarán disponibles en fases posteriores.
            </p>
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg mt-4">
              <span className="mr-2">🔄</span>
              FASE 9 - En desarrollo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;