/**
 * PHASE TABS - Navegación por pestañas para fases (no semanas)
 * Plan de 21 días flexible: usuario elige cuándo hacer cada fase
 * Fase 1 (Días 1-7) → Fase 2 (Días 8-14) → Fase 3 (Días 15-21)
 */

interface WeeklyTabsProps {
  activeWeek: number;
  onWeekChange: (week: number) => void;
  weekProgress: Array<{ completed: number; total: number; percent: number }>;
  isWeekUnlocked: (week: number) => boolean;
}

export default function WeeklyTabs({
  activeWeek,
  onWeekChange,
  weekProgress,
  isWeekUnlocked
}: WeeklyTabsProps) {
  const phaseLabels = [
    { number: 1, icon: '🌱', name: 'Fundación', days: 'Días 1-7' },
    { number: 2, icon: '🌿', name: 'Profundización', days: 'Días 8-14' },
    { number: 3, icon: '🌳', name: 'Integración', days: 'Días 15-21' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-3 mb-4 sm:mb-6 border border-purple-200 dark:border-purple-700">
      {/* MOBILE: Tabs verticales compactos */}
      <div className="md:hidden space-y-2">
        {phaseLabels.map((phase) => {
          const isUnlocked = isWeekUnlocked(phase.number);
          const isActive = activeWeek === phase.number;
          const progress = weekProgress[phase.number - 1];

          return (
            <button
              key={phase.number}
              onClick={() => isUnlocked && onWeekChange(phase.number)}
              disabled={!isUnlocked}
              className={`w-full rounded-lg p-3 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : isUnlocked
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  : 'bg-gray-100 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isUnlocked ? phase.icon : '🔒'}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">Fase {phase.number}</div>
                    <div className="text-xs opacity-80">{phase.days}</div>
                  </div>
                </div>
                {isUnlocked && (
                  <div className="text-right">
                    <div className="text-lg font-bold">{progress.percent}%</div>
                    <div className="text-xs opacity-80">{progress.completed}/{progress.total}</div>
                  </div>
                )}
              </div>
              {/* Barra de progreso mini */}
              {isUnlocked && (
                <div className="mt-2 w-full bg-white/30 dark:bg-gray-800/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive ? 'bg-white' : 'bg-purple-600'
                    }`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* DESKTOP: Tabs horizontales elegantes */}
      <div className="hidden md:flex gap-2">
        {phaseLabels.map((phase) => {
          const isUnlocked = isWeekUnlocked(phase.number);
          const isActive = activeWeek === phase.number;
          const progress = weekProgress[phase.number - 1];

          return (
            <button
              key={phase.number}
              onClick={() => isUnlocked && onWeekChange(phase.number)}
              disabled={!isUnlocked}
              className={`flex-1 rounded-lg p-4 transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                  : isUnlocked
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-102'
                  : 'bg-gray-100 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{isUnlocked ? phase.icon : '🔒'}</span>
                  <span className="text-lg font-bold">Fase {phase.number}</span>
                </div>
                <div className="text-xs font-medium opacity-80">{phase.days}</div>
                <div className="text-sm font-medium opacity-90">{phase.name}</div>
                
                {isUnlocked && (
                  <>
                    <div className="text-2xl font-bold mt-1">{progress.percent}%</div>
                    <div className="text-xs opacity-80">
                      {progress.completed} de {progress.total} días
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-white/30 dark:bg-gray-800/30 rounded-full h-2 overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isActive ? 'bg-white' : 'bg-purple-600'
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </>
                )}
                
                {!isUnlocked && (
                  <div className="text-xs mt-2 text-center">
                    Completa los 7 días de Fase {phase.number - 1}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
