/**
 * ReflectionDeleteConfirm - Modal de confirmación para eliminar reflexiones
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from '../utils/icons';
import type { Reflection } from '../types/reflection';

interface ReflectionDeleteConfirmProps {
  reflection: Reflection;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReflectionDeleteConfirm({
  reflection,
  onConfirm,
  onCancel,
}: ReflectionDeleteConfirmProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-gradient-to-br from-red-900/95 to-purple-900/95 backdrop-blur-xl border border-red-300/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-300/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Confirmar Eliminación
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-red-300" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-red-100 mb-4">
              ¿Estás seguro de que deseas eliminar esta reflexión?
            </p>
            
            <div className="p-4 bg-white/10 backdrop-blur-sm border border-red-300/20 rounded-xl mb-6">
              <h3 className="font-semibold text-white mb-2 line-clamp-2">
                {reflection.title}
              </h3>
              <p className="text-sm text-red-200/70 line-clamp-3">
                {reflection.content}
              </p>
            </div>

            <p className="text-sm text-red-200/60">
              Esta acción no se puede deshacer. La reflexión será eliminada permanentemente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-red-300/20 bg-white/5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-red-100 rounded-xl transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50 text-white rounded-xl font-semibold transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Eliminar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
