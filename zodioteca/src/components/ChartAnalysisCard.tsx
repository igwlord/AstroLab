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
  isRead?: boolean; // 🆕 Track if this card has been read
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
  isRead,
}: ChartAnalysisCardProps) {
  
  // 🎨 Colores cósmicos sutiles según categoría
  const categoryColors = {
    planet: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-900/15 dark:to-cyan-900/15 border-blue-300/40 dark:border-blue-700/30',
    point: 'from-pink-50/80 to-fuchsia-50/80 dark:from-pink-900/15 dark:to-fuchsia-900/15 border-pink-300/40 dark:border-pink-700/30',
    aspect: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/15 dark:to-teal-900/15 border-emerald-300/40 dark:border-emerald-700/30',
    concentration: 'from-amber-50/80 to-orange-50/80 dark:from-amber-900/15 dark:to-orange-900/15 border-amber-300/40 dark:border-amber-700/30',
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
        {isRead && (
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            ✓ Leída
          </span>
        )}
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
          min-h-[280px] sm:min-h-[300px] flex flex-col
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
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
          {preview}
        </p>

        {/* Footer con botón */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
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
