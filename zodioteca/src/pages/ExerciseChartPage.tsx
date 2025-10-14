/**
 * PÁGINA: TU CARTA NATAL ANALIZADA (Ejercicios)
 * 
 * VERSIÓN HOLÍSTICA COMPLETA - Análisis profundo integrando:
 * - Elementos, Modalidades, Dignidades
 * - Aspectos tensos y armónicos DETALLADOS
 * - Stelliums y concentraciones de energía
 * - Quirón (herida sanadora) y Lilith (sombra)
 * - Nodo Norte (propósito evolutivo)
 * - Polarizaciones y desbalances
 * 
 * Lenguaje: Terapéutico, educativo, para usuarios normales
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercisePlanStore } from '../store/useExercisePlanStore';

export default function ExerciseChartPage() {
  const navigate = useNavigate();
  const { currentPlan: plan } = useExercisePlanStore();

  // Si no hay plan, redirigir a ejercicios
  useEffect(() => {
    if (!plan) {
      navigate('/ejercicios');
    }
  }, [plan, navigate]);

  if (!plan) return null;

  const { chartAnalysis } = plan;
  
  // 🌍 TRADUCCIÓN: Planetas y signos al español
  const translatePlanet = (planet: string): string => {
    const translations: Record<string, string> = {
      'Sun': 'Sol',
      'Moon': 'Luna',
      'Mercury': 'Mercurio',
      'Venus': 'Venus',
      'Mars': 'Marte',
      'Jupiter': 'Júpiter',
      'Saturn': 'Saturno',
      'Uranus': 'Urano',
      'Neptune': 'Neptuno',
      'Pluto': 'Plutón',
      'Chiron': 'Quirón',
      'Node': 'Nodo',
      'Lilith': 'Lilith'
    };
    return translations[planet] || planet;
  };

  const translateSign = (sign: string): string => {
    const translations: Record<string, string> = {
      'Aries': 'Aries',
      'Taurus': 'Tauro',
      'Gemini': 'Géminis',
      'Cancer': 'Cáncer',
      'Leo': 'Leo',
      'Virgo': 'Virgo',
      'Libra': 'Libra',
      'Scorpio': 'Escorpio',
      'Sagittarius': 'Sagitario',
      'Capricorn': 'Capricornio',
      'Aquarius': 'Acuario',
      'Pisces': 'Piscis'
    };
    return translations[sign] || sign;
  };
  
  // Helper functions para interpretación
  const getElementInterpretation = (element: string, count: number) => {
    const interpretations: Record<string, { description: string; work: string }> = {
      fire: {
        description: `Tienes ${count} planetas en Fuego 🔥. Tu naturaleza es apasionada, directa y orientada a la acción. Necesitas movimiento constante.`,
        work: 'Los ejercicios te ayudarán a canalizar esta energía sin quemarte ni dispersarte. Aprenderás a dirigir tu fuego interior hacia metas concretas.'
      },
      earth: {
        description: `Tienes ${count} planetas en Tierra 🌍. Tu naturaleza es práctica, estable y orientada a lo tangible. Valoras la seguridad.`,
        work: 'Los ejercicios te conectarán con tu cuerpo y lo sutil, permitiéndote integrar tu mundo material con tu mundo emocional y espiritual.'
      },
      air: {
        description: `Tienes ${count} planetas en Aire 💨. Tu naturaleza es mental, comunicativa y conceptual. Vives en el mundo de las ideas.`,
        work: 'Los ejercicios te anclarán al cuerpo y las emociones, ayudándote a bajar de la cabeza al corazón y sentir tu experiencia directa.'
      },
      water: {
        description: `Tienes ${count} planetas en Agua 💧. Tu naturaleza es emocional, intuitiva y receptiva. Sientes todo profundamente.`,
        work: 'Los ejercicios te darán estructura y límites saludables, permitiéndote navegar tus emociones sin perderte en ellas.'
      }
    };
    return interpretations[element] || { description: '', work: '' };
  };

  const getModalityInterpretation = (modality: string, count: number) => {
    const interpretations: Record<string, { description: string; work: string }> = {
      cardinal: {
        description: `Tienes ${count} planetas en modalidad Cardinal ⚡. Inicias cosas fácilmente pero te cuesta sostenerlas en el tiempo.`,
        work: 'Los ejercicios trabajarán tu constancia y paciencia. Aprenderás a completar lo que empiezas y a cultivar disciplina amorosa.'
      },
      fixed: {
        description: `Tienes ${count} planetas en modalidad Fija 🔒. Eres determinado y persistente, pero resistente al cambio.`,
        work: 'Los ejercicios te darán flexibilidad y adaptabilidad. Aprenderás a soltar el control y fluir con los cambios de la vida.'
      },
      mutable: {
        description: `Tienes ${count} planetas en modalidad Mutable 🔄. Eres adaptable y versátil, pero tiendes a dispersarte.`,
        work: 'Los ejercicios te darán enfoque y dirección. Aprenderás a centrarte y a llevar tus múltiples intereses a buen puerto.'
      }
    };
    return interpretations[modality] || { description: '', work: '' };
  };

  const getDignityExplanation = (type: string) => {
    const explanations: Record<string, { icon: string; title: string; description: string }> = {
      domicile: {
        icon: '🏠',
        title: 'Domicilio',
        description: 'El planeta está en su casa. Se expresa con naturalidad, fluidez y autenticidad. Es un talento innato.'
      },
      exaltation: {
        icon: '⭐',
        title: 'Exaltación',
        description: 'El planeta brilla con fuerza especial. Alcanza su máximo potencial y se manifiesta de forma excelsa.'
      },
      detriment: {
        icon: '⚠️',
        title: 'Detrimento',
        description: 'El planeta está en territorio hostil. Le cuesta expresarse y requiere esfuerzo consciente para funcionar bien.'
      },
      fall: {
        icon: '⚡',
        title: 'Caída',
        description: 'El planeta está en su punto más débil. Se manifiesta de forma distorsionada y necesita mucho trabajo interior.'
      },
      neutral: {
        icon: '➖',
        title: 'Neutra',
        description: 'El planeta funciona de forma estándar, sin ventajas ni desventajas especiales.'
      }
    };
    return explanations[type] || explanations.neutral;
  };

  // Determinar color del plan según áreas prioritarias
  const planColor = plan.topAreas.some(area => area.toLowerCase().includes('luna'))
    ? '#60A5FA'
    : plan.topAreas.some(area => area.toLowerCase().includes('mercurio'))
    ? '#FBBF24'
    : plan.topAreas.some(area => area.toLowerCase().includes('marte'))
    ? '#EF4444'
    : '#A855F7';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - Optimizado para móvil */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/ejercicios')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-xs sm:text-sm mb-3 sm:mb-4 font-medium"
          >
            ← Volver a Ejercicios
          </button>

          <div
            className="rounded-lg sm:rounded-xl p-4 sm:p-6 text-white mb-4 sm:mb-6"
            style={{
              background: `linear-gradient(135deg, ${planColor}ee, ${planColor}99)`,
            }}
          >
            <div className="text-center">
              <span className="text-3xl sm:text-4xl mb-2 block">🔮</span>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">
                Tu Carta Natal Analizada
              </h1>
              <p className="text-white/90 text-xs sm:text-sm">
                Configuración astrológica única de tu plan
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* 1. CONFIGURACIÓN ELEMENTAL Y MODAL - Optimizado móvil */}
          <section className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">⭐</span>
              <h2 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white">
                Tu Configuración Base
              </h2>
            </div>

            {/* Interpretación Holística Elementos - Móvil optimizado */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-2 text-sm sm:text-base">🔥 Tu Balance Elemental</h3>
              {(() => {
                const sortedElements = Object.entries(chartAnalysis.dominances.elements)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const [dominantEl, domCount] = sortedElements[0];
                const interpretation = getElementInterpretation(dominantEl, domCount as number);
                
                return (
                  <>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {interpretation.description}
                    </p>
                    <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium leading-relaxed">
                      💡 {interpretation.work}
                    </p>
                  </>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Elementos */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-2">
                  🔥 Elementos
                </h3>
                <div className="space-y-2">
                  {Object.entries(chartAnalysis.dominances.elements)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([element, count]) => (
                      <div key={element} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {element === 'fire' ? '🔥 Fuego' :
                           element === 'earth' ? '🌍 Tierra' :
                           element === 'air' ? '💨 Aire' :
                           '💧 Agua'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                          <span className="text-xs font-bold text-gray-900 dark:text-white w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Modalidades */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-2">
                  🎭 Modalidades
                </h3>
                <div className="space-y-2">
                  {Object.entries(chartAnalysis.dominances.modalities)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([modality, count]) => (
                      <div key={modality} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {modality === 'cardinal' ? '⚡ Cardinal' :
                           modality === 'fixed' ? '🔒 Fijo' :
                           '🔄 Mutable'}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full ${
                                modality === 'cardinal' ? 'bg-purple-500' :
                                modality === 'fixed' ? 'bg-orange-500' :
                                'bg-teal-500'
                              }`}
                              style={{ width: `${((count as number) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-900 dark:text-white w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Interpretación Holística Modalidades */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border-l-4 border-pink-500">
              <h3 className="font-bold text-pink-900 dark:text-pink-100 mb-2 text-sm sm:text-base">🎭 Tu Estilo de Acción</h3>
              {(() => {
                const sortedModalities = Object.entries(chartAnalysis.dominances.modalities)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const [dominantMod, modCount] = sortedModalities[0];
                const interpretation = getModalityInterpretation(dominantMod, modCount as number);
                
                return (
                  <>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {interpretation.description}
                    </p>
                    <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                      💡 {interpretation.work}
                    </p>
                  </>
                );
              })()}
            </div>
          </section>

          {/* Análisis de Planetas */}
          <section className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl">📊</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Análisis de Planetas
              </h2>
            </div>

            <div className="space-y-4">
              {/* Luna - SIEMPRE visible */}
              {chartAnalysis.moon && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl">🌙</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                        Tu Luna en {chartAnalysis.moon.sign} - Casa {chartAnalysis.moon.house}
                      </h3>
                      
                      {/* Nivel de Estrés */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Nivel de Estrés:
                          </span>
                          <span className={`text-sm font-bold ${
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

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Dignidad:</strong> {chartAnalysis.moon.dignity.type === 'domicile' ? '🏠 Domicilio' :
                         chartAnalysis.moon.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                         chartAnalysis.moon.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                         chartAnalysis.moon.dignity.type === 'fall' ? '⚡ Caída' :
                         '➖ Neutra'}
                      </p>

                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Aspectos:</strong> {chartAnalysis.moon.hardAspects} tensos, {chartAnalysis.moon.softAspects} armónicos
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mercurio */}
              {chartAnalysis.mercury && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">☿</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                        Tu Mercurio en {chartAnalysis.mercury.sign} - Casa {chartAnalysis.mercury.house}
                        {chartAnalysis.mercury.retrograde && ' ⚠️ RETRÓGRADO'}
                      </h3>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Dignidad:</strong> {chartAnalysis.mercury.dignity.type === 'domicile' ? '🏠 Domicilio' :
                         chartAnalysis.mercury.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                         chartAnalysis.mercury.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                         chartAnalysis.mercury.dignity.type === 'fall' ? '⚡ Caída' :
                         '➖ Neutra'}
                      </p>

                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {chartAnalysis.mercury.retrograde ?
                          'Mercurio retrógrado puede dificultar la comunicación clara.' :
                          'Mercurio directo favorece la claridad mental.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Aspectos Totales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {chartAnalysis.tensionsCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ⚡ Aspectos Tensos
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2">
                    Cuadraturas y oposiciones. Áreas de fricción que generan crecimiento.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {chartAnalysis.harmoniesCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ✨ Aspectos Armónicos
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2">
                    Trígonos y sextiles. Talentos naturales y flujo fácil.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. DIGNIDADES PLANETARIAS */}
          <section className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">👑</span>
              <h2 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white">
                Dignidades Planetarias
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Las dignidades planetarias revelan qué planetas funcionan con facilidad (talentos innatos) y cuáles requieren trabajo consciente (áreas de crecimiento).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Planetas Fuertes */}
              {chartAnalysis.strongDignities.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-yellow-500">
                  <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                    ⭐ Planetas en Dignidad Fuerte
                  </h3>
                  {chartAnalysis.strongDignities.map((d, idx) => {
                    const dignityInfo = getDignityExplanation(d.dignity.type);
                    return (
                      <div key={idx} className="mb-3 last:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{dignityInfo.icon}</span>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {translatePlanet(d.planet)} en {translateSign(d.sign)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 ml-7">
                          <strong>{dignityInfo.title}:</strong> {dignityInfo.description}
                        </p>
                      </div>
                    );
                  })}
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-3 italic">
                    💫 Estas son tus fortalezas naturales. Úsalas conscientemente.
                  </p>
                </div>
              )}

              {/* Planetas Débiles */}
              {chartAnalysis.weakDignities.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                    ⚠️ Planetas en Dignidad Débil
                  </h3>
                  {chartAnalysis.weakDignities.map((d, idx) => {
                    const dignityInfo = getDignityExplanation(d.dignity.type);
                    return (
                      <div key={idx} className="mb-3 last:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{dignityInfo.icon}</span>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {translatePlanet(d.planet)} en {translateSign(d.sign)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 ml-7">
                          <strong>{dignityInfo.title}:</strong> {dignityInfo.description}
                        </p>
                      </div>
                    );
                  })}
                  <p className="text-xs text-red-700 dark:text-red-300 mt-3 italic">
                    🎯 Estos planetas son tu trabajo interior. Los ejercicios te ayudarán aquí.
                  </p>
                </div>
              )}

              {/* Si no hay dignidades especiales */}
              {chartAnalysis.strongDignities.length === 0 && chartAnalysis.weakDignities.length === 0 && (
                <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                  Todos tus planetas están en dignidad neutra. Funcionan de forma estándar.
                </div>
              )}
            </div>
          </section>

          {/* 3. STELLIUMS Y CONCENTRACIONES */}
          {chartAnalysis.stelliumHouses.length > 0 && (
            <section className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🌟</span>
                <h2 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white">
                  Stelliums - Concentraciones de Energía
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Un <strong>stellium</strong> ocurre cuando 3 o más planetas se concentran en la misma casa. Esto indica un área de vida de <strong>importancia crucial</strong> para ti.
              </p>

              <div className="space-y-3">
                {chartAnalysis.stelliumHouses.map((house, idx) => {
                  const houseThemes: Record<number, { title: string; description: string; icon: string }> = {
                    1: { title: 'Identidad y Personalidad', description: 'Tu vida gira en torno a descubrir quién eres. La autenticidad y la expresión personal son tu misión.', icon: '👤' },
                    2: { title: 'Recursos y Valores', description: 'Tu vida gira en torno a construir seguridad material y descubrir tu verdadero valor.', icon: '💰' },
                    3: { title: 'Comunicación y Aprendizaje', description: 'Tu vida gira en torno a aprender, enseñar, comunicar y conectar con tu entorno inmediato.', icon: '📚' },
                    4: { title: 'Hogar y Raíces', description: 'Tu vida gira en torno a la familia, el hogar, las raíces emocionales y el sentido de pertenencia.', icon: '🏠' },
                    5: { title: 'Creatividad y Romance', description: 'Tu vida gira en torno a la autoexpresión creativa, el romance, el juego y la alegría.', icon: '🎨' },
                    6: { title: 'Servicio y Salud', description: 'Tu vida gira en torno al servicio, la salud, las rutinas y el perfeccionamiento de habilidades.', icon: '⚕️' },
                    7: { title: 'Relaciones y Asociaciones', description: 'Tu vida gira en torno a las relaciones de pareja, las asociaciones y el otro como espejo.', icon: '💑' },
                    8: { title: 'Transformación y Profundidad', description: 'Tu vida gira en torno a la transformación profunda, la muerte/renacimiento, lo oculto y la intimidad.', icon: '🔮' },
                    9: { title: 'Filosofía y Expansión', description: 'Tu vida gira en torno a la búsqueda de sentido, los viajes, la filosofía y la expansión mental.', icon: '🌍' },
                    10: { title: 'Carrera y Vocación', description: 'Tu vida gira en torno a tu vocación pública, tu contribución al mundo y tu legado.', icon: '🎯' },
                    11: { title: 'Comunidad y Visión', description: 'Tu vida gira en torno a la comunidad, las amistades, los grupos y tu visión de futuro.', icon: '👥' },
                    12: { title: 'Espiritualidad y Trascendencia', description: 'Tu vida gira en torno al mundo interior, la espiritualidad, el servicio desinteresado y la disolución del ego.', icon: '🕉️' }
                  };
                  const theme = houseThemes[house] || { title: `Casa ${house}`, description: 'Área de concentración importante.', icon: '⭐' };
                  
                  return (
                    <div key={idx} className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-violet-500">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{theme.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            Stellium en Casa {house}: {theme.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                            {theme.description}
                          </p>
                          <p className="text-xs text-violet-700 dark:text-violet-300 italic">
                            💡 Esta área requiere mucha atención y energía. Los ejercicios te ayudarán a integrar esta intensidad.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. POLARIZACIONES Y DESBALANCES */}
          <section className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">⚖️</span>
              <h2 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white">
                Polarizaciones y Desbalances
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Los desbalances elementales y modales revelan áreas donde necesitas trabajar para lograr mayor equilibrio interior.
            </p>

            <div className="space-y-4">
              {/* Desbalance Elemental */}
              {(() => {
                const sortedElements = Object.entries(chartAnalysis.dominances.elements)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const [highest, highCount] = sortedElements[0];
                const [lowest, lowCount] = sortedElements[sortedElements.length - 1];
                
                if ((highCount as number) - (lowCount as number) >= 3) {
                  const elementNames: Record<string, string> = { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua' };
                  return (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-orange-500">
                      <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-2">
                        🔥 Polarización Elemental Detectada
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        Tienes exceso de <strong>{elementNames[highest]}</strong> ({highCount}) y carencia de <strong>{elementNames[lowest]}</strong> ({lowCount}).
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        💡 <strong>Trabajo:</strong> {
                          lowest === 'fire' ? 'Necesitas activar tu iniciativa, pasión y valentía.' :
                          lowest === 'earth' ? 'Necesitas anclarte, crear estructura y conectar con tu cuerpo.' :
                          lowest === 'air' ? 'Necesitas claridad mental, comunicación y perspectiva objetiva.' :
                          'Necesitas conectar con tus emociones, intuición y mundo interior.'
                        }
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Desbalance Modal */}
              {(() => {
                const sortedModalities = Object.entries(chartAnalysis.dominances.modalities)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const [highest, highCount] = sortedModalities[0];
                const [lowest, lowCount] = sortedModalities[sortedModalities.length - 1];
                
                if ((highCount as number) - (lowCount as number) >= 3) {
                  const modalityNames: Record<string, string> = { cardinal: 'Cardinal', fixed: 'Fija', mutable: 'Mutable' };
                  return (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-indigo-500">
                      <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                        🎭 Polarización Modal Detectada
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        Tienes exceso de energía <strong>{modalityNames[highest]}</strong> ({highCount}) y carencia de <strong>{modalityNames[lowest]}</strong> ({lowCount}).
                      </p>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300">
                        💡 <strong>Trabajo:</strong> {
                          lowest === 'cardinal' ? 'Necesitas desarrollar iniciativa y capacidad de comenzar proyectos.' :
                          lowest === 'fixed' ? 'Necesitas cultivar perseverancia, estabilidad y compromiso.' :
                          'Necesitas desarrollar adaptabilidad, flexibilidad y apertura al cambio.'
                        }
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Aspectos Tensos Dominantes */}
              {chartAnalysis.tensionsCount >= 5 && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">
                    ⚡ Alta Tensión Interna
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    Tienes <strong>{chartAnalysis.tensionsCount} aspectos tensos</strong>. Esto indica fricción interna constante.
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    💡 <strong>Oportunidad:</strong> La tensión genera crecimiento. Aprenderás a transformar conflictos en motores de evolución. Los ejercicios te darán herramientas para integrar estas energías opuestas.
                  </p>
                </div>
              )}

              {/* Sin polarizaciones significativas */}
              {(() => {
                const elementsBalanced = Object.entries(chartAnalysis.dominances.elements)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const modalitiesBalanced = Object.entries(chartAnalysis.dominances.modalities)
                  .sort(([, a], [, b]) => (b as number) - (a as number));
                const elemDiff = (elementsBalanced[0][1] as number) - (elementsBalanced[elementsBalanced.length - 1][1] as number);
                const modDiff = (modalitiesBalanced[0][1] as number) - (modalitiesBalanced[modalitiesBalanced.length - 1][1] as number);
                
                if (elemDiff < 3 && modDiff < 3 && chartAnalysis.tensionsCount < 5) {
                  return (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-green-500 text-center">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✨ Tu carta muestra un balance relativamente equilibrado. Los ejercicios potenciarán tus fortalezas existentes.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </section>

          {/* 5. SÍNTESIS: POR QUÉ ESTOS EJERCICIOS */}
          <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30 rounded-xl p-6 shadow-xl border-2 border-purple-300 dark:border-purple-600">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎯</span>
              <h2 className="text-lg sm:text-xl font-bold text-purple-900 dark:text-white">
                Síntesis: Por Qué Este Plan es Para Ti
              </h2>
            </div>

            <div className="space-y-4">
              {/* Resumen de Áreas Prioritarias */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  🔍 Áreas Prioritarias Detectadas
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {plan.topAreas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      {area}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estas son las áreas que más necesitan atención según tu configuración astrológica.
                </p>
              </div>

              {/* Luna: Centro Emocional */}
              {chartAnalysis.moon && chartAnalysis.moon.stressScore >= 3 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    🌙 Tu Luna Necesita Atención
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    Tu Luna en <strong>{chartAnalysis.moon.sign}</strong> tiene nivel de estrés <strong>{chartAnalysis.moon.stressScore.toFixed(1)}/10</strong>, 
                    con <strong>{chartAnalysis.moon.hardAspects} aspectos tensos</strong>.
                  </p>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>💡 <strong>Trabajo Emocional:</strong></p>
                    <ul className="ml-5 space-y-1 text-xs">
                      <li>• Frecuencias curativas (528 Hz) para calmar el sistema nervioso</li>
                      <li>• Respiración consciente para regular emociones</li>
                      <li>• Meditación lunar para conectar con tu mundo interior sin juicio</li>
                      <li>• Ejercicios de liberación emocional para soltar patrones antiguos</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Balance Elemental */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-amber-500">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                  🔥 Balance Elemental Personalizado
                </h3>
                {(() => {
                  const sortedElements = Object.entries(chartAnalysis.dominances.elements)
                    .sort(([, a], [, b]) => (b as number) - (a as number));
                  const [dominant, domCount] = sortedElements[0];
                  const [lacking, lackCount] = sortedElements[sortedElements.length - 1];
                  const elementNames: Record<string, string> = { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua' };
                  
                  return (
                    <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                      <p>
                        Tienes <strong>{domCount} planetas en {elementNames[dominant]}</strong> (dominante) y solo <strong>{lackCount} en {elementNames[lacking]}</strong> (deficiente).
                      </p>
                      <p className="text-amber-700 dark:text-amber-300">
                        💡 <strong>Estrategia:</strong> Los ejercicios incluyen:
                      </p>
                      <ul className="ml-5 space-y-1 text-xs text-amber-800 dark:text-amber-200">
                        {dominant === 'fire' && <li>• Ejercicios de tierra y agua para anclar tu energía ígnea</li>}
                        {dominant === 'earth' && <li>• Ejercicios de aire y fuego para dinamizar tu naturaleza práctica</li>}
                        {dominant === 'air' && <li>• Ejercicios de tierra y agua para conectarte con tu cuerpo y emociones</li>}
                        {dominant === 'water' && <li>• Ejercicios de fuego y tierra para dar estructura a tu sensibilidad</li>}
                        <li>• Visualizaciones y afirmaciones específicas para el elemento que necesitas desarrollar</li>
                        <li>• Geometría sagrada que equilibra tu configuración única</li>
                      </ul>
                    </div>
                  );
                })()}
              </div>

              {/* Dignidades Débiles */}
              {chartAnalysis.weakDignities.length > 0 && (
                <div className="bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-rose-500">
                  <h3 className="font-bold text-rose-900 dark:text-rose-100 mb-2 flex items-center gap-2">
                    ⚠️ Planetas en Dignidad Débil
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    Tienes <strong>{chartAnalysis.weakDignities.length} planeta(s)</strong> en dignidad débil:
                  </p>
                  <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300 mb-2">
                    {chartAnalysis.weakDignities.map((d, idx) => (
                      <p key={idx}>• <strong>{translatePlanet(d.planet)}</strong> en {translateSign(d.sign)}</p>
                    ))}
                  </div>
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    💡 Estos planetas requieren trabajo consciente. Los ejercicios incluyen técnicas específicas para fortalecer estas energías y transformar sus desafíos en aprendizajes.
                  </p>
                </div>
              )}

              {/* Stelliums */}
              {chartAnalysis.stelliumHouses.length > 0 && (
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg p-3 sm:p-4 border-l-4 border-violet-500">
                  <h3 className="font-bold text-violet-900 dark:text-violet-100 mb-2 flex items-center gap-2">
                    🌟 Concentración Energética (Stellium)
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    Tienes stellium(s) en casa(s): <strong>{chartAnalysis.stelliumHouses.join(', ')}</strong>
                  </p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    💡 Esta concentración indica que estas áreas de vida son CRUCIALES para tu desarrollo. Los ejercicios te ayudarán a integrar y canalizar esta intensidad de forma constructiva.
                  </p>
                </div>
              )}

              {/* Notas adicionales del análisis */}
              {chartAnalysis.notes && chartAnalysis.notes.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    📝 Notas Adicionales
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {chartAnalysis.notes.map((note, idx) => (
                      <li key={idx}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Botón de acción - Móvil optimizado */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/ejercicios')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
            >
              ✨ Volver a Mi Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
