/**
 * CHART ANALYSIS CARD
 * Card visual para cada elemento de análisis (planetas, puntos sensibles, aspectos)
 * Muestra preview y abre modal con análisis completo
 */

import { motion } from 'framer-motion';

export interface ChartAnalysisCardProps {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  dignityBadge?: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    label: string;
    color: string;
  };
  preview: string;
  category: 'planet' | 'point' | 'aspect' | 'concentration';
  onClick: () => void;
  isNew?: boolean;
  isImportant?: boolean;
}

export default function ChartAnalysisCard({
  icon,
  title,
  subtitle,
  dignityBadge,
  preview,
  category,
  onClick,
  isNew,
  isImportant,
}: ChartAnalysisCardProps) {
  
  // Colores según categoría
  const categoryColors = {
    planet: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
    point: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700',
    aspect: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
    concentration: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700',
  };

  // Colores de dignidad
  const dignityColors = {
    domicile: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    exaltation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    detriment: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    fall: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {/* Badges superiores */}
      <div className="absolute -top-2 -right-2 z-10 flex gap-2">
        {isNew && (
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            Nuevo
          </span>
        )}
        {isImportant && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            ⚠️
          </span>
        )}
      </div>

      {/* Card principal */}
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden cursor-pointer
          bg-gradient-to-br ${categoryColors[category]}
          rounded-xl p-4 sm:p-5 border-2
          transition-all duration-300 ease-out
          hover:shadow-xl hover:border-opacity-80
          active:scale-95
          group
        `}
      >
        {/* Header con icono y título */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Icono grande */}
            <div className="text-4xl sm:text-5xl transition-transform group-hover:scale-110">
              {icon}
            </div>
            
            {/* Título y subtítulo */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Badge de dignidad */}
        {dignityBadge && (
          <div className="mb-3">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${dignityColors[dignityBadge.type]}`}>
              {dignityBadge.label}
            </span>
          </div>
        )}

        {/* Preview del contenido */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
          {preview}
        </p>

        {/* Footer con botón */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
            {category === 'planet' ? 'Planeta' : 
             category === 'point' ? 'Punto Sensible' :
             category === 'aspect' ? 'Aspecto' :
             'Concentración'}
          </span>
          
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
            Ver análisis
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Efecto de brillo al hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}
