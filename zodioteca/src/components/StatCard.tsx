import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  count: number;
  percentage: number;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'cyan' | 'purple' | 'pink' | 'indigo';
  icon?: ReactNode;
  items?: string[]; // Lista de signos, casas, etc.
  compact?: boolean; // Versión compacta para móviles
}

export default function StatCard({ 
  label, 
  count, 
  percentage, 
  color, 
  icon,
  items = [],
  compact = false
}: StatCardProps) {
  
  // Mapeo de colores para el ícono/badge
  const iconColorClasses = {
    red: 'text-red-600 dark:text-red-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
  };

  const bgColorClasses = {
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30',
    pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/30',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/30',
  };

  return (
    <div className={`
      ${bgColorClasses[color]}
      border-2 rounded-xl
      ${compact ? 'p-4' : 'p-5 sm:p-6'}
      transition-all duration-300
      hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1
      transform-gpu
      relative overflow-hidden
    `}>
      {/* Círculo decorativo de fondo */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${bgColorClasses[color]} opacity-30 blur-2xl`}></div>
      
      <div className="relative z-10">
        {/* Header con ícono y label */}
        <div className="flex items-center gap-2 mb-4">
          {icon && (
            <div className={`
              ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}
              ${iconColorClasses[color]}
              drop-shadow-lg
            `}>
              {icon}
            </div>
          )}
          <h4 className={`
            font-bold
            ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}
            text-gray-700 dark:text-gray-200
            uppercase tracking-wide
          `}>
            {label}
          </h4>
        </div>

        {/* Porcentaje y Count en formato impactante */}
        <div className="flex items-end justify-between mb-4">
          {/* Porcentaje GRANDE */}
          <div className="flex items-baseline gap-1">
            <span className={`
              ${iconColorClasses[color]}
              font-black
              ${compact ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl md:text-7xl'}
              leading-none
              drop-shadow-md
            `}>
              {percentage.toFixed(0)}
            </span>
            <span className={`
              ${iconColorClasses[color]}
              font-bold
              ${compact ? 'text-2xl' : 'text-3xl'}
              leading-none
              opacity-80
            `}>
              %
            </span>
          </div>

          {/* Badge con cantidad de planetas */}
          <div className="text-right">
            <div className={`
              ${iconColorClasses[color]}
              ${compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}
              font-black
              leading-none
            `}>
              {count}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase mt-1">
              {count === 1 ? 'Planeta' : 'Planetas'}
            </div>
          </div>
        </div>

        {/* Ítems (signos/casas) */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-current opacity-30">
            {items.slice(0, compact ? 3 : 5).map((item, index) => (
              <span 
                key={index}
                className={`
                  text-[10px] sm:text-xs
                  px-2.5 py-1
                  rounded-full
                  ${bgColorClasses[color]}
                  ${iconColorClasses[color]}
                  border
                  font-bold
                  shadow-sm
                `}
              >
                {item}
              </span>
            ))}
            {items.length > (compact ? 3 : 5) && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold self-center">
                +{items.length - (compact ? 3 : 5)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
