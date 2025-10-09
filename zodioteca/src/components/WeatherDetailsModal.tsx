/**
 * Modal con detalles completos del Clima Astrológico del día
 * Incluye: planetas personales, aspectos, transpersonales, etc.
 */

import { X } from 'lucide-react';
import type { DailyWeather } from '../services/dailyWeather';
import { normalizeAspectKey, getAspectUI } from '../constants/aspectsStandard';

interface WeatherDetailsModalProps {
  weather: DailyWeather;
  isOpen: boolean;
  onClose: () => void;
}

export default function WeatherDetailsModal({ weather, isOpen, onClose }: WeatherDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-violet-900/95 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-purple-400/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-b border-white/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-lg">🌌</span>
            <div>
              <h2 className="text-xl font-bold text-white">Detalles del Cielo</h2>
              <p className="text-sm text-white/80 capitalize">{weather.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* PLANETAS PERSONALES */}
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-md border border-white/20 space-y-3">
            <div className="text-sm font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-xl">🌠</span>
              Planetas Personales
            </div>
            
            {/* Mercurio */}
            <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">☿️</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm sm:text-base font-bold text-white">
                    Mercurio en {weather.mercury?.sign}
                  </span>
                  {weather.mercury?.retrograde && (
                    <span className="text-xs px-2 py-0.5 bg-orange-500/30 text-orange-200 rounded font-bold">
                      ℞ Retrógrado
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  {weather.mercury?.retrograde 
                    ? 'Comunicación y tecnología requieren revisión y paciencia' 
                    : 'Pensamientos, comunicación y aprendizaje fluyen en modo ' + weather.mercury?.sign}
                </p>
              </div>
            </div>

            {/* Venus */}
            <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">♀️</span>
              <div className="flex-1">
                <span className="text-sm sm:text-base font-bold text-white">
                  Venus en {weather.venus?.sign}
                </span>
                <p className="text-xs sm:text-sm text-white/80 mt-1">
                  Amor, placer y valores expresados con el toque de {weather.venus?.sign}
                </p>
              </div>
            </div>

            {/* Marte */}
            <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3">
              <span className="text-2xl">♂️</span>
              <div className="flex-1">
                <span className="text-sm sm:text-base font-bold text-white">
                  Marte en {weather.mars?.sign}
                </span>
                <p className="text-xs sm:text-sm text-white/80 mt-1">
                  Acción, deseo y energía con el impulso de {weather.mars?.sign}
                </p>
              </div>
            </div>
          </div>

          {/* CONSEJO */}
          <div className="bg-yellow-400/20 rounded-xl p-4 backdrop-blur-sm border border-yellow-400/30">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <div className="text-xs font-bold text-yellow-100 uppercase tracking-wider mb-2">
                  Consejo del Día
                </div>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  {weather.advice}
                </p>
              </div>
            </div>
          </div>

          {/* ASPECTOS PRINCIPALES */}
          {weather.mainAspects.length > 0 && (
            <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="text-sm font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                Aspectos del Día
              </div>
              <div className="space-y-3">
                {weather.mainAspects.map((aspect, index) => {
                  const aspectDescriptions: Record<string, string> = {
                    'conjunción': 'fusionan energías',
                    'oposición': 'crean tensión creativa',
                    'trígono': 'fluyen con armonía',
                    'cuadratura': 'generan desafíos constructivos',
                    'sextil': 'abren oportunidades'
                  };
                  
                  const normalizedKey = normalizeAspectKey(aspect.type);
                  const standardSymbol = normalizedKey ? getAspectUI(normalizedKey).symbol : aspect.symbol;
                  
                  return (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm sm:text-base font-bold text-white">
                          {aspect.planet1} {standardSymbol || '•'} {aspect.planet2}
                        </span>
                        <span className="text-xs text-white/60">
                          (orbe {aspect.orb.toFixed(1)}°)
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/80">
                        {aspectDescriptions[aspect.type.toLowerCase()] || 'interactúan'} hoy
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TRANSPERSONALES */}
          <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-sm font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-xl">🪐</span>
              Contexto Generacional
            </div>
            <p className="text-xs sm:text-sm text-white/70 mb-4 leading-relaxed">
              Planetas lentos que marcan tendencias de largo plazo
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2">
                <span className="text-white/90">♃ Júpiter en {weather.jupiter?.sign}</span>
                <span className="text-white/60 text-xs">expansión</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2">
                <span className="text-white/90">♄ Saturno en {weather.saturn?.sign}</span>
                <span className="text-white/60 text-xs">estructura</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2">
                <span className="text-white/90">♅ Urano en {weather.uranus?.sign}</span>
                <span className="text-white/60 text-xs">revolución</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2">
                <span className="text-white/90">♆ Neptuno en {weather.neptune?.sign}</span>
                <span className="text-white/60 text-xs">sueños colectivos</span>
              </div>
              <div className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-2">
                <span className="text-white/90">♇ Plutón en {weather.pluto?.sign}</span>
                <span className="text-white/60 text-xs">transformación</span>
              </div>
            </div>
          </div>

          {/* ELEMENTO DOMINANTE */}
          <div className="bg-gradient-to-r from-white/20 to-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-wider mb-1">
                  {weather.dominantElement.emoji} Elemento Dominante
                </div>
                <div className="text-lg sm:text-xl font-bold text-white capitalize">
                  {weather.dominantElement.element}
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white">
                {weather.dominantElement.percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botón de cerrar */}
        <div className="sticky bottom-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-t border-white/20 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-base font-bold text-white transition-all duration-300 active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
