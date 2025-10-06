import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useThemeStore } from '../store/useTheme';
import { useAuth } from '../context/useAuth';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/LanguageSelector';

const SettingsPage: React.FC = () => {
  const { t } = useI18n();
  const { isDark } = useThemeStore();
  const { user, logout, syncSettings } = useAuth();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Sincronizar settings cuando cambien
  useEffect(() => {
    const syncTheme = async () => {
      if (user && !user.isAnonymous) {
        await syncSettings({ theme: isDark ? 'dark' : 'light' });
      }
    };
    syncTheme();
  }, [isDark, user, syncSettings]);

  const handleLogout = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };

  const handleManualSync = async () => {
    if (!user || user.isAnonymous) {
      setSyncMessage('Inicia sesión con Google para sincronizar');
      return;
    }
    
    setIsSyncing(true);
    setSyncMessage('');
    
    try {
      await syncSettings({ theme: isDark ? 'dark' : 'light' });
      setSyncMessage('✅ Configuración sincronizada correctamente');
      setTimeout(() => setSyncMessage(''), 3000);
    } catch {
      setSyncMessage('❌ Error al sincronizar');
    } finally {
      setIsSyncing(false);
    }
  };

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

        {/* Cuenta y Sesión */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-700">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
            👤 Cuenta
          </h2>
          
          <div className="space-y-4">
            {/* Info del usuario */}
            {user && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {user.avatar || '🌟'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900 dark:text-purple-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">
                      {user.email || 'Modo anónimo'}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {user.isAnonymous ? (
                        <span className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                          📱 Datos solo en este dispositivo
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                          ☁️ Sincronizado con la nube
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sincronización manual */}
            {user && !user.isAnonymous && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Sincronización automática
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Tus configuraciones se guardan automáticamente
                    </p>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSyncing ? '⏳ Sincronizando...' : '🔄 Sincronizar ahora'}
                  </button>
                </div>
                {syncMessage && (
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    {syncMessage}
                  </div>
                )}
              </div>
            )}

            {/* Botón de cerrar sesión */}
            <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
              <p className="text-xs text-center text-purple-600 dark:text-purple-400 mt-2">Sesión finalizada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;