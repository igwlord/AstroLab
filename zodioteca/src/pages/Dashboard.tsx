import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import AstrologicalWeatherCard from '../components/AstrologicalWeatherCard';

const Dashboard: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl w-full">
        {/* Clima Astrológico del Día */}
        <div className="mb-4 sm:mb-6 mx-auto max-w-4xl">
          <AstrologicalWeatherCard />
        </div>

        {/* Grid de funcionalidades con diseño hero - 2x2 en móvil */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto">
          {/* Carta Natal - Destacado */}
          <Link 
            to="/natal-chart"
            className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-[1.02] group border border-purple-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2">
                <span className="text-3xl sm:text-4xl mb-1 sm:mb-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎯</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full">Popular</span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-1.5">
                {t('dashboard.natalChart.title')}
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 mb-2 sm:mb-3 hidden sm:block">
                {t('dashboard.natalChart.description')}
              </p>
              <span className="inline-flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                <span className="hidden sm:inline">{t('dashboard.natalChart.button')}</span>
                <span className="sm:hidden">Calcular</span>
                <span className="text-sm">→</span>
              </span>
            </div>
          </Link>

          {/* Glosario */}
          <Link 
            to="/glossary"
            className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-[1.02] group border border-indigo-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-2">
                <span className="text-3xl sm:text-4xl mb-1 sm:mb-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">📚</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full whitespace-nowrap">2,193</span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-1.5">
                {t('dashboard.glossary.title')}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 mb-2 sm:mb-3 hidden sm:block">
                {t('dashboard.glossary.description')}
              </p>
              <span className="inline-flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                <span className="hidden sm:inline">{t('dashboard.glossary.button')}</span>
                <span className="sm:hidden">Explorar</span>
                <span className="text-sm">→</span>
              </span>
            </div>
          </Link>

          {/* Mis Cartas */}
          <Link 
            to="/saved-charts"
            className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-[1.02] group border border-emerald-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <span className="text-3xl sm:text-4xl mb-2 inline-block group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">💾</span>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-1.5">
                Mis Cartas
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 mb-2 sm:mb-3 hidden sm:block">
                Gestiona tus cartas natales guardadas y exporta datos
              </p>
              <span className="inline-flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                <span className="hidden sm:inline">Ver cartas</span>
                <span className="sm:hidden">Ver</span>
                <span className="text-sm">→</span>
              </span>
            </div>
          </Link>

          {/* Frecuencias */}
          <Link 
            to="/frequencies"
            className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-violet-700 dark:from-violet-600 dark:to-violet-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl hover:shadow-violet-500/50 transition-all duration-500 hover:scale-[1.02] group border border-violet-400/20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <span className="text-3xl sm:text-4xl mb-2 inline-block group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎵</span>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-1.5">
                Frecuencias
              </h3>
              <p className="text-xs sm:text-sm text-violet-100 mb-2 sm:mb-3 hidden sm:block">
                Explora frecuencias sagradas y solfeggio
              </p>
              <span className="inline-flex items-center gap-1 sm:gap-2 text-white font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                <span className="hidden sm:inline">Explorar</span>
                <span className="sm:hidden">Explorar</span>
                <span className="text-sm">→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;