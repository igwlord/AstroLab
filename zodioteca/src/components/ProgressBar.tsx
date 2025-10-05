import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface ProgressBarProps {
  percentage: number;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'cyan' | 'purple' | 'pink' | 'indigo';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: ReactNode;
}

export default function ProgressBar({ 
  percentage, 
  color, 
  height = 'md',
  showLabel = true,
  label
}: ProgressBarProps) {
  
  // Estado para detectar tema oscuro y actualizarlo en tiempo real
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Función para verificar el tema
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Verificar al montar
    checkTheme();

    // Observar cambios en el elemento html
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  
  // Mapeo de colores con gradientes optimizados para cada tema
  const colorGradients = {
    red: isDark 
      ? 'linear-gradient(to right, #f87171, #ef4444)' // red-400 to red-500
      : 'linear-gradient(to right, #ef4444, #dc2626)', // red-500 to red-600
    orange: isDark
      ? 'linear-gradient(to right, #fb923c, #f97316)' // orange-400 to orange-500
      : 'linear-gradient(to right, #f97316, #ea580c)', // orange-500 to orange-600
    yellow: isDark
      ? 'linear-gradient(to right, #fbbf24, #fcd34d)' // yellow-500 to yellow-300 (dorado brillante)
      : 'linear-gradient(to right, #eab308, #ca8a04)', // yellow-500 to yellow-600
    green: isDark
      ? 'linear-gradient(to right, #4ade80, #22c55e)' // green-400 to green-500
      : 'linear-gradient(to right, #22c55e, #16a34a)', // green-500 to green-600
    blue: isDark
      ? 'linear-gradient(to right, #60a5fa, #3b82f6)' // blue-400 to blue-500
      : 'linear-gradient(to right, #3b82f6, #2563eb)', // blue-500 to blue-600
    cyan: isDark
      ? 'linear-gradient(to right, #22d3ee, #67e8f9)' // cyan-500 to cyan-300 (celeste brillante)
      : 'linear-gradient(to right, #06b6d4, #0891b2)', // cyan-500 to cyan-600
    purple: isDark
      ? 'linear-gradient(to right, #c084fc, #a855f7)' // purple-400 to purple-500
      : 'linear-gradient(to right, #a855f7, #9333ea)', // purple-500 to purple-600
    pink: isDark
      ? 'linear-gradient(to right, #f472b6, #f9a8d4)' // pink-400 to pink-300 (rosa brillante)
      : 'linear-gradient(to right, #ec4899, #db2777)', // pink-500 to pink-600
    indigo: isDark
      ? 'linear-gradient(to right, #818cf8, #6366f1)' // indigo-400 to indigo-500
      : 'linear-gradient(to right, #6366f1, #4f46e5)', // indigo-500 to indigo-600
  };

  const heightClasses = {
    sm: 'h-3 sm:h-4',
    md: 'h-4 sm:h-5 md:h-6',
    lg: 'h-6 sm:h-7 md:h-8',
  };

  const textSizeClasses = {
    sm: 'text-[10px] sm:text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
  };

  // Asegurar que el porcentaje esté entre 0 y 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="w-full">
      {/* Label opcional encima de la barra */}
      {showLabel && label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {label}
          </span>
          <span className={`${textSizeClasses[height]} font-bold text-gray-700 dark:text-gray-300`}>
            {clampedPercentage.toFixed(1)}%
          </span>
        </div>
      )}

      {/* Contenedor de la barra */}
      <div className={`relative w-full ${heightClasses[height]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        {/* Barra de progreso con animación */}
        <div
          className={`${heightClasses[height]} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
          style={{ 
            width: `${clampedPercentage}%`,
            backgroundImage: colorGradients[color],
            willChange: 'width'
          }}
        >
          {/* Texto del porcentaje dentro de la barra (solo si hay espacio) */}
          {!showLabel && clampedPercentage >= 15 && (
            <span className={`${textSizeClasses[height]} font-bold text-white drop-shadow-sm`}>
              {clampedPercentage.toFixed(1)}%
            </span>
          )}
        </div>

        {/* Brillo animado */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite',
          }}
        />
      </div>
    </div>
  );
}
