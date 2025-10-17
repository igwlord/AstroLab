import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { ExercisePlan } from '../services/exercises';
import type { NatalChart } from '../store/useCharts';
import { useScrollLock } from '../hooks/useScrollLock';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ExercisePlan;
  chart?: NatalChart; // Cambiar a recibir la carta completa
  chartName?: string;
  progress: { completed: number; total: number; percent: number };
}

const SavePlanModal: FC<SavePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  chart,
  chartName,
  progress,
}) => {
  const [localPlanName, setLocalPlanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useScrollLock(isOpen);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const savedPlanKey = `saved-exercise-plan-${Date.now()}`;
      localStorage.setItem(savedPlanKey, JSON.stringify({
        planData: plan,
        chartName: chartName || 'Sin nombre',
        customName: localPlanName,
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
  };

  // Solo inicializar cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setLocalPlanName(`Plan ${chartName || 'Personal'}`);
      // Enfocar el input después de un pequeño delay
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, chartName]);

  // Manejar teclas
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSaving) {
        onClose();
      }
      if (event.key === 'Enter' && event.ctrlKey && !isSaving && localPlanName.trim()) {
        event.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isSaving, localPlanName]);

  // Resetear estado cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setSaved(false);
      setIsSaving(false);
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn relative mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 to-violet-600 p-6 rounded-t-xl sm:rounded-t-2xl text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors" 
            disabled={isSaving}
          >
            ✕
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2 pr-10">
            📋 Información de la Carta
          </h2>
        </div>

        {/* Contenido - Solo datos de la carta */}
        <div className="p-6 space-y-4">
          {/* Nombre del plan */}
          <div>
            <label htmlFor="plan-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nombre del plan:
            </label>
            <input 
              ref={inputRef} 
              id="plan-name" 
              type="text" 
              value={localPlanName} 
              onChange={(e) => setLocalPlanName(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg text-sm border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Ej: Plan Marzo 2025" 
              maxLength={50} 
              disabled={isSaving} 
            />
          </div>

          {/* Datos de la Carta Natal */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-5 space-y-3">
            {/* Nombre */}
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">👤</span>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Nombre</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {chart?.name || chartName || 'Sin nombre'}
                </p>
              </div>
            </div>

            {/* Fecha */}
            {chart?.birthDate && (
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">📅</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fecha de nacimiento</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {chart.birthDate.split(',')[0]}
                  </p>
                </div>
              </div>
            )}

            {/* Hora */}
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🕐</span>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hora de nacimiento</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {chart?.birthTime || 'No especificada'}
                </p>
              </div>
            </div>

            {/* Lugar */}
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📍</span>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lugar de nacimiento</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {chart?.birthPlace || 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Botones */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl sm:rounded-b-2xl flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors" 
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !localPlanName.trim()} 
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all"
          >
            {isSaving ? '⏳ Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;
