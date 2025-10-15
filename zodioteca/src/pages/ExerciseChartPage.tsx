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
import AccordionSection from '../components/AccordionSection';
import { 
  getMoonStressExplanation,
  getNodeNorthExplanation,
  getNodeNorthDirection,
  getNodeSouthTalents,
  getNodeSouthPatterns,
  getNodeSouthTrap,
  getNodesIntegration,
  getChironWoundBySign,
  getChironManifestationByHouse,
  getChironGift,
  getChironHealingPath,
  getLilithRepressionBySign,
  getLilithManifestationByHouse,
  getLilithPowerExpression,
  getLilithRepressionSigns,
  getLilithIntegrationWork,
  getHouseExplanation,
  aspectNames,
  getMercuryManifestationBySign,
  getMercuryRetrogradeImpact,
  getVenusRelationshipStyle,
  getMarsActionStyle,
  getJupiterManifestationBySign,
  getSaturnManifestationBySign,
  getUranusManifestationBySign,
  getNeptuneManifestationBySign,
  getPlutoManifestationBySign
} from '../utils/interpretationHelpers';

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

        {/* Content - Con Acordeones */}
        <div className="space-y-4">
          {/* 1. CONFIGURACIÓN ELEMENTAL Y MODAL */}
          <AccordionSection 
            title="Tu Configuración Base" 
            icon="⭐" 
            defaultOpen={true}
          >
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
          </AccordionSection>

          {/* 2. ANÁLISIS DE PLANETAS */}
          <AccordionSection 
            title="Análisis de Planetas" 
            icon="📊" 
            defaultOpen={false}
          >

            <div className="space-y-4">
              {/* 🌙 LUNA - ANÁLISIS PROFUNDO */}
              {chartAnalysis.moon && (() => {
                const moonStressAnalysis = chartAnalysis.moon.aspects 
                  ? getMoonStressExplanation(chartAnalysis.moon.aspects)
                  : { level: 'medio' as const, explanation: 'Análisis no disponible', factors: [] };
                
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 sm:p-5 border-l-4 border-blue-500 space-y-4">
                    {/* Título y configuración básica */}
                    <div className="flex items-start gap-3">
                      <span className="text-2xl sm:text-3xl">🌙</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">
                          Tu Luna en {translateSign(chartAnalysis.moon.sign)} - Casa {chartAnalysis.moon.house}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          Tu mundo emocional, necesidades y seguridad interna
                        </p>
                      </div>
                    </div>

                    {/* Nivel de Estrés con Explicación */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Nivel de Estrés Emocional:
                        </span>
                        <span className={`text-sm font-bold px-2 py-1 rounded ${
                          moonStressAnalysis.level === 'crítico' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          moonStressAnalysis.level === 'alto' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                          moonStressAnalysis.level === 'medio' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {chartAnalysis.moon.stressScore.toFixed(1)}/10 - {moonStressAnalysis.level.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Barra visual */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            moonStressAnalysis.level === 'crítico' ? 'bg-red-500' :
                            moonStressAnalysis.level === 'alto' ? 'bg-orange-500' :
                            moonStressAnalysis.level === 'medio' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(chartAnalysis.moon.stressScore / 10) * 100}%` }}
                        />
                      </div>

                      {/* Explicación del nivel */}
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        {moonStressAnalysis.explanation}
                      </p>

                      {/* Factores que contribuyen */}
                      {moonStressAnalysis.factors.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            ⚡ Factores que contribuyen:
                          </p>
                          {moonStressAnalysis.factors.map((factor, idx) => (
                            <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 pl-3">
                              • {factor}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Aspectos Lunares Detallados */}
                    {chartAnalysis.moon.aspects && chartAnalysis.moon.aspects.length > 0 && (
                      <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                          🔗 Aspectos de tu Luna:
                        </h4>
                        <div className="space-y-2">
                          {chartAnalysis.moon.aspects.map((aspect, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded ${
                              aspect.isHard 
                                ? 'bg-red-50 dark:bg-red-900/20 border-l-2 border-red-500' 
                                : 'bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500'
                            }`}>
                              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                {aspect.isHard ? '⚡' : '✨'} Luna {aspectNames[aspect.type] || aspect.type} {translatePlanet(aspect.planet)}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Orbe: {aspect.orb.toFixed(1)}° • {aspect.isHard ? 'Genera tensión emocional' : 'Apoya tu mundo interno'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Casa y Dignidad */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          🏠 Área de Vida (Casa {chartAnalysis.moon.house}):
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {getHouseExplanation(chartAnalysis.moon.house).split(':')[1] || 'Área específica de experiencia'}
                        </p>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          👑 Dignidad:
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {chartAnalysis.moon.dignity.type === 'domicile' ? '🏠 Domicilio - Fluye naturalmente' :
                           chartAnalysis.moon.dignity.type === 'exaltation' ? '⭐ Exaltación - En su máximo poder' :
                           chartAnalysis.moon.dignity.type === 'detriment' ? '⚠️ Detrimento - Requiere esfuerzo' :
                           chartAnalysis.moon.dignity.type === 'fall' ? '⚡ Caída - Necesita trabajo profundo' :
                           '➖ Neutra - Funcionamiento estándar'}
                        </p>
                      </div>
                    </div>

                    {/* Trabajo específico */}
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-2">
                        💡 Esto significa para ti:
                      </p>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                        Con Luna en {translateSign(chartAnalysis.moon.sign)}, tus necesidades emocionales están conectadas con {
                          chartAnalysis.moon.sign === 'Aries' ? 'independencia y acción directa' :
                          chartAnalysis.moon.sign === 'Taurus' ? 'estabilidad y placer sensorial' :
                          chartAnalysis.moon.sign === 'Gemini' ? 'variedad mental y comunicación' :
                          chartAnalysis.moon.sign === 'Cancer' ? 'nutrición emocional y hogar' :
                          chartAnalysis.moon.sign === 'Leo' ? 'reconocimiento y expresión creativa' :
                          chartAnalysis.moon.sign === 'Virgo' ? 'orden y servicio útil' :
                          chartAnalysis.moon.sign === 'Libra' ? 'armonía relacional y belleza' :
                          chartAnalysis.moon.sign === 'Scorpio' ? 'profundidad emocional y transformación' :
                          chartAnalysis.moon.sign === 'Sagittarius' ? 'libertad y búsqueda de significado' :
                          chartAnalysis.moon.sign === 'Capricorn' ? 'estructura y logro' :
                          chartAnalysis.moon.sign === 'Aquarius' ? 'individualidad y visión futura' :
                          'compasión y conexión espiritual'
                        }. Los ejercicios lunares del plan te ayudarán a nutrir estas necesidades conscientemente.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Mercurio EXPANDIDO */}
              {chartAnalysis.mercury && (
                <AccordionSection title="Mercurio - Tu Mente y Comunicación" icon="☿" defaultOpen={false}>
                  <div className="space-y-6">
                    {/* CONFIGURACIÓN */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Signo:</span> {chartAnalysis.mercury.sign}
                          {chartAnalysis.mercury.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                              {chartAnalysis.mercury.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               chartAnalysis.mercury.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               chartAnalysis.mercury.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               chartAnalysis.mercury.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Casa:</span> {chartAnalysis.mercury.house}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({getHouseExplanation(chartAnalysis.mercury.house)})
                          </span>
                        </div>
                        {chartAnalysis.mercury.retrograde && (
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-3 rounded mt-2">
                            <div className="font-semibold flex items-center gap-2">
                              ℞ MERCURIO RETRÓGRADO
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CÓMO SE MANIFIESTA */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-xl">🗣️</span>
                        Cómo se manifiesta en tu vida
                      </h4>
                      <div className="space-y-3 text-sm">
                        {(() => {
                          const manifestation = getMercuryManifestationBySign(chartAnalysis.mercury.sign);
                          return (
                            <>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">Comunicación:</div>
                                <div className="text-blue-700 dark:text-blue-200">{manifestation.communication}</div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium text-green-800 dark:text-green-300 mb-1">Aprendizaje:</div>
                                <div className="text-green-700 dark:text-green-200">{manifestation.learning}</div>
                              </div>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium text-purple-800 dark:text-purple-300 mb-1">Procesos Mentales:</div>
                                <div className="text-purple-700 dark:text-purple-200">{manifestation.mentalProcesses}</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* IMPACTO DE RETRÓGRADO */}
                    {chartAnalysis.mercury.retrograde && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">℞</span>
                          Impacto de Mercurio Retrógrado
                        </h4>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                            {getMercuryRetrogradeImpact(true)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TRABAJO ESPECÍFICO */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        Trabajo específico con Mercurio
                      </h4>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Mercurio en <span className="font-medium">{chartAnalysis.mercury.sign}</span> Casa {chartAnalysis.mercury.house} necesita:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                          <li>
                            <span className="font-medium">Expresión consciente:</span> Trabaja tu forma de comunicarte. 
                            {chartAnalysis.mercury.retrograde 
                              ? ' Con Mercurio retrógrado, practica hablar en voz alta antes de situaciones importantes.'
                              : ' Practica escucha activa y claridad en tus palabras.'}
                          </li>
                          <li>
                            <span className="font-medium">Estilo de aprendizaje:</span> Respeta tu forma única de aprender. 
                            No todos aprenden igual. Tu mente funciona de una manera específica.
                          </li>
                          <li>
                            <span className="font-medium">Escritura/Journaling:</span> Mercurio se fortalece escribiendo. 
                            Lleva un diario de pensamientos, escribe sobre tus procesos mentales.
                          </li>
                          <li>
                            <span className="font-medium">Casa {chartAnalysis.mercury.house}:</span> Tu mente trabaja especialmente en el área de {getHouseExplanation(chartAnalysis.mercury.house).toLowerCase()}. 
                            Aquí es donde más necesitas claridad mental y comunicación efectiva.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionSection>
              )}

              {/* VENUS EXPANDIDO */}
              {(() => {
                // Buscar Venus en weakDignities o strongDignities
                const venusWeak = chartAnalysis.weakDignities.find(d => d.planet === 'Venus');
                const venusStrong = chartAnalysis.strongDignities.find(d => d.planet === 'Venus');
                const venusData = venusWeak || venusStrong;
                
                if (!venusData) return null;
                
                return (
                  <AccordionSection title="Venus - Tu Corazón y Valores" icon="♀" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* CONFIGURACIÓN */}
                      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-medium">Signo:</span> {venusData.sign}
                            {venusData.dignity.type !== 'neutral' && (
                              <span className="ml-2 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded">
                                {venusData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                                 venusData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                                 venusData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                                 venusData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">Casa:</span> N/A (dato no disponible)
                          </div>
                        </div>
                      </div>

                      {/* ESTILO RELACIONAL */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">💕</span>
                          Tu estilo relacional y amoroso
                        </h4>
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded">
                          <p className="text-sm text-rose-800 dark:text-rose-200">
                            {getVenusRelationshipStyle(venusData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* VALORES Y PLACER */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">✨</span>
                          Qué valoras y te da placer
                        </h4>
                        <div className="space-y-3 text-sm">
                          {venusData.dignity.type === 'fall' || venusData.dignity.type === 'detriment' ? (
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                              <div className="font-medium text-red-800 dark:text-red-300 mb-1">⚠️ Dignidad débil:</div>
                              <div className="text-red-700 dark:text-red-200">
                                Venus en {venusData.sign} puede sentir que "el amor no fluye" o que "no mereces placer". 
                                Esto NO es cierto - solo necesitas trabajar conscientemente tu autoestima y aprender a recibir.
                              </div>
                            </div>
                          ) : null}
                          {venusData.dignity.type === 'domicile' || venusData.dignity.type === 'exaltation' ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium text-green-800 dark:text-green-300 mb-1">✅ Dignidad fuerte:</div>
                              <div className="text-green-700 dark:text-green-200">
                                Venus en {venusData.sign} fluye naturalmente. Tienes facilidad para atraer amor, belleza y placer. 
                                Tu desafío es no caer en pereza o exceso de comodidad.
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* TRABAJO ESPECÍFICO */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">🎯</span>
                          Trabajo específico con Venus
                        </h4>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Venus en <span className="font-medium">{venusData.sign}</span> necesita:
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>
                              <span className="font-medium">Autoestima consciente:</span> Venus rige tu capacidad de recibir amor. 
                              Trabaja repitiendo: "Merezco amor, belleza y placer en mi vida".
                            </li>
                            <li>
                              <span className="font-medium">Rituales de belleza:</span> Crea un espacio bello en tu hogar. 
                              Flores, velas, música - lo que sea que te nutra estéticamente.
                            </li>
                            <li>
                              <span className="font-medium">Valores claros:</span> Escribe qué valoras realmente en relaciones, trabajo, vida. 
                              Venus en {venusData.sign} tiene valores específicos - conócelos.
                            </li>
                            <li>
                              <span className="font-medium">Placer sin culpa:</span> Permítete disfrutar sin sentirte culpable. 
                              El placer consciente recarga tu energía vital.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* MARTE EXPANDIDO */}
              {(() => {
                // Buscar Marte en weakDignities o strongDignities
                const marsWeak = chartAnalysis.weakDignities.find(d => d.planet === 'Mars' || d.planet === 'Marte');
                const marsStrong = chartAnalysis.strongDignities.find(d => d.planet === 'Mars' || d.planet === 'Marte');
                const marsData = marsWeak || marsStrong;
                
                if (!marsData) return null;
                
                return (
                  <AccordionSection title="Marte - Tu Acción y Deseo" icon="♂" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* CONFIGURACIÓN */}
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-medium">Signo:</span> {marsData.sign}
                            {marsData.dignity.type !== 'neutral' && (
                              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                                {marsData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                                 marsData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                                 marsData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                                 marsData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ESTILO DE ACCIÓN Y ENERGÍA */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">⚔️</span>
                          Tu estilo de acción y manejo de energía
                        </h4>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded">
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            {getMarsActionStyle(marsData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* MANEJO DE RABIA Y CONFLICTO */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">🔥</span>
                          Cómo manejas la rabia y el conflicto
                        </h4>
                        <div className="space-y-3 text-sm">
                          {marsData.dignity.type === 'fall' || marsData.dignity.type === 'detriment' ? (
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                              <div className="font-medium text-red-800 dark:text-red-300 mb-1">⚠️ Dignidad débil - Marte bloqueado:</div>
                              <div className="text-red-700 dark:text-red-200">
                                Marte en {marsData.sign} puede tener dificultades para:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>Expresar rabia de forma sana (puede reprimir o explotar)</li>
                                  <li>Tomar decisiones rápidas (duda, posterga, se paraliza)</li>
                                  <li>Poner límites claros (cede, se victimiza o agrede)</li>
                                  <li>Sostener la acción en el tiempo (empieza pero no termina)</li>
                                </ul>
                                <p className="mt-2 font-medium">
                                  ⚡ Esto NO significa que seas débil - significa que necesitas trabajar conscientemente tu asertividad y tu fuego interior.
                                </p>
                              </div>
                            </div>
                          ) : null}
                          {marsData.dignity.type === 'domicile' || marsData.dignity.type === 'exaltation' ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium text-green-800 dark:text-green-300 mb-1">✅ Dignidad fuerte - Marte potente:</div>
                              <div className="text-green-700 dark:text-green-200">
                                Marte en {marsData.sign} fluye con poder. Tienes:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>Capacidad natural de actuar y decidir</li>
                                  <li>Buena gestión de tu rabia y energía</li>
                                  <li>Valentía para defender tus límites</li>
                                  <li>Fuerza vital abundante</li>
                                </ul>
                                <p className="mt-2 font-medium">
                                  ⚠️ Tu desafío: No caer en agresividad, impulsividad o dominación. Usa tu poder con sabiduría.
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* TRABAJO ESPECÍFICO CON MARTE */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-xl">🎯</span>
                          Trabajo específico con Marte
                        </h4>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Marte en <span className="font-medium">{marsData.sign}</span> necesita:
                          </p>
                          <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>
                              <span className="font-medium">Ejercicio físico regular:</span> Marte ES movimiento. 
                              Si no mueves el cuerpo, la energía se estanca y se convierte en rabia, frustración o depresión.
                            </li>
                            <li>
                              <span className="font-medium">Expresión sana de rabia:</span> NO reprimas. 
                              Grita en un lugar seguro, golpea un cojín, escribe tu rabia. La rabia reprimida enferma.
                            </li>
                            <li>
                              <span className="font-medium">Límites claros:</span> Practica decir "NO" sin culpa. 
                              Marte te protege - si no pones límites, te invaden.
                            </li>
                            <li>
                              <span className="font-medium">Acción decidida:</span> Marte en {marsData.sign} tiene un estilo específico de actuar. 
                              Respeta tu ritmo, pero ACTÚA. La duda mata más que el error.
                            </li>
                            <li>
                              <span className="font-medium">Contacto con tu deseo:</span> ¿Qué quieres de verdad? 
                              Marte es tu capacidad de ir por lo que deseas. Si no sabes qué quieres, estás perdido.
                            </li>
                            {(marsData.dignity.type === 'fall' || marsData.dignity.type === 'detriment') && (
                              <li className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                                <span className="font-medium">⚠️ Trabajo extra por dignidad débil:</span> 
                                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                                  <li>Terapia de gestión de rabia (fundamental)</li>
                                  <li>Artes marciales o boxeo (para encarnar poder)</li>
                                  <li>Práctica de asertividad (role-playing)</li>
                                  <li>Journaling de deseos y miedos</li>
                                </ul>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* ========================================
                  JÚPITER - EXPANSIÓN Y OPTIMISMO
              ======================================== */}
              {(() => {
                const jupiterData = chartAnalysis.weakDignities.find(d => d.planet === 'Jupiter') || 
                                    chartAnalysis.strongDignities.find(d => d.planet === 'Jupiter');
                if (!jupiterData) return null;

                return (
                  <AccordionSection title="Júpiter - Tu Expansión y Fe" icon="♃" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* Configuración */}
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                          ♃ Júpiter en {jupiterData.sign}
                          {jupiterData.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                              {jupiterData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               jupiterData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               jupiterData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               jupiterData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {jupiterData.dignity.description}
                        </p>
                      </div>

                      {/* Manifestación de la expansión */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          🌟 Cómo te expandes y crees:
                        </h4>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getJupiterManifestationBySign(jupiterData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* Trabajo específico según dignidad */}
                      {(jupiterData.dignity.type === 'detriment' || jupiterData.dignity.type === 'fall') && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                            ⚠️ Trabajo con Júpiter débil:
                          </h4>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>• Trabajar el pesimismo y la falta de fe en la vida</li>
                            <li>• Practicar gratitud activa diariamente</li>
                            <li>• Buscar maestros o filosofías que inspiren sentido</li>
                            <li>• Identificar áreas donde te contraes por miedo (no por prudencia)</li>
                          </ul>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-3 font-medium">
                            💡 Tu Júpiter necesita cultivar confianza sin caer en ingenuidad
                          </p>
                        </div>
                      )}

                      {(jupiterData.dignity.type === 'domicile' || jupiterData.dignity.type === 'exaltation') && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                            ✨ Fortalezas de tu Júpiter:
                          </h4>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>✓ Optimismo natural y fe en el proceso de vida</li>
                            <li>✓ Capacidad de ver oportunidades donde otros ven problemas</li>
                            <li>✓ Generosidad innata y deseo de compartir abundancia</li>
                            <li>✓ Conexión con el significado profundo de las experiencias</li>
                          </ul>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
                            ⚠️ Cuidado: No caer en exceso, arrogancia, o promesas sin límites
                          </p>
                        </div>
                      )}

                      {/* Trabajo específico general */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          📋 Trabajo específico con tu Júpiter:
                        </h4>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                          <li><strong>Expansión consciente:</strong> Identifica áreas donde te estancas por miedo vs prudencia real</li>
                          <li><strong>Gratitud práctica:</strong> Escribe 3 cosas por las que estás agradecido cada noche</li>
                          <li><strong>Generosidad sin depleción:</strong> Da desde la abundancia, no desde la carencia</li>
                          <li><strong>Exceso vs Expansión:</strong> Diferencia entre crecer saludablemente y escapar por exceso</li>
                          <li><strong>Fe sin ingenuidad:</strong> Confía en la vida sin ignorar tus responsabilidades</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* ========================================
                  SATURNO - LÍMITES Y ESTRUCTURA
              ======================================== */}
              {(() => {
                const saturnData = chartAnalysis.weakDignities.find(d => d.planet === 'Saturn') || 
                                   chartAnalysis.strongDignities.find(d => d.planet === 'Saturn');
                if (!saturnData) return null;

                return (
                  <AccordionSection title="Saturno - Tus Límites y Disciplina" icon="♄" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* Configuración */}
                      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-lg p-4 border-l-4 border-gray-600">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                          ♄ Saturno en {saturnData.sign}
                          {saturnData.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                              {saturnData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               saturnData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               saturnData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               saturnData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {saturnData.dignity.description}
                        </p>
                      </div>

                      {/* Manifestación de los límites */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          🏔️ Cómo estructuras y limitas:
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getSaturnManifestationBySign(saturnData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* Trabajo específico según dignidad */}
                      {(saturnData.dignity.type === 'detriment' || saturnData.dignity.type === 'fall') && (
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                          <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                            ⚠️ Dificultades con Saturno débil:
                          </h4>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>• Miedo paralizante o rigidez excesiva en esta área</li>
                            <li>• Sentir que "nunca es suficiente" o auto-sabotaje por miedo al éxito</li>
                            <li>• Dificultad para poner límites sanos (muy rígidos o inexistentes)</li>
                            <li>• Autoridad dañina contigo mismo: exceso de crítica o disciplina cruel</li>
                          </ul>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-3 font-medium">
                            💡 Tu trabajo es construir estructura con compasión, no con castigo
                          </p>
                        </div>
                      )}

                      {(saturnData.dignity.type === 'domicile' || saturnData.dignity.type === 'exaltation') && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                            ✨ Fortalezas de tu Saturno:
                          </h4>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                            <li>✓ Disciplina natural y capacidad de comprometerte a largo plazo</li>
                            <li>✓ Límites claros y respeto por las estructuras necesarias</li>
                            <li>✓ Madurez emocional y responsabilidad sin victimización</li>
                            <li>✓ Autoridad genuina ganada con esfuerzo sostenido</li>
                          </ul>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
                            ⚠️ Cuidado: No caer en frialdad emocional, rigidez, o workaholic sin placer
                          </p>
                        </div>
                      )}

                      {/* Trabajo específico general */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          📋 Trabajo específico con tu Saturno:
                        </h4>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                          <li><strong>Límites compasivos:</strong> Practica decir "no" sin culpa y sin agresividad</li>
                          <li><strong>Enfrenta tu miedo al fracaso:</strong> ¿Qué pasaría si realmente fallaras? ¿Es tan terrible?</li>
                          <li><strong>Disciplina sin castigo:</strong> Diferencia entre estructura sana y auto-sabotaje perfeccionista</li>
                          <li><strong>Autoridad interna:</strong> Conviértete en tu propio padre/madre sabio (no crítico)</li>
                          <li><strong>Compromiso a largo plazo:</strong> Elige una meta y sostén el esfuerzo 6 meses mínimo</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* ========================================
                  URANO - REVOLUCIÓN Y LIBERTAD
              ======================================== */}
              {(() => {
                const uranusData = chartAnalysis.weakDignities.find(d => d.planet === 'Uranus') || 
                                   chartAnalysis.strongDignities.find(d => d.planet === 'Uranus');
                if (!uranusData) return null;

                return (
                  <AccordionSection title="Urano - Tu Revolución Interior" icon="♅" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* Configuración */}
                      <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 rounded-lg p-4 border-l-4 border-cyan-500">
                        <h4 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-2">
                          ♅ Urano en {uranusData.sign}
                          {uranusData.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded">
                              {uranusData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               uranusData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               uranusData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               uranusData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {uranusData.dignity.description}
                        </p>
                      </div>

                      {/* Manifestación de la revolución */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          ⚡ Cómo revolucionas y liberas:
                        </h4>
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getUranusManifestationBySign(uranusData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* Alertas sobre cambios súbitos */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                          ⚡ Cambios súbitos y liberación:
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Urano trae cambios drásticos e inesperados en el área de <strong>{uranusData.sign}</strong>. 
                          Estos "rayos" son invitaciones a soltar lo que ya no sirve y abrazar tu autenticidad.
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Los cambios uranianos se sienten como "despertar de un sueño"</li>
                          <li>• Puedes sentir inquietud, rebeldía, o necesidad de escapar de lo convencional</li>
                          <li>• No intentes controlar - fluye con la innovación que te pide nacer</li>
                        </ul>
                      </div>

                      {/* Trabajo específico general */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          📋 Trabajo específico con tu Urano:
                        </h4>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                          <li><strong>Abraza lo impredecible:</strong> Practica soltar control en pequeñas áreas de tu vida</li>
                          <li><strong>Autenticidad radical:</strong> ¿En qué áreas estás viviendo según expectativas ajenas?</li>
                          <li><strong>Rebeldía consciente:</strong> Diferencia entre liberarte genuinamente vs. rebelarte por rebelarte</li>
                          <li><strong>Innovación aplicada:</strong> ¿Cómo puedes aportar cambio positivo en tu comunidad?</li>
                          <li><strong>Libertad con responsabilidad:</strong> Ser libre no significa herir o abandonar compromisos reales</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* ========================================
                  NEPTUNO - DISOLUCIÓN Y ESPIRITUALIDAD
              ======================================== */}
              {(() => {
                const neptuneData = chartAnalysis.weakDignities.find(d => d.planet === 'Neptune') || 
                                    chartAnalysis.strongDignities.find(d => d.planet === 'Neptune');
                if (!neptuneData) return null;

                return (
                  <AccordionSection title="Neptuno - Tu Disolución y Mística" icon="♆" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* Configuración */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                        <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
                          ♆ Neptuno en {neptuneData.sign}
                          {neptuneData.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                              {neptuneData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               neptuneData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               neptuneData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               neptuneData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {neptuneData.dignity.description}
                        </p>
                      </div>

                      {/* Manifestación de la disolución */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          🌊 Cómo disuelves fronteras y conectas:
                        </h4>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getNeptuneManifestationBySign(neptuneData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* Alertas sobre confusión y escapismo */}
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-300 dark:border-red-700">
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                          ⚠️ Riesgos de Neptuno - Confusión y Escapismo:
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Neptuno puede traer confusión, idealización excesiva, o escapismo a través de adicciones (sustancias, personas, fantasías).
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• <strong>Confusión sobre tu identidad</strong> vs la de otros (empatía sin límites)</li>
                          <li>• <strong>Idealización</strong> de personas, situaciones, o creencias (ver lo que quieres ver)</li>
                          <li>• <strong>Escapismo</strong> para evitar dolor (alcohol, drogas, relaciones tóxicas, fantasía)</li>
                          <li>• <strong>Victimización</strong> o martirio sin darte cuenta</li>
                        </ul>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-3 font-medium">
                          💡 Tu trabajo es conectar con lo divino sin perderte en el proceso
                        </p>
                      </div>

                      {/* Trabajo específico general */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          📋 Trabajo específico con tu Neptuno:
                        </h4>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                          <li><strong>Discernimiento espiritual:</strong> No todo lo que se siente "divino" es saludable</li>
                          <li><strong>Compasión con límites:</strong> Puedes sentir el dolor ajeno sin absorberlo o rescatar</li>
                          <li><strong>Arte como canal:</strong> Crea, pinta, escribe, danza - no retengas la energía neptuniana</li>
                          <li><strong>Evita adicciones sutiles:</strong> ¿Usas personas, trabajo, o fantasía para escapar?</li>
                          <li><strong>Meditación con raíces:</strong> Conecta con lo invisible pero mantén los pies en la tierra</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

              {/* ========================================
                  PLUTÓN - TRANSFORMACIÓN Y PODER
              ======================================== */}
              {(() => {
                const plutoData = chartAnalysis.weakDignities.find(d => d.planet === 'Pluto') || 
                                  chartAnalysis.strongDignities.find(d => d.planet === 'Pluto');
                if (!plutoData) return null;

                return (
                  <AccordionSection title="Plutón - Tu Transformación Profunda" icon="♇" defaultOpen={false}>
                    <div className="space-y-6">
                      {/* Configuración */}
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border-l-4 border-red-600">
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                          ♇ Plutón en {plutoData.sign}
                          {plutoData.dignity.type !== 'neutral' && (
                            <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                              {plutoData.dignity.type === 'domicile' ? '🏠 Domicilio' :
                               plutoData.dignity.type === 'exaltation' ? '⭐ Exaltación' :
                               plutoData.dignity.type === 'detriment' ? '⚠️ Detrimento' :
                               plutoData.dignity.type === 'fall' ? '⚡ Caída' : ''}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {plutoData.dignity.description}
                        </p>
                      </div>

                      {/* Manifestación de la transformación */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          🔥 Cómo te transformas y empoderas:
                        </h4>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {getPlutoManifestationBySign(plutoData.sign)}
                          </p>
                        </div>
                      </div>

                      {/* Ciclos de muerte-renacimiento */}
                      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 border border-red-500">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">
                          ☠️ Ciclos de Muerte-Renacimiento:
                        </h4>
                        <p className="text-sm text-gray-300 mb-3">
                          Plutón te lleva a través de crisis profundas que destruyen tu identidad previa 
                          para que renazcas con más poder genuino. Estos procesos son dolorosos pero necesarios.
                        </p>
                        <ul className="text-sm text-gray-300 space-y-1">
                          <li>• <strong>Muerte simbólica:</strong> Algo en ti debe morir para que nazca tu verdadero poder</li>
                          <li>• <strong>Descenso al inframundo:</strong> Enfrentar tus sombras más oscuras (miedos, obsesiones, control)</li>
                          <li>• <strong>Renacimiento:</strong> Emerges con sabiduría, poder, y compasión por el sufrimiento humano</li>
                        </ul>
                        <p className="text-xs text-red-400 mt-3 font-medium">
                          💀 No puedes controlar a Plutón - solo puedes rendirte a la transformación
                        </p>
                      </div>

                      {/* Trabajo específico general */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          📋 Trabajo específico con tu Plutón:
                        </h4>
                        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
                          <li><strong>Trabajo de sombras:</strong> Explora tus partes más oscuras (celos, venganza, control, obsesión)</li>
                          <li><strong>Suelta control:</strong> ¿Qué estás intentando controlar por miedo a perder?</li>
                          <li><strong>Poder sin dominación:</strong> Diferencia entre empoderarte vs controlar/manipular a otros</li>
                          <li><strong>Acepta las crisis:</strong> Las pérdidas plutonianas son portales a tu verdadero poder</li>
                          <li><strong>Compasión por la oscuridad:</strong> Todos tenemos sombra - la tuya te hace humano y sabio</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionSection>
                );
              })()}

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
          </AccordionSection>

          {/* 2. NODOS LUNARES - PROPÓSITO EVOLUTIVO */}
          {chartAnalysis.nodes && (
            <AccordionSection
              title="Nodos Lunares - Tu Camino Evolutivo"
              icon="🧭"
              defaultOpen={false}
            >
              <div className="space-y-5">
                {/* Introducción */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Los Nodos Lunares representan <strong>tu propósito evolutivo</strong>. El <strong>Nodo Sur</strong> son tus talentos innatos (lo que ya dominas), 
                    pero quedarte ahí te estanca. El <strong>Nodo Norte</strong> es tu destino, lo que vienes a desarrollar en esta vida.
                  </p>
                </div>

                {/* Nodo Norte - Destino */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">⬆️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                        Nodo Norte en {translateSign(chartAnalysis.nodes.north.sign)} - Casa {chartAnalysis.nodes.north.house}
                      </h3>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                        🎯 Tu destino evolutivo - Lo que vienes a desarrollar
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Qué representa */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        📖 Qué representa:
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {getNodeNorthExplanation(chartAnalysis.nodes.north.sign)}
                      </p>
                    </div>

                    {/* Área de vida */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        🏠 En Casa {chartAnalysis.nodes.north.house}:
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {getNodeNorthDirection(chartAnalysis.nodes.north.sign, chartAnalysis.nodes.north.house)}
                      </p>
                    </div>

                    {/* Llamado a la acción */}
                    <div className="bg-green-100 dark:bg-green-900/30 rounded p-3">
                      <p className="text-xs font-bold text-green-900 dark:text-green-100 mb-1">
                        💡 Tu trabajo evolutivo:
                      </p>
                      <p className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
                        Este camino puede sentirse incómodo porque son cualidades que AÚN NO dominas. 
                        Pero precisamente por eso estás aquí: para desarrollarlas. Los ejercicios te guiarán hacia este norte.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nodo Sur - Zona de Confort */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border-l-4 border-amber-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">⬇️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                        Nodo Sur en {translateSign(chartAnalysis.nodes.south.sign)} - Casa {chartAnalysis.nodes.south.house}
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                        🎁 Tus dones pasados - Tu zona de confort
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Talentos */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                        ✨ Talentos innatos que ya tienes:
                      </p>
                      <ul className="space-y-1">
                        {getNodeSouthTalents(chartAnalysis.nodes.south.sign).map((talent, idx) => (
                          <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                            • {talent}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Patrones a soltar */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                        ⚠️ Patrones que ya no te sirven:
                      </p>
                      <ul className="space-y-1">
                        {getNodeSouthPatterns(chartAnalysis.nodes.south.sign).map((pattern, idx) => (
                          <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                            • {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Trampa kármica */}
                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded p-3">
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-100 mb-1">
                        🚨 La trampa kármica:
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                        {getNodeSouthTrap(chartAnalysis.nodes.south.sign)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integración */}
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    🌓 Integración de los Nodos
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {getNodesIntegration(chartAnalysis.nodes)}
                  </p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* 3. QUIRÓN - HERIDA SANADORA */}
          {chartAnalysis.chiron && (
            <AccordionSection
              title="Quirón - Tu Herida Sanadora"
              icon="⚕️"
              defaultOpen={false}
            >
              <div className="space-y-5">
                {/* Introducción */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>Quirón</strong> representa tu <strong>herida arquetípica profunda</strong>. Es el dolor que llevas, 
                    pero también tu <strong>medicina más poderosa</strong>. Una vez que trabajas conscientemente esta herida, 
                    se convierte en tu don para sanar a otros.
                  </p>
                </div>

                {/* Configuración de Quirón */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">⚕️</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                        Quirón en {translateSign(chartAnalysis.chiron.sign)} - Casa {chartAnalysis.chiron.house}
                      </h3>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Grado: {chartAnalysis.chiron.degree.toFixed(1)}° • Dignidad: {
                          chartAnalysis.chiron.dignity?.type === 'domicile' ? '🏠 Domicilio' :
                          chartAnalysis.chiron.dignity?.type === 'exaltation' ? '⭐ Exaltación' :
                          chartAnalysis.chiron.dignity?.type === 'detriment' ? '⚠️ Detrimento' :
                          chartAnalysis.chiron.dignity?.type === 'fall' ? '⚡ Caída' :
                          '➖ Neutra'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* La herida */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        💔 Tu herida específica:
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        {getChironWoundBySign(chartAnalysis.chiron.sign)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {getChironManifestationByHouse(chartAnalysis.chiron.house)}
                      </p>
                    </div>

                    {/* Aspectos con Quirón */}
                    {chartAnalysis.chiron.aspects && chartAnalysis.chiron.aspects.length > 0 && (
                      <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                          🔗 Aspectos que intensifican la herida:
                        </p>
                        <div className="space-y-1">
                          {chartAnalysis.chiron.aspects.map((aspect, idx) => (
                            <p key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                              • {translatePlanet(aspect.planet)} {aspectNames[aspect.type] || aspect.type} Quirón (orbe {aspect.orb.toFixed(1)}°)
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* El don */}
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-3">
                      <p className="text-xs font-bold text-purple-900 dark:text-purple-100 mb-1">
                        🎁 Tu medicina (cuando sanas):
                      </p>
                      <p className="text-xs text-purple-800 dark:text-purple-200 leading-relaxed whitespace-pre-line">
                        {getChironGift(chartAnalysis.chiron.sign, chartAnalysis.chiron.house)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Camino de sanación */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border-l-4 border-green-500">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    🌱 Camino de Sanación
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {getChironHealingPath(chartAnalysis.chiron.sign, chartAnalysis.chiron.house)}
                  </p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* 4. LILITH - SOMBRA Y PODER REPRIMIDO */}
          {chartAnalysis.lilith && (
            <AccordionSection
              title="Lilith Negra - Tu Poder Salvaje"
              icon="🌑"
              defaultOpen={false}
            >
              <div className="space-y-5">
                {/* Introducción */}
                <div className="bg-gradient-to-r from-gray-900 to-purple-900 dark:from-gray-800 dark:to-purple-800 rounded-lg p-4 border-l-4 border-purple-600 text-white">
                  <p className="text-sm leading-relaxed">
                    <strong>Lilith</strong> representa tu <strong>poder femenino reprimido</strong>, tu sexualidad profunda 
                    y tu rebeldía auténtica. Es la parte de ti que te enseñaron a esconder, pero que contiene 
                    <strong> tu fuerza más salvaje y genuina</strong>.
                  </p>
                </div>

                {/* Configuración de Lilith */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">🌑</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                        Lilith en {translateSign(chartAnalysis.lilith.sign)} - Casa {chartAnalysis.lilith.house}
                      </h3>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Grado: {chartAnalysis.lilith.degree.toFixed(1)}°
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* La represión */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        🔒 Qué fue reprimido en ti:
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        {getLilithRepressionBySign(chartAnalysis.lilith.sign)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {getLilithManifestationByHouse(chartAnalysis.lilith.house)}
                      </p>
                    </div>

                    {/* Señales de represión */}
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                        🚨 Señales de que Lilith está reprimida:
                      </p>
                      <div className="space-y-1">
                        {getLilithRepressionSigns().map((sign, idx) => (
                          <p key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                            {sign}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Aspectos de Lilith */}
                    {chartAnalysis.lilith.aspects && chartAnalysis.lilith.aspects.length > 0 && (
                      <div className="bg-white/50 dark:bg-gray-800/30 rounded p-3">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                          🔗 Dinámicas de tu sombra:
                        </p>
                        <div className="space-y-1">
                          {chartAnalysis.lilith.aspects.map((aspect, idx) => (
                            <p key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                              • Lilith {aspectNames[aspect.type] || aspect.type} {translatePlanet(aspect.planet)} (orbe {aspect.orb.toFixed(1)}°)
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* El poder integrado */}
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-3">
                      <p className="text-xs font-bold text-purple-900 dark:text-purple-100 mb-1">
                        🔥 Tu poder integrado:
                      </p>
                      <p className="text-xs text-purple-800 dark:text-purple-200 leading-relaxed">
                        {getLilithPowerExpression(chartAnalysis.lilith.sign)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trabajo de integración */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 border-l-4 border-pink-500">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    🔓 Trabajo de Liberación
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {getLilithIntegrationWork(chartAnalysis.lilith.sign, chartAnalysis.lilith.house)}
                  </p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* 5. DIGNIDADES PLANETARIAS */}
          <AccordionSection
            title="Dignidades Planetarias"
            icon="👑"
            defaultOpen={false}
            count={chartAnalysis.strongDignities.length + chartAnalysis.weakDignities.length}
          >
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
          </AccordionSection>

          {/* 6. STELLIUMS Y CONCENTRACIONES */}
          {chartAnalysis.stelliumHouses.length > 0 && (
            <AccordionSection
              title="Stelliums - Concentraciones de Energía"
              icon="🌟"
              defaultOpen={false}
              count={chartAnalysis.stelliumHouses.length}
            >
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
            </AccordionSection>
          )}

          {/* 7. POLARIZACIONES Y DESBALANCES */}
          <AccordionSection
            title="Polarizaciones y Desbalances"
            icon="⚖️"
            defaultOpen={false}
          >
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
          </AccordionSection>

          {/* 8. SÍNTESIS: POR QUÉ ESTOS EJERCICIOS */}
          <AccordionSection
            title="Síntesis: Por Qué Este Plan es Para Ti"
            icon="🎯"
            defaultOpen={false}
          >
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30 rounded-xl p-6 border-2 border-purple-300 dark:border-purple-600">
              <div className="space-y-4 sm:space-y-6">
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
            </div>
          </AccordionSection>

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
