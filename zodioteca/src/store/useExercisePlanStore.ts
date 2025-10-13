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
  completedExercises: Set<string>;
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
  completeExercise: (exerciseId: string) => void;
  uncompleteExercise: (exerciseId: string) => void;
  clearPlan: () => void;
  resetProgress: () => void;
  
  // Calculados
  getProgress: () => { completed: number; total: number; percent: number };
  getPhaseProgress: (phaseNumber: number) => { completed: number; total: number; percent: number };
}

export const useExercisePlanStore = create<ExercisePlanState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentPlan: null,
      completedExercises: new Set(),
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

      // Limpiar plan actual
      clearPlan: () => {
        set({
          currentPlan: null,
          completedExercises: new Set(),
          error: null
        });
      },

      // Resetear todo el progreso (mantiene plan)
      resetProgress: () => {
        set({
          completedExercises: new Set(),
          dailyStreak: 0,
          lastCompletedDate: null
        });
        logger.log('🔄 Progreso reseteado');
      },

      // Obtener progreso global
      getProgress: () => {
        const { currentPlan, completedExercises } = get();
        
        if (!currentPlan) {
          return { completed: 0, total: 0, percent: 0 };
        }

        const total = currentPlan.totalExercises;
        const completed = completedExercises.size;
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
      }
    }),
    {
      name: 'exercise-plan-storage',
      // Serializar Set a Array para localStorage
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        completedExercises: Array.from(state.completedExercises),
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
      }
    }
  )
);
