/**
 * COMPONENTE: AxisAnalysisModal
 * Modal con análisis completo de un eje arquetípico
 * Muestra importancia, ejercicios, urgencia y detalles técnicos
 * Sistema de secciones con sidebar index y scroll suave
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AxisAnalysis, AxisCategory } from '../services/exercises/chartAnalyzer';
import { getAspectSymbol } from '../services/exercises/chartAnalyzer';
import {
  getAxisImportance,
  getAxisExercises,
  getAxisUrgency,
  getAxisDescription
} from '../utils/interpretationHelpers';

interface AxisAnalysisModalProps {
  axis: AxisAnalysis;
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarSection {
  id: string;
  label: string;
  icon: string;
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

export default function AxisAnalysisModal({ axis, isOpen, onClose }: AxisAnalysisModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const urgency = getAxisUrgency(axis.score);
  const importance = getAxisImportance(axis.theme, axis.aspectType, axis.houses);
  const exercises = getAxisExercises(axis.theme, axis.category);
  const description = getAxisDescription(axis.theme);

  const categoryEmoji = getCategoryEmoji(axis.category);
  const planet1Emoji = getPlanetEmoji(axis.planets[0]);
  const planet2Emoji = getPlanetEmoji(axis.planets[1]);
  const aspectSymbol = getAspectSymbol(axis.aspectType);

  const planet1Name = getPlanetDisplayName(axis.planets[0]);
  const planet2Name = getPlanetDisplayName(axis.planets[1]);

  const urgencyLabel = urgency === 'Alta' ? 'Crítico' : urgency === 'Media' ? 'Trabajar' : 'Observar';

  // Secciones del sidebar
  const sidebarSections: SidebarSection[] = [
    { id: 'importance', label: '¿Por qué importa?', icon: '🎯' },
    { id: 'exercises', label: 'Ejercicios prácticos', icon: '💪' },
    { id: 'urgency', label: 'Nivel de urgencia', icon: '⏰' },
    { id: 'technical', label: 'Detalles técnicos', icon: '🔧' },
  ];

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
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPosition = document.body.style.position;
      
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.position = originalBodyPosition;
      };
    }
  }, [isOpen]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && contentRef.current) {
      const offset = 100;
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
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pt-24 sm:pt-28 md:pt-32 pb-4 px-4"
          style={{ 
            zIndex: 999999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
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
            className="w-full max-w-6xl max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-9rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/15 dark:to-teal-900/15">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl md:text-4xl flex-shrink-0">{categoryEmoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                      {axis.theme}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      {urgencyLabel}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-1">
                    <span>{planet1Emoji} {planet1Name}</span>
                    <span className="text-xl">{aspectSymbol}</span>
                    <span>{planet2Emoji} {planet2Name}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {description}
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
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

            {/* Body - Two column layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Index */}
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
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <span>{section.icon}</span>
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Stats rápidas */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Resumen
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Orbe:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{axis.orb.toFixed(1)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Casas:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{axis.houses[0]} - {axis.houses[1]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Score:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{axis.score.toFixed(1)}/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Categoría:</span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{axis.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div ref={contentRef} className="flex-1 overflow-y-auto">
                <div className="p-6 md:p-8 space-y-8">
                  {/* Importancia */}
                  <section id="importance">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🎯</span>
                      <span>¿Por qué importa?</span>
                    </h3>
                    <div className="space-y-3">
                      {importance.map((point, i) => (
                        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-emerald-300 dark:border-emerald-700">
                          {point}
                        </p>
                      ))}
                    </div>
                  </section>

                  {/* Ejercicios */}
                  <section id="exercises">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>💪</span>
                      <span>Ejercicios prácticos</span>
                    </h3>
                    <div className="space-y-3">
                      {exercises.map((exercise, i) => {
                        if (exercise === '') return <div key={i} className="h-2" />;
                        const isNote = exercise.startsWith('💎') || exercise.startsWith('🌊') || 
                                       exercise.startsWith('⚡') || exercise.startsWith('✨');
                        return (
                          <div 
                            key={i} 
                            className={isNote 
                              ? "p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-gray-700 dark:text-gray-300" 
                              : "flex gap-3 text-gray-700 dark:text-gray-300"
                            }
                          >
                            {!isNote && <span className="text-emerald-600 dark:text-emerald-400 font-bold">{i + 1}.</span>}
                            <span className="flex-1">{exercise}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Urgencia */}
                  <section id="urgency">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>⏰</span>
                      <span>Nivel de urgencia: {urgency}</span>
                    </h3>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {urgency === 'Alta' 
                          ? 'Este eje requiere atención inmediata. Los ejercicios pueden generar cambios significativos rápidamente. Dedica tiempo consciente a trabajar estas dinámicas.'
                          : urgency === 'Media'
                          ? 'Trabaja este eje de forma regular pero sin presión. La integración consciente facilitará tu evolución. Incorpora los ejercicios a tu rutina semanal.'
                          : 'Observa este eje con curiosidad. El trabajo puede ser más sutil pero igualmente valioso. Revisa periódicamente cómo se manifiesta en tu vida.'
                        }
                      </p>
                    </div>
                  </section>

                  {/* Detalles técnicos */}
                  <section id="technical">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>🔧</span>
                      <span>Detalles técnicos</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-1">Tipo de aspecto</span>
                        <span className="text-gray-700 dark:text-gray-300 capitalize">{axis.aspectType}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-1">Casas angulares</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {axis.houses.some(h => [1,4,7,10].includes(h)) ? 'Sí ✓' : 'No'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-1">Casas sensibles</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {axis.houses.some(h => [8,12].includes(h)) ? 'Sí ✓' : 'No'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <span className="font-semibold text-gray-900 dark:text-white block mb-1">Score de impacto</span>
                        <span className="text-gray-700 dark:text-gray-300">{axis.score.toFixed(1)}/20</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {axis.score >= 15 
                          ? '⭐ Score alto: Este eje es estructurante y central en tu carta natal.'
                          : axis.score >= 10
                          ? '⭐ Score medio: Este eje es relevante y merece atención regular.'
                          : '⭐ Score moderado: Este eje opera de forma más sutil en tu psique.'
                        }
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
