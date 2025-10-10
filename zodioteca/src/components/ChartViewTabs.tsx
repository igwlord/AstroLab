import React from 'react';

interface ChartViewTabsProps {
  activeTab: 'chart' | 'aspects' | 'positions' | 'dominances' | 'polarizations';
  onTabChange: (tab: 'chart' | 'aspects' | 'positions' | 'dominances' | 'polarizations') => void;
  aspectsCount?: number;
  polarizationsCount?: number;
}

const ChartViewTabs: React.FC<ChartViewTabsProps> = ({ activeTab, onTabChange, aspectsCount = 0, polarizationsCount = 0 }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTabRef = React.useRef<HTMLButtonElement>(null);

  const tabs = [
    { id: 'chart' as const, label: 'Carta Natal', icon: '🎯' },
    { id: 'aspects' as const, label: 'Aspectos', icon: '⚡', count: aspectsCount },
    { id: 'positions' as const, label: 'Posiciones', icon: '🔭' },
    { id: 'dominances' as const, label: 'Dominancias', icon: '👑' },
    { id: 'polarizations' as const, label: 'Polarizaciones', icon: '⚖️', count: polarizationsCount }
  ];

  // Auto-scroll al tab activo cuando cambia
  React.useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  return (
    <div className="relative mb-4 sm:mb-6">
      {/* Indicador de scroll izquierda (solo móvil) */}
      <div className="md:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-purple-50 dark:from-gray-900 to-transparent pointer-events-none z-10 opacity-70" />
      
      {/* Indicador de scroll derecha (solo móvil) */}
      <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-purple-50 dark:from-gray-900 to-transparent pointer-events-none z-10 opacity-70" />
      
      <div 
        ref={scrollContainerRef}
        className="flex flex-nowrap gap-1 sm:gap-2 justify-start md:justify-center overflow-x-auto pb-1 px-2 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            ref={activeTab === tab.id ? activeTabRef : null}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-2.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-sm
              transition-all duration-300 flex items-center gap-1 sm:gap-2 flex-shrink-0
              min-w-[44px] min-h-[44px]
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md active:scale-[0.98]'
              }
            `}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="text-sm sm:text-lg">{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`
                ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                }
              `}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartViewTabs;
