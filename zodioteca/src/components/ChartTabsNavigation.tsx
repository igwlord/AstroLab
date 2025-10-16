/**
 * CHART TABS NAVIGATION
 * Sistema de navegación por categorías con tabs/chips
 * Inspirado en ExercisePlanPage.tsx pero adaptado para análisis de carta
 */

import { motion } from 'framer-motion';

export interface ChartTab {
  id: string;
  label: string;
  icon: string;
  count?: number;
  readCount?: number; // 🆕 Number of read items
  color: string; // Tailwind color class (e.g., 'purple', 'pink', 'blue')
}

interface ChartTabsNavigationProps {
  tabs: ChartTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function ChartTabsNavigation({
  tabs,
  activeTab,
  onChange,
}: ChartTabsNavigationProps) {
  return (
    <>
      {/* DESKTOP: Tabs horizontales tipo chips */}
      <div className="hidden md:flex flex-wrap justify-center gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-4 py-2.5 rounded-full font-semibold text-sm
                transition-all duration-200 shadow-md hover:shadow-lg
                flex items-center gap-2
                ${isActive
                  ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-500 text-white shadow-${tab.color}-500/50`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isActive
                    ? 'bg-white/20 text-white'
                    : `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-700 dark:text-${tab.color}-400`
                  }
                `}>
                  {tab.count}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* MOBILE: Bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50 safe-area-inset-bottom shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg 
                  transition-all duration-200 min-w-[60px] relative
                  ${isActive
                    ? `bg-${tab.color}-50 dark:bg-${tab.color}-900/20`
                    : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  }
                `}
              >
                {/* Icon with badge */}
                <div className="relative">
                  <span className={`
                    text-xl transition-transform duration-200
                    ${isActive ? 'scale-110' : ''}
                  `}>
                    {tab.icon}
                  </span>
                  
                  {/* Count badge */}
                  {tab.count !== undefined && (
                    <span className={`
                      absolute -top-1 -right-1 
                      px-1 py-0.5 rounded-full text-[10px] font-bold
                      ${isActive
                        ? `bg-${tab.color}-600 text-white`
                        : `bg-${tab.color}-100 dark:bg-${tab.color}-900/50 text-${tab.color}-700 dark:text-${tab.color}-400`
                      }
                      min-w-[16px] text-center leading-none
                    `}>
                      {tab.count}
                    </span>
                  )}
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium transition-colors
                  ${isActive
                    ? `text-${tab.color}-700 dark:text-${tab.color}-400`
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {tab.label}
                </span>
                
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-${tab.color}-600 rounded-full`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE: Spacer for bottom nav */}
      <div className="md:hidden h-20"></div>
    </>
  );
}

/**
 * EJEMPLO DE USO:
 * 
 * const tabs: ChartTab[] = [
 *   { id: 'overview', label: 'Resumen', icon: '📊', count: 1, color: 'purple' },
 *   { id: 'planets', label: 'Planetas', icon: '🪐', count: 10, color: 'purple' },
 *   { id: 'points', label: 'Puntos', icon: '✨', count: 3, color: 'pink' },
 *   { id: 'aspects', label: 'Aspectos', icon: '🔗', count: 26, color: 'blue' },
 *   { id: 'concentrations', label: 'Concentraciones', icon: '🌟', count: 5, color: 'amber' },
 * ];
 * 
 * const [activeTab, setActiveTab] = useState('overview');
 * 
 * <ChartTabsNavigation
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 * />
 */
