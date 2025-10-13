/**
 * ReflectionCard - Tarjeta individual de reflexión
 * Muestra una reflexión con opciones para editar y eliminar
 */

import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import type { Reflection } from '../types/reflection';

interface ReflectionCardProps {
  reflection: Reflection;
  index: number;
  onEdit: (reflection: Reflection) => void;
  onDelete: (reflection: Reflection) => void;
}

export default function ReflectionCard({ 
  reflection, 
  index, 
  onEdit, 
  onDelete 
}: ReflectionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2 line-clamp-2">
            {reflection.title}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-300/70">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{formatDate(reflection.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(reflection)}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(reflection)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-start gap-2 text-purple-200/80">
          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" />
          <p className="text-xs sm:text-sm leading-relaxed line-clamp-3">
            {truncateContent(reflection.content, 120)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {reflection.tags && reflection.tags.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300/50 flex-shrink-0" />
          {reflection.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-500/20 text-purple-200 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {reflection.tags.length > 3 && (
            <span className="text-xs text-purple-300/50">
              +{reflection.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Chart Link Indicator */}
      {reflection.chart_id && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" title="Vinculada a una carta natal" />
      )}
    </motion.div>
  );
}
