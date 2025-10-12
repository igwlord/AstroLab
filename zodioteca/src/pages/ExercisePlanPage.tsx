/**
 * PÁGINA DE PLAN DE EJERCICIOS HOLÍSTICOS
 * Recibe chart desde URL params o state, genera plan personalizado
 */

import { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useChartsStore, type NatalChart } from '../store/useCharts';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import PhaseSection from '../components/PhaseSection';

export default function ExercisePlanPage() {
  const location = useLocation();
  const { chartId } = useParams<{ chartId?: string }>();
  const navigate = useNavigate();
  
  const { currentChart, charts } = useChartsStore();
  
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
        console.error('No se encontró la carta natal');
        return;
      }

      console.log('🎯 Generando plan para:', chart.name || chart.id);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-purple-700 dark:text-purple-300 animate-pulse text-lg font-medium">
            Analizando tu carta natal y generando plan personalizado...
          </p>
        </div>
      </div>
    );
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

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-3 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 mb-2 md:mb-4 flex items-center gap-2 text-sm md:text-base"
          >
            ← Volver
          </button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-1 md:mb-2">
            Tu Plan de Ejercicios Holístico
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Plan de 21 días personalizado basado en tu carta natal
          </p>
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
                Tiempo Diario
              </div>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-pink-900 dark:text-white">
                {plan.estimatedDailyMinutes} min
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
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-colors text-sm sm:text-base"
            onClick={() => alert('Guardar plan - TODO: implementar persistencia')}
          >
            💾 Guardar Plan
          </button>
          <button
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-colors text-sm sm:text-base"
            onClick={() => {
              if (confirm('¿Regenerar plan? Se perderá el progreso actual.')) {
                window.location.reload();
              }
            }}
          >
            🔄 Regenerar
          </button>
        </div>
      </div>
    </div>
  );
}
