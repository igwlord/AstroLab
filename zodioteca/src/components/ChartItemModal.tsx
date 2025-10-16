/**
 * MODAL GENÉRICO PARA ELEMENTOS DE CARTA
 * Maneja planetas, puntos sensibles, nodos, etc.
 * Con estilo visual consistente y diseño impactante
 */

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// ============================================
// TIPOS
// ============================================

export interface ModalSection {
  id: string;
  title: string;
  icon: string;
  content: ModalContent;
}

export type ModalContent = 
  | { type: 'text'; text: string; emoji?: string }
  | { type: 'card-grid'; items: CardItem[] }
  | { type: 'steps'; steps: StepItem[] }
  | { type: 'dual-cards'; cards: [DualCard, DualCard] }
  | { type: 'stats'; stats: StatItem[] };

export interface CardItem {
  text: string;
  icon?: string;
}

export interface StepItem {
  title: string;
  content: string;
  icon: string;
  color: string; // 'blue' | 'orange' | 'green' | 'purple' | 'yellow' | 'red' | 'pink'
}

export interface DualCard {
  title: string;
  content: string;
  icon: string;
  color: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  color: string;
}

interface ChartItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: string;
  sections: ModalSection[];
  dignityBadge?: React.ReactNode;
}

// ============================================
// HELPERS DE COLOR
// ============================================

const colorClasses: Record<string, string> = {
  blue: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-700/30',
  orange: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/50 dark:border-orange-700/30',
  green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-700/30',
  purple: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/30',
  yellow: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200/50 dark:border-yellow-700/30',
  red: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-700/30',
  pink: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200/50 dark:border-pink-700/30',
  teal: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-700/30',
  indigo: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200/50 dark:border-indigo-700/30',
  gray: 'from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 border-gray-300/50 dark:border-gray-700/50',
  amber: 'from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border-amber-200/50 dark:border-amber-800/30',
};

// ============================================
// COMPONENTES DE CONTENIDO
// ============================================

function TextContent({ text, emoji }: { text: string; emoji?: string }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                   border border-blue-200/50 dark:border-blue-700/30 rounded-xl p-6 
                   hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        {emoji && <span className="text-4xl">{emoji}</span>}
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
          {text}
        </p>
      </div>
    </div>
  );
}

function CardGridContent({ items }: { items: CardItem[] }) {
  const defaultIcons = ['🔥', '💫', '✨', '⚡', '💎', '🌟', '🎯', '💥', '🌈', '🔮'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item, i) => {
        const icon = item.icon || defaultIcons[i % defaultIcons.length];
        
        return (
          <div 
            key={i}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 
                       border border-purple-200/50 dark:border-purple-800/30 rounded-lg p-4 
                       hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                {icon}
              </span>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                {item.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StepsContent({ steps }: { steps: StepItem[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, idx) => (
        <div 
          key={idx}
          className={`bg-gradient-to-br ${colorClasses[step.color] || colorClasses.blue} 
                     border rounded-xl p-5 
                     hover:shadow-lg transition-all duration-200`}
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{step.icon}</span>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {step.title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {step.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DualCardsContent({ cards }: { cards: [DualCard, DualCard] }) {
  return (
    <div className="space-y-4">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className={`bg-gradient-to-br ${colorClasses[card.color] || colorClasses.blue} 
                     border rounded-xl p-6 
                     hover:shadow-lg transition-all duration-200`}
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{card.icon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {card.title}
              </h4>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {card.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsContent({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => {
        const bgColors: Record<string, string> = {
          red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
          green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
          blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
          purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
          yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
        };
        
        return (
          <div key={i} className={`${bgColors[stat.color] || bgColors.blue} rounded-lg p-3`}>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
            <div className="text-sm">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderContent(content: ModalContent) {
  switch (content.type) {
    case 'text':
      return <TextContent text={content.text} emoji={content.emoji} />;
    case 'card-grid':
      return <CardGridContent items={content.items} />;
    case 'steps':
      return <StepsContent steps={content.steps} />;
    case 'dual-cards':
      return <DualCardsContent cards={content.cards} />;
    case 'stats':
      return <StatsContent stats={content.stats} />;
    default:
      return null;
  }
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ChartItemModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  sections,
  dignityBadge
}: ChartItemModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-24 sm:pt-28 md:pt-32"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-9rem)]
                         bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                         overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                <div className="flex items-start gap-4 pr-12">
                  <span className="text-5xl">{icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                      </p>
                    )}
                    {dignityBadge && (
                      <div className="mt-2">
                        {dignityBadge}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-20">
                    <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </h3>
                    {renderContent(section.content)}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
