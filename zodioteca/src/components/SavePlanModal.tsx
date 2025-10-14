import { useState, useEffect, useRef, useCallback } from 'react';
import type { FC } from 'react';
import type { ExercisePlan } from '../services/exercises';
import { useScrollLock } from '../hooks/useScrollLock';

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

  useScrollLock(isOpen);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const savedPlanKey = `saved-exercise-plan-${Date.now()}`;
      localStorage.setItem(savedPlanKey, JSON.stringify({
        planData: plan,
        chartName: chartName || 'Sin nombre',
        customName: planName,
        progress: progress,
        savedAt: Date.now(),
      }));
      setSaved(true);
      setTimeout(() => {
        onClose();
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
  }, [plan, chartName, planName, progress, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
      if (event.key === 'Enter' && event.ctrlKey && isOpen && !isSaving && planName.trim()) {
        event.preventDefault();
        handleSave();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSaving, onClose, planName, handleSave]);

  useEffect(() => {
    if (!isOpen) {
      setSaved(false);
      setIsSaving(false);
      setPlanName(`Plan ${chartName || 'Personal'}`);
    }
  }, [isOpen, chartName]);

  if (!isOpen) return null;

  if (saved) {
    return (
      <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-full p-8 sm:p-8 text-center animate-scaleIn mx-4">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-4 animate-bounce">✅</div>
          <h2 className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-white mb-2">¡Plan Guardado!</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Encontralo en <strong>Planes Guardados 📚</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] flex items-start justify-center px-4 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto pt-20 sm:pt-20 pb-6" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn relative max-h-[85vh] sm:max-h-[90vh] overflow-y-auto my-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-purple-600 to-violet-600 p-5 sm:p-5 rounded-t-xl sm:rounded-t-2xl text-white">
          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-sm" disabled={isSaving}>✕</button>
          <h2 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2 pr-10">💾 Guardar Plan</h2>
          <p className="text-purple-100 text-xs sm:text-sm">Guardalo para acceder más tarde</p>
        </div>

        <div className="p-5 sm:p-5 space-y-4 sm:space-y-4">
          <div>
            <label htmlFor="plan-name" className="block text-sm sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre del plan:</label>
            <input ref={inputRef} id="plan-name" type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} className="w-full px-4 py-2.5 sm:py-2.5 rounded-lg text-sm border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500" placeholder="Ej: Plan Marzo 2025" maxLength={50} disabled={isSaving} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Máximo 50 caracteres</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 sm:p-4 space-y-2.5">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 text-sm sm:text-sm mb-2">📊 Resumen:</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-3 text-sm sm:text-sm">
              <div><span className="text-gray-600 dark:text-gray-400">Total ejercicios:</span><p className="font-bold text-gray-900 dark:text-white mt-0.5">{plan.totalExercises}</p></div>
              <div><span className="text-gray-600 dark:text-gray-400">Tiempo diario:</span><p className="font-bold text-gray-900 dark:text-white mt-0.5">{plan.estimatedDailyMinutes} min</p></div>
              <div className="col-span-2"><span className="text-gray-600 dark:text-gray-400">Progreso actual:</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-2 sm:h-2 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500" style={{ width: `${progress.percent}%` }} />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-xs">{progress.percent}%</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-sm">Áreas prioritarias:</span>
              <div className="flex flex-wrap gap-1.5 sm:gap-1.5 mt-1.5">
                {plan.topAreas.map((area, i) => (
                  <span key={i} className="bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 px-2 sm:px-2 py-1 rounded-full text-xs font-medium">{area}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-sm sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3.5 sm:p-3 rounded-lg">
            <span className="text-lg sm:text-lg">💡</span>
            <p>Accede desde <strong>📚 Planes Guardados</strong> en la parte superior</p>
          </div>
        </div>

        <div className="p-4 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl sm:rounded-b-2xl flex gap-3 sm:gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 sm:px-4 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600" disabled={isSaving}>Cancelar</button>
          <button onClick={handleSave} disabled={isSaving || !planName.trim()} className="flex-1 px-4 py-2.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-400 text-white font-semibold text-sm rounded-lg sm:rounded-xl">
            {isSaving ? <span>⏳ Guardando...</span> : <span>💾 Guardar</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;
