import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useI18n } from '../i18n';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bienvenida */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-purple-900 mb-2">
              {t('dashboard.title', { name: user?.name || 'Usuario' })}
            </h2>
            <p className="text-purple-700">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Grid de funcionalidades */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center max-w-6xl mx-auto">
            {/* Carta Natal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎯</span>
                <h3 className="text-xl font-semibold text-purple-900">{t('dashboard.natalChart.title')}</h3>
              </div>
              <p className="text-purple-700 mb-4">
                {t('dashboard.natalChart.description')}
              </p>
              <Link 
                to="/natal-chart"
                className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-center"
              >
                {t('dashboard.natalChart.button')}
              </Link>
            </div>

            {/* Glosario */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📚</span>
                <h3 className="text-xl font-semibold text-purple-900">{t('dashboard.glossary.title')}</h3>
              </div>
              <p className="text-purple-700 mb-4">
                {t('dashboard.glossary.description')}
              </p>
              <Link 
                to="/glossary"
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-center"
              >
                {t('dashboard.glossary.button')}
              </Link>
            </div>

            {/* Cartas Guardadas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💾</span>
                <h3 className="text-xl font-semibold text-purple-900">Mis Cartas</h3>
              </div>
              <p className="text-purple-700 mb-4">
                Gestiona tus cartas natales guardadas y exporta datos
              </p>
              <Link 
                to="/saved-charts"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
              >
                Ver cartas
              </Link>
            </div>

            {/* Configuración */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">⚙️</span>
                <h3 className="text-xl font-semibold text-purple-900">Configuración</h3>
              </div>
              <p className="text-purple-700 mb-4">
                Personaliza tema, orbes, métodos de casas y más
              </p>
              <Link 
                to="/settings"
                className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center"
              >
                Configurar
              </Link>
            </div>

            {/* Próximamente */}
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-6 shadow-lg border border-purple-200 w-full max-w-sm">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🔮</span>
                <h3 className="text-xl font-semibold text-purple-800">Próximamente</h3>
              </div>
              <p className="text-purple-600 mb-4">
                Tránsitos, sinastría, calendario lunar y más funciones
              </p>
              <div className="bg-purple-200 text-purple-800 py-2 px-4 rounded-lg text-center font-medium">
                En desarrollo
              </div>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-purple-100 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4 text-center">Estado de tu laboratorio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-purple-700 text-sm">Cartas creadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">2,193</div>
                <div className="text-purple-700 text-sm">Términos en glosario</div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Dashboard;