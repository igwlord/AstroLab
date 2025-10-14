import React, { useState } from 'react';
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight, Check } from '../utils/icons';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  planet?: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  canProceed?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Componente base para formularios multi-step astrológicos
 * Inspirado en el viaje planetario a través de las fases de una carta natal
 */
const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  currentStep,
  onStepChange,
  canProceed = true,
  className,
  children
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      onStepChange(stepIndex);
    }
  };

  const handleNext = () => {
    if (canProceed && currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Progress Bar Astrológica */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-white">
            Crear Carta Natal
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Paso {currentStep + 1} de {steps.length}
          </span>
        </div>

        {/* Progress bar con gradiente astrológico */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />

          {/* Marcadores de planetas en la barra */}
          {steps.map((step, index) => {
            const position = (index / (steps.length - 1)) * 100;
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;

            return (
              <div
                key={step.id}
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6"
                style={{ left: `calc(${position}% - 12px)` }}
              >
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200',
                    isCompleted && 'bg-green-500 border-green-500 text-white',
                    isCurrent && 'bg-purple-600 border-purple-600 text-white ring-4 ring-purple-200 dark:ring-purple-800',
                    !isCompleted && !isCurrent && 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400'
                  )}
                  disabled={!isCompleted && index > currentStep}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : step.icon ? (
                    <span>{step.icon}</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Labels de pasos */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'text-center flex-1',
                index === currentStep && 'text-purple-700 dark:text-purple-300 font-semibold'
              )}
            >
              <div className="text-sm font-medium">{step.title}</div>
              {step.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        {children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200',
            currentStep === 0
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>

        <div className="flex items-center gap-4">
          {/* Indicador de progreso textual */}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% completado
          </span>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200',
                canProceed
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              )}
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed}
              className={cn(
                'flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200',
                canProceed
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              )}
            >
              <span className="text-lg">✨</span>
              Crear Carta Natal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;