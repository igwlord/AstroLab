/**
 * PÁGINA: TU CARTA (Ejercicios)
 * Anteriormente: ExercisePlanInsightsModal
 * 
 * Muestra el análisis completo de la carta natal y por qué se generó el plan específico
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

  // Determinar color del plan según áreas prioritarias
  const planColor = plan.topAreas.some(area => area.toLowerCase().includes('luna'))
    ? '#60A5FA'
    : plan.topAreas.some(area => area.toLowerCase().includes('mercurio'))
    ? '#FBBF24'
    : plan.topAreas.some(area => area.toLowerCase().includes('marte'))
    ? '#EF4444'
    : '#A855F7';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ejercicios')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm mb-4"
          >
            ← Volver a Ejercicios
          </button>

          <div
            className="rounded-xl p-6 text-white mb-6"
            style={{
              background: `linear-gradient(135deg, ${planColor}ee, ${planColor}99)`,
            }}
          >
            <div className="text-center">
              <span className="text-4xl mb-2 block">🔮</span>
              <h1 className="text-2xl font-bold mb-1">
                Tu Carta Natal Analizada
              </h1>
              <p className="text-white/90 text-sm">
                Configuración astrológica única de tu plan
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Tu Configuración Astrológica */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⭐</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Tu Configuración Astrológica
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Elementos Dominantes */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
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
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
                  {(() => {
                    const dominant = Object.entries(chartAnalysis.dominances.elements)
                      .sort(([, a], [, b]) => (b as number) - (a as number))[0][0];
                    
                    return dominant === 'fire' ? 
                      '🔥 Fuego dominante: Pasión y acción. Los ejercicios canalizarán esta energía.' :
                      dominant === 'earth' ?
                      '🌍 Tierra dominante: Practicidad. Los ejercicios te conectarán con lo sutil.' :
                      dominant === 'air' ?
                      '💨 Aire dominante: Mentalidad. Los ejercicios te anclarán al cuerpo.' :
                      '💧 Agua dominante: Emoción. Los ejercicios te darán estructura.';
                  })()}
                </p>
              </div>

              {/* Modalidades Dominantes */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
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
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
                  {(() => {
                    const dominant = Object.entries(chartAnalysis.dominances.modalities)
                      .sort(([, a], [, b]) => (b as number) - (a as number))[0][0];
                    
                    return dominant === 'cardinal' ?
                      '⚡ Cardinal dominante: Inicias pero no terminas. Los ejercicios dan constancia.' :
                      dominant === 'fixed' ?
                      '🔒 Fijo dominante: Resistente al cambio. Los ejercicios dan flexibilidad.' :
                      '🔄 Mutable dominante: Disperso. Los ejercicios dan enfoque.';
                  })()}
                </p>
              </div>
            </div>
          </section>

          {/* Análisis de Planetas */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Análisis de Planetas
              </h2>
            </div>

            <div className="space-y-4">
              {/* Luna - SIEMPRE visible */}
              {chartAnalysis.moon && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌙</span>
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
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
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
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {chartAnalysis.harmoniesCount}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    ✨ Aspectos Armónicos
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Por Qué Estos Ejercicios */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Por Qué Estos Ejercicios
              </h2>
            </div>

            <div className="space-y-3">
              {/* Basado en Luna */}
              {chartAnalysis.moon && chartAnalysis.moon.stressScore >= 3 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                    🌙 Basado en tu Luna
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tu Luna en <strong>{chartAnalysis.moon.sign}</strong> con nivel de estrés <strong>{chartAnalysis.moon.stressScore.toFixed(1)}/10</strong> necesita:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-700 dark:text-gray-300 ml-4">
                    <li>• Frecuencias curativas (528 Hz) para calmar emociones</li>
                    <li>• Respiración consciente para regular el sistema nervioso</li>
                    <li>• Meditación lunar para conectar sin juzgar</li>
                  </ul>
                </div>
              )}

              {/* Basado en balance elemental */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  🔥 Basado en tu balance elemental
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {(() => {
                    const dominantElement = Object.entries(chartAnalysis.dominances.elements)
                      .sort(([, a], [, b]) => (b as number) - (a as number))[0];
                    const [element, count] = dominantElement;
                    
                    return `Tienes ${count} planetas en ${
                      element === 'fire' ? 'Fuego 🔥 - Incluimos ejercicios de tierra y agua para balance' :
                      element === 'earth' ? 'Tierra 🌍 - Incluimos ejercicios de aire y fuego para dinamismo' :
                      element === 'air' ? 'Aire 💨 - Incluimos ejercicios de tierra y agua para anclaje' :
                      'Agua 💧 - Incluimos ejercicios de fuego y tierra para estructura'
                    }`;
                  })()}
                </p>
              </div>
            </div>
          </section>

          {/* Botón de acción */}
          <div className="text-center">
            <button
              onClick={() => navigate('/ejercicios')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              ✨ Volver a Mi Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
