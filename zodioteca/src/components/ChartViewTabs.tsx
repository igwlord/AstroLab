import React from 'react';

interface ChartViewTabsProps {
  activeTab: 'chart' | 'aspects' | 'positions' | 'dominances' | 'polarizations';
  onTabChange: (tab: 'chart' | 'aspects' | 'positions' | 'dominances' | 'polarizations') => void;
  aspectsCount?: number;
  polarizationsCount?: number;
}

const ChartViewTabs: React.FC<ChartViewTabsProps> = ({ activeTab, onTabChange, aspectsCount = 0, polarizationsCount = 0 }) => {
  const tabs = [
    { id: 'chart' as const, label: 'Carta Natal', icon: '🎯' },
    { id: 'aspects' as const, label: 'Aspectos', icon: '⚡', count: aspectsCount },
    { id: 'positions' as const, label: 'Posiciones', icon: '�' },
    { id: 'dominances' as const, label: 'Dominancias', icon: '👑' },
    { id: 'polarizations' as const, label: 'Polarizaciones', icon: '⚖️', count: polarizationsCount }
  ];

  return (
    <div className="flex flex-nowrap gap-1 sm:gap-2 mb-4 sm:mb-6 justify-center overflow-x-auto pb-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-2.5 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-sm
            transition-all duration-300 flex items-center gap-1 sm:gap-2 flex-shrink-0
            ${activeTab === tab.id
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md'
            }
          `}
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
  );
};

export default ChartViewTabs;
