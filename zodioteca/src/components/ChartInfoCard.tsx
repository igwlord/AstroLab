import type { FC } from 'react';
import type { NatalChart } from '../store/useCharts';

interface ChartInfoCardProps {
  chart: NatalChart;
  onSave: () => void;
  onRegenerate: () => void;
}

export const ChartInfoCard: FC<ChartInfoCardProps> = ({ chart, onSave, onRegenerate }) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl shadow-xl p-5 sm:p-6 mb-4 border border-purple-100 dark:border-purple-800/30">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
          📊 Tu Programa de 21 Días
        </h2>
        
        <div className="flex gap-2 flex-shrink-0">
          <button
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl hover:scale-105"
            onClick={onSave}
            title="Guardar Plan"
          >
            <span className="hidden sm:inline">💾 Guardar</span>
            <span className="sm:hidden">💾</span>
          </button>
          <button
            className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-gray-100 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm shadow-md hover:shadow-lg hover:scale-105"
            onClick={onRegenerate}
            title="Regenerar Plan"
          >
            <span className="hidden sm:inline">🔄 Regenerar</span>
            <span className="sm:hidden">🔄</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800/80 rounded-lg p-4 border border-purple-100 dark:border-purple-700/30 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nombre</p>
              <p className="font-bold text-gray-900 dark:text-white text-base">
                {chart.name || 'Carta Natal'}
              </p>
            </div>
          </div>
          
          {chart.birthDate && (
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-2xl">📅</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fecha de nacimiento</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {chart.birthDate.split(',')[0]}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <div className="text-2xl">🕐</div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Hora de nacimiento</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {chart.birthTime || 'No especificada'}
              </p>
            </div>
          </div>
          
          {chart.birthPlace && (
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-2xl">📍</div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Lugar de nacimiento</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {chart.birthPlace}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
