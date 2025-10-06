import { useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  count?: number;
  badge?: string;
}

interface ChartTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function ChartTabs({ tabs, activeTab, onTabChange, className = '' }: ChartTabsProps) {
  // Guardar tab activo en localStorage
  useEffect(() => {
    localStorage.setItem('lastActiveChartTab', activeTab);
  }, [activeTab]);

  return (
    <div className={`sticky top-0 z-40 bg-white dark:bg-gray-900 border-b-2 border-purple-200 dark:border-purple-800 shadow-md ${className}`}>
      {/* Tabs container - Scroll horizontal en móvil */}
      <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-100 dark:scrollbar-track-purple-900">
        <div className="flex gap-1 sm:gap-2 p-2 sm:p-3 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-1.5 sm:gap-2 
                  px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl
                  font-medium text-xs sm:text-sm
                  transition-all duration-300 ease-in-out
                  whitespace-nowrap
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105 sm:scale-110' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                  }
                `}
              >
                {/* Icono */}
                <span className="text-base sm:text-lg">{tab.icon}</span>
                
                {/* Label - Ocultar en móvil muy pequeño */}
                <span className="hidden xs:inline">{tab.label}</span>
                
                {/* Badge contador */}
                {tab.count !== undefined && (
                  <span className={`
                    ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
                
                {/* Badge especial (ej: alertas) */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                
                {/* Indicator bar para tab activo */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-white rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Indicador de scroll en móvil */}
      <div className="sm:hidden flex justify-center py-1 bg-purple-50 dark:bg-purple-900/20">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-pulse animation-delay-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-200 animate-pulse animation-delay-400" />
        </div>
      </div>
    </div>
  );
}
