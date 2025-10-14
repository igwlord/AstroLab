/**
 * ReflexPage - Página principal de reflexiones
 * Muestra todas las reflexiones del usuario con filtros, búsqueda y estadísticas
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Tag,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  getReflections, 
  getReflectionStats,
  deleteReflection 
} from '../services/reflectionsService';
import type { Reflection } from '../types/reflection';
import ReflectionCard from '../components/ReflectionCard';
import ReflectionModal from '../components/ReflectionModal';
import ReflectionDeleteConfirm from '../components/ReflectionDeleteConfirm';

export default function ReflexPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [filteredReflections, setFilteredReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(null);
  const [deletingReflection, setDeletingReflection] = useState<Reflection | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    this_month: 0,
    this_week: 0,
    total_tags: [] as string[]
  });

  // Cargar reflexiones y estadísticas
  useEffect(() => {
    loadReflections();
    loadStats();
  }, []);

  // Filtrar reflexiones cuando cambia el término de búsqueda o los tags
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedTags, reflections]);

  const loadReflections = async () => {
    try {
      setLoading(true);
      const data = await getReflections();
      setReflections(data);
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getReflectionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...reflections];

    // Filtro de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(term) || 
        r.content.toLowerCase().includes(term)
      );
    }

    // Filtro de tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(r => 
        selectedTags.some(tag => r.tags.includes(tag))
      );
    }

    setFilteredReflections(filtered);
  };

  const handleCreateReflection = () => {
    setEditingReflection(null);
    setShowModal(true);
  };

  const handleEditReflection = (reflection: Reflection) => {
    setEditingReflection(reflection);
    setShowModal(true);
  };

  const handleDeleteReflection = (reflection: Reflection) => {
    setDeletingReflection(reflection);
  };

  const confirmDelete = async () => {
    if (!deletingReflection) return;

    try {
      await deleteReflection(deletingReflection.id);
      setReflections(prev => prev.filter(r => r.id !== deletingReflection.id));
      setDeletingReflection(null);
      await loadStats();
    } catch (error) {
      console.error('Error deleting reflection:', error);
    }
  };

  const handleModalClose = async (shouldReload?: boolean) => {
    setShowModal(false);
    setEditingReflection(null);
    
    if (shouldReload) {
      await loadReflections();
      await loadStats();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Header - Optimizado para móviles */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="p-1.5 sm:p-2 md:p-3 bg-purple-500/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Mis Reflexiones
                </h1>
                <p className="text-purple-300/70 mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base">
                  Un espacio para tus pensamientos astrológicos
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateReflection}
              className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-xs sm:text-sm md:text-base touch-manipulation"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              <span className="hidden xs:inline">Nueva Reflexión</span>
              <span className="xs:hidden">+</span>
            </motion.button>
          </div>

          {/* Stats - Optimizadas para móviles */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6">
            <StatsCard
              icon={<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
              label="Total"
              value={stats.total}
              color="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
              label="Este mes"
              value={stats.this_month}
              color="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon={<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
              label="Esta semana"
              value={stats.this_week}
              color="from-indigo-500 to-purple-500"
            />
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-300/50" />
              <input
                type="text"
                placeholder="Buscar en reflexiones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-lg sm:rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 text-sm sm:text-base"
              />
            </div>

            {/* Tags Filter */}
            {stats.total_tags.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 text-purple-300/70">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Filtrar por:</span>
                </div>
                {stats.total_tags.slice(0, 6).map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 text-purple-300/70 hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
                {stats.total_tags.length > 6 && (
                  <span className="text-xs text-purple-300/50">
                    +{stats.total_tags.length - 6}
                  </span>
                )}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-purple-300/50 hover:text-purple-300 underline ml-1"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Reflections List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300/30 border-t-purple-300"></div>
          </div>
        ) : filteredReflections.length === 0 ? (
          <EmptyState 
            hasReflections={reflections.length > 0}
            hasFilters={searchTerm.trim() !== '' || selectedTags.length > 0}
            onCreateClick={handleCreateReflection}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredReflections.map((reflection, index) => (
                <ReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  index={index}
                  onEdit={handleEditReflection}
                  onDelete={handleDeleteReflection}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <ReflectionModal
          reflection={editingReflection}
          onClose={handleModalClose}
        />
      )}

      {deletingReflection && (
        <ReflectionDeleteConfirm
          reflection={deletingReflection}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingReflection(null)}
        />
      )}
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-purple-300/20 rounded-lg sm:rounded-xl flex-1 sm:flex-none"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 bg-gradient-to-br ${color} rounded-lg`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg sm:text-2xl font-bold">{value}</p>
          <p className="text-xs sm:text-sm text-purple-300/70 truncate">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State Component
interface EmptyStateProps {
  hasReflections: boolean;
  hasFilters: boolean;
  onCreateClick: () => void;
}

function EmptyState({ hasReflections, hasFilters, onCreateClick }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <Filter className="w-16 h-16 mx-auto mb-4 text-purple-300/30" />
        <h3 className="text-2xl font-semibold mb-2 text-purple-200">
          No hay resultados
        </h3>
        <p className="text-purple-300/70 mb-6">
          Intenta con otros términos de búsqueda o tags
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-300/30" />
      <h3 className="text-2xl font-semibold mb-2 text-purple-200">
        {hasReflections ? 'Sin reflexiones' : 'Comienza tu viaje de reflexión'}
      </h3>
      <p className="text-purple-300/70 mb-6">
        {hasReflections 
          ? 'No tienes reflexiones aún con estos filtros'
          : 'Crea tu primera reflexión y empieza a documentar tus descubrimientos astrológicos'}
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
      >
        <Plus className="w-5 h-5" />
        Crear Primera Reflexión
      </motion.button>
    </motion.div>
  );
}
