/**
 * SavedPlansPage - Página dedicada para Planes de Ejercicios Guardados
 * 
 * Características:
 * - Lista de todos los planes guardados del usuario
 * - Vista de cards con resumen visual
 * - Acciones: Ver Plan, Eliminar, Restaurar Progreso
 * - Estado vacío elegante
 * - Filtros por carta natal
 * - Ordenamiento por fecha
 */

import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercisePlanStore } from '../store/useExercisePlanStore';
import { useChartsStore } from '../store/useCharts';
import { useNotification } from '../hooks/useNotification';
import type { ExercisePlan } from '../services/exercises';

// ============================================
// TIPOS
// ============================================

interface SavedPlanData {
  planId: string;
  planData: ExercisePlan;
  chartName: string;
  progress: {
    completed: number;
    total: number;
    percent: number;
  };
  savedAt: number;
  customName?: string;
}

// ============================================
// COMPONENTE
// ============================================

const SavedPlansPage: FC = () => {
  const navigate = useNavigate();
  const { setCurrentPlan } = useExercisePlanStore();
  const { charts } = useChartsStore();
  const { showToast, showConfirm } = useNotification();
  
  const [selectedChartFilter, setSelectedChartFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'progress'>('date');

  // Cargar planes guardados desde localStorage
  const savedPlans = useMemo(() => {
    const plans: SavedPlanData[] = [];
    
    // Iterar sobre todas las keys de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key?.startsWith('saved-exercise-plan-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          
          if (data.planData) {
            plans.push({
              planId: data.planData.id || key.replace('saved-exercise-plan-', ''),
              planData: data.planData,
              chartName: data.chartName || 'Sin nombre',
              progress: data.progress || { completed: 0, total: 21, percent: 0 },
              savedAt: data.savedAt || Date.now(),
              customName: data.customName,
            });
          }
        } catch (error) {
          console.error('Error parsing saved plan:', error);
        }
      }
    }
    
    return plans;
  }, []);

  // Filtrar y ordenar planes
  const filteredPlans = useMemo(() => {
    let filtered = [...savedPlans];
    
    // Filtrar por carta
    if (selectedChartFilter !== 'all') {
      filtered = filtered.filter(p => p.planData.chartId === selectedChartFilter);
    }
    
    // Ordenar
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.savedAt - a.savedAt);
    } else {
      filtered.sort((a, b) => b.progress.percent - a.progress.percent);
    }
    
    return filtered;
  }, [savedPlans, selectedChartFilter, sortBy]);

  // Obtener lista de cartas únicas
  const chartOptions = useMemo(() => {
    const chartIds = new Set(savedPlans.map(p => p.planData.chartId));
    return Array.from(chartIds).map(chartId => {
      const chart = charts.find(c => c.id === chartId);
      return {
        id: chartId,
        name: chart?.name || 'Carta sin nombre',
      };
    });
  }, [savedPlans, charts]);

  // Restaurar plan y navegar
  const handleRestorePlan = (plan: SavedPlanData) => {
    setCurrentPlan(plan.planData);
    navigate('/ejercicios');
  };

  // Eliminar plan
  const handleDeletePlan = async (planId: string) => {
    const confirmed = await showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Eliminar este plan guardado? Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'warning',
      icon: '🗑️'
    });
    
    if (confirmed) {
      const key = `saved-exercise-plan-${planId}`;
      localStorage.removeItem(key);
      showToast('✅ Plan eliminado exitosamente', 'success');
      window.location.reload(); // Recargar para actualizar lista
    }
  };

  // Exportar plan como JSON
  const handleExportPlan = (plan: SavedPlanData) => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-ejercicios-${plan.chartName}-${new Date(plan.savedAt).toLocaleDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-2 sm:p-3 md:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Optimizado para móviles */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm mb-1 sm:mb-2 touch-manipulation"
              >
                ← Volver
              </button>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-1 sm:mb-2">
                📚 Planes Guardados
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Gestiona tus planes de ejercicios personalizados
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate('/ejercicios')}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm flex items-center gap-1 sm:gap-2 touch-manipulation flex-1 sm:flex-none justify-center"
              >
                <span className="text-sm sm:text-base">✨</span>
                <span className="hidden xs:inline">Generar Nuevo Plan</span>
                <span className="xs:hidden">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Estadísticas - Optimizadas para móviles */}
          {savedPlans.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow">
                <div className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-white">
                  {savedPlans.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Planes totales
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {savedPlans.filter(p => p.progress.percent === 100).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Completados
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {savedPlans.filter(p => p.progress.percent > 0 && p.progress.percent < 100).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  En progreso
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(savedPlans.reduce((acc, p) => acc + p.progress.percent, 0) / savedPlans.length)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Promedio progreso
                </div>
              </div>
            </div>
          )}

          {/* Filtros y ordenamiento */}
          {savedPlans.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Filtro por carta */}
              {chartOptions.length > 1 && (
                <select
                  value={selectedChartFilter}
                  onChange={(e) => setSelectedChartFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                >
                  <option value="all">Todas las cartas</option>
                  {chartOptions.map(chart => (
                    <option key={chart.id} value={chart.id}>
                      {chart.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Ordenamiento */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'progress')}
                className="px-4 py-2 rounded-lg border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              >
                <option value="date">Más recientes</option>
                <option value="progress">Mayor progreso</option>
              </select>
            </div>
          )}
        </div>

        {/* Estado vacío */}
        {savedPlans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-8xl mb-6 animate-bounce">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Aún no tenés planes guardados
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
              Generá tu primer plan de ejercicios personalizado y guardalo para acceder más tarde
            </p>
            <button
              onClick={() => navigate('/ejercicios')}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>✨</span>
              Generar mi Primer Plan
            </button>
          </div>
        )}

        {/* Grid de planes */}
        {filteredPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.planId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600"
              >
                {/* Header con progreso */}
                <div 
                  className="p-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {plan.customName || `Plan ${plan.chartName}`}
                      </h3>
                      <p className="text-purple-100 text-sm">
                        {plan.chartName}
                      </p>
                    </div>
                    
                    {/* Badge de progreso */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                      {plan.progress.percent}%
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${plan.progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {plan.progress.completed}/{plan.progress.total}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Ejercicios
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {plan.planData.estimatedDailyMinutes || 15}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Min/día
                      </div>
                    </div>
                  </div>

                  {/* Áreas prioritarias */}
                  {plan.planData.topAreas && plan.planData.topAreas.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Áreas de trabajo:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {plan.planData.topAreas.slice(0, 3).map((area, i) => (
                          <span
                            key={i}
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs"
                          >
                            {area}
                          </span>
                        ))}
                        {plan.planData.topAreas.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{plan.planData.topAreas.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fecha guardado */}
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    📅 Guardado el {new Date(plan.savedAt).toLocaleDateString()}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestorePlan(plan)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2 px-3 rounded-lg transition-all shadow hover:shadow-lg text-sm"
                    >
                      📖 Ver Plan
                    </button>
                    
                    <button
                      onClick={() => handleExportPlan(plan)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors"
                      title="Exportar como JSON"
                    >
                      💾
                    </button>
                    
                    <button
                      onClick={() => handleDeletePlan(plan.planId)}
                      className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 p-2 rounded-lg transition-colors"
                      title="Eliminar plan"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results con filtros */}
        {savedPlans.length > 0 && filteredPlans.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay planes con ese filtro
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Intentá con otros filtros o generá un nuevo plan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlansPage;
