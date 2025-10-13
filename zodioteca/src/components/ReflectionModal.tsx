/**
 * ReflectionModal - Modal para crear/editar reflexiones
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Tag } from 'lucide-react';
import { createReflection, updateReflection } from '../services/reflectionsService';
import type { Reflection, ReflectionInput } from '../types/reflection';

interface ReflectionModalProps {
  reflection?: Reflection | null;
  onClose: (shouldReload?: boolean) => void;
}

export default function ReflectionModal({ reflection, onClose }: ReflectionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!reflection;

  useEffect(() => {
    if (reflection) {
      setTitle(reflection.title);
      setContent(reflection.content);
      setTags(reflection.tags || []);
    }
  }, [reflection]);

  const handleAddTag = () => {
    const newTag = tagsInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('El título y el contenido son obligatorios');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const input: ReflectionInput = {
        title: title.trim(),
        content: content.trim(),
        tags,
      };

      if (isEditing) {
        await updateReflection(reflection.id, input);
      } else {
        await createReflection(input);
      }

      onClose(true); // Reload reflections
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la reflexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 sm:pt-24 p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl max-h-[calc(100vh-6rem)] bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border border-purple-300/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-300/20">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Editar Reflexión' : 'Nueva Reflexión'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onClose(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-purple-300" />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-purple-200 mb-2">
                Título *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Mis primeras impresiones sobre mi Luna en Cáncer"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
                maxLength={200}
                disabled={saving}
              />
              <p className="text-xs text-purple-300/50 mt-1">
                {title.length}/200 caracteres
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-purple-200 mb-2">
                Contenido *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tus reflexiones, descubrimientos, preguntas o insights astrológicos..."
                rows={8}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 resize-none"
                maxLength={5000}
                disabled={saving}
              />
              <p className="text-xs text-purple-300/50 mt-1">
                {content.length}/5000 caracteres
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-purple-200 mb-2">
                Tags (opcional)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Ej: Luna, Emociones, Insight"
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
                  disabled={saving}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-xl transition-colors disabled:opacity-50"
                  disabled={saving || !tagsInput.trim()}
                >
                  <Tag className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Tags List */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/30 text-purple-100 rounded-lg"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-white transition-colors"
                        disabled={saving}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-300/20 mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onClose(false)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 rounded-xl transition-colors"
                disabled={saving}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
