/**
 * PÁGINA: GUÍA DE EJERCICIOS
 * Anteriormente: WelcomeExercisesModal
 * 
 * Muestra la guía completa de cómo usar el sistema de ejercicios
 */

import { useNavigate } from 'react-router-dom';

export default function ExerciseGuidePage() {
  const navigate = useNavigate();

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

          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 text-white text-center mb-6">
            <span className="text-4xl mb-2 block">📖</span>
            <h1 className="text-2xl font-bold mb-1">
              Guía de Ejercicios
            </h1>
            <p className="text-white/90 text-sm">
              Todo lo que necesitas saber para aprovechar tu plan
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* ¿Qué son los Ejercicios Holísticos? */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌟</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                ¿Qué son los Ejercicios Holísticos?
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Son prácticas personalizadas que integran tu configuración astrológica con técnicas probadas de:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🎵</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  Frecuencias Curativas
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  528 Hz (amor), 432 Hz (tierra), 174 Hz (dolor), etc. Cada frecuencia tiene un propósito específico según tu carta.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl mb-2">🧘</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  Meditación & Mindfulness
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Técnicas de respiración, visualización y presencia adaptadas a tus necesidades emocionales.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="text-2xl mb-2">💫</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  Trabajo Energético
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Balance de chakras, limpieza áurica y armonización de meridianos según tu configuración planetaria.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-2xl mb-2">✍️</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">
                  Journaling Consciente
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Escritura reflexiva para procesar emociones y clarificar pensamientos según tu Mercurio y Luna.
                </p>
              </div>
            </div>
          </section>

          {/* Cómo Usar Tu Plan */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Cómo Usar Tu Plan
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    Sigue el Orden de las Fases
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    El plan está dividido en 3 fases progresivas (1-7, 8-14, 15-21 días). Cada fase prepara tu sistema nervioso para la siguiente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    Dedica el Tiempo Recomendado
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Cada ejercicio tiene una duración estimada. No necesitas hacerlos todos el mismo día, pero la constancia es clave.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    Marca como Completado
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Usa el checkbox para trackear tu progreso. Esto activa tu racha diaria y te motiva a continuar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400 font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    Guarda Tu Plan
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Puedes guardar múltiples planes para diferentes cartas natales y retomarlos cuando quieras.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Consejos para Máximo Resultado */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Consejos para Máximo Resultado
              </h2>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  🕐 Mejor Momento del Día
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Mañana:</strong> Meditación, afirmaciones, respiración<br />
                  <strong>Noche:</strong> Frecuencias curativas, journaling, relajación
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  🎧 Usa Audífonos
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Las frecuencias curativas funcionan mejor con audífonos para una experiencia inmersiva.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  📝 Lleva un Diario
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Registra tus cambios diarios. Muchas transformaciones son sutiles al principio pero significativas al final.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  🔄 Repite Si Es Necesario
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Si sientes que necesitas más tiempo en una fase, repítela. Tu cuerpo sabe lo que necesita.
                </p>
              </div>
            </div>
          </section>

          {/* Preguntas Frecuentes */}
          <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">❓</span>
              <h2 className="text-lg font-bold text-purple-900 dark:text-white">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-3">
              <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <summary className="font-bold text-gray-900 dark:text-white text-sm cursor-pointer">
                  ¿Qué pasa si me salto un día?
                </summary>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  No pasa nada. Lo importante es retomar. La neuroplasticidad funciona con consistencia, no perfección.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <summary className="font-bold text-gray-900 dark:text-white text-sm cursor-pointer">
                  ¿Puedo hacer varios ejercicios juntos?
                </summary>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Sí, de hecho es recomendado. Por ejemplo: 5 min de respiración + 10 min de frecuencias + 5 min de meditación.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <summary className="font-bold text-gray-900 dark:text-white text-sm cursor-pointer">
                  ¿Cuándo veré resultados?
                </summary>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Los primeros cambios sutiles aparecen en 3-5 días. Los cambios significativos después de 14-21 días de práctica constante.
                </p>
              </details>

              <details className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <summary className="font-bold text-gray-900 dark:text-white text-sm cursor-pointer">
                  ¿Puedo generar un nuevo plan?
                </summary>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Sí, pero te recomendamos completar el actual primero. Cada plan está diseñado para 21 días específicos.
                </p>
              </details>
            </div>
          </section>

          {/* Botón de acción */}
          <div className="text-center">
            <button
              onClick={() => navigate('/ejercicios')}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              ✨ Ir a Mi Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
