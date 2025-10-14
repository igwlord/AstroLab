/**
 * SavePlanModal - Modal para guardar plan de ejercicios
 * 
 * Características:
 * - Input para nombre personalizado del plan
 * - Muestra resumen del plan (áreas prioritarias, progreso)
 * - Guarda en Favoritos con tipo 'frequency-exercise'
 * - Feedback visual de éxito
 */

import { useState } from 'react';
import type { FC } from 'react';
import type { ExercisePlan } from '../services/exercises';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ExercisePlan;
  chartName?: string;
  progress: { completed: number; total: number; percent: number };
}

const SavePlanModal: FC<SavePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  chartName,
  progress,
}) => {
  const [planName, setPlanName] = useState(`Plan ${chartName || 'Personal'}`);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Guardar plan completo en localStorage
      const savedPlanKey = `saved-exercise-plan-${plan.id}`;
      localStorage.setItem(savedPlanKey, JSON.stringify({
        planData: plan,
        chartName: chartName || 'Sin nombre',
        customName: planName,
        progress: progress,
        savedAt: Date.now(),
      }));

      setSaved(true);
      
      // Cerrar modal después de mostrar confirmación
      setTimeout(() => {
        onClose();
        // Reset estado para próxima vez
        setTimeout(() => {
          setSaved(false);
          setIsSaving(false);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error('Error guardando plan:', error);
      alert('Error al guardar el plan. Por favor intenta nuevamente.');
      setIsSaving(false);
    }
  };

  if (saved) {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-2xl font-bold text-purple-900 dark:text-white mb-2">
            ¡Plan Guardado!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Podés encontrarlo en <strong>Planes Guardados 📚</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 to-violet-600 p-6 rounded-t-2xl text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
          
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            💾 Guardar Plan de Ejercicios
          </h2>
          <p className="text-purple-100 text-sm">
            Guardalo en tus Favoritos para acceder más tarde
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Input nombre */}
          <div>
            <label 
              htmlFor="plan-name" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Nombre del plan:
            </label>
            <input
              id="plan-name"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
              placeholder="Ej: Plan Marzo 2025"
              maxLength={50}
            />
          </div>

          {/* Resumen del plan */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 text-sm mb-2">
              📊 Resumen del Plan:
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Total ejercicios:</span>
                <p className="font-bold text-gray-900 dark:text-white">{plan.totalExercises}</p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Tiempo diario:</span>
                <p className="font-bold text-gray-900 dark:text-white">{plan.estimatedDailyMinutes} min</p>
              </div>
              
              <div className="col-span-2">
                <span className="text-gray-600 dark:text-gray-400">Progreso actual:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-xs">
                    {progress.percent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Áreas prioritarias:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {plan.topAreas.map((area, i) => (
                  <span
                    key={i}
                    className="bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info adicional */}
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <span className="text-lg">💡</span>
            <p>
              Podrás acceder a este plan desde el botón <strong>📚 Planes Guardados</strong> {' '}
              en la parte superior de esta página
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
            disabled={isSaving}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || !planName.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Guardando...
              </span>
            ) : (
              '💾 Guardar Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;
