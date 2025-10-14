/**
 * ExercisePlanInsightsModal - Modal educativo que explica el plan generado
 * 
 * Características:
 * - Explica por qué se generó este plan específico
 * - Conecta ejercicios con aspectos de la carta natal
 * - Justifica los 21 días (ciencia + astrología)
 * - Muestra beneficios esperados
 * - Visualización de áreas de trabajo
 * - Timeline de progreso
 */

import { useMemo } from 'react';
import type { FC } from 'react';
import type { ExercisePlan } from '../services/exercises';

interface ExercisePlanInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ExercisePlan;
}

const ExercisePlanInsightsModal: FC<ExercisePlanInsightsModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  // Obtener análisis de la carta
  const { chartAnalysis } = plan;

  // Determinar color del plan según áreas prioritarias
  const planColor = useMemo(() => {
    if (plan.topAreas.some(area => area.toLowerCase().includes('luna'))) {
      return '#60A5FA'; // Azul luna
    }
    if (plan.topAreas.some(area => area.toLowerCase().includes('mercurio'))) {
      return '#FBBF24'; // Amarillo mercurio
    }
    if (plan.topAreas.some(area => area.toLowerCase().includes('marte'))) {
      return '#EF4444'; // Rojo marte
    }
    return '#A855F7'; // Púrpura default
  }, [plan.topAreas]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center pt-20 sm:pt-24 pb-4 px-2 sm:px-4 bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mb-4 animate-scaleIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll wrapper */}
        <div className="overflow-y-auto rounded-2xl max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-7rem)]">
          {/* Header - Optimizado para móviles */}
          <div
            className="sticky top-0 z-10 p-4 sm:p-6 md:p-8 rounded-t-2xl text-white"
            style={{
              background: `linear-gradient(135deg, ${planColor}ee, ${planColor}99)`,
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 transition-all shadow-lg hover:scale-110 active:scale-95 text-lg sm:text-xl font-bold touch-manipulation"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 block animate-bounce">🔮</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                Tu Plan Personalizado
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg">
                Diseñado específicamente para tu carta natal
              </p>
            </div>
          </div>

          {/* Content - Optimizado para móviles */}
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {/* Análisis de tu Carta - Optimizado para móviles */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📊</span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                  Análisis de tu Carta Natal
                </h3>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                {/* Luna estresada */}
                {chartAnalysis.moon && chartAnalysis.moon.stressScore > 5 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">🌙</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          Luna Estresada ({chartAnalysis.moon.stressScore}/10)
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                          Tu Luna está en <strong>{chartAnalysis.moon.sign}</strong> con aspectos tensos. 
                          Esto puede manifestarse como inestabilidad emocional.
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1 sm:mb-2">
                            🎵 Ejercicios:
                          </p>
                          <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-3 sm:ml-4">
                            <li>• Frecuencia 528 Hz</li>
                            <li>• Respiración 4-7-8</li>
                            <li>• Meditación lunar</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mercurio retrógrado */}
                {chartAnalysis.weakDignities.some(d => typeof d === 'object' && d.planet === 'Mercurio') && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">☿</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          Mercurio Retrógrado
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                          Mercurio retrógrado puede dificultar la comunicación clara.
                          Necesitás ejercicios que fortalezcan claridad mental.
                        </p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1 sm:mb-2">
                            🧠 Ejercicios:
                          </p>
                          <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-3 sm:ml-4">
                            <li>• Meditación de foco mental</li>
                            <li>• Journaling consciente</li>
                            <li>• Afirmaciones de claridad</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tensiones vs Armonías - Optimizado para móviles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-xl sm:text-2xl">⚡</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        Aspectos Tensos
                      </h4>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                      {chartAnalysis.tensionsCount}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                      Cuadraturas, oposiciones
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-xl sm:text-2xl">✨</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        Aspectos Armónicos
                      </h4>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                      {chartAnalysis.harmoniesCount}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                      Trígonos, sextiles
                    </p>
                  </div>
                </div>

                {/* Dignidades débiles - Optimizado para móviles */}
                {chartAnalysis.weakDignities.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-orange-500">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">⚠️</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          Planetas en Debilidad
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                          Estos planetas están en signos donde expresan su energía con dificultad:
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {chartAnalysis.weakDignities.map((item, i) => {
                            const planetName = typeof item === 'string' ? item : item.planet;
                            return (
                              <span
                                key={i}
                                className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {planetName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Por qué 21 días - Optimizado para móviles */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📅</span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                  ¿Por Qué 21 Días?
                </h3>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                  {/* Ciencia */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-2xl sm:text-3xl">🧬</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        Neuroplasticidad
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      La ciencia demuestra que <strong>21 días</strong> es el tiempo mínimo
                      necesario para que el cerebro empiece a consolidar nuevos patrones de comportamiento
                      y crear nuevas conexiones neuronales.
                    </p>
                  </div>

                  {/* Astrología */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <span className="text-2xl sm:text-3xl">🌕</span>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        Ciclo Lunar
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Tu carta está sincronizada con ciclos lunares. <strong>21 días</strong> representa
                      aproximadamente 3/4 de un ciclo lunar completo, período ideal para trabajar
                      transformaciones emocionales profundas.
                    </p>
                  </div>
                </div>

                {/* Fases progresivas - Optimizado para móviles */}
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-center mb-3 sm:mb-4 text-sm sm:text-base">
                    ⚡ Fases Progresivas
                  </h4>

                  <div className="flex items-start gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <span className="text-lg sm:text-2xl flex-shrink-0">1️⃣</span>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Días 1-7: Adaptación
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Ejercicios suaves para que tu cuerpo y mente se adapten sin resistencia.
                        Establecés la rutina y creás el hábito.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <span className="text-lg sm:text-2xl flex-shrink-0">2️⃣</span>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Días 8-14: Profundización
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Intensificamos la práctica. Tu sistema nervioso ya se adaptó y estás listo
                        para ejercicios más desafiantes que generan cambios reales.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <span className="text-lg sm:text-2xl flex-shrink-0">3️⃣</span>
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Días 15-21: Integración
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Consolidás todo lo aprendido. Los cambios se vuelven automáticos y parte
                        natural de tu día a día. El nuevo patrón está instalado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Beneficios Esperados - Optimizado para móviles */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">💎</span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                  Beneficios Esperados
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Emocional */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">💙</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      Emocional
                    </h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 text-sm">✓</span>
                      Mayor estabilidad emocional
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 text-sm">✓</span>
                      Menos reactividad ante situaciones estresantes
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 text-sm">✓</span>
                      Luna equilibrada y en paz
                    </li>
                  </ul>
                </div>

                {/* Mental */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">🧠</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      Mental
                    </h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 flex-shrink-0">✓</span>
                      Claridad de pensamiento
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 flex-shrink-0">✓</span>
                      Mejor comunicación (Mercurio armonizado)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 flex-shrink-0">✓</span>
                      Concentración mejorada
                    </li>
                  </ul>
                </div>

                {/* Energético */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">⚡</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      Energético
                    </h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-green-600 dark:text-green-400 flex-shrink-0 text-sm">✓</span>
                      Chakras balanceados y alineados
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-green-600 dark:text-green-400 flex-shrink-0 text-sm">✓</span>
                      Flujo de energía vital optimizado
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-green-600 dark:text-green-400 flex-shrink-0 text-sm">✓</span>
                      Vitalidad aumentada
                    </li>
                  </ul>
                </div>

                {/* Espiritual */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">🌟</span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                      Espiritual
                    </h4>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-purple-600 dark:text-purple-400 flex-shrink-0 text-sm">✓</span>
                      Conexión con tu propósito
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-purple-600 dark:text-purple-400 flex-shrink-0 text-sm">✓</span>
                      Alineación con tu diseño astrológico
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-purple-600 dark:text-purple-400 flex-shrink-0 text-sm">✓</span>
                      Mayor consciencia de ti mismo/a
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Timeline de Progreso - Optimizado para móviles */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📈</span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                  Tu Estrategia de 21 Días
                </h3>
              </div>

              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Fase 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Fase 1: Días 1-7
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {plan.phases.phase1.exercises.length} ejercicios
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-0 animate-grow" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  {/* Fase 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Fase 2: Días 8-14
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {plan.phases.phase2.exercises.length} ejercicios
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 w-0 animate-grow" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>

                  {/* Fase 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-900 dark:text-purple-300 text-sm sm:text-base">
                        Fase 3: Días 15-21
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {plan.phases.phase3.exercises.length} ejercicios
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-0 animate-grow" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Compromiso */}
                <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-5 text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                    Tu compromiso diario:
                  </p>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {plan.estimatedDailyMinutes} minutos
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Menos de lo que tardas en scrollear Instagram 📱
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Final - Optimizado para móviles */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl block mb-3 sm:mb-4">🚀</span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                ¿Listo para Transformar tu Energía?
              </h3>
              <p className="text-purple-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
                Este plan fue diseñado específicamente para <strong>tu configuración astrológica única</strong>.
                Cada ejercicio tiene un propósito y está alineado con tus necesidades energéticas.
              </p>
              <button
                onClick={onClose}
                className="bg-white text-purple-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base"
              >
                ✨ Comenzar mi Viaje
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePlanInsightsModal;

// Agregar animación de crecimiento para las barras de progreso
const style = document.createElement('style');
style.textContent = `
  @keyframes grow {
    from { width: 0%; }
    to { width: 100%; }
  }
  .animate-grow {
    animation: grow 1.5s ease-out forwards;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
