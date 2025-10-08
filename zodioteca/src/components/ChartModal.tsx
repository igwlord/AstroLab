import type { FC } from 'react';
import { X } from 'lucide-react';
import type { ChartWithStatus } from '../services/chartStorage';
import NatalChartWheelPro from './NatalChartWheelPro';
import { adaptChartData } from '../utils/chartAdapter';

interface ChartModalProps {
  chart: ChartWithStatus;
  onClose: () => void;
}

const ChartModal: FC<ChartModalProps> = ({ chart, onClose }) => {
  // Encontrar el signo solar, lunar y ascendente
  const sunPlanet = chart.data.planets.find(p => p.name === 'Sol' || p.name === 'Sun');
  const moonPlanet = chart.data.planets.find(p => p.name === 'Luna' || p.name === 'Moon');
  const ascendant = chart.data.houses[0]; // Casa 1 es el ascendente

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-2 sm:p-4 print:relative print:bg-white print:p-0">
      <div className="print-content bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-500/30 print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:border-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-3 sm:p-4 md:p-6 text-white flex justify-between items-center print:bg-white print:text-black print:border-b print:border-gray-300">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{chart.data.personName}</h2>
            <p className="text-purple-100 text-xs sm:text-sm truncate">
              {new Date(chart.data.birthData.date).toLocaleDateString()} · {chart.data.birthData.time}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="print:hidden flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-white/30 active:bg-white/40 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Cerrar modal"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              minWidth: '48px',
              minHeight: '48px',
              zIndex: 9999,
              pointerEvents: 'all',
              cursor: 'pointer'
            }}
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 pointer-events-none" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] md:max-h-[calc(90vh-120px)] print:overflow-visible print:max-h-none">
          {/* RUEDA DE CARTA NATAL */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <NatalChartWheelPro 
              data={adaptChartData(chart)} 
              size={typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 600}
              showPlanetDegrees={true}
              showDataTable={false}
            />
          </div>

          {/* RESUMEN DESTACADO */}
          <div className="mb-4 sm:mb-5 md:mb-6 bg-gradient-to-br from-purple-900/50 via-violet-900/40 to-indigo-900/50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-500/40 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 mb-3 sm:mb-4 text-center flex items-center justify-center gap-1 sm:gap-2">
              ✨ Resumen Astrológico ✨
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {/* Sol */}
              <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md border border-yellow-500/30">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">☀️</div>
                <div className="text-xs sm:text-sm text-yellow-300 font-semibold mb-0.5 sm:mb-1">Sol</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-yellow-400">
                  {sunPlanet?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">
                  {sunPlanet?.degree.toFixed(0)}° · C{sunPlanet?.house}
                </div>
              </div>

              {/* Luna */}
              <div className="bg-gradient-to-br from-slate-800/80 to-indigo-900/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md border border-blue-400/30">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">🌙</div>
                <div className="text-xs sm:text-sm text-blue-300 font-semibold mb-0.5 sm:mb-1">Luna</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-blue-400">
                  {moonPlanet?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">
                  {moonPlanet?.degree.toFixed(0)}° · C{moonPlanet?.house}
                </div>
              </div>

              {/* Ascendente */}
              <div className="bg-gradient-to-br from-slate-800/80 to-violet-900/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md border border-purple-400/30">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">🌅</div>
                <div className="text-xs sm:text-sm text-purple-300 font-semibold mb-0.5 sm:mb-1">Asc</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-purple-400">
                  {ascendant?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">
                  {ascendant?.degree.toFixed(0)}°
                </div>
              </div>
            </div>

            {/* Aspectos destacados */}
            <div className="mt-3 sm:mt-4 bg-gradient-to-r from-purple-800/40 to-pink-800/40 backdrop-blur p-2 sm:p-3 rounded-lg border border-pink-500/20">
              <div className="text-xs sm:text-sm font-semibold text-yellow-300 mb-1 sm:mb-2 text-center">
                🌟 Configuración Especial
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300 text-center">
                {chart.data.aspects.length} aspectos · {chart.data.planets.length} cuerpos
              </div>
            </div>
          </div>
          {/* Información básica */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">📍 Ubicación</h3>
            <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/40 p-2 sm:p-3 md:p-4 rounded-lg space-y-1 sm:space-y-2 text-xs sm:text-sm border border-purple-500/20 text-gray-200">
              <p><strong className="text-purple-300">Lugar:</strong> {chart.data.birthData.location}</p>
              <p><strong className="text-purple-300">Coords:</strong> {chart.data.birthData.latitude.toFixed(2)}°, {chart.data.birthData.longitude.toFixed(2)}°</p>
              <p><strong className="text-purple-300">TZ:</strong> {chart.data.birthData.timezone}</p>
            </div>
          </div>

          {/* Planetas */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2 sm:mb-3">🪐 Planetas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {chart.data.planets.slice(0, 10).map((planet) => (
                <div key={planet.name} className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-2 sm:p-3 rounded-lg border border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-colors">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-purple-200 text-xs sm:text-sm truncate">{planet.name}</span>
                    <span className="text-yellow-300 text-xs sm:text-sm shrink-0">
                      {planet.sign} {planet.degree.toFixed(1)}°
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                    Casa {planet.house} {planet.retrograde && '(R)'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Casas */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 mb-2 sm:mb-3">🏠 Casas</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1.5 sm:gap-2">
              {chart.data.houses.map((house) => (
                <div key={house.number} className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-1.5 sm:p-2 rounded text-center border border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-colors">
                  <div className="text-[10px] sm:text-xs text-blue-300">C{house.number}</div>
                  <div className="font-semibold text-blue-200 text-xs sm:text-sm">
                    {house.sign}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-400">
                    {house.degree.toFixed(0)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspectos */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mb-2 sm:mb-3">✨ Aspectos principales</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {chart.data.aspects.slice(0, 10).map((aspect, idx) => (
                <div key={idx} className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 border border-orange-500/20 backdrop-blur-sm hover:border-orange-400/40 transition-colors">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-orange-200 truncate">{aspect.planet1}</span>
                    <span className="text-yellow-400 shrink-0">{aspect.type}</span>
                    <span className="font-semibold text-orange-200 truncate">{aspect.planet2}</span>
                  </div>
                  <div className="text-[10px] sm:text-sm text-gray-300 shrink-0">
                    {aspect.orb?.toFixed(1)}° · {aspect.applying ? 'Aplic' : 'Separ'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-purple-500/30">
            <div className="text-[10px] sm:text-xs text-gray-400 space-y-0.5 sm:space-y-1">
              <p><strong className="text-purple-300">Creado:</strong> {new Date(chart.metadata.createdAt).toLocaleDateString()}</p>
              <p><strong className="text-purple-300">Modificado:</strong> {new Date(chart.metadata.modifiedAt).toLocaleDateString()}</p>
              {chart.metadata.syncedAt && (
                <p><strong className="text-purple-300">Sync:</strong> {new Date(chart.metadata.syncedAt).toLocaleDateString()}</p>
              )}
              <p><strong className="text-purple-300">Origen:</strong> {chart.metadata.source}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print:hidden bg-gradient-to-r from-slate-900 to-purple-950 p-2 sm:p-3 md:p-4 flex justify-end gap-2 sm:gap-3 border-t border-purple-500/30">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 transition-all hover:scale-105 active:scale-95 font-medium cursor-pointer shadow-lg border border-purple-400/30"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
