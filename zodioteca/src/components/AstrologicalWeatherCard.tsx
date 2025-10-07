/**
 * 🌌 TARJETA DE CLIMA ASTROLÓGICO DEL DÍA
 * 
 * Componente principal que muestra el resumen astrológico diario.
 * Incluye accordion expandible con detalles completos.
 * 
 * Características:
 * - Vista compacta: Sol, Luna, planetas personales, resumen
 * - Vista expandida: Aspectos, planetas lentos, elemento dominante
 * - Botón compartir (Web Share API + fallback clipboard)
 * - Link "Saber más" al Glosario
 * - Loading skeleton y error handling
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDailyAstrologicalWeather, type DailyWeather } from '../services/dailyWeather';
import { Share2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { logger } from '../utils/logger';

/**
 * Obtener elemento de un signo zodiacal
 */
function getSignElement(sign: string | undefined): { element: string; emoji: string } {
  const signToElement: Record<string, { element: string; emoji: string }> = {
    'Aries': { element: 'fuego', emoji: '🔥' },
    'Leo': { element: 'fuego', emoji: '🔥' },
    'Sagitario': { element: 'fuego', emoji: '🔥' },
    'Tauro': { element: 'tierra', emoji: '🌍' },
    'Virgo': { element: 'tierra', emoji: '🌍' },
    'Capricornio': { element: 'tierra', emoji: '🌍' },
    'Géminis': { element: 'aire', emoji: '💨' },
    'Libra': { element: 'aire', emoji: '💨' },
    'Acuario': { element: 'aire', emoji: '💨' },
    'Cáncer': { element: 'agua', emoji: '💧' },
    'Escorpio': { element: 'agua', emoji: '💧' },
    'Piscis': { element: 'agua', emoji: '💧' },
  };
  
  return sign ? signToElement[sign] || { element: '?', emoji: '✨' } : { element: '?', emoji: '✨' };
}

export default function AstrologicalWeatherCard() {
  const [weather, setWeather] = useState<DailyWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================
  // EFECTOS
  // ===========================

  useEffect(() => {
    loadWeather();
  }, []);

  // ===========================
  // FUNCIONES DE CARGA
  // ===========================

  async function loadWeather() {
    try {
      setError(null);
      setIsLoading(true);

      const data = await getDailyAstrologicalWeather();
      setWeather(data);
    } catch (err) {
      logger.error('Error cargando clima astrológico:', err);
      setError('No se pudo cargar el clima astrológico. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  // ===========================
  // HANDLERS
  // ===========================

  const handleShare = async () => {
    if (!weather) return;

    const shareText = `🌌 Clima Astrológico - ${weather.date}

☀️ Sol: ${weather.sun?.sign} ${weather.sun?.degree.toFixed(0)}°
🌙 Luna: ${weather.moon?.sign} ${weather.moon?.degree.toFixed(0)}° ${weather.moonPhase.emoji}

${weather.summary}

✨ Consejo: ${weather.advice}

✨ Descubre más en AstroLab
🔗 astrolab-web.netlify.app`;

    // Intentar Web Share API (móvil)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Clima Astrológico del Día',
          text: shareText,
          url: 'https://astrolab-web.netlify.app/'
        });
        logger.log('✅ Compartido exitosamente');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          logger.error('Error compartiendo:', err);
        }
      }
    } else {
      // Fallback: Copiar al clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('✅ Copiado al portapapeles');
      } catch (err) {
        logger.error('Error copiando:', err);
        alert('❌ No se pudo copiar al portapapeles');
      }
    }
  };

  // ===========================
  // LOADING SKELETON
  // ===========================

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-violet-600/90 dark:from-purple-900/95 dark:via-indigo-900/95 dark:to-violet-900/95 rounded-2xl p-4 sm:p-5 border border-purple-400/30 dark:border-purple-500/30 shadow-2xl backdrop-blur-md animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
            <div className="h-6 bg-white/20 rounded w-32"></div>
          </div>
          <div className="h-6 bg-white/20 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-16 bg-white/15 rounded-xl"></div>
          <div className="h-10 bg-white/15 rounded-xl"></div>
          <div className="h-12 bg-white/15 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // ===========================
  // ERROR STATE
  // ===========================

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600/90 via-orange-600/90 to-red-600/90 rounded-2xl p-4 border border-red-400/30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm sm:text-base text-white font-bold mb-1">
              Error de carga
            </p>
            <p className="text-xs text-white/80 mb-2.5">
              {error || 'Intenta nuevamente'}
            </p>
            <button
              onClick={loadWeather}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // COMPONENTE PRINCIPAL
  // ===========================

  // Gradiente dinámico según elemento dominante
  const elementGradients = {
    fuego: 'from-red-600/95 via-orange-600/95 to-yellow-500/95',
    tierra: 'from-green-700/95 via-emerald-600/95 to-teal-600/95',
    aire: 'from-cyan-600/95 via-blue-600/95 to-indigo-600/95',
    agua: 'from-blue-700/95 via-indigo-700/95 to-purple-700/95'
  };

  const elementGlow = {
    fuego: 'shadow-[0_0_60px_rgba(239,68,68,0.4)]',
    tierra: 'shadow-[0_0_60px_rgba(16,185,129,0.4)]',
    aire: 'shadow-[0_0_60px_rgba(59,130,246,0.4)]',
    agua: 'shadow-[0_0_60px_rgba(139,92,246,0.4)]'
  };

  const gradient = elementGradients[weather.dominantElement.element] || 'from-purple-600/90 via-indigo-600/90 to-violet-600/90';
  const glow = elementGlow[weather.dominantElement.element] || '';

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl backdrop-blur-md ${glow} transition-all duration-1000`}>
      {/* Campo de estrellas animado */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-[25%] right-[25%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-[30%] left-[35%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute top-[60%] right-[30%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] right-[15%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>
      
      {/* Efecto de brillo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      {/* HEADER COMPACTO */}
      <div className="relative z-10 flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-pulse">🌌</span>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white drop-shadow-lg tracking-wide">
              Cielo de Hoy
            </h2>
            <p className="text-xs text-white/90 capitalize font-medium hidden sm:block">
              {weather.date}
            </p>
          </div>
        </div>
        
        {/* BOTONES - Solo en desktop */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Compartir"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* VISTA RESPONSIVA */}
      <div className="relative z-10 space-y-3 sm:space-y-4">
        
        {/* MÓVIL: Mini tarjetas de Sol y Luna */}
        <div className="sm:hidden grid grid-cols-2 gap-2">
          {/* Sol */}
          <div className="bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-xl p-3 backdrop-blur-md border border-yellow-300/40 shadow-lg">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">☀️</span>
              <span className="text-xs font-extrabold text-yellow-100 tracking-wider">SOL</span>
            </div>
            <div className="text-base font-extrabold text-white drop-shadow-lg">
              {weather.sun?.sign}
            </div>
            <div className="text-sm font-bold text-white/90">
              {weather.sun?.degree.toFixed(0)}°
            </div>
            <div className="text-xs text-yellow-100/80 font-medium mt-1">
              {getSignElement(weather.sun?.sign).emoji} {getSignElement(weather.sun?.sign).element}
            </div>
          </div>

          {/* Luna */}
          <div className="bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-xl p-3 backdrop-blur-md border border-blue-300/40 shadow-lg">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]">🌙</span>
              <span className="text-xs font-extrabold text-blue-100 tracking-wider">LUNA</span>
            </div>
            <div className="text-base font-extrabold text-white drop-shadow-lg">
              {weather.moon?.sign}
            </div>
            <div className="text-sm font-bold text-white/90">
              {weather.moon?.degree.toFixed(0)}°
            </div>
            <div className="text-xs text-blue-100/80 font-medium mt-1">
              {weather.moonPhase.emoji} {weather.moonPhase.name}
            </div>
          </div>
        </div>

        {/* DESKTOP/TABLET: Vista Técnica con Datos */}
        <div className="hidden sm:grid grid-cols-2 gap-3">
          {/* Sol */}
          <div className="group bg-gradient-to-br from-yellow-400/30 to-orange-500/30 hover:from-yellow-400/40 hover:to-orange-500/40 rounded-2xl p-3 backdrop-blur-md border border-yellow-300/40 shadow-lg hover:shadow-yellow-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">☀️</span>
              <span className="text-sm font-extrabold text-yellow-100 tracking-wider">SOL</span>
            </div>
            <div className="text-lg font-extrabold text-white drop-shadow-lg">
              {weather.sun?.sign} {weather.sun?.degree.toFixed(0)}°
            </div>
            <div className="text-xs text-yellow-100/90 font-medium mt-1">
              {getSignElement(weather.sun?.sign).emoji} {getSignElement(weather.sun?.sign).element}
            </div>
          </div>

          {/* Luna */}
          <div className="group bg-gradient-to-br from-blue-400/30 to-purple-500/30 hover:from-blue-400/40 hover:to-purple-500/40 rounded-2xl p-3 backdrop-blur-md border border-blue-300/40 shadow-lg hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl drop-shadow-[0_0_10px_rgba(147,197,253,0.8)]">🌙</span>
              <span className="text-sm font-extrabold text-blue-100 tracking-wider">LUNA</span>
            </div>
            <div className="text-lg font-extrabold text-white drop-shadow-lg">
              {weather.moon?.sign} {weather.moon?.degree.toFixed(0)}°
            </div>
            <div className="text-xs text-blue-100/90 font-medium mt-1">
              {weather.moonPhase.emoji} {weather.moonPhase.name}
            </div>
          </div>
        </div>

        {/* RESUMEN PRINCIPAL - Visible siempre */}
        <div className="relative bg-gradient-to-r from-white/25 via-white/20 to-white/15 dark:from-white/20 dark:via-white/15 dark:to-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md border border-white/30 shadow-inner overflow-hidden">
          {/* Badge del elemento dominante */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-3xl sm:text-2xl drop-shadow-lg">{weather.dominantElement.emoji}</span>
            <div className="flex-1">
              <div className="text-[10px] sm:text-xs text-white/90 font-semibold uppercase tracking-wider">Elemento Dominante</div>
              <div className="text-base sm:text-base font-extrabold text-white capitalize">{weather.dominantElement.element} {weather.dominantElement.percentage}%</div>
            </div>
          </div>
          <p className="text-sm sm:text-sm text-white leading-relaxed font-medium">
            {weather.summary}
          </p>
        </div>
      </div>

      {/* ACORDEÓN - Detalles expandibles con más estilo */}
      <div className="relative z-10 mt-4 border-t border-white/30 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-white/90 transition-all duration-300 group hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-2">
            <span className="text-base sm:text-lg drop-shadow-lg">📊</span>
            <span className="tracking-wide text-sm sm:text-base">{isExpanded ? 'Ocultar' : 'Ver'} detalles</span>
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover:translate-y-[-3px] transition-transform drop-shadow-lg" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:translate-y-[3px] transition-transform drop-shadow-lg" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2 animate-slideDown">
            {/* PLANETAS PERSONALES */}
            <div className="bg-white/20 dark:bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/20 space-y-2">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                🌠 Planetas Personales
              </div>
              
              {/* Mercurio */}
              <div className="flex items-start gap-2">
                <span className="text-lg">☿️</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      Mercurio en {weather.mercury?.sign}
                    </span>
                    {weather.mercury?.retrograde && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/30 text-orange-200 rounded font-bold">℞ Retrógrado</span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">
                    {weather.mercury?.retrograde 
                      ? 'Comunicación y tecnología requieren revisión y paciencia' 
                      : 'Pensamientos, comunicación y aprendizaje fluyen en modo ' + weather.mercury?.sign}
                  </p>
                </div>
              </div>

              {/* Venus */}
              <div className="flex items-start gap-2">
                <span className="text-lg">♀️</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold text-white">Venus en {weather.venus?.sign}</span>
                  <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">
                    Amor, placer y valores expresados con el toque de {weather.venus?.sign}
                  </p>
                </div>
              </div>

              {/* Marte */}
              <div className="flex items-start gap-2">
                <span className="text-lg">♂️</span>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold text-white">Marte en {weather.mars?.sign}</span>
                  <p className="text-[10px] sm:text-xs text-white/80 mt-0.5">
                    Acción, deseo y energía con el impulso de {weather.mars?.sign}
                  </p>
                </div>
              </div>
            </div>

            {/* CONSEJO */}
            <div className="bg-yellow-400/20 dark:bg-yellow-500/15 rounded-xl p-2 backdrop-blur-sm border border-yellow-400/30">
              <div className="flex items-start gap-2">
                <span className="text-sm">✨</span>
                <div>
                  <div className="text-[10px] font-bold text-yellow-100 mb-0.5">CONSEJO</div>
                  <p className="text-[11px] sm:text-xs text-white/90 leading-snug">
                    {weather.advice}
                  </p>
                </div>
              </div>
            </div>

            {/* ASPECTOS PRINCIPALES - Estilo noticiero */}
            {weather.mainAspects.length > 0 && (
              <div className="bg-white/15 dark:bg-white/8 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-wider mb-2.5">
                  🔗 Aspectos del Día
                </div>
                <div className="space-y-2.5">
                  {weather.mainAspects.map((aspect, index) => {
                    const aspectDescriptions: Record<string, string> = {
                      'conjunción': 'fusionan energías',
                      'oposición': 'crean tensión creativa',
                      'trígono': 'fluyen con armonía',
                      'cuadratura': 'generan desafíos constructivos',
                      'sextil': 'abren oportunidades'
                    };
                    
                    return (
                      <div key={index} className="bg-white/10 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {aspect.planet1} {aspect.symbol || '•'} {aspect.planet2}
                          </span>
                          <span className="text-[10px] text-white/60">
                            (orbe {aspect.orb.toFixed(1)}°)
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-white/80">
                          {aspectDescriptions[aspect.type.toLowerCase()] || 'interactúan'} hoy
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TRANSPERSONALES - Contexto generacional */}
            <div className="bg-white/15 dark:bg-white/8 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-wider mb-2.5">
                🪐 Contexto Generacional
              </div>
              <p className="text-[10px] sm:text-xs text-white/70 mb-3 leading-relaxed">
                Planetas lentos que marcan tendencias de largo plazo
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-white/80">♃ Júpiter en {weather.jupiter?.sign}</span>
                  <span className="text-white/60">expansión</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-white/80">♄ Saturno en {weather.saturn?.sign}</span>
                  <span className="text-white/60">estructura</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-white/80">♅ Urano en {weather.uranus?.sign}</span>
                  <span className="text-white/60">revolución</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-white/80">♆ Neptuno en {weather.neptune?.sign}</span>
                  <span className="text-white/60">sueños colectivos</span>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-white/80">♇ Plutón en {weather.pluto?.sign}</span>
                  <span className="text-white/60">transformación</span>
                </div>
              </div>
            </div>

            {/* ELEMENTO DOMINANTE - Badge compacto */}
            <div className="bg-gradient-to-r from-white/20 to-white/10 rounded-xl p-2.5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-white/80 mb-0.5">
                    {weather.dominantElement.emoji} ELEMENTO
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white capitalize">
                    {weather.dominantElement.element}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {weather.dominantElement.percentage}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN - Móvil abajo, Desktop arriba */}
      <div className="relative z-10 mt-4 pt-3 border-t border-white/30 space-y-2">
        {/* Botón compartir móvil */}
        <div className="sm:hidden">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold text-white transition-all duration-300 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>

        {/* Link al Glosario */}
        <Link
          to="/glossary"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm sm:text-base font-bold text-white transition-all duration-300 group hover:scale-105 active:scale-95 shadow-lg hover:shadow-white/20 backdrop-blur-md border border-white/30"
        >
          <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform drop-shadow-lg" />
          <span className="tracking-wide hidden sm:inline">Saber más en el Glosario</span>
          <span className="tracking-wide sm:hidden">Glosario</span>
        </Link>
      </div>
    </div>
  );
}
