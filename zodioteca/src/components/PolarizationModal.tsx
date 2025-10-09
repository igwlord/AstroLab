import React from 'react';
import type { Polarization } from '../types/polarization';
import StandardModal from './StandardModal';
import FrequencyBadge from './FrequencyBadge';

interface PolarizationModalProps {
  polarization: Polarization | null;
  isOpen: boolean;
  onClose: () => void;
}

const PolarizationModal: React.FC<PolarizationModalProps> = ({ polarization, isOpen, onClose }) => {
  if (!isOpen || !polarization) return null;

  const getPolarizationGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Polarización por Planeta': 'from-indigo-600 to-purple-700',
      'Polarización por Signo': 'from-blue-600 to-indigo-700',
      'Polarización por Elemento': 'from-red-500 to-orange-600',
      'Polarización por Modalidad': 'from-yellow-500 to-amber-600',
      'Neptuno Polarizado': 'from-violet-600 to-purple-700',
      'Saturno Polarizado': 'from-gray-800 to-gray-900',
      'Marte Polarizado': 'from-red-600 to-rose-700',
      'Venus Polarizado': 'from-pink-500 to-rose-600'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const gradient = getPolarizationGradient(polarization.name);

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={polarization.name}
      subtitle="Polarización Astrológica"
      icon={polarization.symbol}
      gradientColors={gradient}
    >
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 modal-content">
          {/* Descripción */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              📖 Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 modal-text">
              {polarization.description}
            </p>
          </div>

          {/* Ejemplo */}
          <div className={`bg-gradient-to-r ${gradient} bg-opacity-10 p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              💡 Ejemplo
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {polarization.example}
            </p>
          </div>

          {/* Sombras */}
          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
              🌑 Sombras
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {polarization.shadows}
            </p>
          </div>

          {/* Integración */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">
              ⚖️ Camino de Integración
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {polarization.integration}
            </p>
          </div>

          {/* Ejercicios Prácticos */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300 flex items-center gap-2">
              🧘‍♀️ Ejercicio de Integración Holística
            </h3>
            <div className="space-y-3">
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                  🎯 Práctica Diaria (5-10 min)
                </h4>
                <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 ml-4 list-decimal">
                  <li>
                    <strong>Reconocimiento:</strong> Identifica cuándo esta energía se activa en tu día. 
                    ¿En qué situaciones aparece la sombra?
                  </li>
                  <li>
                    <strong>Pausa consciente:</strong> Antes de reaccionar desde el patrón polarizado, 
                    respira profundamente 3 veces.
                  </li>
                  <li>
                    <strong>Elección consciente:</strong> Pregúntate: "¿Qué haría la energía opuesta/complementaria aquí?"
                  </li>
                </ol>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                  🌬️ Respiración Balanceadora
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  • <strong>Inhala</strong> visualizando el color de esta energía polarizada<br/>
                  • <strong>Retén</strong> el aire 3 segundos sintiendo la integración<br/>
                  • <strong>Exhala</strong> visualizando luz dorada de equilibrio<br/>
                  • Repite 7 veces, preferiblemente por la mañana
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                  📝 Journaling de Integración
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Escribe cada noche: <em>"¿Dónde vi esta energía hoy? ¿Cómo la expresé? 
                  ¿Qué aprendí?"</em> Esto desarrolla consciencia y acelera la integración.
                </p>
              </div>
            </div>
          </div>

          {/* Geometría Sagrada y Trabajo de 21 Días */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
              💎 Geometría Sagrada para tu Integración
            </h3>
            
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg mb-3">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{polarization.symbol}</span>
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                    {polarization.sacredGeometry || polarization.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {polarization.geometryPurpose || 'Integración holística'}
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-500">
                <h5 className="font-semibold text-sm text-yellow-900 dark:text-yellow-200 mb-2">
                  📅 Práctica de 21 Días
                </h5>
                <ol className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-2 ml-4 list-decimal">
                  <li>
                    <strong>Busca la forma</strong> de esta geometría sagrada (puedes buscar en internet 
                    "{polarization.sacredGeometry || polarization.name} geometría sagrada")
                  </li>
                  <li>
                    <strong>Imprímela</strong> en papel o tenla como imagen en tu dispositivo
                  </li>
                  <li>
                    <strong>Durante 21 días:</strong> Medita 5-10 minutos diarios contemplando la geometría. 
                    Visualízala rodeando tu cuerpo mientras respiras profundamente.
                  </li>
                  <li>
                    <strong>Combínala con la frecuencia:</strong> {polarization.frequency} Hz 
                    (disponible en la sección "Frecuencias" de la app)
                  </li>
                  <li>
                    <strong>Observa los cambios:</strong> Registra en un diario cómo te sientes y qué situaciones 
                    cambian en tu vida relacionadas con esta polarización.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Propiedades Holísticas */}
          <div className="modal-grid">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">🧘 Chakra:</span>
                <p className="text-gray-600 dark:text-gray-400">{polarization.chakra}</p>
              </div>
            </div>
          </div>

          {/* Frequency Badge */}
          <FrequencyBadge
            frequency={polarization.frequency + ' Hz'}
            onClose={onClose}
          />
        </div>
    </StandardModal>
  );
};

export default PolarizationModal;
