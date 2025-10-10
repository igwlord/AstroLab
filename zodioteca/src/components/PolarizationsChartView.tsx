import React, { useState } from 'react';
import { detectPolarizations, type DetectedPolarization } from '../utils/polarizationDetector';
import type { NatalChart } from '../services/realAstroCalculator';
import PolarizationModal from './PolarizationModal';

interface PolarizationsChartViewProps {
  chart: NatalChart;
}

/**
 * Tarjeta individual de polarización detectada
 */
const PolarizationCard: React.FC<{
  polarization: DetectedPolarization;
  onClick: () => void;
}> = ({ polarization, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gradient-to-br ${polarization.gradient}
        rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl 
        border-2 border-white/20
        hover:scale-105 transition-all duration-300
        cursor-pointer relative overflow-hidden
      `}
    >
      {/* Efecto de brillo de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header: Icono + Nombre */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl md:text-5xl filter drop-shadow-lg">
              {polarization.icon}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {polarization.subject}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 capitalize">
                {polarization.type === 'planet' && '🪐 Polarización Planetaria'}
                {polarization.type === 'sign' && '♈ Stellium de Signo'}
                {polarization.type === 'element' && '🔥 Polarización Elemental'}
                {polarization.type === 'modality' && '⚡ Polarización Modal'}
              </p>
            </div>
          </div>
          
          {/* Badge de intensidad */}
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
            <span className="text-white font-bold text-sm">
              {Math.round(polarization.intensity)}%
            </span>
          </div>
        </div>

        {/* Barra de intensidad */}
        <div className="mb-3 sm:mb-4">
          <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-1000 ease-out"
              style={{ width: `${polarization.intensity}%` }}
            />
          </div>
        </div>

        {/* Motivos (primeros 3) */}
        <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
          {polarization.reasons.slice(0, 3).map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-white/90 text-xs sm:text-sm">
              <span className="text-yellow-300 mt-0.5">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Footer: Chakra + Planetas involucrados */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/20">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-2 py-1 rounded-full">
            <span className="text-xs sm:text-sm">🧘</span>
            <span className="text-xs sm:text-sm text-white font-medium">{polarization.chakra}</span>
          </div>
          
          {polarization.involvedPlanets.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-2 py-1 rounded-full">
              <span className="text-xs sm:text-sm">🪐</span>
              <span className="text-xs sm:text-sm text-white font-medium">
                {polarization.involvedPlanets.length} planetas
              </span>
            </div>
          )}
          
          {polarization.affectedHouses.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-2 py-1 rounded-full">
              <span className="text-xs sm:text-sm">🏠</span>
              <span className="text-xs sm:text-sm text-white font-medium">
                Casas {polarization.affectedHouses.slice(0, 3).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Indicador de "click para más" */}
        <div className="mt-3 text-center text-white/70 text-xs">
          👆 Click para ver detalles e integración
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal de visualización de polarizaciones
 */
export default function PolarizationsChartView({ chart }: PolarizationsChartViewProps) {
  const [selectedPolarization, setSelectedPolarization] = useState<DetectedPolarization | null>(null);
  const polarizations = detectPolarizations(chart);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header explicativo */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 sm:p-5 md:p-6 rounded-xl border-2 border-purple-200 dark:border-purple-700">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-purple-900 dark:text-purple-200 flex items-center gap-2">
          ⚖️ Polarizaciones Detectadas en tu Carta
        </h3>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
          Una <strong>polarización</strong> ocurre cuando un planeta, signo, elemento o modalidad 
          concentra demasiada energía en tu carta natal. Es tu área de mayor desafío... 
          <strong className="text-purple-700 dark:text-purple-300"> y también tu mayor potencial de maestría</strong>.
        </p>
        <div className="bg-white/50 dark:bg-gray-800/50 p-3 sm:p-4 rounded-lg">
          <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            🎯 ¿Qué significa una polarización?
          </h4>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Cuando una energía está <em>polarizada</em>, te llama intensamente. Puede manifestarse como:
          </p>
          <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1 ml-4">
            <li>• <strong>Sombra:</strong> Proyección, rechazo o identificación excesiva con esa energía</li>
            <li>• <strong>Desafío:</strong> Situaciones recurrentes que te confrontan con ese tema</li>
            <li>• <strong>Oportunidad:</strong> Tu mayor campo de crecimiento evolutivo consciente</li>
          </ul>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {polarizations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300">
              {polarizations.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {polarizations.filter(p => p.type === 'planet').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Planetarias</div>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300">
              {polarizations.filter(p => p.type === 'element').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Elementales</div>
          </div>
          
          <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-700 dark:text-cyan-300">
              {Math.round(polarizations[0]?.intensity || 0)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Más intensa</div>
          </div>
        </div>
      )}

      {/* Lista de polarizaciones o mensaje vacío */}
      {polarizations.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {polarizations.map((pol, idx) => (
              <PolarizationCard
                key={`${pol.type}-${pol.subject}-${idx}`}
                polarization={pol}
                onClick={() => setSelectedPolarization(pol)}
              />
            ))}
          </div>

          {/* Mensaje interpretativo al final */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-4 sm:p-5 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
            <h4 className="text-base sm:text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
              💫 Camino de Integración
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Estas polarizaciones no son "malas" ni "buenas". Son <strong>invitaciones evolutivas</strong>. 
              Donde encuentres resistencia, proyección o compulsión, ahí está tu oro personal esperando ser integrado.
              Haz click en cada tarjeta para explorar ejercicios específicos de integración.
            </p>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 p-6 sm:p-8 md:p-10 rounded-xl border-2 border-green-300 dark:border-green-700 text-center">
          <div className="text-5xl sm:text-6xl md:text-7xl mb-4">✨</div>
          <h3 className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-200 mb-3">
            Carta Equilibrada
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Tu carta natal muestra un balance energético notable. No se detectaron polarizaciones significativas,
            lo que sugiere una distribución armónica de energías planetarias, elementos y modalidades.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4">
            Esto no significa ausencia de desafíos, sino que tu trabajo está en áreas más sutiles de integración.
          </p>
        </div>
      )}

      {/* Modal detallado */}
      {selectedPolarization && (
        <PolarizationModal
          isOpen={true}
          onClose={() => setSelectedPolarization(null)}
          polarization={{
            name: selectedPolarization.subject,
            symbol: selectedPolarization.icon,
            description: `Polarización detectada en tu carta natal con intensidad del ${Math.round(selectedPolarization.intensity)}%. ${
              selectedPolarization.affectedHouses.length > 0 
                ? `Afecta las casas: ${selectedPolarization.affectedHouses.join(', ')}.` 
                : ''
            } ${
              selectedPolarization.involvedPlanets.length > 0
                ? `Planetas involucrados: ${selectedPolarization.involvedPlanets.join(', ')}.`
                : ''
            }`,
            example: selectedPolarization.reasons.join(' • '),
            shadows: selectedPolarization.shadow,
            integration: selectedPolarization.integration,
            color: selectedPolarization.color,
            chakra: selectedPolarization.chakra,
            frequency: selectedPolarization.frequency,
            category: 'example',
            sacredGeometry: selectedPolarization.sacredGeometry,
            geometryPurpose: selectedPolarization.geometryPurpose
          }}
        />
      )}
    </div>
  );
}
