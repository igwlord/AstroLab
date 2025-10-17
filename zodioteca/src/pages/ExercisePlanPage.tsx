/**
 * PÁGINA DE PLAN DE EJERCICIOS HOLÍSTICOS
 * Recibe chart desde URL params o state, genera plan personalizado
 * 
 * Versión 2.0 - Con Onboarding y Estado Vacío Mejorado
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useChartsStore, type NatalChart } from '../store/useCharts';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import { useExercisesOnboarding } from '../hooks/useExercisesOnboarding';
import { useNotification } from '../hooks/useNotification';
import PhaseSection from '../components/PhaseSection';
import WelcomeExercisesModal from '../components/WelcomeExercisesModal';
import EmptyExercisesState from '../components/EmptyExercisesState';
import SavePlanModal from '../components/SavePlanModal';
import { ChartInfoCard } from '../components/ChartInfoCard';
import { logger } from '../utils/logger';

export default function ExercisePlanPage() {
  const location = useLocation();
  const { chartId } = useParams<{ chartId?: string }>();
  const navigate = useNavigate();
  
  const { currentChart, charts } = useChartsStore();
  const { showToast, showConfirm } = useNotification();
  
  // Onboarding
  const {
    shouldShowWelcome,
    isLoading: onboardingLoading,
    markAsSeen,
  } = useExercisesOnboarding();
  
  // Usar store en lugar de estado local
  const {
    currentPlan: plan,
    isGenerating: loading,
    error,
    completedDays,
    generatePlan,
    completeDayForExercise,
    uncompleteDayForExercise,
    getCurrentWeek,
    isWeekUnlocked,
    getWeekProgress
  } = useExercisePlanStore();

  // Estado local para modales y navegación
  const [showSavePlanModal, setShowSavePlanModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  // 🚫 LOADER DESACTIVADO TEMPORALMENTE PARA PRUEBAS
  // const [showGenerationLoader, setShowGenerationLoader] = useState(false);
  const hasGeneratedRef = useRef(false);

  // Memoizar progress para evitar re-renders del modal
  // Ahora basado en días completados en lugar de ejercicios
  const progress = useMemo(() => {
    if (!plan) {
      return { completed: 0, total: 0, percent: 0 };
    }
    
    // Total = 21 días (7 días × 3 fases)
    const total = 21;
    
    // Contar días únicos completados en todas las fases
    const uniqueDays = new Set<number>();
    Object.values(completedDays).forEach(days => {
      days.forEach(day => uniqueDays.add(day));
    });
    
    const completed = uniqueDays.size;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percent };
  }, [plan, completedDays]);

  // Modo DEBUG: cargar mock charts desde query params (solo en desarrollo)
  useEffect(() => {
    async function maybeLoadMock() {
      if (import.meta.env.PROD) return;
      
      const params = new URLSearchParams(window.location.search);
      const debug = params.get('debug');
      if (!debug) return;

      try {
        logger.log(`🐛 [DEBUG] Cargando mock: ${debug}`);
        const mock = await import(`../tests/mocks/${debug}.json`);
        await generatePlan(mock.default || mock);
      } catch (e) {
        logger.error('Mock load failed', e);
      }
    }
    maybeLoadMock();
  }, [generatePlan]);

  useEffect(() => {
    async function loadAndGeneratePlan() {
      // Evitar generar múltiples veces
      if (hasGeneratedRef.current) {
        return;
      }

      // 1. Obtener chart desde state, currentChart o charts
      let chart: NatalChart | null = null;

      if (location.state?.chart) {
        chart = location.state.chart;
      } else if (chartId) {
        chart = charts.find(c => c.id === chartId) || null;
      } else if (currentChart) {
        chart = currentChart;
      }

      if (!chart) {
        logger.error('No se encontró la carta natal');
        return;
      }

      logger.log('🎯 Generando plan para:', chart.name || chart.id);

      // Marcar que ya estamos generando
      hasGeneratedRef.current = true;

      // 2. Generar plan usando el store
      await generatePlan(chart);
    }

    loadAndGeneratePlan();
  }, [chartId, location.state, currentChart, charts, generatePlan]);

  // Establecer semana actual cuando cargue el plan
  useEffect(() => {
    if (plan) {
      const currentWeek = getCurrentWeek();
      setSelectedWeek(currentWeek);
    }
  }, [plan, getCurrentWeek]);

  const handleDayComplete = (exerciseId: string, day: number) => {
    completeDayForExercise(exerciseId, day);
  };

  const handleDayUncomplete = (exerciseId: string, day: number) => {
    uncompleteDayForExercise(exerciseId, day);
  };

  const handleLoadChart = () => {
    navigate('/natal-chart');
  };

  const handleCloseWelcome = (dontShowAgain: boolean) => {
    markAsSeen(dontShowAgain);
  };

  // Mostrar modal de bienvenida si es primera visita
  if (!onboardingLoading && shouldShowWelcome && !loading && !plan) {
    return (
      <>
        <WelcomeExercisesModal
          isOpen={shouldShowWelcome}
          onClose={handleCloseWelcome}
          onLoadChart={handleLoadChart}
        />
        {/* Fondo mientras se muestra el modal */}
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
          <EmptyExercisesState onLoadChart={handleLoadChart} />
        </div>
      </>
    );
  }

  // 🚫 LOADER DESACTIVADO TEMPORALMENTE PARA PRUEBAS
  // Mostrar loader animado bonito mientras genera el plan
  // if (loading || showGenerationLoader) {
  //   return (
  //     <PlanGenerationLoader
  //       onComplete={() => {
  //         setShowGenerationLoader(false);
  //       }}
  //     />
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/natal-chart')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Ir a Carta Natal
          </button>
        </div>
      </div>
    );
  }

  // Si no hay plan, mostrar estado vacío
  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <EmptyExercisesState onLoadChart={handleLoadChart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-3 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Optimizado sin duplicados */}
        <div className="mb-3 md:mb-6">
          {/* DESKTOP: Título, slogan y navegación */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/natal-chart')}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm font-medium"
                title="Volver a Carta Natal"
              >
                ← Volver a Carta Natal
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-2">
                Tu Plan de Ejercicios Holístico
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
                Plan de 21 días personalizado basado en tu carta natal
              </p>
              
              {/* DESKTOP: Botones horizontales estilo chips/tabs - centrados */}
              <div className="flex flex-wrap justify-center gap-2">
                {plan && (
                  <button
                    onClick={() => navigate('/ejercicios/tu-carta')}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-full transition-all text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    title="Ver análisis de tu carta"
                  >
                    <span className="text-lg">🔮</span>
                    <span>Tu Plan</span>
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/ejercicios/guia')}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition-all text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  title="Ver guía de ejercicios"
                >
                  <span className="text-lg">📖</span>
                  <span>Guía</span>
                </button>
                
                <button
                  onClick={() => navigate('/saved-plans')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-full transition-all text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  title="Ver mis planes guardados"
                >
                  <span className="text-lg">📚</span>
                  <span>Planes guardados</span>
                </button>
                
                <button
                  onClick={() => navigate('/reflexiones')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full transition-all text-sm flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  title="Ver mis reflexiones astrológicas"
                >
                  <span className="text-lg">💭</span>
                  <span>Reflexiones</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* MOBILE: Header compacto y limpio */}
          <div className="md:hidden">
            {/* Navegación compacta sin cartel innecesario */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate('/natal-chart')}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-1.5 text-sm font-medium p-1.5 -ml-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                title="Volver a Carta Natal"
              >
                ← Volver
              </button>
            </div>

            {/* Título y slogan optimizados */}
            <div className="text-center mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-white mb-1 leading-tight">
                  Tu Plan Holístico
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  21 días personalizado para tu carta natal
                </p>
              </div>
              
              {/* Bottom Navigation Bar - Nueva navegación móvil */}
              <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50 safe-area-inset-bottom">
                <div className="flex justify-around items-center max-w-md mx-auto">
                  <button
                    onClick={() => navigate('/ejercicios/tu-carta')}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors min-w-[60px]"
                    title="Ver Tu Plan"
                  >
                    <span className="text-lg">🔮</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Tu Plan</span>
                  </button>

                  <button
                    onClick={() => navigate('/ejercicios/guia')}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors min-w-[60px]"
                    title="Ver Guía"
                  >
                    <span className="text-lg">📖</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Guía</span>
                  </button>

                  <button
                    onClick={() => navigate('/saved-plans')}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors min-w-[60px]"
                    title="Planes Guardados"
                  >
                    <span className="text-lg">📚</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Guardados</span>
                  </button>

                  <button
                    onClick={() => navigate('/reflexiones')}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors min-w-[60px]"
                    title="Reflexiones"
                  >
                    <span className="text-lg">💭</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Reflexiones</span>
                  </button>
                </div>
              </div>

              {/* Espacio para bottom nav */}
              <div className="h-16"></div>
            </div>
        </div>

        {/* Resumen del plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 sm:p-4 md:p-6 mb-3 md:mb-4">
          {currentChart && (
            <ChartInfoCard
              chart={currentChart}
              onSave={() => setShowSavePlanModal(true)}
              onRegenerate={async () => {
                const confirmed = await showConfirm({
                  title: '¿Regenerar plan?',
                  message: 'Se perderá el progreso actual.',
                  confirmText: 'Regenerar',
                  cancelText: 'Cancelar',
                  type: 'warning',
                  icon: '🔄'
                });

                if (confirmed) {
                  showToast('🔄 Regenerando...', 'info', 1500);
                  window.location.reload();
                }
              }}
            />
          )}
        </div>

        {/* Navegación de Semanas */}
        <div className="mb-4">
          {/* Tabs de semanas - Optimizado para 360px */}
          <div className="flex gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((week) => {
              const weekProgress = getWeekProgress(week);
              const unlocked = isWeekUnlocked(week);
              const isCurrent = week === selectedWeek;
              
              return (
                <button
                  key={week}
                  onClick={() => unlocked && setSelectedWeek(week)}
                  disabled={!unlocked}
                  className={`
                    flex-shrink-0 px-2 py-1.5 sm:px-3 sm:py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl border-2 transition-all
                    ${isCurrent 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md' 
                      : unlocked
                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-left min-w-[90px] sm:min-w-[110px] md:min-w-[160px]">
                    <div className={`text-[11px] sm:text-xs md:text-base font-semibold mb-0.5 sm:mb-1 ${isCurrent ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {week === getCurrentWeek() && unlocked ? '🔥 ' : unlocked ? '✓ ' : '🔒 '}
                      Semana {week}
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
                      Días {(week - 1) * 7 + 1}-{week * 7}
                    </div>
                    {unlocked && (
                      <div className="mt-0.5 sm:mt-1 md:mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 md:h-2">
                          <div 
                            className={`h-1 md:h-2 rounded-full transition-all duration-500 ${isCurrent ? 'bg-purple-500' : 'bg-green-500'}`}
                            style={{ width: `${weekProgress.percent}%` }}
                          />
                        </div>
                        <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
                          {weekProgress.completed}/7 días
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Semana Actual */}
        <div className="pb-20 md:pb-0">
          {selectedWeek === 1 && (
            <PhaseSection 
              phase={plan.phases.phase1} 
              completedDays={completedDays}
              onDayComplete={handleDayComplete}
              onDayUncomplete={handleDayUncomplete}
              weekNumber={1}
            />
          )}
          {selectedWeek === 2 && isWeekUnlocked(2) && (
            <PhaseSection 
              phase={plan.phases.phase2} 
              completedDays={completedDays}
              onDayComplete={handleDayComplete}
              onDayUncomplete={handleDayUncomplete}
              weekNumber={2}
            />
          )}
          {selectedWeek === 3 && isWeekUnlocked(3) && (
            <PhaseSection 
              phase={plan.phases.phase3} 
              completedDays={completedDays}
              onDayComplete={handleDayComplete}
              onDayUncomplete={handleDayUncomplete}
              weekNumber={3}
            />
          )}
        </div>

        {/* Espaciador para bottom navigation bar en móvil */}
        <div className="md:hidden h-20"></div>
      </div>

      {/* Modal de Guardar Plan */}
      {plan && (
        <SavePlanModal
          isOpen={showSavePlanModal}
          onClose={() => setShowSavePlanModal(false)}
          plan={plan}
          chartName={currentChart?.name || charts.find(c => c.id === plan.chartId)?.name}
          progress={progress}
        />
      )}
    </div>
  );
}
