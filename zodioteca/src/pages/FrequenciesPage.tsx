import { useI18n } from '../i18n';

const FrequenciesPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2 sm:mb-3 md:mb-4">
          {t('frequencies.title')}
        </h1>
        <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300 px-2">
          Medita con sonidos holísticos y ejercicios de integración
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-purple-100 dark:border-purple-700">
        <div className="text-center">
          <span className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 block">🎵</span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-900 dark:text-purple-100 mb-3 sm:mb-4 px-2">
            Reproductor de frecuencias holísticas
          </h2>
          <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300 mb-4 sm:mb-5 md:mb-6 px-2">
            Esta sección incluirá un reproductor de audio con frecuencias sanadoras 
            (432Hz, 528Hz, etc.), ejercicios de respiración y meditaciones guiadas.
          </p>
          <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm">
            <span className="mr-1.5 sm:mr-2">🔄</span>
            FASE 8 - En desarrollo
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequenciesPage;