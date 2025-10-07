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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4 md:p-6 text-white flex justify-between items-center">
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
            className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-white/30 active:bg-white/40 rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg"
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
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] md:max-h-[calc(90vh-120px)]">
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
          <div className="mb-4 sm:mb-5 md:mb-6 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-200">
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-purple-900 mb-3 sm:mb-4 text-center flex items-center justify-center gap-1 sm:gap-2">
              ✨ Resumen Astrológico ✨
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {/* Sol */}
              <div className="bg-white/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">☀️</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 sm:mb-1">Sol</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-orange-600">
                  {sunPlanet?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  {sunPlanet?.degree.toFixed(0)}° · C{sunPlanet?.house}
                </div>
              </div>

              {/* Luna */}
              <div className="bg-white/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">🌙</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 sm:mb-1">Luna</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-blue-600">
                  {moonPlanet?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  {moonPlanet?.degree.toFixed(0)}° · C{moonPlanet?.house}
                </div>
              </div>

              {/* Ascendente */}
              <div className="bg-white/80 backdrop-blur p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-md">
                <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">🌅</div>
                <div className="text-xs sm:text-sm text-gray-600 font-semibold mb-0.5 sm:mb-1">Asc</div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-purple-600">
                  {ascendant?.sign || 'N/A'}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                  {ascendant?.degree.toFixed(0)}°
                </div>
              </div>
            </div>

            {/* Aspectos destacados */}
            <div className="mt-3 sm:mt-4 bg-white/60 backdrop-blur p-2 sm:p-3 rounded-lg">
              <div className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 text-center">
                🌟 Configuración Especial
              </div>
              <div className="text-[10px] sm:text-xs text-gray-700 text-center">
                {chart.data.aspects.length} aspectos · {chart.data.planets.length} cuerpos
              </div>
            </div>
          </div>
          {/* Información básica */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">📍 Ubicación</h3>
            <div className="bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p><strong>Lugar:</strong> {chart.data.birthData.location}</p>
              <p><strong>Coords:</strong> {chart.data.birthData.latitude.toFixed(2)}°, {chart.data.birthData.longitude.toFixed(2)}°</p>
              <p><strong>TZ:</strong> {chart.data.birthData.timezone}</p>
            </div>
          </div>

          {/* Planetas */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">🪐 Planetas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {chart.data.planets.slice(0, 10).map((planet) => (
                <div key={planet.name} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-2 sm:p-3 rounded-lg">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-purple-900 text-xs sm:text-sm truncate">{planet.name}</span>
                    <span className="text-purple-700 text-xs sm:text-sm shrink-0">
                      {planet.sign} {planet.degree.toFixed(1)}°
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                    Casa {planet.house} {planet.retrograde && '(R)'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Casas */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">🏠 Casas</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1.5 sm:gap-2">
              {chart.data.houses.map((house) => (
                <div key={house.number} className="bg-blue-50 p-1.5 sm:p-2 rounded text-center">
                  <div className="text-[10px] sm:text-xs text-gray-600">C{house.number}</div>
                  <div className="font-semibold text-blue-900 text-xs sm:text-sm">
                    {house.sign}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-500">
                    {house.degree.toFixed(0)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspectos */}
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-900 mb-2 sm:mb-3">✨ Aspectos principales</h3>
            <div className="space-y-1.5 sm:space-y-2">
              {chart.data.aspects.slice(0, 10).map((aspect, idx) => (
                <div key={idx} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-2 sm:p-3 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-orange-900 truncate">{aspect.planet1}</span>
                    <span className="text-orange-600 shrink-0">{aspect.type}</span>
                    <span className="font-semibold text-orange-900 truncate">{aspect.planet2}</span>
                  </div>
                  <div className="text-[10px] sm:text-sm text-gray-600 shrink-0">
                    {aspect.orb?.toFixed(1)}° · {aspect.applying ? 'Aplic' : 'Separ'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
            <div className="text-[10px] sm:text-xs text-gray-500 space-y-0.5 sm:space-y-1">
              <p><strong>Creado:</strong> {new Date(chart.metadata.createdAt).toLocaleDateString()}</p>
              <p><strong>Modificado:</strong> {new Date(chart.metadata.modifiedAt).toLocaleDateString()}</p>
              {chart.metadata.syncedAt && (
                <p><strong>Sync:</strong> {new Date(chart.metadata.syncedAt).toLocaleDateString()}</p>
              )}
              <p><strong>Origen:</strong> {chart.metadata.source}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-2 sm:p-3 md:p-4 flex justify-end gap-2 sm:gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-all hover:scale-105 active:scale-95 font-medium cursor-pointer shadow-sm"
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
