/**
 * EXERCISE PLAN STORE - Estado global de planes de ejercicios
 * Maneja generación, persistencia y progreso de ejercicios
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NatalChart } from './useCharts';
import { generateExercisePlan, type ExercisePlan } from '../services/exercises';
import { logger } from '../utils/logger';

interface ExercisePlanState {
  // Estado
  currentPlan: ExercisePlan | null;
  completedExercises: Set<string>; // Legacy - mantener por compatibilidad
  completedDays: Record<string, number[]>; // NUEVO: { exerciseId: [1, 3, 5] }
  isGenerating: boolean;
  error: string | null;
  
  // Metadata
  lastGeneratedAt: string | null;
  dailyStreak: number;
  lastCompletedDate: string | null;
  totalExercisesCompleted: number;
  
  // Actions
  generatePlan: (chart: NatalChart) => Promise<void>;
  setCurrentPlan: (plan: ExercisePlan | null) => void;
  completeExercise: (exerciseId: string) => void; // Legacy
  uncompleteExercise: (exerciseId: string) => void; // Legacy
  completeDayForExercise: (exerciseId: string, day: number) => void; // NUEVO
  uncompleteDayForExercise: (exerciseId: string, day: number) => void; // NUEVO
  clearPlan: () => void;
  resetProgress: () => void;
  
  // Calculados
  getProgress: () => { completed: number; total: number; percent: number };
  getPhaseProgress: (phaseNumber: number) => { completed: number; total: number; percent: number };
  getWeekProgress: (weekNumber: number) => { completed: number; total: number; percent: number }; // NUEVO
  isWeekUnlocked: (weekNumber: number) => boolean; // NUEVO
  getCurrentWeek: () => number; // NUEVO: retorna 1, 2 o 3
}

export const useExercisePlanStore = create<ExercisePlanState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentPlan: null,
      completedExercises: new Set(),
      completedDays: {}, // NUEVO
      isGenerating: false,
      error: null,
      lastGeneratedAt: null,
      dailyStreak: 0,
      lastCompletedDate: null,
      totalExercisesCompleted: 0,

      // Generar plan desde carta natal
      generatePlan: async (chart: NatalChart) => {
        set({ isGenerating: true, error: null });
        
        try {
          logger.log('🎯 Generando plan de ejercicios para:', chart.name || chart.id);
          
          const plan = await generateExercisePlan(chart, {
            userId: undefined, // TODO: integrar con auth
            chartId: chart.id
          });

          set({
            currentPlan: plan,
            isGenerating: false,
            lastGeneratedAt: new Date().toISOString(),
            completedExercises: new Set(), // Reset progreso al generar nuevo plan
            completedDays: {}, // NUEVO: Reset también los días
            error: null
          });

          logger.log('✅ Plan generado exitosamente:', plan.id);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          logger.error('❌ Error generando plan:', errorMessage);
          
          set({
            error: errorMessage,
            isGenerating: false
          });
        }
      },

      // Setear plan manualmente
      setCurrentPlan: (plan) => {
        set({ currentPlan: plan });
      },

      // Completar un ejercicio
      completeExercise: (exerciseId: string) => {
        const { completedExercises, lastCompletedDate, dailyStreak } = get();
        const newCompleted = new Set(completedExercises);
        newCompleted.add(exerciseId);

        // Calcular racha diaria
        const today = new Date().toDateString();
        const lastDate = lastCompletedDate ? new Date(lastCompletedDate).toDateString() : null;
        
        let newStreak = dailyStreak;
        if (lastDate !== today) {
          // Es un nuevo día
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          
          if (lastDate === yesterdayStr) {
            // Continúa la racha
            newStreak = dailyStreak + 1;
          } else {
            // Se rompió la racha
            newStreak = 1;
          }
        }

        set({
          completedExercises: newCompleted,
          lastCompletedDate: new Date().toISOString(),
          dailyStreak: newStreak,
          totalExercisesCompleted: get().totalExercisesCompleted + 1
        });

        logger.log(`✅ Ejercicio completado: ${exerciseId} (Racha: ${newStreak} días)`);
      },

      // Desmarcar ejercicio completado
      uncompleteExercise: (exerciseId: string) => {
        const { completedExercises } = get();
        const newCompleted = new Set(completedExercises);
        newCompleted.delete(exerciseId);

        set({
          completedExercises: newCompleted,
          totalExercisesCompleted: Math.max(0, get().totalExercisesCompleted - 1)
        });

        logger.log(`↩️  Ejercicio desmarcado: ${exerciseId}`);
      },

      // NUEVO: Completar un día específico de un ejercicio
      completeDayForExercise: (exerciseId: string, day: number) => {
        const { completedDays } = get();
        const currentDays = completedDays[exerciseId] || [];
        
        if (!currentDays.includes(day)) {
          const newCompletedDays = {
            ...completedDays,
            [exerciseId]: [...currentDays, day].sort((a, b) => a - b)
          };

          // Actualizar racha si completó hoy
          const today = new Date().toISOString().split('T')[0];
          const lastDate = get().lastCompletedDate;
          let newStreak = get().dailyStreak;

          if (!lastDate || lastDate.split('T')[0] !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            newStreak = lastDate?.split('T')[0] === yesterday ? newStreak + 1 : 1;
          }

          set({
            completedDays: newCompletedDays,
            lastCompletedDate: new Date().toISOString(),
            dailyStreak: newStreak,
            totalExercisesCompleted: get().totalExercisesCompleted + 1
          });

          logger.log(`✅ Día ${day} completado para ejercicio: ${exerciseId}`);
        }
      },

      // NUEVO: Desmarcar un día específico de un ejercicio
      uncompleteDayForExercise: (exerciseId: string, day: number) => {
        const { completedDays } = get();
        const currentDays = completedDays[exerciseId] || [];
        
        const newCompletedDays = {
          ...completedDays,
          [exerciseId]: currentDays.filter(d => d !== day)
        };

        set({
          completedDays: newCompletedDays,
          totalExercisesCompleted: Math.max(0, get().totalExercisesCompleted - 1)
        });

        logger.log(`↩️  Día ${day} desmarcado para ejercicio: ${exerciseId}`);
      },

      // Limpiar plan actual
      clearPlan: () => {
        set({
          currentPlan: null,
          completedExercises: new Set(),
          completedDays: {}, // NUEVO
          error: null
        });
      },

      // Resetear todo el progreso (mantiene plan)
      resetProgress: () => {
        set({
          completedExercises: new Set(),
          completedDays: {}, // NUEVO
          dailyStreak: 0,
          lastCompletedDate: null
        });
        logger.log('🔄 Progreso reseteado');
      },

      // Obtener progreso global (basado en días únicos completados de las 3 fases)
      getProgress: () => {
        const { currentPlan } = get();
        
        if (!currentPlan) {
          return { completed: 0, total: 0, percent: 0 };
        }

        // Total = 21 días únicos (7 días × 3 fases)
        const total = 21;
        
        // Completados = suma de días únicos de cada fase
        const phase1Progress = get().getWeekProgress(1);
        const phase2Progress = get().getWeekProgress(2);
        const phase3Progress = get().getWeekProgress(3);
        
        const completed = phase1Progress.completed + phase2Progress.completed + phase3Progress.completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percent };
      },

      // Obtener progreso de una fase específica
      getPhaseProgress: (phaseNumber: number) => {
        const { currentPlan, completedExercises } = get();
        
        if (!currentPlan) {
          return { completed: 0, total: 0, percent: 0 };
        }

        const phaseKey = `phase${phaseNumber}` as 'phase1' | 'phase2' | 'phase3';
        const phase = currentPlan.phases[phaseKey];
        
        if (!phase) {
          return { completed: 0, total: 0, percent: 0 };
        }

        const total = phase.exercises.length;
        const completed = phase.exercises.filter(ex => completedExercises.has(ex.id)).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percent };
      },

      // NUEVO: Obtener progreso de una semana específica (basado en días completados)
      getWeekProgress: (weekNumber: number) => {
        const { currentPlan, completedDays } = get();
        
        if (!currentPlan) {
          return { completed: 0, total: 0, percent: 0 };
        }

        const phaseKey = `phase${weekNumber}` as 'phase1' | 'phase2' | 'phase3';
        const phase = currentPlan.phases[phaseKey];
        
        if (!phase) {
          return { completed: 0, total: 0, percent: 0 };
        }

        // Total = 7 días únicos (del 1 al 7)
        const total = 7;
        
        // Completados = días únicos marcados (sin importar en qué ejercicio)
        // Crear un Set de todos los días marcados en cualquier ejercicio de esta fase
        const uniqueDays = new Set<number>();
        phase.exercises.forEach(ex => {
          const days = completedDays[ex.id] || [];
          days.forEach(day => uniqueDays.add(day));
        });
        
        const completed = uniqueDays.size;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percent };
      },

      // NUEVO: Verificar si una fase está desbloqueada
      // Usuario tiene 21 días flexibles, desbloquea fases al completar TODOS los días de la fase anterior
      isWeekUnlocked: (weekNumber: number) => {
        // Fase 1 siempre está desbloqueada
        if (weekNumber === 1) return true;

        // Para Fase 2: necesitas completar LOS 7 DÍAS de Fase 1
        // Para Fase 3: necesitas completar LOS 7 DÍAS de Fase 2
        const previousWeek = weekNumber - 1;
        const previousProgress = get().getWeekProgress(previousWeek);
        
        // Desbloqueo cuando completas los 7 días (puede ser marcando en cualquier ejercicio)
        return previousProgress.completed >= 7;
      },

      // NUEVO: Obtener la semana actual (la última desbloqueada con progreso < 100%)
      getCurrentWeek: () => {
        const week2Progress = get().getWeekProgress(2);
        const week3Progress = get().getWeekProgress(3);

        // Si semana 3 está desbloqueada y no terminada, es la actual
        if (get().isWeekUnlocked(3) && week3Progress.percent < 100) {
          return 3;
        }

        // Si semana 2 está desbloqueada y no terminada, es la actual
        if (get().isWeekUnlocked(2) && week2Progress.percent < 100) {
          return 2;
        }

        // Por defecto, semana 1 (o si todo está completo)
        return 1;
      }
    }),
    {
      name: 'exercise-plan-storage',
      // Serializar Set a Array para localStorage
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        completedExercises: Array.from(state.completedExercises),
        completedDays: state.completedDays, // NUEVO: ya es serializable
        lastGeneratedAt: state.lastGeneratedAt,
        dailyStreak: state.dailyStreak,
        lastCompletedDate: state.lastCompletedDate,
        totalExercisesCompleted: state.totalExercisesCompleted
      }),
      // Deserializar Array de vuelta a Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.completedExercises)) {
          state.completedExercises = new Set(state.completedExercises as string[]);
        }
        // Asegurar que completedDays existe
        if (state && !state.completedDays) {
          state.completedDays = {};
        }
      }
    }
  )
);
