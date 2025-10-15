/**
 * CHART ANALYSIS MODAL
 * Modal fullscreen para mostrar análisis detallado de carta natal
 * Con sidebar index, navegación prev/next, y favoritos
 */

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SidebarSection {
  id: string;
  label: string;
  icon?: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
}

interface ChartAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  subtitle?: string;
  content: ReactNode;
  sidebarSections?: SidebarSection[];
  navigation?: {
    prev?: NavigationItem;
    next?: NavigationItem;
  };
  onNavigate?: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function ChartAnalysisModal({
  isOpen,
  onClose,
  title,
  icon,
  subtitle,
  content,
  sidebarSections = [],
  navigation,
  onNavigate,
  isFavorite = false,
  onToggleFavorite,
}: ChartAnalysisModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && contentRef.current) {
      const offset = 80; // Offset for sticky header
      const elementPosition = element.offsetTop;
      contentRef.current.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === modalRef.current) {
              onClose();
            }
          }}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-750">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl md:text-4xl flex-shrink-0">{icon}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Favorite button */}
                {onToggleFavorite && (
                  <button
                    onClick={onToggleFavorite}
                    className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
                    title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <span className="text-2xl">
                      {isFavorite ? '⭐' : '☆'}
                    </span>
                  </button>
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
                  title="Cerrar (Esc)"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body - Two column layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Index - Hidden on mobile */}
              {sidebarSections.length > 0 && (
                <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Índice
                    </h3>
                    <nav className="space-y-1">
                      {sidebarSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        >
                          {section.icon && (
                            <span className="text-base flex-shrink-0">{section.icon}</span>
                          )}
                          <span className="flex-1 truncate">{section.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
              >
                <div className="max-w-4xl mx-auto">
                  {content}
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            {navigation && (navigation.prev || navigation.next) && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {/* Previous */}
                {navigation.prev ? (
                  <button
                    onClick={() => onNavigate?.(navigation.prev!.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span className="hidden sm:inline">{navigation.prev.icon}</span>
                    <span className="truncate max-w-[150px]">{navigation.prev.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {/* Next */}
                {navigation.next ? (
                  <button
                    onClick={() => onNavigate?.(navigation.next!.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <span className="truncate max-w-[150px]">{navigation.next.title}</span>
                    <span className="hidden sm:inline">{navigation.next.icon}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * EJEMPLO DE USO:
 * 
 * const [selectedItem, setSelectedItem] = useState<string | null>(null);
 * const [favorites, setFavorites] = useState<Set<string>>(new Set());
 * 
 * const sidebarSections = [
 *   { id: 'config', label: 'Configuración', icon: '⚙️' },
 *   { id: 'manifestation', label: 'Manifestación', icon: '✨' },
 *   { id: 'work', label: 'Trabajo específico', icon: '🎯' },
 * ];
 * 
 * const navigation = {
 *   prev: { id: 'moon', title: 'Luna', icon: '🌙' },
 *   next: { id: 'venus', title: 'Venus', icon: '💖' },
 * };
 * 
 * <ChartAnalysisModal
 *   isOpen={selectedItem === 'mercury'}
 *   onClose={() => setSelectedItem(null)}
 *   title="Mercurio en Libra"
 *   icon="☿️"
 *   subtitle="Casa 7 • Retrógrado"
 *   content={<div>... contenido detallado ...</div>}
 *   sidebarSections={sidebarSections}
 *   navigation={navigation}
 *   onNavigate={(id) => setSelectedItem(id)}
 *   isFavorite={favorites.has('mercury')}
 *   onToggleFavorite={() => {
 *     const newFavs = new Set(favorites);
 *     if (newFavs.has('mercury')) {
 *       newFavs.delete('mercury');
 *     } else {
 *       newFavs.add('mercury');
 *     }
 *     setFavorites(newFavs);
 *   }}
 * />
 */
