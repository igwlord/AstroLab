import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useI18n } from '../i18n';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Bienvenida */}
          <div className="mb-4 sm:mb-6 md:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
              {t('dashboard.title', { name: user?.name || 'Usuario' })}
            </h2>
            <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Grid de funcionalidades - Cuadrícula compacta en móviles */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Carta Natal */}
            <Link 
              to="/natal-chart"
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-md sm:shadow-lg border border-purple-100 dark:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎯</span>
              <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
                {t('dashboard.natalChart.title')}
              </h3>
              <p className="text-xs sm:text-base text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none hidden sm:block">
                {t('dashboard.natalChart.description')}
              </p>
              <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {t('dashboard.natalChart.button')}
              </span>
            </Link>

            {/* Glosario */}
            <Link 
              to="/glossary"
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-md sm:shadow-lg border border-purple-100 dark:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">📚</span>
              <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
                {t('dashboard.glossary.title')}
              </h3>
              <p className="text-xs sm:text-base text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none hidden sm:block">
                {t('dashboard.glossary.description')}
              </p>
              <span className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                {t('dashboard.glossary.button')}
              </span>
            </Link>

            {/* Cartas Guardadas */}
            <Link 
              to="/saved-charts"
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-md sm:shadow-lg border border-purple-100 dark:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">💾</span>
              <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
                Mis Cartas
              </h3>
              <p className="text-xs sm:text-base text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none hidden sm:block">
                Gestiona tus cartas natales guardadas y exporta datos
              </p>
              <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                Ver cartas
              </span>
            </Link>

            {/* Frecuencias */}
            <Link 
              to="/frequencies"
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 shadow-md sm:shadow-lg border border-purple-100 dark:border-purple-700 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎵</span>
              <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
                Frecuencias
              </h3>
              <p className="text-xs sm:text-base text-purple-700 dark:text-purple-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none hidden sm:block">
                Explora frecuencias sagradas y solfeggio
              </p>
              <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                Explorar
              </span>
            </Link>
          </div>

          {/* Stats rápidas */}
          <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-purple-100 dark:border-purple-700 max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3 sm:mb-4 text-center">Estado de tu laboratorio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                <div className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm">Cartas creadas</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">2,193</div>
                <div className="text-purple-700 dark:text-purple-300 text-xs sm:text-sm">Términos en glosario</div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Dashboard;