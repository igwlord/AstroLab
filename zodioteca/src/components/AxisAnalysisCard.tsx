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
 * Obtiene color según urgencia
 */
function getUrgencyColor(urgency: 'Alta' | 'Media' | 'Baja'): string {
  if (urgency === 'Alta') return 'border-red-500/30 bg-red-500/5';
  if (urgency === 'Media') return 'border-yellow-500/30 bg-yellow-500/5';
  return 'border-blue-500/30 bg-blue-500/5';
}

export default function AxisAnalysisCard({ axis, onClick }: AxisAnalysisCardProps) {
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
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-xl border-2 
        ${getUrgencyColor(urgency)}
        backdrop-blur-sm p-6 cursor-pointer
        transition-all duration-300
        hover:shadow-xl hover:shadow-purple-500/10
      `}
      onClick={onClick}
    >
      {/* Badge de urgencia */}
      <div className="absolute top-4 right-4">
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${urgency === 'Alta' ? 'bg-red-500/20 text-red-700 dark:text-red-300' : ''}
          ${urgency === 'Media' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' : ''}
          ${urgency === 'Baja' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : ''}
        `}>
          {urgencyLabel}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{categoryEmoji}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {axis.theme}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span>{planet1Emoji} {planet1Name}</span>
            <span className="text-lg">{aspectSymbol}</span>
            <span>{planet2Emoji} {planet2Name}</span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Detalles */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="font-semibold">Orbe:</span>
          <span>{axis.orb.toFixed(1)}°</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Casas:</span>
          <span>{axis.houses[0]} - {axis.houses[1]}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Score:</span>
          <span>{axis.score.toFixed(1)}/20</span>
        </div>
      </div>

      {/* Indicador de más info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Click para ver ejercicios y análisis completo →
        </span>
      </div>
    </motion.div>
  );
}
