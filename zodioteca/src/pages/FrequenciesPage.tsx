import React from 'react';
import { useI18n } from '../i18n';

const FrequenciesPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">
          {t('frequencies.title')}
        </h1>
        <p className="text-purple-700">
          Medita con sonidos holísticos y ejercicios de integración
        </p>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🎵</span>
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">
            Reproductor de frecuencias holísticas
          </h2>
          <p className="text-purple-700 mb-6">
            Esta sección incluirá un reproductor de audio con frecuencias sanadoras 
            (432Hz, 528Hz, etc.), ejercicios de respiración y meditaciones guiadas.
          </p>
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
            <span className="mr-2">🔄</span>
            FASE 8 - En desarrollo
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequenciesPage;