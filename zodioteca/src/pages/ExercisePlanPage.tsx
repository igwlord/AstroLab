/**
 * PÁGINA DE PLAN DE EJERCICIOS HOLÍSTICOS
 * Recibe chart desde URL params o state, genera plan personalizado
 * 
 * Versión 2.0 - Con Onboarding y Estado Vacío Mejorado
 */

import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useChartsStore, type NatalChart } from '../store/useCharts';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import { useExercisesOnboarding } from '../hooks/useExercisesOnboarding';
import { useNotification } from '../hooks/useNotification';
import PhaseSection from '../components/PhaseSection';
import WelcomeExercisesModal from '../components/WelcomeExercisesModal';
import EmptyExercisesState from '../components/EmptyExercisesState';
import ExercisePlanSkeleton from '../components/ExercisePlanSkeleton';
import SavePlanModal from '../components/SavePlanModal';
import { getReflectionStats } from '../services/reflectionsService';
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
    completedExercises,
    generatePlan,
    completeExercise,
    uncompleteExercise,
    getProgress,
    dailyStreak
  } = useExercisePlanStore();

  // Estado local para modales y reflexiones
  const [showSavePlanModal, setShowSavePlanModal] = useState(false);
  const [totalReflections, setTotalReflections] = useState<number>(0);

  // Cargar estadísticas de reflexiones
  useEffect(() => {
    async function loadReflectionStats() {
      try {
        const stats = await getReflectionStats();
        setTotalReflections(stats.total);
      } catch (error) {
        logger.error('Error loading reflection stats:', error);
      }
    }
    loadReflectionStats();
  }, []);

  useEffect(() => {
    async function loadAndGeneratePlan() {
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

      // 2. Generar plan usando el store
      await generatePlan(chart);
    }

    loadAndGeneratePlan();
  }, [chartId, location.state, currentChart, charts, generatePlan]);

  const handleExerciseComplete = (exerciseId: string) => {
    completeExercise(exerciseId);
  };

  const handleExerciseUncomplete = (exerciseId: string) => {
    uncompleteExercise(exerciseId);
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

  if (loading) {
    return <ExercisePlanSkeleton />;
  }

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
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="mb-2 md:mb-4">
            <button
              onClick={() => navigate('/natal-chart')}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm md:text-base mb-3"
              title="Volver a Carta Natal"
            >
              ← Volver a Carta Natal
            </button>

            {/* DESKTOP: Título, slogan y chips en líneas separadas pero centrados */}
            <div className="hidden md:block text-center mb-4">
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
                    <span>Tu Carta</span>
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
                  <span>Planes</span>
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
          
            {/* MOBILE: Título, slogan y menú desplegable */}
            <div className="md:hidden text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-white mb-1">
                Tu Plan de Ejercicios Holístico
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Plan de 21 días personalizado basado en tu carta natal
              </p>
              
              {/* MOBILE: Menú desplegable después del título y slogan */}
              <select
                onChange={(e) => {
                  const action = e.target.value;
                  if (action === 'tucarta') navigate('/ejercicios/tu-carta');
                  else if (action === 'guide') navigate('/ejercicios/guia');
                  else if (action === 'plans') navigate('/saved-plans');
                  else if (action === 'reflexiones') navigate('/reflexiones');
                  // Reset select
                  e.target.value = '';
                }}
                className="w-full px-3 py-3 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none shadow-lg text-sm touch-manipulation"
                defaultValue=""
              >
                <option value="" disabled>
                  📋 Acciones rápidas...
                </option>
                {plan && (
                  <option value="tucarta">🔮 Ver Tu Carta</option>
                )}
                <option value="guide">📖 Ver Guía</option>
                <option value="plans">📚 Planes Guardados</option>
                <option value="reflexiones">💭 Reflexiones</option>
              </select>
            </div>
        </div>

        {/* Resumen del plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-800 dark:text-purple-300 mb-3 md:mb-4">
            Resumen del Análisis
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium mb-0.5 sm:mb-1">
                Progreso Total
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-white">
                {getProgress().completed}/{plan.totalExercises}
              </div>
              <div className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
                {getProgress().percent}% completado
              </div>
            </div>
            
            <div className="bg-pink-50 dark:bg-pink-900/30 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-pink-600 dark:text-pink-400 font-medium mb-0.5 sm:mb-1">
                Reflexiones 📝
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-pink-900 dark:text-white">
                {totalReflections}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium mb-0.5 sm:mb-1">
                Luna Estrés
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900 dark:text-white">
                {plan.chartAnalysis.moon?.stressScore || 0}/10
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 sm:p-3 md:p-4">
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium mb-0.5 sm:mb-1">
                Racha Diaria 🔥
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-green-900 dark:text-white">
                {dailyStreak} días
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-purple-800 dark:text-purple-300 mb-2">
              Áreas Prioritarias:
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {plan.topAreas.map((area, i) => (
                <span
                  key={i}
                  className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fases */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <PhaseSection 
            phase={plan.phases.phase1} 
            completedExercises={completedExercises}
            onExerciseComplete={handleExerciseComplete}
            onExerciseUncomplete={handleExerciseUncomplete}
          />
          <PhaseSection 
            phase={plan.phases.phase2} 
            completedExercises={completedExercises}
            onExerciseComplete={handleExerciseComplete}
            onExerciseUncomplete={handleExerciseUncomplete}
          />
          <PhaseSection 
            phase={plan.phases.phase3} 
            completedExercises={completedExercises}
            onExerciseComplete={handleExerciseComplete}
            onExerciseUncomplete={handleExerciseUncomplete}
          />
        </div>

        {/* Botones de acción */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <button
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-colors text-sm sm:text-base shadow-lg hover:shadow-xl"
            onClick={() => setShowSavePlanModal(true)}
          >
            💾 Guardar Plan
          </button>
          <button
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-colors text-sm sm:text-base"
            onClick={async () => {
              const confirmed = await showConfirm({
                title: '¿Regenerar plan de ejercicios?',
                message: 'Se perderá el progreso actual y se creará un nuevo plan personalizado.',
                confirmText: 'Sí, regenerar',
                cancelText: 'No, conservar',
                type: 'warning',
                icon: '🔄'
              });
              
              if (confirmed) {
                showToast('🔄 Regenerando plan...', 'info', 2000);
                window.location.reload();
              }
            }}
          >
            🔄 Regenerar
          </button>
        </div>
      </div>

      {/* Modal de Guardar Plan */}
      {plan && (
        <SavePlanModal
          isOpen={showSavePlanModal}
          onClose={() => setShowSavePlanModal(false)}
          plan={plan}
          chartName={currentChart?.name || charts.find(c => c.id === plan.chartId)?.name}
          progress={getProgress()}
        />
      )}
    </div>
  );
}
