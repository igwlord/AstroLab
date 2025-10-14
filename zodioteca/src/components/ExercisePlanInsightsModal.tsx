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

import { useMemo, useEffect } from 'react';
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

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center bg-black/70 backdrop-blur-md animate-fadeIn overflow-y-auto pt-16 sm:pt-20 pb-4"
      onClick={onClose}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full mx-4 animate-scaleIn my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Compacto - NO sticky */}
        <div
          className="relative p-4 sm:p-6 rounded-t-xl text-white"
          style={{
            background: `linear-gradient(135deg, ${planColor}ee, ${planColor}99)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 transition-all shadow-lg hover:scale-110 active:scale-95 text-lg font-bold touch-manipulation"
            aria-label="Cerrar modal"
          >
            ✕
          </button>

          <div className="text-center">
            <span className="text-3xl sm:text-4xl mb-2 block">🔮</span>
            <h2 className="text-lg sm:text-xl font-bold mb-1">
              Tu Plan Personalizado
            </h2>
            <p className="text-white/90 text-xs sm:text-sm">
              Diseñado específicamente para tu carta natal
            </p>
          </div>
        </div>

        {/* Content - Optimizado y compacto */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tu Configuración Astrológica - COMPACTA */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <h3 className="text-base sm:text-lg font-bold text-purple-900 dark:text-white">
                Tu Configuración Astrológica
              </h3>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Elementos Dominantes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm flex items-center gap-2">
                    🔥 Elementos
                  </h4>
                    <div className="space-y-2">
                      {Object.entries(chartAnalysis.dominances.elements)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .map(([element, count]) => (
                          <div key={element} className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {element === 'fire' ? '🔥 Fuego' :
                               element === 'earth' ? '🌍 Tierra' :
                               element === 'air' ? '💨 Aire' :
                               '💧 Agua'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    element === 'fire' ? 'bg-red-500' :
                                    element === 'earth' ? 'bg-green-500' :
                                    element === 'air' ? 'bg-blue-500' :
                                    'bg-cyan-500'
                                  }`}
                                  style={{ width: `${((count as number) / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white w-6 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
                      {Object.entries(chartAnalysis.dominances.elements)
                        .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] === 'fire' ? 
                        '🔥 Predominancia de Fuego: Pasión, acción, impulsividad. Los ejercicios te ayudarán a canalizar esta energía.' :
                        Object.entries(chartAnalysis.dominances.elements)
                        .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] === 'earth' ?
                        '🌍 Predominancia de Tierra: Practicidad, estabilidad, materialismo. Los ejercicios te conectarán con lo sutil.' :
                        Object.entries(chartAnalysis.dominances.elements)
                        .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] === 'air' ?
                        '💨 Predominancia de Aire: Mentalidad, comunicación, ideas. Los ejercicios te anclarán al cuerpo.' :
                        '💧 Predominancia de Agua: Emoción, intuición, sensibilidad. Los ejercicios te darán estructura.'}
                    </p>
                  </div>

                {/* Modalidades Dominantes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm flex items-center gap-2">
                    🎭 Modalidades
                  </h4>
                    <div className="space-y-2">
                      {Object.entries(chartAnalysis.dominances.modalities)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .map(([modality, count]) => (
                          <div key={modality} className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {modality === 'cardinal' ? '⚡ Cardinal' :
                               modality === 'fixed' ? '🔒 Fijo' :
                               '🔄 Mutable'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-full rounded-full ${
                                    modality === 'cardinal' ? 'bg-purple-500' :
                                    modality === 'fixed' ? 'bg-orange-500' :
                                    'bg-teal-500'
                                  }`}
                                  style={{ width: `${((count as number) / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white w-6 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
                      {Object.entries(chartAnalysis.dominances.modalities)
                        .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] === 'cardinal' ?
                        '⚡ Predominancia Cardinal: Inicias pero no terminas. Los ejercicios te darán constancia.' :
                        Object.entries(chartAnalysis.dominances.modalities)
                        .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] === 'fixed' ?
                        '🔒 Predominancia Fija: Resistente al cambio. Los ejercicios te darán flexibilidad.' :
                        '🔄 Predominancia Mutable: Disperso y versátil. Los ejercicios te darán enfoque.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

          {/* Análisis de Planetas - COMPACTO */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📊</span>
              <h3 className="text-base sm:text-lg font-bold text-purple-900 dark:text-white">
                Análisis de Planetas
              </h3>
            </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                
                {/* SIEMPRE mostrar análisis de la Luna - MEJORADO */}
                {chartAnalysis.moon && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">🌙</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          Tu Luna en {chartAnalysis.moon.sign} - Casa {chartAnalysis.moon.house}
                        </h4>
                        
                        {/* Nivel de Estrés */}
                        <div className="mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Nivel de Estrés:
                            </span>
                            <span className={`text-sm sm:text-base font-bold ${
                              chartAnalysis.moon.stressScore >= 7 ? 'text-red-600 dark:text-red-400' :
                              chartAnalysis.moon.stressScore >= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-green-600 dark:text-green-400'
                            }`}>
                              {chartAnalysis.moon.stressScore.toFixed(1)}/10
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                chartAnalysis.moon.stressScore >= 7 ? 'bg-red-500' :
                                chartAnalysis.moon.stressScore >= 4 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(chartAnalysis.moon.stressScore / 10) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Dignidad */}
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Dignidad:</strong> {chartAnalysis.moon.dignity.type === 'domicile' ? '🏠 Domicilio (fuerte)' :
                           chartAnalysis.moon.dignity.type === 'exaltation' ? '⭐ Exaltación (muy fuerte)' :
                           chartAnalysis.moon.dignity.type === 'detriment' ? '⚠️ Detrimento (debilitada)' :
                           chartAnalysis.moon.dignity.type === 'fall' ? '⚡ Caída (desafiante)' :
                           '➖ Neutra'}
                        </p>

                        {/* Aspectos */}
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                          <strong>Aspectos:</strong> {chartAnalysis.moon.hardAspects} tensos, {chartAnalysis.moon.softAspects} armónicos
                          {chartAnalysis.moon.hardAspects > 2 && ' - Alta tensión emocional ⚡'}
                          {chartAnalysis.moon.softAspects > 2 && ' - Buen soporte emocional ✨'}
                        </p>
                        
                        {/* Interpretación personalizada */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 sm:p-3">
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {chartAnalysis.moon.stressScore >= 5 ? 
                              `Tu Luna necesita atención especial. Los ${chartAnalysis.moon.hardAspects} aspectos tensos pueden causar inestabilidad emocional.` :
                              chartAnalysis.moon.stressScore >= 3 ?
                              `Tu Luna está moderadamente equilibrada, pero puede mejorar con práctica consciente.` :
                              `Tu Luna está relativamente estable, los ejercicios te ayudarán a potenciar esta fortaleza.`
                            }
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1 sm:mb-2">
                            🎵 Ejercicios recomendados:
                          </p>
                          <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-3 sm:ml-4">
                            <li>• Frecuencia 528 Hz para armonía emocional</li>
                            <li>• Respiración 4-7-8 para calmar ansiedad</li>
                            <li>• Meditación lunar para conectar con tus emociones</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mercurio - SIEMPRE mostrar si existe */}
                {chartAnalysis.mercury && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">☿</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          Tu Mercurio en {chartAnalysis.mercury.sign} - Casa {chartAnalysis.mercury.house}
                          {chartAnalysis.mercury.retrograde && ' ⚠️ RETRÓGRADO'}
                        </h4>
                        
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Dignidad:</strong> {chartAnalysis.mercury.dignity.type === 'domicile' ? '🏠 Domicilio (fuerte)' :
                           chartAnalysis.mercury.dignity.type === 'exaltation' ? '⭐ Exaltación (muy fuerte)' :
                           chartAnalysis.mercury.dignity.type === 'detriment' ? '⚠️ Detrimento (debilitada)' :
                           chartAnalysis.mercury.dignity.type === 'fall' ? '⚡ Caída (desafiante)' :
                           '➖ Neutra'}
                        </p>

                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
                          {chartAnalysis.mercury.retrograde ?
                            'Mercurio retrógrado puede dificultar la comunicación clara y generar pensamientos dispersos.' :
                            'Mercurio directo favorece la claridad mental y la comunicación fluida.'}
                          {chartAnalysis.mercury.dignity.type === 'detriment' || chartAnalysis.mercury.dignity.type === 'fall' ?
                            ' Además, está en dignidad débil, necesitando apoyo extra.' : ''}
                        </p>
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 sm:p-3">
                          <p className="text-xs sm:text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1 sm:mb-2">
                            🧠 Ejercicios recomendados:
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

                {/* Mercurio retrógrado (mantener para backward compatibility) */}
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

            {/* Por Qué ESTOS Ejercicios - NUEVA SECCIÓN ULTRA-PERSONALIZADA */}
            <section>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🎯</span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 dark:text-white">
                  Por Qué Estos Ejercicios Específicos
                </h3>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 text-center font-semibold">
                  Cada ejercicio fue seleccionado analizando tu configuración astrológica única. Aquí está el porqué:
                </p>

                <div className="space-y-3">
                  {/* Razón basada en Luna */}
                  {chartAnalysis.moon && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                      <div className="flex items-start gap-2">
                        <span className="text-xl sm:text-2xl">🌙</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                            Basado en tu Luna
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Tu Luna en <strong>{chartAnalysis.moon.sign}</strong> con <strong>{chartAnalysis.moon.hardAspects} aspectos tensos</strong> y 
                            nivel de estrés de <strong>{chartAnalysis.moon.stressScore.toFixed(1)}/10</strong> requiere:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-4">
                            {chartAnalysis.moon.stressScore >= 5 && (
                              <>
                                <li>• <strong>Frecuencias curativas</strong> (528 Hz, 432 Hz) para calmar la hiperactividad emocional</li>
                                <li>• <strong>Respiración consciente</strong> (4-7-8) para activar el sistema nervioso parasimpático</li>
                                <li>• <strong>Meditación lunar</strong> para conectar con tus emociones sin juzgarlas</li>
                              </>
                            )}
                            {chartAnalysis.moon.stressScore < 5 && chartAnalysis.moon.stressScore >= 3 && (
                              <>
                                <li>• <strong>Meditación guiada</strong> para profundizar en tu estabilidad emocional</li>
                                <li>• <strong>Journaling lunar</strong> para explorar patrones emocionales</li>
                              </>
                            )}
                            {chartAnalysis.moon.stressScore < 3 && (
                              <>
                                <li>• <strong>Ejercicios de potenciación</strong> para maximizar tu fortaleza emocional natural</li>
                                <li>• <strong>Ritual lunar</strong> para honrar tu conexión con las emociones</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razón basada en Mercurio */}
                  {chartAnalysis.mercury && (chartAnalysis.mercury.retrograde || 
                   chartAnalysis.mercury.dignity.type === 'detriment' || 
                   chartAnalysis.mercury.dignity.type === 'fall') && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                      <div className="flex items-start gap-2">
                        <span className="text-xl sm:text-2xl">☿</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                            Basado en tu Mercurio
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Tu Mercurio en <strong>{chartAnalysis.mercury.sign}</strong>
                            {chartAnalysis.mercury.retrograde && ' (retrógrado)'}
                            {(chartAnalysis.mercury.dignity.type === 'detriment' || chartAnalysis.mercury.dignity.type === 'fall') && 
                             ' en dignidad débil'} necesita:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-4">
                            <li>• <strong>Meditación de claridad mental</strong> para estructurar pensamientos dispersos</li>
                            <li>• <strong>Journaling consciente</strong> para ordenar ideas y mejorar comunicación</li>
                            <li>• <strong>Afirmaciones de claridad</strong> para reprogramar patrones mentales</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razón basada en tensiones totales */}
                  {chartAnalysis.tensionsCount >= 5 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                      <div className="flex items-start gap-2">
                        <span className="text-xl sm:text-2xl">⚡</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                            Basado en tus aspectos tensos
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Tienes <strong>{chartAnalysis.tensionsCount} aspectos tensos</strong> (cuadraturas, oposiciones) que indican:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-4">
                            <li>• <strong>Alta activación del sistema nervioso</strong> → necesitas ejercicios de relajación profunda</li>
                            <li>• <strong>Conflictos internos</strong> → incluimos técnicas de integración de polaridades</li>
                            <li>• <strong>Tensión energética</strong> → yoga, chi kung y movimiento consciente para liberar bloqueos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razón basada en elementos */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-purple-500">
                    <div className="flex items-start gap-2">
                      <span className="text-xl sm:text-2xl">🔥</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                          Basado en tu balance elemental
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {(() => {
                            const dominantElement = Object.entries(chartAnalysis.dominances.elements)
                              .sort(([, a], [, b]) => (b as number) - (a as number))[0];
                            const [element, count] = dominantElement;
                            
                            return `Tienes ${count} planetas en ${
                              element === 'fire' ? 'Fuego 🔥' :
                              element === 'earth' ? 'Tierra 🌍' :
                              element === 'air' ? 'Aire 💨' :
                              'Agua 💧'
                            }, lo que significa ${
                              element === 'fire' ? 'mucha energía yang que necesita ser canalizada' :
                              element === 'earth' ? 'tendencia a lo práctico, necesitas conexión con lo sutil' :
                              element === 'air' ? 'exceso mental, necesitas anclarte al cuerpo' :
                              'alta sensibilidad, necesitas estructura y límites'
                            }.`;
                          })()}
                        </p>
                        <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-4">
                          {(() => {
                            const dominantElement = Object.entries(chartAnalysis.dominances.elements)
                              .sort(([, a], [, b]) => (b as number) - (a as number))[0][0];
                            
                            if (dominantElement === 'fire') {
                              return (
                                <>
                                  <li>• Incluimos ejercicios de <strong>enraizamiento</strong> (tierra) para bajar energía</li>
                                  <li>• Prácticas de <strong>agua</strong> (emocional) para suavizar impulsividad</li>
                                </>
                              );
                            } else if (dominantElement === 'earth') {
                              return (
                                <>
                                  <li>• Incluimos ejercicios de <strong>aire</strong> (respiración) para ligereza</li>
                                  <li>• Prácticas de <strong>fuego</strong> (movimiento) para activar energía vital</li>
                                </>
                              );
                            } else if (dominantElement === 'air') {
                              return (
                                <>
                                  <li>• Incluimos ejercicios de <strong>tierra</strong> (enraizamiento) para anclaje</li>
                                  <li>• Prácticas de <strong>agua</strong> (sentir) para salir de la mente</li>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <li>• Incluimos ejercicios de <strong>fuego</strong> (acción) para no perderte en emociones</li>
                                  <li>• Prácticas de <strong>tierra</strong> (estructura) para contener sensibilidad</li>
                                </>
                              );
                            }
                          })()}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Stelliums */}
                  {chartAnalysis.stelliumHouses.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border-l-4 border-indigo-500">
                      <div className="flex items-start gap-2">
                        <span className="text-xl sm:text-2xl">🏠</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                            Basado en tu Stellium
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Tienes un stellium (concentración de 3+ planetas) en la(s) casa(s) <strong>{chartAnalysis.stelliumHouses.join(', ')}</strong>,
                            lo que indica exceso de energía en esa área de vida. Los ejercicios te ayudarán a:
                          </p>
                          <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 ml-4">
                            <li>• <strong>Redistribuir energía</strong> hacia otras áreas de tu vida</li>
                            <li>• <strong>Balancear la obsesión</strong> con temas relacionados a esa casa</li>
                            <li>• <strong>Integrar la intensidad</strong> de manera armoniosa</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

          {/* Por qué 21 días - COMPACTO */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📅</span>
              <h3 className="text-base sm:text-lg font-bold text-purple-900 dark:text-white">
                Tu Plan de 21 Días
              </h3>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-2xl mb-1">1️⃣</div>
                  <div className="text-xs font-semibold text-purple-900 dark:text-purple-300">Días 1-7</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Adaptación</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">2️⃣</div>
                  <div className="text-xs font-semibold text-purple-900 dark:text-purple-300">Días 8-14</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Profundización</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">3️⃣</div>
                  <div className="text-xs font-semibold text-purple-900 dark:text-purple-300">Días 15-21</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Integración</div>
                </div>
              </div>
              
              <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tu compromiso diario:</p>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {plan.estimatedDailyMinutes} min
                </div>
              </div>
            </div>
          </section>



        </div>

        {/* Footer CTA - Compacto */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-b-xl text-white text-center">
          <button
            onClick={onClose}
            className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation text-sm"
          >
            ✨ Comenzar mi Viaje
          </button>
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
