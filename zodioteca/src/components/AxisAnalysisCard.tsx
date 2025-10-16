/**
 * COMPONENTE: AxisAnalysisCard
 * Tarjeta para mostrar análisis de ejes arquetípicos
 * Usa formato similar a ChartAnalysisCard
 */

import { motion } from 'framer-motion';
import type { AxisAnalysis, AxisCategory } from '../services/exercises/chartAnalyzer';
import { getAspectSymbol } from '../services/exercises/chartAnalyzer';
import { getAxisUrgency, getAxisDescription } from '../utils/interpretationHelpers';

interface AxisAnalysisCardProps {
  axis: AxisAnalysis;
  onClick: () => void;
  isRead?: boolean; // 🆕 Track if this axis has been read
}

/**
 * Obtiene emoji del eje según categoría
 */
function getCategoryEmoji(category: AxisCategory): string {
  const emojis: Record<AxisCategory, string> = {
    core: '👑',
    internal: '🌊',
    challenge: '⚡',
    expansion: '✨'
  };
  return emojis[category] || '⭐';
}

/**
 * Obtiene emoji de los planetas
 */
function getPlanetEmoji(planet: string): string {
  const emojis: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽',
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇',
    'Chiron': '⚷'
  };
  return emojis[planet] || '●';
}

/**
 * Formatea nombre de planeta para mostrar
 */
function getPlanetDisplayName(planet: string): string {
  const names: Record<string, string> = {
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Venus': 'Venus',
    'Mars': 'Marte',
    'Jupiter': 'Júpiter',
    'Saturn': 'Saturno',
    'Uranus': 'Urano',
    'Neptune': 'Neptuno',
    'Pluto': 'Plutón',
    'Chiron': 'Quirón'
  };
  return names[planet] || planet;
}

/**
 * Obtiene color según urgencia - ACTUALIZADO con colores cósmicos verdes
 */
function getUrgencyColor(urgency: 'Alta' | 'Media' | 'Baja'): string {
  // Todos los ejes usan tonos verdes cósmicos
  if (urgency === 'Alta') return 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/15 dark:to-teal-900/15 border-emerald-400/40 dark:border-emerald-700/30';
  if (urgency === 'Media') return 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/15 dark:to-teal-900/15 border-emerald-300/40 dark:border-emerald-700/30';
  return 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/15 dark:to-teal-900/15 border-emerald-300/40 dark:border-emerald-700/30';
}

export default function AxisAnalysisCard({ axis, onClick, isRead }: AxisAnalysisCardProps) {
  const urgency = getAxisUrgency(axis.score);
  const description = getAxisDescription(axis.theme);
  
  const categoryEmoji = getCategoryEmoji(axis.category);
  const planet1Emoji = getPlanetEmoji(axis.planets[0]);
  const planet2Emoji = getPlanetEmoji(axis.planets[1]);
  const aspectSymbol = getAspectSymbol(axis.aspectType);
  
  const planet1Name = getPlanetDisplayName(axis.planets[0]);
  const planet2Name = getPlanetDisplayName(axis.planets[1]);
  
  const urgencyLabel = urgency === 'Alta' ? 'Crítico' : urgency === 'Media' ? 'Trabajar' : 'Observar';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {/* Card principal */}
      <div
        onClick={onClick}
        className={`
          relative overflow-hidden cursor-pointer rounded-xl border-2 
          bg-gradient-to-br ${getUrgencyColor(urgency)}
          p-4 sm:p-5
          transition-all duration-300
          hover:shadow-xl
          group
          min-h-[280px] sm:min-h-[300px] flex flex-col
        `}
      >
        {/* Badges superiores - dentro de la tarjeta */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {isRead && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              ✓ Leída
            </span>
          )}
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold shadow-md
            ${urgency === 'Alta' ? 'bg-red-500/20 text-red-700 dark:text-red-300' : ''}
            ${urgency === 'Media' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' : ''}
            ${urgency === 'Baja' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : ''}
          `}>
            {urgencyLabel}
          </span>
        </div>

        {/* Header con icono y título */}
        <div className="flex items-start justify-between mb-3 pt-8">
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl transition-transform group-hover:scale-110">{categoryEmoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                {axis.theme}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>{planet1Emoji} {planet1Name}</span>
                <span className="text-lg">{aspectSymbol}</span>
                <span>{planet2Emoji} {planet2Name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
            Eje Arquetípico
          </span>
          
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
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
