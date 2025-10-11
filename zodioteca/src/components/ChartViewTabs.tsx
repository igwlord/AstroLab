import React from 'react';

interface ChartViewTabsProps {
  activeTab: 'chart' | 'aspects' | 'shape' | 'positions' | 'dominances' | 'polarizations';
  onTabChange: (tab: 'chart' | 'aspects' | 'shape' | 'positions' | 'dominances' | 'polarizations') => void;
  aspectsCount?: number;
  polarizationsCount?: number;
}

const ChartViewTabs: React.FC<ChartViewTabsProps> = ({ activeTab, onTabChange, aspectsCount = 0, polarizationsCount = 0 }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTabRef = React.useRef<HTMLButtonElement>(null);

  const tabs = [
    { id: 'chart' as const, label: 'Carta Natal', icon: '🎯' },
    { id: 'aspects' as const, label: 'Aspectos', icon: '⚡', count: aspectsCount },
    { id: 'shape' as const, label: 'Forma', icon: '📊' },
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
    <div className="relative mb-3 sm:mb-4 lg:mb-6">
      <div 
        ref={scrollContainerRef}
        className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3 justify-center px-1 sm:px-2"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            ref={activeTab === tab.id ? activeTabRef : null}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-2 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 
              rounded-md sm:rounded-lg lg:rounded-xl 
              font-semibold text-[10px] sm:text-xs lg:text-sm
              transition-all duration-300 flex items-center gap-1 sm:gap-1.5 lg:gap-2 
              flex-shrink-0 min-h-[36px] sm:min-h-[40px] lg:min-h-[44px]
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md active:scale-[0.98]'
              }
            `}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="text-xs sm:text-sm lg:text-lg">{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`
                ml-0.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] lg:text-[10px] font-bold
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                }
              `}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartViewTabs;
